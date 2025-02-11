import AuthForm from "@/components/AuthForm";

const SignIn = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
      <AuthForm mode="sign-in" />
    </div>
  );
};

export default SignIn;
