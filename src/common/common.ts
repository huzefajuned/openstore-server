export function validateIndianPhoneNumber(phoneNumber: string): boolean {
  // Regex for Indian phone numbers with or without country code
  const pattern = /^\+91[789]\d{9}$|^[789]\d{9}$/;

  return pattern.test(phoneNumber);
}
