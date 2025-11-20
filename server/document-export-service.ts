import PDFDocument from 'pdfkit';
import { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell, HeadingLevel } from 'docx';
import type { Resume, Document as DocumentRecord } from '@shared/schema';

export async function generateResumePDF(resume: Resume): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({
        bufferPages: true,
        margin: 50,
        size: 'LETTER',
      });

      const chunks: Buffer[] = [];
      doc.on('data', (chunk) => chunks.push(chunk));
      doc.on('end', () => resolve(Buffer.concat(chunks)));

      const content = resume.content as any;

      // Header
      if (content.name) {
        doc.fontSize(24).font('Helvetica-Bold').text(content.name, { align: 'center' });
      }

      // Contact info
      const contactInfo: string[] = [];
      if (content.email) contactInfo.push(content.email);
      if (content.phone) contactInfo.push(content.phone);

      if (contactInfo.length > 0) {
        doc.fontSize(10).font('Helvetica').text(contactInfo.join(' | '), { align: 'center' });
      }

      doc.moveDown(0.5);

      // Summary
      if (content.summary) {
        doc.fontSize(12).font('Helvetica-Bold').text('PROFESSIONAL SUMMARY');
        doc.fontSize(10).font('Helvetica').text(content.summary);
        doc.moveDown(0.5);
      }

      // Experience
      if (content.experience && Array.isArray(content.experience)) {
        doc.fontSize(12).font('Helvetica-Bold').text('EXPERIENCE');

        for (const exp of content.experience) {
          doc.fontSize(11).font('Helvetica-Bold').text(exp.title);
          doc.fontSize(10).font('Helvetica').text(`${exp.company} | ${exp.duration}`, { underline: true });

          if (exp.bullets && Array.isArray(exp.bullets)) {
            for (const bullet of exp.bullets) {
              doc.fontSize(10).font('Helvetica').text(`• ${bullet}`, { indent: 20 });
            }
          }
          doc.moveDown(0.3);
        }
        doc.moveDown(0.3);
      }

      // Education
      if (content.education && Array.isArray(content.education)) {
        doc.fontSize(12).font('Helvetica-Bold').text('EDUCATION');

        for (const edu of content.education) {
          doc.fontSize(11).font('Helvetica-Bold').text(edu.degree);
          doc.fontSize(10).font('Helvetica').text(`${edu.school} | ${edu.year}`);
          doc.moveDown(0.3);
        }
        doc.moveDown(0.3);
      }

      // Skills
      if (content.skills && Array.isArray(content.skills)) {
        doc.fontSize(12).font('Helvetica-Bold').text('SKILLS');
        doc.fontSize(10).font('Helvetica').text(content.skills.join(', '), { align: 'left' });
      }

      doc.end();
    } catch (error) {
      reject(error);
    }
  });
}

export async function generateResumeDOCX(resume: Resume): Promise<Buffer> {
  const content = resume.content as any;

  const sections: Paragraph[] = [];

  // Header
  if (content.name) {
    sections.push(
      new Paragraph({
        text: content.name,
        heading: HeadingLevel.HEADING_1,
        alignment: 'center' as any,
        spacing: { after: 100 },
      })
    );
  }

  // Contact info
  if (content.email || content.phone) {
    const contact: string[] = [];
    if (content.email) contact.push(content.email);
    if (content.phone) contact.push(content.phone);

    sections.push(
      new Paragraph({
        text: contact.join(' | '),
        alignment: 'center' as any,
        spacing: { after: 200 },
      })
    );
  }

  // Summary
  if (content.summary) {
    sections.push(
      new Paragraph({
        text: 'PROFESSIONAL SUMMARY',
        spacing: { before: 200, after: 100 },
        children: [new TextRun({ text: 'PROFESSIONAL SUMMARY', bold: true })],
      })
    );
    sections.push(
      new Paragraph({
        text: content.summary,
        spacing: { after: 200 },
      })
    );
  }

  // Experience
  if (content.experience && Array.isArray(content.experience)) {
    sections.push(
      new Paragraph({
        text: 'EXPERIENCE',
        spacing: { before: 200, after: 100 },
        children: [new TextRun({ text: 'EXPERIENCE', bold: true })],
      })
    );

    for (const exp of content.experience) {
      sections.push(
        new Paragraph({
          text: exp.title,
          children: [new TextRun({ text: exp.title, bold: true })],
        })
      );
      sections.push(
        new Paragraph({
          text: `${exp.company} | ${exp.duration}`,
          spacing: { after: 100 },
        })
      );

      if (exp.bullets && Array.isArray(exp.bullets)) {
        for (const bullet of exp.bullets) {
          sections.push(
            new Paragraph({
              text: bullet,
              bullet: { level: 0 },
              spacing: { after: 50 },
            })
          );
        }
      }
    }
  }

  // Education
  if (content.education && Array.isArray(content.education)) {
    sections.push(
      new Paragraph({
        text: 'EDUCATION',
        spacing: { before: 200, after: 100 },
        children: [new TextRun({ text: 'EDUCATION', bold: true })],
      })
    );

    for (const edu of content.education) {
      sections.push(
        new Paragraph({
          text: edu.degree,
          children: [new TextRun({ text: edu.degree, bold: true })],
        })
      );
      sections.push(
        new Paragraph({
          text: `${edu.school} | ${edu.year}`,
          spacing: { after: 200 },
        })
      );
    }
  }

  // Skills
  if (content.skills && Array.isArray(content.skills)) {
    sections.push(
      new Paragraph({
        text: 'SKILLS',
        spacing: { before: 200, after: 100 },
        children: [new TextRun({ text: 'SKILLS', bold: true })],
      })
    );
    sections.push(
      new Paragraph({
        text: content.skills.join(', '),
      })
    );
  }

  const doc = new Document({
    sections: [
      {
        children: sections,
      },
    ],
  });

  const buffer = await Packer.toBuffer(doc);
  return buffer;
}

export async function generateCoverLetterPDF(
  document: DocumentRecord,
  recipientName?: string
): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({
        bufferPages: true,
        margin: 50,
        size: 'LETTER',
      });

      const chunks: Buffer[] = [];
      doc.on('data', (chunk) => chunks.push(chunk));
      doc.on('end', () => resolve(Buffer.concat(chunks)));

      // Add current date
      const today = new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
      doc.fontSize(10).font('Helvetica').text(today);
      doc.moveDown(1);

      // Content
      if (document.content) {
        doc.fontSize(11).font('Helvetica').text(document.content, { align: 'left', width: 500 });
      }

      doc.moveDown(2);
      doc.fontSize(10).font('Helvetica').text('Sincerely,');
      doc.moveDown(3);
      doc.fontSize(10).font('Helvetica').text('[Your Name]');

      doc.end();
    } catch (error) {
      reject(error);
    }
  });
}

export async function generateCoverLetterDOCX(
  document: DocumentRecord
): Promise<Buffer> {
  const today = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const sections = [
    new Paragraph({
      text: today,
      spacing: { after: 200 },
    }),
    new Paragraph({
      text: document.content || '',
      spacing: { after: 400 },
    }),
    new Paragraph({
      text: 'Sincerely,',
      spacing: { after: 400 },
    }),
    new Paragraph({
      text: '[Your Name]',
    }),
  ];

  const doc = new Document({
    sections: [
      {
        children: sections,
      },
    ],
  });

  const buffer = await Packer.toBuffer(doc);
  return buffer;
}
