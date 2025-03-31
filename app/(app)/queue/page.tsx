import CustomerQueueForm from "@/app/components/new-queue/CustomerQueueForm";
import { getCurrentSession } from "@/lib/auth";

export default async function Page() {
  const { user } = await getCurrentSession();

  return (
    <main className="h-screen w-full flex justify-center items-center p-6">
      <div className="bg-white w-full p-6 rounded-lg shadow-lg md:max-w-md">
        <CustomerQueueForm user_id={user!.id} />
      </div>
    </main>
  );
}
