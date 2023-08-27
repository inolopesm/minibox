import knex from "knex";

export async function getServerSideProps(context) {
  const { accessToken } = context.req.cookies;

  if (!accessToken) {
    return { redirect: { destination: "/signin", permanent: false } };
  }

  const db = knex({ client: "pg", connection: process.env.DATABASE_URL });

  try {
    const [{ count }] = await db("User")
      .count({ count: "*" })
      .where({ accessToken });

    if (count === "0") {
      return { redirect: { destination: "/signin", permanent: false } };
    } else {
      context.res.setHeader("Set-Cookie", "accessToken=; Max-Age=0; path=/");
    }
  } finally {
    await db.destroy();
  }

  return { props: {} };
}

export default function HomePage() {
  return (
    <div>
      <div>Hello, World (2)!</div>
    </div>
  );
}
