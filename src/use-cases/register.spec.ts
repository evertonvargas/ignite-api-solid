import { UserAlreadyExistError } from './errors/user-already-exist-error'
import { beforeEach, describe, expect, it } from 'vitest'
import { RegisterUseCase } from './register'
import { compare } from 'bcryptjs'
import { InMemoryUserRepository } from '@/repositories/in-memory/in-memory-user-repository'

let userRepository: InMemoryUserRepository
let sut: RegisterUseCase

describe('Register Use Case', () => {
  beforeEach(() => {
    userRepository = new InMemoryUserRepository()
    sut = new RegisterUseCase(userRepository)
  })

  it('should be able to register', async () => {
    const { user } = await sut.execute({
      name: 'Everton',
      email: 'everton@gmail.com',
      password: 'teste1234',
    })

    expect(user.id).toEqual(expect.any(String))
  })

  it('should hash user upon registration', async () => {
    const { user } = await sut.execute({
      name: 'Everton',
      email: 'everton@gmail.com',
      password: 'teste1234',
    })

    const isPasswordEncripted = await compare('teste1234', user.password_hash)

    expect(isPasswordEncripted).toBe(true)
  })

  it('should be possible to register only once with the email', async () => {
    await sut.execute({
      name: 'Everton',
      email: 'everton@gmail.com',
      password: 'teste1234',
    })

    await expect(() =>
      sut.execute({
        name: 'Everton',
        email: 'everton@gmail.com',
        password: 'teste1234',
      }),
    ).rejects.toBeInstanceOf(UserAlreadyExistError)
  })
})
