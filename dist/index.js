#!/usr/bin/env node
// @ts-check
import { Command } from 'commander';
import chalk from 'chalk';
import { generateResource } from './commands/generate.js';
const program = new Command();
// Set up CLI details
program
    .name('nuxt-crud')
    .description('CLI tool to generate API resources for Nuxt CRUD')
    .version('1.0.0');
// Register commands
program
    .command('generate')
    .description('Generate a new API resource')
    .action(generateResource);
// Handle unknown commands
program.on('command:*', () => {
    console.error(chalk.red(`Invalid command: ${program.args.join(' ')}`));
    console.log(`See ${chalk.blue('--help')} for a list of available commands.`);
    process.exit(1);
});
// Parse command line arguments
program.parse();
