import { motion } from "framer-motion";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

import { categories } from "../utils/categories";

const COLORS = [
  "#3b82f6",
  "#22c55e",
  "#f59e0b",
  "#ef4444",
  "#8b5cf6",
  "#06b6d4",
  "#f97316",
  "#14b8a6",
];

function Analytics({ expenses }) {

  const categoryTotals = {};

  expenses.forEach((expense) => {

    if (categoryTotals[expense.category]) {

      categoryTotals[expense.category] +=
        expense.amount;

    } else {

      categoryTotals[expense.category] =
        expense.amount;
    }
  });

  const chartData =
    Object.entries(categoryTotals).map(
      ([category, amount]) => {

        const categoryData =
          categories.find(
            (cat) =>
              cat.name === category
          );

        return {
          name: `${categoryData?.icon} ${category}`,
          value: amount,
        };
      }
    );

  const highestCategory =
    chartData.length > 0
      ? chartData.reduce((prev, curr) =>
          prev.value > curr.value
            ? prev
            : curr
        )
      : null;

  const averageDaily =
    expenses.length > 0
      ? (
          expenses.reduce(
            (acc, curr) =>
              acc + curr.amount,
            0
          ) / 30
        ).toFixed(0)
      : 0;

  return (
    <motion.div
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  transition={{ duration: 0.4 }}
  className="space-y-6 mb-8"
>

      <div className="grid grid-cols-2 gap-3">

        <div className="bg-slate-800 rounded-2xl p-4">

          <p className="text-slate-400 text-sm">
            Top Category
          </p>

          <h2 className="text-white text-2xl font-bold mt-2">

            {highestCategory
              ? highestCategory.name
              : "No Data"}

          </h2>

        </div>

        <div className="bg-slate-800 rounded-2xl p-4">

          <p className="text-slate-400 text-sm">
            Daily Average
          </p>

          <h2 className="text-white text-2xl font-bold mt-2">
            ₹{averageDaily}
          </h2>

        </div>

      </div>

      <div className="bg-slate-800 rounded-2xl p-4">

        <h2 className="text-white text-xl font-bold mb-6">
          Spending Analytics
        </h2>

        {chartData.length > 0 ? (

          <div className="h-64 sm:h-80">

            <ResponsiveContainer
              width="100%"
              height="100%"
            >

              <PieChart>

                <Pie
                  data={chartData}
                  dataKey="value"
                  outerRadius={110}
                  label
                >

                  {chartData.map(
                    (entry, index) => (

                      <Cell
                        key={index}
                        fill={
                          COLORS[
                            index %
                              COLORS.length
                          ]
                        }
                      />

                    )
                  )}

                </Pie>

                <Tooltip />
<Legend />
              </PieChart>

            </ResponsiveContainer>

          </div>

        ) : (

          <div className="text-slate-400 text-center py-16">
            No analytics available
          </div>

        )}

      </div>

   </motion.div>
  );
}

export default Analytics;