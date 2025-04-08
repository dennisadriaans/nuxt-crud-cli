import fs from 'fs';
import path from 'path';
import { pluralize } from '../utils/string.js';

/**
 * Generate resource files (resource, collection, types)
 */
export async function generateResourceFiles(
  resourcesDir: string,
  resourceName: string,
  resourcePascalName: string
): Promise<void> {
  const pluralResourceName = pluralize(resourceName);
  
  // Generate Types.ts
  const typesPath = path.join(resourcesDir, 'Types.ts');
  const typesContent = `export interface ${resourcePascalName}Resource {
  id: number;
  name: string;
  // Add more properties as needed
}
`;
  fs.writeFileSync(typesPath, typesContent);

  // Generate Resource.ts
  const resourcePath = path.join(resourcesDir, `${resourcePascalName}Resource.ts`);
  const resourceContent = `import type { ${resourcePascalName}Resource } from "./Types";

export function Use${resourcePascalName}Resource(${resourceName}: ${resourcePascalName}Resource) {
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

  // Generate Collection.ts
  const collectionPath = path.join(resourcesDir, `${resourcePascalName}Collection.ts`);
  const collectionContent = `import { Use${resourcePascalName}Resource } from './${resourcePascalName}Resource';
import type { ${resourcePascalName}Resource } from './Types';

interface ${resourcePascalName}Collection {
  data: ${resourcePascalName}Resource[];
}

export function Use${resourcePascalName}Collection(collection: ${resourcePascalName}Collection) {
  const toArray = () => {
    return collection.data.map((${resourceName}) => Use${resourcePascalName}Resource(${resourceName}).toArray());
  };

  return {
    toArray,
  };
}`;
  fs.writeFileSync(collectionPath, collectionContent);
}