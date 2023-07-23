import { z } from 'zod'
import { FastifyRequest, FastifyReply } from 'fastify'
import { UserInvalidCredentialsError } from '@/use-cases/errors/user-invalid-credential-error'
import { makeAuthenticateUseCase } from '@/factories/make-authenticate-use-case'

export async function authenticate(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const requestBodySchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
  })

  const { email, password } = requestBodySchema.parse(request.body)

  try {
    const authenticateUseCase = makeAuthenticateUseCase()

    await authenticateUseCase.execute({ email, password })
  } catch (err) {
    if (err instanceof UserInvalidCredentialsError) {
      return reply.status(409).send({ message: err.message })
    }

    throw err
  }

  return reply.status(200).send()
}
