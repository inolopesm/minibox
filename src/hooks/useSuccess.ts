import { useEffect, useState } from "react";

export function useSuccess() {
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (success) {
      window.scroll({ left: 0, top: 0, behavior: "smooth" });
    }
  }, [success]);

  return { success, setSuccess };
}
