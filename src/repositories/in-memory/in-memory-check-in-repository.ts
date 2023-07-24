import { Prisma, CheckIn } from '@prisma/client'
import { randomUUID } from 'node:crypto'
import { CheckInRepository } from '../check-in-repository'

export class InMemoryCheckInRepository implements CheckInRepository {
  public items: CheckIn[] = []

  async create(data: Prisma.CheckInUncheckedCreateInput) {
    const checkIn = {
      id: randomUUID(),
      validate_at: data.validate_at ? new Date(data.validate_at) : null,
      user_id: data.gym_id,
      gym_id: data.user_id,
      created_at: new Date(),
    }

    this.items.push(checkIn)

    return checkIn
  }
}
