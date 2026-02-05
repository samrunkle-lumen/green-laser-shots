import React from 'react';
import { Document, Page, Text, View, StyleSheet, Image, Link } from '@react-pdf/renderer';
import { Property } from '@/lib/types/property';

// Lumen brand colors
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
    padding: 40,
    fontFamily: 'Helvetica',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 30,
    paddingBottom: 20,
    borderBottom: `2px solid ${COLORS.lightGray}`,
  },
  logo: {
    width: 120,
    height: 'auto',
  },
  partnerLogo: {
    width: 100,
    height: 'auto',
  },
  title: {
    fontSize: 28,
    fontFamily: 'Helvetica-Bold',
    color: COLORS.graphiteBlack,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: COLORS.concrete,
    marginBottom: 20,
  },
  badge: {
    backgroundColor: COLORS.electricYellow,
    color: COLORS.graphiteBlack,
    fontSize: 10,
    fontFamily: 'Helvetica-Bold',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
    alignSelf: 'flex-start',
    marginBottom: 20,
  },
  badgeLeased: {
    backgroundColor: COLORS.skyBlue,
  },
  satelliteImage: {
    width: '100%',
    height: 250,
    objectFit: 'cover',
    borderRadius: 8,
    marginBottom: 30,
  },
  section: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Helvetica-Bold',
    color: COLORS.graphiteBlack,
    marginBottom: 12,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  card: {
    backgroundColor: COLORS.lightGray,
    padding: 16,
    borderRadius: 8,
    flex: 1,
    marginRight: 10,
  },
  cardLast: {
    marginRight: 0,
  },
  cardLabel: {
    fontSize: 9,
    color: COLORS.concrete,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 6,
  },
  cardValue: {
    fontSize: 24,
    fontFamily: 'Helvetica-Bold',
    color: COLORS.graphiteBlack,
    marginBottom: 4,
  },
  cardSubtext: {
    fontSize: 10,
    color: COLORS.concrete,
  },
  detailRow: {
    flexDirection: 'row',
    paddingVertical: 8,
    borderBottom: `1px solid ${COLORS.lightGray}`,
  },
  detailLabel: {
    fontSize: 10,
    color: COLORS.concrete,
    width: '35%',
  },
  detailValue: {
    fontSize: 10,
    fontFamily: 'Helvetica-Bold',
    color: COLORS.graphiteBlack,
    width: '65%',
  },
  highlightBox: {
    backgroundColor: `${COLORS.skyBlue}20`,
    borderLeft: `4px solid ${COLORS.skyBlue}`,
    padding: 16,
    borderRadius: 4,
    marginBottom: 20,
  },
  highlightBoxYellow: {
    backgroundColor: `${COLORS.electricYellow}30`,
    borderLeft: `4px solid ${COLORS.electricYellow}`,
  },
  highlightTitle: {
    fontSize: 14,
    fontFamily: 'Helvetica-Bold',
    color: COLORS.graphiteBlack,
    marginBottom: 8,
  },
  highlightText: {
    fontSize: 11,
    color: COLORS.graphiteBlack,
    lineHeight: 1.6,
  },
  bulletPoint: {
    fontSize: 11,
    color: COLORS.graphiteBlack,
    marginBottom: 8,
    paddingLeft: 15,
    lineHeight: 1.5,
  },
  benefitsList: {
    marginTop: 12,
  },
  valuePropositionGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  valueCard: {
    width: '32%',
    backgroundColor: COLORS.lightGray,
    padding: 12,
    borderRadius: 8,
  },
  valueCardTitle: {
    fontSize: 11,
    fontFamily: 'Helvetica-Bold',
    color: COLORS.graphiteBlack,
    marginBottom: 6,
    marginTop: 8,
  },
  valueCardText: {
    fontSize: 9,
    color: COLORS.concrete,
    lineHeight: 1.5,
  },
  iconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.electricYellow,
    marginBottom: 8,
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 40,
    right: 40,
    paddingTop: 20,
    borderTop: `2px solid ${COLORS.lightGray}`,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  footerText: {
    fontSize: 9,
    color: COLORS.concrete,
  },
  ctaBox: {
    backgroundColor: COLORS.graphiteBlack,
    padding: 20,
    borderRadius: 8,
    marginTop: 20,
    marginBottom: 60,
  },
  ctaTitle: {
    fontSize: 16,
    fontFamily: 'Helvetica-Bold',
    color: COLORS.white,
    marginBottom: 8,
    textAlign: 'center',
  },
  ctaText: {
    fontSize: 10,
    color: COLORS.concrete,
    textAlign: 'center',
    lineHeight: 1.6,
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
  const ownershipTitle = property.isOwned
    ? 'Customer-Owned Property'
    : `Leased from ${property.ownerName}`;

  const ownershipDescription = property.isOwned
    ? 'As the owner of this facility, you have direct control over pursuing this opportunity. The annual value would flow directly to your organization, with no capital required from your team.'
    : `This facility is leased from ${property.ownerName}. We facilitate the discussion with your landlord to ensure both parties benefit - you receive energy savings and a portion of the lease revenue during your occupancy, while your landlord receives long-term lease income.`;

  const benefits = property.isOwned
    ? [
        'Direct control over decision-making and timeline',
        'Full lease revenue flows to your organization',
        'No landlord approval needed - faster project execution',
        'Zero capital investment required from your team',
      ]
    : [
        'Energy savings through community solar subscription',
        'Portion of lease revenue during your occupancy',
        'We handle all landlord negotiations and coordination',
        'Strengthens landlord relationship through mutual benefit',
      ];

  return (
    <Document>
      <Page size="LETTER" style={styles.page}>
        {/* Header with Logos */}
        <View style={styles.header}>
          {lumenLogoDataUrl && (
            <Image src={lumenLogoDataUrl} style={styles.logo} />
          )}
          {partnerLogoDataUrl && (
            <Image src={partnerLogoDataUrl} style={styles.partnerLogo} />
          )}
        </View>

        {/* Property Title */}
        <Text style={styles.title}>{property.address}</Text>
        <Text style={styles.subtitle}>{property.portfolio}</Text>
        <View style={[styles.badge, !property.isOwned && styles.badgeLeased]}>
          <Text>{property.isOwned ? 'CUSTOMER OWNED' : 'LEASED PROPERTY'}</Text>
        </View>

        {/* Satellite Image */}
        {satelliteImageDataUrl && (
          <Image src={satelliteImageDataUrl} style={styles.satelliteImage} />
        )}

        {/* Economics Summary */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Economics Summary</Text>
          <View style={styles.row}>
            <View style={styles.card}>
              <Text style={styles.cardLabel}>ANNUAL LEASE VALUE</Text>
              <Text style={styles.cardValue}>{property.leasePerYear}</Text>
              <Text style={styles.cardSubtext}>per year</Text>
              {!property.isOwned && (
                <Text style={[styles.cardSubtext, { marginTop: 4 }]}>
                  Split with landlord
                </Text>
              )}
            </View>
            <View style={[styles.card, styles.cardLast]}>
              <Text style={styles.cardLabel}>SYSTEM SIZE</Text>
              <Text style={styles.cardValue}>
                {property.systemSize.toLocaleString()} kW
              </Text>
              <Text style={styles.cardSubtext}>Solar capacity</Text>
            </View>
          </View>
        </View>

        {/* Property Details */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Property Details</Text>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Address</Text>
            <Text style={styles.detailValue}>{property.address}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Utility Provider</Text>
            <Text style={styles.detailValue}>{property.utility}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Property Owner</Text>
            <Text style={styles.detailValue}>{property.ownerName}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Ownership Type</Text>
            <Text style={styles.detailValue}>{property.type}</Text>
          </View>
        </View>

        {/* Page Break */}
      </Page>

      <Page size="LETTER" style={styles.page}>
        {/* Ownership Information */}
        <View style={styles.section}>
          <View style={styles.highlightBox}>
            <Text style={styles.highlightTitle}>{ownershipTitle}</Text>
            <Text style={styles.highlightText}>{ownershipDescription}</Text>
            <View style={styles.benefitsList}>
              {benefits.map((benefit, index) => (
                <Text key={index} style={styles.bulletPoint}>
                  • {benefit}
                </Text>
              ))}
            </View>
          </View>
        </View>

        {/* Why This Opportunity is Viable */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Why This Opportunity is Viable</Text>
          <View style={styles.valuePropositionGrid}>
            <View style={styles.valueCard}>
              <View style={styles.iconCircle} />
              <Text style={styles.valueCardTitle}>
                {property.isOwned ? 'Direct Control' : 'Strong Relationship'}
              </Text>
              <Text style={styles.valueCardText}>
                {property.isOwned
                  ? 'As the property owner, you have direct control to move quickly on this opportunity.'
                  : 'Favorable landlord relationship enables smooth negotiations and mutual benefits.'}
              </Text>
            </View>
            <View style={styles.valueCard}>
              <View style={[styles.iconCircle, { backgroundColor: COLORS.skyBlue }]} />
              <Text style={styles.valueCardTitle}>Developer Ready</Text>
              <Text style={styles.valueCardText}>
                We already have developer interest and indicative pricing in hand,
                ready to move forward.
              </Text>
            </View>
            <View style={styles.valueCard}>
              <View style={styles.iconCircle} />
              <Text style={styles.valueCardTitle}>Market Timing & ITC</Text>
              <Text style={styles.valueCardText}>
                Current lease rates are at their peaks due to the federal Investment
                Tax Credit. Rates will decline as the ITC steps down.
              </Text>
            </View>
          </View>
        </View>

        {/* Illinois Community Solar */}
        {isIllinois && (
          <View style={styles.section}>
            <View style={[styles.highlightBox, styles.highlightBoxYellow]}>
              <Text style={styles.highlightTitle}>Illinois Community Solar Benefit</Text>
              <Text style={styles.highlightText}>
                As a property in Illinois, you can subscribe your electricity loads to the
                community solar project on your rooftop once it's operational.
              </Text>
              <Text style={[styles.bulletPoint, { marginTop: 8 }]}>
                • This typically includes a 5% fixed discount on your electricity rates
                through the community solar subscription.
              </Text>
            </View>
          </View>
        )}

        {/* RECs */}
        <View style={styles.section}>
          <View style={styles.highlightBox}>
            <Text style={styles.highlightTitle}>
              Renewable Energy Credits (RECs)
            </Text>
            <Text style={styles.highlightText}>
              For customers who prioritize environmental attributes and renewable energy
              credits, we have flexible options.
            </Text>
            <Text style={[styles.bulletPoint, { marginTop: 8 }]}>
              • Developers can often offer replacement RECs to ensure your organization
              maintains its renewable energy commitments while still benefiting from the
              solar lease revenue.
            </Text>
          </View>
        </View>

        {/* Roof Installation */}
        <View style={styles.section}>
          <View style={styles.highlightBox}>
            <Text style={styles.highlightTitle}>Roof Installation Financing</Text>
            <Text style={styles.highlightText}>
              If your roof requires replacement or upgrades before solar installation, we
              have solutions to minimize out-of-pocket costs.
            </Text>
            <Text style={[styles.bulletPoint, { marginTop: 8 }]}>
              • Developers can often offer upfront payments that cover new roof
              installations if needed, ensuring your facility is properly prepared for
              the solar system at no initial cost to your organization.
            </Text>
          </View>
        </View>

        {/* CTA */}
        <View style={styles.ctaBox}>
          <Text style={styles.ctaTitle}>Next Steps</Text>
          <Text style={styles.ctaText}>
            We'd like to schedule a short working session (30 minutes) to walk through
            the specific economics for this property, confirm ownership assumptions, and
            align on whether this fits your near-term priorities.
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
