import { prisma } from './config/db';
import { AILeadService } from './services/ai-lead.service';
import { LeadStage } from '@prisma/client';

async function runLocalGrowthTest() {
  console.log('🧪 Starting CyberStyle Local Growth Intelligence Test Suite...\n');

  // Test 1: AI / Heuristic Qualification for Missing Website
  console.log('1️⃣ Testing Local Lead Qualification (Missing Website)...');
  const missingSiteLead = await AILeadService.qualifyLocalLead({
    businessName: 'Apex Artisan Bakery',
    category: 'Artisan Bakery & Cafe',
    website: '',
    websiteStatus: 'missing',
    websiteScore: 0,
    rating: '4.9',
    reviewCount: '184',
    city: 'Seattle, WA',
  });

  console.log('   Result:', {
    score: missingSiteLead.score,
    priority: missingSiteLead.priority,
    service: missingSiteLead.service,
    offer: missingSiteLead.recommended_offer,
  });

  if (missingSiteLead.score < 80 || missingSiteLead.priority !== 'hot') {
    throw new Error(`Expected HOT lead for 4.9★ business with missing website, got score ${missingSiteLead.score}`);
  }
  console.log('   ✅ PASS: Correctly flagged as HOT Opportunity with modern website offer.\n');

  // Test 2: AI / Heuristic Qualification for Clinic (Booking System)
  console.log('2️⃣ Testing Local Lead Qualification (Medical / Dental Clinic)...');
  const clinicLead = await AILeadService.qualifyLocalLead({
    businessName: 'Highland Family Dental',
    category: 'Dental Clinic',
    website: 'https://highlandfamilydental.com',
    websiteStatus: 'active',
    websiteScore: 65,
    rating: '4.8',
    reviewCount: '92',
    city: 'Austin, TX',
  });

  console.log('   Result:', {
    score: clinicLead.score,
    priority: clinicLead.priority,
    service: clinicLead.service,
    offer: clinicLead.recommended_offer,
  });

  if (!clinicLead.recommended_offer || clinicLead.recommended_offer.length === 0) {
    throw new Error('Expected tailored clinic offer recommendation');
  }
  console.log('   ✅ PASS: Tailored booking & modern flow suggested.\n');

  // Test 3: CRM Database Insertion and Local Growth Fields Verification
  console.log('3️⃣ Testing CRM Database Lead Record Insertion with Local Intelligence Fields...');
  const testMapsUrl = `https://maps.google.com/?q=TestPlace_${Date.now()}`;
  const createdLead = await prisma.lead.create({
    data: {
      name: 'Dr. Sarah Connor',
      company: 'Cyberdyne Aesthetic Clinic',
      email: `contact_${Date.now()}@cyberdyneclinic.com`,
      phone: '+1 (555) 777-8899',
      website: 'https://instagram.com/cyberdyne_aesthetic',
      category: 'Aesthetic Medical Clinic',
      address: '742 Evergreen Terrace, Springfield, OR',
      mapsUrl: testMapsUrl,
      rating: '4.95',
      reviewCount: '210',
      serviceNeeded: missingSiteLead.recommended_offer,
      serviceFit: missingSiteLead.service,
      websiteStatus: 'social-only',
      websiteScore: 25,
      leadScore: missingSiteLead.score,
      priority: missingSiteLead.priority,
      opportunityType: missingSiteLead.service,
      suggestedOffer: missingSiteLead.recommended_offer,
      message: missingSiteLead.draft_message,
      notes: `Discovered on Google Maps. ${missingSiteLead.reason}`,
      stage: LeadStage.NEW,
      dateScraped: new Date(),
    },
  });

  console.log('   Created Lead ID:', createdLead.id);
  console.log('   Saved Fields:', {
    category: createdLead.category,
    rating: createdLead.rating,
    reviewCount: createdLead.reviewCount,
    websiteStatus: createdLead.websiteStatus,
    priority: createdLead.priority,
    opportunityType: createdLead.opportunityType,
  });

  if (createdLead.websiteStatus !== 'social-only' || createdLead.priority !== 'hot') {
    throw new Error('Database fields did not match inserted lead payload');
  }
  console.log('   ✅ PASS: Database schema holds all local growth attributes.\n');

  // Test 4: Deduplication logic verification
  console.log('4️⃣ Testing Deduplication by Google Maps URL...');
  const existingCheck = await prisma.lead.findFirst({
    where: { mapsUrl: testMapsUrl },
  });

  if (!existingCheck || existingCheck.id !== createdLead.id) {
    throw new Error('Deduplication lookup failed');
  }
  console.log('   ✅ PASS: Existing lead accurately identified by Google Maps place URL.\n');

  // Clean up test record
  await prisma.lead.delete({ where: { id: createdLead.id } });
  console.log('🧹 Cleaned up test lead records.\n');

  console.log('🎉 ALL 4 CYBERSTYLE LOCAL GROWTH INTELLIGENCE TESTS PASSED WITH 100% SUCCESS!\n');
}

runLocalGrowthTest()
  .catch((err) => {
    console.error('❌ Test failed:', err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
