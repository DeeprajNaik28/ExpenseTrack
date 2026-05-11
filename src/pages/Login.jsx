import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import {
  signInWithEmailAndPassword,
  setPersistence,
  browserLocalPersistence,
  browserSessionPersistence,
} from "firebase/auth";

import toast from "react-hot-toast";

import { auth } from "../firebase/firebase";
import { useAuth } from "../context/AuthContext";

function Login() {
  const navigate = useNavigate();

  const { user } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user]);

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      await setPersistence(
        auth,
        rememberMe
          ? browserLocalPersistence
          : browserSessionPersistence
      );

      await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

      toast.success("Login successful ✅");

      navigate("/");
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center px-4">

      <form
        onSubmit={handleLogin}
        className="bg-slate-800 p-8 rounded-2xl w-full max-w-md shadow-xl"
      >

        <h1 className="text-white text-3xl font-bold mb-2 text-center">
          Welcome Back
        </h1>

        <p className="text-slate-400 text-center mb-6">
          Login to continue
        </p>

        <input
          type="email"
          placeholder="Email"
          className="w-full p-3 rounded-lg mb-4 bg-slate-700 text-white outline-none"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full p-3 rounded-lg mb-4 bg-slate-700 text-white outline-none"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <div className="flex items-center gap-2 mb-4 text-white">
          <input
            type="checkbox"
            checked={rememberMe}
            onChange={() =>
              setRememberMe(!rememberMe)
            }
          />

          <label>Remember Me</label>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-lg font-semibold transition"
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        <p className="text-slate-400 mt-4 text-center">
          Don&apos;t have an account?{" "}
          <Link
            to="/signup"
            className="text-blue-400"
          >
            Signup
          </Link>
        </p>

      </form>

    </div>
  );
}

export default Login;