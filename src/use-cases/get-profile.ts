import { UsersRepository } from '@/repositories/user-repository'
import { User } from '@prisma/client'
import { UserProfileError } from './errors/user-profile-error'

interface GetProfileUseCaseRequest {
  userId: string
}

interface GetProfileUseCaseResponse {
  user: User
}

export class GetProfileUseCase {
  constructor(private usersRepository: UsersRepository) {}

  async execute({
    userId,
  }: GetProfileUseCaseRequest): Promise<GetProfileUseCaseResponse> {
    const user = await this.usersRepository.findById(userId)

    if (!user) {
      throw new UserProfileError()
    }

    return { user }
  }
}
