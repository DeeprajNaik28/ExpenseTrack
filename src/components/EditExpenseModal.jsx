import { useState } from "react";

import {
  doc,
  updateDoc,
} from "firebase/firestore";

import toast from "react-hot-toast";

import { db } from "../firebase/firebase";

import { categories } from "../utils/categories";

function EditExpenseModal({
  expense,
  closeModal,
}) {

  const [amount, setAmount] = useState(
    expense.amount
  );

  const [category, setCategory] = useState(
    expense.category
  );

  const [note, setNote] = useState(
    expense.note
  );

  const [date, setDate] = useState(
    expense.date
  );

  const [loading, setLoading] = useState(false);

  const handleUpdate = async (e) => {

    e.preventDefault();

    try {

      setLoading(true);

      await updateDoc(
        doc(db, "expenses", expense.id),
        {
          amount: Number(amount),
          category,
          note,
          date,
        }
      );

      toast.success("Expense updated ✅");

      closeModal();

    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-end justify-center z-50">

      <div className="bg-slate-800 w-full max-w-lg rounded-t-3xl p-6">

        <h2 className="text-2xl text-white font-bold mb-6">
          Edit Expense
        </h2>

        <form
          onSubmit={handleUpdate}
          className="space-y-4"
        >

          <input
            type="number"
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
            className="w-full p-3 rounded-lg bg-slate-700 text-white outline-none"
            value={note}
            onChange={(e) =>
              setNote(e.target.value)
            }
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 p-3 rounded-lg text-white font-semibold"
          >
            {loading
              ? "Updating..."
              : "Update Expense"}
          </button>

        </form>

      </div>

    </div>
  );
}

export default EditExpenseModal;