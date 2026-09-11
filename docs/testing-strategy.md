# CYBERSTYLE LLC — Testing Strategy & Quality Assurance

## 1. Testing Scope & Automation Hierarchy

```
        ▲
       / \       [ End-to-End Tests: Playwright ]
      /   \      - Public lead submission & project request
     /-----\     - Client portal login & invoice settlement flow
    /       \    
   /         \   [ Integration Tests: Supertest + Vitest ]
  /-----------\  - Auth session rotation, Zod endpoint contracts, Stripe webhooks
 /             \ 
/---------------\[ Unit Tests: Vitest ]
                 - Pricing calculations, design tokens, email rendering, schemas
```

---

## 2. Test Execution Commands

```bash
# Run unit tests across all monorepo workspaces
npm run test

# Run API contract and integration smoke tests
npm --workspace=@cyberstyle/api run test

# Run E2E user flows
npm --workspace=@cyberstyle/web run test:e2e
```

---

## 3. Pre-Commit & CI Gates

1. **Lint & Format**: `npm run lint` & `prettier --check`
2. **Schema Integrity**: `npx prisma validate`
3. **Type Checking**: Strict `tsc --noEmit` across all apps and packages
4. **Health Smoke Test**: Automated check that `/api/health` and `/api/ready` return `200 OK`.
