import fastify from 'fastify'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

prisma.user.create({
  data: {
    name: 'Everton',
    email: 'evertonpassa7@gmail.com',
  },
})

export const app = fastify()
