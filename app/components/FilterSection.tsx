'use client';

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
        <h2 className="text-xl font-bold text-gray-800">Filtres</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Centre Type Filter */}
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-3">Type de Centre</h3>
          <div className="flex flex-wrap gap-2">
            {filters.centerTypes.map((type) => (
              <button
                key={type.id}
                onClick={() => handleCenterTypeClick(type.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                  selectedCenterType === type.id
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {type.label}
              </button>
            ))}
          </div>
        </div>

        {/* Appointment Type Filter */}
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-3">Type de Rendez-vous</h3>
          <div className="flex flex-wrap gap-2">
            {filters.appointmentTypes.map((type) => (
              <button
                key={type.id}
                onClick={() => handleAppointmentTypeClick(type.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                  selectedAppointmentType === type.id
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {type.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 