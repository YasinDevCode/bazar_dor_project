import AuthForm from "@/components/auth-form";
import { socialProviderStatus } from "@/lib/auth-config";

export default function SignInPage() {
  return (
    <AuthForm
      mode="signin"
      googleEnabled={socialProviderStatus.google}
      githubEnabled={socialProviderStatus.github}
    />
  );
}