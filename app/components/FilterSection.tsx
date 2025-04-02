'use client';

import { useLanguage } from '../contexts/LanguageContext';

interface FilterSectionProps {
  filters: {
    centerTypes: Array<{ id: string; label: string }>;
    appointmentTypes: Array<{ id: string; label: string }>;
  };
  selectedCenterType: string | null;
  selectedAppointmentType: string | null;
  onCenterTypeChange: (type: string | null) => void;
  onAppointmentTypeChange: (type: string | null) => void;
}

export default function FilterSection({
  filters,
  selectedCenterType,
  selectedAppointmentType,
  onCenterTypeChange,
  onAppointmentTypeChange,
}: FilterSectionProps) {
  const { t, translateFilterLabel } = useLanguage();

  const handleCenterTypeClick = (typeId: string) => {
    if (selectedCenterType === typeId) {
      // Si le filtre est déjà sélectionné, on le désactive
      onCenterTypeChange(null);
    } else {
      // Sinon on l'active
      onCenterTypeChange(typeId);
    }
  };

  const handleAppointmentTypeClick = (typeId: string) => {
    if (selectedAppointmentType === typeId) {
      // Si le filtre est déjà sélectionné, on le désactive
      onAppointmentTypeChange(null);
    } else {
      // Sinon on l'active
      onAppointmentTypeChange(typeId);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-800">{t('filters.title')}</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Centre Type Filter */}
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-3">{t('filters.centerType')}</h3>
          <div className="flex flex-wrap gap-2">
            {filters.centerTypes.map((type) => (
              <button
                key={type.id}
                onClick={() => handleCenterTypeClick(type.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ease-in-out
                  ${selectedCenterType === type.id
                    ? 'bg-blue-500 text-white shadow-md transform scale-105 hover:bg-blue-600'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:scale-105'
                  }
                `}
              >
                {translateFilterLabel(type.id, 'centerType')}
              </button>
            ))}
          </div>
        </div>

        {/* Appointment Type Filter */}
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-3">{t('filters.appointmentType')}</h3>
          <div className="flex flex-wrap gap-2">
            {filters.appointmentTypes.map((type) => (
              <button
                key={type.id}
                onClick={() => handleAppointmentTypeClick(type.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ease-in-out
                  ${selectedAppointmentType === type.id
                    ? 'bg-blue-500 text-white shadow-md transform scale-105 hover:bg-blue-600'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:scale-105'
                  }
                `}
              >
                {translateFilterLabel(type.id, 'appointmentType')}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 