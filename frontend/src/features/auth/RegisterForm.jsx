import {Caption, commonClassNameOfInput, Container, CustomNavLink, PrimaryButton, Title} from '@/components/index.js';
import { useNavigate } from "react-router-dom";
import { useRegister } from "@/hooks/useRegister.js";
import { useState } from "react";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";

const RegisterForm = () => {
  const {
    email, setEmail,
    username, setUsername,
    password, setPassword,
    confirmPassword, setConfirmPassword,
    isSeller, setIsSeller,
    agreeToTerms, setAgreeToTerms,
    error, loading, success, handleSubmit
  } = useRegister();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  if (success) {
    navigate('/auth/verify-otp', { state: { email } });
  }

  return (
    <section className="register pt-16 relative">
      <div className="bg-green w-96 h-96 rounded-full opacity-20 blur-3xl absolute top-2/3"></div>
      <div className="bg-[#241C37] pt-8 h-[40vh] relative content">
        <Container>
          <div>
            <Title level={3} className="text-white">
              Sign Up
            </Title>
            <div className="flex items-center gap-3">
              <Title level={5} className="text-green font-normal text-xl">
                Home
              </Title>
              <Title level={5} className="text-white font-normal text-xl">
                /
              </Title>
              <Title level={5} className="text-white font-normal text-xl">
                Sign Up
              </Title>
            </div>
          </div>
        </Container>
      </div>
      <div className="transition-all duration-500 ease-in-out transform translate-x-0">
        <form onSubmit={handleSubmit} className="bg-white shadow-s3 w-1/3 m-auto my-16 p-8 rounded-xl">
          <div className="text-center">
            <Title level={5}>Sign Up</Title>
            <p className="mt-2 text-lg">
              Do you already have an account?
              <CustomNavLink href="/auth/login"> Log In Here</CustomNavLink>
            </p>
          </div>

          {/* User Name */}
          <div className="py-5">
            <Caption className="mb-2">User name *</Caption>
            <input
              type="text"
              name="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className={commonClassNameOfInput}
              placeholder="User Name"
              required
            />
            {error.username && <p className="text-red-500 text-sm">{error.username}</p>}
          </div>

          {/* Email */}
          <div className="py-5">
            <Caption className="mb-2">Enter Your Email *</Caption>
            <input
              type="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={commonClassNameOfInput}
              placeholder="Enter Your Email"
              required
            />
            {error.email && <p className="text-red-500 text-sm">{error.email}</p>}
          </div>

          {/* Password */}
          <div className="py-5 relative">
            <Caption className="mb-2">Password *</Caption>
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={commonClassNameOfInput}
              placeholder="Enter Your Password"
              required
            />
            <span
              className="absolute right-3 top-16 cursor-pointer select-none"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <AiOutlineEyeInvisible size={20} /> : <AiOutlineEye size={20} />}
            </span>
            {error.password && <p className="text-red-500 text-sm">{error.password}</p>}
          </div>

          {/* Confirm Password */}
          <div className="py-5 relative">
            <Caption className="mb-2">Confirm Password *</Caption>
            <input
              type={showConfirmPassword ? "text" : "password"}
              name="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className={commonClassNameOfInput}
              placeholder="Confirm password"
              required
            />
            <span
              className="absolute right-3 top-16 cursor-pointer select-none"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? <AiOutlineEyeInvisible size={20} /> : <AiOutlineEye size={20} />}
            </span>
            {error.confirmPassword && <p className="text-red-500 text-sm">{error.confirmPassword}</p>}
          </div>

          <div className="flex items-center gap-2 py-4">
            <input
              checked={isSeller}
              onChange={(e) => setIsSeller(e.target.checked)}
              type="checkbox"
            />
            <Caption>Become a Seller</Caption>
          </div>
          <div className="flex items-center gap-2 py-4">
            <input
              type="checkbox"
              checked={agreeToTerms}
              onChange={(e) => setAgreeToTerms(e.target.checked)}
              required
            />
            <Caption>I agree to the Terms & Policy</Caption>
          </div>
          <p className="text-center mt-5">
            By clicking the signup button, you create a BidMarket account, and you agree to BidMarket <span className="text-green underline">Terms & Conditions</span> &
            <span className="text-green underline"> Privacy Policy </span>.
          </p>
          <PrimaryButton className="w-full rounded-none my-5" disabled={loading}>
            {loading ? "Register..." : "REGISTER"}
          </PrimaryButton>
        </form>
      </div>
    </section>
  );
}

export default RegisterForm;