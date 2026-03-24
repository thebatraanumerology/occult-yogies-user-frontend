import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { Mail, ArrowLeft } from "lucide-react";

const loginSchema = z.object({
  email: z
    .string()
    .min(1, "Please enter a valid email address!")
    .email("Please enter a valid email address!"),

  password: z.string().min(6, "Please enter correct password"),
});
type LoginForm = z.infer<typeof loginSchema>;

const ForgotPassword: React.FC<{ onForgotPassword: () => void }> = ({ onForgotPassword }) => {
  const inputGroup = "flex h-12 rounded-md border border-lightYellow/40 overflow-hidden focus-within:border-lightYellow focus-within:ring-4 focus-within:ring-lightYellow/40 transition-all duration-200";
  const input = "flex-1 bg-transparent px-3 text-white placeholder:text-white/40 outline-none focus:bg-transparent focus:ring-0";

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
     <div className="w-full text-white text-center max-w-md pr-12 bg-transparent">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-4"
          >
            <h1 className="text-3xl font-semibold text-lightYellow mb-2">
              Forgot Password
            </h1>

            <p className="text-white text-sm mb-8">
              Enter your registered email to reset your password.
            </p>

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
              {errors.email && (
                <p className="text-red-400 text-xs">{errors.email.message}</p>
              )}
            </div>


            {/* Button */}
            <button className="w-full h-11 rounded-lg bg-bgYellow text-black font-semibold hover:bg-bgYellow/90">
              Reset Password
            </button>

                <div
              className="text-center justify-center flex items-center gap-2"
              onClick={(e) => {
                e.preventDefault();
                onForgotPassword();
              }}
            >
              <ArrowLeft size={16} className="text-lightYellow hover:underline cursor-pointer" />
              <p className="text-lightYellow hover:underline cursor-pointer">
                Back to Sign In
              </p>
            </div>

          </form>
        </div>
  )
}

export default ForgotPassword;