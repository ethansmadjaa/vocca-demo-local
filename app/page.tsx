import { Metadata } from 'next';
import { Suspense } from 'react';
import HomeContent from './components/HomeContent';

// Define more specific types for the searchParams and params
type SearchParamsType = {
  lang?: string;
  center?: string;
  type?: string;
  [key: string]: string | undefined;
};

type ParamsType = {
  [key: string]: string;
};

// Update the Props type to match Next.js 15+ requirements with more specific types
type Props = {
  searchParams: Promise<SearchParamsType>;
  params: Promise<ParamsType>;
};

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  // Since searchParams is now a Promise, we need to await it
  const resolvedParams = await searchParams;
  const lang = resolvedParams.lang || 'fr';
  
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

// Remove the unused searchParams parameter
export default function Home() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">
      <div className="animate-pulse text-gray-600">Loading...</div>
    </div>}>
      <HomeContent />
    </Suspense>
  );
}
