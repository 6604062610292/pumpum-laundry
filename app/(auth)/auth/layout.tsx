import type { Metadata } from "next";
import { Prompt } from "next/font/google";
import "../../globals.css";
import { getCurrentSession } from "@/lib/auth";
import { redirect } from "next/navigation";

const prompt = Prompt({
  weight: "400",
  subsets: ["thai"],
});

export const metadata: Metadata = {
  title: "Pumpum Laundry",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { user } = await getCurrentSession();
  if (user) {
    return redirect("/");
  }

  return (
    <html lang="en">
      <body className={`${prompt.className} antialiased`}>{children}</body>
    </html>
  );
}
