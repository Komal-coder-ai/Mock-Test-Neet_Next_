import { useRef, useState, useEffect } from "react";
import { useRouter } from "next/router";
import { motion } from "framer-motion";
import Link from "next/link";
import { Formik, Form, Field } from "formik";
import ErrorMsg from "../../components/ErrorMsg";
import Toast from "../../components/Toast";

// API Functions
import { authApi } from "../../lib/authApi";
import { Lock, Phone } from "lucide-react";
const sendOTP = async (phone: string) => {
  const data = await authApi({
    url: "/api/login",
    method: "POST",
    data: { phone },
  });
  return { res: { ok: data?.ok }, data };
};

const verifyOTP = async (phone: string, otp: string) => {
  const data = await authApi({
    url: "/api/verify-otp",
    method: "POST",
    data: { phone, otp },
  });
  return { res: { ok: data?.ok }, data };
};

function OTPBoxes({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  const inputs = useRef<HTMLInputElement[]>([]);

  function handleChange(index: number, val: string) {
    if (!/^[0-9]?$/.test(val)) return;
    const chars = value.split("");
    while (chars.length < 6) chars.push("");
    chars[index] = val;
    const final = chars.join("").slice(0, 6);
    onChange(final);
    if (val && index < 5) inputs.current[index + 1]?.focus();
  }

  // ⭐⭐ NEW — Handle PASTE event
  function handlePaste(e: React.ClipboardEvent<HTMLInputElement>) {
    e.preventDefault();
    const pasted = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, 6);
    if (!pasted) return;

    // Auto-fill OTP
    onChange(pasted);

    // Move focus to last box
    const lastIndex = pasted.length - 1;
    inputs.current[lastIndex]?.focus();
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>, i: number) {
    if (e.key === "Backspace" && !e.currentTarget.value && i > 0) {
      inputs.current[i - 1]?.focus();
    }
  }

  const chars = value.split("").slice(0, 6);

  return (
    <div className="flex gap-1.5 sm:gap-2 justify-center">
      {Array.from({ length: 6 }).map((_, i) => (
        <motion.input
          key={i}
          ref={(el) => {
            inputs.current[i] = el!;
          }}
          value={chars[i] || ""}
          onPaste={handlePaste} // ⭐ NEW
          onChange={(e) =>
            handleChange(i, e.target.value.replace(/[^0-9]/g, "").slice(0, 1))
          }
          onKeyDown={(e) => handleKeyDown(e, i)}
          className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 text-center border-2 border-gray-300 rounded-lg text-lg sm:text-xl font-bold focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
          inputMode="numeric"
          maxLength={1}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: i * 0.05 }}
        />
      ))}
    </div>
  );
}

export default function LoginPage() {
  const router = useRouter();
  // redirect if already logged in
  useEffect(() => {
    try {
      const token = localStorage.getItem("accessToken");
      const phone = localStorage.getItem("userPhone");
      const userId = localStorage.getItem("userId");
      const role = localStorage.getItem("userRole");
    } catch (e) {}
  }, []);
  const [error, setError] = useState<string | null>(null);

  const features = [
    {
      icon: "🔒",
      title: "Data Privacy",
      desc: "Your information is encrypted and stored securely",
    },
    {
      icon: "⚡",
      title: "Quick Access",
      desc: "Resume your practice instantly after verification",
    },
    {
      icon: "📊",
      title: "Track Progress",
      desc: "All your test history and analytics in one place",
    },
  ];

  return (
    <div className="min-h-screen lg:flex bg-gray-50">
      {/* Left Hero Section */}
      <motion.div
        className="lg:w-1/2 hero-left p-6 sm:p-8 md:p-10 items-center justify-center hidden lg:flex relative overflow-hidden"
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        {/* Animated background circles */}
        <motion.div
          className="absolute top-10 sm:top-20 right-10 sm:right-20 w-48 h-48 sm:w-64 sm:h-64 bg-white opacity-5 rounded-full"
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360],
          }}
          transition={{ duration: 20, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-10 sm:bottom-20 left-10 sm:left-20 w-32 h-32 sm:w-48 sm:h-48 bg-white opacity-5 rounded-full"
          animate={{
            scale: [1, 1.3, 1],
            rotate: [360, 180, 0],
          }}
          transition={{ duration: 15, repeat: Infinity }}
        />

        <div className="max-w-md relative z-10">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <h1 className="hero-title font-extrabold text-2xl sm:text-3xl md:text-4xl">
              Welcome Back!
            </h1>
            <p className="mt-3 sm:mt-4 text-base sm:text-lg text-blue-100">
              Sign in to continue your NEET & JEE preparation journey.
            </p>
          </motion.div>

          {/* Features Grid */}
          <div className="mt-6 sm:mt-8 grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            {features.map((feature, idx) => (
              <motion.div
                key={idx}
                className="bg-white bg-opacity-10 backdrop-blur-sm rounded-lg p-3 sm:p-4 border border-white border-opacity-20"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 + idx * 0.1 }}
                whileHover={{
                  scale: 1.05,
                  backgroundColor: "rgba(255,255,255,0.15)",
                }}
              >
                <div className="text-lg sm:text-xl mb-2">{feature.icon}</div>
                <h3 className="font-semibold text-white text-xs sm:text-sm">
                  {feature.title}
                </h3>
                <p className="text-[10px] sm:text-xs text-blue-100 mt-1">
                  {feature.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Right Form Section */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-4 sm:p-6 md:p-8 min-h-screen">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="w-full max-w-md form-card p-6 sm:p-8 mx-auto"
        >
          {/* Header with animated icon */}
          <div className="text-center mb-6">
            <motion.div
              className="inline-block text-4xl sm:text-5xl mb-3"
              animate={{
                rotate: [0, -10, 10, -10, 0],
                scale: [1, 1.1, 1],
              }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
            >
              <Lock />
            </motion.div>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
              Sign In
            </h2>
            <p className="muted mt-2 text-sm sm:text-base">
              Enter your phone number to login
            </p>
          </div>

          <Formik
            initialValues={{ phone: "" }}
            validate={(v: any) => {
              const errors: any = {};
              if (!v.phone) errors.phone = "Phone is required";
              else if (!/^[0-9]{10}$/.test(v.phone))
                errors.phone = "Enter a valid 10-digit phone number";
              return errors;
            }}
            onSubmit={async (values: any, { setSubmitting }: any) => {
              setError(null);
              setSubmitting(true);
              try {
                const phone = String(values.phone)
                  .replace(/\D/g, "")
                  .slice(0, 10);
                if (phone.length !== 10) {
                  setError("Enter a valid 10-digit phone number");
                  setSubmitting(false);
                  return;
                }
                const data = await authApi({
                  url: "/api/login",
                  method: "POST",
                  data: { phone },
                });
                if (data?.ok && data?.accessToken) {
                  try {
                    localStorage.setItem("accessToken", data.accessToken);
                    localStorage.setItem("refreshToken", data.refreshToken);
                    localStorage.setItem("userRole", data.role);
                    localStorage.setItem("userId", data.id);
                    localStorage.setItem("userPhone", phone);
                  } catch (e) {}
                  router.push("/dashboard");
                } else {
                  setError(data?.error || "Login failed");
                }
              } catch (err) {
                setError("Network error");
              } finally {
                setSubmitting(false);
              }
            }}
          >
            {({ errors, touched, isSubmitting }: any) => (
              <Form className="space-y-5">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                >
                  <div>
                    <label className="flex text-sm font-semibold text-gray-700 mb-2 items-center gap-2">
                      <span>
                        <Phone />
                      </span>{" "}
                      Phone Number
                    </label>
                    <Field name="phone">
                      {({ field }: any) => (
                        <input
                          {...field}
                          inputMode="numeric"
                          maxLength={10}
                          onChange={(e) => {
                            const digits = e.target.value.replace(/\D/g, "");
                            field.onChange({
                              target: { name: field.name, value: digits },
                            });
                          }}
                          className="w-full border-2 border-gray-300 rounded-lg p-3 text-base sm:text-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                          placeholder="Enter 10-digit number"
                        />
                      )}
                    </Field>
                    {touched.phone && <ErrorMsg>{errors.phone}</ErrorMsg>}
                  </div>
                  {error && <ErrorMsg>{error}</ErrorMsg>}
                  <motion.button
                    className="w-full mt-3 btn-primary flex justify-center py-2 text-sm font-medium rounded-md shadow-sm border border-blue-400 hover:bg-blue-50 transition-all"
                    type="submit"
                    disabled={isSubmitting}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {isSubmitting ? (
                      <span className="flex items-center justify-center gap-2">
                        <motion.span
                          animate={{ rotate: 360 }}
                          transition={{
                            duration: 1,
                            repeat: Infinity,
                            ease: "linear",
                          }}
                        >
                          ⏳
                        </motion.span>
                        Logging in...
                      </span>
                    ) : (
                      "Login →"
                    )}
                  </motion.button>
                </motion.div>
              </Form>
            )}
          </Formik>

          <motion.div
            className="mt-6 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            {/* <p className="text-sm muted">
              Don't have an account?{" "}
              <Link
                href="/register"
                className="text-accent font-semibold hover:underline"
              >
                Register Now
              </Link>
            </p> */}
            <div className="mt-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
              <p className="text-xs flex sm:text-sm text-gray-600">
                <Lock /> Your data is encrypted and secure. By signing in, you
                agree to our terms of service.
              </p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
