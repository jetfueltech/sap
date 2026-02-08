
import React from 'react';

export const Settings: React.FC = () => {
  return (
    <div className="space-y-8 animate-fade-in pb-10 max-w-4xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">System Settings</h1>
        <p className="text-slate-500 mt-2 text-lg">Configure user profile, integrations, and system preferences.</p>
      </div>

      {/* User Profile */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
        <div className="px-8 py-6 border-b border-slate-100">
          <h3 className="font-bold text-slate-800">User Profile</h3>
        </div>
        <div className="p-8">
          <div className="flex items-center space-x-6 mb-8">
            <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-purple-500 to-pink-500 flex items-center justify-center text-white text-2xl font-bold shadow-lg">JD</div>
            <div>
              <h4 className="text-lg font-bold text-slate-900">John Doe, Esq.</h4>
              <p className="text-slate-500">Senior Partner • Admin Access</p>
              <button className="text-sm text-indigo-600 font-medium hover:text-indigo-800 mt-2">Change Avatar</button>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Email Address</label>
              <input type="email" className="w-full bg-white text-slate-900 border border-slate-300 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none" defaultValue="john.doe@legalflow.com" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Phone Number</label>
              <input type="tel" className="w-full bg-white text-slate-900 border border-slate-300 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none" defaultValue="+1 (555) 123-4567" />
            </div>
          </div>
        </div>
      </div>

      {/* Integrations */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
        <div className="px-8 py-6 border-b border-slate-100">
          <h3 className="font-bold text-slate-800">Integrations</h3>
        </div>
        <div className="p-8 space-y-6">
          
          {/* Smart Advocate */}
          <div className="flex items-center justify-between p-4 border border-slate-200 rounded-xl bg-slate-50">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center border border-slate-200 shadow-sm">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
              </div>
              <div>
                <h4 className="font-bold text-slate-900">Smart Advocate CMS</h4>
                <p className="text-xs text-slate-500">Sync cases and documents automatically.</p>
              </div>
            </div>
            <span className="px-3 py-1 bg-emerald-100 text-emerald-700 text-xs font-bold rounded-full border border-emerald-200">Connected</span>
          </div>

          {/* Microsoft Outlook */}
          <div className="flex items-center justify-between p-4 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center border border-slate-200 shadow-sm">
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="2" y="2" width="9" height="9" fill="#F25022"/>
                  <rect x="13" y="2" width="9" height="9" fill="#7FBA00"/>
                  <rect x="2" y="13" width="9" height="9" fill="#00A4EF"/>
                  <rect x="13" y="13" width="9" height="9" fill="#FFB900"/>
                </svg>
              </div>
              <div>
                <h4 className="font-bold text-slate-900">Microsoft Outlook</h4>
                <p className="text-xs text-slate-500">Sync emails, calendar events, and contacts.</p>
              </div>
            </div>
            <button className="text-sm font-medium text-slate-600 hover:text-indigo-600">Connect</button>
          </div>

          {/* RingCentral */}
          <div className="flex items-center justify-between p-4 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center border border-slate-200 shadow-sm text-orange-500">
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.5 14H15v-2.5h-1.5V16h-3v-1.5H8v-3h2.5V10H8V8.5h2.5V6h1.5v2.5h3V6h1.5v2.5h2.5v1.5h-2.5v3h2.5v1.5h-2.5V16z"/>
                </svg>
              </div>
              <div>
                <h4 className="font-bold text-slate-900">RingCentral</h4>
                <p className="text-xs text-slate-500">Log calls, SMS, and link voicemails to cases.</p>
              </div>
            </div>
            <button className="text-sm font-medium text-slate-600 hover:text-indigo-600">Connect</button>
          </div>

          {/* Facebook Leads */}
          <div className="flex items-center justify-between p-4 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center border border-slate-200 shadow-sm">
                <svg className="w-6 h-6 text-sky-500" fill="currentColor" viewBox="0 0 24 24"><path d="M15.999 8.058h2.366v2.965h-2.366V24h-4.015V11.023h-2.35v-2.965h2.35v-2.616c0-3.322 1.41-4.887 4.962-4.887 1.486 0 2.443.109 2.443.109v2.951h-1.503c-1.391 0-1.888.932-1.888 2.052v2.39z" /></svg>
              </div>
              <div>
                <h4 className="font-bold text-slate-900">Facebook Leads</h4>
                <p className="text-xs text-slate-500">Import leads directly from FB Ads.</p>
              </div>
            </div>
            <button className="text-sm font-medium text-slate-600 hover:text-indigo-600">Connect</button>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Google Gemini API Key</label>
            <div className="flex space-x-2">
              <input type="password" value="********************************" readOnly className="flex-1 border border-slate-300 rounded-lg px-4 py-2 text-sm bg-slate-50 text-slate-500" />
              <button className="px-4 py-2 border border-slate-300 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50">Regenerate</button>
            </div>
            <p className="text-xs text-slate-400 mt-2">Used for AI analysis and document processing.</p>
          </div>
        </div>
      </div>

      {/* Notifications */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
        <div className="px-8 py-6 border-b border-slate-100">
          <h3 className="font-bold text-slate-800">Notifications</h3>
        </div>
        <div className="p-8 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-slate-900">New Case Alerts</h4>
              <p className="text-xs text-slate-500">Receive email when a new intake is submitted.</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" defaultChecked />
              <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
            </label>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-slate-900">Daily Digest</h4>
              <p className="text-xs text-slate-500">Summary of daily activities and KPIs.</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" />
              <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};
