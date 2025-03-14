import inquirer from 'inquirer';
import chalk from 'chalk';
import path from 'path';
import fs from 'fs';
import { generateController } from '../generators/controller.js';
import { generateHandler } from '../generators/handler.js';
import { generateRequest } from '../generators/request.js';
import { generateResourceFiles } from '../generators/resource.js';
import { pascalCase } from '../utils/string.js';
import { validateName } from '../utils/validate.js';
export async function generateResource() {
    try {
        // Find the API directory
        const apiDir = await findApiDirectory();
        if (!apiDir) {
            console.error(chalk.red('Could not find the API directory.'));
            console.log(chalk.yellow('Make sure you run this command in a Nuxt project with a server/api directory.'));
            process.exit(1);
        }
        // Get inputs from user
        const answers = await inquirer.prompt([
            {
                type: 'input',
                name: 'name',
                message: 'What is the name of the resource? (singular, e.g. "post")',
                validate: validateName,
            },
            {
                type: 'list',
                name: 'resourceType',
                message: 'What do you want to generate?',
                choices: [
                    { name: 'Controller', value: 'controller' },
                    { name: 'Handler', value: 'handler' },
                    { name: 'Request', value: 'request' },
                    { name: 'Resource', value: 'resource' },
                    { name: 'All (Controller, Handlers, Requests, Resources)', value: 'all' },
                ],
                default: 'all',
            },
            {
                type: 'list',
                name: 'handlerType',
                message: 'What type of handler do you want to generate?',
                choices: [
                    { name: 'Create', value: 'create' },
                    { name: 'Get All', value: 'getAll' },
                    { name: 'Get One', value: 'getOne' },
                    { name: 'Update', value: 'update' },
                    { name: 'Delete', value: 'delete' },
                ],
                when: (answers) => answers.resourceType === 'handler',
            },
            {
                type: 'checkbox',
                name: 'handlerTypes',
                message: 'Which handlers do you want to generate?',
                choices: [
                    { name: 'Create', value: 'create', checked: true },
                    { name: 'Get All', value: 'getAll', checked: true },
                    { name: 'Get One', value: 'getOne', checked: true },
                    { name: 'Update', value: 'update', checked: true },
                    { name: 'Delete', value: 'delete', checked: true },
                ],
                when: (answers) => answers.resourceType === 'all',
            },
            {
                type: 'list',
                name: 'requestType',
                message: 'What type of request do you want to generate?',
                choices: [
                    { name: 'Store', value: 'Store' },
                    { name: 'Get All', value: 'GetAll' },
                    { name: 'Get One', value: 'GetOne' },
                    { name: 'Update', value: 'Update' },
                    { name: 'Delete', value: 'Delete' },
                ],
                when: (answers) => answers.resourceType === 'request',
            },
            {
                type: 'checkbox',
                name: 'requestTypes',
                message: 'Which requests do you want to generate?',
                choices: [
                    { name: 'Store', value: 'Store', checked: true },
                    { name: 'Get All', value: 'GetAll', checked: true },
                    { name: 'Get One', value: 'GetOne', checked: true },
                    { name: 'Update', value: 'Update', checked: true },
                    { name: 'Delete', value: 'Delete', checked: true },
                ],
                when: (answers) => answers.resourceType === 'all',
            },
            {
                type: 'input',
                name: 'version',
                message: 'API version (e.g. "v1")?',
                default: 'v1',
            },
            {
                type: 'confirm',
                name: 'createRouteFiles',
                message: 'Do you want to create route files (index.ts and [id].ts)?',
                default: true,
                when: (answers) => answers.resourceType === 'all',
            }
        ]);
        const { name, resourceType, handlerType, handlerTypes = ['create', 'getAll', 'getOne', 'update', 'delete'], requestType, requestTypes = ['Store', 'GetAll', 'GetOne', 'Update', 'Delete'], version, createRouteFiles = false, } = answers;
        // Format names
        const resourceName = name.toLowerCase();
        const resourcePascalName = pascalCase(resourceName);
        const resourceVersion = version.toLowerCase();
        // Set up directories
        const resourceDir = path.join(apiDir, resourceVersion, `${resourceName}s`);
        const handlersDir = path.join(resourceDir, 'handlers');
        const requestsDir = path.join(resourceDir, 'requests');
        const resourcesDir = path.join(resourceDir, 'resources');
        // Create directories if they don't exist
        if (resourceType === 'all' || resourceType === 'handler') {
            fs.mkdirSync(handlersDir, { recursive: true });
        }
        if (resourceType === 'all' || resourceType === 'request') {
            fs.mkdirSync(requestsDir, { recursive: true });
        }
        if (resourceType === 'all' || resourceType === 'resource') {
            fs.mkdirSync(resourcesDir, { recursive: true });
        }
        // Generate files based on user selection
        switch (resourceType) {
            case 'controller':
                await generateController(resourceDir, resourceName, resourcePascalName);
                break;
            case 'handler':
                await generateHandler(handlersDir, resourceName, resourcePascalName, handlerType);
                break;
            case 'request':
                await generateRequest(requestsDir, resourceName, resourcePascalName, requestType);
                break;
            case 'resource':
                await generateResourceFiles(resourcesDir, resourceName, resourcePascalName);
                break;
            case 'all':
                // Generate all selected resources
                await generateController(resourceDir, resourceName, resourcePascalName);
                // Generate handlers
                for (const handlerType of handlerTypes) {
                    await generateHandler(handlersDir, resourceName, resourcePascalName, handlerType);
                }
                // Generate requests
                for (const requestType of requestTypes) {
                    await generateRequest(requestsDir, resourceName, resourcePascalName, requestType);
                }
                // Generate resources
                await generateResourceFiles(resourcesDir, resourceName, resourcePascalName);
                // Generate route files if requested
                if (createRouteFiles) {
                    await generateRouteFiles(resourceDir, resourceName);
                }
                break;
        }
        console.log(chalk.green(`🎉 Successfully generated ${resourceType} for ${chalk.bold(resourcePascalName)}`));
    }
    catch (error) {
        console.error(chalk.red('Error generating resource:'), error);
        process.exit(1);
    }
}
/**
 * Find the API directory in the current project
 */
async function findApiDirectory() {
    // Try common API directory locations
    const possibleLocations = [
        path.join(process.cwd(), 'server', 'api'),
        path.join(process.cwd(), 'api'),
    ];
    for (const location of possibleLocations) {
        if (fs.existsSync(location)) {
            return location;
        }
    }
    return null;
}
/**
 * Generate route files (index.ts and [id].ts)
 */
async function generateRouteFiles(resourceDir, resourceName) {
    // Generate index.ts
    const indexContent = `import getAllHandler from './handlers/getAll';
import createHandler from './handlers/create';

export default defineEventHandler(async (event) => {
  // Route to the appropriate handler based on HTTP method
  if (isMethod(event, "GET")) {
    return getAllHandler(event);
  } else if (isMethod(event, "POST")) {
    return createHandler(event);
  } else {
    throw createError({
      statusCode: 405,
      message: 'Method not allowed'
    });
  }
});`;
    // Generate [id].ts
    const idContent = `import getOneHandler from './handlers/getOne';
import updateHandler from './handlers/update';
import deleteHandler from './handlers/delete';

export default defineEventHandler(async (event) => {
  // Route to the appropriate handler based on HTTP method
  if (isMethod(event, "GET")) {
    return getOneHandler(event);
  } else if (isMethod(event, "PUT")) {
    return updateHandler(event);
  } else if (isMethod(event, "DELETE")) {
    return deleteHandler(event);
  } else {
    throw createError({
      statusCode: 405,
      message: 'Method not allowed'
    });
  }
});`;
    // Write the files
    fs.writeFileSync(path.join(resourceDir, 'index.ts'), indexContent);
    fs.writeFileSync(path.join(resourceDir, '[id].ts'), idContent);
}
