import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { Mail, Lock } from "lucide-react";

const loginSchema = z.object({
  email: z
    .string()
    .min(1, "Please enter a valid email address!")
    .email("Please enter a valid email address!"),

  password: z.string().min(6, "Please enter correct password"),
});
type LoginForm = z.infer<typeof loginSchema>;

const SignIn: React.FC<{ onForgotPassword: () => void }> = ({ onForgotPassword }) => {

    const navigate = useNavigate();
      const {
        register,
        handleSubmit,
        formState: { errors },
      } = useForm<LoginForm>({ resolver: zodResolver(loginSchema) });
    
      const onSubmit = (data: LoginForm) => {
        console.log(data);
        navigate("/");
      };
    
      
  return (
     <article className="w-full text-white text-center max-w-md pr-12">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-4"
          >
            <h1 className="text-3xl font-semibold text-lightYellow mb-2">
              Sign in with email
            </h1>

            <p className="text-white text-sm mb-8">
              Enter your credentials to access your account.
            </p>

            {/* Email */}
            <div className="flex flex-col gap-1 text-left">
              <div className="flex h-12 rounded-md border border-lightYellow overflow-hidden focus-within:ring-2 focus-within:ring-lightYellow">
                <span className="flex items-center px-3">
                  <Mail size={18} className="text-lightYellow" />
                </span>
                <input
                  type="email"
                  placeholder="Email ID"
                  {...register("email")}
                  className="flex-1 bg-transparent px-3 text-white placeholder:text-white/40 outline-none"
                />
              </div>
              {errors.email && (
                <p className="text-red-400 text-xs">{errors.email.message}</p>
              )}
            </div>

            {/* Password */}
            <div className="flex flex-col gap-1 text-left">
              <div className="flex h-12 rounded-md border border-lightYellow overflow-hidden focus-within:ring-2 focus-within:ring-lightYellow">
                <span className="flex items-center px-3">
                  <Lock size={18} className="text-lightYellow" />
                </span>
                <input
                  type="password"
                  placeholder="Password"
                  {...register("password")}
                  className="flex-1 bg-transparent px-3 text-white placeholder:text-white/40 outline-none"
                />
              </div>
              {errors.password && (
                <p className="text-red-400 text-xs">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Forgot */}
            <div
              className="text-right"
              onClick={(e) => {
                e.preventDefault();
                onForgotPassword();
              }}
            >
              <a className="text-lightYellow hover:underline">
                Forgot Password?
              </a>
            </div>

            {/* Button */}
            <button className="w-full h-11 rounded-lg bg-bgYellow text-black font-semibold hover:bg-bgYellow/90">
              Login Now
            </button>
          </form>
        </article>
  )
}

export default SignIn;