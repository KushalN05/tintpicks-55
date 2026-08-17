import { describe, it, expect } from 'vitest';
import { hexToLab } from '../colorConverter';

// Simple JS implementation of Euclidean distance for testing purposes
const calculateDeltaE = (lab1: { l: number; a: number; b: number }, lab2: { l: number; a: number; b: number }) => {
  return Math.sqrt(
    Math.pow(lab1.l - lab2.l, 2) +
    Math.pow(lab1.a - lab2.a, 2) +
    Math.pow(lab1.b - lab2.b, 2)
  );
};

describe('Color Perceptual Matching (CIELAB & Euclidean Distance)', () => {
  it('converts hex strings to CIELAB correctly', () => {
    const lab = hexToLab('#FF0000');
    expect(lab).not.toBeNull();
    // Red in LAB is roughly L: ~53, a: ~80, b: ~67
    expect(lab?.l).toBeGreaterThan(40);
    expect(lab?.a).toBeGreaterThan(70);
  });

  it('handles hex codes without #', () => {
    const lab1 = hexToLab('FF0000');
    const lab2 = hexToLab('#FF0000');
    expect(lab1).toEqual(lab2);
  });

  it('proves visually similar hex codes have a low Delta-E distance', () => {
    // Pure Red
    const red1 = '#FF0000';
    // Slightly softer red
    const red2 = '#EE1111';

    const lab1 = hexToLab(red1)!;
    const lab2 = hexToLab(red2)!;

    const distance = calculateDeltaE(lab1, lab2);
    
    // A Delta-E under 5-10 is often barely distinguishable by the human eye
    expect(distance).toBeLessThan(15);
  });

  it('proves visually distinct hex codes have a high Delta-E distance', () => {
    // Pure Red
    const red = '#FF0000';
    // Pure Blue
    const blue = '#0000FF';

    const lab1 = hexToLab(red)!;
    const lab2 = hexToLab(blue)!;

    const distance = calculateDeltaE(lab1, lab2);
    
    // Distinct colors should have a large distance (often > 50)
    expect(distance).toBeGreaterThan(50);
  });
});
