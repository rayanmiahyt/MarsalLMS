"use client";

import { authClient } from "@/lib/auth.client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function useSignout() {
  const router = useRouter();

  async function handaleSignout() {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push("/");
          toast.success("Logout Successfully ");
        },
        onError: () => {
          toast.error("Logout Faild");
        },
      },
    });
  }

  return {handaleSignout}
}
