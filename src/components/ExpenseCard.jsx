import { useState } from "react";
import { motion } from "framer-motion";
import {
  deleteDoc,
  doc,
} from "firebase/firestore";

import toast from "react-hot-toast";

import { db } from "../firebase/firebase";

import { categories } from "../utils/categories";

import EditExpenseModal from "./EditExpenseModal";

function ExpenseCard({ expense }) {

  const [showEdit, setShowEdit] =
    useState(false);

  const categoryData = categories.find(
    (cat) => cat.name === expense.category
  );

  const formattedDate =
    new Date(expense.date).toLocaleDateString(
      "en-IN",
      {
        day: "numeric",
        month: "short",
        year: "numeric",
      }
    );

  const handleDelete = async () => {

    try {

      await deleteDoc(
        doc(db, "expenses", expense.id)
      );

      toast.success("Expense deleted");

    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <>
      <motion.div
  initial={{
    opacity: 0,
    y: 20,
  }}
  animate={{
    opacity: 1,
    y: 0,
  }}
  transition={{
    duration: 0.3,
  }}
  className="bg-slate-800 p-5 rounded-2xl flex justify-between items-center shadow-lg">

        <div>

          <h2 className="text-white text-lg font-semibold">
            {categoryData?.icon}{" "}
            {expense.category}
          </h2>

          <p className="text-slate-400 text-sm mt-1">
            {expense.note || "No note"}
          </p>

          <p className="text-slate-500 text-xs mt-2">
            {formattedDate}
          </p>

        </div>

        <div className="text-right">

          <h2 className="text-white text-2xl font-bold">
            ₹{expense.amount}
          </h2>

          <div className="flex gap-3 mt-3 justify-end">

            <button
              onClick={() =>
                setShowEdit(true)
              }
              className="text-blue-400 text-sm"
            >
              Edit
            </button>

            <button
              onClick={handleDelete}
              className="text-red-400 text-sm"
            >
              Delete
            </button>

          </div>

        </div>

      </motion.div>

      {showEdit && (
        <EditExpenseModal
          expense={expense}
          closeModal={() =>
            setShowEdit(false)
          }
        />
      )}
    </>
  );
}

export default ExpenseCard;