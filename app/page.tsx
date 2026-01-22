'use client';

import { useState } from 'react';
import Sidebar from './components/Sidebar';
import ContentArea from './components/ContentArea';

export default function Home() {
  const [activeSection, setActiveSection] = useState('c1-1');

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar activeSection={activeSection} onSectionChange={setActiveSection} />
      <div className="flex-1 flex flex-col">
        <header className="bg-white shadow-md p-6">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-3xl font-bold bg-linear-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              🎓 Website Học Triết Học
            </h1>
            <p className="text-gray-600 mt-2">Khám phá tri thức triết học từ cổ đại đến đương đại</p>
          </div>
        </header>
        <ContentArea activeSection={activeSection} />
      </div>
    </div>
  );
}
