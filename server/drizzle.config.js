export default {
    schema: './src/db/schema/index.js',
    out: './drizzle',
    driver: 'pg',
    dbCredentials: { connectionString: process.env.DATABASE_URL }
}