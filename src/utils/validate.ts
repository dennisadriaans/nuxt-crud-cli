/**
 * Validate a resource name
 */
export function validateName(input: string): boolean | string {
  if (!input) {
    return 'Name is required';
  }
  
  if (input.length < 2) {
    return 'Name must be at least 2 characters long';
  }
  
  if (!/^[a-zA-Z][a-zA-Z0-9_]*$/.test(input)) {
    return 'Name must start with a letter and contain only letters, numbers, and underscores';
  }
  
  return true;
}