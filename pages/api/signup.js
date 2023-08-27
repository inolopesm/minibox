import knex from "knex";
import { Time } from "../../utils/Time";

export default async function signInHandler(req, res) {
  if (req.method === "POST") {
    await Time.sleep(2500);
    const db = knex({ client: "pg", connection: process.env.DATABASE_URL });

    try {
      const { secret, username, password } = req.body;

      if (secret !== process.env.SECRET) {
        return res
          .status(400)
          .json({ message: "Chave secreta incorreta" });
      }

      const [{ count }] = await db("User")
        .count({ count: "*" })
        .where({ username });

      if (count === "1") {
        return res
          .status(400)
          .json({ message: "Já existe um usuário com este nome" });
      }

      await db("User").insert({ username, password });

      return res.status(200).end();
    } finally {
      await db.destroy();
    }
  }

  return res
    .status(500)
    .json({ message: "Method not implemented" });
}
