import fs from 'fs';
import path from 'path';
import { pluralize, pascalCase } from '../utils/string.js';

type HandlerType = 'create' | 'getAll' | 'getOne' | 'update' | 'delete';

/**
 * Generate handler file
 */
export async function generateHandler(
  handlersDir: string,
  resourceName: string,
  resourcePascalName: string,
  handlerType: HandlerType
): Promise<void> {
  const pluralResourceName = pluralize(resourceName);
  const handlerPath = path.join(handlersDir, `${handlerType}.ts`);
  let handlerContent = '';

  switch (handlerType) {
    case 'create':
      handlerContent = generateCreateHandler(resourceName, resourcePascalName);
      break;
    case 'getAll':
      handlerContent = generateGetAllHandler(resourceName, resourcePascalName);
      break;
    case 'getOne':
      handlerContent = generateGetOneHandler(resourceName, resourcePascalName);
      break;
    case 'update':
      handlerContent = generateUpdateHandler(resourceName, resourcePascalName);
      break;
    case 'delete':
      handlerContent = generateDeleteHandler(resourceName, resourcePascalName);
      break;
  }

  fs.writeFileSync(handlerPath, handlerContent);
}

/**
 * Generate create handler
 */
function generateCreateHandler(resourceName: string, resourcePascalName: string): string {
  return `import type { H3Event } from 'h3';
import { use${resourcePascalName}Controller } from "../${resourcePascalName}Controller";
import { Store${resourcePascalName}Request } from "../requests/Store${resourcePascalName}Request";

/**
 * Handler for POST /api/v1/${pluralize(resourceName)}
 * Creates a new ${resourceName}
 */
export default async (event: H3Event) => {
  // Validate request data
  const validatedData = await Store${resourcePascalName}Request.validate(event);
  
  // Call the controller with validated data
  const { store } = use${resourcePascalName}Controller();
  return await store(validatedData);
};
`;
}

/**
 * Generate getAll handler
 */
function generateGetAllHandler(resourceName: string, resourcePascalName: string): string {
  return `import type { H3Event } from 'h3';
import { use${resourcePascalName}Controller } from "../${resourcePascalName}Controller";
import { GetAll${resourcePascalName}sRequest } from "../requests/GetAll${resourcePascalName}sRequest";

/**
 * Handler for GET /api/v1/${pluralize(resourceName)}
 * Returns all ${pluralize(resourceName)}
 */
export default async (event: H3Event) => {
  // Get query parameters
  const params = getQuery(event);
  
  // Validate request data (optional filters)
  const validatedParams = await GetAll${resourcePascalName}sRequest.validate(event);
  
  // Call the controller
  const { index } = use${resourcePascalName}Controller();
  return await index(validatedParams);
};
`;
}

/**
 * Generate getOne handler
 */
function generateGetOneHandler(resourceName: string, resourcePascalName: string): string {
  return `import type { H3Event } from 'h3';
import { use${resourcePascalName}Controller } from "../${resourcePascalName}Controller";
import { GetOne${resourcePascalName}Request } from "../requests/GetOne${resourcePascalName}Request";

/**
 * Handler for GET /api/v1/${pluralize(resourceName)}/:id
 * Returns a single ${resourceName} by ID
 */
export default async (event: H3Event) => {
  // Get the ID from the route params
  const id = event.context.params?.id;
  
  if (!id) {
    throw createError({
      statusCode: 400,
      message: 'ID parameter is required'
    });
  }
  
  // Validate ID
  await GetOne${resourcePascalName}Request.validate(event);
  
  // Call the controller
  const { show } = use${resourcePascalName}Controller();
  return await show(id);
};
`;
}

/**
 * Generate update handler
 */
function generateUpdateHandler(resourceName: string, resourcePascalName: string): string {
  return `import type { H3Event } from 'h3';
import { use${resourcePascalName}Controller } from "../${resourcePascalName}Controller";
import { Update${resourcePascalName}Request } from "../requests/Update${resourcePascalName}Request";

/**
 * Handler for PUT /api/v1/${pluralize(resourceName)}/:id
 * Updates a ${resourceName} by ID
 */
export default async (event: H3Event) => {
  // Get the ID from the route params
  const id = event.context.params?.id;
  
  if (!id) {
    throw createError({
      statusCode: 400,
      message: 'ID parameter is required'
    });
  }
  
  // Validate request data
  const validatedData = await Update${resourcePascalName}Request.validate(event);
  
  // Call the controller
  const { update } = use${resourcePascalName}Controller();
  return await update(id, validatedData);
};
`;
}

/**
 * Generate delete handler
 */
function generateDeleteHandler(resourceName: string, resourcePascalName: string): string {
  return `import type { H3Event } from 'h3';
import { use${resourcePascalName}Controller } from "../${resourcePascalName}Controller";
import { Delete${resourcePascalName}Request } from "../requests/Delete${resourcePascalName}Request";

/**
 * Handler for DELETE /api/v1/${pluralize(resourceName)}/:id
 * Deletes a ${resourceName} by ID
 */
export default async (event: H3Event) => {
  // Get the ID from the route params
  const id = event.context.params?.id;
  
  if (!id) {
    throw createError({
      statusCode: 400,
      message: 'ID parameter is required'
    });
  }
  
  // Validate ID
  await Delete${resourcePascalName}Request.validate(event);
  
  // Call the controller
  const { destroy } = use${resourcePascalName}Controller();
  return await destroy(id);
};
`;
}