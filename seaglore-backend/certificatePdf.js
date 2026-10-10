import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';
import QRCode from 'qrcode';

const NAVY = rgb(0.086, 0.196, 0.29);
const GREY = rgb(0.43, 0.48, 0.51);
const CREAM = rgb(0.98, 0.96, 0.925);

// Standard PDF fonts sirf Latin-1 jaante hain; baaki characters '?' ban jate hain
const safe = (s) => String(s).replace(/[^\u0020-\u007E\u00A0-\u00FF]/g, '?');

export async function buildCertificatePdf({ name, code, issuedAt, verifyUrl }) {
  const pdf = await PDFDocument.create();
  const page = pdf.addPage([841.89, 595.28]); // A4 landscape
  const { width, height } = page.getSize();

  const serif = await pdf.embedFont(StandardFonts.TimesRoman);
  const serifBold = await pdf.embedFont(StandardFonts.TimesRomanBold);
  const sans = await pdf.embedFont(StandardFonts.Helvetica);

  page.drawRectangle({ x: 0, y: 0, width, height, color: CREAM });
  page.drawRectangle({ x: 24, y: 24, width: width - 48, height: height - 48, borderColor: NAVY, borderWidth: 2 });
  page.drawRectangle({ x: 34, y: 34, width: width - 68, height: height - 68, borderColor: NAVY, borderWidth: 0.5 });

  const center = (text, y, font, size, color = NAVY) => {
    const t = safe(text);
    page.drawText(t, { x: (width - font.widthOfTextAtSize(t, size)) / 2, y, size, font, color });
  };

  center('SEAGLORÉ', height - 100, serif, 18, NAVY);
  center('Certificate of Completion', height - 160, serifBold, 38, NAVY);
  center('This certifies that', height - 215, serif, 16, GREY);

  // Lamba naam chhota font le leta hai
  let nameSize = 40;
  while (serifBold.widthOfTextAtSize(safe(name), nameSize) > width - 160 && nameSize > 18) nameSize -= 2;
  center(name, height - 275, serifBold, nameSize, NAVY);

  center('has successfully completed the Seagloré Ocean Reset Certification', height - 325, serif, 16, GREY);
  center(`Issued on ${issuedAt}`, height - 360, serif, 14, GREY);

  const qr = await QRCode.toBuffer(verifyUrl, { margin: 1, width: 240 });
  const qrImg = await pdf.embedPng(qr);
  page.drawImage(qrImg, { x: width / 2 - 45, y: 70, width: 90, height: 90 });
  center(`Certificate ID: ${code}`, 52, sans, 10, GREY);
  center('Scan the QR code to verify this certificate', 168, sans, 9, GREY);

  return Buffer.from(await pdf.save());
}