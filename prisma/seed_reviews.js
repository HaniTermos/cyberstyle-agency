const { PrismaClient, ReviewStatus } = require('@prisma/client');
const prisma = new PrismaClient();

const initialReviews = [
  {
    clientName: 'Franklin Vance',
    clientTitle: 'Managing Director',
    companyName: 'Apex Capital Advisory',
    rating: 5,
    quote: 'CYBERSTYLE transformed our visual presence completely. Our inbound high-ticket inquiries increased significantly in the first 30 days. Sub-second speed and stunning design.',
    isFeatured: true,
    status: ReviewStatus.APPROVED,
    provenance: 'Direct Feedback',
    consent: true,
    displayPermission: true,
    source: 'client_portal',
    approvedAt: new Date(),
  },
  {
    clientName: 'Elena Rostova',
    clientTitle: 'Chief Product Officer',
    companyName: 'OmniFlow Logistics',
    rating: 5,
    quote: 'The custom 3D Silk shader background and automated AI intake workflow tripled our qualified prospect velocity. Exceptional technical rigor and direct builder access.',
    isFeatured: true,
    status: ReviewStatus.APPROVED,
    provenance: 'Direct Feedback',
    consent: true,
    displayPermission: true,
    source: 'client_portal',
    approvedAt: new Date(),
  },
  {
    clientName: 'David Chen',
    clientTitle: 'VP of Technology',
    companyName: 'Stratum Ventures',
    rating: 5,
    quote: 'Zero agency bloat or junior account manager telephone games. We worked directly with senior engineers who delivered a 99+ Core Web Vitals build on schedule.',
    isFeatured: true,
    status: ReviewStatus.APPROVED,
    provenance: 'Direct Feedback',
    consent: true,
    displayPermission: true,
    source: 'client_portal',
    approvedAt: new Date(),
  },
];

async function seedReviews() {
  console.log('🌱 Seeding initial approved reviews...');
  for (const r of initialReviews) {
    const existing = await prisma.review.findFirst({
      where: {
        clientName: r.clientName,
        companyName: r.companyName,
      },
    });

    if (!existing) {
      await prisma.review.create({ data: r });
      console.log(`✓ Created review from ${r.clientName} (${r.companyName})`);
    } else {
      console.log(`- Review from ${r.clientName} already exists`);
    }
  }
  console.log('✅ Reviews seeded successfully.');
}

seedReviews()
  .catch((e) => {
    console.error('Error seeding reviews:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
