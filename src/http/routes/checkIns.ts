import { FastifyInstance } from 'fastify'
import { verifyJwt } from '@/http/middlewares/verify-jwt'

import { create } from '../controllers/check-ins/create'
import { history } from '../controllers/check-ins/history'
import { metrics } from '../controllers/check-ins/metrics'
import { validate } from '../controllers/check-ins/validate'

export async function checkInsRoutes(app: FastifyInstance) {
  app.addHook('onRequest', verifyJwt)

  app.get('/check-ins/history', history)
  app.get('/check-ins/metrics', metrics)

  app.post('/gyms/:gymId/check-ins', create)

  app.patch('/check-ins/:checkInId/validate', validate)
}
