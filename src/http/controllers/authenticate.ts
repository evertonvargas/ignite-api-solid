import { z } from 'zod'
import { FastifyRequest, FastifyReply } from 'fastify'
import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository'
import { AuthenticateUseCase } from '@/use-cases/authenticate'
import { UserInvalidCredentialsError } from '@/use-cases/errors/user-invalid-credential-error'

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
    const prismaUsersRepository = new PrismaUsersRepository()

    const authenticateUseCase = new AuthenticateUseCase(prismaUsersRepository)

    await authenticateUseCase.execute({ email, password })
  } catch (err) {
    if (err instanceof UserInvalidCredentialsError) {
      return reply.status(409).send({ message: err.message })
    }

    throw err
  }

  return reply.status(200).send()
}
