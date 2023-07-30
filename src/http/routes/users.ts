import { FastifyInstance } from 'fastify'
import { verifyJwt } from '../middlewares/verify-jwt'

import { register } from '../controllers/users/register'
import { authenticate } from '../controllers/users/authenticate'
import { profile } from '../controllers/users/profile'
import { refreshToken } from '../controllers/users/refreshToken'

export async function usersRoutes(app: FastifyInstance) {
  app.post('/users', register)
  app.post('/sessions', authenticate)

  app.patch('/token/refresh', refreshToken)

  // User Authenticated
  app.get('/profile', { onRequest: [verifyJwt] }, profile)
}
