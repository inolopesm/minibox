import crypto from "node:crypto";
import knex from "knex";
import { Time } from "../../utils/Time";

export default async function signInHandler(req, res) {
  if (req.method === "POST") {
    await Time.sleep(2500);
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
          .json({ message: "Usuário e/ou senha inválido(s)" });
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
