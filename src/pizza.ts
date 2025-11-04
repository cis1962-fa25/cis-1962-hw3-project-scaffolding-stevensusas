import { z } from 'zod';

// Define invalid toppings that should never go on pizza
const INVALID_TOPPINGS = [
  'chocolate',
  'gummy bears',
  'pickles',
  'marshmallows',
] as const;

// Define valid toppings
const VALID_TOPPINGS = [
  'pepperoni',
  'mushrooms',
  'onions',
  'sausage',
  'bacon',
  'extra cheese',
  'black olives',
  'green peppers',
  'pineapple',
  'spinach',
  'tomatoes',
  'ham',
  'chicken',
  'jalapeños',
  'basil',
  'garlic',
  'artichoke',
  'anchovies',
  'buffalo chicken',
  'bbq chicken',
] as const;

// Zod schema for pizza validation
export const PizzaSchema = z.object({
  size: z
    .number()
    .positive('Size must be a positive number')
    .min(6, 'Pizza must be at least 6 inches in diameter')
    .max(30, 'Pizza cannot be larger than 30 inches in diameter'),
  crust: z.enum(['stuffed', 'normal'], {
    errorMap: () => ({ message: 'Crust must be either "stuffed" or "normal"' }),
  }),
  isDeepDish: z.boolean().optional().default(false),
  toppings: z
    .array(
      z.string().refine(
        (topping) => {
          const lowerTopping = topping.toLowerCase();
          // Check if it's an invalid topping
          if (INVALID_TOPPINGS.some((invalid) => invalid === lowerTopping)) {
            return false;
          }
          // Check if it's a valid topping
          return VALID_TOPPINGS.some((valid) => valid === lowerTopping);
        },
        (topping) => ({
          message: `"${topping}" is not a valid pizza topping`,
        })
      )
    )
    .optional()
    .default([]),
});

export type Pizza = z.infer<typeof PizzaSchema>;

// Discriminated union return type
export type PizzaValidationSuccess = {
  isPizza: true;
  pizza: Pizza;
};

export type PizzaValidationFailure = {
  isPizza: false;
  errors: string[];
};

export type PizzaValidationResult =
  | PizzaValidationSuccess
  | PizzaValidationFailure;

// Main validation function that returns discriminated union
export function validatePizza(data: unknown): PizzaValidationResult {
  const result = PizzaSchema.safeParse(data);

  if (result.success) {
    return {
      isPizza: true,
      pizza: result.data,
    };
  } else {
    return {
      isPizza: false,
      errors: result.error.errors.map((err) => {
        const path = err.path.length > 0 ? `${err.path.join('.')}: ` : '';
        return `${path}${err.message}`;
      }),
    };
  }
}

// Helper function for simple boolean check
export function isValidPizza(data: unknown): boolean {
  return PizzaSchema.safeParse(data).success;
}

// Helper function that throws (for backward compatibility with CLI)
export function validatePizzaOrThrow(data: unknown): Pizza {
  return PizzaSchema.parse(data);
}

export { VALID_TOPPINGS, INVALID_TOPPINGS };
