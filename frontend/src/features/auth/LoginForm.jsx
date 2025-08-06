import { Caption, commonClassNameOfInput, Container, CustomNavLink, PrimaryButton, Title } from "@/components/index.js";
import { useEffect, useState } from "react";
import { AiOutlineEye, AiOutlineEyeInvisible, AiOutlineLock, AiOutlineMail } from "react-icons/ai";
import { useSignin } from "@/hooks/useSignin.js";
import { useUser } from "@/contexts/UserContext.jsx";
import { useNavigate } from "react-router-dom";

const LoginForm = () => {
  const { user } = useUser();
  const { email, setEmail, password, setPassword, handleSubmit, error, needVerification, loading } = useSignin();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const togglePassword = () => {setShowPassword((prev) => !prev)}

  useEffect(() => {
    const isLoggedIn =
      user.userId !== null &&
      user.email !== null &&
      user.role !== null &&
      user.username !== null &&
      user.isVerified === true &&
      user.isBanned === false &&
      user.provider !== null;

    if (isLoggedIn) {
      navigate("/");
    }
  }, [user, navigate]);

  useEffect(() => {
    if (needVerification) {
      navigate(`/auth/verify-otp`, { state: { email }});
    }
  }, [needVerification, email, navigate]);

  return (
    <section className="register pt-16 relative">
      <div className="bg-green w-96 h-96 rounded-full opacity-20 blur-3xl absolute top-2/3"></div>
      <div className="bg-[#241C37] pt-8 h-[40vh] relative content">
        <Container>
          <div>
            <Title level={3} className="text-white">Log In</Title>
            <div className="flex items-center gap-3">
              <Title level={5} className="text-green font-normal text-xl">Home</Title>
              <Title level={5} className="text-white font-normal text-xl">/</Title>
              <Title level={5} className="text-white font-normal text-xl">Log In</Title>
            </div>
          </div>
        </Container>
      </div>
      <div className="transition-all duration-500 ease-in-out transform translate-x-0">
        <div className="bg-white shadow-s3 w-1/3 m-auto my-16 p-8 rounded-xl">
          <form onSubmit={handleSubmit}>
            <div className="text-center">
              <Title level={5}>Sign in</Title>
              <p className="mt-2 text-lg">
                Don't have an account?
                <CustomNavLink href="/auth/register"> Signup Here</CustomNavLink>
              </p>
            </div>
            <div className="relative py-4 mt-8">
              <Caption className="mb-2">Enter Your Email *</Caption>
              <input
                type="email"
                name="email"
                value={email}
                className={`w-full pl-10 pr-10 ${commonClassNameOfInput}`}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter Your Email"
                required
              />
              <div className="absolute left-3 top-16 text-gray-400">
                <AiOutlineMail size={20} />
              </div>
            </div>
            {error?.email && (
              <p className="text-red-500 text-sm ml-1">{error.email}</p>
            )}
            <div className="relative mt-8">
              <Caption className="mb-2">Password *</Caption>
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={password}
                className={`w-full pl-10 pr-10 ${commonClassNameOfInput}`}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter Your Password"
                required
              />
              <div className="absolute left-3 top-12 text-gray-400">
                <AiOutlineLock size={20} />
              </div>
              <div
                className="absolute right-3 top-12 cursor-pointer"
                onClick={togglePassword}
              >
                {showPassword ? <AiOutlineEyeInvisible size={20} /> : <AiOutlineEye size={20} />}
              </div>
            </div>
            {error?.password && (
              <p className="text-red-500 text-sm mt-4 ml-1">{error.password}</p>
            )}
            <div className="text-right mt-2">
              <CustomNavLink href="/auth/forgot-password" className="text-sm text-blue-500">Forgot Password?</CustomNavLink>
            </div>
            <PrimaryButton className="w-full rounded-none my-5" disabled={loading}>
              {loading ? "Logging in..." : "LOGIN"}
            </PrimaryButton>
          </form>
        </div>
      </div>
    </section>
  );
}

export default LoginForm;