# CyberStyle Local Growth Playbook (v1.0)

A battle-tested operational guide for running outbound market discovery and relationship-first client acquisition using the **CyberStyle Local Growth Assistant** and CYBERSTYLE CRM.

---

## 1. Core Operating Principles

1. **Manual & Thoughtful Inspection**: Never scrape or harvest in bulk. Inspect each business listing on Google Maps individually. Verify that they are actively operating, have positive reviews, and genuinely lack a modern web presence.
2. **Value-First / No Hard Selling**: Never pitch immediately. Offer a short, 2-minute personalized Loom walkthrough or 2–3 specific, practical ideas for improvement.
3. **Strict Human Gate**: All AI-suggested scores and messages must be reviewed and personalized before dispatch.

---

## 2. Niche & Geo-Targeting Matrix

Select 2 niches and 2 target cities for each 2-week sprint:

| Niche Category | Ideal Geo-Profile | High-Value Opportunity Angle | Recommended CyberStyle Solution |
| :--- | :--- | :--- | :--- |
| **Medical / Dental Clinics** | Affluent suburbs & metro areas | Missing online appointment booking; social-only web links | 24/7 Intake Portal & Automated SMS Reminders |
| **Artisan Cafes & Restaurants** | Dense urban culinary hubs | Third-party platform commission drain (25-30%); no direct ordering | High-Converting Next.js 15 Menu & Direct Table Booking |
| **Boutique Law & Advisory** | Commercial financial centers | Outdated legacy sites; lack of secure investor/client document portal | Hardened Client Portal & RBAC Dashboards |
| **High-End Salons & Spas** | Trendy lifestyle districts | Clunky scheduling; no mobile-optimized showcase | Interactive Service Visualizer & Instant Scheduling |

---

## 3. Weekly Execution Cadence

```text
┌───────────────────────────────────────────────────────────────┐
│                    2-WEEK SPRINT CADENCE                      │
└───────────────────────────────────────────────────────────────┘
  WEEK 1: Research & Initial Outreach
  ├── Monday: Set up 4 Google Maps search tabs (2 niches × 2 cities)
  ├── Tuesday–Wednesday: Inspect 40–60 listings via Tampermonkey HUD
  ├── Thursday: Filter CRM for HOT leads, personalize & dispatch 15–25 messages
  └── Friday: Log sent dates, initial replies, and schedule follow-ups
  
  WEEK 2: Follow-up & Conversion
  ├── Monday–Tuesday: Dispatch Follow-Up 1 to non-responders
  ├── Wednesday–Thursday: Host 20-minute discovery calls / Loom reviews
  └── Friday: Compute sprint KPIs and iterate scoring/templates
```

---

## 4. Outreach Message Templates

### Angle 1: Missing Website (`status = missing`)
> **Subject:** Quick question regarding {{company}}’s web presence
>
> Hello {{name/team}},
>
> I came across {{company}} while looking at top-rated {{niche}} businesses in {{city}}—your {{rating}}★ reputation across {{reviews}} reviews really stood out.
>
> I noticed you don't currently have a dedicated modern website linked on Google Maps. That usually means losing high-intent local search customers to competitors who have instant booking or online service menus.
>
> We put together 2 practical ideas on how a clean Next.js 15 site with sub-second mobile loading could capture those clients directly.
>
> Would you be open to a quick 2-minute video walkthrough of those ideas? No pitch or obligations.
>
> Best regards,  
> **CyberStyle Growth Team**  
> https://cyberstyle.dev

---

### Angle 2: Social Media Only Link (`status = social-only`)
> **Subject:** Idea for {{company}}'s customer intake flow
>
> Hi {{name/team}},
>
> I found {{company}} while researching {{niche}} in {{city}}. I noticed your main web link points to Facebook/Instagram rather than a dedicated branded portal.
>
> While social profiles provide great social proof, they often drop 30–40% of mobile visitors who just want to see your services, pricing, and book a slot instantly without logging in.
>
> We mapped out how a dedicated branded client intake portal could capture more inquiries for you 24/7.
>
> Happy to send over a short breakdown if you're interested.
>
> Best,  
> **CyberStyle Growth Team**  
> https://cyberstyle.dev

---

### Angle 3: Follow-Up (Day 4–5)
> **Subject:** Re: Quick question regarding {{company}}’s web presence
>
> Hi {{name/team}},
>
> Just wanted to check if you saw my note from earlier this week regarding {{company}}'s digital presence.
>
> We created a quick 90-second Loom recording showing the exact opportunity area we spotted.
>
> Let me know if you'd like me to send the link over!
>
> Best,  
> **CyberStyle Growth Team**

---

## 5. Objection Handling Guide

| Common Objection | Root Concern | Recommended Response |
| :--- | :--- | :--- |
| *"We get all our business from word of mouth."* | Does not see ROI of a website. | *"Word of mouth is the best channel. A modern site doesn't replace referrals—it validates them so referrals don't drop off when researching you on mobile."* |
| *"We already have an Instagram/Facebook page."* | Believes social media is sufficient. | *"Social media is great for discovery, but a dedicated site converts visitors directly into booked appointments and calls without platform distractions."* |
| *"How much does this cost?"* | Budget skepticism. | *"We work on fixed milestone sprints starting with small, modular deliverables—no surprise hourly bills. Happy to share a 1-page Scope of Work breakdown."* |
