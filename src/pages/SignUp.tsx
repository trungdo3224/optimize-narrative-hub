import AuthForm from "@/components/AuthForm";

const SignUp = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
      <AuthForm mode="sign-up" />
    </div>
  );
};

export default SignUp;
