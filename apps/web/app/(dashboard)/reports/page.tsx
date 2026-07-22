import { redirect } from "next/navigation";

/** Reports frozen — partner metrics live on Dashboard until a real report pack ships. */
export default function ReportsPage() {
  redirect("/dashboard");
}
