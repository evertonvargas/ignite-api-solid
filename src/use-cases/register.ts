import { PrismaUsersRepository } from '@/repositories/prisma-users-repository'
import { hash } from 'bcryptjs'

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
  const prismaUsersRepository = new PrismaUsersRepository()

  const userWithSameEmail = await prismaUsersRepository.findByEmail(email)

  if (userWithSameEmail) {
    throw new Error('Email já existe')
  }

  const password_hash = await hash(password, 6)

  await prismaUsersRepository.create({
    name,
    email,
    password_hash,
  })
}
