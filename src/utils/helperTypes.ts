// Utility function to convert numeric helper type values to display strings
export const getHelperTypeDisplay = (helperTypeValue: number): string => {
  switch (helperTypeValue) {
    case 1:
      return 'Spiritual Guide';
    case 2:
      return 'Relationship Coach';
    case 3:
      return 'Mental Wellness Helper';
    case 4:
      return 'Career Coach';
    case 5:
      return 'Friend & Advisor';
    case 6:
      return 'Health Consultant';
    case 7:
      return 'Custom Type';
    default:
      return 'Mental Wellness Helper';
  }
};

// Utility function to convert display strings back to numeric values
export const getHelperTypeValue = (helperTypeDisplay: string): number => {
  switch (helperTypeDisplay.toLowerCase()) {
    case 'spiritual guide':
      return 1;
    case 'relationship coach':
      return 2;
    case 'mental wellness helper':
      return 3;
    case 'career coach':
      return 4;
    case 'friend & advisor':
      return 5;
    case 'health consultant':
      return 6;
    case 'custom type':
      return 7;
    default:
      return 3;
  }
};

// Get all available helper types for dropdowns/selects
export const getAllHelperTypes = (): { value: number; label: string }[] => {
  return [
    { value: 1, label: 'Spiritual Guide' },
    { value: 2, label: 'Relationship Coach' },
    { value: 3, label: 'Mental Wellness Helper' },
    { value: 4, label: 'Career Coach' },
    { value: 5, label: 'Friend & Advisor' },
    { value: 6, label: 'Health Consultant' },
    { value: 7, label: 'Custom Type' }
  ];
};