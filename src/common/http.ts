export async function getBody(r: Request | Response) {
  const contentType = r.headers.get("content-type");
  const json = !!contentType && contentType.includes("json");
  return json ? await r.json() : {};
}
