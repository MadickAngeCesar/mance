# Migration Strategy

## Chosen Approach: Option A - `db push` + SQL Snapshots for Production

### Summary
- **Local Development:** Use `prisma db push --accept-data-loss` for rapid iteration
- **Production Deployments:** Create and review SQL snapshots before applying to production
- **Shadow Database:** Not required for local development
- **Migration Files:** Not tracked (dev uses push, prod uses snapshots)

### Rationale
1. ✅ Fast local iteration without migration file management
2. ✅ Lower local infrastructure complexity (no shadow DB required)  
3. ✅ Explicit, reviewed schema changes for production
4. ✅ Easy to rotate back to `migrate dev` when schema stabilizes
5. ✅ Matches the high-velocity schema exploration phase

### Local Development

```bash
# Schema changes
vim prisma/schema.prisma

# Apply to local database
pnpm prisma db push --accept-data-loss

# Reseed as needed
pnpm prisma:seed --reset
```

**Database Reset (< 5 minutes):**
```bash
pnpm prisma:seed --reset
```

### Production Deployment

```bash
# 1. Create snapshot before release
pnpm prisma db push --accept-data-loss
npx prisma db pull > docs/migrations/YYYY-MM-DD-schema.sql

# 2. Commit and review
git add docs/migrations/
git commit -m "docs: DB schema snapshot for release v1.2.0"

# 3. During deployment, apply snapshot
DATABASE_URL="<prod-db>" pnpm prisma db execute --stdin < docs/migrations/YYYY-MM-DD-schema.sql

# 4. Verify
DATABASE_URL="<prod-db>" npx prisma introspect
```

### Why Not Option B (`migrate dev`)?

❌ Requires reliable local Postgres runtime  
❌ Migration file churn during rapid schema changes  
❌ Shadow database adds setup complexity  
❌ Better suited for stable, mature schemas  

**Future:** Can safely migrate to `migrate dev` once schema stabilizes (Phase 3+)

### Files
- Development commands: [implementation_roadmap.md](implementation_roadmap.md#operational-commands)
- Detailed guide: [PHASE_1_COMPLETE.md](PHASE_1_COMPLETE.md)
