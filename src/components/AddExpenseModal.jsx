import { useState } from "react";

import {
  addDoc,
  collection,
  serverTimestamp,
} from "firebase/firestore";

import toast from "react-hot-toast";

import { X } from "lucide-react";

import { motion } from "framer-motion";

import { db } from "../firebase/firebase";

import { useAuth } from "../context/AuthContext";

import { categories } from "../utils/categories";

function AddExpenseModal({ closeModal }) {

  const { user } = useAuth();

  const [amount, setAmount] = useState("");
  const [category, setCategory] =
    useState("Food");

  const [note, setNote] = useState("");

  const [date, setDate] = useState(
    new Date().toISOString().split("T")[0]
  );

  const [loading, setLoading] =
    useState(false);

  const handleAddExpense = async (e) => {

    e.preventDefault();

    if (!amount) {
      return toast.error("Enter amount");
    }

    try {

      setLoading(true);

      await addDoc(
        collection(db, "expenses"),
        {
          userId: user.uid,
          amount: Number(amount),
          category,
          note,
          date,
          createdAt: serverTimestamp(),
        }
      );

      toast.success("Expense added ✅");

      closeModal();

    } catch (error) {

      toast.error(error.message);

    } finally {

      setLoading(false);
    }
  };

  return (
    <div
      onClick={closeModal}
      className="fixed inset-0 bg-black/50 flex items-end justify-center z-50"
    >

      <motion.div
        initial={{
          y: 300,
          opacity: 0,
        }}
        animate={{
          y: 0,
          opacity: 1,
        }}
        transition={{
          duration: 0.3,
        }}
        onClick={(e) =>
          e.stopPropagation()
        }
        className="bg-slate-800 w-full max-w-lg rounded-t-3xl p-6"
      >

        <div className="flex items-center justify-between mb-6">

          <h2 className="text-2xl text-white font-bold">
            Add Expense
          </h2>

          <button
            onClick={closeModal}
            className="text-white"
          >
            <X />
          </button>

        </div>

        <form
          onSubmit={handleAddExpense}
          className="space-y-4"
        >

          <input
            type="number"
            placeholder="Amount"
            className="w-full p-3 rounded-lg bg-slate-700 text-white outline-none"
            value={amount}
            onChange={(e) =>
              setAmount(e.target.value)
            }
          />

          <select
            className="w-full p-3 rounded-lg bg-slate-700 text-white outline-none"
            value={category}
            onChange={(e) =>
              setCategory(e.target.value)
            }
          >

            {categories.map((cat) => (

              <option
                key={cat.name}
                value={cat.name}
              >
                {cat.icon} {cat.name}
              </option>

            ))}

          </select>

          <input
            type="date"
            className="w-full p-3 rounded-lg bg-slate-700 text-white outline-none"
            value={date}
            onChange={(e) =>
              setDate(e.target.value)
            }
          />

          <input
            type="text"
            placeholder="Note (optional)"
            className="w-full p-3 rounded-lg bg-slate-700 text-white outline-none"
            value={note}
            onChange={(e) =>
              setNote(e.target.value)
            }
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-lg font-semibold transition-all duration-200"
          >

            {loading
              ? "Adding..."
              : "Add Expense"}

          </button>

        </form>

      </motion.div>

    </div>
  );
}

export default AddExpenseModal;