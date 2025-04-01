import type { Metadata } from "next";
import { Prompt } from "next/font/google";
import "../../globals.css";
import { getCurrentSession } from "@/lib/auth";
import { redirect } from "next/navigation";
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
  if (user) {
    return redirect("/");
  }

  return (
    <html lang="en">
      <body
        className={`${prompt.className} antialiased w-full h-screen max-h-screen flex justify-center items-center bg-gradient-to-tr from-blue-100 to-sky-200`}
      >
        {children}
        <Toaster richColors toastOptions={{ className: prompt.className }} />
      </body>
    </html>
  );
}
