import fp from '@fastify/cors'
export default async function (app) {
    app.register(fp, { origin: 'http://localhost:5173' })
}