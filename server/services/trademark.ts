/**
 * Trademark Service
 * Handles interactions with Signa.so API for trademark searches and clearance.
 */

export interface RiskResult {
  riskLevel: 'CLEAR' | 'LOW' | 'MEDIUM' | 'HIGH'
  details: string
}
