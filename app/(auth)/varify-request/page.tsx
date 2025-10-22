"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { authClient } from "@/lib/auth.client";
import { Loader2 } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import {  useState, useTransition } from "react";
import { toast } from "sonner";

export default function VerifyRequestPage() {
  const [otp, setOtp] = useState("");
  const [emailPending, startEmailPending] = useTransition();
  const params = useSearchParams();
  const email = params.get("email");
  const router = useRouter();

  function varifyOtp() {
    startEmailPending(async () => {
      await authClient.signIn.emailOtp({
        email: email!,
        otp,
        fetchOptions: {
          onSuccess: () => {
            toast.success(
              "Email verified successfully, you will be redirected soon"
            );
            router.push("/");
          },
          onError: (err) => {
            toast.error("Error verifying email: " + err.error.message);
          },
        },
      });
    });
  }

  return (
    <Card className="w-full mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="text-xl">Check your email</CardTitle>
        <CardDescription>
          We have sent a verification code to your email address. Please check
          your inbox and follow the instructions to complete the sign-in
          process.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex flex-col items-center space-y-2">
          <InputOTP
            maxLength={6}
            className="gap-2"
            onChange={(value) => setOtp(value)}
          >
            <InputOTPGroup>
              <InputOTPSlot index={0} />
              <InputOTPSlot index={1} />
              <InputOTPSlot index={2} />
              <InputOTPSlot index={3} />
              <InputOTPSlot index={4} />
              <InputOTPSlot index={5} />
            </InputOTPGroup>
          </InputOTP>

          <p className="text-sm text-muted-foreground">
            Enter the 6-digit verification code sent to your email
          </p>
        </div>

        <Button className="w-full" onClick={varifyOtp} disabled={emailPending || otp.length < 6}>
          {emailPending ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              <span>Verifying...</span>
            </>
          ) : (
            <>
              <p>Verify Account</p>
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}
