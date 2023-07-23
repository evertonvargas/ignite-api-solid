export class UserInvalidCredentialsError extends Error {
  constructor() {
    super('Invalid credentials!')
  }
}
