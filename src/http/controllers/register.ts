import { z } from 'zod'
import { FastifyRequest, FastifyReply } from 'fastify'
import { UserAlreadyExistError } from '@/use-cases/errors/user-already-exist-error'
import { makeRegisterUseCase } from '@/factories/make-register-use-case'

export async function register(request: FastifyRequest, reply: FastifyReply) {
  const requestBodySchema = z.object({
    name: z.string(),
    email: z.string().email(),
    password: z.string().min(6),
  })

  const { name, email, password } = requestBodySchema.parse(request.body)

  try {
    const registerUseCase = makeRegisterUseCase()

    await registerUseCase.execute({ name, email, password })
  } catch (err) {
    if (err instanceof UserAlreadyExistError) {
      return reply.status(409).send({ message: err.message })
    }

    throw err
  }

  return reply.status(201).send()
}
