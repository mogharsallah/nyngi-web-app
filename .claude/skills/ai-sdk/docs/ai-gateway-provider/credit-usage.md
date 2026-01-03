## Credit Usage

You can check your team's current credit balance and usage:

```ts
import { gateway } from 'ai';

const credits = await gateway.getCredits();

console.log(`Team balance: ${credits.balance} credits`);
console.log(`Team total used: ${credits.total_used} credits`);
```

The `getCredits()` method returns your team's credit information based on the authenticated API key or OIDC token:

- **balance** _number_ - Your team's current available credit balance
- **total_used** _number_ - Total credits consumed by your team

