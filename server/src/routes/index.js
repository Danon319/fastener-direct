export default async function (app) {
    app.get('/api/health', async () => ({ status: 'ok' }))
}