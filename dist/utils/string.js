/**
 * Convert a string to PascalCase
 */
export function pascalCase(str) {
    return str
        .split(/[-_\s]+/)
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join('');
}
/**
 * Convert a string to camelCase
 */
export function camelCase(str) {
    const pascal = pascalCase(str);
    return pascal.charAt(0).toLowerCase() + pascal.slice(1);
}
/**
 * Convert a string to snake_case
 */
export function snakeCase(str) {
    return str
        .replace(/([a-z])([A-Z])/g, '$1_$2')
        .replace(/[\s-]+/g, '_')
        .toLowerCase();
}
/**
 * Convert a string to Capital Case (Title Case)
 */
export function capitalCase(str) {
    return str
        .split(/[-_\s]+/)
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(' ');
}
/**
 * Pluralize a word (very basic implementation)
 */
export function pluralize(str) {
    if (str.endsWith('y')) {
        return str.slice(0, -1) + 'ies';
    }
    if (str.endsWith('s') || str.endsWith('x') || str.endsWith('z') ||
        str.endsWith('ch') || str.endsWith('sh')) {
        return str + 'es';
    }
    return str + 's';
}
