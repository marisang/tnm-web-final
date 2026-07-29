'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import ModerationSection from '@/components/admin/ModerationSection';
import CreateShowSection from '@/components/admin/CreateShowSection';

export default function AdminPage() {
  return (
    <div className="min-h-screen bg-gray-300">
      <Header />
      
      <main className="pt-8 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* User greeting */}
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 rounded-full bg-gray-400 flex items-center justify-center">
              <span className="text-gray-600 text-xl">👤</span>
            </div>
            <h1 className="text-2xl font-semibold text-gray-800">Olá, Usuário Adm!</h1>
          </div>

          {/* Two column layout */}
          <div className="grid grid-cols-2 gap-6">
            {/* Left: Moderation */}
            <ModerationSection />
            
            {/* Right: Create Show */}
            <CreateShowSection />
          </div>
        </div>
      </main>
    </div>
  );
}
