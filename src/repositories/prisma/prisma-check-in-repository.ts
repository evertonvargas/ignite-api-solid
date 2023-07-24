import { Prisma } from '@prisma/client'
import { prisma } from 'prisma/lib/prisma'
import { CheckInRepository } from '../check-in-repository'

export class PrismaCheckInRepository implements CheckInRepository {
  async create(data: Prisma.CheckInUncheckedCreateInput) {
    const user = await prisma.checkIn.create({
      data,
    })

    return user
  }
}
