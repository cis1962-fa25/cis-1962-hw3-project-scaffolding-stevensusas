[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-22041afd0340ce965d47ae6ef1cefeee28c7c493a6346c4f15d667ab976d596c.svg)](https://classroom.github.com/a/x6X7wJcH)

# Pizza Validator

A TypeScript library and CLI tool for validating pizza objects using Zod schema validation. This package exports a function that takes an unknown parameter and validates whether it represents a valid pizza, returning a discriminated union type for type-safe error handling.

## Installation

### As a Dependency

Install in your project from the local directory:

```bash
npm install ../cis-1962-hw3-project-scaffolding-stevensusas
```

### For Development

Clone the repository and install dependencies:

```bash
npm install
```

## Usage as a Dependency

The main export is `validatePizza`, which takes an unknown value and returns a discriminated union indicating whether the value is a valid pizza.

### Basic Example

```typescript
import { validatePizza } from 'pizza-validator-cli';

const result = validatePizza({ hehehehaw: true });

// TypeScript discriminated union - no errors below!
if (result.isPizza) {
  console.log(result.pizza.crust);
} else {
  console.log(result.errors);
}
```

### Validating a Valid Pizza

```typescript
import { validatePizza } from 'pizza-validator-cli';

const pizzaData = {
  size: 14,
  crust: 'normal',
  isDeepDish: false,
  toppings: ['pepperoni', 'mushrooms']
};

const result = validatePizza(pizzaData);

if (result.isPizza) {
  console.log('Valid pizza!');
  console.log(`Size: ${result.pizza.size}" diameter`);
  console.log(`Crust: ${result.pizza.crust}`);
  console.log(`Toppings: ${result.pizza.toppings.join(', ')}`);
} else {
  console.log('Invalid pizza:', result.errors);
}
```

### Handling Validation Errors

```typescript
import { validatePizza } from 'pizza-validator-cli';

const invalidPizza = {
  size: 100,  // Too large
  crust: 'thin',  // Invalid crust type
  toppings: ['chocolate']  // Not allowed
};

const result = validatePizza(invalidPizza);

if (!result.isPizza) {
  console.log('Validation failed:');
  result.errors.forEach(error => console.log(`  - ${error}`));
}
```

### TypeScript Types

The package exports the following types:

```typescript
import type {
  Pizza,
  PizzaValidationResult,
  PizzaValidationSuccess,
  PizzaValidationFailure
} from 'pizza-validator-cli';

// PizzaValidationResult is a discriminated union:
// { isPizza: true; pizza: Pizza } | { isPizza: false; errors: string[] }
```

## CLI Usage

The package can be run as a command-line tool to validate pizza JSON files.

### Installation as Global Binary

Install the package globally:

```bash
npm install --global .
```

Then run it from anywhere:

```bash
pizza-validator test-pizza.json
```

### Running Without Global Install

During development, use the npm script:

```bash
npm run validate <path-to-json-file>
```

### Examples

Validate a pizza JSON file:

```bash
npm run validate pizzas/valid-pepperoni.json
```

Output for a valid pizza:

```
✓ Valid pizza!

Pizza details:
  Size: 14" diameter
  Crust: normal
  Deep Dish: No
  Toppings: pepperoni
```

Output for an invalid pizza:

```bash
npm run validate pizzas/invalid-chocolate.json
```

```
✗ Invalid pizza!

Validation failed:
  - toppings.1: "chocolate" is not a valid pizza topping
```

Get help:

```bash
npm run validate -- --help
```

### Error Handling

The CLI reports errors for:

- Files that don't exist
- Invalid JSON syntax
- Validation failures with specific reasons

Example with a non-existent file:

```bash
npm run validate nonexistent.json
# Error: File not found: nonexistent.json
```

## Pizza Validation Rules

A valid pizza must have the following properties:

### Required Fields

- **size** (number): Diameter in inches, must be between 6 and 30
- **crust** (string): Must be either "stuffed" or "normal"

### Optional Fields

- **isDeepDish** (boolean): Whether the pizza is deep dish. Defaults to `false`
- **toppings** (array of strings): List of pizza toppings. Defaults to empty array

### Valid Toppings

The following toppings are allowed:

- pepperoni, mushrooms, onions, sausage, bacon, extra cheese, black olives, green peppers, pineapple, spinach, tomatoes, ham, chicken, jalapeños, basil, garlic, artichoke, anchovies, buffalo chicken, bbq chicken

### Invalid Toppings

The following toppings will cause validation to fail:

- chocolate, gummy bears, pickles, marshmallows

### Example Valid Pizza JSON

```json
{
  "size": 14,
  "crust": "normal",
  "isDeepDish": false,
  "toppings": ["pepperoni", "mushrooms", "extra cheese"]
}
```

## Development

### Available Scripts

- `npm run build` - Compile TypeScript to JavaScript in the `dist/` directory
- `npm test` - Run the test suite with Jest
- `npm run test:watch` - Run tests in watch mode
- `npm run test:coverage` - Generate test coverage report
- `npm run lint` - Check code for linting errors
- `npm run lint:fix` - Automatically fix linting errors
- `npm run format` - Format code with Prettier
- `npm run type-check` - Run TypeScript type checking

### Running Tests

```bash
npm test
```

The test suite includes:
- Valid pizza test cases
- Invalid pizza test cases (size, crust, toppings)
- Edge cases (missing fields, default values)
- Discriminated union type tests

### Building the Project

```bash
npm run build
```

This compiles TypeScript files from `src/` to JavaScript in `dist/`.

### Code Quality

Run linting and formatting:

```bash
npm run lint
npm run format
```

## License

ISC
