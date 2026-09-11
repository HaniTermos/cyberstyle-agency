import PDFDocument from 'pdfkit';

export interface InvoicePdfData {
  invoiceNumber: string;
  clientName: string;
  clientEmail?: string;
  clientAddress?: string;
  projectName?: string;
  issueDate: string;
  dueDate: string;
  currency: string;
  status: string;
  paymentTerms?: string;
  notes?: string;
  lineItems: Array<{
    description: string;
    quantity: number;
    unitPrice: number;
    totalPrice?: number;
  }>;
  subtotal: number;
  taxRate?: number;
  taxAmount?: number;
  discountAmount?: number;
  totalAmount: number;
  amountPaid?: number;
  amountDue?: number;
}

export class InvoicePdfService {
  /**
   * Generates a high-quality CYBERSTYLE branded invoice PDF
   */
  public static async generateInvoiceBuffer(data: InvoicePdfData): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      try {
        const doc = new PDFDocument({
          margin: 40,
          size: 'A4',
          info: {
            Title: `Invoice ${data.invoiceNumber} - ${data.clientName}`,
            Author: 'CYBERSTYLE Digital Agency',
            Subject: `Invoice ${data.invoiceNumber}`,
          },
        });

        const buffers: Buffer[] = [];
        doc.on('data', buffers.push.bind(buffers));
        doc.on('end', () => resolve(Buffer.concat(buffers)));
        doc.on('error', reject);

        // Styling Colors
        const brandColor = '#00F0FF';
        const darkBg = '#0B0F17';
        const textLight = '#FFFFFF';
        const textMuted = '#94A3B8';
        const textDark = '#1E293B';
        const borderColor = '#E2E8F0';

        // Header Background Banner
        doc.rect(0, 0, 595.28, 120).fill(darkBg);

        // Brand Logo Text
        doc
          .fillColor(brandColor)
          .fontSize(22)
          .font('Helvetica-Bold')
          .text('CYBERSTYLE', 40, 35, { characterSpacing: 2 });

        doc
          .fillColor('#94A3B8')
          .fontSize(9)
          .font('Helvetica')
          .text('ADVANCED DIGITAL & AI SYSTEMS', 40, 62, { characterSpacing: 1 });

        // Invoice Title & Number
        doc
          .fillColor(textLight)
          .fontSize(20)
          .font('Helvetica-Bold')
          .text('INVOICE', 380, 35, { align: 'right' });

        doc
          .fillColor(brandColor)
          .fontSize(11)
          .font('Helvetica-Bold')
          .text(data.invoiceNumber, 380, 60, { align: 'right' });

        // Status Badge
        const statusY = 82;
        const statusText = (data.status || 'DRAFT').toUpperCase();
        let statusBg = '#64748B';
        if (statusText === 'PAID') statusBg = '#10B981';
        else if (statusText === 'SENT' || statusText === 'OPEN') statusBg = '#0284C7';
        else if (statusText === 'OVERDUE') statusBg = '#EF4444';

        doc.roundedRect(485, statusY, 70, 18, 4).fill(statusBg);
        doc
          .fillColor('#FFFFFF')
          .fontSize(8)
          .font('Helvetica-Bold')
          .text(statusText, 485, statusY + 4, { width: 70, align: 'center' });

        // Metadata Grid (Billed To & Invoice Details)
        doc.fillColor(textDark);
        const detailsTop = 145;

        // Column 1: Bill To
        doc
          .fillColor(textMuted)
          .fontSize(8)
          .font('Helvetica-Bold')
          .text('BILLED TO:', 40, detailsTop);

        doc
          .fillColor(textDark)
          .fontSize(12)
          .font('Helvetica-Bold')
          .text(data.clientName, 40, detailsTop + 14);

        if (data.clientEmail) {
          doc
            .fillColor(textMuted)
            .fontSize(9)
            .font('Helvetica')
            .text(data.clientEmail, 40, detailsTop + 30);
        }

        if (data.clientAddress) {
          doc
            .fillColor(textMuted)
            .fontSize(9)
            .font('Helvetica')
            .text(data.clientAddress, 40, detailsTop + 44);
        }

        // Column 2: Invoice Metadata
        const col2X = 360;
        doc
          .fillColor(textMuted)
          .fontSize(8)
          .font('Helvetica-Bold')
          .text('ISSUE DATE:', col2X, detailsTop)
          .text('DUE DATE:', col2X, detailsTop + 18)
          .text('PAYMENT TERMS:', col2X, detailsTop + 36);

        doc
          .fillColor(textDark)
          .fontSize(9)
          .font('Helvetica-Bold')
          .text(data.issueDate, col2X + 110, detailsTop, { align: 'right', width: 85 })
          .text(data.dueDate, col2X + 110, detailsTop + 18, { align: 'right', width: 85 })
          .text(data.paymentTerms || 'NET 30', col2X + 110, detailsTop + 36, { align: 'right', width: 85 });

        // Line Items Table Header
        const tableTop = 225;
        doc.rect(40, tableTop, 515.28, 24).fill('#0F172A');

        doc
          .fillColor('#FFFFFF')
          .fontSize(9)
          .font('Helvetica-Bold')
          .text('ITEM / SERVICE DESCRIPTION', 50, tableTop + 7)
          .text('QTY', 340, tableTop + 7, { width: 40, align: 'center' })
          .text('RATE', 390, tableTop + 7, { width: 70, align: 'right' })
          .text('AMOUNT', 470, tableTop + 7, { width: 75, align: 'right' });

        // Line Items Rows
        let currentY = tableTop + 24;
        const items = data.lineItems && data.lineItems.length > 0
          ? data.lineItems
          : [{ description: data.projectName || 'Digital Engineering & Architecture Services', quantity: 1, unitPrice: data.totalAmount }];

        items.forEach((item, index) => {
          const rowBg = index % 2 === 0 ? '#FFFFFF' : '#F8FAFC';
          doc.rect(40, currentY, 515.28, 26).fill(rowBg);

          const itemTotal = (item.quantity || 1) * (item.unitPrice || 0);

          doc
            .fillColor(textDark)
            .fontSize(9)
            .font('Helvetica-Bold')
            .text(item.description, 50, currentY + 7, { width: 280, ellipsis: true });

          doc
            .fillColor(textMuted)
            .fontSize(9)
            .font('Helvetica')
            .text(String(item.quantity || 1), 340, currentY + 7, { width: 40, align: 'center' })
            .text(`$${Number(item.unitPrice || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}`, 390, currentY + 7, { width: 70, align: 'right' });

          doc
            .fillColor(textDark)
            .fontSize(9)
            .font('Helvetica-Bold')
            .text(`$${Number(itemTotal).toLocaleString('en-US', { minimumFractionDigits: 2 })}`, 470, currentY + 7, { width: 75, align: 'right' });

          currentY += 26;
        });

        // Horizontal Separator
        doc.moveTo(40, currentY).lineTo(555.28, currentY).strokeColor(borderColor).stroke();
        currentY += 15;

        // Financial Summary Box (Subtotal, Tax, Discount, Total Due)
        const summaryX = 350;
        const valX = 460;
        const valW = 95;

        const subtotal = data.subtotal || data.totalAmount;
        doc
          .fillColor(textMuted)
          .fontSize(9)
          .font('Helvetica')
          .text('Subtotal:', summaryX, currentY);
        doc
          .fillColor(textDark)
          .fontSize(9)
          .font('Helvetica-Bold')
          .text(`$${Number(subtotal).toLocaleString('en-US', { minimumFractionDigits: 2 })}`, valX, currentY, { width: valW, align: 'right' });

        currentY += 16;

        if (data.taxAmount && data.taxAmount > 0) {
          doc
            .fillColor(textMuted)
            .fontSize(9)
            .font('Helvetica')
            .text(`Tax (${data.taxRate || 0}%):`, summaryX, currentY);
          doc
            .fillColor(textDark)
            .fontSize(9)
            .font('Helvetica')
            .text(`$${Number(data.taxAmount).toLocaleString('en-US', { minimumFractionDigits: 2 })}`, valX, currentY, { width: valW, align: 'right' });
          currentY += 16;
        }

        if (data.discountAmount && data.discountAmount > 0) {
          doc
            .fillColor(textMuted)
            .fontSize(9)
            .font('Helvetica')
            .text('Discount:', summaryX, currentY);
          doc
            .fillColor('#10B981')
            .fontSize(9)
            .font('Helvetica-Bold')
            .text(`-$${Number(data.discountAmount).toLocaleString('en-US', { minimumFractionDigits: 2 })}`, valX, currentY, { width: valW, align: 'right' });
          currentY += 16;
        }

        // Total Amount Highlight
        currentY += 4;
        doc.rect(summaryX - 10, currentY - 4, 215.28, 28).fill('#0F172A');

        doc
          .fillColor('#94A3B8')
          .fontSize(10)
          .font('Helvetica-Bold')
          .text('TOTAL AMOUNT:', summaryX, currentY + 4);

        doc
          .fillColor(brandColor)
          .fontSize(12)
          .font('Helvetica-Bold')
          .text(`$${Number(data.totalAmount).toLocaleString('en-US', { minimumFractionDigits: 2 })} ${data.currency || 'USD'}`, valX, currentY + 3, { width: valW, align: 'right' });

        // Notes & Payment Instructions (Bottom Left)
        const notesY = currentY - 40;
        doc
          .fillColor(textMuted)
          .fontSize(8)
          .font('Helvetica-Bold')
          .text('PAYMENT INSTRUCTIONS & WIRE DETAILS:', 40, notesY);

        doc
          .fillColor(textMuted)
          .fontSize(8)
          .font('Helvetica')
          .text('Bank: JPMorgan Chase NA (New York)\nAccount Name: CYBERSTYLE DIGITAL LLC\nRouting (ABA): 021000021\nSWIFT: CHASUS33XXX\nOnline Card/ACH Checkout: Powered by Stripe Encrypted Gateway', 40, notesY + 12, { width: 280 });

        // Footer
        doc
          .fillColor(textMuted)
          .fontSize(8)
          .font('Helvetica')
          .text('Thank you for partnering with CYBERSTYLE. Questions? Contact billing@cyberstyle.net', 40, 780, { align: 'center', width: 515.28 });

        doc.end();
      } catch (err) {
        reject(err);
      }
    });
  }
}
