export function getServerSideProps(context) {
  if (!context.req.cookies.accessToken) {
    return { redirect: { destination: "/signin", permanent: false } };
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
