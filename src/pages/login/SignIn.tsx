import "./login.scss";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { Mail, Lock } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/src/context/AuthContext";
import { doLogin } from "@/src/services/login/LoginAPIFunctions";

const loginSchema = z.object({
  email:    z.string().min(1, "Please enter a valid email address!").email("Please enter a valid email address!"),
  password: z.string().min(6, "Please enter correct password"),
});
type LoginForm = z.infer<typeof loginSchema>;

const SignIn: React.FC<{ onForgotPassword: () => void }> = ({ onForgotPassword }) => {
  const navigate   = useNavigate();
  const { login }  = useAuth();
  const [apiError, setApiError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  const inputGroup = "flex h-12 rounded-md border border-lightYellow/40 overflow-hidden focus-within:border-lightYellow focus-within:ring-4 focus-within:ring-lightYellow/40 transition-all duration-200";
  const input      = "flex-1 bg-transparent px-3 text-white placeholder:text-white/40 outline-none focus:bg-transparent focus:ring-0";

  const onSubmit = async (formData: LoginForm) => {
    try {
      setApiError(null);
      setSubmitting(true);

      const res = await doLogin(formData);       
      if (res.status) {
        login(res.data.user, res.data.token);   
        navigate("/energy-vastu");
      } else {
        setApiError(res.message ?? "Login failed. Please try again.");
      }
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ?? "Invalid credentials. Please try again.";
      setApiError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="w-full text-white text-center">
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <h1 className="text-3xl font-semibold text-lightYellow mb-2">Sign in with email</h1>
        <p className="text-white text-sm mb-8">Enter your credentials to access your account.</p>

        {/* API-level error */}
        {apiError && (
          <div className="bg-red-500/10 border border-red-400/40 text-red-400 text-sm rounded-md px-4 py-2 text-left">
            {apiError}
          </div>
        )}

        {/* Email */}
        <div className="flex flex-col gap-1 text-left">
          <div className={inputGroup}>
            <span className="flex items-center px-3">
              <Mail size={18} className="text-lightYellow" />
            </span>
            <input
              type="email"
              placeholder="Email ID"
              {...register("email")}
              className={input}
            />
          </div>
          {errors.email && <p className="text-red-400 text-xs">{errors.email.message}</p>}
        </div>

        {/* Password */}
        <div className="flex flex-col gap-1 text-left">
          <div className={inputGroup}>
            <span className="flex items-center px-3">
              <Lock size={18} className="text-lightYellow" />
            </span>
            <input
              type="password"
              placeholder="Password"
              {...register("password")}
              className={input}
            />
          </div>
          {errors.password && <p className="text-red-400 text-xs">{errors.password.message}</p>}
        </div>

        {/* Forgot */}
        <div className="text-right" onClick={(e) => { e.preventDefault(); onForgotPassword(); }}>
          <a className="text-lightYellow hover:underline cursor-pointer">Forgot Password?</a>
        </div>

        {/* Submit */}
        <button
          disabled={submitting}
          className="w-full h-11 rounded-lg bg-bgYellow text-black font-semibold hover:bg-bgYellow/90 disabled:opacity-60"
        >
          {submitting ? "Signing in…" : "Login Now"}
        </button>
      </form>
    </div>
  );
};

export default SignIn;