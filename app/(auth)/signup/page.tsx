"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Eye, Mail, Lock, User, Loader2 } from "lucide-react";
import { useState } from "react";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";

const signUpSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});
type SignUpFormValues = z.infer<typeof signUpSchema>;

export default function SignUpPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  const { register: authRegister, setUnverifiedEmail } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const { register, handleSubmit, reset, formState: { errors } } = useForm<SignUpFormValues>({
    resolver: zodResolver(signUpSchema),
  });

  const onSubmit = async (data: SignUpFormValues) => {
    if (!agreedToTerms) {
      toast({
        title: "Agreement required",
        description: "Please agree to the Terms & Conditions and Privacy Policy",
        variant: "destructive",
      });
      return;
    }
    setLoading(true);
    try {
      await authRegister(data.email.toLowerCase().trim(), data.password);
      toast({
        title: "Account created!",
        description: "Please check your email for the confirmation code.",
      });
      setUnverifiedEmail(data.email);
      reset();
    } catch (error: any) {
      toast({
        title: "Registration failed",
        description: error.message || 'Registration failed',
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="w-full overflow-hidden grid lg:grid-cols-2"
    // className="w-full max-w-6xl bg-white rounded-3xl shadow-md overflow-hidden grid lg:grid-cols-2"
    >
      {/* ================= LEFT SIDE ================= */}
      <div className="p-10 md:p-14">

        {/* Logo */}
        <div className="mb-12">
          <h1 className="text-2xl font-semibold text-[#3d2f4d]">
            <Link href="/">Pentasent</Link>
          </h1>
        </div>

        {/* Heading */}
        <h2 className="text-3xl md:text-4xl font-light text-[#3c2a34] mb-4">
          Create your account
        </h2>

        <p className="text-gray-500 mb-8">
          Start your wellness journey today and reconnect with your rhythm.
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

          {/* Email */}
          <div className="relative">
            <Mail className="absolute left-4 top-4 w-5 h-5 text-gray-400" />
            <input
              {...register("email")}
              type="email"
              placeholder="Email Address"
              className={`w-full pl-12 pr-4 py-4 rounded-xl border ${errors.email ? 'border-red-500' : 'border-gray-200'} focus:ring-2 focus:ring-[#e8d4df] outline-none transition`}
            />
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
          </div>

          {/* Password */}
          <div className="relative">
            <Lock className="absolute left-4 top-4 w-5 h-5 text-gray-400" />
            <input
              {...register("password")}
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              className={`w-full pl-12 pr-12 py-4 rounded-xl border ${errors.password ? 'border-red-500' : 'border-gray-200'} focus:ring-2 focus:ring-[#e8d4df] outline-none transition`}
            />
            <Eye
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-4 w-5 h-5 text-gray-400 cursor-pointer"
            />
            {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
          </div>

          {/* Confirm Password */}
          <div className="relative">
            <Lock className="absolute left-4 top-4 w-5 h-5 text-gray-400" />
            <input
              {...register("confirmPassword")}
              type={showConfirm ? "text" : "password"}
              placeholder="Confirm Password"
              className={`w-full pl-12 pr-12 py-4 rounded-xl border ${errors.confirmPassword ? 'border-red-500' : 'border-gray-200'} focus:ring-2 focus:ring-[#e8d4df] outline-none transition`}
            />
            <Eye
              onClick={() => setShowConfirm(!showConfirm)}
              className="absolute right-4 top-4 w-5 h-5 text-gray-400 cursor-pointer"
            />
            {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword.message}</p>}
          </div>

          {/* Terms */}
          <div className="flex items-start gap-3 text-sm text-gray-600">
            <input
              type="checkbox"
              checked={agreedToTerms}
              onChange={(e) => setAgreedToTerms(e.target.checked)}
              className="mt-0.5 accent-[#3d2f4d]"
            />
            <p>
              I agree to the{" "}
              <Link href="/terms-and-conditions" className="text-[#3d2f4d] font-medium">
                Terms & Conditions
              </Link>{" "}
              and{" "}
              <Link href="/privacy-policy" className="text-[#3d2f4d] font-medium">
                Privacy Policy
              </Link>
            </p>
          </div>

          {/* Sign Up Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 rounded-xl bg-[#3d2f4d] text-white font-medium hover:bg-[#2d1f3d] transition-all flex justify-center items-center disabled:opacity-70"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Create Account"}
          </button>

        </form>

        {/* Login */}
        <p className="text-center text-sm text-gray-500 mt-8">
          Already have an account?{" "}
          <Link href="/signin" className="text-[#3d2f4d] font-medium">
            Sign In
          </Link>
        </p>

      </div>

      {/* ================= RIGHT SIDE ================= */}
      <div className="hidden lg:flex relative bg-[#4b2a3f] text-white p-14 items-center justify-center overflow-hidden">

        {/* Gradient layer */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#4b2a3f] via-[#5a324a] to-[#3d2235]" />

        {/* Soft glow blobs */}
        <div className="absolute -top-32 -left-32 w-[420px] h-[420px] bg-pink-400/20 rounded-full blur-[120px]" />
        <div className="absolute -bottom-32 -right-32 w-[420px] h-[420px] bg-purple-400/20 rounded-full blur-[140px]" />

        {/* Pattern */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `
              radial-gradient(circle at 20% 20%, white 1px, transparent 1px),
              radial-gradient(circle at 80% 80%, white 1px, transparent 1px)
            `,
            backgroundSize: "120px 120px",
          }}
        />

        <div className="relative z-10 text-center max-w-md">

          <h3 className="text-3xl font-light mb-6">
            Your transformation starts here.
          </h3>

          <p className="text-white/80 mb-10">
            Build rituals, track your wellness, and feel supported
            every step of your journey.
          </p>

          {/* ================= MOBILE MOCKUPS ================= */}
          <div className="relative h-[220px] hidden lg:block">

            {/* Back Phone */}
            <motion.div
              initial={{ opacity: 0, x: 60, rotate: 6 }}
              whileInView={{ opacity: 1, x: 0, rotate: 6 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className='absolute -right-[150px] top-10 inset-[8px] w-[430px] h-[660px] mx-auto rotate-[6deg]'>
              <Image
                alt="Pentasent Community"
                src="/images/community.svg"
                width={1000}
                height={1000}
                className="w-full h-full object-contain"
              />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 60, rotate: -6 }}
              whileInView={{ opacity: 1, x: 0, rotate: -6 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className='absolute right-[140px] top-0 inset-[8px] w-[430px] h-[660px] mx-auto -rotate-[6deg]'>
              <Image
                alt="Pentasent Welcome"
                src="/images/splashscreen.svg"
                width={1000}
                height={1000}
                className="w-full h-full object-contain"
              />
            </motion.div>

          </div>

        </div>
      </div>

    </motion.div>
  );
}