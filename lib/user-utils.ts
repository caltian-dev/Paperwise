import { hash } from "bcryptjs"
import { v4 as uuidv4 } from "uuid"
import { userQueries } from "./db"

export async function createUser({
  name,
  email,
  password,
  role = "user",
}: {
  name: string
  email: string
  password: string
  role?: string
}) {
  // Hash the password
  const hashedPassword = await hash(password, 10)

  // Create a new user
  const userId = uuidv4()
  const user = await userQueries.create({
    id: userId,
    name,
    email,
    password: hashedPassword,
    role,
  })

  return user
}
