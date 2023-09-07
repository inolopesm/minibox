import knex from "knex";

export default async function productsHandler(req, res) {
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

      const query = db("Product").select();

      if (req.query.query) {
        query.whereILike('name', `%${req.query.query}%`);
      }

      const products = await query;

      return res.status(200).json(products);
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

      const { name, value } = req.body;

      await db("Product").insert({ name, value });

      return res.status(200).end();
    } finally {
      await db.destroy();
    }
  }

  return res
    .status(500)
    .json({ message: "Method not implemented" });
}
