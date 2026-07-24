import { redirect } from "next/navigation";

export default function LeavePage() {
  redirect("/employees/attendance?tab=leave");
}
