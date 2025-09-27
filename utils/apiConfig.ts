// This file centralizes the API base URL for consistency across the frontend.
// The URL is hardcoded to the production deployment to resolve runtime errors
// caused by `import.meta.env` being undefined in the execution environment.
export const API_BASE_URL = 'https://ai-fortune-teller-ten.vercel.app';