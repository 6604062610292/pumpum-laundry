import BackButton from "@/app/components/BackButton";
import UserForm from "@/app/components/profile/UserForm";
import { getCurrentSession } from "@/lib/auth";
import { User } from "@prisma/client";

export default async function Page() {
  const session = await getCurrentSession();

  return (
    <main className="w-full h-screen flex justify-center items-center p-6">
      <section className="bg-white shadow-lg rounded-md mx-auto p-6 w-full md:max-w-md">
        <div className="flex flex-col items-center justify-center">
          <BackButton />
          <h1 className="text-2xl text-center">ข้อมูลของฉัน</h1>
          <div className="mt-2 w-full max-w-xs">
            <UserForm user={session.user as User} />
          </div>
        </div>
      </section>
    </main>
  );
}
