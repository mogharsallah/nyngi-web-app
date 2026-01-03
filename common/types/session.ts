export type SessionPlan = 'velocity' | 'legacy'

export type Criteria = {
  // Phase 1: Identity
  identity: {
    coreConcept: string
    originStory: string
    futureHorizon: string
    differentiators: string
    internalCulture: string
    brandAtmosphere: string
  }

  // Phase 2: Market Ecology
  market: {
    competitors: string[]

    /** * The appetite for "Unusualness".
     * Examples: 'Safe', 'Disruptive', or 'Safe brand but disruptive product'
     */
    riskAppetite: string

    geographicScope: string[]

    /** * 1-5 scale
     * e.g., 5 for "Global", 1 for "Local"
     */
    geographicalLevel: number

    /** * 1-5 scale
     * e.g., 5 for "Highly saturated", 1 for "New market"
     */
    marketNoiseLevel: number
  }

  // Phase 3: Audience
  audience: {
    /** * Can be multiple.
     * e.g., ['B2B', 'B2C'] or ['B2G', 'Enterprise']
     */
    interactionModel: ('B2B' | 'B2C' | string)[]

    demographics: string

    /** * Can span tiers.
     * e.g., ['Mid-Market', 'Luxury'] for "Masstige" brands.
     */
    pricePositioning: ('Economy' | 'Mid-Market' | 'Luxury' | string)[]

    emotionalPayoff: string
  }

  // Phase 4: Tonality
  tonality: {
    sensoryTexture: string
    aestheticPrecedents: {
      lovedBrands: string[]
      hatedBrands: string[]
    }
  }

  // Phase 5: Logistics (Constraints)
  logistics: {
    /** * How the name is encountered. Most brands are both.
     * e.g., ['Auditory', 'Visual']
     */
    discoveryVector: ('Auditory' | 'Visual' | string)[]

    /** * e.g., "Exact .com needed for main brand, flexible for product"
     */
    domainConstraint: 'Essential' | 'Flexible' | 'Irrelevant' | string

    /** * e.g., "USPTO Class 9 and 42 only"
     */
    trademarkTier: 'CommonLaw' | 'USPTO' | 'Global' | string

    seoPriority: 'High' | 'Low' | string

    socialHandleConstraint: 'Exact' | 'Flexible' | 'None' | string
  }

  // Phase 6: Miscellaneous
  misc: {
    creativeWildcards: string[]
    stakeholderMandates: string[]
  }
}
