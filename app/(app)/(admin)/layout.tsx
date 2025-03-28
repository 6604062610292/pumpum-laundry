import { getCurrentSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { ReactNode } from "react";

type Props = {
  children: ReactNode;
};

export default async function PageLayout({ children }: Props) {
  const { user } = await getCurrentSession();

  if (user && user.role != "STAFF") {
    redirect("/");
  }

  return children;
}
