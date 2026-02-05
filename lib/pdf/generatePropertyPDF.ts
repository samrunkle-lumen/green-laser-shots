import jsPDF from 'jspdf';
import { Property } from '@/lib/types/property';
import { formatCurrencyFull } from '@/lib/utils/aggregations';

export function generatePropertyPDF(property: Property, partnerName: string): void {
  const doc = new jsPDF('p', 'mm', 'letter');

  // Lumen brand colors
  const skyBlue = [177, 229, 255];
  const electricYellow = [223, 255, 94];
  const graphiteBlack = [26, 26, 26];
  const concrete = [159, 163, 143];

  let yPos = 20;

  // Header - Lumen Energy
  doc.setFillColor(...skyBlue);
  doc.rect(0, 0, 220, 30, 'F');
  doc.setFontSize(24);
  doc.setTextColor(...graphiteBlack);
  doc.setFont('helvetica', 'bold');
  doc.text('LUMEN ENERGY', 20, 15);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text('Community Solar Opportunity', 20, 22);

  yPos = 45;

  // Property Title
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...graphiteBlack);
  doc.text(property.address, 20, yPos);
  yPos += 8;

  // Customer Name
  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...concrete);
  doc.text(property.portfolio, 20, yPos);
  yPos += 12;

  // Ownership Badge
  doc.setFontSize(10);
  if (property.isOwned) {
    doc.setFillColor(...electricYellow);
  } else {
    doc.setFillColor(...skyBlue);
  }
  doc.roundedRect(20, yPos - 5, 45, 8, 2, 2, 'F');
  doc.setTextColor(...graphiteBlack);
  doc.setFont('helvetica', 'bold');
  doc.text(property.isOwned ? 'Customer Owned' : 'Leased Property', 22, yPos);
  yPos += 15;

  // Economics Section
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...graphiteBlack);
  doc.text('ANNUAL LEASE VALUE', 20, yPos);
  yPos += 8;

  doc.setFontSize(28);
  doc.setTextColor(...graphiteBlack);
  doc.text(property.leasePerYear, 20, yPos);
  yPos += 6;

  doc.setFontSize(10);
  doc.setTextColor(...concrete);
  doc.text(formatCurrencyFull(property.leasePerYearNumber) + ' per year', 20, yPos);
  yPos += 15;

  // System Details Grid
  doc.setFillColor(245, 245, 245);
  doc.rect(20, yPos, 170, 35, 'F');

  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...graphiteBlack);
  doc.text('SYSTEM SIZE', 25, yPos + 8);
  doc.setFontSize(16);
  doc.text(property.systemSize.toLocaleString() + ' kW', 25, yPos + 16);

  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text('RATE', 95, yPos + 8);
  doc.setFontSize(16);
  doc.text('$' + property.ratePerKW + '/kW', 95, yPos + 16);

  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text('ROOF CAPACITY', 25, yPos + 26);
  doc.setFontSize(12);
  doc.text(property.roofMaxPV.toLocaleString() + ' kW', 25, yPos + 32);

  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text('UTILITY', 95, yPos + 26);
  doc.setFontSize(12);
  const utilityText = property.utility.length > 25 ? property.utility.substring(0, 25) + '...' : property.utility;
  doc.text(utilityText, 95, yPos + 32);

  yPos += 45;

  // Property Details
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...graphiteBlack);
  doc.text('PROPERTY DETAILS', 20, yPos);
  yPos += 8;

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...concrete);
  doc.text('Property Owner:', 20, yPos);
  doc.setTextColor(...graphiteBlack);
  doc.text(property.ownerName, 60, yPos);
  yPos += 7;

  doc.setTextColor(...concrete);
  doc.text('Ownership Type:', 20, yPos);
  doc.setTextColor(...graphiteBlack);
  doc.text(property.type, 60, yPos);
  yPos += 15;

  // Value Proposition
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...graphiteBlack);
  doc.text('WHY THIS OPPORTUNITY IS VIABLE', 20, yPos);
  yPos += 10;

  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text(property.isOwned ? 'Direct Control' : 'Favorable Landlord Relationship', 20, yPos);
  yPos += 5;
  doc.setFont('helvetica', 'normal');
  const controlText = property.isOwned
    ? 'As the property owner, you have direct control to move quickly on this opportunity.'
    : 'Strong landlord relationship enables smooth negotiations and mutual benefits.';
  doc.text(doc.splitTextToSize(controlText, 170), 20, yPos);
  yPos += 12;

  doc.setFont('helvetica', 'bold');
  doc.text('Developer Ready', 20, yPos);
  yPos += 5;
  doc.setFont('helvetica', 'normal');
  doc.text(doc.splitTextToSize('We already have developer interest and indicative pricing in hand, ready to move forward.', 170), 20, yPos);
  yPos += 12;

  doc.setFont('helvetica', 'bold');
  doc.text('⚡ URGENT: Market Timing & ITC Expiration', 20, yPos);
  yPos += 5;
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(200, 0, 0);
  doc.text(doc.splitTextToSize('Current lease rates are at their peaks due to strong incentive structures including the ITC. These rates are expected to decline as federal incentives phase out.', 170), 20, yPos);
  yPos += 15;

  // Next Steps CTA
  doc.setFillColor(...graphiteBlack);
  doc.rect(20, yPos, 170, 30, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('NEXT STEPS', 105, yPos + 10, { align: 'center' });
  yPos += 17;
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  const ctaText = "We'd like to schedule a short working session (30 minutes) to walk through the specific economics, confirm ownership assumptions, and align on whether this fits your near-term priorities.";
  doc.text(doc.splitTextToSize(ctaText, 160), 105, yPos, { align: 'center' });

  // Footer
  yPos = 270;
  doc.setFontSize(8);
  doc.setTextColor(...concrete);
  doc.text('Lumen Energy  •  Turning rooftops into revenue', 105, yPos, { align: 'center' });
  doc.text(`Generated for ${partnerName}  •  ${new Date().toLocaleDateString()}`, 105, yPos + 4, { align: 'center' });

  // Save the PDF
  const filename = `${property.portfolio.replace(/\s+/g, '_')}_${property.address.split(',')[0].replace(/\s+/g, '_')}_Community_Solar.pdf`;
  doc.save(filename);
}
