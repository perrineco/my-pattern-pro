// Returns the visitor's country code using Netlify's built-in IP geolocation,
// so the client can pick a display currency without calling a third-party API.
export default async (_request: Request, context: { geo?: { country?: { code?: string } } }) => {
  const country = context.geo?.country?.code ?? null;

  return new Response(JSON.stringify({ country }), {
    headers: {
      "content-type": "application/json",
      "cache-control": "public, max-age=0, must-revalidate",
    },
  });
};

export const config = { path: "/api/geo" };
