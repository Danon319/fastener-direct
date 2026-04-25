import Fastify from 'fastify'
import cors from './plugins/cors.js'
import routes from './routes/index.js'

const app = Fastify({ logger: true })

app.register(cors)
app.register(routes)

const start = async () => {
    await app.listen({ port: process.env.PORT || 3000 })
}
start()