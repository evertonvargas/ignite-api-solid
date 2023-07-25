import { beforeEach, describe, expect, it } from 'vitest'
import { InMemoryUserRepository } from '@/repositories/in-memory/in-memory-user-repository'
import { hash } from 'bcryptjs'
import { GetProfileUseCase } from './../get-profile'
import { UserProfileError } from './../errors/user-profile-error'

let userRepository: InMemoryUserRepository
let sut: GetProfileUseCase

describe('Authenticate Use Case', () => {
  beforeEach(() => {
    userRepository = new InMemoryUserRepository()
    sut = new GetProfileUseCase(userRepository)
  })

  it('should be able to get user profile', async () => {
    const createUser = await userRepository.create({
      email: 'everton@gmail.com',
      name: 'Everton',
      password_hash: await hash('teste1234', 6),
    })

    const { user } = await sut.execute({ userId: createUser.id })

    expect(user.name).toBeDefined()
  })

  it('should not able get user wrong id', async () => {
    await expect(() =>
      sut.execute({
        userId: 'not-existing-id',
      }),
    ).rejects.toBeInstanceOf(UserProfileError)
  })
})
