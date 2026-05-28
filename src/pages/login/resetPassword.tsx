import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { doResetPassword } from "@/src/services/login/LoginAPIFunctions";
import CustomLoader from "@/src/components/CustomLoader";

// ── Zod schema — passwords must match ──────────────────────────────────────
const resetPasswordSchema = z
    .object({
        email: z
            .string()
            .min(1, "Please enter a valid email address!")
            .email("Please enter a valid email address!"),
        password: z.string().min(6, "Password must be at least 6 characters"),
        confirmPassword: z.string().min(6, "Please confirm your password"),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "Passwords do not match",
        path: ["confirmPassword"], // error lands on the confirmPassword field
    });

type ResetPasswordForm = z.infer<typeof resetPasswordSchema>;

const ResetPassword: React.FC = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [isResetting, setIsResetting] = useState(false);

    // ── Guard: token must be present in the URL ──────────────────────────────
    const token = searchParams.get("token");
    const emailFromUrl = searchParams.get("email") ?? "";

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<ResetPasswordForm>({
        resolver: zodResolver(resetPasswordSchema),
        defaultValues: { email: emailFromUrl },
    });

    const inputGroup =
        "flex h-12 rounded-md border border-lightYellow/40 overflow-hidden focus-within:border-lightYellow focus-within:ring-4 focus-within:ring-lightYellow/40 transition-all duration-200";
    const input =
        "flex-1 bg-transparent px-3 text-white placeholder:text-white/40 outline-none focus:bg-transparent focus:ring-0";

    // ── Invalid / missing token ──────────────────────────────────────────────
    if (!token) {
        return (
            <div className="w-full text-white text-center flex flex-col gap-4">
                <h1 className="text-3xl font-semibold text-lightYellow">Invalid Link</h1>
                <p className="text-white/70 text-sm">
                    This password-reset link is invalid or has expired.
                </p>
                <button
                    onClick={() => navigate("/login")}
                    className="w-full h-11 rounded-lg bg-bgYellow text-black font-semibold hover:bg-bgYellow/90"
                >
                    Back to Login
                </button>
            </div>
        );
    }

    // ── Submit ───────────────────────────────────────────────────────────────
    const onSubmit = async (formData: ResetPasswordForm) => {
        try {
            setIsResetting(true);
            console.log("forma faya:: ", { ...formData, token: token })
            const res = await doResetPassword({ ...formData, token: token });
            // console.log("token faya:: ", form)
            console.log("response:: ", res);
            if (res.status) {
                // Success — show the API message then redirect
                toast.success(res.message ?? "Password reset successfully!");
                setTimeout(() => navigate("/login"), 1500);
            } else {
                toast.error(res.message ?? "Reset password failed. Please try again.");
            }
        } catch (err: any) {
            const msg =
                err?.response?.data?.message ?? "Invalid credentials. Please try again.";
            toast.error(msg);
        } finally {
            setIsResetting(false);
        }
    };

    // ── Form ─────────────────────────────────────────────────────────────────
    return (
        <div className="w-full text-white text-center">
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
                <h1 className="text-3xl font-semibold text-lightYellow mb-2">
                    Reset Password
                </h1>
                <p className="text-white text-sm mb-8">
                    Enter your new password below.
                </p>

                {/* Email (pre-filled, read-only) */}
                <div className="flex flex-col gap-1 text-left">
                    <div className={inputGroup}>
                        <span className="flex items-center px-3">
                            <Mail size={18} className="text-lightYellow" />
                        </span>
                        <input
                            type="email"
                            placeholder="Email ID"
                            readOnly
                            {...register("email")}
                            className={`${input} opacity-60 cursor-not-allowed`}
                        />
                    </div>
                    {errors.email && (
                        <p className="text-red-400 text-xs">{errors.email.message}</p>
                    )}
                </div>

                {/* New Password */}
                <div className="flex flex-col gap-1 text-left">
                    <div className={inputGroup}>
                        <span className="flex items-center px-3">
                            <Lock size={18} className="text-lightYellow" />
                        </span>
                        <input
                            type={showPassword ? "text" : "password"}
                            placeholder="New Password"
                            {...register("password")}
                            className={input}
                        />
                        <span
                            className="flex items-center px-3 cursor-pointer"
                            onClick={() => setShowPassword((p) => !p)}
                        >
                            {showPassword ? (
                                <EyeOff size={18} className="text-lightYellow" />
                            ) : (
                                <Eye size={18} className="text-lightYellow" />
                            )}
                        </span>
                    </div>
                    {errors.password && (
                        <p className="text-red-400 text-xs">{errors.password.message}</p>
                    )}
                </div>

                {/* Confirm Password */}
                <div className="flex flex-col gap-1 text-left">
                    <div className={inputGroup}>
                        <span className="flex items-center px-3">
                            <Lock size={18} className="text-lightYellow" />
                        </span>
                        <input
                            type={showConfirm ? "text" : "password"}
                            placeholder="Confirm Password"
                            {...register("confirmPassword")}
                            className={input}
                        />
                        <span
                            className="flex items-center px-3 cursor-pointer"
                            onClick={() => setShowConfirm((p) => !p)}
                        >
                            {showConfirm ? (
                                <EyeOff size={18} className="text-lightYellow" />
                            ) : (
                                <Eye size={18} className="text-lightYellow" />
                            )}
                        </span>
                    </div>
                    {errors.confirmPassword && (
                        <p className="text-red-400 text-xs">
                            {errors.confirmPassword.message}
                        </p>
                    )}
                </div>

                <button
                    type="submit"
                    disabled={isResetting}
                    className="w-full h-11 rounded-lg bg-bgYellow text-black font-semibold hover:bg-bgYellow/90 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                    {isResetting ? <CustomLoader loading={isResetting} /> : "Reset Password"}
                </button>
            </form>
        </div>
    );
};

export default ResetPassword;