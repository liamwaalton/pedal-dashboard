'use client';

import React from 'react';
import RequireAuth from '@/components/RequireAuth';

export default function SettingsPage() {
  return (
    <RequireAuth>
      <div className="min-h-screen bg-background p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-[2rem] overflow-hidden shadow-sm p-6 md:p-12">
            <h1 className="text-2xl font-bold mb-6">Settings</h1>
            <p>Manage your account settings here.</p>
          </div>
        </div>
      </div>
    </RequireAuth>
  );
} 