require('dotenv').config();
const { Client } = require("pg");

const SQL = `
CREATE TABLE clients (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20),
    company VARCHAR(100),
    position VARCHAR(100),
    
    -- Contact preferences
    contact_method VARCHAR(20) DEFAULT 'email' CHECK (contact_method IN ('email', 'phone', 'whatsapp')),
    newsletter_optin BOOLEAN DEFAULT false,
    
    -- Additional info
    source VARCHAR(50) DEFAULT 'website' CHECK (source IN ('website', 'referral', 'social', 'event', 'other')),
    notes TEXT,
    tags TEXT[] DEFAULT '{}',
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    last_contacted_at TIMESTAMP WITH TIME ZONE,
    
    -- Indexes
    CONSTRAINT valid_email CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$')
);

CREATE INDEX idx_clients_email ON clients(email);
CREATE INDEX idx_clients_company ON clients(company);
CREATE INDEX idx_clients_tags ON clients USING GIN(tags);

CREATE TABLE services (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    
    -- Pricing & Duration
    base_price DECIMAL(10, 2) NOT NULL,
    duration_minutes INTEGER NOT NULL CHECK (duration_minutes > 0),
    currency VARCHAR(3) DEFAULT 'USD',
    is_recurring BOOLEAN DEFAULT false,
    recurrence_interval INTEGER, -- in days, if recurring
    
    -- Categorization
    category VARCHAR(50) NOT NULL,
    subcategory VARCHAR(50),
    tags TEXT[] DEFAULT '{}',
    
    -- Display settings
    color_hex VARCHAR(7) DEFAULT '#3B82F6',
    icon VARCHAR(50),
    sort_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    is_public BOOLEAN DEFAULT true,
    
    -- Availability
    buffer_before INTEGER DEFAULT 0, -- minutes
    buffer_after INTEGER DEFAULT 0, -- minutes
    max_daily_bookings INTEGER DEFAULT 5,
    
    -- Requirements
    requires_consultation BOOLEAN DEFAULT false,
    required_fields JSONB DEFAULT '[]',
    
    -- Metadata
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_services_category ON services(category);
CREATE INDEX idx_services_active ON services(is_active) WHERE is_active = true;


CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Authentication
    email VARCHAR(255) UNIQUE NOT NULL,
    email_verified BOOLEAN DEFAULT false,
    password_hash VARCHAR(255),
    auth_provider VARCHAR(20) DEFAULT 'email' 
        CHECK (auth_provider IN ('email', 'google', 'github', 'linkedin')),
    auth_provider_id VARCHAR(255),
    
    -- Profile
    first_name VARCHAR(50),
    last_name VARCHAR(50),
    avatar_url VARCHAR(500),
    phone VARCHAR(20),
    bio TEXT,
    
    -- Roles & Permissions
    role VARCHAR(20) NOT NULL DEFAULT 'user' 
        CHECK (role IN ('super_admin', 'admin', 'manager', 'staff', 'user')),
    permissions JSONB DEFAULT '[]',
    
    -- Status
    is_active BOOLEAN DEFAULT true,
    is_onboarded BOOLEAN DEFAULT false,
    
    -- Security
    last_login_at TIMESTAMP WITH TIME ZONE,
    last_password_change_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    failed_login_attempts INTEGER DEFAULT 0,
    locked_until TIMESTAMP WITH TIME ZONE,
    
    -- Preferences
    preferences JSONB DEFAULT '{
        "notifications": {
            "email": true,
            "push": true,
            "appointments": true,
            "marketing": false
        },
        "theme": "light",
        "timezone": "UTC"
    }',
    
    -- Metadata
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_active ON users(is_active) WHERE is_active = true;


CREATE TABLE staff_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID UNIQUE REFERENCES users(id) ON DELETE SET NULL,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20),
    job_title VARCHAR(100),
    bio TEXT,
    avatar_url VARCHAR(500),
    
    -- Availability settings
    working_hours JSONB DEFAULT '{
        "monday": {"start": "09:00", "end": "17:00", "available": true},
        "tuesday": {"start": "09:00", "end": "17:00", "available": true},
        "wednesday": {"start": "09:00", "end": "17:00", "available": true},
        "thursday": {"start": "09:00", "end": "17:00", "available": true},
        "friday": {"start": "09:00", "end": "17:00", "available": true},
        "saturday": {"start": "00:00", "end": "00:00", "available": false},
        "sunday": {"start": "00:00", "end": "00:00", "available": false}
    }',
    
    -- Service assignment
    service_ids UUID[] DEFAULT '{}', -- References services.id
    
    -- Status
    is_active BOOLEAN DEFAULT true,
    is_accepting_appointments BOOLEAN DEFAULT true,
    
    -- Contact preferences
    preferred_contact_method VARCHAR(20) DEFAULT 'email',
    
    -- Metadata
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_staff_active ON staff_members(is_active);
CREATE INDEX idx_staff_service_ids ON staff_members USING GIN(service_ids);


CREATE TABLE appointments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Relationships
    client_id UUID REFERENCES clients(id) ON DELETE CASCADE,
    service_id UUID REFERENCES services(id) ON DELETE SET NULL,
    staff_id UUID REFERENCES staff_members(id) ON DELETE SET NULL,
    
    -- Timing
    scheduled_start TIMESTAMP WITH TIME ZONE NOT NULL,
    scheduled_end TIMESTAMP WITH TIME ZONE GENERATED ALWAYS AS 
        (scheduled_start + (duration_minutes || ' minutes')::INTERVAL) STORED,
    duration_minutes INTEGER NOT NULL,
    timezone VARCHAR(50) DEFAULT 'UTC',
    
    -- Status & Details
    status VARCHAR(20) NOT NULL DEFAULT 'pending' 
        CHECK (status IN ('pending', 'confirmed', 'rescheduled', 'cancelled', 'completed', 'no_show')),
    meeting_type VARCHAR(20) DEFAULT 'virtual' 
        CHECK (meeting_type IN ('in_person', 'virtual', 'phone')),
    
    -- Location/Meeting details
    meeting_url VARCHAR(500), -- For virtual meetings
    location_address TEXT, -- For in-person meetings
    
    -- Client provided info
    client_notes TEXT,
    custom_fields JSONB DEFAULT '{}',
    
    -- Internal notes
    internal_notes TEXT,
    cancellation_reason TEXT,
    cancellation_initiated_by VARCHAR(20) CHECK (cancellation_initiated_by IN ('client', 'staff', 'system')),
    
    -- Reminders & Follow-ups
    reminders_sent JSONB DEFAULT '[]', -- Track sent reminders
    follow_up_required BOOLEAN DEFAULT false,
    follow_up_scheduled TIMESTAMP WITH TIME ZONE,
    
    -- Payment
    price DECIMAL(10, 2),
    currency VARCHAR(3) DEFAULT 'USD',
    payment_status VARCHAR(20) DEFAULT 'unpaid' 
        CHECK (payment_status IN ('unpaid', 'pending', 'paid', 'refunded', 'partially_refunded')),
    invoice_id UUID, -- Reference to invoices table
    
    -- Metadata
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    booked_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    confirmed_at TIMESTAMP WITH TIME ZONE,
    cancelled_at TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE,
    
    -- Constraints
    CONSTRAINT valid_duration CHECK (duration_minutes > 0 AND duration_minutes <= 480),
    CONSTRAINT no_overlap_staff EXCLUDE USING gist (
        staff_id WITH =,
        tstzrange(scheduled_start, scheduled_start + (duration_minutes || ' minutes')::INTERVAL) WITH &&
    ) WHERE (status IN ('pending', 'confirmed')),
    CONSTRAINT no_overlap_client EXCLUDE USING gist (
        client_id WITH =,
        tstzrange(scheduled_start, scheduled_start + (duration_minutes || ' minutes')::INTERVAL) WITH &&
    ) WHERE (status IN ('pending', 'confirmed'))
);

-- Indexes for appointments
CREATE INDEX idx_appointments_client ON appointments(client_id);
CREATE INDEX idx_appointments_staff ON appointments(staff_id);
CREATE INDEX idx_appointments_service ON appointments(service_id);
CREATE INDEX idx_appointments_status ON appointments(status);
CREATE INDEX idx_appointments_date ON appointments(scheduled_start);
CREATE INDEX idx_appointments_date_range ON appointments USING btree (DATE(scheduled_start));
CREATE INDEX idx_appointments_upcoming ON appointments(scheduled_start) 
    WHERE scheduled_start > CURRENT_TIMESTAMP AND status IN ('pending', 'confirmed');

CREATE TABLE appointment_slots (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    staff_id UUID REFERENCES staff_members(id) ON DELETE CASCADE,
    service_id UUID REFERENCES services(id) ON DELETE CASCADE,
    
    -- Slot timing
    slot_start TIMESTAMP WITH TIME ZONE NOT NULL,
    slot_end TIMESTAMP WITH TIME ZONE NOT NULL,
    slot_duration_minutes INTEGER NOT NULL,
    
    -- Availability
    max_bookings INTEGER DEFAULT 1,
    current_bookings INTEGER DEFAULT 0,
    is_available BOOLEAN DEFAULT true,
    
    -- Recurrence (if part of recurring schedule)
    recurrence_rule TEXT,
    recurrence_exceptions TIMESTAMP WITH TIME ZONE[],
    
    -- Metadata
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT valid_slot_duration CHECK (slot_duration_minutes > 0),
    CONSTRAINT valid_slot_times CHECK (slot_end > slot_start)
);

CREATE INDEX idx_slots_staff_date ON appointment_slots(staff_id, slot_start);
CREATE INDEX idx_slots_available ON appointment_slots(is_available, slot_start) 
    WHERE is_available = true AND slot_start > CURRENT_TIMESTAMP;



CREATE TABLE projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Basic info
    title VARCHAR(200) NOT NULL,
    slug VARCHAR(200) UNIQUE NOT NULL,
    tagline VARCHAR(300),
    client_id UUID REFERENCES clients(id) ON DELETE SET NULL,
    client_name VARCHAR(100), -- Denormalized for performance
    
    -- Content
    description TEXT,
    full_content JSONB, -- Rich content with sections
    challenge TEXT,
    solution TEXT,
    results TEXT,
    
    -- Categorization
    category VARCHAR(50) NOT NULL,
    subcategories VARCHAR(50)[] DEFAULT '{}',
    tags TEXT[] DEFAULT '{}',
    industries VARCHAR(50)[] DEFAULT '{}',
    
    -- Project details
    start_date DATE,
    end_date DATE,
    project_duration_weeks INTEGER,
    budget_range VARCHAR(50) CHECK (budget_range IN ('small', 'medium', 'large', 'enterprise')),
    
    -- URLs & Links
    live_url VARCHAR(500),
    github_url VARCHAR(500),
    case_study_url VARCHAR(500),
    
    -- Media
    featured_image_url VARCHAR(500),
    gallery_images JSONB DEFAULT '[]', -- Array of {url, alt, caption}
    videos JSONB DEFAULT '[]',
    
    -- Technologies used
    technologies TEXT[] DEFAULT '{}',
    tools TEXT[] DEFAULT '{}',
    
    -- Display settings
    featured BOOLEAN DEFAULT false,
    display_order INTEGER DEFAULT 0,
    is_published BOOLEAN DEFAULT true,
    published_at TIMESTAMP WITH TIME ZONE,
    
    -- Stats
    views_count INTEGER DEFAULT 0,
    shares_count INTEGER DEFAULT 0,
    
    -- SEO
    meta_title VARCHAR(200),
    meta_description TEXT,
    meta_keywords TEXT[],
    
    -- Metadata
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for projects
CREATE INDEX idx_projects_category ON projects(category);
CREATE INDEX idx_projects_featured ON projects(featured) WHERE featured = true;
CREATE INDEX idx_projects_published ON projects(is_published, published_at) 
    WHERE is_published = true;
CREATE INDEX idx_projects_tags ON projects USING GIN(tags);
CREATE INDEX idx_projects_technologies ON projects USING GIN(technologies);
CREATE INDEX idx_projects_client ON projects(client_id);


CREATE TABLE testimonials (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Source
    client_id UUID REFERENCES clients(id) ON DELETE CASCADE,
    project_id UUID REFERENCES projects(id) ON DELETE SET NULL,
    
    -- Content
    content TEXT NOT NULL,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    
    -- Attribution
    author_name VARCHAR(100) NOT NULL,
    author_title VARCHAR(100),
    author_company VARCHAR(100),
    author_avatar_url VARCHAR(500),
    
    -- Display settings
    featured BOOLEAN DEFAULT false,
    display_order INTEGER DEFAULT 0,
    is_approved BOOLEAN DEFAULT false,
    is_public BOOLEAN DEFAULT true,
    
    -- Source
    source VARCHAR(50) DEFAULT 'direct' 
        CHECK (source IN ('direct', 'google', 'linkedin', 'clutch', 'upwork', 'other')),
    source_url VARCHAR(500),
    
    -- Metadata
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    approved_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX idx_testimonials_featured ON testimonials(featured) WHERE featured = true;
CREATE INDEX idx_testimonials_approved ON testimonials(is_approved) WHERE is_approved = true;
CREATE INDEX idx_testimonials_project ON testimonials(project_id);


CREATE TABLE sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    session_token VARCHAR(255) UNIQUE NOT NULL,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    user_agent TEXT,
    ip_address INET,
    device_info JSONB,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_sessions_token ON sessions(session_token);
CREATE INDEX idx_sessions_user ON sessions(user_id);
CREATE INDEX idx_sessions_expires ON sessions(expires_at);



CREATE TABLE invoices (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    invoice_number VARCHAR(50) UNIQUE NOT NULL,
    
    -- Relationships
    client_id UUID REFERENCES clients(id) ON DELETE CASCADE,
    appointment_id UUID REFERENCES appointments(id) ON DELETE SET NULL,
    project_id UUID REFERENCES projects(id) ON DELETE SET NULL,
    
    -- Dates
    issue_date DATE NOT NULL DEFAULT CURRENT_DATE,
    due_date DATE NOT NULL,
    paid_date DATE,
    
    -- Amounts
    subtotal DECIMAL(10, 2) NOT NULL,
    tax_amount DECIMAL(10, 2) DEFAULT 0,
    discount_amount DECIMAL(10, 2) DEFAULT 0,
    total_amount DECIMAL(10, 2) GENERATED ALWAYS AS (subtotal + tax_amount - discount_amount) STORED,
    
    -- Status
    status VARCHAR(20) NOT NULL DEFAULT 'draft' 
        CHECK (status IN ('draft', 'sent', 'viewed', 'paid', 'overdue', 'cancelled', 'refunded')),
    currency VARCHAR(3) DEFAULT 'USD',
    
    -- Payment info
    payment_method VARCHAR(50),
    transaction_id VARCHAR(100),
    notes TEXT,
    
    -- Items (stored as JSON for flexibility)
    items JSONB NOT NULL DEFAULT '[]',
    
    -- Metadata
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT due_after_issue CHECK (due_date >= issue_date)
);

CREATE INDEX idx_invoices_client ON invoices(client_id);
CREATE INDEX idx_invoices_status ON invoices(status);
CREATE INDEX idx_invoices_due_date ON invoices(due_date);
CREATE INDEX idx_invoices_number ON invoices(invoice_number);



CREATE TABLE page_views (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Page info
    page_path VARCHAR(500) NOT NULL,
    page_title VARCHAR(200),
    page_type VARCHAR(50) CHECK (page_type IN ('home', 'portfolio', 'service', 'blog', 'contact', 'other')),
    
    -- Visitor info
    visitor_id UUID,
    session_id UUID,
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    
    -- Technical info
    user_agent TEXT,
    referrer VARCHAR(500),
    ip_address INET,
    country_code VARCHAR(2),
    city VARCHAR(100),
    
    -- Engagement metrics
    time_on_page INTEGER, -- seconds
    scroll_depth INTEGER, -- percentage
    interacted BOOLEAN DEFAULT false,
    
    -- Device info
    device_type VARCHAR(20) CHECK (device_type IN ('desktop', 'mobile', 'tablet')),
    browser_name VARCHAR(50),
    browser_version VARCHAR(50),
    os_name VARCHAR(50),
    
    -- Timestamp
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_page_views_path ON page_views(page_path);
CREATE INDEX idx_page_views_date ON page_views(created_at);
CREATE INDEX idx_page_views_user ON page_views(user_id);
CREATE INDEX idx_page_views_visitor ON page_views(visitor_id);
CREATE INDEX idx_page_views_session ON page_views(session_id);



CREATE TABLE contact_submissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Sender info
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    company VARCHAR(100),
    
    -- Submission details
    subject VARCHAR(200),
    message TEXT NOT NULL,
    inquiry_type VARCHAR(50) NOT NULL 
        CHECK (inquiry_type IN ('general', 'quote', 'support', 'partnership', 'career', 'other')),
    
    -- Project/Service interest
    interested_service_ids UUID[] DEFAULT '{}',
    budget_range VARCHAR(50),
    timeline VARCHAR(50),
    
    -- Status
    status VARCHAR(20) DEFAULT 'new' 
        CHECK (status IN ('new', 'read', 'replied', 'spam', 'archived')),
    assigned_to UUID REFERENCES users(id) ON DELETE SET NULL,
    
    -- Response tracking
    response_sent BOOLEAN DEFAULT false,
    response_sent_at TIMESTAMP WITH TIME ZONE,
    response_notes TEXT,
    
    -- Metadata
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT valid_contact_email CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$')
);

CREATE INDEX idx_contact_email ON contact_submissions(email);
CREATE INDEX idx_contact_status ON contact_submissions(status);
CREATE INDEX idx_contact_type ON contact_submissions(inquiry_type);
CREATE INDEX idx_contact_date ON contact_submissions(created_at);



CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Action info
    action VARCHAR(50) NOT NULL,
    entity_type VARCHAR(50) NOT NULL,
    entity_id UUID,
    
    -- User info
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    user_ip INET,
    user_agent TEXT,
    
    -- Changes
    old_values JSONB,
    new_values JSONB,
    changed_fields TEXT[],
    
    -- Metadata
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_audit_entity ON audit_logs(entity_type, entity_id);
CREATE INDEX idx_audit_user ON audit_logs(user_id);
CREATE INDEX idx_audit_action ON audit_logs(action);
CREATE INDEX idx_audit_date ON audit_logs(created_at);



CREATE TABLE blog_posts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Content
    title VARCHAR(200) NOT NULL,
    slug VARCHAR(200) UNIQUE NOT NULL,
    excerpt TEXT,
    content JSONB NOT NULL,
    featured_image_url VARCHAR(500),
    
    -- Categorization
    category VARCHAR(50) NOT NULL,
    tags TEXT[] DEFAULT '{}',
    
    -- Authorship
    author_id UUID REFERENCES users(id) ON DELETE SET NULL,
    author_name VARCHAR(100), -- Denormalized
    co_author_ids UUID[] DEFAULT '{}',
    
    -- Publication
    is_published BOOLEAN DEFAULT false,
    published_at TIMESTAMP WITH TIME ZONE,
    scheduled_publish_at TIMESTAMP WITH TIME ZONE,
    
    -- SEO
    meta_title VARCHAR(200),
    meta_description TEXT,
    canonical_url VARCHAR(500),
    
    -- Stats
    views_count INTEGER DEFAULT 0,
    likes_count INTEGER DEFAULT 0,
    shares_count INTEGER DEFAULT 0,
    comments_count INTEGER DEFAULT 0,
    read_time_minutes INTEGER,
    
    -- Metadata
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT published_date_check CHECK (
        (is_published = true AND published_at IS NOT NULL) OR 
        (is_published = false AND published_at IS NULL)
    )
);

CREATE INDEX idx_blog_published ON blog_posts(is_published, published_at) 
    WHERE is_published = true;
CREATE INDEX idx_blog_category ON blog_posts(category);
CREATE INDEX idx_blog_tags ON blog_posts USING GIN(tags);
CREATE INDEX idx_blog_author ON blog_posts(author_id);




CREATE TABLE settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Setting identification
    setting_key VARCHAR(100) UNIQUE NOT NULL,
    setting_group VARCHAR(50) NOT NULL 
        CHECK (setting_group IN ('general', 'appointment', 'email', 'payment', 'seo', 'integration')),
    
    -- Value storage (flexible for different types)
    setting_value JSONB NOT NULL,
    setting_type VARCHAR(20) NOT NULL 
        CHECK (setting_type IN ('string', 'number', 'boolean', 'array', 'object')),
    
    -- Metadata
    description TEXT,
    is_public BOOLEAN DEFAULT false,
    is_editable BOOLEAN DEFAULT true,
    
    -- Validation
    validation_rules JSONB,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_settings_key ON settings(setting_key);
CREATE INDEX idx_settings_group ON settings(setting_group);



CREATE TABLE email_templates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Template info
    template_name VARCHAR(100) NOT NULL,
    template_key VARCHAR(100) UNIQUE NOT NULL,
    subject VARCHAR(200) NOT NULL,
    body_html TEXT NOT NULL,
    body_text TEXT,
    
    -- Configuration
    variables JSONB DEFAULT '[]', -- Available template variables
    is_active BOOLEAN DEFAULT true,
    
    -- Categorization
    category VARCHAR(50) NOT NULL 
        CHECK (category IN ('appointment', 'notification', 'marketing', 'transactional', 'system')),
    
    -- Metadata
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_email_templates_key ON email_templates(template_key);
CREATE INDEX idx_email_templates_category ON email_templates(category);



CREATE TABLE integrations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Integration info
    service_name VARCHAR(100) NOT NULL,
    service_type VARCHAR(50) NOT NULL 
        CHECK (service_type IN ('calendar', 'payment', 'email', 'analytics', 'crm', 'storage', 'other')),
    
    -- Configuration
    is_active BOOLEAN DEFAULT false,
    config JSONB NOT NULL, -- Encrypted configuration data
    webhook_url VARCHAR(500),
    webhook_secret VARCHAR(255),
    
    -- Status
    last_synced_at TIMESTAMP WITH TIME ZONE,
    sync_status VARCHAR(20) DEFAULT 'idle' 
        CHECK (sync_status IN ('idle', 'syncing', 'error', 'success')),
    error_message TEXT,
    
    -- Metadata
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_integrations_service ON integrations(service_name);
CREATE INDEX idx_integrations_active ON integrations(is_active) WHERE is_active = true;

`;

async function main() {
  console.log("seeding...");
  const client = new Client({
    connectionString: `postgresql://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`,
  });
  await client.connect();
  await client.query(SQL);
  await client.end();
  console.log("done");
}

main();
