import type { Client } from "pg";

interface User {
  id: number;
  username: string;
  password: string;
}

export async function getUserByUsername(
  client: Client,
  username: string
) {
  const { rows: [user] } = await client.query<User>(
    'SELECT "id", "username", "password" FROM "User" WHERE "username" = $1',
    [username]
  );

  return user ?? null;
}
