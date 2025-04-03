'use client';

import { Suspense } from 'react';
import { useLanguage } from './contexts/LanguageContext';
import Link from 'next/link';

function NotFoundContent() {
  const { t } = useLanguage();
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center p-8 bg-white rounded-lg shadow-lg">
        <h1 className="text-6xl font-bold text-gray-800 mb-4">404</h1>
        <p className="text-xl text-gray-600 mb-6">
          {t('general.notFound.message')}
        </p>
        <Link 
          href="/" 
          className="inline-block px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          {t('general.notFound.backHome')}
        </Link>
      </div>
    </div>
  );
}

export default function NotFound() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <NotFoundContent />
    </Suspense>
  );
} 