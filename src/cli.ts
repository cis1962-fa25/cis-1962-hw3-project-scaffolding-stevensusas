#!/usr/bin/env node
/* eslint-disable no-console */

import * as fs from 'fs';
import { parseArgs } from 'node:util';
import {
  validatePizzaOrThrow,
  VALID_TOPPINGS,
  INVALID_TOPPINGS,
} from './pizza';
import { ZodError } from 'zod';

function printUsage(): void {
  console.log(`
Usage: npm run validate <path-to-json-file>

Example:
  npm run validate pizzas/margherita.json

The JSON file should contain a pizza object with the following structure:
{
  "size": 14,
  "crust": "normal",
  "isDeepDish": false,
  "toppings": ["pepperoni", "mushrooms"]
}

Valid toppings: ${Array.from(VALID_TOPPINGS).join(', ')}

Invalid toppings (not allowed): ${Array.from(INVALID_TOPPINGS).join(', ')}
  `);
}

function formatZodError(error: ZodError): string {
  const errorMessages = error.errors.map((err) => {
    const path = err.path.join('.');
    return `  - ${path ? `${path}: ` : ''}${err.message}`;
  });

  return `Validation failed:\n${errorMessages.join('\n')}`;
}

function main(): void {
  const { values, positionals } = parseArgs({
    options: {
      help: {
        type: 'boolean',
        short: 'h',
        default: false,
      },
    },
    allowPositionals: true,
  });

  // Check for help flag
  if (values.help || positionals.length === 0) {
    printUsage();
    process.exit(values.help ? 0 : 1);
  }

  const filePath = positionals[0];

  if (!filePath) {
    console.error('Error: No file path provided');
    printUsage();
    process.exit(1);
  }

  // Check if file exists
  if (!fs.existsSync(filePath)) {
    console.error(`Error: File not found: ${filePath}`);
    process.exit(1);
  }

  // Read and parse JSON file
  let pizzaData: unknown;
  try {
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    pizzaData = JSON.parse(fileContent);
  } catch (error) {
    if (error instanceof SyntaxError) {
      console.error(`Error: Invalid JSON in file: ${filePath}`);
      console.error(error.message);
    } else {
      console.error(`Error reading file: ${filePath}`);
      console.error(error);
    }
    process.exit(1);
  }

  // Validate pizza
  try {
    const validPizza = validatePizzaOrThrow(pizzaData);
    console.log('✓ Valid pizza!');
    console.log('\nPizza details:');
    console.log(`  Size: ${validPizza.size}" diameter`);
    console.log(`  Crust: ${validPizza.crust}`);
    console.log(`  Deep Dish: ${validPizza.isDeepDish ? 'Yes' : 'No'}`);
    console.log(
      `  Toppings: ${validPizza.toppings && validPizza.toppings.length > 0 ? validPizza.toppings.join(', ') : 'None (cheese pizza)'}`
    );
    process.exit(0);
  } catch (error) {
    console.error('✗ Invalid pizza!');
    console.error();
    if (error instanceof ZodError) {
      console.error(formatZodError(error));
    } else {
      console.error('Unexpected error:', error);
    }
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

export { main };
