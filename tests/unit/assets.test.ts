import { describe, expect, it } from 'vitest';
import { assetNames, pickAsset } from '../../src/lib/assets';

const modules = {
  '../assets/photos/iceland-kirkjufell.jpg': 'iceland',
  '../assets/photos/medellin.webp': 'medellin',
  '../assets/books/9780593135204.jpg': 'book',
};

describe('pickAsset', () => {
  it('finds a module by file name without extension', () => {
    expect(pickAsset(modules, 'iceland-kirkjufell')).toBe('iceland');
    expect(pickAsset(modules, 'medellin')).toBe('medellin');
    expect(pickAsset(modules, '9780593135204')).toBe('book');
  });

  it('returns undefined for unknown or partial names', () => {
    expect(pickAsset(modules, 'iceland')).toBeUndefined();
    expect(pickAsset(modules, 'iceland-kirkjufell.jpg')).toBeUndefined();
    expect(pickAsset({}, 'anything')).toBeUndefined();
  });
});

describe('assetNames', () => {
  it('lists bare names, sorted', () => {
    expect(assetNames(modules)).toEqual(['9780593135204', 'iceland-kirkjufell', 'medellin']);
  });
});
