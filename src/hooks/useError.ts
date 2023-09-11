import { useEffect, useState } from "react";

export function useError() {
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (error) {
      window.scroll({ left: 0, top: 0, behavior: "smooth" });
    }
  }, [error]);

  return { error, setError };
}
