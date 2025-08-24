import {AuthHeader, Caption, commonClassNameOfInput, Container, PrimaryButton, Title} from "@/components/index.js";
import {useLocation} from "react-router";
import {useRef, useEffect, useState} from "react";
import {useNotification} from "@/contexts/NotificationContext.jsx";
import {useNavigate} from "react-router-dom";
import { authService } from "@/services/auth.service.js";

const OtpVerificationScreen = () => {
  const location = useLocation();
  const [otp, setOtp] = useState(Array(6).fill(""));
  const inputRefs = useRef(Array(6).fill(null));
  const timerRef = useRef(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const { showToastNotification } = useNotification();
  const navigate = useNavigate();

  const email = location.state?.email;
  const userId = location.state?.userId;
  const isForgotPassword = location.state?.isForgotPassword;

  // Mask (hidden) email for privacy
  const maskEmail = (email) => {
    if (typeof email !== "string" || !email.includes("@")) throw new Error("Invalid email address");
    const [username, domain] = email.split("@");
    if (username.length <= 3) return `${username}@${domain}`;
    const maskedUsername = username.slice(0, 3) + "***";
    return `${maskedUsername}@${domain}`;
  }

  // Check if otp is completed
  const isOtpComplete = otp.every(digit => digit !== "");

  // Start countdown timer
  const startCountdown = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    timerRef.current = setInterval(() => {
      setCountdown(prevCount => {
        if (prevCount <= 1) {
          setCanResend(() => true);
          clearInterval(timerRef.current);
          timerRef.current = null;
          return 0;
        }
        return prevCount - 1;
      });
    }, 1000);
  };

  // Stop countdown timer
  const stopCountdown = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  // Countdown timer effect - only run after mounting
  useEffect(() => {
    startCountdown();
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  // Format countdown time
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // onChange - Handle otp change
  const handleOtpChange = (e, index) => {
    const value = e.target.value;
    if (!/^\d*$/.test(value)) return;

    setOtp(() => {
      const newOtp = [...otp];
      newOtp[index] = value;
      return newOtp;
    });
    setErrorMessage(() => "");

    if(value && index < otp.length) {
      inputRefs.current[index + 1]?.focus();
    }
  }

  // onKeyDown - Handle backspace to focus previous input
  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  // onClick - Handle resend OTP
  const handleResendOtp = async () => {
    if (!canResend || loading) return;

    try {
      setLoading(() => true);

      // Reset states
      setCountdown(() => 60);
      setCanResend(() => false);
      setOtp(() => Array(6).fill(""));
      setErrorMessage(() => "");

      if (inputRefs.current[0]) {
        inputRefs.current[0].focus();
      }

      const response = await authService.resendOtp({ email, type: 'VERIFY_EMAIL' });
      showToastNotification(response.message, "info");

      startCountdown();
    } catch (err) {
      showToastNotification(err.message || "Failed to resend OTP", "error");
    } finally {
      setLoading(() => false);
    }
  }

  // onSubmit - Handle submit otp
  const handleSubmitOtp = async (e) => {
    e.preventDefault();

    const otpValue = otp.join("");
    if (otpValue.length !== 6) {
      setErrorMessage(() => `Please enter full 6 OTP numbers`);
      return;
    }

    try {
      setLoading(() => true);
      stopCountdown();

      const otpValue = otp.join("");
    const type = isForgotPassword ? "RESET_PASSWORD" : "VERIFY_EMAIL";
      const response = await authService.verifyOtp({ userId, type: type, code: otpValue });
      showToastNotification(response.message, "info");

      if (isForgotPassword) {
        navigate("/auth/reset-password", { state: { email, userId } });
      } else {
        navigate("/auth/login");
      }
    } catch (err) {
      showToastNotification(err.message || "Failed to verify OTP", "error");
    } finally {
      setLoading(() => false);
    }
  }

  return (
    <>
      <AuthHeader />
      <Container>
        <form onSubmit={handleSubmitOtp} className="bg-white shadow-s3 w-1/3 m-auto my-16 p-8 rounded-xl">
          <div className="text-center">
            <Title level={5}>OTP Verification</Title>
            <p className="mt-2 text-lg">
              We have sent an OTP to {maskEmail(email)}. <br />
              { isForgotPassword ? "Please enter the OTP to reset your password." : "Please enter the OTP to verify your email." }
            </p>
            <div className="py-5">
              <Caption className="mb-2">OTP Code</Caption>
              <div className="flex gap-2 mt-2">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    ref={(el) => inputRefs.current[index] = el}
                    type="text"
                    value={digit}
                    onChange={(e) => handleOtpChange(e, index)}
                    onKeyDown={(e) => handleKeyDown(e, index)}
                    className={`${commonClassNameOfInput} text-center w-12 h-12 text-xl font-semibold ${errorMessage ? 'border-red-500' : ''}`}
                    maxLength={1}
                    required
                  />
                ))}
              </div>
              {errorMessage && (
                <p className="text-red-500 text-sm mt-2">{errorMessage}</p>
              )}
            </div>
            <PrimaryButton
              type="submit"
              className="w-full rounded-none my-5"
              disabled={loading || !isOtpComplete}
            >
              VERIFY OTP
            </PrimaryButton>
            <p className="text-center mt-5">
              Didn’t receive the OTP?{" "}
              {canResend ? (
                  <button
                    onClick={handleResendOtp}
                    className="text-blue-600 cursor-pointer hover:underline font-medium bg-transparent border-0 p-0"
                  >
                    Resend OTP
                  </button>
                )
                : (
                  <button
                    disabled
                    className="text-gray-500 cursor-not-allowed bg-transparent border-0 p-0"
                  >
                    Resend OTP in ({formatTime(countdown)})
                  </button>
                )
              }
            </p>
          </div>
        </form>
      </Container>
    </>
  );
}

export default OtpVerificationScreen;