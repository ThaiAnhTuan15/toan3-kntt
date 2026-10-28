// Server-side helper to query Neon PostgreSQL via HTTP API
// Works universally in Vercel Serverless Functions with zero native dependencies

const NEON_SQL_URL = 'https://ep-delicate-sun-b33rht2y-pooler.c-4.ap-southeast-1.aws.neon.tech/sql';
const DEFAULT_CONN_STRING = 'postgresql://neondb_owner:npg_H98FuEYkoVeq@ep-delicate-sun-b33rht2y-pooler.c-4.ap-southeast-1.aws.neon.tech/neondb?sslmode=require';

export async function queryNeon(sql: string, params: any[] = []): Promise<any[]> {
  const connectionString = process.env.DATABASE_URL || DEFAULT_CONN_STRING;

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
