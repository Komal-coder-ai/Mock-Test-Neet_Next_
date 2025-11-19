import { useRef, useState, useEffect } from "react";
import { useRouter } from "next/router";
import { motion } from "framer-motion";
import Link from "next/link";
import { Formik, Form, Field } from "formik";
import ErrorMsg from "../../components/ErrorMsg";
import Toast from "../../components/Toast";

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
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
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
    <div className="flex gap-2 justify-center">
      {Array.from({ length: 6 }).map((_, i) => (
        <motion.input
          key={i}
          ref={(el) => (inputs.current[i] = el!)}
          value={chars[i] || ""}
          onPaste={handlePaste}  // ⭐ NEW
          onChange={(e) =>
            handleChange(i, e.target.value.replace(/[^0-9]/g, "").slice(0, 1))
          }
          onKeyDown={(e) => handleKeyDown(e, i)}
          className="w-12 h-12 text-center border-2 border-gray-300 rounded-lg text-xl font-bold focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
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
      const token = localStorage.getItem('accessToken')
      const phone = localStorage.getItem('userPhone')
      const userId = localStorage.getItem('userId')
      const role = localStorage.getItem('userRole')
      if (token || phone || userId) {
        if (role === 'admin') router.replace('/admin/dashboard')
        else router.replace(`/dashboard?phone=${encodeURIComponent(phone || '')}`)
      }
    } catch (e) {}
  }, [])
  const [step, setStep] = useState<"request" | "verify">("request");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [phoneStored, setPhoneStored] = useState("");
  const [otp, setOtp] = useState("");

  const features = [
    {
      icon: "📱",
      title: "OTP Verification",
      desc: "Secure login with one-time password sent to your phone",
    },
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
    <div className="min-h-screen md:flex bg-gray-50">
      {/* Left Hero Section */}
      <motion.div
        className="md:w-1/2 hero-left p-10 items-center justify-center hidden md:flex relative overflow-hidden"
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        {/* Animated background circles */}
        <motion.div
          className="absolute top-20 right-20 w-64 h-64 bg-white opacity-5 rounded-full"
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360],
          }}
          transition={{ duration: 20, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-20 left-20 w-48 h-48 bg-white opacity-5 rounded-full"
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
            <h1 className="hero-title font-extrabold">Welcome Back!</h1>
            <p className="mt-4 text-lg text-blue-100">
              Sign in to continue your NEET & JEE preparation journey.
            </p>
          </motion.div>

          {/* Features Grid */}
          <div className="mt-8 grid grid-cols-2 gap-4">
            {features.map((feature, idx) => (
              <motion.div
                key={idx}
                className="bg-white bg-opacity-10 backdrop-blur-sm rounded-lg p-4 border border-white border-opacity-20"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 + idx * 0.1 }}
                whileHover={{
                  scale: 1.05,
                  backgroundColor: "rgba(255,255,255,0.15)",
                }}
              >
                {feature.icon}

                <h3 className="font-semibold text-white text-sm">
                  {feature.title}
                </h3>
                <p className="text-xs text-blue-100 mt-1">{feature.desc}</p>
              </motion.div>
            ))}
          </div>

          <motion.div
            className="mt-8"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            <p className="text-sm text-blue-100 mb-3">New to our platform?</p>
            <Link
              href="/register"
              className="inline-flex items-center gap-2 px-6 py-3 bg-white text-blue-900 rounded-lg font-semibold hover:bg-blue-50 transition-all shadow-lg"
            >
              Create Account →
            </Link>
          </motion.div>
        </div>
      </motion.div>

      {/* Right Form Section */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="w-full max-w-md form-card p-8"
        >
          {/* Header with animated icon */}
          <div className="text-center mb-6">
            <motion.div
              className="inline-block text-5xl mb-3"
              animate={{
                rotate: [0, -10, 10, -10, 0],
                scale: [1, 1.1, 1],
              }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
            >
              🔐
            </motion.div>
            <h2 className="text-3xl font-bold text-gray-900">Sign In</h2>
            <p className="muted mt-2">Enter your phone number to receive OTP</p>
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
              setMessage(null);
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
                const res = await fetch("/api/login", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ phone }),
                });
                const data = await res.json();
                if (res.ok) {
                  setMessage("OTP sent (check response in dev)");
                  if (data?.otp) setMessage((m) => `${m} — OTP: ${data.otp}`);
                  setPhoneStored(phone);
                  try {
                    localStorage.setItem("userPhone", phone);
                  } catch (e) {}
                  setStep("verify");
                } else {
                  setError(data?.error || "Failed to send OTP");
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
                {step === "request" && (
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                  >
                    <div>
                      <label className="block  text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                        <span>📞</span> Phone Number
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
                            className="w-full border-2 border-gray-300 rounded-lg p-3 text-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                            placeholder="Enter 10-digit number"
                          />
                        )}
                      </Field>
                      {touched.phone && <ErrorMsg>{errors.phone}</ErrorMsg>}
                    </div>
                    {message && (
                      <motion.div
                        className="p-3 bg-green-50 border border-green-200 rounded-lg text-sm text-green-700"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                      >
                        ✅ {message}
                      </motion.div>
                    )}
                    {error && <ErrorMsg>{error}</ErrorMsg>}
                    <motion.button
                      className="w-full mt-3 btn-primary py-3 text-lg font-semibold rounded-lg shadow-md"
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
                          Sending...
                        </span>
                      ) : (
                        "Send OTP →"
                      )}
                    </motion.button>
                  </motion.div>
                )}

                {step === "verify" && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="text-center mb-4">
                      <motion.div
                        className="inline-block text-4xl mb-2"
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 1, repeat: Infinity }}
                      >
                        📬
                      </motion.div>
                      <p className="text-sm text-gray-600">
                        OTP sent to <strong>{phoneStored}</strong>
                      </p>
                    </div>

                    <div className="mb-4">
                      <label className="block text-sm font-semibold text-gray-700 mb-3 text-center">
                        Enter 6-Digit OTP
                      </label>
                      <OTPBoxes value={otp} onChange={setOtp} />
                    </div>

                    {error && <ErrorMsg>{error}</ErrorMsg>}

                    <motion.button
                      className="w-full btn-primary py-3 text-lg font-semibold rounded-lg shadow-md mt-4"
                      type="button"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={async () => {
                        if (otp.length !== 6) {
                          setError("Enter 6-digit OTP");
                          return;
                        }
                        try {
                          const res = await fetch("/api/verify-otp", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({ phone: phoneStored, otp }),
                          });
                          const data = await res.json();
                          if (res.ok) {
                            try {
                              if (data?.accessToken)
                                localStorage.setItem(
                                  "accessToken",
                                  data.accessToken
                                );
                              if (data?.refreshToken)
                                localStorage.setItem(
                                  "refreshToken",
                                  data.refreshToken
                                );
                              if (data?.role)
                                localStorage.setItem("userRole", data.role);
                              if (data?.id)
                                localStorage.setItem("userId", data.id);
                            } catch (e) {}
                            if (data?.role === "admin")
                              router.push("/dashboard");
                            else
                              router.push(
                                `/adhar?phone=${encodeURIComponent(
                                  phoneStored
                                )}`
                              );
                          } else {
                            setError(data?.error || "OTP verification failed");
                          }
                        } catch (err) {
                          setError("Network error");
                        }
                      }}
                    >
                      Verify & Continue ✓
                    </motion.button>

                    <div className="flex gap-3 mt-4">
                      <motion.button
                        type="button"
                        className="flex-1 border-2 border-gray-300 rounded-lg py-2 font-medium hover:bg-gray-50 transition-all"
                        onClick={() => setStep("request")}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        ← Back
                      </motion.button>
                      <motion.button
                        type="button"
                        className="flex-1 border-2 border-blue-500 text-blue-600 rounded-lg py-2 font-medium hover:bg-blue-50 transition-all"
                        onClick={() => setStep("request")}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        🔄 Resend
                      </motion.button>
                    </div>
                  </motion.div>
                )}
              </Form>
            )}
          </Formik>

          <motion.div
            className="mt-6 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <p className="text-sm muted">
              Don't have an account?{" "}
              <Link
                href="/register"
                className="text-accent font-semibold hover:underline"
              >
                Register Now
              </Link>
            </p>
            <div className="mt-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
              <p className="text-xs text-gray-600">
                🔒 Your data is encrypted and secure. By signing in, you agree
                to our terms of service.
              </p>
            </div>
          </motion.div>

          <Toast
            message={message || error || null}
            type={error ? "error" : "success"}
            onClose={() => {
              setMessage(null);
              setError(null);
            }}
          />
        </motion.div>
      </div>
    </div>
  );
}
