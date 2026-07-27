export const getUserInitial = (fullName?: string | null): string => {
  return fullName ? fullName.charAt(0).toUpperCase() : "A";
};