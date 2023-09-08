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

      const teamId = +req.query.teamId;

      if (Number.isNaN(teamId)) {
        return res
          .status(400)
          .json({ message: "Equipe não encontrada" });
      }

      const team = await db("Team")
        .where({ id: teamId, deletedAt: null })
        .first();

      if (team === undefined) {
        return res
          .status(400)
          .json({ message: "Equipe não encontrada" });
      }

      return res.status(200).json(team);
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

      const [{ count: countUsers }] = await db("User")
        .count({ count: "*" })
        .where({ accessToken });

      if (countUsers === "0") {
        return res
          .status(400)
          .json({ message: "Não autorizado" });
      }

      const teamId = +req.query.teamId;

      if (Number.isNaN(teamId)) {
        return res
          .status(400)
          .json({ message: "Equipe não encontrada" });
      }

      const [{ count: countTeams }] = await db("Team")
        .count({ count: "*" })
        .where({ id: teamId, deletedAt: null });

      if (countTeams === "0") {
        return res
          .status(400)
          .json({ message: "Equipe não encontrada" });
      }

      const { name } = req.body;

      await db("Team").update({ name }).where("id", teamId);

      return res.status(200).end();
    } finally {
      await db.destroy();
    }
  }

  return res
    .status(500)
    .json({ message: "Method not implemented" });
}
