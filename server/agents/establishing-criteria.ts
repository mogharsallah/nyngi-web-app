import { tool, ToolLoopAgent, stepCountIs } from 'ai'
import { google } from '@ai-sdk/google'
import { z } from 'zod'
import { loadMarkdown } from '@/server/lib/fs/file-loader'
import NamingSessionService from '@/server/services/naming-session'
import type { Criteria } from '@/common/types/session'
import type { DeepPartial } from '@/common/types/utils'

const instructions = loadMarkdown('server/agents/instructions/establishing-criteria/foundational-identity-v1.md')

// Flat schema for safe deep merging - maps to nested Criteria type
const updateCriteriaInputSchema = z.object({
  // Phase 1: Identity
  core_concept: z
    .string()
    .optional()
    .describe('The literal, unadorned SVO explanation of the product/service. Provides raw nouns/verbs for brainstorming, avoiding marketing fluff.'),
  origin_story: z
    .string()
    .optional()
    .describe('The narrative moment/insight/grievance that sparked creation. Extracts unique imagery for metaphorical naming pathways.'),
  future_horizon: z
    .string()
    .optional()
    .describe('Specific product categories/services for 5-10 year expansion. Tests Brand Elasticity to avoid the "RadioShack Trap".'),
  differentiators: z.string().optional().describe('Unique attributes separating from the "Sea of Sameness", distinct from baseline industry standards.'),
  internal_culture: z
    .string()
    .optional()
    .describe('Behavioral DNA of team/founder (e.g., "Formal & Academic" vs "Scrappy & Loud"). Acts as Truth Filter for cognitive dissonance.'),
  brand_atmosphere: z
    .string()
    .optional()
    .describe('Sensory details of physical workspace/digital interface (textures, lighting, noise). Grounds abstract adjectives in physical reality.'),

  // Phase 2: Market Ecology
  competitors: z
    .array(z.string())
    .optional()
    .describe('Primary direct competitors and significant indirect alternatives. Required to identify sector "Unwritten Rules".'),
  risk_appetite: z
    .string()
    .optional()
    .describe('Psychological tolerance for unusualness: Safe/Descriptive to Abstract/Bizarre. Calibrates "Creative Temperature".'),
  geographic_scope: z
    .array(z.string())
    .optional()
    .describe('Specific regions/countries for immediate launch and future expansion. Triggers "Linguistic Disaster Check".'),
  geographical_level: z.number().min(1).max(5).optional().describe('Geographic scope scale: 1=Local, 5=Global.'),
  market_noise_level: z
    .number()
    .min(1)
    .max(5)
    .optional()
    .describe('Advertising intensity/brand saturation: 1=Quiet Niche, 5=Superbowl Commercials. Determines required "Signal Entropy".'),

  // Phase 3: Audience
  interaction_model: z
    .array(z.string())
    .optional()
    .describe('B2B or B2C (can be multiple). Sets "Descriptiveness Threshold"—B2B demands clarity/trust, B2C rewards abstraction.'),
  demographics: z.string().optional().describe('Specific age range, gender, job role of decision-maker. Determines "Cultural Literacy" and "Phonetic Risk".'),
  price_positioning: z
    .array(z.string())
    .optional()
    .describe('Economy, Mid-Market, or Luxury/Premium (can span tiers for "Masstige"). Dictates "Tonal Exclusivity".'),
  emotional_payoff: z
    .string()
    .optional()
    .describe('The psychological shift customer buys (e.g., "Anxious→Secure", "Bored→Thrilled"). Primary fuel for "Metaphor Engine".'),

  // Phase 4: Tonality
  sensory_texture: z
    .string()
    .optional()
    .describe('Adjectives for weight/speed/texture (e.g., "Heavy/Granite", "Fast/Liquid", "Sharp/Glass"). Leverages Sound Symbolism.'),
  loved_brands: z
    .array(z.string())
    .optional()
    .describe('3-5 existing brands (any industry) stakeholders love, with reasons. Used for Hidden Pattern Recognition.'),
  hated_brands: z.array(z.string()).optional().describe('3-5 existing brands stakeholders hate, with reasons. Reveals anti-patterns to avoid.'),

  // Phase 5: Logistics (Constraints)
  discovery_vector: z
    .array(z.string())
    .optional()
    .describe('How name is primarily encountered: Visual/Shelf or Auditory/Referral. Operationalizes "Bar Test" vs "Billboard Test".'),
  domain_constraint: z
    .string()
    .optional()
    .describe('Domain requirements: Essential (Exact .com), Flexible (Get[Name].com), or Irrelevant (App Store only). Defines "Abstraction Constraint".'),
  trademark_tier: z
    .string()
    .optional()
    .describe('Protection scope: CommonLaw (Local), USPTO (National), or Global (WIPO). The "Viability Filter" for name defensibility.'),
  seo_priority: z.string().optional().describe('Reliance on Organic Search vs Paid Acquisition: High or Low. Solves the "Dictionary Problem".'),
  social_handle_constraint: z
    .string()
    .optional()
    .describe('Matching social handles requirement: Exact (@Name), Flexible (@NameOfficial), or None. Secondary "Unusualness Check".'),

  // Phase 6: Miscellaneous
  creative_wildcards: z
    .array(z.string())
    .optional()
    .describe('Specific ideas, words, or partial concepts client is attached to. Treated as "Seed Words" for brainstorming.'),
  stakeholder_mandates: z
    .array(z.string())
    .optional()
    .describe('Absolute Must-Haves/Must-Not-Haves that defy logic (e.g., "Must start with A"). Act as "Binary Filters".'),
})

const updateCriteriaTool = tool({
  description:
    'Updates the naming criteria brief and returns the latest full version. Call this immediately when ANY new data is extracted from user input. The flat structure ensures safe deep merging.',

  inputSchema: updateCriteriaInputSchema,
  execute: async (input, options) => {
    const typedContext = options.experimental_context as { userId: string; sessionId: string }

    // Map flat tool input to nested Criteria type
    const criteria: DeepPartial<Criteria> = {}

    // Phase 1: Identity
    if (input.core_concept || input.origin_story || input.future_horizon || input.differentiators || input.internal_culture || input.brand_atmosphere) {
      criteria.identity = {}
      if (input.core_concept) criteria.identity.coreConcept = input.core_concept
      if (input.origin_story) criteria.identity.originStory = input.origin_story
      if (input.future_horizon) criteria.identity.futureHorizon = input.future_horizon
      if (input.differentiators) criteria.identity.differentiators = input.differentiators
      if (input.internal_culture) criteria.identity.internalCulture = input.internal_culture
      if (input.brand_atmosphere) criteria.identity.brandAtmosphere = input.brand_atmosphere
    }

    // Phase 2: Market Ecology
    if (
      input.competitors ||
      input.risk_appetite ||
      input.geographic_scope ||
      input.geographical_level !== undefined ||
      input.market_noise_level !== undefined
    ) {
      criteria.market = {}
      if (input.competitors) criteria.market.competitors = input.competitors
      if (input.risk_appetite) criteria.market.riskAppetite = input.risk_appetite
      if (input.geographic_scope) criteria.market.geographicScope = input.geographic_scope
      if (input.geographical_level !== undefined) criteria.market.geographicalLevel = input.geographical_level
      if (input.market_noise_level !== undefined) criteria.market.marketNoiseLevel = input.market_noise_level
    }

    // Phase 3: Audience
    if (input.interaction_model || input.demographics || input.price_positioning || input.emotional_payoff) {
      criteria.audience = {}
      if (input.interaction_model) criteria.audience.interactionModel = input.interaction_model
      if (input.demographics) criteria.audience.demographics = input.demographics
      if (input.price_positioning) criteria.audience.pricePositioning = input.price_positioning
      if (input.emotional_payoff) criteria.audience.emotionalPayoff = input.emotional_payoff
    }

    // Phase 4: Tonality
    if (input.sensory_texture || input.loved_brands || input.hated_brands) {
      criteria.tonality = {}
      if (input.sensory_texture) criteria.tonality.sensoryTexture = input.sensory_texture
      if (input.loved_brands || input.hated_brands) {
        criteria.tonality.aestheticPrecedents = {}
        if (input.loved_brands) criteria.tonality.aestheticPrecedents.lovedBrands = input.loved_brands
        if (input.hated_brands) criteria.tonality.aestheticPrecedents.hatedBrands = input.hated_brands
      }
    }

    // Phase 5: Logistics (Constraints)
    if (input.discovery_vector || input.domain_constraint || input.trademark_tier || input.seo_priority || input.social_handle_constraint) {
      criteria.logistics = {}
      if (input.discovery_vector) criteria.logistics.discoveryVector = input.discovery_vector
      if (input.domain_constraint) criteria.logistics.domainConstraint = input.domain_constraint
      if (input.trademark_tier) criteria.logistics.trademarkTier = input.trademark_tier
      if (input.seo_priority) criteria.logistics.seoPriority = input.seo_priority
      if (input.social_handle_constraint) criteria.logistics.socialHandleConstraint = input.social_handle_constraint
    }

    // Phase 6: Miscellaneous
    if (input.creative_wildcards || input.stakeholder_mandates) {
      criteria.misc = {}
      if (input.creative_wildcards) criteria.misc.creativeWildcards = input.creative_wildcards
      if (input.stakeholder_mandates) criteria.misc.stakeholderMandates = input.stakeholder_mandates
    }

    const { data, error } = await NamingSessionService.updateCriteria(typedContext.sessionId, typedContext.userId, criteria)
    if (error) {
      return null
    }
    console.log(`Updating criteria for user: ${typedContext.userId}`, criteria)
    return data.criteria
  },
})

export const establishingCriteriaAgent = new ToolLoopAgent({
  model: google('gemini-3-pro-preview'),
  stopWhen: stepCountIs(6),
  callOptionsSchema: z.object({
    userName: z.string().optional(),
    userId: z.string(),
    sessionId: z.string(),
    user_language: z.string(),
  }),
  instructions,
  tools: {
    update_criteria: updateCriteriaTool,
  },
  prepareCall: ({ options, ...settings }) => ({
    ...settings,
    experimental_context: {
      userId: options.userId,
      sessionId: options.sessionId,
    },
    instructions:
      settings.instructions +
      `\nUser context:
- user Language: ${options.user_language}
`,
  }),
})
