import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {useNotification} from "@/contexts/NotificationContext.jsx";
import { Container, Title, Caption, commonClassNameOfInput, PrimaryButton, AuthHeader } from "@/components/index.js";
import { authService } from "@/services/auth.service.js";

const ForgotPasswordScreen = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const navigate = useNavigate();
  const { showToastNotification } = useNotification();

  // onChange - Handle input change
  const handleEmailChange = (e) => {
    setEmail(() => e.target.value);
    setErrorMessage(() => "");
  };

  // onSubmit - Handle check email and send otp
  const handleCheckEmailAndSendOtp = async (e) => {
    e.preventDefault();

    setLoading(true);
    setErrorMessage("");

    try {
      const response = await authService.checkEmail({ email });
      const otpResponse = await authService.resendOtp({ email, type: "RESET_PASSWORD" });

      navigate("/auth/verify-otp", {
        state: {
          email: response.data.email,
          userId: response.data.userId,
          isForgotPassword: true,
        },
      });

      showToastNotification(otpResponse.message || "OTP has been sent successfully", "info");
    } catch (err) {
      setErrorMessage(err.message || "Failed to check email");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <AuthHeader />
      <Container>
        <form
          className="bg-white shadow-s3 w-1/3 m-auto my-16 p-8 rounded-xl"
          onSubmit={handleCheckEmailAndSendOtp}
        >
          <div className="text-center">
            <Title level={5}>OTP Verification</Title>
            <p className="mt-2 text-lg">Please enter your email to receive an OTP.</p>
            <div className="py-5">
              <Caption className="mb-2">Email</Caption>
              <input
                type="email"
                name="email"
                value={email}
                onChange={(e) => handleEmailChange(e)}
                className={commonClassNameOfInput}
                placeholder="Enter your email"
                required
              />
              {errorMessage && (
                <p className="text-red-500 text-sm mt-2">{errorMessage}</p>
              )}
              <PrimaryButton
                type="button"
                className="w-full rounded-none my-5"
                disabled={loading}
              >
                {loading ? "Sending..." : "Send OTP"}
              </PrimaryButton>
            </div>
          </div>
        </form>
      </Container>
    </>
  );
}

export default ForgotPasswordScreen;
