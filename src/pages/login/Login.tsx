import "./login.css";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Mail, Lock } from "lucide-react";

type LoginForm = {
  email: string;
  password: string;
};

const Login: React.FC = () => {
  const form = useForm<LoginForm>({
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = (data: LoginForm) => {
    console.log(data);
    // call your API here
  };

  return (
    <section className="flex h-dvh p-0 bg-[#781B43]">

      {/* ── Left panel — branding ── */}
      <div className="relative flex w-[60%] flex-col items-center justify-center h-dvh py-16 px-[5%] text-white overflow-hidden">
        {/* background image */}
        <img
          src="/img/login-bg.webp"
          alt=""
          className="absolute inset-0 h-full w-full object-cover z-0"
        />
        {/* dark blur overlay */}
        <div className="absolute inset-0 z-[1] bg-black/40 backdrop-blur-[9px]" />

        {/* logo + tagline */}
        <div className="relative z-[2] flex flex-col items-center justify-center gap-5 text-center max-w-[525px] w-full">
          <svg viewBox="0 0 870.8 618.9" className="w-[320px] h-auto">
            <path
              d="M730.9.1h0c-13,27.2-35.4,46.4-59.9,62.5a373.7,373.7,0,0,1-44,24.9c-25.2,11.9-51,22.5-76.5,33.7-33.6,14.9-61.4,36.8-80.5,68.8-6,10.1-30.4,50.8-36.7,61.6-1-1.3-21.6-35.2-31.3-51.4s-20.9-32.7-35.4-46.1c-17.3-16-37.7-26.8-59-36.3-28-12.7-56.3-24.7-83.8-38.3s-51.6-30.2-71-53.6c-6.7-8-12.4-17-18.2-25.4-3.7,29.4,3.6,58.4,22.7,81.1,14,16.5,31.6,28.6,50.6,38.1,23.6,11.8,47.6,22.7,71.8,33.2,29.8,12.9,54.3,31.7,71.2,59.7s35.1,58.6,52.8,87.9a23.5,23.5,0,0,1,3.3,12.9c0,30.6.2,93,.2,95h51.4s-.2-65.4.1-96.8a22.1,22.1,0,0,1,2.8-10.6c16.5-27.9,33.3-55.6,50-83.3,18.2-30.2,43.3-52.2,76-65.6,11.6-4.7,23.1-9.6,34.6-14.6,23.4-10.1,46.1-21.5,66.4-37.2,24.7-19.1,40.4-43.4,43.2-74.9C732.5,17,731,8.5,730.9.1Z"
              fill="#efba49"
            />
          </svg>
          <p className="text-white/80 text-sm leading-relaxed">
            Lorem Ipsum is simply dummy text of the printing and typesetting
            industry. Lorem Ipsum has been the industry's standard dummy text
            ever since the 1500s, when an unknown printer took a galley of type
            and scrambled it to make a type specimen book.
          </p>
        </div>
      </div>

      {/* ── Right panel — form ── */}
      {/*
        login-ring is the ONLY class in login.css
        It adds the ::after spinning circle — Tailwind cannot do pseudo-elements inline
      */}
      <div className="login-ring relative flex w-[40%] flex-col items-center justify-center h-dvh py-16 px-[10%] text-white overflow-hidden">

        {/* decorative wave on left edge */}
        <svg
          viewBox="0 0 200 810"
          className="absolute left-0 top-0 h-full w-auto fill-[#481028] -translate-x-full"
        >
          <path d="M200,0C65.2,123.3,106.7,166.4,100,375.1,96.6,683.3,126,690.6,0,810H200Z" />
        </svg>

        {/* form card */}
        <div className="relative z-[1] w-full max-w-[450px] text-center">
          <h1 className="text-3xl font-semibold text-[#EFBA49] mb-2">
            Sign in with email
          </h1>
          <p className="text-white/70 text-sm mb-8">
            Lorem Ipsum is simply dummy text of the printing and typesetting
            industry.
          </p>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">

              {/* Email */}
              <FormField
                control={form.control}
                name="email"
                rules={{
                  required: "Email is required",
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: "Enter a valid email",
                  },
                }}
                render={({ field }) => (
                  <FormItem className="text-left">
                    <FormControl>
                      <div className="flex items-center rounded-md bg-black/20 focus-within:ring-2 focus-within:ring-[#EFBA49]/30">
                        <span className="flex items-center justify-center px-3 shrink-0 h-12 border border-r-0 border-[#EFBA49] rounded-l-md">
                          <Mail size={18} className="text-[#EFBA49]" />
                        </span>
                        <Input
                          type="email"
                          placeholder="Email ID"
                          {...field}
                          className="bg-transparent border-l-0 border-[#EFBA49] rounded-l-none text-white placeholder:text-white/40 h-12 text-[1.05rem] focus-visible:ring-0 focus-visible:border-[#EFBA49]"
                        />
                      </div>
                    </FormControl>
                    <FormMessage className="text-red-400 text-xs mt-1" />
                  </FormItem>
                )}
              />

              {/* Password */}
              <FormField
                control={form.control}
                name="password"
                rules={{ required: "Password is required" }}
                render={({ field }) => (
                  <FormItem className="text-left">
                    <FormControl>
                      <div className="flex items-center rounded-md bg-black/20 focus-within:ring-2 focus-within:ring-[#EFBA49]/30">
                        <span className="flex items-center justify-center px-3 shrink-0 h-12 border border-r-0 border-[#EFBA49] rounded-l-md">
                          <Lock size={18} className="text-[#EFBA49]" />
                        </span>
                        <Input
                          type="password"
                          placeholder="Password"
                          {...field}
                          className="bg-transparent border-l-0 border-[#EFBA49] rounded-l-none text-white placeholder:text-white/40 h-12 text-[1.05rem] focus-visible:ring-0 focus-visible:border-[#EFBA49]"
                        />
                      </div>
                    </FormControl>
                    <FormMessage className="text-red-400 text-xs mt-1" />
                  </FormItem>
                )}
              />

              {/* Forgot password */}
              <div className="text-right">
                <a href="#" className="text-sm text-[#EFBA49] hover:underline">
                  Forgot Password?
                </a>
              </div>

              {/* Submit */}
              <Button
                type="submit"
                className="w-full bg-[#EFBA49] text-[#781B43] font-semibold hover:bg-[#EFBA49]/90 h-11 text-base cursor-pointer"
              >
                Login Now
              </Button>

            </form>
          </Form>
        </div>
      </div>

    </section>
  );
};

export default Login;