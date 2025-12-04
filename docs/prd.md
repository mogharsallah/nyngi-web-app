```markdown
# Name Your Next Great Idea - Product Requirements Document

**Author:** MG
**Date:** 26 November 2025
**Version:** 1.0

---

## Executive Summary

"Name Your Next Great Idea" is a "Launch Certainty Engine" designed to disrupt the commoditized AI naming market. It bridges the "Legal Chasm" between creative ideation and trademark safety, serving Lean Entrepreneurs and High-Stakes Founders. The platform monetizes user anxiety through a "Trojan Horse" model, offering low-cost "De-Risking Reports" to drive high-margin affiliate hosting revenue and legal lead generation.

### What Makes This Special

The core differentiator is the "Trojan Horse" model which monetizes the _fear_ of legal risk rather than just the naming utility. It is the only platform that treats "Legal Certainty" as the primary product, targeting a <0.5% False Negative Rate in IP safety scoring. It also features "Consultative AI" (Narrative Architect, Tone Matrix) to mimic human branding agency guidance.

---

## Project Classification

**Technical Type:** web_app
**Domain:** legaltech
**Complexity:** high

This project is classified as a **Web Application** (`web_app`) operating in the **LegalTech** (`legaltech`) domain.

### Domain Context

As a LegalTech product, the platform faces high complexity regarding legal ethics, data retention, and liability. Key concerns include trademark infringement risks, the accuracy of "De-Risking Reports" (avoiding unauthorized practice of law), and the secure handling of user data. The "Legal Chasm" concept highlights the critical need for defensibility and risk mitigation in the naming process.

---

## Success Criteria

1.  **Validate the "Trojan Horse" Model:** Successfully convert users from free naming to paid "De-Risking Reports" and affiliate hosting.
2.  **Technical Credibility:** Achieve a False Negative Rate (FNR) of <0.5% in IP safety scoring.
3.  **Unit Economics:** Combined revenue from Reports, Hosting, and Legal Leads must exceed CAC.
4.  **User Trust:** Users perceive the "Traffic Light" system as a reliable indicator of legal safety.

### Business Metrics

- **Report Conversion:** 5.0% - 8.0% of users purchasing the $7.99 De-Risking Report.
- **Hosting Conversion:** 0.5% - 1.0% of users converting to affiliate hosting.
- **Legal Lead Conversion:** 15% - 25% of "High Risk" users converting to attorney consultation.
- **IP Safety Accuracy:** >99.5% Infringement Detection Accuracy.

---

## Product Scope

### MVP - Minimum Viable Product

- **Narrative Architect (Lite):** Chat-based interface for ingesting user criteria and generating names.
- **Traffic Light Risk System:** Real-time visual feedback (Green/Amber/Red) based on preliminary IP checks.
- **De-Risking Report Gateway:** Secure checkout and PDF generation for the $7.99 report.
- **Launch Readiness Checklist:** Dynamic to-do list injecting affiliate hosting links.
- **Legal Filing Pathway:** Lead generation form for "Red" path users.
- **Integration:** 3rd party Trademark APIs (Trademarkia/USPTO) and Affiliate Networks.

### Growth Features (Post-MVP)

- **Brand Canvas (Spatial UI):** Infinite 2D canvas for organizing names.
- **Social Handle Reservor:** Checking and reserving social media handles.
- **Advanced Narrative Architect:** More sophisticated AI branding consultation.
- **Proprietary Legal Database:** Building a custom index to reduce API costs.

### Vision (Future)

- **Full-Service Brand Agency AI:** Complete brand identity generation (logos, style guides) integrated with legal safety.
- **Global IP Protection:** Automated trademark filing across multiple jurisdictions.

---

## Domain-Specific Requirements

- **Legal Liability:** The platform must clearly disclaim that it does not provide legal advice. The "De-Risking Report" is an informational tool, not a legal opinion.
- **Data Accuracy:** The "Traffic Light" system must be highly accurate to avoid misleading users. A False Negative (saying a name is safe when it's not) is the biggest risk.
- **Data Privacy:** User search data and potential brand names must be kept confidential to prevent "front-running" or theft.
- **Ethics:** The platform must avoid the unauthorized practice of law.

### Ethics & Compliance

The platform must adhere to strict ethical guidelines. It must not present itself as a law firm or a substitute for an attorney. All outputs must be labeled as "informational only."

### Data Retention

User data, especially generated names and search history, should be retained securely. Policies must be in place for data deletion upon request.

### Confidentiality Measures

Generated names are intellectual property. The system must ensure that one user's generated names are not shown to another user or leaked.

This section shapes all functional and non-functional requirements below.

---

## Innovation & Novel Patterns

- **The "Trojan Horse" Model:** Monetizing anxiety (legal risk) to drive affiliate revenue is a novel business model in this space.
- **Consultative AI:** Using "Narrative Architect" and "Tone Matrix" to simulate a human branding consultant is an innovation over simple keyword mashers.
- **Launch Certainty Engine:** shifting the value prop from "finding a name" to "safely launching a name".

### Validation Approach

- **FNR Testing:** Rigorous testing of the IP safety scoring against known trademark conflicts to ensure <0.5% False Negative Rate.
- **Conversion Testing:** A/B testing the "Traffic Light" friction points to optimize conversion to paid reports without causing abandonment.

---

## web_app Specific Requirements

- **Browser Support:** Modern browsers (Chrome, Firefox, Safari, Edge). Mobile responsiveness is critical for "Lean Entrepreneurs" on the go.
- **SEO Strategy:** The platform needs to rank for "business name generator" and related terms. Next.js SSR will be key here.
- **Performance:** Fast generation times are essential. Users expect instant results.
- **Accessibility:** WCAG 2.1 AA compliance to ensure usability for all entrepreneurs.

### Platform Support

- **Web:** Responsive web application accessible on desktop and mobile devices.

---

## User Experience Principles

- **Professional yet Creative:** The vibe should be inspiring but trustworthy. "Legal Certainty" implies a serious, professional tone, while "Naming" implies creativity.
- **Friction as a Feature:** The "Traffic Light" system introduces intentional friction to pause the user and highlight risk, driving monetization.
- **Clear Visual Hierarchy:** Risk signals (Green/Amber/Red) must be unmistakable.

### Key Interactions

- **Chat Interface:** The "Narrative Architect" conversation.
- **Name Generation:** Displaying lists of names with visual risk indicators.
- **Risk Drill-down:** Clicking a name to see the "Traffic Light" details.
- **Checkout Flow:** Purchasing the "De-Risking Report".

---

## Functional Requirements

**User Account & Access:**

1.  FR1: Users can create accounts to save their progress and generated names.
2.  FR2: Users can log in via email or social providers.
3.  FR3: Users can view their order history (De-Risking Reports).

**Narrative Architect (Ideation):** 4. FR4: Users can input business criteria (industry, description, tone) via a chat interface. 5. FR5: System generates "Elevated Creative" names based on user input using LLM. 6. FR6: Users can refine generation parameters (e.g., "more abstract", "shorter").

**Risk Assessment (Validation):** 7. FR7: System performs preliminary IP checks on generated names against trademark databases. 8. FR8: System displays a "Traffic Light" risk indicator (Green/Amber/Red) for each name. 9. FR9: Users can view a summary of the risk factors for a selected name.

**Monetization (Conversion):** 10. FR10: Users can purchase a "De-Risking Report" for "Amber" or "Green" names. 11. FR11: System generates and delivers a PDF De-Risking Report upon purchase. 12. FR12: System presents "Launch Readiness Checklist" with affiliate hosting links for "Green" names. 13. FR13: System presents a "Legal Referral" CTA link for "Red" names.

**Data & Management:** 14. FR14: Users can save favorite names to a list. 15. FR15: System stores generated names and risk statuses associated with the user account.

---

## Non-Functional Requirements

### Performance

- Name generation should take < 5 seconds.
- Risk checks should be near real-time (or asynchronous with fast feedback).

### Security

- User data (search criteria, generated names) must be encrypted at rest and in transit.
- Payment processing must be PCI-DSS compliant (via Stripe/LemonSqueezy etc).

### Scalability

- System must handle concurrent users generating names without degradation.
- API rate limits for Trademark checks must be managed (caching, queuing).

### Accessibility

- WCAG 2.1 AA compliance.

### Integration

- Integration with Signa.so Trademark API (unified search across USPTO, EUIPO, WIPO, UKIPO).
- Integration with Affiliate Networks (Impact, CJ, etc.).
- Integration with Payment Gateway.

---

_This PRD captures the essence of Name Your Next Great Idea - A "Launch Certainty Engine" that de-risks the naming process for entrepreneurs while monetizing legal anxiety through reports and affiliate hosting._

_Created through collaborative discovery between MG and AI facilitator._
```
