import { useState } from 'react';
import {
  Plus, Download, Edit, Trash2, FileText, Crown,
  TrendingUp, Clock, CheckCircle, Zap, ChevronRight,
  BarChart3, Calendar, Layers, Star, AlertCircle, PenLine, LogOut
} from 'lucide-react';
import { useApp } from '../store';

const templateColors: Record<string, { bg: string; text: string; dot: string; label: string }> = {
  modern:       { bg: 'bg-blue-100',   text: 'text-blue-700',   dot: 'bg-blue-500',   label: 'Modern' },
  classic:      { bg: 'bg-gray-100',   text: 'text-gray-700',   dot: 'bg-gray-500',   label: 'Classic' },
  minimal:      { bg: 'bg-slate-100',  text: 'text-slate-700',  dot: 'bg-slate-500',  label: 'Minimal' },
  professional: { bg: 'bg-indigo-100', text: 'text-indigo-700', dot: 'bg-indigo-500', label: 'Professional' },
  creative:     { bg: 'bg-purple-100', text: 'text-purple-700', dot: 'bg-purple-500', label: 'Creative' },
};

const TIPS_KEYS = ['dash.tip1', 'dash.tip2', 'dash.tip3', 'dash.tip4'] as const;
const TIPS_ICONS = ['🎯', '📊', '✍️', '🔗'];

export function DashboardPage() {
  const { user, savedCVs, setCurrentPage, deleteCV, loadCV, setShowUpgradeModal, logout, t } = useApp();
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [tipIndex] = useState(() => Math.floor(Math.random() * TIPS_KEYS.length));

  const handleEdit = (id: string) => {
    loadCV(id);
    setCurrentPage('app');
  };

  const handleView = (id: string) => {
    loadCV(id);
    const cv = savedCVs.find(c => c.id === id);
    if (cv?.generatedContent) setCurrentPage('result');
  };

  const handleDeleteConfirm = (id: string) => setDeletingId(id);
  const handleDeleteCancel = () => setDeletingId(null);
  const handleDeleteExecute = (id: string) => {
    deleteCV(id);
    setDeletingId(null);
  };

  const stats = [
    { label: t('dash.totalCVs'), value: savedCVs.length, icon: FileText, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: t('dash.thisMonth'), value: savedCVs.filter(cv => {
        const d = new Date(cv.createdAt);
        const now = new Date();
        return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
      }).length, icon: Calendar, color: 'text-indigo-600', bg: 'bg-indigo-50' },
    { label: t('dash.templates'), value: new Set(savedCVs.map(cv => cv.template)).size, icon: Layers, color: 'text-purple-600', bg: 'bg-purple-50' },
    { label: t('dash.plan'), value: user.plan === 'pro' ? 'Pro' : 'Free', icon: Star, color: user.plan === 'pro' ? 'text-amber-600' : 'text-gray-500', bg: user.plan === 'pro' ? 'bg-amber-50' : 'bg-gray-50' },
  ];

  const firstName = user.fullName?.split(' ')[0] || 'User';
  const hour = new Date().getHours();
  const greeting = hour < 12 ? t('dash.morning') : hour < 18 ? t('dash.afternoon') : t('dash.evening');

  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-16">

      {/* Hero Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            {/* Greeting */}
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-slate-700 to-slate-900 flex items-center justify-center text-white text-xl font-bold shadow-lg">
                {firstName.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="text-sm text-gray-500 font-medium">{greeting},</p>
                <h1 className="text-2xl font-bold text-gray-900">{user.fullName || 'User'} 👋</h1>
                <p className="text-sm text-gray-400 mt-0.5">{t('dash.ready')}</p>
              </div>
            </div>

            {/* CTA */}
            <div className="flex items-center gap-3 flex-wrap">
              {user.plan === 'free' && (
                <button
                  onClick={() => setShowUpgradeModal(true)}
                  className="flex items-center gap-2 px-4 py-2.5 bg-amber-500 text-white rounded-xl font-semibold text-sm hover:bg-amber-600 transition-all cursor-pointer"
                >
                  <Crown className="w-4 h-4" />
                  {t('dash.upgradePro')}
                </button>
              )}
              <button
                onClick={() => setCurrentPage('app')}
                className="flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-xl font-semibold hover:bg-slate-800 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 cursor-pointer"
              >
                <Plus className="w-5 h-5" />
                {t('dash.createNew')}
                <ChevronRight className="w-4 h-4" />
              </button>
              <button
                onClick={logout}
                title="Sign out"
                className="p-3 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors cursor-pointer border border-slate-200"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">

        {/* Stats Row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, i) => (
            <div key={i} className="bg-white rounded-2xl border border-gray-200 p-5 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm text-gray-500 font-medium">{stat.label}</span>
                <div className={`w-9 h-9 ${stat.bg} rounded-xl flex items-center justify-center`}>
                  <stat.icon className={`w-4 h-4 ${stat.color}`} />
                </div>
              </div>
              <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main — CV List */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-slate-600" />
                {t('dash.mySavedCVs')}
              </h2>
              <span className="text-sm text-gray-400">{savedCVs.length} CVs</span>
            </div>

            {savedCVs.length === 0 ? (
              /* Empty State */
              <div className="bg-white rounded-2xl border-2 border-dashed border-gray-200 p-12 text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <FileText className="w-8 h-8 text-gray-300" />
                </div>
                <h3 className="text-lg font-semibold text-gray-700 mb-2">{t('dash.noCVs')}</h3>
                <p className="text-gray-400 text-sm mb-6 max-w-xs mx-auto">
                  {t('dash.noCVsDesc')}
                </p>
                <button
                  onClick={() => setCurrentPage('app')}
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-900 text-white rounded-xl font-medium hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  {t('dash.createCV')}
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {savedCVs.map(cv => {
                  const tmpl = templateColors[cv.template] || templateColors.modern;
                  const isDeleting = deletingId === cv.id;
                  const date = new Date(cv.createdAt).toLocaleDateString('en-US', {
                    day: 'numeric', month: 'long', year: 'numeric'
                  });

                  return (
                    <div
                      key={cv.id}
                      className={`bg-white rounded-2xl border transition-all ${
                        isDeleting
                          ? 'border-red-300 shadow-md shadow-red-50'
                          : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
                      }`}
                    >
                      {isDeleting ? (
                        /* Delete Confirmation */
                        <div className="p-5 flex items-center justify-between gap-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center flex-shrink-0">
                              <AlertCircle className="w-5 h-5 text-red-500" />
                            </div>
                            <div>
                              <p className="font-semibold text-gray-900 text-sm">{t('dash.deleteConfirm')}</p>
                              <p className="text-xs text-gray-400">"{cv.title}" {t('dash.deletePermanent')}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 flex-shrink-0">
                            <button
                              onClick={handleDeleteCancel}
                              className="px-3 py-1.5 text-sm text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors cursor-pointer"
                            >
                              {t('dash.cancel')}
                            </button>
                            <button
                              onClick={() => handleDeleteExecute(cv.id)}
                              className="px-3 py-1.5 text-sm text-white bg-red-500 rounded-lg hover:bg-red-600 transition-colors cursor-pointer"
                            >
                              {t('dash.delete')}
                            </button>
                          </div>
                        </div>
                      ) : (
                        /* Normal Card */
                        <div className="p-5">
                          <div className="flex items-center justify-between gap-4">
                            {/* Left — Info */}
                            <div className="flex items-center gap-4 min-w-0">
                              {/* CV Mini Preview */}
                              <div className="w-12 h-14 bg-gradient-to-b from-slate-100 to-slate-200 rounded-lg flex-shrink-0 flex flex-col items-center justify-start pt-2 gap-0.5 overflow-hidden border border-slate-200">
                                <div className="w-6 h-1 bg-slate-400 rounded-full" />
                                <div className="w-4 h-0.5 bg-slate-300 rounded-full" />
                                <div className="w-7 h-0.5 bg-slate-200 rounded-full mt-1" />
                                <div className="w-7 h-0.5 bg-slate-200 rounded-full" />
                                <div className="w-5 h-0.5 bg-slate-200 rounded-full" />
                              </div>

                              <div className="min-w-0">
                                <h3 className="font-semibold text-gray-900 truncate">{cv.title}</h3>
                                <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                                  <span className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full ${tmpl.bg} ${tmpl.text}`}>
                                    <span className={`w-1.5 h-1.5 rounded-full ${tmpl.dot}`} />
                                    {tmpl.label}
                                  </span>
                                  <span className="flex items-center gap-1 text-xs text-gray-400">
                                    <Clock className="w-3 h-3" />
                                    {date}
                                  </span>
                                  {cv.generatedContent && (
                                    <span className="flex items-center gap-1 text-xs text-green-600">
                                      <CheckCircle className="w-3 h-3" />
                                      {t('dash.ready2')}
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>

                            {/* Right — Actions */}
                            <div className="flex items-center gap-1 flex-shrink-0">
                              <button
                                onClick={() => handleView(cv.id)}
                                title="View & Download"
                                className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all cursor-pointer"
                              >
                                <Download className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleEdit(cv.id)}
                                title="Edit"
                                className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-all cursor-pointer"
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDeleteConfirm(cv.id)}
                                title="Delete"
                                className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all cursor-pointer"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}

                {/* Add More */}
                <button
                  onClick={() => setCurrentPage('app')}
                  className="w-full p-4 border-2 border-dashed border-gray-200 rounded-2xl text-gray-400 hover:border-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-all flex items-center justify-center gap-2 font-medium cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  {t('dash.addNewCV')}
                </button>
              </div>
            )}
          </div>

          {/* Right Sidebar */}
          <div className="space-y-4">

            {/* Plan Card */}
            {user.plan === 'free' ? (
              <div className="bg-gradient-to-br from-slate-800 to-slate-950 rounded-2xl p-5 text-white">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm font-medium text-slate-300">{t('dash.currentPlan')}</span>
                  <span className="px-2 py-0.5 bg-slate-700 rounded-full text-xs text-slate-300">Free</span>
                </div>

                {/* Usage Bar */}
                <div className="mb-4">
                  <div className="flex justify-between text-xs text-slate-400 mb-1.5">
                    <span>{t('dash.cvUsage')}</span>
                    <span>{user.cvCount}/1</span>
                  </div>
                  <div className="h-1.5 bg-slate-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-blue-400 to-blue-500 rounded-full transition-all"
                      style={{ width: `${Math.min(user.cvCount * 100, 100)}%` }}
                    />
                  </div>
                </div>

                <div className="space-y-2 mb-5">
                  {[t('price.pro.1'), t('price.pro.4'), t('stats.templates'), t('price.pro.5')].map(f => (
                    <div key={f} className="flex items-center gap-2 text-sm text-slate-300">
                      <CheckCircle className="w-4 h-4 text-blue-400 flex-shrink-0" />
                      {f}
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => setShowUpgradeModal(true)}
                  className="w-full py-2.5 bg-white text-slate-900 rounded-xl font-semibold text-sm hover:bg-slate-100 transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Crown className="w-4 h-4 text-amber-500" />
                  {t('price.upgrade')}
                </button>
              </div>
            ) : (
              <div className="bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl p-5 text-white">
                <div className="flex items-center gap-3 mb-3">
                  <Crown className="w-6 h-6" />
                  <div>
                    <p className="font-bold">{t('dash.proActive')}</p>
                    <p className="text-xs text-amber-100">{t('dash.allUnlocked')}</p>
                  </div>
                </div>
                <div className="space-y-1.5">
                  {['Unlimited CVs', 'No watermark', '5 templates'].map(f => (
                    <div key={f} className="flex items-center gap-2 text-sm text-amber-100">
                      <CheckCircle className="w-4 h-4 text-white flex-shrink-0" />
                      {f}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Quick Actions */}
            <div className="bg-white rounded-2xl border border-gray-200 p-5">
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Zap className="w-4 h-4 text-amber-500" />
                {t('dash.quickActions')}
              </h3>
              <div className="space-y-2">
                <button
                  onClick={() => setCurrentPage('app')}
                  className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 transition-colors text-sm font-medium text-gray-700 group cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Plus className="w-4 h-4 text-blue-600" />
                    </div>
                    {t('dash.createNew')}
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-gray-500 transition-colors" />
                </button>
                <button
                  onClick={() => setCurrentPage('cover-letter')}
                  className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 transition-colors text-sm font-medium text-gray-700 group cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-violet-100 rounded-lg flex items-center justify-center">
                      <PenLine className="w-4 h-4 text-violet-600" />
                    </div>
                    {t('dash.createCoverLetter')}
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-gray-500 transition-colors" />
                </button>
                <button
                  onClick={() => setCurrentPage('pricing')}
                  className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 transition-colors text-sm font-medium text-gray-700 group cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                      <TrendingUp className="w-4 h-4 text-purple-600" />
                    </div>
                    {t('nav.pricing')}
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-gray-500 transition-colors" />
                </button>
              </div>
            </div>

            {/* Daily Tip */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl border border-blue-100 p-5">
              <p className="text-xs font-semibold text-blue-600 uppercase tracking-wide mb-2">💡 {t('dash.cvTip')}</p>
              <p className="text-sm text-slate-700 leading-relaxed">
                {TIPS_ICONS[tipIndex]} {t(TIPS_KEYS[tipIndex])}
              </p>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
