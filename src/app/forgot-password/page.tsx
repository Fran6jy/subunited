import { AuthCard } from "@/components/auth/auth-card";

export default function ForgotPasswordPage() {
  return (
    <main className="container-shell flex min-h-screen items-center justify-center py-12">
      <AuthCard
        title="Reset your password"
        description="We will send password recovery instructions to your email address."
        primaryLabel="Send reset instructions"
      />
    </main>
  );
}
