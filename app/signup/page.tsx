import AuthForm from "@/components/auth-form";
import { socialProviderStatus } from "@/lib/auth-config";

export default function SignUpPage() {
  return (
    <AuthForm
      mode="signup"
      googleEnabled={socialProviderStatus.google}
      githubEnabled={socialProviderStatus.github}
    />
  );
}