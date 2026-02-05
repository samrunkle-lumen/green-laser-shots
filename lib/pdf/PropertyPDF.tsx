import React from 'react';
import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';
import { Property } from '@/lib/types/property';

const COLORS = {
  skyBlue: '#B1E5FF',
  electricYellow: '#DFFF5E',
  graphiteBlack: '#1A1A1A',
  concrete: '#9FA38F',
  white: '#FFFFFF',
  lightGray: '#F5F5F5',
};

const styles = StyleSheet.create({
  page: {
    backgroundColor: COLORS.white,
    padding: 35,
    fontFamily: 'Helvetica',
    fontSize: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    paddingBottom: 15,
    borderBottom: `2px solid ${COLORS.lightGray}`,
  },
  logo: {
    width: 100,
    height: 30,
    objectFit: 'contain',
  },
  partnerLogo: {
    width: 85,
    height: 25,
    objectFit: 'contain',
  },
  title: {
    fontSize: 22,
    fontFamily: 'Helvetica-Bold',
    color: COLORS.graphiteBlack,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 11,
    color: COLORS.concrete,
    marginBottom: 10,
  },
  badge: {
    backgroundColor: COLORS.electricYellow,
    color: COLORS.graphiteBlack,
    fontSize: 8,
    fontFamily: 'Helvetica-Bold',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 3,
    alignSelf: 'flex-start',
    marginBottom: 15,
  },
  badgeLeased: {
    backgroundColor: COLORS.skyBlue,
  },
  satelliteImage: {
    width: '100%',
    height: 180,
    objectFit: 'cover',
    borderRadius: 6,
    marginBottom: 15,
  },
  section: {
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 14,
    fontFamily: 'Helvetica-Bold',
    color: COLORS.graphiteBlack,
    marginBottom: 8,
  },
  row: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 12,
  },
  card: {
    backgroundColor: COLORS.lightGray,
    padding: 12,
    borderRadius: 6,
    flex: 1,
  },
  cardLabel: {
    fontSize: 8,
    color: COLORS.concrete,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  cardValue: {
    fontSize: 18,
    fontFamily: 'Helvetica-Bold',
    color: COLORS.graphiteBlack,
    marginBottom: 2,
  },
  cardSubtext: {
    fontSize: 8,
    color: COLORS.concrete,
  },
  detailsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  detailItem: {
    width: '48%',
    marginBottom: 6,
  },
  detailLabel: {
    fontSize: 8,
    color: COLORS.concrete,
    marginBottom: 2,
  },
  detailValue: {
    fontSize: 9,
    fontFamily: 'Helvetica-Bold',
    color: COLORS.graphiteBlack,
  },
  highlightBox: {
    backgroundColor: `${COLORS.skyBlue}15`,
    borderLeft: `3px solid ${COLORS.skyBlue}`,
    padding: 12,
    borderRadius: 4,
    marginBottom: 12,
  },
  highlightBoxYellow: {
    backgroundColor: `${COLORS.electricYellow}25`,
    borderLeft: `3px solid ${COLORS.electricYellow}`,
  },
  highlightTitle: {
    fontSize: 11,
    fontFamily: 'Helvetica-Bold',
    color: COLORS.graphiteBlack,
    marginBottom: 6,
  },
  highlightText: {
    fontSize: 9,
    color: COLORS.graphiteBlack,
    lineHeight: 1.4,
  },
  bulletPoint: {
    fontSize: 9,
    color: COLORS.graphiteBlack,
    marginBottom: 4,
    paddingLeft: 12,
    lineHeight: 1.4,
  },
  valueGrid: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  valueCard: {
    flex: 1,
    backgroundColor: COLORS.lightGray,
    padding: 10,
    borderRadius: 6,
  },
  valueCardTitle: {
    fontSize: 10,
    fontFamily: 'Helvetica-Bold',
    color: COLORS.graphiteBlack,
    marginBottom: 4,
  },
  valueCardText: {
    fontSize: 8,
    color: COLORS.concrete,
    lineHeight: 1.3,
  },
  compactBox: {
    backgroundColor: `${COLORS.skyBlue}15`,
    padding: 10,
    borderRadius: 4,
    marginBottom: 8,
  },
  compactTitle: {
    fontSize: 10,
    fontFamily: 'Helvetica-Bold',
    color: COLORS.graphiteBlack,
    marginBottom: 4,
  },
  compactText: {
    fontSize: 8,
    color: COLORS.graphiteBlack,
    lineHeight: 1.3,
  },
  processSection: {
    marginBottom: 10,
  },
  processTitle: {
    fontSize: 11,
    fontFamily: 'Helvetica-Bold',
    color: COLORS.graphiteBlack,
    marginBottom: 6,
  },
  processText: {
    fontSize: 8,
    color: COLORS.graphiteBlack,
    lineHeight: 1.4,
    marginBottom: 8,
  },
  ctaBox: {
    backgroundColor: COLORS.graphiteBlack,
    padding: 15,
    borderRadius: 6,
    marginTop: 10,
  },
  ctaTitle: {
    fontSize: 13,
    fontFamily: 'Helvetica-Bold',
    color: COLORS.white,
    marginBottom: 6,
    textAlign: 'center',
  },
  ctaText: {
    fontSize: 9,
    color: COLORS.concrete,
    textAlign: 'center',
    lineHeight: 1.4,
  },
  footer: {
    position: 'absolute',
    bottom: 25,
    left: 35,
    right: 35,
    paddingTop: 12,
    borderTop: `1px solid ${COLORS.lightGray}`,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  footerText: {
    fontSize: 8,
    color: COLORS.concrete,
  },
});

interface PropertyPDFProps {
  property: Property;
  partnerName: string;
  satelliteImageDataUrl?: string;
  lumenLogoDataUrl?: string;
  partnerLogoDataUrl?: string;
  isIllinois?: boolean;
}

export const PropertyPDF = ({
  property,
  partnerName,
  satelliteImageDataUrl,
  lumenLogoDataUrl,
  partnerLogoDataUrl,
  isIllinois = false,
}: PropertyPDFProps) => {
  const ownershipTitle = property.isOwned ? 'Customer-Owned Property' : `Leased from ${property.ownerName}`;
  const ownershipDescription = property.isOwned
    ? 'As the owner, you have direct control to pursue this opportunity. The annual value flows directly to your organization with no capital required.'
    : `Leased from ${property.ownerName}. We facilitate landlord discussions to ensure both parties benefit through energy savings and lease revenue sharing.`;

  const benefits = property.isOwned
    ? ['Direct control and faster execution', 'Full lease revenue to your organization', 'No landlord approval needed', 'Zero capital investment required']
    : ['Energy savings via community solar', 'Lease revenue during occupancy', 'We handle landlord negotiations', 'Strengthens landlord relationship'];

  return (
    <Document>
      {/* PAGE 1 */}
      <Page size="LETTER" style={styles.page}>
        {/* Header with Logos */}
        <View style={styles.header}>
          {lumenLogoDataUrl ? (
            <Image src={lumenLogoDataUrl} style={styles.logo} cache={false} />
          ) : (
            <Text style={{ fontSize: 16, fontFamily: 'Helvetica-Bold' }}>Lumen Energy</Text>
          )}
          {partnerLogoDataUrl ? (
            <Image src={partnerLogoDataUrl} style={styles.partnerLogo} cache={false} />
          ) : (
            <Text style={{ fontSize: 12 }}>{partnerName}</Text>
          )}
        </View>

        {/* Property Title */}
        <Text style={styles.title}>{property.address}</Text>
        <Text style={styles.subtitle}>{property.portfolio}</Text>
        <View style={[styles.badge, !property.isOwned && styles.badgeLeased]}>
          <Text>{property.isOwned ? 'CUSTOMER OWNED' : 'LEASED PROPERTY'}</Text>
        </View>

        {/* Satellite Image */}
        {satelliteImageDataUrl && <Image src={satelliteImageDataUrl} style={styles.satelliteImage} cache={false} />}

        {/* Economics Summary */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Economics at a Glance</Text>
          <View style={styles.row}>
            <View style={styles.card}>
              <Text style={styles.cardLabel}>ANNUAL VALUE</Text>
              <Text style={styles.cardValue}>{property.leasePerYear}</Text>
              <Text style={styles.cardSubtext}>per year{!property.isOwned ? ' (split with landlord)' : ''}</Text>
            </View>
            <View style={styles.card}>
              <Text style={styles.cardLabel}>SYSTEM SIZE</Text>
              <Text style={styles.cardValue}>{property.systemSize.toLocaleString()} kW</Text>
              <Text style={styles.cardSubtext}>Solar capacity</Text>
            </View>
          </View>
        </View>

        {/* Property Details */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Property Information</Text>
          <View style={styles.detailsGrid}>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>ADDRESS</Text>
              <Text style={styles.detailValue}>{property.address}</Text>
            </View>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>UTILITY PROVIDER</Text>
              <Text style={styles.detailValue}>{property.utility}</Text>
            </View>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>PROPERTY OWNER</Text>
              <Text style={styles.detailValue}>{property.ownerName}</Text>
            </View>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>OWNERSHIP TYPE</Text>
              <Text style={styles.detailValue}>{property.type}</Text>
            </View>
          </View>
        </View>

        {/* Ownership Box */}
        <View style={styles.highlightBox}>
          <Text style={styles.highlightTitle}>{ownershipTitle}</Text>
          <Text style={styles.highlightText}>{ownershipDescription}</Text>
          <View style={{ marginTop: 6 }}>
            {benefits.map((benefit, index) => (
              <Text key={index} style={styles.bulletPoint}>
                • {benefit}
              </Text>
            ))}
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>Lumen Energy</Text>
          <Text style={styles.footerText}>Turning Rooftops Into Revenue</Text>
          <Text style={styles.footerText}>rooftopsintorevenue.com</Text>
        </View>
      </Page>

      {/* PAGE 2 */}
      <Page size="LETTER" style={styles.page}>
        {/* Why This Opportunity is Viable */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Why This Opportunity is Viable</Text>
          <View style={styles.valueGrid}>
            <View style={styles.valueCard}>
              <Text style={styles.valueCardTitle}>{property.isOwned ? 'Direct Control' : 'Strong Relationship'}</Text>
              <Text style={styles.valueCardText}>
                {property.isOwned ? 'Direct control to move quickly on this opportunity.' : 'Favorable relationship enables smooth negotiations.'}
              </Text>
            </View>
            <View style={styles.valueCard}>
              <Text style={styles.valueCardTitle}>Developer Ready</Text>
              <Text style={styles.valueCardText}>Developer interest and indicative pricing already in hand.</Text>
            </View>
            <View style={styles.valueCard}>
              <Text style={styles.valueCardTitle}>ITC Timing</Text>
              <Text style={styles.valueCardText}>Rates at peak due to federal ITC. Will decline as ITC steps down.</Text>
            </View>
          </View>
        </View>

        {/* Illinois Benefit */}
        {isIllinois && (
          <View style={[styles.highlightBox, styles.highlightBoxYellow]}>
            <Text style={styles.highlightTitle}>Illinois Community Solar Benefit</Text>
            <Text style={styles.highlightText}>
              Subscribe your loads to the rooftop project for a typical 5% fixed discount on electricity rates.
            </Text>
          </View>
        )}

        {/* Condensed Additional Benefits */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Additional Benefits</Text>

          <View style={styles.compactBox}>
            <Text style={styles.compactTitle}>Renewable Energy Credits (RECs)</Text>
            <Text style={styles.compactText}>
              Developers can offer replacement RECs to maintain your renewable energy commitments while benefiting from solar lease revenue.
            </Text>
          </View>

          <View style={styles.compactBox}>
            <Text style={styles.compactTitle}>Roof Installation Financing</Text>
            <Text style={styles.compactText}>
              If roof replacement is needed, developers can often offer upfront payments to cover installations at no initial cost to your organization.
            </Text>
          </View>
        </View>

        {/* Process Overview */}
        <View style={styles.processSection}>
          <Text style={styles.processTitle}>How Community Solar Works</Text>
          <Text style={styles.processText}>
            1. Developer installs and operates solar on your roof at no cost to you
          </Text>
          <Text style={styles.processText}>
            2. They sell electricity from the solar project to local residents via utility bill credits
          </Text>
          <Text style={styles.processText}>
            3. You receive {property.isOwned ? 'annual lease revenue' : 'energy savings and a share of lease revenue'}
          </Text>
          <Text style={styles.processText}>
            4. Typical project life: 25+ years with developer handling all operations and maintenance
          </Text>
        </View>

        {/* CTA */}
        <View style={styles.ctaBox}>
          <Text style={styles.ctaTitle}>Next Steps</Text>
          <Text style={styles.ctaText}>
            We'd like to schedule a 30-minute working session to walk through the specific economics, confirm ownership assumptions, and align on
            whether this fits your near-term priorities.
          </Text>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>Lumen Energy</Text>
          <Text style={styles.footerText}>Turning Rooftops Into Revenue</Text>
          <Text style={styles.footerText}>rooftopsintorevenue.com</Text>
        </View>
      </Page>
    </Document>
  );
};
