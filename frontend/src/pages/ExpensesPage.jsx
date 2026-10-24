import React, { useState, useEffect } from "react";
import {
  Plus,
  Download,
  WalletCards,
  FolderPlus,
  PiggyBank,
  FileDown,
  Sparkles,
} from "lucide-react";
import { toast } from "react-toastify";
import CategoryModal from "../components/CategoryModal";
import ExpenseForm from "../components/ExpenseForm";
import ExpenseList from "../components/ExpenseList";
import BudgetModal from "../components/BudgetModal";
import { apiClient } from "../services/api";

export default function ExpensesPage() {
  const [expenses, setExpenses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingExpense, setEditingExpense] = useState(null);
  const [isExpenseFormOpen, setIsExpenseFormOpen] = useState(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [isBudgetModalOpen, setIsBudgetModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);

    try {
      const [expensesData, categoriesData] = await Promise.all([
        apiClient.get("/expenses?limit=500"),
        apiClient.get("/categories"),
      ]);

      setExpenses(expensesData);
      setCategories(categoriesData);
    } catch (error) {
      toast.error("Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  const handleExportCSV = async () => {
    try {
      await apiClient.downloadCSV();
      toast.success("Expenses exported!");
    } catch (error) {
      toast.error("Export failed");
    }
  };

  if (loading) {
    return (
      <div className="min-h-[65vh] flex items-center justify-center">
        <div className="text-center">
          <div className="relative w-16 h-16 mx-auto mb-5">
            <div className="absolute inset-0 rounded-2xl bg-blue-500/20 animate-ping" />
            <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 shadow-xl flex items-center justify-center">
              <WalletCards
                size={28}
                className="text-white animate-pulse"
              />
            </div>
          </div>

          <h3 className="text-lg font-bold text-gray-800 dark:text-white">
            Loading your expenses
          </h3>

          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Preparing your financial data...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen space-y-7 pb-10">

      {/* Decorative background elements */}
      <div className="fixed pointer-events-none -z-10 top-20 right-10 w-72 h-72 bg-blue-500/10 dark:bg-blue-500/5 rounded-full blur-3xl" />
      <div className="fixed pointer-events-none -z-10 bottom-10 left-10 w-80 h-80 bg-purple-500/10 dark:bg-purple-500/5 rounded-full blur-3xl" />

      {/* ================= HEADER ================= */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-950 p-7 md:p-8 shadow-2xl">

        {/* 3D decorative circles */}
        <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-blue-500/20 blur-sm" />
        <div className="absolute -bottom-28 right-32 w-72 h-72 rounded-full bg-indigo-500/10 blur-md" />
        <div className="absolute top-8 right-10 w-20 h-20 rounded-full border border-white/10" />
        <div className="absolute top-12 right-14 w-12 h-12 rounded-full bg-white/5 backdrop-blur-sm" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">

          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/10 backdrop-blur-md text-blue-200 text-xs font-bold tracking-wide mb-4">
              <Sparkles size={14} />
              FINANCIAL MANAGEMENT
            </div>

            <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight">
              Expenses
            </h1>

            <p className="text-blue-100/70 mt-2 max-w-xl">
              Manage your spending, categories and budgets from one place.
            </p>
          </div>

          {/* Floating stats */}
          <div className="flex items-center gap-3">

            <div className="px-5 py-4 rounded-2xl bg-white/10 border border-white/10 backdrop-blur-md shadow-xl">
              <p className="text-xs text-blue-200">
                Transactions
              </p>
              <p className="text-2xl font-black text-white">
                {expenses.length}
              </p>
            </div>

            <div className="px-5 py-4 rounded-2xl bg-white/10 border border-white/10 backdrop-blur-md shadow-xl">
              <p className="text-xs text-blue-200">
                Categories
              </p>
              <p className="text-2xl font-black text-white">
                {categories.length}
              </p>
            </div>

          </div>
        </div>
      </div>

      {/* ================= ACTION CENTER ================= */}
      <div className="relative">

        <div className="flex items-center gap-2 mb-4">
          <div className="w-1.5 h-6 rounded-full bg-gradient-to-b from-blue-500 to-indigo-600" />

          <div>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">
              Quick Actions
            </h2>

            <p className="text-xs text-gray-500 dark:text-gray-400">
              Manage your financial records
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

          {/* Add Expense */}
          <button
            onClick={() => {
              setEditingExpense(null);
              setIsExpenseFormOpen(true);
            }}
            className="group relative overflow-hidden rounded-2xl p-5 text-left
            bg-gradient-to-br from-blue-600 to-indigo-700
            text-white shadow-lg shadow-blue-500/20
            transition-all duration-300
            hover:-translate-y-2 hover:shadow-2xl hover:shadow-blue-500/30
            active:translate-y-0"
          >
            <div className="absolute -right-8 -top-8 w-28 h-28 rounded-full bg-white/10 group-hover:scale-125 transition-transform duration-500" />

            <div className="relative z-10">
              <div className="w-11 h-11 rounded-xl bg-white/15 backdrop-blur-md flex items-center justify-center mb-4 shadow-inner">
                <Plus size={23} />
              </div>

              <h3 className="font-bold text-lg">
                Add Expense
              </h3>

              <p className="text-blue-100 text-xs mt-1">
                Record a new transaction
              </p>
            </div>
          </button>

          {/* Category */}
          <button
            onClick={() => setIsCategoryModalOpen(true)}
            className="group relative overflow-hidden rounded-2xl p-5 text-left
            bg-white dark:bg-gray-800
            border border-gray-200 dark:border-gray-700
            shadow-md
            transition-all duration-300
            hover:-translate-y-2 hover:shadow-2xl
            hover:border-emerald-300 dark:hover:border-emerald-700"
          >
            <div className="absolute -right-10 -top-10 w-28 h-28 rounded-full bg-emerald-500/10 group-hover:scale-125 transition-transform duration-500" />

            <div className="relative z-10">
              <div className="w-11 h-11 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-4 shadow-sm">
                <FolderPlus size={22} />
              </div>

              <h3 className="font-bold text-lg text-gray-900 dark:text-white">
                New Category
              </h3>

              <p className="text-gray-500 dark:text-gray-400 text-xs mt-1">
                Organize your expenses
              </p>
            </div>
          </button>

          {/* Budget */}
          <button
            onClick={() => setIsBudgetModalOpen(true)}
            className="group relative overflow-hidden rounded-2xl p-5 text-left
            bg-white dark:bg-gray-800
            border border-gray-200 dark:border-gray-700
            shadow-md
            transition-all duration-300
            hover:-translate-y-2 hover:shadow-2xl
            hover:border-purple-300 dark:hover:border-purple-700"
          >
            <div className="absolute -right-10 -top-10 w-28 h-28 rounded-full bg-purple-500/10 group-hover:scale-125 transition-transform duration-500" />

            <div className="relative z-10">
              <div className="w-11 h-11 rounded-xl bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 flex items-center justify-center mb-4">
                <PiggyBank size={22} />
              </div>

              <h3 className="font-bold text-lg text-gray-900 dark:text-white">
                Set Budget
              </h3>

              <p className="text-gray-500 dark:text-gray-400 text-xs mt-1">
                Control your monthly spending
              </p>
            </div>
          </button>

          {/* Export */}
          <button
            onClick={handleExportCSV}
            className="group relative overflow-hidden rounded-2xl p-5 text-left
            bg-white dark:bg-gray-800
            border border-gray-200 dark:border-gray-700
            shadow-md
            transition-all duration-300
            hover:-translate-y-2 hover:shadow-2xl
            hover:border-orange-300 dark:hover:border-orange-700"
          >
            <div className="absolute -right-10 -top-10 w-28 h-28 rounded-full bg-orange-500/10 group-hover:scale-125 transition-transform duration-500" />

            <div className="relative z-10">
              <div className="w-11 h-11 rounded-xl bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 flex items-center justify-center mb-4">
                <FileDown size={22} />
              </div>

              <h3 className="font-bold text-lg text-gray-900 dark:text-white">
                Export CSV
              </h3>

              <p className="text-gray-500 dark:text-gray-400 text-xs mt-1">
                Download your transaction data
              </p>
            </div>
          </button>
        </div>
      </div>

      {/* ================= EXPENSE LIST CARD ================= */}
      <div className="relative">

        <div className="absolute -inset-1 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-indigo-500/10 rounded-3xl blur-xl" />

        <div className="relative bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl
          border border-gray-200/80 dark:border-gray-700
          rounded-3xl shadow-xl overflow-hidden">

          {/* List Header */}
          <div className="px-6 py-5 border-b border-gray-100 dark:border-gray-700
            bg-gradient-to-r from-gray-50/80 to-white/50
            dark:from-gray-800 dark:to-gray-800/70">

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center shadow-lg shadow-blue-500/20">
                  <WalletCards size={20} />
                </div>

                <div>
                  <h2 className="font-bold text-gray-900 dark:text-white">
                    Transaction History
                  </h2>

                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    View and manage your financial activity
                  </p>
                </div>
              </div>

              <div className="px-3 py-1.5 rounded-full bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 text-xs font-bold">
                {expenses.length} Records
              </div>

            </div>
          </div>

          {/* Existing ExpenseList functionality */}
          <div className="p-4 md:p-6">
            <ExpenseList
              expenses={expenses}
              categories={categories}
              onEdit={(expense) => {
                setEditingExpense(expense);
                setIsExpenseFormOpen(true);
              }}
              onRefresh={fetchData}
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
            />
          </div>
        </div>
      </div>

      {/* ================= MODALS ================= */}

      <ExpenseForm
        isOpen={isExpenseFormOpen}
        onClose={() => {
          setIsExpenseFormOpen(false);
          setEditingExpense(null);
        }}
        onSave={fetchData}
        editingExpense={editingExpense}
        categories={categories}
      />

      <CategoryModal
        isOpen={isCategoryModalOpen}
        onClose={() => setIsCategoryModalOpen(false)}
        onSave={fetchData}
        editingCategory={null}
      />

      <BudgetModal
        isOpen={isBudgetModalOpen}
        onClose={() => setIsBudgetModalOpen(false)}
        onSave={fetchData}
        categories={categories}
        month={new Date().getMonth() + 1}
        year={new Date().getFullYear()}
      />
    </div>
  );
}