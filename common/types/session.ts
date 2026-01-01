export type SessionPlan = 'velocity' | 'legacy'

export type Criteria = {
  // Foundational Identity
  idea: string
  originStory: string[]
  facts: string[]
  futureGoals: string[]
  metaphors: string[]
  values: string[]
  //  Market Ecology & Competitive Landscape
  competitors: string[]
  market: {
    adSpendIntensity: number
    saturation: number
    geographicFootprint: number
  }
  // Target Audience & Demographics
  demographics: string[]
  pricePoint: string
  customerRiskProfile: string[]
  // Tonal Attributes & Personality
  aboutUs: string[]
  personalityAttributes: string[]
  negativeConstraints: string[]
  sensoryAttributes: string[]
  // TODO: add "Permission to Play" Values

  // Preferences & Logistics
  likedBrands: string[]
  dislikedBrands: string[]
  trademark: {
    domainNames: {
      tlds: string[]
      specialRequirements: string[]
    }
    // TODO: add trademark specifics
  }
  personalPreferences: string[]
}
