import { validatePizza, isValidPizza } from '../src/pizza';

describe('Pizza Validation', () => {
  describe('Valid pizzas (discriminated union)', () => {
    it('should validate a basic pizza with all required fields', () => {
      const pizza = {
        size: 14,
        crust: 'normal',
      };

      const result = validatePizza(pizza);
      expect(result.isPizza).toBe(true);

      if (result.isPizza) {
        expect(result.pizza.size).toBe(14);
        expect(result.pizza.crust).toBe('normal');
        expect(result.pizza.isDeepDish).toBe(false); // default value
        expect(result.pizza.toppings).toEqual([]); // default value
      }
    });

    it('should validate a pizza with deep dish', () => {
      const pizza = {
        size: 12,
        crust: 'stuffed',
        isDeepDish: true,
      };

      const result = validatePizza(pizza);
      expect(result.isPizza).toBe(true);

      if (result.isPizza) {
        expect(result.pizza.isDeepDish).toBe(true);
      }
    });

    it('should validate a pizza with valid toppings', () => {
      const pizza = {
        size: 16,
        crust: 'normal',
        toppings: ['pepperoni', 'mushrooms', 'onions'],
      };

      const result = validatePizza(pizza);
      expect(result.isPizza).toBe(true);

      if (result.isPizza) {
        expect(result.pizza.toppings).toEqual([
          'pepperoni',
          'mushrooms',
          'onions',
        ]);
      }
    });

    it('should validate a pizza with all optional fields', () => {
      const pizza = {
        size: 18,
        crust: 'stuffed',
        isDeepDish: true,
        toppings: ['pepperoni', 'sausage', 'extra cheese'],
      };

      const result = validatePizza(pizza);
      expect(result.isPizza).toBe(true);
    });

    it('should accept pineapple as a valid topping', () => {
      const pizza = {
        size: 14,
        crust: 'normal',
        toppings: ['pineapple', 'ham'],
      };

      const result = validatePizza(pizza);
      expect(result.isPizza).toBe(true);
    });
  });

  describe('Invalid pizzas (discriminated union)', () => {
    it('should reject pizza with invalid size (too small)', () => {
      const pizza = {
        size: 4,
        crust: 'normal',
      };

      const result = validatePizza(pizza);
      expect(result.isPizza).toBe(false);

      if (!result.isPizza) {
        expect(result.errors.length).toBeGreaterThan(0);
        expect(result.errors.some((e) => e.includes('size'))).toBe(true);
      }
    });

    it('should reject pizza with invalid size (too large)', () => {
      const pizza = {
        size: 50,
        crust: 'normal',
      };

      const result = validatePizza(pizza);
      expect(result.isPizza).toBe(false);

      if (!result.isPizza) {
        expect(result.errors.length).toBeGreaterThan(0);
      }
    });

    it('should reject pizza with negative size', () => {
      const pizza = {
        size: -10,
        crust: 'normal',
      };

      const result = validatePizza(pizza);
      expect(result.isPizza).toBe(false);
    });

    it('should reject pizza with invalid crust type', () => {
      const pizza = {
        size: 14,
        crust: 'thin',
      };

      const result = validatePizza(pizza);
      expect(result.isPizza).toBe(false);

      if (!result.isPizza) {
        expect(result.errors.some((e) => e.includes('crust'))).toBe(true);
      }
    });

    it('should reject pizza with invalid topping: chocolate', () => {
      const pizza = {
        size: 14,
        crust: 'normal',
        toppings: ['pepperoni', 'chocolate'],
      };

      const result = validatePizza(pizza);
      expect(result.isPizza).toBe(false);

      if (!result.isPizza) {
        expect(result.errors.some((e) => e.includes('chocolate'))).toBe(true);
      }
    });

    it('should reject pizza with invalid topping: gummy bears', () => {
      const pizza = {
        size: 14,
        crust: 'normal',
        toppings: ['gummy bears'],
      };

      const result = validatePizza(pizza);
      expect(result.isPizza).toBe(false);
    });

    it('should reject pizza with invalid topping: pickles', () => {
      const pizza = {
        size: 14,
        crust: 'normal',
        toppings: ['pickles'],
      };

      const result = validatePizza(pizza);
      expect(result.isPizza).toBe(false);
    });

    it('should reject pizza with invalid topping: marshmallows', () => {
      const pizza = {
        size: 14,
        crust: 'normal',
        toppings: ['marshmallows'],
      };

      const result = validatePizza(pizza);
      expect(result.isPizza).toBe(false);
    });

    it('should reject pizza with unknown topping', () => {
      const pizza = {
        size: 14,
        crust: 'normal',
        toppings: ['pepperoni', 'unicorn'],
      };

      const result = validatePizza(pizza);
      expect(result.isPizza).toBe(false);
    });

    it('should reject pizza missing size field', () => {
      const pizza = {
        crust: 'normal',
      };

      const result = validatePizza(pizza);
      expect(result.isPizza).toBe(false);
    });

    it('should reject pizza missing crust field', () => {
      const pizza = {
        size: 14,
      };

      const result = validatePizza(pizza);
      expect(result.isPizza).toBe(false);
    });
  });

  describe('isValidPizza helper', () => {
    it('should return true for valid pizza', () => {
      const pizza = {
        size: 14,
        crust: 'normal',
        toppings: ['pepperoni'],
      };

      expect(isValidPizza(pizza)).toBe(true);
    });

    it('should return false for invalid pizza', () => {
      const pizza = {
        size: 14,
        crust: 'crispy',
        toppings: ['chocolate'],
      };

      expect(isValidPizza(pizza)).toBe(false);
    });
  });

  describe('Default values', () => {
    it('should default isDeepDish to false when not provided', () => {
      const pizza = {
        size: 14,
        crust: 'normal',
      };

      const result = validatePizza(pizza);
      expect(result.isPizza).toBe(true);

      if (result.isPizza) {
        expect(result.pizza.isDeepDish).toBe(false);
      }
    });

    it('should default toppings to empty array when not provided', () => {
      const pizza = {
        size: 14,
        crust: 'normal',
      };

      const result = validatePizza(pizza);
      expect(result.isPizza).toBe(true);

      if (result.isPizza) {
        expect(result.pizza.toppings).toEqual([]);
      }
    });
  });

  describe('Discriminated union usage example', () => {
    it('should work with discriminated union pattern (valid)', () => {
      const result = validatePizza({
        size: 14,
        crust: 'normal',
        toppings: ['pepperoni'],
      });

      // TypeScript should know the type based on isPizza
      if (result.isPizza) {
        expect(result.pizza.crust).toBe('normal');
      } else {
        expect(result.errors).toBeDefined();
      }
    });

    it('should work with discriminated union pattern (invalid)', () => {
      const result = validatePizza({ hehehehaw: true });

      // TypeScript should know the type based on isPizza
      if (result.isPizza) {
        // This branch won't execute, but TypeScript knows result.pizza exists here
        expect(result.pizza.crust).toBeDefined();
      } else {
        expect(result.errors.length).toBeGreaterThan(0);
      }
    });
  });
});

