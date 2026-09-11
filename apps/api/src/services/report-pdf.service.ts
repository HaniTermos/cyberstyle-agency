import PDFDocument from 'pdfkit';
import { storageService } from './storage.service';

export interface ReportPdfData {
  reportId: string;
  title: string;
  organizationName: string;
  period: string;
  reportType: string;
  executiveSummary: string;
  keyAccomplishments?: string[];
  nextMonthPlan?: string;
  nextMonthPriorities?: string[];
  metrics?: {
    hoursIncluded?: number;
    hoursUsed?: number;
    hoursRemaining?: number;
    tasksCompletedCount?: number;
    milestonesCount?: number;
    slaUptime?: number | string;
  };
  deliverables?: Array<{
    title: string;
    description?: string;
    completedAt?: string;
    type?: string;
  }>;
  healthSnapshot?: {
    score?: number;
    band?: string;
    factors?: Array<{ factor: string; deduction: number; reason: string }>;
  };
  invoicesSummary?: {
    billedTotal?: number;
    paidTotal?: number;
    balanceDue?: number;
  };
}

export class ReportPdfService {
  /**
   * Generates an executive retainer / delivery PDF report buffer using pdfkit
   */
  public static async generateReportBuffer(data: ReportPdfData): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      try {
        const doc = new PDFDocument({
          margin: 40,
          size: 'A4',
          info: {
            Title: `${data.title} - ${data.organizationName}`,
            Author: 'CYBERSTYLE LLC',
            Subject: `Executive Retainer Report - ${data.period}`,
          },
        });

        const buffers: Buffer[] = [];
        doc.on('data', buffers.push.bind(buffers));
        doc.on('end', () => resolve(Buffer.concat(buffers)));
        doc.on('error', reject);

        // Styling Colors
        const primaryColor = '#00F0FF';
        const darkBg = '#0B0F17';
        const textColor = '#1E293B';
        const mutedColor = '#64748B';
        const cardBg = '#F8FAFC';
        const borderCard = '#E2E8F0';

        // 1. Header Block
        doc
          .rect(0, 0, doc.page.width, 100)
          .fill(darkBg);

        // Logo / Title
        doc
          .fillColor('#FFFFFF')
          .fontSize(20)
          .font('Helvetica-Bold')
          .text('CYBERSTYLE LLC', 40, 30);

        doc
          .fillColor(primaryColor)
          .fontSize(10)
          .font('Helvetica-Bold')
          .text('EXECUTIVE RETAINER & DELIVERY REPORT', 40, 55);

        // Period Badge on Top Right
        doc
          .fillColor('#FFFFFF')
          .fontSize(14)
          .font('Helvetica-Bold')
          .text(data.period, doc.page.width - 200, 32, { width: 160, align: 'right' });

        doc
          .fillColor('#94A3B8')
          .fontSize(9)
          .font('Helvetica')
          .text(`Prepared for: ${data.organizationName}`, doc.page.width - 200, 52, { width: 160, align: 'right' });

        doc.moveDown(4);
        doc.y = 120;

        // 2. Report Title & Meta
        doc
          .fillColor(textColor)
          .fontSize(16)
          .font('Helvetica-Bold')
          .text(data.title, 40, doc.y);

        doc
          .fillColor(mutedColor)
          .fontSize(9)
          .font('Helvetica')
          .text(`Report ID: ${data.reportId} • Type: ${data.reportType.replace(/_/g, ' ')} • Date: ${new Date().toLocaleDateString('en-US')}`, 40, doc.y + 4);

        doc.moveDown(1.5);

        // 3. Metrics Summary Cards Grid
        const startY = doc.y;
        const cardWidth = (doc.page.width - 80 - 30) / 4;
        const cardHeight = 55;

        const metricsList = [
          { label: 'Retainer Hours Used', value: `${data.metrics?.hoursUsed || 0} / ${data.metrics?.hoursIncluded || 40} hrs` },
          { label: 'Tasks Completed', value: `${data.metrics?.tasksCompletedCount || 0} Sprints` },
          { label: 'Milestones Achieved', value: `${data.metrics?.milestonesCount || 0} Delivered` },
          { label: 'Infrastructure SLA', value: `${data.metrics?.slaUptime || '99.98%'}` },
        ];

        metricsList.forEach((m, idx) => {
          const cardX = 40 + idx * (cardWidth + 10);
          doc
            .roundedRect(cardX, startY, cardWidth, cardHeight, 6)
            .fillAndStroke(cardBg, borderCard);

          doc
            .fillColor(mutedColor)
            .fontSize(8)
            .font('Helvetica-Bold')
            .text(m.label.toUpperCase(), cardX + 10, startY + 10, { width: cardWidth - 20 });

          doc
            .fillColor(textColor)
            .fontSize(12)
            .font('Helvetica-Bold')
            .text(m.value, cardX + 10, startY + 28, { width: cardWidth - 20 });
        });

        doc.y = startY + cardHeight + 20;

        // 4. Executive Summary Section
        doc
          .fillColor(textColor)
          .fontSize(12)
          .font('Helvetica-Bold')
          .text('1. Executive Summary', 40, doc.y);

        doc.moveDown(0.4);
        doc
          .fillColor('#334155')
          .fontSize(9.5)
          .font('Helvetica')
          .text(data.executiveSummary || 'No executive summary provided.', 40, doc.y, {
            width: doc.page.width - 80,
            lineGap: 3,
          });

        doc.moveDown(1.2);

        // 5. Key Accomplishments
        if (data.keyAccomplishments && data.keyAccomplishments.length > 0) {
          doc
            .fillColor(textColor)
            .fontSize(11)
            .font('Helvetica-Bold')
            .text('Key Accomplishments & Deliverables Completed:', 40, doc.y);

          doc.moveDown(0.4);
          data.keyAccomplishments.forEach((acc) => {
            doc
              .fillColor('#0F172A')
              .fontSize(9)
              .font('Helvetica')
              .text(`•  ${acc}`, 50, doc.y, { width: doc.page.width - 90, lineGap: 2 });
            doc.moveDown(0.3);
          });
          doc.moveDown(0.8);
        }

        // 6. Deliverables Table
        if (data.deliverables && data.deliverables.length > 0) {
          doc
            .fillColor(textColor)
            .fontSize(12)
            .font('Helvetica-Bold')
            .text('2. Deliverables & Milestones Log', 40, doc.y);

          doc.moveDown(0.4);

          // Table Header
          const tblY = doc.y;
          doc
            .rect(40, tblY, doc.page.width - 80, 20)
            .fill('#0F172A');

          doc
            .fillColor('#FFFFFF')
            .fontSize(8.5)
            .font('Helvetica-Bold')
            .text('DELIVERABLE TITLE', 50, tblY + 6)
            .text('CATEGORY', doc.page.width - 240, tblY + 6)
            .text('STATUS', doc.page.width - 120, tblY + 6);

          let rowY = tblY + 20;

          data.deliverables.slice(0, 8).forEach((item, idx) => {
            const isAlt = idx % 2 === 1;
            if (isAlt) {
              doc.rect(40, rowY, doc.page.width - 80, 22).fill('#F8FAFC');
            }

            doc
              .fillColor('#1E293B')
              .fontSize(8.5)
              .font('Helvetica-Bold')
              .text(item.title, 50, rowY + 6, { width: 280, lineBreak: false, ellipsis: true })
              .font('Helvetica')
              .fillColor(mutedColor)
              .text(item.type || 'Engineering Sprint', doc.page.width - 240, rowY + 6)
              .fillColor('#10B981')
              .font('Helvetica-Bold')
              .text('COMPLETED', doc.page.width - 120, rowY + 6);

            rowY += 22;
          });

          doc.y = rowY + 15;
        }

        // Check if page overflow
        if (doc.y > 650) {
          doc.addPage();
        }

        // 7. Next Month Priorities & Roadmap
        doc
          .fillColor(textColor)
          .fontSize(12)
          .font('Helvetica-Bold')
          .text('3. Next Month Objectives & Roadmap', 40, doc.y);

        doc.moveDown(0.4);
        if (data.nextMonthPlan) {
          doc
            .fillColor('#334155')
            .fontSize(9)
            .font('Helvetica')
            .text(data.nextMonthPlan, 40, doc.y, { width: doc.page.width - 80, lineGap: 2 });
          doc.moveDown(0.6);
        }

        if (data.nextMonthPriorities && data.nextMonthPriorities.length > 0) {
          data.nextMonthPriorities.forEach((priority) => {
            doc
              .fillColor('#0F172A')
              .fontSize(9)
              .font('Helvetica')
              .text(`→  ${priority}`, 50, doc.y, { width: doc.page.width - 90, lineGap: 2 });
            doc.moveDown(0.3);
          });
        }

        doc.moveDown(1);

        // 8. Billing & Account Health Snapshot
        if (data.invoicesSummary || data.healthSnapshot) {
          doc
            .fillColor(textColor)
            .fontSize(11)
            .font('Helvetica-Bold')
            .text('4. Account & Billing Snapshot', 40, doc.y);

          doc.moveDown(0.4);

          const snapY = doc.y;
          doc
            .roundedRect(40, snapY, doc.page.width - 80, 45, 6)
            .fillAndStroke(cardBg, borderCard);

          doc
            .fillColor(mutedColor)
            .fontSize(8.5)
            .font('Helvetica')
            .text(`Account Health Status: ${data.healthSnapshot?.band || 'HEALTHY'} (${data.healthSnapshot?.score || 100}/100)`, 55, snapY + 10)
            .text(`Total Period Billed: $${(data.invoicesSummary?.billedTotal || 0).toLocaleString()} • Amount Paid: $${(data.invoicesSummary?.paidTotal || 0).toLocaleString()} • Current Balance: $${(data.invoicesSummary?.balanceDue || 0).toLocaleString()}`, 55, snapY + 25);

          doc.y = snapY + 60;
        }

        // 9. Confidentiality Footer
        const footerY = doc.page.height - 40;
        doc
          .fillColor(mutedColor)
          .fontSize(8)
          .font('Helvetica')
          .text(
            `Confidential — Generated for ${data.organizationName} by CYBERSTYLE LLC. All rights reserved.`,
            40,
            footerY,
            { align: 'center', width: doc.page.width - 80 }
          );

        doc.end();
      } catch (err) {
        reject(err);
      }
    });
  }

  /**
   * Generates report PDF and saves to permanent storage, returning public path / key
   */
  public static async generateAndSaveReportPdf(data: ReportPdfData): Promise<{ key: string; url: string }> {
    const buffer = await this.generateReportBuffer(data);
    const fileName = `report_${data.organizationName.toLowerCase().replace(/[^a-z0-9]/g, '_')}_${data.period.toLowerCase().replace(/\s+/g, '_')}.pdf`;
    return storageService.uploadFile(buffer, fileName, 'application/pdf');
  }
}
