import { UserAlreadyExistError } from './errors/user-already-exist-error'
import { describe, expect, it } from 'vitest'
import { RegisterUseCase } from './register'
import { compare } from 'bcryptjs'
import { InMemoryUserRepository } from '@/repositories/in-memory/in-memory-user-repository'

describe('Register Use Case', () => {
  it('should be able to register', async () => {
    const userRepository = new InMemoryUserRepository()
    const registerUseCase = new RegisterUseCase(userRepository)

    const { user } = await registerUseCase.execute({
      name: 'Everton',
      email: 'everton@gmail.com',
      password: 'teste1234',
    })

    expect(user.id).toEqual(expect.any(String))
  })

  it('should hash user upon registration', async () => {
    const userRepository = new InMemoryUserRepository()
    const registerUseCase = new RegisterUseCase(userRepository)

    const { user } = await registerUseCase.execute({
      name: 'Everton',
      email: 'everton@gmail.com',
      password: 'teste1234',
    })

    const isPasswordEncripted = await compare('teste1234', user.password_hash)

    expect(isPasswordEncripted).toBe(true)
  })

  it('should be possible to register only once with the email', async () => {
    const userRepository = new InMemoryUserRepository()
    const registerUseCase = new RegisterUseCase(userRepository)

    await registerUseCase.execute({
      name: 'Everton',
      email: 'everton@gmail.com',
      password: 'teste1234',
    })

    await expect(() =>
      registerUseCase.execute({
        name: 'Everton',
        email: 'everton@gmail.com',
        password: 'teste1234',
      }),
    ).rejects.toBeInstanceOf(UserAlreadyExistError)
  })
})
