export interface BoostOffer {
  gameName: string;
  currentRank: string;
  desiredRank: string;
  currentRP: string;
  platform: string;
  notes?: string;
  priceUSD: number;
  sectionLabel?: string; // ex. "Section 1"
}
