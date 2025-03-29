import { Button } from "@/components/ui/button";
import { getCurrentSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { cn } from "@/lib/utils";
import {
  ListStart,
  MonitorCog,
  Shirt,
  UserRoundPen,
  WashingMachine,
} from "lucide-react";
import Link from "next/link";
import { ReactNode } from "react";

export default async function Home() {
  const { user } = await getCurrentSession();

  // current ready machine
  const cr_machine = await prisma.machine.findMany({
    where: {
      is_available: true,
    },
  });

  return (
    <main className="w-full h-screen flex justify-center items-center p-6">
      <section className="md:max-w-md w-full">
        {/* Welcome section */}
        <div className="flex flex-col gap-4 items-center justify-center">
          <h1 className="text-4xl font-bold text-blue-700">Pumpum Laundry</h1>
          {/* Raedy to use machine counter */}
          <div className="bg-white shadow-lg py-2 px-2.5 rounded-lg">
            <div></div>
            <div>
              <p
                className={cn(
                  "text-lg",
                  cr_machine.length === 0 && "text-zinc-600"
                )}
              >
                {cr_machine.length} เครื่องพร้อมใช้งาน
              </p>
            </div>
          </div>
          {/* Start navigation */}
          <div className="grid grid-cols-2 gap-4 w-[325px]">
            {/* จองคิว */}
            <LargeNavigationButton
              label="จองคิว"
              icon=<Shirt size={40} />
              href="/queue"
            />
            {/* คิวของฉัน */}
            <LargeNavigationButton
              label="คิวของฉัน"
              icon=<ListStart size={40} />
              href="/my-queue"
            />
            {/* Profile */}
            <LargeNavigationButton
              label="โปรไฟล์"
              icon=<UserRoundPen size={40} />
              href="/profile"
            />
            {/* Admin */}
            {user && user.role !== "CUSTOMER" && (
              <>
                {/* Manage queue */}
                <LargeNavigationButton
                  label="จัดการคิว"
                  icon=<MonitorCog size={40} />
                  href="/admin/queue"
                />
                {/* Manage machine */}
                <LargeNavigationButton
                  label="จัดการเครื่อง"
                  icon=<WashingMachine size={40} />
                  href="/admin/machines"
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
      <div className="p-4 bg-white w-full grid rounded-md gap-y-1.5 shadow-lg text-blue-500 items-start  transition-colors duration-200">
        <div className="mx-auto">{icon}</div>
        <p className="text-xl text-center">{label}</p>
      </div>
    </Link>
  );
};
