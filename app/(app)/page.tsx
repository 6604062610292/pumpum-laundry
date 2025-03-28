import { getCurrentSession } from "@/lib/auth";
import { MonitorCog, Shirt, UserRoundPen } from "lucide-react";
import Link from "next/link";
import { ReactNode } from "react";

export default async function Home() {
  const { user } = await getCurrentSession();

  return (
    <main className="w-full h-screen flex justify-center items-center p-6">
      <section className="md:max-w-md w-full">
        {/* Welcome section */}
        <div className="flex flex-col gap-3.5 items-center justify-center">
          <h1 className="text-3xl">Pumpum Laundry</h1>
          {/* Start navigation */}
          <div className="grid gap-4 w-full">
            {/* จองคิว */}
            <LargeNavigationButton
              label="จองคิว"
              icon=<Shirt size={32} />
              href="/new-queue"
            />
            {/* Profile */}
            <LargeNavigationButton
              label="โปรไฟล์"
              icon=<UserRoundPen size={32} />
              href="/profile"
            />
            {/* Admin */}
            {user && user.role !== "CUSTOMER" && (
              <>
                {/* Manage queue */}
                <LargeNavigationButton
                  label="จัดการคิว"
                  icon=<MonitorCog size={32} />
                  href="/admin/queue"
                />
              </>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}

interface Props {
  icon: ReactNode;
  label: string;
  desc?: string;
  href: string;
}

const LargeNavigationButton = ({ icon, label, href }: Props) => {
  return (
    <Link href={href} passHref>
      <div className="p-4 bg-white w-full grid rounded-md gap-1 shadow-lg items-start hover hover:bg-accent hover:cursor-pointer transition-colors duration-200">
        <div className="mx-auto text-blue-600">{icon}</div>
        <p className="text-xl text-blue-600 text-center">{label}</p>
      </div>
    </Link>
  );
};
