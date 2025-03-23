import { Separator } from "@/components/ui/separator";
import { getCurrentSession } from "@/lib/auth";
import { MonitorCog, UserRoundPen, WashingMachine } from "lucide-react";
import Link from "next/link";
import { ReactNode } from "react";

export default async function Home() {
  const { user } = await getCurrentSession();

  return (
    <main className="w-full h-screen p-6">
      <section className="border shadow-xs rounded-md container mx-auto p-6 max-w-md lg:max-w-2xl">
        {/* Welcome section */}
        <div className="flex flex-col gap-3.5 items-center justify-center">
          <h1 className="text-2xl text-center">สวัสดี {user?.name}</h1>
          {/* Start navigation */}
          <div className="grid lg:grid-cols-2 gap-4">
            {/* จองคิว */}
            <LargeNavigationButton
              label="จองคิว"
              icon=<WashingMachine />
              desc="Lorem ipsum dolor sit amet, consectetur adipiscing elit."
              href="/queue"
            />
            {/* Profile */}
            <LargeNavigationButton
              label="โปรไฟล์"
              icon=<UserRoundPen />
              desc="Lorem ipsum dolor sit amet, consectetur adipiscing elit."
              href="/profile"
            />
            {/* Admin */}
            {user && user.role !== "CUSTOMER" && (
              <>
                {/* Manage queue */}
                <LargeNavigationButton
                  label="จัดการคิว"
                  icon=<MonitorCog />
                  desc="Lorem ipsum dolor sit amet, consectetur adipiscing elit."
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

const LargeNavigationButton = ({ icon, label, desc, href }: Props) => {
  return (
    <Link href={href} passHref>
      <div className="p-4 border rounded-md gap-1 shadow-xs flex flex-col justify-center items-start hover hover:bg-accent hover:cursor-pointer transition-colors duration-200">
        <div className="flex gap-2 items-center">
          {icon}
          <h1 className="text-xl">{label}</h1>
        </div>
        <Separator />
        <span className="text-sm text-zinc-600">{desc}</span>
      </div>
    </Link>
  );
};
