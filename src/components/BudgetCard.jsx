import { useEffect, useState } from "react";

import {
  doc,
  getDoc,
  setDoc,
} from "firebase/firestore";

import toast from "react-hot-toast";

import { db } from "../firebase/firebase";

import { useAuth } from "../context/AuthContext";

function BudgetCard({ totalSpent }) {

  const { user } = useAuth();

  const [budget, setBudget] =
    useState("");

  const [inputBudget, setInputBudget] =
    useState("");

  useEffect(() => {

    fetchBudget();

  }, []);

  const fetchBudget = async () => {

    try {

      const docRef =
        doc(db, "users", user.uid);

      const docSnap =
        await getDoc(docRef);

      if (docSnap.exists()) {

        const data = docSnap.data();

        if (data.budget) {

          setBudget(data.budget);

          setInputBudget(data.budget);
        }
      }

    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleSaveBudget = async () => {

    try {

      await setDoc(
        doc(db, "users", user.uid),
        {
          budget: Number(inputBudget),
        },
        { merge: true }
      );

      setBudget(Number(inputBudget));

      toast.success(
        "Budget updated ✅"
      );

    } catch (error) {
      toast.error(error.message);
    }
  };

  const remaining =
    budget - totalSpent;

  const percentage =
    budget > 0
      ? Math.min(
          (totalSpent / budget) * 100,
          100
        )
      : 0;

  return (
    <div className="bg-slate-800 rounded-2xl p-4 h-full">

      <div className="flex items-start justify-between gap-3 mb-4">

        <div className="min-w-0">

          <p className="text-slate-400 text-xs sm:text-sm">
            Monthly Budget
          </p>

          <h2 className="text-white text-xl sm:text-3xl font-bold mt-1 break-all">

            ₹{budget || 0}

          </h2>

        </div>

        <div className="text-right min-w-0">

          <p className="text-slate-400 text-xs sm:text-sm">
            Remaining
          </p>

          <h2
            className={`text-lg sm:text-2xl font-bold mt-1 break-all ${
              remaining < 0
                ? "text-red-400"
                : "text-green-400"
            }`}
          >

            ₹{remaining}

          </h2>

        </div>

      </div>

      <div className="w-full h-3 bg-slate-700 rounded-full overflow-hidden">

        <div
          className={`h-full transition-all duration-300 ${
            percentage > 90
              ? "bg-red-500"
              : percentage > 70
              ? "bg-yellow-500"
              : "bg-green-500"
          }`}
          style={{
            width: `${percentage}%`,
          }}
        ></div>

      </div>

      <p className="text-slate-400 text-xs sm:text-sm mt-2">
        {percentage.toFixed(0)}%
        of budget used
      </p>

      <div className="flex flex-col gap-3 mt-5">

        <input
          type="number"
          placeholder="Set Budget"
          className="w-full p-3 rounded-xl bg-slate-700 text-white outline-none"
          value={inputBudget}
          onChange={(e) =>
            setInputBudget(e.target.value)
          }
        />

        <button
          onClick={handleSaveBudget}
          className="bg-blue-600 w-full py-3 rounded-xl text-white font-semibold active:scale-95 transition"
        >
          Save Budget
        </button>

      </div>

    </div>
  );
}

export default BudgetCard;