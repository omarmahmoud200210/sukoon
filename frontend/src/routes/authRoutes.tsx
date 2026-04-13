import { Route } from "react-router-dom";
import GuestRoutes from "../contexts/auth/GuestRoutes";
import LoginPage from "../pages/auth/LoginPage";
import RegisterPage from "../pages/auth/RegisterPage";
import VerifyPage from "../pages/auth/VerifyPage";
import ForgetPasswordPage from "../pages/auth/ForgetPasswordPage";
import ResetPasswordPage from "../pages/auth/ResetPasswordPage";

export const AuthRoutes = (
  <Route element={<GuestRoutes />}>
    <Route path="/login" element={<LoginPage />} />
    <Route path="/register" element={<RegisterPage />} />
    <Route path="/verify-email" element={<VerifyPage />} />
    <Route path="/forget-password" element={<ForgetPasswordPage />} />
    <Route path="/reset-password" element={<ResetPasswordPage />} />
  </Route>
);
