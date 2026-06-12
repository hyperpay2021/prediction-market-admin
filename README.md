# Prediction Market Admin

PM B management backend prototype for the phase-one prediction market aggregation product.

## Scope

- Market sync and API health monitoring for Polymarket and Predict.fun.
- Tradeable instrument admission, filtering rules, and event grouping rules.
- AI quick-order recommendation management.
- Single-venue order, position, settlement, API auth, risk, audit, and reporting views.

Phase one does not merge orderbooks, split orders, run smart routing, custody user assets, or move funds cross-chain.

## Local Development

```bash
pnpm install
pnpm dev
```

If `pnpm` is unavailable:

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

## Online Preview

https://prediction-market-admin-seven.vercel.app
