import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
collection,
onSnapshot,
query,
where,
} from "firebase/firestore";

import { signOut } from "firebase/auth";

import toast from "react-hot-toast";

import {
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import Calendar from "react-calendar";

import "react-calendar/dist/Calendar.css";

import { db, auth } from "../firebase/firebase";

import { useAuth } from "../context/AuthContext";

import AddExpenseModal from "../components/AddExpenseModal";
import ExpenseCard from "../components/ExpenseCard";
import Analytics from "../components/Analytics";
import BudgetCard from "../components/BudgetCard";
import SearchFilter from "../components/SearchFilter";

function Dashboard() {

  const { user } = useAuth();

  const [expenses, setExpenses] =
    useState([]);

  const [showModal, setShowModal] =
    useState(false);

  const [selectedMonth, setSelectedMonth] =
    useState(new Date());

  const [selectedDate, setSelectedDate] =
    useState(null);

  const [search, setSearch] =
    useState("");

  const [selectedCategory, setSelectedCategory] =
    useState("All");

  useEffect(() => {

const q = query(
  collection(db, "expenses"),
  where("userId", "==", user.uid)
);

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {

        const allExpenses =
          snapshot.docs
            .map((doc) => ({
              id: doc.id,
              ...doc.data(),
            }))
            .filter(
              (expense) =>
                expense.userId === user.uid
            );

        setExpenses(allExpenses);
      }
    );

    return () => unsubscribe();

  }, []);

  const monthExpenses = useMemo(() => {

    return expenses.filter((expense) => {

      const expenseDate =
        new Date(expense.date);

      return (
        expenseDate.getMonth() ===
          selectedMonth.getMonth() &&

        expenseDate.getFullYear() ===
          selectedMonth.getFullYear()
      );
    });

  }, [expenses, selectedMonth]);

  const filteredExpenses = useMemo(() => {

    let filtered = [...monthExpenses];

    if (selectedDate) {

      filtered = filtered.filter(
        (expense) => {

          const expenseDate =
            new Date(expense.date);

          return (
            expenseDate.toDateString() ===
            selectedDate.toDateString()
          );
        }
      );
    }

    if (selectedCategory !== "All") {

      filtered = filtered.filter(
        (expense) =>
          expense.category ===
          selectedCategory
      );
    }

    if (search.trim()) {

      filtered = filtered.filter(
        (expense) =>
          expense.note
            ?.toLowerCase()
            .includes(
              search.toLowerCase()
            )
      );
    }

    return filtered;

  }, [
    monthExpenses,
    selectedDate,
    selectedCategory,
    search,
  ]);

  const groupedExpenses = useMemo(() => {

    return filteredExpenses.reduce(
      (groups, expense) => {

        const date = expense.date;

        if (!groups[date]) {
          groups[date] = [];
        }

        groups[date].push(expense);

        return groups;
      },
      {}
    );

  }, [filteredExpenses]);

  const totalSpent =
    filteredExpenses.reduce(
      (acc, curr) =>
        acc + curr.amount,
      0
    );

  const handlePrevMonth = () => {

    setSelectedMonth((prev) =>
      new Date(
        prev.getFullYear(),
        prev.getMonth() - 1,
        1
      )
    );

    setSelectedDate(null);
  };

  const handleNextMonth = () => {

    setSelectedMonth((prev) =>
      new Date(
        prev.getFullYear(),
        prev.getMonth() + 1,
        1
      )
    );

    setSelectedDate(null);
  };

  const handleLogout = async () => {

    await signOut(auth);

    toast.success("Logged out 👋");
  };

  const getDayExpenseCount = (date) => {

    return monthExpenses.filter(
      (expense) => {

        const expenseDate =
          new Date(expense.date);

        return (
          expenseDate.toDateString() ===
          date.toDateString()
        );
      }
    ).length;
  };

  return (
    <div className="min-h-screen bg-slate-900 pb-28 px-3 sm:px-4">

      <div className="max-w-3xl mx-auto py-4">

        <div className="flex items-start justify-between gap-4 mb-6">

          <div className="flex-1">

            <h1 className="text-2xl sm:text-3xl font-bold text-white">
              ExpenseTrack 💸
            </h1>

            <div className="mt-3 bg-slate-800 rounded-2xl p-4">

              <p className="text-slate-400 text-sm">
                {selectedDate
                  ? "Daily Spent"
                  : "Total Spent"}
              </p>

              <h2 className="text-3xl sm:text-4xl font-bold text-white mt-1 break-all">
                ₹{totalSpent}
              </h2>

            </div>

          </div>

          <button
            onClick={handleLogout}
            className="bg-red-600 px-4 py-2 rounded-xl text-white text-sm shrink-0"
          >
            Logout
          </button>

        </div>

        <div className="flex items-center justify-between mb-6 bg-slate-800 p-4 rounded-2xl">

          <button
            onClick={handlePrevMonth}
            className="text-white"
          >
            <ChevronLeft />
          </button>

          <h2 className="text-white text-lg sm:text-xl font-bold text-center">

            {selectedMonth.toLocaleString(
              "en-IN",
              {
                month: "long",
                year: "numeric",
              }
            )}

          </h2>

          <button
            onClick={handleNextMonth}
            className="text-white"
          >
            <ChevronRight />
          </button>

        </div>

        <div className="grid grid-cols-2 gap-3 mb-6 items-start">

          <div className="col-span-1">
            <BudgetCard totalSpent={totalSpent} />
          </div>

          <div className="col-span-1 bg-slate-800 p-3 rounded-2xl overflow-hidden">

            <Calendar
              onChange={(value) =>
                setSelectedDate(value)
              }
              value={selectedDate}
              className="custom-calendar"
              tileContent={({ date, view }) => {

                if (view === "month") {

                  const count =
                    getDayExpenseCount(date);

                  return count > 0 ? (
                    <div className="flex justify-center mt-1">

                      <div className="w-1.5 h-1.5 rounded-full bg-green-400"></div>

                    </div>
                  ) : null;
                }
              }}
            />

            {selectedDate && (

              <button
                onClick={() =>
                  setSelectedDate(null)
                }
                className="mt-3 text-sm text-blue-400"
              >
                Clear Date Filter
              </button>

            )}

          </div>

        </div>

        <Analytics expenses={monthExpenses} />

        <SearchFilter
          search={search}
          setSearch={setSearch}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
        />

        <div className="space-y-5">

          {Object.keys(groupedExpenses)
            .sort((a, b) =>
              new Date(b) - new Date(a)
            )
            .map((date) => (

              <div key={date}>

                <h2 className="text-slate-300 font-semibold mb-3 sticky top-0 bg-slate-900 py-1 z-10">

                  {new Date(date)
                    .toLocaleDateString(
                      "en-IN",
                      {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      }
                    )}

                </h2>

                <div className="space-y-3">

                  {groupedExpenses[
                    date
                  ].map((expense) => (

                    <ExpenseCard
                      key={expense.id}
                      expense={expense}
                    />

                  ))}

                </div>

              </div>

            ))}

          {filteredExpenses.length === 0 && (

            <div className="text-center mt-20">

              <h2 className="text-2xl text-white font-bold">
                No expenses found 💸
              </h2>

              <p className="text-slate-400 mt-2">
                Try changing filters
              </p>

            </div>

          )}

        </div>

        <button
          onClick={() =>
            setShowModal(true)
          }
          className="fixed bottom-5 right-5 bg-blue-600 w-14 h-14 sm:w-16 sm:h-16 rounded-full text-3xl sm:text-4xl text-white shadow-2xl flex items-center justify-center active:scale-90 hover:scale-105 transition-all duration-200"
        >
          +
        </button>

        {showModal && (

          <AddExpenseModal
            closeModal={() =>
              setShowModal(false)
            }
          />

        )}

      </div>

    </div>
  );
}

export default Dashboard;