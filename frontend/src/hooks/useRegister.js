import {useState} from "react";
import {useNotification} from "@/contexts/NotificationContext.jsx";
import { authService } from "@/services/auth.service";

export const useRegister = () => {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSeller, setIsSeller] = useState(false);
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [error, setError] = useState({ email: "", username: "", password: "", confirmPassword: "" });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const { showToastNotification } = useNotification();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError({ email: "", username: "", password: "", confirmPassword: "" });

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError((prev) => ({
        ...prev,
        email: "Invalid email address"
      }));
      return;
    }

    if (!username.trim()) {
      setError((prev) => ({
        ...prev,
        username: "Username is required"
      }));
      return;
    }

    if (password.length < 6) {
      setError((prev) => ({
        ...prev,
        password: "Password must be at least 6 characters",
      }));
      return;
    }

    if (password !== confirmPassword) {
      setError((prev) => ({
        ...prev,
        confirmPassword: "Passwords do not match",
      }));
      return;
    }

    if (!agreeToTerms) {
      showToastNotification("You must agree to the Terms & Policy", "error");
      return;
    }

    try {
      setLoading(true);
      await authService.register({ email, username, password, isSeller });
      showToastNotification("Registered successfully! Please verify your email.", "success");
      setSuccess(true);
    } catch (err) {
      const {errorCode, message} = err;
      if (errorCode === "EMAIL_ALREADY_EXISTS") {
        setError((prev) => ({ ...prev, email: message || "Email already exists" }));
      } else if (errorCode === "USERNAME_ALREADY_EXISTS") {
        setError((prev) => ({ ...prev, username: message || "Username already exists" }));
      } else {
        showToastNotification(message || "Registration failed", "error");
      }
    } finally {
      setLoading(false);
    }
  }

  return {
    email, setEmail,
    username, setUsername,
    password, setPassword,
    confirmPassword, setConfirmPassword,
    isSeller, setIsSeller,
    agreeToTerms, setAgreeToTerms,
    error, setError,
    loading,
    success, setSuccess,
    handleSubmit,
  };
}
