import { pdf } from '@react-pdf/renderer';
import { PropertyPDF } from './PropertyPDF';
import { Property } from '@/lib/types/property';

/**
 * Converts an image URL to a data URL
 */
async function urlToDataUrl(url: string): Promise<string> {
  try {
    const response = await fetch(url);
    const blob = await response.blob();
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  } catch (error) {
    console.error(`Failed to convert ${url} to data URL:`, error);
    return '';
  }
}

/**
 * Captures a satellite map element as a data URL
 */
async function captureSatelliteMap(address: string): Promise<string> {
  try {
    // Try to find the map container in the DOM
    const mapContainer = document.querySelector('[data-satellite-map]') as HTMLElement;
    if (!mapContainer) {
      console.warn('Satellite map container not found');
      return '';
    }

    // Use html2canvas to capture the map
    const html2canvas = (await import('html2canvas')).default;
    const canvas = await html2canvas(mapContainer, {
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#F5F5F5',
    });

    return canvas.toDataURL('image/jpeg', 0.8);
  } catch (error) {
    console.error('Failed to capture satellite map:', error);
    return '';
  }
}

interface GeneratePDFOptions {
  property: Property;
  partnerName: string;
  isIllinois?: boolean;
}

/**
 * Generates and downloads a property PDF
 */
export async function generatePropertyPDF({
  property,
  partnerName,
  isIllinois = false,
}: GeneratePDFOptions): Promise<void> {
  try {
    // Convert logos to data URLs
    const [lumenLogoDataUrl, partnerLogoDataUrl, satelliteImageDataUrl] = await Promise.all([
      urlToDataUrl('/logos/lumen/logo-black.svg'),
      partnerName.toLowerCase() === 'watershed'
        ? urlToDataUrl('/logos/watershed/watershed-horizontal-dark.svg')
        : '',
      captureSatelliteMap(property.address),
    ]);

    // Generate PDF
    const blob = await pdf(
      PropertyPDF({
        property,
        partnerName,
        satelliteImageDataUrl,
        lumenLogoDataUrl,
        partnerLogoDataUrl,
        isIllinois,
      })
    ).toBlob();

    // Create download link
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;

    // Clean filename: remove special characters and limit length
    const addressForFilename = property.address
      .replace(/[^a-zA-Z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .substring(0, 50);

    link.download = `Lumen-${property.portfolio}-${addressForFilename}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Failed to generate PDF:', error);
    throw error;
  }
}
