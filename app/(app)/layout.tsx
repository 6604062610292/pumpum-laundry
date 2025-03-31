import type { Metadata } from "next";
import { Prompt } from "next/font/google";
import "../globals.css";
import { getCurrentSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import Navigation from "../components/Navigation";
import { Toaster } from "sonner";

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
  if (user === null) {
    return redirect("/auth/login");
  }

  return (
    <html lang="en">
      <body className={`${prompt.className} antialiased bg-blue-50`}>
        {children}
        <Toaster richColors position="bottom-right" />
      </body>
    </html>
  );
}
