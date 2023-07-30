import { z } from 'zod'
import { FastifyRequest, FastifyReply } from 'fastify'
import { UserInvalidCredentialsError } from '@/use-cases/errors/user-invalid-credential-error'
import { makeAuthenticateUseCase } from '@/use-cases/factories/make-authenticate-use-case'

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

    const { user } = await authenticateUseCase.execute({ email, password })

    const token = await reply.jwtSign(
      {
        role: user.role,
      },
      {
        sign: {
          sub: user.id,
        },
      },
    )

    const refreshToken = await reply.jwtSign(
      { role: user.role },
      {
        sign: {
          sub: user.id,
          expiresIn: '7d',
        },
      },
    )

    return reply
      .setCookie('refreshToken', refreshToken, {
        path: '/', // td back tem acesso a esse cookie
        secure: true, // encriptado por https
        sameSite: true, // acesso dentro do domínio
        httpOnly: true, // só pode ser acessado por req/res
      })
      .status(200)
      .send({ token })
  } catch (err) {
    if (err instanceof UserInvalidCredentialsError) {
      return reply.status(409).send({ message: err.message })
    }

    throw err
  }
}
