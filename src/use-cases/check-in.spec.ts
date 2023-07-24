import { beforeEach, describe, expect, it } from 'vitest'
import { CheckInUseCase } from './check-in'
import { InMemoryCheckInRepository } from '@/repositories/in-memory/in-memory-check-in-repository'

let userRepository: InMemoryCheckInRepository
let sut: CheckInUseCase

describe('Check in Use Case', () => {
  beforeEach(() => {
    userRepository = new InMemoryCheckInRepository()
    sut = new CheckInUseCase(userRepository)
  })

  it('should be able to check in', async () => {
    const { checkIn } = await sut.execute({
      gymId: 'gym-01',
      userId: 'user-01',
    })

    expect(checkIn.id).toEqual(expect.any(String))
  })
})
