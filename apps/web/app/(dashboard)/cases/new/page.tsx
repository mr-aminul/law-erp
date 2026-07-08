"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function NewCaseRedirectPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/cases?new=1");
  }, [router]);

  return null;
}
