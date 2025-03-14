import fs from 'fs';
import path from 'path';
import { pluralize } from '../utils/string.js';
/**
 * Generate resource files (resource, collection, types)
 */
export async function generateResourceFiles(resourcesDir, resourceName, resourcePascalName) {
    const pluralResourceName = pluralize(resourceName);
    // Generate types.ts
    const typesPath = path.join(resourcesDir, 'types.ts');
    const typesContent = `export interface ${resourcePascalName}ResourceProps {
  id: number;
  name: string;
  // Add more properties as needed
}
`;
    fs.writeFileSync(typesPath, typesContent);
    // Generate resource.ts
    const resourcePath = path.join(resourcesDir, `${resourceName}Resource.ts`);
    const resourceContent = `import type { ${resourcePascalName}ResourceProps } from "./types";

export function use${resourcePascalName}Resource(${resourceName}: ${resourcePascalName}ResourceProps) {
  const toArray = () => {
    return {
      id: ${resourceName}.id,
      name: ${resourceName}.name,
      // Add more properties as needed
    };
  };

  return {
    toArray,
  };
}`;
    fs.writeFileSync(resourcePath, resourceContent);
    // Generate collection.ts
    const collectionPath = path.join(resourcesDir, `${resourceName}Collection.ts`);
    const collectionContent = `import { use${resourcePascalName}Resource } from './${resourceName}Resource';
import type { ${resourcePascalName}ResourceProps } from './types';

interface ${resourcePascalName}CollectionProps {
  data: ${resourcePascalName}ResourceProps[];
}

export function use${resourcePascalName}Collection(collection: ${resourcePascalName}CollectionProps) {
  const toArray = () => {
    return collection.data.map((${resourceName}) => use${resourcePascalName}Resource(${resourceName}).toArray());
  };

  return {
    toArray,
  };
}`;
    fs.writeFileSync(collectionPath, collectionContent);
}
