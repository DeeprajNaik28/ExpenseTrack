import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import {
  createUserWithEmailAndPassword,
} from "firebase/auth";

import toast from "react-hot-toast";

import { auth } from "../firebase/firebase";
import { useAuth } from "../context/AuthContext";

function Signup() {

  const navigate = useNavigate();

  const { user } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user]);

  const handleSignup = async (e) => {
    e.preventDefault();

    try {

      setLoading(true);

      await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      toast.success("Account created successfully ✅");

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
        onSubmit={handleSignup}
        className="bg-slate-800 p-8 rounded-2xl w-full max-w-md shadow-xl"
      >

        <h1 className="text-white text-3xl font-bold mb-2 text-center">
          Create Account
        </h1>

        <p className="text-slate-400 text-center mb-6">
          Start tracking your expenses
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

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-lg font-semibold transition"
        >
          {loading ? "Creating..." : "Sign Up"}
        </button>

        <p className="text-slate-400 mt-4 text-center">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-blue-400"
          >
            Login
          </Link>
        </p>

      </form>

    </div>
  );
}

export default Signup;