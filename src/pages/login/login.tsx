import SignIn from "./SignIn";
import { useState } from "react";
import ForgotPassword from "./ForgotPassword";

const Login: React.FC = () => {
  const [showForgotPassword, setShowForgotPassword] = useState(false);

  return showForgotPassword ? (
    <ForgotPassword onForgotPassword={() => setShowForgotPassword(false)} />
  ) : (
    <SignIn onForgotPassword={() => setShowForgotPassword(true)} />
  );
};

export default Login;