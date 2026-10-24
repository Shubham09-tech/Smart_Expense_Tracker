import React, { useState, useEffect } from "react";
import { apiClient } from "../services/api";
import {
  X,
  Plus,
  CalendarDays,
  Tag,
  Wallet,
  FileText,
} from "lucide-react";
import { toast } from "react-toastify";

export default function ExpenseForm({
  isOpen,
  onClose,
  onSave,
  editingExpense,
  categories,
}) {
  const [type, setType] = useState("expense");
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [tags, setTags] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (editingExpense) {
      setType(editingExpense.type || "expense");
      setDescription(editingExpense.description);
      setAmount(editingExpense.amount);
      setCategoryId(editingExpense.category_id);
      setTags(editingExpense.tags || "");
      setDate(editingExpense.date.split("T")[0]);
    } else {
      setType("expense");
      setDescription("");
      setAmount("");
      setCategoryId(categories[0]?.id || "");
      setTags("");
      setDate(new Date().toISOString().split("T")[0]);
    }
  }, [editingExpense, isOpen, categories]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!description || !amount || !categoryId) {
      toast.error("❌ Please fill all required fields");
      return;
    }

    setLoading(true);

    try {
      const data = {
        type,
        description,
        amount: parseFloat(amount),
        category_id: parseInt(categoryId),
        tags,
        date: new Date(date).toISOString(),
      };

      if (editingExpense) {
        await apiClient.put(`/expenses/${editingExpense.id}`, data);
        toast.success("✅ Expense updated!");
      } else {
        await apiClient.post("/expenses", data);
        toast.success("✅ Expense added!");
      }

      onSave();
      onClose();
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const isIncome = type === "income";

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
      <div className="w-full max-w-lg max-h-[92vh] overflow-y-auto bg-white dark:bg-gray-900 rounded-3xl shadow-2xl border border-gray-100 dark:border-gray-800 animate-slideUp">

        {/* Header */}
        <div className="px-7 pt-7 pb-5 border-b border-gray-100 dark:border-gray-800">
          <div className="flex items-start justify-between">
            <div>
              <div
                className={`inline-flex items-center justify-center w-11 h-11 rounded-xl mb-4 ${
                  isIncome
                    ? "bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400"
                    : "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
                }`}
              >
                <Wallet size={22} />
              </div>

              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                {editingExpense
                  ? `Edit ${isIncome ? "Income" : "Expense"}`
                  : `Add ${isIncome ? "Income" : "Expense"}`}
              </h2>

              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                {editingExpense
                  ? "Update the details of this transaction."
                  : "Enter the details of your transaction."}
              </p>
            </div>

            <button
              onClick={onClose}
              className="p-2.5 rounded-xl text-gray-400 hover:text-gray-700 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition-all"
            >
              <X size={22} />
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-7 space-y-6">

          {/* Transaction Type */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Transaction Type
            </label>

            <div className="grid grid-cols-2 gap-2 p-1.5 bg-gray-100 dark:bg-gray-800 rounded-xl">
              <button
                type="button"
                onClick={() => setType("expense")}
                className={`py-2.5 rounded-lg font-semibold text-sm transition-all ${
                  type === "expense"
                    ? "bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm"
                    : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                }`}
              >
                Expense
              </button>

              <button
                type="button"
                onClick={() => setType("income")}
                className={`py-2.5 rounded-lg font-semibold text-sm transition-all ${
                  type === "income"
                    ? "bg-white dark:bg-gray-700 text-green-600 dark:text-green-400 shadow-sm"
                    : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                }`}
              >
                Income
              </button>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              <FileText size={15} />
              Description *
            </label>

            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              autoFocus
              placeholder={
                isIncome
                  ? "e.g. Monthly salary"
                  : "e.g. Grocery shopping"
              }
              className="w-full px-4 py-3.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
            />
          </div>

          {/* Amount + Date */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

            {/* Amount */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Amount *
              </label>

              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400 font-medium">
                  ₹
                </span>

                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  required
                  step="1"
                  min="0"
                  placeholder="0"
                  className="w-full pl-9 pr-4 py-3.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                />
              </div>
            </div>

            {/* Date */}
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                <CalendarDays size={15} />
                Date *
              </label>

              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
                className="w-full px-4 py-3.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
              />
            </div>
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Category *
            </label>

            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              required
              className="w-full px-4 py-3.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
            >
              <option value="">Select a category</option>

              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          {/* Tags */}
          <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              <Tag size={15} />
              Tags
            </label>

            <input
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder={
                isIncome
                  ? "salary, freelance, bonus"
                  : "food, shopping, travel"
              }
              className="w-full px-4 py-3.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
            />

            <p className="mt-1.5 text-xs text-gray-400">
              Separate multiple tags with commas.
            </p>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">

            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-5 py-3.5 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-xl font-semibold hover:bg-gray-50 dark:hover:bg-gray-800 transition-all"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className={`flex-1 px-5 py-3.5 text-white rounded-xl font-semibold transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 ${
                isIncome
                  ? "bg-green-600 hover:bg-green-700"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Plus size={18} />
                  {editingExpense ? "Update" : "Save"}
                </>
              )}
            </button>

          </div>
        </form>
      </div>
    </div>
  );
}