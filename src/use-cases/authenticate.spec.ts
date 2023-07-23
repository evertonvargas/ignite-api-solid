import { beforeEach, describe, expect, it } from 'vitest'
import { InMemoryUserRepository } from '@/repositories/in-memory/in-memory-user-repository'
import { AuthenticateUseCase } from './authenticate'
import { hash } from 'bcryptjs'
import { UserInvalidCredentialsError } from './errors/user-invalid-credential-error'

let userRepository: InMemoryUserRepository
let sut: AuthenticateUseCase

describe('Authenticate Use Case', () => {
  beforeEach(() => {
    userRepository = new InMemoryUserRepository()
    sut = new AuthenticateUseCase(userRepository)
  })

  it('should be able to authenticate', async () => {
    userRepository.create({
      email: 'everton@gmail.com',
      name: 'Everton',
      password_hash: await hash('teste1234', 6),
    })

    const authenticationResult = await sut.execute({
      email: 'everton@gmail.com',
      password: 'teste1234',
    })

    expect(authenticationResult).toBeDefined()
  })

  it('should not authenticate with wrong password credentials', async () => {
    userRepository.create({
      email: 'everton@gmail.com',
      name: 'Everton',
      password_hash: await hash('teste1234', 6),
    })

    await expect(() =>
      sut.execute({
        email: 'everton@gmail.com',
        password: 'teste123',
      }),
    ).rejects.toBeInstanceOf(UserInvalidCredentialsError)
  })

  it('should not authenticate with wrong email credentials', async () => {
    userRepository.create({
      email: 'carlos@gmail.com',
      name: 'Everton',
      password_hash: await hash('teste1234', 6),
    })

    await expect(() =>
      sut.execute({
        email: 'everton@gmail.com',
        password: 'teste123',
      }),
    ).rejects.toBeInstanceOf(UserInvalidCredentialsError)
  })
})
