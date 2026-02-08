
import React, { useState } from 'react';

export const Analytics: React.FC = () => {
  return (
    <div className="space-y-8 animate-fade-in pb-10">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Intake Performance</h1>
        <p className="text-slate-500 mt-2 text-lg">Metrics focused on intake process efficiency and completion rates.</p>
      </div>

      {/* Top KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Intakes Completed (MTD)</h3>
          <div className="flex items-end justify-between">
            <span className="text-4xl font-bold text-slate-900">84</span>
            <span className="text-sm font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded">+8%</span>
          </div>
          <p className="text-xs text-slate-400 mt-2">Signed retainers this month</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Avg. Time to Complete</h3>
          <div className="flex items-end justify-between">
            <span className="text-4xl font-bold text-slate-900">26h 15m</span>
            <span className="text-sm font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded">-2h</span>
          </div>
          <p className="text-xs text-slate-400 mt-2">From New Lead to Intake Complete</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Retainer Sign-up Rate</h3>
          <div className="flex items-end justify-between">
            <span className="text-4xl font-bold text-slate-900">32.4%</span>
            <span className="text-sm font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded">+2.1%</span>
          </div>
          <p className="text-xs text-slate-400 mt-2">Leads converted to clients</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Intake Funnel (Aligned with actual Case Statuses) */}
        <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
          <h3 className="font-bold text-slate-800 mb-6 text-lg">Intake Pipeline Funnel</h3>
          <div className="space-y-5">
             {[
                { label: 'New / Analyzing', val: 124, drop: 0, color: 'bg-blue-100 text-blue-800' },
                { label: 'Review Needed', val: 98, drop: '21%', color: 'bg-amber-100 text-amber-800' },
                { label: 'Accepted / Processing', val: 86, drop: '12%', color: 'bg-emerald-100 text-emerald-800' },
                { label: 'Intake Complete', val: 72, drop: '16%', color: 'bg-slate-100 text-slate-800' }
             ].map((stage, i, arr) => {
                 const maxVal = arr[0].val;
                 const width = (stage.val / maxVal) * 100;
                 return (
                     <div key={i} className="relative">
                        <div className="flex items-center justify-between mb-1 text-sm font-bold text-slate-700">
                            <span>{stage.label}</span>
                            <span>{stage.val} Cases</span>
                        </div>
                        <div className="h-10 bg-slate-50 rounded-r-lg overflow-hidden relative">
                             <div 
                                className={`h-full rounded-r-lg ${stage.color.split(' ')[0]} transition-all duration-1000 flex items-center px-3`} 
                                style={{ width: `${width}%` }}
                             >
                                 <span className={`text-xs font-bold ${stage.color.split(' ')[1]}`}>{Math.round(width)}%</span>
                             </div>
                        </div>
                        {i > 0 && (
                            <div className="absolute right-0 top-9 text-[10px] text-red-400 font-medium transform translate-y-[-150%]">
                                ↓ {stage.drop} drop
                            </div>
                        )}
                     </div>
                 )
             })}
          </div>
          <div className="mt-6 pt-4 border-t border-slate-100">
             <div className="flex justify-between items-center text-xs text-slate-500">
                <span>* Drop-offs include Rejected and Lost Contact statuses.</span>
             </div>
          </div>
        </div>

        {/* Team Case Load */}
        <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
          <h3 className="font-bold text-slate-800 mb-6 text-lg">Team Case Load</h3>
          
          <div className="space-y-8">
            {/* Team A */}
            <div>
                <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center">
                        <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold mr-3">A</div>
                        <div>
                            <h4 className="font-bold text-slate-900 text-sm">Team A</h4>
                            <p className="text-xs text-slate-500">2 Senior • 3 Junior</p>
                        </div>
                    </div>
                    <div className="text-right">
                        <span className="block font-bold text-slate-900 text-lg">42 Active</span>
                        <span className="text-xs text-emerald-600 font-medium">94% Capacity</span>
                    </div>
                </div>
                <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-indigo-500 rounded-full" style={{ width: '94%' }}></div>
                </div>
                <div className="flex gap-4 mt-2">
                    <span className="text-[10px] text-slate-500 bg-slate-50 px-2 py-0.5 rounded">Avg Close: 24h</span>
                    <span className="text-[10px] text-slate-500 bg-slate-50 px-2 py-0.5 rounded">Satisfaction: 4.8/5</span>
                </div>
            </div>

            {/* Team B */}
            <div>
                <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center">
                        <div className="w-8 h-8 rounded-lg bg-fuchsia-100 text-fuchsia-600 flex items-center justify-center font-bold mr-3">B</div>
                        <div>
                            <h4 className="font-bold text-slate-900 text-sm">Team B</h4>
                            <p className="text-xs text-slate-500">1 Senior • 4 Junior</p>
                        </div>
                    </div>
                    <div className="text-right">
                        <span className="block font-bold text-slate-900 text-lg">28 Active</span>
                        <span className="text-xs text-slate-500 font-medium">65% Capacity</span>
                    </div>
                </div>
                <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-fuchsia-500 rounded-full" style={{ width: '65%' }}></div>
                </div>
                 <div className="flex gap-4 mt-2">
                    <span className="text-[10px] text-slate-500 bg-slate-50 px-2 py-0.5 rounded">Avg Close: 31h</span>
                    <span className="text-[10px] text-slate-500 bg-slate-50 px-2 py-0.5 rounded">Satisfaction: 4.6/5</span>
                </div>
            </div>
          </div>

          <div className="mt-8 p-4 bg-amber-50 rounded-xl border border-amber-100 flex items-start">
             <div className="w-5 h-5 text-amber-500 mr-2 flex-shrink-0 font-bold">!</div>
             <p className="text-xs text-amber-800 leading-relaxed">
                <strong>Load Balancing Recommendation:</strong> Team A is nearing full capacity. Consider routing new "Review Needed" cases to Team B for the next 48 hours.
             </p>
          </div>
        </div>
      </div>

      {/* Referral Sources */}
      <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
        <h3 className="font-bold text-slate-800 mb-6 text-lg">Referral Sources</h3>
        <div className="space-y-6">
          {[
            { label: 'Google Ads', val: 45, color: 'bg-blue-500' },
            { label: 'Organic Search', val: 25, color: 'bg-emerald-500' },
            { label: 'Social Media', val: 15, color: 'bg-purple-500' },
            { label: 'Billboards', val: 10, color: 'bg-orange-500' },
            { label: 'Referrals', val: 5, color: 'bg-slate-400' },
          ].map((item, i) => (
            <div key={i}>
              <div className="flex justify-between text-sm font-medium text-slate-700 mb-2">
                <span>{item.label}</span>
                <span>{item.val}%</span>
              </div>
              <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                <div className={`h-full rounded-full ${item.color}`} style={{ width: `${item.val}%` }}></div>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-8 p-4 bg-slate-50 rounded-xl border border-slate-100">
           <h4 className="text-xs font-bold text-slate-500 uppercase mb-2 flex items-center">
              <svg className="w-3 h-3 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
              AI Insight
           </h4>
           <p className="text-sm text-slate-600">Google Ads leads have a <strong>12% higher completion rate</strong> than Social Media leads this month. Recommendation: Increase Ads budget for "Car Accident" keywords.</p>
        </div>
      </div>
    </div>
  );
};
