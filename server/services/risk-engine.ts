/**
 * Risk Engine Service
 * Calculates overall risk score based on trademark data and other factors.
 */

export interface RiskAssessment {
  score: number // 0-100
  status: 'green' | 'amber' | 'red'
  factors: string[]
}
