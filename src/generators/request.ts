import fs from 'fs';
import path from 'path';
import { pluralize } from '../utils/string.js';

type RequestType = 'Store' | 'GetAll' | 'GetOne' | 'Update' | 'Delete';

/**
 * Generate request validator file
 */
export async function generateRequest(
  requestsDir: string,
  resourceName: string,
  resourcePascalName: string,
  requestType: RequestType
): Promise<void> {
  const pluralResourceName = pluralize(resourceName);
  const pluralPascalName = pluralize(resourcePascalName);
  let requestFileName = '';
  let requestContent = '';

  switch (requestType) {
    case 'Store':
      requestFileName = `Store${resourcePascalName}Request.ts`;
      requestContent = generateStoreRequest(resourceName, resourcePascalName);
      break;
    case 'GetAll':
      requestFileName = `GetAll${pluralPascalName}Request.ts`;
      requestContent = generateGetAllRequest(resourceName, resourcePascalName);
      break;
    case 'GetOne':
      requestFileName = `GetOne${resourcePascalName}Request.ts`;
      requestContent = generateGetOneRequest(resourceName, resourcePascalName);
      break;
    case 'Update':
      requestFileName = `Update${resourcePascalName}Request.ts`;
      requestContent = generateUpdateRequest(resourceName, resourcePascalName);
      break;
    case 'Delete':
      requestFileName = `Delete${resourcePascalName}Request.ts`;
      requestContent = generateDeleteRequest(resourceName, resourcePascalName);
      break;
  }

  const requestPath = path.join(requestsDir, requestFileName);
  fs.writeFileSync(requestPath, requestContent);
}

/**
 * Generate store request
 */
function generateStoreRequest(resourceName: string, resourcePascalName: string): string {
  return `import { defineRequestValidator } from "~~/server/utils/validation";
import { z } from 'zod';

// Define the schema type with Zod
const ${resourceName}Schema = z.object({
  name: z.string().min(3).max(100),
  // Add more fields as needed
});

// Infer the TypeScript type from the schema
type ${resourcePascalName}CreateData = z.infer<typeof ${resourceName}Schema>;

export const Store${resourcePascalName}Request = defineRequestValidator({
  schema: ${resourceName}Schema,
  validate(data: ${resourcePascalName}CreateData) {
    // Additional custom validation logic can be added here
    return data;
  }
});
`;
}

/**
 * Generate getAll request
 */
function generateGetAllRequest(resourceName: string, resourcePascalName: string): string {
  const pluralPascalName = pluralize(resourcePascalName);

  return `import { defineRequestValidator } from "~~/server/utils/validation";
import { z } from 'zod';

// Define the schema type with Zod
const ${resourceName}FilterSchema = z.object({
  search: z.string().optional(),
  page: z.coerce.number().optional(),
  limit: z.coerce.number().optional(),
  sort: z.string().optional(),
  // Add more filter fields as needed
});

// Infer the TypeScript type from the schema
type ${resourcePascalName}FilterData = z.infer<typeof ${resourceName}FilterSchema>;

export const GetAll${pluralPascalName}Request = defineRequestValidator({
  schema: ${resourceName}FilterSchema,
  validate(data: ${resourcePascalName}FilterData) {
    // Additional custom validation logic can be added here
    return data;
  }
});
`;
}

/**
 * Generate getOne request
 */
function generateGetOneRequest(resourceName: string, resourcePascalName: string): string {
  return `import { defineRequestValidator } from "~~/server/utils/validation";
import { z } from 'zod';

// Define the schema type with Zod
const ${resourceName}ParamSchema = z.object({
  id: z.string().refine((val) => !isNaN(parseInt(val)), {
    message: "ID must be a valid number",
  }),
});

// Infer the TypeScript type from the schema
type ${resourcePascalName}ParamData = z.infer<typeof ${resourceName}ParamSchema>;

export const GetOne${resourcePascalName}Request = defineRequestValidator({
  schema: ${resourceName}ParamSchema,
  validate(data: ${resourcePascalName}ParamData) {
    // Additional custom validation logic can be added here
    return data;
  }
});
`;
}

/**
 * Generate update request
 */
function generateUpdateRequest(resourceName: string, resourcePascalName: string): string {
  return `import { defineRequestValidator } from "~~/server/utils/validation";
import { z } from 'zod';

// Define the schema type with Zod
const ${resourceName}UpdateSchema = z.object({
  name: z.string().min(3).max(100).optional(),
  // Add more fields as needed
}).refine(data => Object.keys(data).length > 0, {
  message: "At least one field must be provided for update"
});

// Infer the TypeScript type from the schema
type ${resourcePascalName}UpdateData = z.infer<typeof ${resourceName}UpdateSchema>;

export const Update${resourcePascalName}Request = defineRequestValidator({
  schema: ${resourceName}UpdateSchema,
  validate(data: ${resourcePascalName}UpdateData) {
    // Additional custom validation logic can be added here
    return data;
  }
});
`;
}

/**
 * Generate delete request
 */
function generateDeleteRequest(resourceName: string, resourcePascalName: string): string {
  return `import { defineRequestValidator } from "~~/server/utils/validation";
import { z } from 'zod';

// Define the schema type with Zod
const ${resourceName}ParamSchema = z.object({
  id: z.string().refine((val) => !isNaN(parseInt(val)), {
    message: "ID must be a valid number",
  }),
});

// Infer the TypeScript type from the schema
type ${resourcePascalName}ParamData = z.infer<typeof ${resourceName}ParamSchema>;

export const Delete${resourcePascalName}Request = defineRequestValidator({
  schema: ${resourceName}ParamSchema,
  validate(data: ${resourcePascalName}ParamData) {
    // Additional custom validation logic can be added here
    return data;
  }
});
`;
}