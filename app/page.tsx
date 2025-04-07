import { Metadata } from 'next';
import { Suspense } from 'react';
import HomeContent from './components/HomeContent';

// Define the Props type for Next.js 15.2.4
type Props = {
  params: Promise<{ [key: string]: string | string[] }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  // Since searchParams is now a Promise, we need to await it
  const resolvedSearchParams = await searchParams;
  const lang = resolvedSearchParams.lang as string || 'fr';
  
  const metadata: Metadata = {
    title: lang === 'en' ? 'Vocca demos' : 'Vocca démos',
    description: lang === 'en' 
      ? 'Demonstration of Vocca use cases for medical appointments and consultations'
      : 'Démonstration des cas d\'usage Vocca pour les rendez-vous et consultations médicaux',
    openGraph: {
      title: lang === 'en' ? 'Vocca demos' : 'Vocca démos',
      description: lang === 'en' 
        ? 'Demonstration of Vocca use cases for medical appointments and consultations'
        : 'Démonstration des cas d\'usage Vocca pour les rendez-vous et consultations médicaux',
      locale: lang === 'en' ? 'en_US' : 'fr_FR',
    }
  };

  return metadata;
}

export default function Home() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">
      <div className="animate-pulse text-gray-600">Loading...</div>
    </div>}>
      <HomeContent />
    </Suspense>
  );
}
