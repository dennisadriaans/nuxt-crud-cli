import inquirer from 'inquirer';
import chalk from 'chalk';
import path from 'path';
import fs from 'fs';
import { generateController } from '../generators/controller.js';
import { generateRequest } from '../generators/request.js';
import { generateResourceFiles } from '../generators/resource.js';
import { capitalCase, pascalCase, snakeCase } from '../utils/string.js';
import { validateName } from '../utils/validate.js';

type ResourceType = 'controller' | 'request' | 'resource' | 'all';
type RequestType = 'Store' | 'GetAll' | 'GetOne' | 'Update' | 'Delete';

export async function generateResource() {
  try {
    // Find the API directory
    const apiDir = await findApiDirectory();
    if (!apiDir) {
      console.error(chalk.red('Could not find the API directory.'));
      console.log(
        chalk.yellow('Make sure you run this command in a Nuxt project with a server/api directory.')
      );
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
          { name: 'Request', value: 'request' },
          { name: 'Resource', value: 'resource' },
          { name: 'All (Controller, Handlers, Requests, Resources)', value: 'all' },
        ],
        default: 'all',
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
      }
    ]);

    const {
      name,
      resourceType,
      requestType,
      requestTypes = ['Store', 'GetAll', 'GetOne', 'Update', 'Delete'],
      version
    } = answers;

    // Format names
    const resourceName = name.toLowerCase();
    const resourcePascalName = pascalCase(resourceName);
    const resourceVersion = version.toLowerCase();

    // Set up directories
    const resourceDir = path.join(apiDir, resourceVersion, `${resourceName}s`);
    const requestsDir = path.join(resourceDir, 'requests');
    const resourcesDir = path.join(resourceDir, 'resources');

    // Create directories if they don't exist
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
      case 'request':
        await generateRequest(requestsDir, resourceName, resourcePascalName, requestType as RequestType);
        break;
      case 'resource':
        await generateResourceFiles(resourcesDir, resourceName, resourcePascalName);
        break;
      case 'all':
        // Generate all selected resources
        await generateController(resourceDir, resourceName, resourcePascalName);

        // Generate requests
        for (const requestType of requestTypes) {
          await generateRequest(requestsDir, resourceName, resourcePascalName, requestType as RequestType);
        }

        // Generate resources
        await generateResourceFiles(resourcesDir, resourceName, resourcePascalName);
        break;
    }

    console.log(chalk.green(`🎉 Successfully generated ${resourceType} for ${chalk.bold(resourcePascalName)}`));
  } catch (error) {
    console.error(chalk.red('Error generating resource:'), error);
    process.exit(1);
  }
}

/**
 * Find the API directory in the current project
 */
async function findApiDirectory(): Promise<string | null> {
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
