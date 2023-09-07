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

      const productId = +req.query.productId;

      if (Number.isNaN(productId)) {
        return res
          .status(400)
          .json({ message: "Produto não encontrado" });
      }

      const product = await db("Product").where("id", productId).first();

      if (product === undefined) {
        return res
          .status(400)
          .json({ message: "Produto não encontrado" });
      }

      return res.status(200).json(product);
    } finally {
      await db.destroy();
    }
  }

  if (req.method === "PUT") {
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

      const productId = +req.query.productId;

      if (Number.isNaN(productId)) {
        return res
          .status(400)
          .json({ message: "Produto não encontrado" });
      }

      const { name, value } = req.body;

      await db("Product").update({ name, value }).where("id", productId);

      return res.status(200).end();
    } finally {
      await db.destroy();
    }
  }

  return res
    .status(500)
    .json({ message: "Method not implemented" });
}
