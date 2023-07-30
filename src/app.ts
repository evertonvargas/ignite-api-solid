import fastify from 'fastify'
import fastifyJwt from '@fastify/jwt'
import { ZodError } from 'zod'
import { env } from './env'

import { usersRoutes } from './http/routes/users'
import { gymsRoutes } from './http/routes/gyms'
import { checkInsRoutes } from './http/routes/checkIns'

export const app = fastify()

app.register(fastifyJwt, {
  secret: env.JWT_SECRET,
})

app.register(usersRoutes)
app.register(gymsRoutes)
app.register(checkInsRoutes)

app.setErrorHandler((error, _, reply) => {
  if (error instanceof ZodError) {
    return reply.status(400).send({
      message: 'Validation error',
      issues: error.format(),
    })
  }

  if (env.NODE_ENV !== 'production') {
    console.error(error)
  }

  // else{
  //   // observabilidade e enviaria o erro para uma ferramenta de log
  // }

  return reply.status(500).send({ message: 'Internal server error.' })
})
