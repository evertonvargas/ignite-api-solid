import { FastifyRequest, FastifyReply } from 'fastify'

export async function refreshToken(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  await request.jwtVerify({ onlyCookie: true })

  const { role } = request.user

  const token = await reply.jwtSign(
    {
      role,
    },
    {
      sign: {
        sub: request.user.sub,
      },
    },
  )

  const refreshToken = await reply.jwtSign(
    { role },
    {
      sign: {
        sub: request.user.sub,
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
}
