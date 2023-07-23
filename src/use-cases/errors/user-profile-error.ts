export class UserProfileError extends Error {
  constructor() {
    super('User not found.')
  }
}
