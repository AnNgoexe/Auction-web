import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useNotification } from "@/contexts/NotificationContext.jsx";
import { authService } from "@/services/auth.service.js";
import {Container, Title, PrimaryButton, Caption, commonClassNameOfInput, AuthHeader} from "@/components/index.js";
import {AiOutlineEye, AiOutlineEyeInvisible} from "react-icons/ai";

export const ResetPasswordScreen = () => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const location = useLocation();
  const userId = location.state?.userId;
  const email = location.state?.email;

  const navigate = useNavigate();
  const {showToastNotification} = useNotification();

  // Mask email for privacy
  const maskEmail = (email) => {
    if (typeof email !== "string" || !email.includes("@")) return email;
    const [username, domain] = email.split("@");
    const maskedUsername = username.length > 3 ? username.slice(0, 3) + "***" : username + "***";
    return `${maskedUsername}@${domain}`;
  };

  // onSubmit - Submit reset password form
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage(() => null);

    if (newPassword !== confirmPassword) {
      setErrorMessage(() => "Passwords do not match.");
      return;
    }

    try {
      setLoading(() => true);

      const response = await authService.resetPassword({
        userId,
        newPassword,
        confirmNewPassword: confirmPassword,
      });

      showToastNotification(response.message, "info");
      navigate("/auth/login");
    } catch (err) {
      setErrorMessage(err.message || "Failed to reset password");
    } finally {
      setLoading(false);
    }
  }

  // onChange - Change new password
  const handleNewPasswordChange = (e) => {
    setNewPassword(e.target.value);
    setErrorMessage(null);
  };

  // onChange - Change new confirm password
  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
    setErrorMessage(null);
  };

  return (
    <>
      <AuthHeader />
      <Container>
        <form
          onSubmit={handleSubmit}
          className="bg-white shadow-s3 w-1/3 m-auto my-16 p-8 rounded-xl"
        >
          <div className="text-center">
            <Title level={5}>Reset Password</Title>
            {email && (
              <p className="text-gray-600 mt-2 text-sm">
                Reset password for <strong>{maskEmail(email)}</strong>
              </p>
            )}
          </div>

          <div className="py-5">
            <div className="py-5 relative">
              <Caption className="mb-2">New Password</Caption>
              <input
                type={showNewPassword ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className={commonClassNameOfInput}
                placeholder="Enter new password"
                required
              />
              <span
                className="absolute right-3 top-16 cursor-pointer"
                onClick={() => setShowNewPassword(prev => !prev)}
              >
                {showNewPassword ? <AiOutlineEyeInvisible size={20} /> : <AiOutlineEye size={20} />}
              </span>
            </div>
            <div className="py-5 relative">
              <Caption className="mb-2">Confirm New Password</Caption>
              <input
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className={commonClassNameOfInput}
                placeholder="Confirm new password"
                required
              />
              <span
                className="absolute right-3 top-16 cursor-pointer"
                onClick={() => setShowConfirmPassword(prev => !prev)}
              >
                {showConfirmPassword ? <AiOutlineEyeInvisible size={20} /> : <AiOutlineEye size={20} />}
              </span>
            </div>
            {errorMessage && (
              <div className="text-red-500 mt-4 text-center">{errorMessage}</div>
            )}

            <PrimaryButton
              className="w-full rounded-none my-5"
              type="submit"
              disabled={loading}
            >
              Reset Password
            </PrimaryButton>
          </div>
        </form>
      </Container>
    </>
  );
}

export default ResetPasswordScreen;
