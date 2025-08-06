import { useState } from "react";
import { authService } from "@/services/auth.service";
import { useNotification } from "@/contexts/NotificationContext.jsx";
import { useNavigate } from "react-router-dom";
import { useUser } from "@/contexts/UserContext.jsx";

export const useSignin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState({email: "", password: ""});
  const [loading, setLoading] = useState(false);
  const [needVerification, setNeedVerification] = useState(false);
  const { showToastNotification } = useNotification();
  const navigate = useNavigate();
  const { login } = useUser();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError({ email: "", password: "" });

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError((prev) => ({email: "Email not valid", password: prev.password }));
      return;
    }

    setLoading(true);

    try {
      const response = await authService.login({email, password});
      const { accessToken, refreshToken, user } = response.data;

      if (!user.isVerified) {
        setNeedVerification(true);
        return;
      }

      login({
        accessToken: accessToken,
        refreshToken: refreshToken,
        user: {
          userId: user.userId,
          email: user.email,
          role: user.role,
          username: user.username,
          isVerified: user.isVerified,
          isBanned: user.isBanned,
          provider: user.provider,
        },
      });
      showToastNotification('LoginForm successfully!', 'info');
      navigate('/');
    } catch (err) {
      const {statusCode, message} = err;
      if (statusCode === 404) {
        setError((prev) => ({email: message, password: prev.password }));
      } else if (statusCode === 401) {
        setError((prev) => ({email: prev.email, password: message }));
      } else {
        showToastNotification(message, 'error');
      }
    } finally {
      setLoading(false);
    }
  };

  return { email, setEmail, password, setPassword, handleSubmit, error, needVerification, loading };
};
