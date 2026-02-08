import React, { useState } from 'react';
import { DirectoryProviders } from './DirectoryProviders';
import { DirectoryInsurance } from './DirectoryInsurance';

type DirectoryTab = 'providers' | 'insurance';

export const Directory: React.FC = () => {
  const [tab, setTab] = useState<DirectoryTab>('providers');

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Directory</h1>
        <p className="text-sm text-slate-500 mt-1">Manage your shared medical provider and insurance company records.</p>
      </div>

      <div className="border-b border-slate-200">
        <div className="flex gap-6">
          <button
            onClick={() => setTab('providers')}
            className={`pb-3 text-sm font-medium transition-colors relative whitespace-nowrap ${
              tab === 'providers' ? 'text-blue-600' : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
              Medical Providers
            </div>
            {tab === 'providers' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 rounded-t-full"></div>}
          </button>
          <button
            onClick={() => setTab('insurance')}
            className={`pb-3 text-sm font-medium transition-colors relative whitespace-nowrap ${
              tab === 'insurance' ? 'text-blue-600' : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
              Insurance Companies
            </div>
            {tab === 'insurance' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 rounded-t-full"></div>}
          </button>
        </div>
      </div>

      {tab === 'providers' ? <DirectoryProviders /> : <DirectoryInsurance />}
    </div>
  );
};
