import type { SafeParseError } from "zod";

export function formatError<Input>(result: SafeParseError<Input>) {
  const messages = result.error.issues.map(({ message }) => message);
  return new Intl.ListFormat("pt-BR").format(messages);
}
