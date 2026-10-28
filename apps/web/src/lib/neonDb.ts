// Server-side helper to query Neon PostgreSQL via HTTP API
// Works universally in Vercel Serverless Functions with zero native dependencies

const FALLBACK_DB_URL = 'postgresql://neondb_owner:npg_IE6jO3GRYMrF@ep-odd-mountain-azenlhy4-pooler.c-3.ap-southeast-1.aws.neon.tech/neondb?sslmode=require';

export async function queryNeon(sql: string, params: any[] = []): Promise<any[]> {
  const rawUrl = process.env.DATABASE_URL || FALLBACK_DB_URL;
  const connectionString = rawUrl.includes('ep-delicate-sun') ? FALLBACK_DB_URL : rawUrl;
  const hostMatch = connectionString.match(/@([^/:]+)/);
  const host = hostMatch ? hostMatch[1] : 'ep-odd-mountain-azenlhy4-pooler.c-3.ap-southeast-1.aws.neon.tech';
  const NEON_SQL_URL = `https://${host}/sql`;

  const response = await fetch(NEON_SQL_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Neon-Connection-String': connectionString,
    },
    body: JSON.stringify({
      query: sql,
      params: params,
    }),
    cache: 'no-store',
  });

  if (!response.ok) {
    const errorBody = await response.text();
    console.error('Neon Query Error:', response.status, errorBody);
    throw new Error(`Database error: ${response.status} - ${errorBody}`);
  }

  const result = await response.json();
  return result.rows || [];
}
