import axios from 'axios';

export interface LocationData {
  country: string;
  countryCode: string;
  currency: string;
  region: string;
}

export interface PricingTier {
  currency: string;
  symbol: string;
  premium: { 3: number; 6: number; 12: number };
  innerCircle: { 3: number; 6: number; 12: number };
}

export const pricingByCountry: Record<string, PricingTier> = {
  IN: {
    currency: 'INR',
    symbol: '₹',
    premium: { 3: 799, 6: 1499, 12: 2499 },
    innerCircle: { 3: 1999, 6: 3499, 12: 4999 }
  },
  US: {
    currency: 'USD',
    symbol: '$',
    premium: { 3: 19, 6: 29, 12: 49 },
    innerCircle: { 3: 59, 6: 79, 12: 99 }
  },
  default: {
    currency: 'EUR',
    symbol: '€',
    premium: { 3: 17, 6: 27, 12: 47 },
    innerCircle: { 3: 57, 6: 77, 12: 97 }
  }
};

export async function getUserLocation(): Promise<LocationData> {
  try {
    const response = await axios.get('https://ipapi.co/json/');
    return {
      country: response.data.country_name,
      countryCode: response.data.country_code,
      currency: response.data.currency,
      region: response.data.region
    };
  } catch (error) {
    console.error('Failed to get user location:', error);
    return {
      country: 'Unknown',
      countryCode: 'US',
      currency: 'USD',
      region: 'Unknown'
    };
  }
}

export function getPricingForCountry(countryCode: string): PricingTier {
  return pricingByCountry[countryCode] || pricingByCountry.default;
}