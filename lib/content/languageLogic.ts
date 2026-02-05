import { Property } from '@/lib/types/property';

export function getOwnershipLanguage(property: Property): {
  title: string;
  description: string;
  benefits: string[];
} {
  if (property.isOwned) {
    return {
      title: 'YOUR FACILITY',
      description: `As the owner of this facility, you have direct control over pursuing this opportunity. The annual value of ${property.leasePerYear} would flow directly to your organization, with no capital required from your team.`,
      benefits: [
        'Direct control over decision-making',
        'Full annual revenue from solar lease',
        'No landlord negotiations required',
        'Project can move quickly with your approval'
      ]
    };
  } else {
    return {
      title: `LEASED FROM ${property.ownerName.toUpperCase()}`,
      description: `This facility is leased from ${property.ownerName}. We facilitate the discussion with your landlord to ensure both parties benefit - you receive energy savings and a portion of the lease revenue during your occupancy, while your landlord receives long-term lease income.`,
      benefits: [
        'Energy savings through community solar subscription',
        'Negotiated portion of lease revenue during occupancy',
        'Strengthens landlord relationship',
        'No capital required from your team'
      ]
    };
  }
}

export function getProcessExplanation(ownedCount: number, leasedCount: number): {
  title: string;
  steps: Array<{ title: string; description: string }>;
} {
  const hasOwned = ownedCount > 0;
  const hasLeased = leasedCount > 0;

  // Case 1: Only owned properties
  if (hasOwned && !hasLeased) {
    return {
      title: 'How It Works',
      steps: [
        {
          title: '1. Initial Analysis',
          description: 'We\'ve already analyzed your properties for solar viability, including roof capacity, utility rates, and economic projections.'
        },
        {
          title: '2. Developer Selection',
          description: 'Multiple solar developers compete to lease your roof space, ensuring the best terms and highest annual value.'
        },
        {
          title: '3. Solar Lease Agreement',
          description: 'You sign a long-term solar lease (typically 20-25 years) with the winning developer. The commitment can be transferred at the sale of the building, ensuring continuity for future owners.'
        },
        {
          title: '4. Construction & Operation',
          description: 'The developer builds and operates the solar system at no cost to you. You receive lease payments with no operational burden.'
        }
      ]
    };
  }

  // Case 2: Only leased properties
  if (!hasOwned && hasLeased) {
    return {
      title: 'How It Works',
      steps: [
        {
          title: '1. Lease Addendum (Not Solar Lease)',
          description: 'You sign a simple lease addendum allowing your landlord to pursue solar. You do NOT sign a solar lease - that responsibility stays with your landlord. There is no long-term commitment on your part.'
        },
        {
          title: '2. Landlord Agreement',
          description: 'Your landlord signs the solar lease with the developer (20-25 year commitment). We help negotiate a revenue split that benefits you during your occupancy.'
        },
        {
          title: '3. Community Solar Subscription',
          description: 'You subscribe to the community solar project, receiving discounted electricity (typically 10-20% below utility rates).'
        },
        {
          title: '4. Dual Benefits, No Long-Term Risk',
          description: 'You receive both energy savings and a negotiated portion of the lease revenue during your occupancy. If you move locations, you simply walk away with no ongoing obligation.'
        }
      ]
    };
  }

  // Case 3: Mixed owned and leased properties
  return {
    title: 'How It Works',
    steps: [
      {
        title: '1. Customized Approach',
        description: `You have ${ownedCount} owned and ${leasedCount} leased properties. Each property type follows a different process to match your level of control and commitment.`
      },
      {
        title: '2. Owned Properties: Solar Lease',
        description: 'For your owned facilities, you sign long-term solar leases (20-25 years) directly with developers. These commitments can be transferred at the sale of the building.'
      },
      {
        title: '3. Leased Properties: Addendum Only',
        description: 'For leased facilities, you sign a simple lease addendum (not a solar lease). Your landlord signs the long-term commitment, and you have NO long-term obligation.'
      },
      {
        title: '4. Benefits Across All Properties',
        description: 'Owned properties generate direct lease revenue. Leased properties generate energy savings plus negotiated revenue splits during your occupancy, with no long-term risk.'
      }
    ]
  };
}
