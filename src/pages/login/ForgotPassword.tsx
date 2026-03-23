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
     <article className="w-full text-white text-center max-w-md pr-12 bg-transparent">
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
        </article>
  )
}

export default ForgotPassword;