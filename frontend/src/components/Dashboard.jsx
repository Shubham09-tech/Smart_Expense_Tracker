import React, { useState, useEffect } from "react";
import {
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { apiClient } from "../services/api";
import {
  AlertCircle,
  TrendingUp,
  TrendingDown,
  Calendar,
  Wallet,
  Download,
  PiggyBank,
  ArrowUpRight,
  ArrowDownRight,
  BarChart3,
  CircleDollarSign,
  Sparkles,
} from "lucide-react";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());
  const [loading, setLoading] = useState(false);
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    fetchStats();
  }, [month, year]);

  const fetchStats = async () => {
    setLoading(true);

    try {
      const data = await apiClient.get(
        `/stats?month=${month}&year=${year}`
      );
      setStats(data);
    } catch (error) {
      console.error("Error fetching stats:", error);
    } finally {
      setLoading(false);
    }
  };

  const exportPDF = async () => {
    const dashboardElement = document.getElementById(
      "dashboard-report-content"
    );

    if (!dashboardElement) return;

    setExporting(true);

    try {
      const canvas = await html2canvas(dashboardElement, {
        scale: 2,
        useCORS: true,
      });

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight =
        (canvas.height * pdfWidth) / canvas.width;

      pdf.text(
        `Financial Report - ${month}/${year}`,
        10,
        10
      );

      pdf.addImage(
        imgData,
        "PNG",
        0,
        20,
        pdfWidth,
        pdfHeight
      );

      pdf.save(
        `financial-report-${year}-${month}.pdf`
      );
    } catch (error) {
      console.error("Failed to export PDF", error);
    } finally {
      setExporting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center relative overflow-hidden">
        <div className="absolute w-72 h-72 bg-blue-500/10 rounded-full blur-3xl -top-20 -left-20" />
        <div className="absolute w-72 h-72 bg-purple-500/10 rounded-full blur-3xl -bottom-20 -right-20" />

        <div className="relative text-center">
          <div className="relative w-16 h-16 mx-auto">
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 rotate-6 animate-pulse" />

            <div className="absolute inset-1 rounded-2xl bg-white dark:bg-gray-900 flex items-center justify-center shadow-xl">
              <div className="w-6 h-6 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
            </div>
          </div>

          <p className="mt-6 text-sm font-medium text-gray-500 dark:text-gray-400">
            Loading your financial universe...
          </p>
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 mx-auto rounded-3xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white shadow-2xl shadow-blue-500/20">
            <CircleDollarSign size={36} />
          </div>

          <h2 className="mt-6 text-xl font-bold text-gray-900 dark:text-white">
            No financial data
          </h2>

          <p className="mt-2 text-gray-500 dark:text-gray-400">
            Add some transactions to see your dashboard.
          </p>
        </div>
      </div>
    );
  }

  const categoryData = Object.entries(
    stats.category_breakdown
  ).map(([name, value]) => ({
    name,
    value: parseFloat(value),
  }));

  const savingsRate =
    stats.total_income > 0
      ? ((stats.total_income - stats.total_expenses) /
          stats.total_income) *
        100
      : 0;

  const COLORS = [
    "#3b82f6",
    "#8b5cf6",
    "#10b981",
    "#f59e0b",
    "#ef4444",
    "#ec4899",
    "#06b6d4",
    "#f97316",
  ];

  const formatCurrency = (value) =>
    `₹${Number(value || 0).toFixed(2)}`;

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Background decoration */}
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-blue-500/10 blur-3xl" />

        <div className="absolute top-1/3 -right-40 w-[30rem] h-[30rem] rounded-full bg-purple-500/10 blur-3xl" />

        <div className="absolute bottom-0 left-1/3 w-80 h-80 rounded-full bg-cyan-500/10 blur-3xl" />
      </div>

      <div className="space-y-7">
        {/* HEADER */}
        <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-slate-950 via-blue-950 to-indigo-950 p-7 md:p-9 text-white shadow-2xl shadow-blue-900/20">
          {/* Decorative 3D circles */}
          <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-blue-400/10 blur-sm" />

          <div className="absolute right-20 bottom-[-60px] h-44 w-44 rounded-full bg-purple-400/10 blur-sm" />

          <div className="absolute right-10 top-10 h-24 w-24 rounded-full border border-white/10" />

          <div className="relative flex flex-col xl:flex-row xl:items-center xl:justify-between gap-7">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/10 backdrop-blur-md text-blue-200 text-xs font-bold tracking-wider">
                <Sparkles size={14} />
                FINANCIAL COMMAND CENTER
              </div>

              <h1 className="mt-4 text-4xl md:text-5xl font-black tracking-tight">
                Your Money.
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-blue-300 to-purple-300">
                  Your Control.
                </span>
              </h1>

              <p className="mt-3 max-w-xl text-blue-100/70">
                Monitor your income, expenses, savings and
                spending patterns from one powerful dashboard.
              </p>
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex items-center gap-2 px-4 py-3 rounded-2xl bg-white/10 border border-white/10 backdrop-blur-xl shadow-xl">
                <Calendar
                  size={17}
                  className="text-blue-300"
                />

                <select
                  value={month}
                  onChange={(e) =>
                    setMonth(parseInt(e.target.value))
                  }
                  className="bg-transparent outline-none text-sm font-semibold text-white cursor-pointer"
                >
                  {Array.from(
                    { length: 12 },
                    (_, i) => i + 1
                  ).map((m) => (
                    <option
                      key={m}
                      value={m}
                      className="text-gray-900"
                    >
                      {new Date(
                        2024,
                        m - 1
                      ).toLocaleString("default", {
                        month: "long",
                      })}
                    </option>
                  ))}
                </select>
              </div>

              <input
                type="number"
                value={year}
                onChange={(e) =>
                  setYear(parseInt(e.target.value))
                }
                className="w-full sm:w-24 px-4 py-3 rounded-2xl bg-white/10 border border-white/10 backdrop-blur-xl outline-none text-sm font-semibold text-white focus:ring-2 focus:ring-blue-400/50"
              />

              <button
                onClick={exportPDF}
                disabled={exporting}
                className="group flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-white text-gray-900 font-bold text-sm shadow-xl hover:-translate-y-1 hover:shadow-2xl transition-all duration-300 disabled:opacity-50"
              >
                {exporting ? (
                  <div className="w-4 h-4 border-2 border-gray-900 border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Download
                    size={17}
                    className="group-hover:translate-y-0.5 transition-transform"
                  />
                )}

                {exporting
                  ? "Generating..."
                  : "Export PDF"}
              </button>
            </div>
          </div>
        </div>

        <div
          id="dashboard-report-content"
          className="space-y-7"
        >
          {/* STAT CARDS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
            {/* Balance */}
            <div className="group relative">
              <div className="absolute inset-0 bg-blue-600 rounded-[1.5rem] blur-xl opacity-20 group-hover:opacity-40 transition-opacity" />

              <div className="relative overflow-hidden rounded-[1.5rem] p-6 text-white bg-gradient-to-br from-blue-600 via-indigo-600 to-violet-700 shadow-xl shadow-blue-500/20 transform-gpu transition-all duration-500 group-hover:-translate-y-2 group-hover:rotate-[0.5deg]">
                <div className="absolute -right-10 -top-10 w-32 h-32 rounded-full bg-white/10" />

                <div className="absolute -right-4 -bottom-14 w-40 h-40 rounded-full border-[18px] border-white/5" />

                <div className="relative">
                  <div className="flex justify-between">
                    <div>
                      <p className="text-blue-100 text-sm font-medium">
                        Current Balance
                      </p>

                      <h2 className="mt-2 text-3xl font-black tracking-tight">
                        {formatCurrency(
                          stats.current_balance
                        )}
                      </h2>
                    </div>

                    <div className="h-12 w-12 rounded-2xl bg-white/15 border border-white/10 backdrop-blur-md flex items-center justify-center shadow-lg group-hover:rotate-6 transition-transform">
                      <Wallet size={23} />
                    </div>
                  </div>

                  <div className="mt-6 flex items-center gap-2 text-xs text-blue-100">
                    <CircleDollarSign size={14} />
                    Available balance
                  </div>
                </div>
              </div>
            </div>

            {/* Income */}
            <div className="group relative">
              <div className="relative h-full rounded-[1.5rem] bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border border-gray-200/70 dark:border-gray-700/70 p-6 shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-500">
                <div className="absolute top-0 left-0 right-0 h-1 rounded-full bg-gradient-to-r from-emerald-400 to-green-500" />

                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-gray-500 dark:text-gray-400 text-sm font-semibold">
                      Total Income
                    </p>

                    <h2 className="text-2xl font-black text-gray-900 dark:text-white mt-2">
                      {formatCurrency(
                        stats.total_income
                      )}
                    </h2>
                  </div>

                  <div className="h-12 w-12 rounded-2xl bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shadow-inner group-hover:scale-110 group-hover:rotate-6 transition-all">
                    <TrendingUp size={22} />
                  </div>
                </div>

                <div className="flex items-center gap-1.5 mt-6 text-emerald-600 dark:text-emerald-400 text-xs font-bold">
                  <ArrowUpRight size={14} />
                  Income this month
                </div>
              </div>
            </div>

            {/* Expenses */}
            <div className="group relative">
              <div className="relative h-full rounded-[1.5rem] bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border border-gray-200/70 dark:border-gray-700/70 p-6 shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-500">
                <div className="absolute top-0 left-0 right-0 h-1 rounded-full bg-gradient-to-r from-red-400 to-rose-500" />

                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-gray-500 dark:text-gray-400 text-sm font-semibold">
                      Total Expenses
                    </p>

                    <h2 className="text-2xl font-black text-gray-900 dark:text-white mt-2">
                      {formatCurrency(
                        stats.total_expenses
                      )}
                    </h2>
                  </div>

                  <div className="h-12 w-12 rounded-2xl bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 flex items-center justify-center shadow-inner group-hover:scale-110 group-hover:-rotate-6 transition-all">
                    <TrendingDown size={22} />
                  </div>
                </div>

                <div className="flex items-center gap-1.5 mt-6 text-red-600 dark:text-red-400 text-xs font-bold">
                  <ArrowDownRight size={14} />
                  Expenses this month
                </div>
              </div>
            </div>

            {/* Savings */}
            <div className="group relative">
              <div className="relative h-full rounded-[1.5rem] bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border border-gray-200/70 dark:border-gray-700/70 p-6 shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-500">
                <div className="absolute top-0 left-0 right-0 h-1 rounded-full bg-gradient-to-r from-purple-400 to-violet-500" />

                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-gray-500 dark:text-gray-400 text-sm font-semibold">
                      Savings Rate
                    </p>

                    <h2 className="text-2xl font-black text-gray-900 dark:text-white mt-2">
                      {savingsRate.toFixed(1)}%
                    </h2>
                  </div>

                  <div className="h-12 w-12 rounded-2xl bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 flex items-center justify-center shadow-inner group-hover:scale-110 transition-all">
                    <PiggyBank size={22} />
                  </div>
                </div>

                <div className="mt-6">
                  <div className="flex justify-between text-xs mb-2">
                    <span className="text-gray-400">
                      Savings progress
                    </span>

                    <span className="font-bold text-purple-600 dark:text-purple-400">
                      {savingsRate.toFixed(0)}%
                    </span>
                  </div>

                  <div className="h-2.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden shadow-inner">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-purple-500 to-violet-500 transition-all duration-1000"
                      style={{
                        width: `${Math.max(
                          0,
                          Math.min(100, savingsRate)
                        )}%`,
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* CHARTS */}
          <div className="grid grid-cols-1 xl:grid-cols-5 gap-5">
            {stats.monthly_data && (
              <div className="xl:col-span-3 relative overflow-hidden rounded-[1.75rem] bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border border-gray-200/70 dark:border-gray-700/70 p-6 shadow-xl hover:shadow-2xl transition-shadow">
                <div className="absolute -right-16 -top-16 w-40 h-40 rounded-full bg-blue-500/5 blur-2xl" />

                <div className="relative flex items-center justify-between mb-6">
                  <div>
                    <div className="flex items-center gap-2">
                      <div className="p-2 rounded-xl bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
                        <TrendingUp size={18} />
                      </div>

                      <h3 className="text-lg font-black text-gray-900 dark:text-white">
                        Income vs Expenses
                      </h3>
                    </div>

                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 ml-1">
                      Monthly financial trend
                    </p>
                  </div>

                  <div className="hidden sm:block px-3 py-1.5 rounded-full bg-gray-100 dark:bg-gray-800 text-xs font-bold text-gray-500 dark:text-gray-400">
                    Monthly
                  </div>
                </div>

                <ResponsiveContainer
                  width="100%"
                  height={330}
                >
                  <LineChart data={stats.monthly_data}>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="#e5e7eb"
                      vertical={false}
                    />

                    <XAxis
                      dataKey="month"
                      stroke="#9ca3af"
                      axisLine={false}
                      tickLine={false}
                    />

                    <YAxis
                      stroke="#9ca3af"
                      axisLine={false}
                      tickLine={false}
                      tickFormatter={(value) =>
                        `₹${value}`
                      }
                    />

                    <Tooltip
                      contentStyle={{
                        borderRadius: "16px",
                        border: "1px solid #e5e7eb",
                        background:
                          "rgba(255,255,255,0.95)",
                        boxShadow:
                          "0 20px 40px rgba(0,0,0,0.12)",
                      }}
                      formatter={(value) =>
                        `₹${Number(value).toFixed(2)}`
                      }
                    />

                    <Legend
                      iconType="circle"
                      wrapperStyle={{
                        paddingTop: "15px",
                      }}
                    />

                    <Line
                      type="monotone"
                      dataKey="income"
                      name="Income"
                      stroke="#10b981"
                      strokeWidth={4}
                      dot={{
                        r: 4,
                        strokeWidth: 2,
                      }}
                      activeDot={{
                        r: 7,
                      }}
                    />

                    <Line
                      type="monotone"
                      dataKey="expense"
                      name="Expense"
                      stroke="#ef4444"
                      strokeWidth={4}
                      dot={{
                        r: 4,
                        strokeWidth: 2,
                      }}
                      activeDot={{
                        r: 7,
                      }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            )}

            {/* PIE CHART */}
            <div className="xl:col-span-2 relative overflow-hidden rounded-[1.75rem] bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border border-gray-200/70 dark:border-gray-700/70 p-6 shadow-xl hover:shadow-2xl transition-shadow">
              <div className="absolute -left-16 -bottom-16 w-40 h-40 rounded-full bg-purple-500/5 blur-2xl" />

              <div className="relative flex items-center justify-between mb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-xl bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400">
                      <BarChart3 size={18} />
                    </div>

                    <h3 className="text-lg font-black text-gray-900 dark:text-white">
                      Expense Breakdown
                    </h3>
                  </div>

                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 ml-1">
                    Spending by category
                  </p>
                </div>
              </div>

              {categoryData.length > 0 ? (
                <ResponsiveContainer
                  width="100%"
                  height={330}
                >
                  <PieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      innerRadius={70}
                      outerRadius={110}
                      paddingAngle={5}
                      dataKey="value"
                      label={({ name, percent }) =>
                        `${name} ${(percent * 100).toFixed(
                          0
                        )}%`
                      }
                      labelLine={false}
                    >
                      {categoryData.map(
                        (entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={
                              COLORS[
                                index % COLORS.length
                              ]
                            }
                            stroke="transparent"
                          />
                        )
                      )}
                    </Pie>

                    <Tooltip
                      contentStyle={{
                        borderRadius: "16px",
                        border: "none",
                        boxShadow:
                          "0 20px 40px rgba(0,0,0,0.15)",
                      }}
                      formatter={(value) =>
                        `₹${Number(value).toFixed(2)}`
                      }
                    />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-[330px] flex items-center justify-center text-gray-400">
                  No expense data available.
                </div>
              )}
            </div>
          </div>

          {/* BUDGET ALERTS */}
          {stats.budget_alerts &&
            stats.budget_alerts.length > 0 && (
              <div className="relative overflow-hidden rounded-[1.75rem] bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border border-red-200/70 dark:border-red-900/40 p-6 shadow-xl">
                <div className="absolute right-0 top-0 w-64 h-64 bg-red-500/5 rounded-full blur-3xl" />

                <div className="relative flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="p-3 rounded-2xl bg-gradient-to-br from-red-500 to-rose-600 text-white shadow-lg shadow-red-500/20">
                      <AlertCircle size={21} />
                    </div>

                    <div>
                      <h3 className="text-lg font-black text-gray-900 dark:text-white">
                        Budget Alerts
                      </h3>

                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Categories that exceeded their budget
                      </p>
                    </div>
                  </div>

                  <span className="hidden sm:block px-4 py-2 rounded-full bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 text-xs font-black">
                    {stats.budget_alerts.length} Alert
                    {stats.budget_alerts.length !== 1
                      ? "s"
                      : ""}
                  </span>
                </div>

                <div className="relative grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {stats.budget_alerts.map(
                    (alert, idx) => (
                      <div
                        key={idx}
                        className="group rounded-2xl border border-gray-200 dark:border-gray-700 bg-white/70 dark:bg-gray-800/70 p-5 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                      >
                        <div className="flex justify-between items-start mb-4">
                          <p className="font-black text-gray-900 dark:text-white">
                            {alert.category}
                          </p>

                          <span className="px-2.5 py-1 bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-400 text-xs font-black rounded-full">
                            Over Budget
                          </span>
                        </div>

                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-500">
                              Budget limit
                            </span>

                            <span className="font-bold text-gray-800 dark:text-gray-200">
                              {formatCurrency(
                                alert.limit
                              )}
                            </span>
                          </div>

                          <div className="flex justify-between text-sm">
                            <span className="text-gray-500">
                              Total spent
                            </span>

                            <span className="font-bold text-red-600 dark:text-red-400">
                              {formatCurrency(
                                alert.spent
                              )}
                            </span>
                          </div>

                          <div className="h-2.5 bg-gray-100 dark:bg-gray-700 rounded-full mt-4 overflow-hidden shadow-inner">
                            <div
                              className="h-full bg-gradient-to-r from-red-500 to-rose-500 rounded-full"
                              style={{
                                width: "100%",
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    )
                  )}
                </div>
              </div>
            )}
        </div>
      </div>
    </div>
  );
}