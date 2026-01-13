import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [form, setForm] = useState({ name: "", amount: "", days: "" });
  const [msg, setMsg] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/admin/dashboard")
      .then((r) => r.json())
      .then(setStats)
      .catch(() => setStats(null));
  }, []);

  const createCase = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMsg("");
    
    try {
      const res = await fetch("http://127.0.0.1:8000/admin/case", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer_name: form.name,
          amount: Number(form.amount),
          days_overdue: Number(form.days),
        }),
      });

      if (res.ok) {
        setMsg("Case created successfully!");
        setForm({ name: "", amount: "", days: "" });
        // Refresh stats
        fetch("http://127.0.0.1:8000/admin/dashboard")
          .then((r) => r.json())
          .then(setStats)
          .catch(() => {});
      } else {
        setMsg("Failed to create case. Please try again.");
      }
    } catch (error) {
      setMsg("Error creating case. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!stats) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-violet-900 via-purple-800 to-indigo-900 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-pink-500 border-t-transparent mb-4"></div>
          <p className="text-2xl text-white/80 font-semibold">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-900 via-purple-800 via-fuchsia-900 to-indigo-900">
      <Navbar title="Admin Dashboard" />
      
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-5xl font-bold mb-3 bg-gradient-to-r from-pink-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
            Welcome Back
          </h1>
          <p className="text-white/80 text-lg">Manage cases and monitor system performance</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatCard
            title="Total DCAs"
            value={stats.total_dcas}
            icon={
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            }
            gradient="from-cyan-400 via-blue-500 to-indigo-500"
            trend="+2 this month"
            borderColor="border-cyan-400/50"
          />
          <StatCard
            title="Active Cases"
            value={stats.active_cases}
            icon={
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            }
            gradient="from-pink-500 via-rose-500 to-fuchsia-500"
            trend={`${stats.active_cases} in progress`}
            borderColor="border-pink-400/50"
          />
          <StatCard
            title="Resolved Today"
            value={stats.resolved_today}
            icon={
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            }
            gradient="from-emerald-400 via-green-500 to-teal-500"
            trend="Great progress!"
            borderColor="border-emerald-400/50"
          />
        </div>

        {/* Create Case Form */}
        <div className="bg-gradient-to-br from-white/20 to-white/10 backdrop-blur-xl rounded-3xl border-2 border-purple-400/30 shadow-2xl p-8">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-14 h-14 bg-gradient-to-br from-pink-500 via-purple-500 to-indigo-500 rounded-2xl flex items-center justify-center shadow-2xl">
              <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </div>
            <div>
              <h2 className="text-3xl font-bold text-white">Create New Case</h2>
              <p className="text-white/70 text-sm">Add a new debt collection case to the system</p>
            </div>
          </div>

          <form onSubmit={createCase} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div>
                <label className="block text-sm font-semibold text-white mb-2">
                  Customer Name
                </label>
                <input
                  type="text"
                  placeholder="John Doe"
                  required
                  className="w-full px-4 py-3 bg-white/20 border-2 border-purple-400/30 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-400 transition-all"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-white mb-2">
                  Amount ($)
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/70 font-bold text-lg">$</span>
                  <input
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    required
                    className="w-full pl-8 pr-4 py-3 bg-white/20 border-2 border-purple-400/30 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-400 transition-all"
                    value={form.amount}
                    onChange={(e) => setForm({ ...form, amount: e.target.value })}
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-white mb-2">
                  Days Overdue
                </label>
                <input
                  type="number"
                  placeholder="30"
                  required
                  className="w-full px-4 py-3 bg-white/20 border-2 border-purple-400/30 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-400 transition-all"
                  value={form.days}
                  onChange={(e) => setForm({ ...form, days: e.target.value })}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full md:w-auto px-10 py-4 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 hover:from-pink-600 hover:via-purple-600 hover:to-indigo-600 disabled:from-gray-600 disabled:to-gray-600 disabled:cursor-not-allowed text-white font-bold rounded-xl shadow-2xl hover:shadow-pink-500/50 transform hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-2 text-lg"
            >
              {isSubmitting ? (
                <>
                  <div className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Creating...</span>
                </>
              ) : (
                <>
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  <span>Create Case</span>
                </>
              )}
            </button>
          </form>

          {msg && (
            <div className={`mt-6 p-5 rounded-xl border-2 ${
              msg.includes("successfully") 
                ? "bg-gradient-to-r from-emerald-500/30 to-green-500/30 border-emerald-400/50 text-emerald-200" 
                : "bg-gradient-to-r from-red-500/30 to-rose-500/30 border-red-400/50 text-red-200"
            }`}>
              <div className="flex items-center gap-3">
                {msg.includes("successfully") ? (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                )}
                <span className="text-base font-semibold">{msg}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon, gradient, trend, borderColor }) {
  return (
    <div className={`group relative bg-gradient-to-br from-white/20 to-white/10 backdrop-blur-xl rounded-3xl border-2 ${borderColor} p-7 hover:from-white/30 hover:to-white/20 transition-all duration-300 hover:shadow-2xl hover:scale-[1.05] cursor-pointer`}>
      <div className="flex items-start justify-between mb-5">
        <div className={`w-16 h-16 bg-gradient-to-br ${gradient} rounded-2xl flex items-center justify-center text-white shadow-2xl transform group-hover:scale-110 transition-transform`}>
          {icon}
        </div>
        <div className="opacity-0 group-hover:opacity-100 transition-opacity">
          <svg className="w-6 h-6 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </div>
      <div>
        <p className="text-white/70 text-sm font-semibold mb-2 uppercase tracking-wide">{title}</p>
        <p className="text-5xl font-bold text-white mb-3 bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">{value}</p>
        <p className="text-white/60 text-sm font-medium">{trend}</p>
      </div>
      <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-10 rounded-3xl transition-opacity`}></div>
    </div>
  );
}
