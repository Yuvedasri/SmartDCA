import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../components/Navbar";

export default function DCADashboard() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(`http://127.0.0.1:8000/dca/${id}/dashboard`)
      .then((res) => {
        if (!res.ok) {
          throw new Error("API error: " + res.status);
        }
        return res.json();
      })
      .then((json) => setData(json))
      .catch((err) => setError(err.message));
  }, [id]);

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-900 via-teal-800 to-cyan-900 flex items-center justify-center">
        <div className="bg-gradient-to-br from-red-500/30 to-rose-500/30 border-2 border-red-400/50 rounded-3xl p-10 max-w-md backdrop-blur-xl">
          <div className="flex items-center gap-3 mb-3">
            <svg className="w-8 h-8 text-red-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="text-2xl font-bold text-white">Error Loading Dashboard</h3>
          </div>
          <p className="text-red-200 font-medium">{error}</p>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-900 via-teal-800 to-cyan-900 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-emerald-400 border-t-transparent mb-4"></div>
          <p className="text-2xl text-white/80 font-semibold">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  const hasCases = data.assigned_cases && data.assigned_cases.length > 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-900 via-teal-800 via-cyan-900 to-blue-900">
      <Navbar title="DCA Dashboard" />
      
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-5xl font-bold mb-3 bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 bg-clip-text text-transparent">
            Your Dashboard
          </h1>
          <p className="text-white/80 text-lg">Manage your assigned cases and track progress</p>
        </div>

        {/* Welcome Card */}
        <div className="bg-gradient-to-br from-emerald-500/30 via-teal-500/30 to-cyan-500/30 backdrop-blur-xl rounded-3xl border-2 border-emerald-400/50 p-10 mb-8 shadow-2xl">
          <div className="flex items-center gap-5">
            <div className="w-20 h-20 bg-gradient-to-br from-emerald-400 via-teal-400 to-cyan-400 rounded-3xl flex items-center justify-center shadow-2xl">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h2 className="text-3xl font-bold text-white mb-2">{data.message}</h2>
              <p className="text-white/80 text-lg">You have {hasCases ? data.assigned_cases.length : 0} {hasCases ? (data.assigned_cases.length === 1 ? 'case' : 'cases') : 'cases'} assigned to you</p>
            </div>
          </div>
        </div>

        {/* Cases Section */}
        <div className="bg-gradient-to-br from-white/20 to-white/10 backdrop-blur-xl rounded-3xl border-2 border-emerald-400/30 shadow-2xl p-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-emerald-400 via-teal-400 to-cyan-400 rounded-2xl flex items-center justify-center shadow-lg">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div>
                <h2 className="text-3xl font-bold text-white">Assigned Cases</h2>
                <p className="text-white/70 text-sm">Your current workload</p>
              </div>
            </div>
            {hasCases && (
              <div className="px-5 py-2 bg-gradient-to-r from-emerald-500/30 to-teal-500/30 border-2 border-emerald-400/50 rounded-xl">
                <span className="text-emerald-200 font-bold text-sm">{data.assigned_cases.length} Active</span>
              </div>
            )}
          </div>

          {!hasCases ? (
            <EmptyState />
          ) : (
            <div className="space-y-5">
              {data.assigned_cases.map((caseItem, index) => (
                <CaseCard key={index} caseData={caseItem} index={index + 1} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function CaseCard({ caseData, index }) {
  // Parse case data (format: "Customer Name - $Amount (X days overdue)")
  const match = caseData.match(/(.+?)\s*-\s*\$([\d,]+\.?\d*)\s*\((\d+)\s*days?\s*overdue\)/i);
  const customerName = match ? match[1].trim() : caseData.split(' - ')[0] || caseData;
  const amount = match ? match[2] : '0';
  const daysOverdue = match ? parseInt(match[3]) : 0;

  const getPriorityColor = (days) => {
    if (days >= 60) return "from-red-500 via-rose-500 to-pink-500";
    if (days >= 30) return "from-orange-400 via-amber-500 to-yellow-500";
    return "from-yellow-400 via-amber-400 to-orange-400";
  };

  const getPriorityLabel = (days) => {
    if (days >= 60) return "High Priority";
    if (days >= 30) return "Medium Priority";
    return "Low Priority";
  };

  return (
    <div className="group bg-gradient-to-br from-white/15 to-white/5 hover:from-white/25 hover:to-white/10 border-2 border-white/20 hover:border-emerald-400/50 rounded-2xl p-7 transition-all duration-300 hover:shadow-2xl hover:scale-[1.02] cursor-pointer">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-4 mb-4">
            <div className={`w-12 h-12 bg-gradient-to-br ${getPriorityColor(daysOverdue)} rounded-xl flex items-center justify-center text-white font-bold shadow-lg transform group-hover:scale-110 transition-transform`}>
              #{index}
            </div>
            <div>
              <h3 className="text-xl font-bold text-white mb-2">{customerName}</h3>
              <div className="flex items-center gap-2">
                <span className={`px-3 py-1 text-xs font-bold rounded-lg bg-gradient-to-r ${getPriorityColor(daysOverdue)} text-white shadow-lg`}>
                  {getPriorityLabel(daysOverdue)}
                </span>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-5 mt-5">
            <div className="bg-gradient-to-br from-emerald-500/20 to-teal-500/20 rounded-xl p-4 border-2 border-emerald-400/30">
              <p className="text-white/70 text-xs mb-2 font-semibold uppercase tracking-wide">Amount Due</p>
              <p className="text-2xl font-bold text-white">${parseFloat(amount).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
            </div>
            <div className="bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-xl p-4 border-2 border-cyan-400/30">
              <p className="text-white/70 text-xs mb-2 font-semibold uppercase tracking-wide">Days Overdue</p>
              <p className="text-2xl font-bold text-white">{daysOverdue} days</p>
            </div>
          </div>
        </div>

        <div className="ml-4 opacity-0 group-hover:opacity-100 transition-opacity">
          <button className="p-3 bg-gradient-to-br from-emerald-500/30 to-teal-500/30 hover:from-emerald-500/40 hover:to-teal-500/40 border-2 border-emerald-400/50 rounded-xl transition-all transform hover:scale-110">
            <svg className="w-6 h-6 text-emerald-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="py-20 text-center">
      <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-emerald-500/20 to-teal-500/20 rounded-full mb-6 border-2 border-emerald-400/30">
        <svg className="w-12 h-12 text-emerald-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      </div>
      <h3 className="text-2xl font-bold text-white mb-3">No Cases Assigned</h3>
      <p className="text-white/70 mb-8 max-w-md mx-auto text-lg">
        You don't have any cases assigned at the moment. New cases will appear here when they're assigned to you.
      </p>
      <div className="inline-flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 rounded-xl border-2 border-emerald-400/30">
        <svg className="w-6 h-6 text-emerald-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span className="text-sm text-white/80 font-semibold">Cases will appear automatically</span>
      </div>
    </div>
  );
}
