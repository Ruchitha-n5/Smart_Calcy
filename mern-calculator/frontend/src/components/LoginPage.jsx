import { useState } from "react";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  Sun,
  Moon,
  Calculator,
  LineChart,
  Grid3x3,
  Clock,
  User,
  AlertCircle,
  X,
  CheckCircle2,
} from "lucide-react";
import { loginUser, registerUser, googleAuthUser } from "../api/authApi";

export default function LoginPage({ onLoginSuccess, dark, setDark }) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [toastMessage, setToastMessage] = useState("");
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotSuccess, setForgotSuccess] = useState(false);
  const [showGoogleModal, setShowGoogleModal] = useState(false);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 4000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email || !password || (isSignUp && !name)) {
      setError("Please fill in all required fields.");
      return;
    }

    setLoading(true);
    try {
      let data;
      if (isSignUp) {
        data = await registerUser({ name, email, password });
      } else {
        data = await loginUser({ email, password });
      }

      if (data.token && data.user) {
        onLoginSuccess(data.user, data.token);
      }
    } catch (err) {
      setError(err.message || "Authentication failed. Please check your details.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleAuth = async (googleData) => {
    setLoading(true);
    try {
      const data = await googleAuthUser(googleData);
      if (data.token && data.user) {
        onLoginSuccess(data.user, data.token);
      }
    } catch (err) {
      setError("Google Sign-In failed.");
    } finally {
      setLoading(false);
      setShowGoogleModal(false);
    }
  };

  const handleGitHubClick = () => {
    showToast("GitHub authentication is coming soon!");
  };

  const handleForgotSubmit = (e) => {
    e.preventDefault();
    if (!forgotEmail) return;
    setForgotSuccess(true);
    setTimeout(() => {
      setShowForgotModal(false);
      setForgotSuccess(false);
      setForgotEmail("");
      showToast("Password reset instructions sent to your email!");
    }, 2000);
  };

  return (
    <div className={`min-h-screen flex flex-col justify-between p-4 md:p-8 ${dark ? "dark-theme" : "light-theme"} bg-[#0b0a14] text-white selection:bg-accent-purple selection:text-white`}>
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-6 right-6 z-50 bg-[#1c1830] border border-accent-purple/50 text-white text-xs px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2 animate-bounce">
          <AlertCircle size={16} className="text-accent-pink" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Navigation Header */}
      <header className="flex items-center justify-between w-full max-w-7xl mx-auto py-2 px-2 mb-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-accent-purple via-purple-500 to-accent-pink flex items-center justify-center font-bold text-sm shadow-glow">
            fx
          </div>
          <div>
            <h2 className="font-bold text-base leading-tight tracking-tight">Visual Scientific Calculator</h2>
            <p className="text-[11px] text-white/40 leading-tight">Calculate. Visualize. Understand.</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={() => setDark(!dark)}
            className="w-9 h-9 flex items-center justify-center rounded-full border border-border bg-bg-soft hover:bg-white/10 transition-colors text-white/70"
            title={dark ? "Switch to light mode" : "Switch to dark mode"}
          >
            {dark ? <Sun size={16} /> : <Moon size={16} />}
          </button>

          <div className="flex items-center gap-2 text-xs">
            <span className="text-white/50 hidden sm:inline">
              {isSignUp ? "Already have an account?" : "New here?"}
            </span>
            <button
              onClick={() => {
                setIsSignUp(!isSignUp);
                setError("");
              }}
              className="px-4 py-2 rounded-xl bg-bg-soft border border-border hover:border-accent-purple text-accent-purple font-semibold transition-all hover:scale-105"
            >
              {isSignUp ? "Login" : "Sign Up"}
            </button>
          </div>
        </div>
      </header>

      {/* Main Container Grid */}
      <main className="w-full max-w-7xl mx-auto flex-1 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center border border-border/40 rounded-3xl bg-[#100e1f]/80 backdrop-blur-xl p-6 md:p-10 shadow-2xl relative overflow-hidden">
        {/* Ambient Glow Effects */}
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-accent-purple/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-accent-pink/15 rounded-full blur-3xl pointer-events-none" />

        {/* LEFT PANEL: Showcase & Features */}
        <div className="lg:col-span-6 flex flex-col justify-between h-full space-y-8 relative z-10 pr-0 lg:pr-6">
          <div>
            <h1 className="text-3xl lg:text-4xl font-extrabold tracking-tight">
              {isSignUp ? (
                <>
                  Create <span className="bg-gradient-to-r from-accent-purple via-purple-400 to-accent-pink bg-clip-text text-transparent">Account</span>
                </>
              ) : (
                <>
                  Welcome <span className="bg-gradient-to-r from-accent-purple via-purple-400 to-accent-pink bg-clip-text text-transparent">Back!</span>
                </>
              )}
            </h1>
            <p className="text-white/50 text-sm mt-2">
              {isSignUp
                ? "Join us to save calculations, plot graphs, and unlock full access."
                : "Login to continue your journey of calculations and visualizations."}
            </p>

            {/* Feature List */}
            <div className="mt-8 space-y-4">
              <FeatureItem
                icon={Calculator}
                title="Powerful Calculations"
                desc="From basic arithmetic to advanced mathematics."
                iconColor="text-purple-400"
                bg="bg-purple-500/10 border-purple-500/20"
              />
              <FeatureItem
                icon={LineChart}
                title="Beautiful Visualizations"
                desc="See your functions, graphs, and data come to life."
                iconColor="text-blue-400"
                bg="bg-blue-500/10 border-blue-500/20"
              />
              <FeatureItem
                icon={Grid3x3}
                title="Multiple Tools"
                desc="Matrix operations, geometry, statistics and more."
                iconColor="text-emerald-400"
                bg="bg-emerald-500/10 border-emerald-500/20"
              />
              <FeatureItem
                icon={Clock}
                title="History & Saved"
                desc="Track your calculations and save important results."
                iconColor="text-pink-400"
                bg="bg-pink-500/10 border-pink-500/20"
              />
            </div>
          </div>

          {/* Mathematical Graphic Art Center overlay */}
          <div className="hidden xl:block relative w-full h-32 my-2 pointer-events-none opacity-40">
            <svg viewBox="0 0 400 120" className="w-full h-full">
              {/* Sine Wave */}
              <path d="M 10,60 Q 50,10 90,60 T 170,60" fill="none" stroke="#a855f7" strokeWidth="2" />
              <text x="60" y="20" fill="#a855f7" fontSize="10" fontFamily="serif">y = sin(x)</text>

              {/* Circle */}
              <circle cx="230" cy="60" r="30" fill="none" stroke="#ec4899" strokeWidth="1.5" />
              <line x1="230" y1="60" x2="260" y2="60" stroke="#ec4899" strokeWidth="1" strokeDasharray="2 2" />
              <text x="265" y="64" fill="#ec4899" fontSize="10" fontFamily="serif">A = πr²</text>

              {/* Matrix */}
              <text x="320" y="45" fill="#3b82f6" fontSize="11" fontFamily="monospace">1  2  3</text>
              <text x="320" y="65" fill="#3b82f6" fontSize="11" fontFamily="monospace">4  5  6</text>
              <text x="320" y="85" fill="#3b82f6" fontSize="11" fontFamily="monospace">7  8  9</text>
            </svg>
          </div>

          {/* Quote Footer Card */}
          <div className="bg-bg-soft/60 border border-border/60 rounded-2xl p-4 text-xs relative">
            <span className="text-accent-purple text-2xl font-serif leading-none absolute top-3 left-3 opacity-40">“</span>
            <p className="text-white/70 italic pl-5 pr-2">
              Mathematics is not about numbers, equations, computations, or algorithms: it is about understanding.
            </p>
            <p className="text-accent-purple/90 font-medium text-right mt-2 text-[11px]">– William Paul Thurston</p>
          </div>
        </div>

        {/* RIGHT PANEL: Auth Form */}
        <div className="lg:col-span-6 relative z-10">
          <div className="card p-6 md:p-8 border border-border/80 bg-[#141126]/90 shadow-xl rounded-2xl max-w-md mx-auto">
            {/* Lock Icon Header */}
            <div className="w-12 h-12 rounded-2xl bg-accent-purple/15 border border-accent-purple/30 flex items-center justify-center mx-auto mb-4 text-accent-purple">
              <Lock size={22} />
            </div>

            <h2 className="text-xl font-bold text-center">
              {isSignUp ? "Create Your Account" : "Login to Your Account"}
            </h2>
            <p className="text-xs text-white/40 text-center mt-1 mb-6">
              {isSignUp ? "Enter your details to get started" : "Enter your credentials to access your account"}
            </p>

            {error && (
              <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center gap-2">
                <AlertCircle size={15} className="shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {isSignUp && (
                <div>
                  <label className="block text-xs font-medium text-white/70 mb-1.5">Full Name</label>
                  <div className="relative">
                    <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40" />
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Enter your full name"
                      className="w-full bg-bg-soft border border-border rounded-xl pl-10 pr-4 py-2.5 text-xs text-white outline-none focus:border-accent-purple transition-all placeholder:text-white/30"
                      required={isSignUp}
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-medium text-white/70 mb-1.5">Email Address</label>
                <div className="relative">
                  <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="w-full bg-bg-soft border border-border rounded-xl pl-10 pr-4 py-2.5 text-xs text-white outline-none focus:border-accent-purple transition-all placeholder:text-white/30"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-white/70 mb-1.5">Password</label>
                <div className="relative">
                  <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40" />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full bg-bg-soft border border-border rounded-xl pl-10 pr-10 py-2.5 text-xs text-white outline-none focus:border-accent-purple transition-all placeholder:text-white/30"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/40 hover:text-white"
                  >
                    {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>

              {/* Checkbox & Forgot password row */}
              {!isSignUp && (
                <div className="flex items-center justify-between text-xs pt-1">
                  <label className="flex items-center gap-2 text-white/60 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="rounded border-border bg-bg-soft accent-accent-purple"
                    />
                    <span>Remember me</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowForgotModal(true)}
                    className="text-accent-purple hover:underline font-medium"
                  >
                    Forgot Password?
                  </button>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-accent-purple via-purple-600 to-accent-violet text-white font-semibold text-xs flex items-center justify-center gap-2 hover:opacity-90 transition-all shadow-glow disabled:opacity-50"
              >
                {loading ? (
                  <span>Processing...</span>
                ) : (
                  <>
                    <span>{isSignUp ? "Create Account" : "Login"}</span>
                    <ArrowRight size={15} />
                  </>
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="relative my-6 text-center text-xs">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border/60" />
              </div>
              <span className="relative bg-[#141126] px-3 text-white/40">or continue with</span>
            </div>

            {/* Social Buttons */}
            <div className="space-y-2.5">
              <button
                type="button"
                onClick={() => setShowGoogleModal(true)}
                className="w-full flex items-center justify-center gap-3 py-2.5 px-4 rounded-xl bg-bg-soft border border-border hover:bg-white/5 text-xs text-white/90 font-medium transition-all hover:border-white/20"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                </svg>
                <span>Continue with Google</span>
              </button>

              <button
                type="button"
                onClick={handleGitHubClick}
                className="w-full flex items-center justify-center gap-3 py-2.5 px-4 rounded-xl bg-bg-soft border border-border hover:bg-white/5 text-xs text-white/90 font-medium transition-all hover:border-white/20"
              >
                <svg className="w-4 h-4 fill-white" viewBox="0 0 24 24">
                  <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                </svg>
                <span>Continue with GitHub</span>
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Footer text */}
      <footer className="text-center text-xs text-white/40 py-4 max-w-7xl mx-auto">
        By logging in, you agree to our{" "}
        <a href="#terms" onClick={(e) => { e.preventDefault(); showToast("Terms of Service document"); }} className="text-accent-purple hover:underline">
          Terms of Service
        </a>{" "}
        and{" "}
        <a href="#privacy" onClick={(e) => { e.preventDefault(); showToast("Privacy Policy document"); }} className="text-accent-purple hover:underline">
          Privacy Policy
        </a>.
      </footer>

      {/* GOOGLE SIGN-IN INTERACTIVE MODAL */}
      {showGoogleModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-4">
          <div className="card max-w-sm w-full p-6 bg-[#16122b] border border-border/80 rounded-2xl relative shadow-2xl space-y-4">
            <button
              onClick={() => setShowGoogleModal(false)}
              className="absolute top-4 right-4 text-white/40 hover:text-white"
            >
              <X size={18} />
            </button>

            <div className="text-center">
              <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-white/10 flex items-center justify-center">
                <svg className="w-6 h-6" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                </svg>
              </div>
              <h3 className="font-bold text-sm">Sign in with Google</h3>
              <p className="text-xs text-white/50 mt-1">Choose an account to continue</p>
            </div>

            <div className="space-y-2">
              <button
                onClick={() =>
                  handleGoogleAuth({
                    name: "Aditya Kumar",
                    email: "aditya.math@gmail.com",
                    googleId: "google_1029384",
                    avatar: "https://api.dicebear.com/7.x/initials/svg?seed=Aditya",
                  })
                }
                className="w-full p-3 rounded-xl bg-bg-soft hover:bg-white/10 border border-border text-left flex items-center gap-3 transition-colors"
              >
                <div className="w-8 h-8 rounded-full bg-accent-purple flex items-center justify-center font-bold text-xs">
                  AK
                </div>
                <div>
                  <p className="text-xs font-semibold">Aditya Kumar</p>
                  <p className="text-[11px] text-white/40">aditya.math@gmail.com</p>
                </div>
              </button>

              <button
                onClick={() =>
                  handleGoogleAuth({
                    name: "Ruchitha N",
                    email: "ruchitha.smartcalcy@gmail.com",
                    googleId: "google_5829104",
                    avatar: "https://api.dicebear.com/7.x/initials/svg?seed=Ruchitha",
                  })
                }
                className="w-full p-3 rounded-xl bg-bg-soft hover:bg-white/10 border border-border text-left flex items-center gap-3 transition-colors"
              >
                <div className="w-8 h-8 rounded-full bg-accent-pink flex items-center justify-center font-bold text-xs">
                  RN
                </div>
                <div>
                  <p className="text-xs font-semibold">Ruchitha N</p>
                  <p className="text-[11px] text-white/40">ruchitha.smartcalcy@gmail.com</p>
                </div>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* FORGOT PASSWORD MODAL */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-4">
          <div className="card max-w-sm w-full p-6 bg-[#16122b] border border-border/80 rounded-2xl relative shadow-2xl space-y-4">
            <button
              onClick={() => setShowForgotModal(false)}
              className="absolute top-4 right-4 text-white/40 hover:text-white"
            >
              <X size={18} />
            </button>

            <h3 className="font-bold text-sm text-center">Reset Password</h3>
            <p className="text-xs text-white/50 text-center">
              Enter your email address and we'll send you instructions to reset your password.
            </p>

            {forgotSuccess ? (
              <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs text-center flex flex-col items-center gap-2">
                <CheckCircle2 size={24} />
                <span>Reset instructions dispatched!</span>
              </div>
            ) : (
              <form onSubmit={handleForgotSubmit} className="space-y-3">
                <input
                  type="email"
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full bg-bg-soft border border-border rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-accent-purple"
                  required
                />
                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-accent-purple font-semibold text-xs text-white hover:opacity-90"
                >
                  Send Reset Link
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function FeatureItem({ icon: Icon, title, desc, iconColor, bg }) {
  return (
    <div className="flex items-start gap-3.5">
      <div className={`w-10 h-10 rounded-xl border ${bg} flex items-center justify-center shrink-0 mt-0.5`}>
        <Icon size={18} className={iconColor} />
      </div>
      <div>
        <h4 className="font-semibold text-xs lg:text-sm text-white/90">{title}</h4>
        <p className="text-white/40 text-xs mt-0.5 leading-relaxed">{desc}</p>
      </div>
    </div>
  );
}
