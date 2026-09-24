# Dev desk: how the website ships (2026-09-24)

- Every change arrives as a pull request with a Vercel preview link; merge to `main` deploys www.clairo.care.
- Previews keep failing closed on the interest form unless `INTEREST_PLATFORM_URL` and
  `INTEREST_RELAY_SECRET` are set for the Preview environment (see api/interest.js). Leave it that way.
- Create the `agent:build` label; org secret `OPS_GH_TOKEN`.
