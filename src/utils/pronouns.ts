// Utility function to convert numeric pronoun values to display strings
export const getPronounDisplay = (pronounValue: number): string => {
  switch (pronounValue) {
    case 1:
      return 'They/Them';
    case 2:
      return 'She/Her';
    case 3:
      return 'He/Him';
    default:
      return 'They/Them';
  }
};

// Utility function to convert display strings back to numeric values
export const getPronounValue = (pronounDisplay: string): number => {
  switch (pronounDisplay.toLowerCase()) {
    case 'they/them':
      return 1;
    case 'she/her':
      return 2;
    case 'he/him':
      return 3;
    default:
      return 1;
  }
};