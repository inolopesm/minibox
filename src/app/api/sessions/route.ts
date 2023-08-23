import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Client as PgClient } from "pg";
import { z } from "zod";
import { getBody } from "../../../common/http";
import { capitalize } from "../../../common/string";
import { env } from "../../../server/env";
import { badRequest, ok } from "../../../server/response";
import { getUserByUsername } from "../../../server/repository";
import { formatError } from "../../../server/zod";

export interface Session {
  accessToken: string;
}

const createSessionSchema = z
  .object({
    username: z
      .string()
      .min(1, "usuário não pode estar vazio")
      .max(24, "usuário deve conter até 24 caracteres")
      .regex(/^[a-z]{1,24}$/, "usuário deve conter apenas letras minúsculas"),
    password: z
      .string()
      .min(1, "senha não pode estar vazio")
      .max(24, "senha deve conter até 24 caracteres"),
  })
  .required();

export async function POST(request: Request) {
  const result = createSessionSchema.safeParse(await getBody(request));
  if (!result.success) return badRequest(capitalize(formatError(result)));

  const pg = new PgClient({ connectionString: env.DATABASE_URL });
  await pg.connect();

  try {
    const user = await getUserByUsername(pg, result.data.username);
    if (!user) return badRequest("Usuário não encontrado");

    const match = await bcrypt.compare(result.data.password, user.password);
    if (!match) return badRequest("Senha inválida");

    const payload = { sub: user.id, username: user.username };
    const accessToken = jwt.sign(payload, env.SECRET, { expiresIn: "12h" });

    const session: Session = { accessToken };

    return ok(session);
  } finally {
    await pg.end();
  }
}
