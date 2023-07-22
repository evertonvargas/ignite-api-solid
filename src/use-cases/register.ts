import { hash } from 'bcryptjs'
import { prisma } from 'prisma/lib/prisma'

interface RegisterUseCaseRequest {
  name: string
  password: string
  email: string
}

export async function registerUseCase({
  name,
  email,
  password,
}: RegisterUseCaseRequest) {
  const password_hash = await hash(password, 6)

  const userWithSameEmail = await prisma.user.findUnique({
    where: {
      email,
    },
  })

  if (userWithSameEmail) {
    throw new Error('Email já existe')
  }

  await prisma.user.create({
    data: {
      name,
      email,
      password_hash,
    },
  })
}
