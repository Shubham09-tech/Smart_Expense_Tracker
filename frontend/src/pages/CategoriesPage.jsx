import React, { useEffect, useState } from "react";
import {
  FolderOpen,
  Trash2,
  Sparkles,
  Palette,
  Layers3,
  Tag,
  AlertCircle,
} from "lucide-react";
import { toast } from "react-toastify";
import { apiClient } from "../services/api";

export default function CategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setLoading(true);

    try {
      const data = await apiClient.get("/categories");
      setCategories(data);
    } catch (error) {
      toast.error("Failed to fetch categories");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (
      !window.confirm(
        "Delete this category? Associated expenses will remain."
      )
    ) {
      return;
    }

    setDeletingId(id);

    try {
      await apiClient.delete(`/categories/${id}`);
      toast.success("Category deleted!");
      fetchCategories();
    } catch (error) {
      toast.error(error.message || "Failed to delete category");
    } finally {
      setDeletingId(null);
    }
  };

  /* ================= LOADING ================= */

  if (loading) {
    return (
      <div className="min-h-[65vh] flex items-center justify-center">
        <div className="text-center">
          <div className="relative w-16 h-16 mx-auto mb-5">
            <div className="absolute inset-0 rounded-2xl bg-blue-500/20 animate-ping" />

            <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 shadow-xl flex items-center justify-center">
              <FolderOpen
                size={28}
                className="text-white animate-pulse"
              />
            </div>
          </div>

          <h3 className="text-lg font-bold text-gray-800 dark:text-white">
            Loading categories
          </h3>

          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Organizing your financial categories...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen space-y-7 pb-10">

      {/* ================= BACKGROUND ================= */}

      <div className="fixed pointer-events-none -z-10 top-20 right-10 w-72 h-72 bg-blue-500/10 dark:bg-blue-500/5 rounded-full blur-3xl" />

      <div className="fixed pointer-events-none -z-10 bottom-10 left-10 w-80 h-80 bg-purple-500/10 dark:bg-purple-500/5 rounded-full blur-3xl" />

      {/* ================= HERO HEADER ================= */}

      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-950 p-7 md:p-8 shadow-2xl">

        {/* Decorative elements */}

        <div className="absolute -top-24 -right-20 w-72 h-72 rounded-full bg-blue-500/20 blur-sm" />

        <div className="absolute -bottom-32 right-40 w-80 h-80 rounded-full bg-indigo-500/10 blur-md" />

        <div className="absolute top-8 right-10 w-24 h-24 rounded-full border border-white/10" />

        <div className="absolute top-14 right-16 w-12 h-12 rounded-full bg-white/5 backdrop-blur-sm" />

        <div className="absolute bottom-8 left-1/2 w-16 h-16 rounded-full bg-blue-400/5" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-7">

          {/* Heading */}

          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/10 backdrop-blur-md text-blue-200 text-xs font-bold tracking-wide mb-4">
              <Sparkles size={14} />
              FINANCIAL ORGANIZATION
            </div>

            <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight">
              Categories
            </h1>

            <p className="text-blue-100/70 mt-2 max-w-xl">
              Organize your expenses with custom categories and color-coded
              identities.
            </p>
          </div>

          {/* Stats */}

          <div className="flex items-center gap-3">

            <div className="px-5 py-4 rounded-2xl bg-white/10 border border-white/10 backdrop-blur-md shadow-xl min-w-[120px]">
              <div className="flex items-center gap-2 mb-1">
                <Layers3 size={14} className="text-blue-300" />

                <p className="text-xs text-blue-200">
                  Categories
                </p>
              </div>

              <p className="text-2xl font-black text-white">
                {categories.length}
              </p>
            </div>

            <div className="hidden sm:block px-5 py-4 rounded-2xl bg-white/10 border border-white/10 backdrop-blur-md shadow-xl min-w-[120px]">
              <div className="flex items-center gap-2 mb-1">
                <Palette size={14} className="text-purple-300" />

                <p className="text-xs text-blue-200">
                  Color Codes
                </p>
              </div>

              <p className="text-2xl font-black text-white">
                {new Set(categories.map((cat) => cat.color)).size}
              </p>
            </div>

          </div>
        </div>
      </div>

      {/* ================= SECTION HEADER ================= */}

      <div className="flex items-center justify-between">

        <div className="flex items-center gap-3">

          <div className="w-1.5 h-8 rounded-full bg-gradient-to-b from-blue-500 to-indigo-600" />

          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              Your Categories
            </h2>

            <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
              Manage the categories used across your expenses
            </p>
          </div>

        </div>

        {categories.length > 0 && (
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 text-xs font-bold">
            <Tag size={13} />
            {categories.length} Active
          </div>
        )}

      </div>

      {/* ================= EMPTY STATE ================= */}

      {categories.length === 0 ? (
        <div className="relative">

          <div className="absolute -inset-1 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-indigo-500/10 rounded-3xl blur-xl" />

          <div className="relative bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl border border-gray-200/80 dark:border-gray-700 rounded-3xl shadow-xl p-12 text-center">

            <div className="w-20 h-20 mx-auto rounded-2xl bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30 flex items-center justify-center mb-5">
              <FolderOpen
                size={34}
                className="text-blue-600 dark:text-blue-400"
              />
            </div>

            <h3 className="text-xl font-bold text-gray-900 dark:text-white">
              No categories yet
            </h3>

            <p className="max-w-md mx-auto text-sm text-gray-500 dark:text-gray-400 mt-2">
              Categories help you organize and understand where your money
              goes. Create your first category from the Expenses page.
            </p>

            <div className="inline-flex items-center gap-2 mt-6 px-4 py-2 rounded-xl bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 text-sm font-semibold">
              <Sparkles size={15} />
              Start organizing your expenses
            </div>

          </div>
        </div>
      ) : (

        /* ================= CATEGORY GRID ================= */

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">

          {categories.map((cat, idx) => (

            <div
              key={cat.id}
              className="group relative"
              style={{
                animationDelay: `${idx * 0.05}s`,
              }}
            >

              {/* Glow behind card */}

              <div
                className="absolute -inset-1 rounded-3xl opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-500"
                style={{
                  backgroundColor: `${cat.color}22`,
                }}
              />

              {/* Card */}

              <div
                className="
                  relative overflow-hidden
                  bg-white/95 dark:bg-gray-800/95
                  backdrop-blur-xl
                  rounded-3xl
                  border border-gray-200/80 dark:border-gray-700
                  shadow-lg
                  transition-all duration-300
                  hover:-translate-y-2
                  hover:shadow-2xl
                "
              >

                {/* Top color strip */}

                <div
                  className="h-1.5 w-full"
                  style={{
                    background: `linear-gradient(90deg, ${cat.color}, ${cat.color}88)`,
                  }}
                />

                <div className="p-6">

                  {/* Header */}

                  <div className="flex items-start justify-between">

                    <div className="relative">

                      {/* Icon glow */}

                      <div
                        className="absolute inset-0 rounded-2xl blur-lg opacity-30 group-hover:opacity-50 transition-opacity"
                        style={{
                          backgroundColor: cat.color,
                        }}
                      />

                      {/* Category icon */}

                      <div
                        className="relative w-14 h-14 rounded-2xl flex items-center justify-center text-white font-black text-xl shadow-lg transition-transform duration-300 group-hover:scale-110 group-hover:rotate-2"
                        style={{
                          background: `linear-gradient(135deg, ${cat.color}, ${cat.color}bb)`,
                        }}
                      >
                        {cat.name.charAt(0).toUpperCase()}
                      </div>

                    </div>

                    {/* Delete */}

                    <button
                      onClick={() => handleDelete(cat.id)}
                      disabled={deletingId === cat.id}
                      className="
                        p-2.5
                        rounded-xl
                        text-gray-400
                        hover:text-red-600
                        hover:bg-red-50
                        dark:hover:bg-red-900/30
                        transition-all duration-200
                        opacity-0
                        group-hover:opacity-100
                        focus:opacity-100
                        disabled:opacity-50
                        disabled:cursor-not-allowed
                      "
                      title="Delete Category"
                    >
                      {deletingId === cat.id ? (
                        <div className="w-5 h-5 border-2 border-gray-300 border-t-red-500 rounded-full animate-spin" />
                      ) : (
                        <Trash2 size={19} />
                      )}
                    </button>

                  </div>

                  {/* Category information */}

                  <div className="mt-5">

                    <div className="flex items-center gap-2">

                      <h3 className="text-xl font-black text-gray-900 dark:text-white truncate">
                        {cat.name}
                      </h3>

                      <div
                        className="w-2 h-2 rounded-full flex-shrink-0"
                        style={{
                          backgroundColor: cat.color,
                        }}
                      />

                    </div>

                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 min-h-[40px] line-clamp-2 leading-5">
                      {cat.description || "No description provided."}
                    </p>

                  </div>

                  {/* Color information */}

                  <div className="mt-6 pt-4 border-t border-gray-100 dark:border-gray-700">

                    <div className="flex items-center justify-between">

                      <div className="flex items-center gap-2">

                        <div
                          className="w-8 h-8 rounded-lg shadow-inner border border-black/5"
                          style={{
                            backgroundColor: cat.color,
                          }}
                        />

                        <div>
                          <p className="text-[10px] uppercase tracking-wider font-bold text-gray-400 dark:text-gray-500">
                            Category Color
                          </p>

                          <p className="text-xs font-mono font-semibold text-gray-600 dark:text-gray-300 mt-0.5">
                            {cat.color.toUpperCase()}
                          </p>
                        </div>

                      </div>

                      <div
                        className="px-2.5 py-1 rounded-lg text-[10px] font-bold"
                        style={{
                          backgroundColor: `${cat.color}15`,
                          color: cat.color,
                        }}
                      >
                        ACTIVE
                      </div>

                    </div>

                  </div>

                </div>

                {/* Bottom decorative gradient */}

                <div
                  className="absolute bottom-0 left-0 right-0 h-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{
                    background: `linear-gradient(90deg, transparent, ${cat.color}, transparent)`,
                  }}
                />

              </div>
            </div>
          ))}

        </div>
      )}

      {/* ================= INFO CARD ================= */}

      {categories.length > 0 && (
        <div className="relative overflow-hidden rounded-2xl border border-blue-100 dark:border-blue-900/40 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 p-5">

          <div className="absolute -right-10 -top-10 w-32 h-32 rounded-full bg-blue-500/5" />

          <div className="relative flex items-start gap-4">

            <div className="w-10 h-10 flex-shrink-0 rounded-xl bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <AlertCircle size={19} />
            </div>

            <div>
              <h3 className="text-sm font-bold text-gray-800 dark:text-gray-200">
                Category management
              </h3>

              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 leading-5">
                Deleting a category will not remove the expenses associated
                with it. Those expense records will remain in your account.
              </p>
            </div>

          </div>

        </div>
      )}

    </div>
  );
}