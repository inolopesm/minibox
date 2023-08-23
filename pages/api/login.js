import crypto from "node:crypto";
import knex from "knex";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const db = knex({ client: "pg", connection: process.env.DATABASE_URL });

    try {
      const { username, password } = req.body;

      const user = await db("User")
        .select(["password"])
        .where({ username })
        .first();

      if (!user || user.password !== password) {
        return res
          .status(400)
          .json({ message: "Credenciais informadas são inválidas" });
      }

      const accessToken = crypto.randomBytes(127).toString("hex");

      await db("User").update({ accessToken }).where({ username });

      return { accessToken };
    } finally {
      await db.destroy();
    }
  }

  return res
    .status(500)
    .json({ message: "Method not implemented" });
}
