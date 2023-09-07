import knex from "knex";

export default async function teamsHandler(req, res) {
  if (req.method === "GET") {
    const db = knex({ client: "pg", connection: process.env.DATABASE_URL });

    try {
      const { accessToken } = req.cookies;

      if (accessToken === undefined) {
        return res
          .status(400)
          .json({ message: "Não autorizado" });
      }

      const [{ count }] = await db("User")
        .count({ count: "*" })
        .where({ accessToken });

      if (count === "0") {
        return res
          .status(400)
          .json({ message: "Não autorizado" });
      }

      const query = db("Team")
        .where({ deletedAt: null })
        .orderBy("id", "asc");

      if (req.query.query) {
        query.whereILike("name", `%${req.query.query}%`);
      }

      const teams = await query;

      return res.status(200).json(teams);
    } finally {
      await db.destroy();
    }
  }

  if (req.method === "POST") {
    const db = knex({ client: "pg", connection: process.env.DATABASE_URL });

    try {
      const { accessToken } = req.cookies;

      if (accessToken === undefined) {
        return res
          .status(400)
          .json({ message: "Não autorizado" });
      }

      const [{ count }] = await db("User")
        .count({ count: "*" })
        .where({ accessToken });

      if (count === "0") {
        return res
          .status(400)
          .json({ message: "Não autorizado" });
      }

      const { name } = req.body;

      await db("Team").insert({ name });

      return res.status(200).end();
    } finally {
      await db.destroy();
    }
  }

  return res
    .status(500)
    .json({ message: "Method not implemented" });
}
