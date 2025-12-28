import { describe, it, expect } from 'vitest';
import groupBy from './group-by';

describe('groupBy', () => {
  it('groups objects by string key', () => {
    const data = [
      { id: 1, type: 'fruit', name: 'apple' },
      { id: 2, type: 'vegetable', name: 'carrot' },
      { id: 3, type: 'fruit', name: 'banana' }
    ];

    const result = groupBy(data, (item) => item.type);

    expect(result).toEqual({
      fruit: [
        { id: 1, type: 'fruit', name: 'apple' },
        { id: 3, type: 'fruit', name: 'banana' }
      ],
      vegetable: [
        { id: 2, type: 'vegetable', name: 'carrot' }
      ]
    });
  });

  it('groups numbers by parity', () => {
    const numbers = [1, 2, 3, 4, 5];
    const result = groupBy(numbers, (n) => (n % 2 === 0 ? 'even' : 'odd'));

    expect(result).toEqual({
      odd: [1, 3, 5],
      even: [2, 4]
    });
  });

  it('returns empty object when input array is empty', () => {
    const result = groupBy([], (x) => x);

    expect(result).toEqual({});
  });

  it('groups by number key', () => {
    const data = [
      { id: 1, category: 10 },
      { id: 2, category: 20 },
      { id: 3, category: 10 }
    ];

    const result = groupBy(data, (item) => item.category);

    expect(result).toEqual({
      10: [
        { id: 1, category: 10 },
        { id: 3, category: 10 }
      ],
      20: [
        { id: 2, category: 20 }
      ]
    });
  });
});
