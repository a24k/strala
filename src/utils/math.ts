/**
 * Mathematical utility functions for string art pattern calculations
 * 
 * These functions handle the mathematical aspects of string art mandala patterns,
 * including greatest common divisor (GCD), least common multiple (LCM), and
 * pattern periodicity calculations for two-point connections.
 */

/**
 * Calculate the Greatest Common Divisor (GCD) of two numbers using Euclidean algorithm
 * @param a First number
 * @param b Second number
 * @returns GCD of a and b
 */
export function gcd(a: number, b: number): number {
  while (b !== 0) {
    [a, b] = [b, a % b];
  }
  return a;
}

/**
 * Calculate the Least Common Multiple (LCM) of two numbers
 * @param a First number
 * @param b Second number
 * @returns LCM of a and b
 */
export function lcm(a: number, b: number): number {
  return Math.abs(a * b) / gcd(a, b);
}

/**
 * Calculate the maximum iterations for two-point string art patterns
 * 
 * This function determines how many iterations are needed for a two-point pattern
 * to complete a full cycle, taking into account the alternating nature of 
 * A→B, B→A connections.
 * 
 * @param circlePoints Total number of points on the circle
 * @param stepA Step size for point A
 * @param stepB Step size for point B
 * @returns Maximum iterations needed for pattern completion
 */
export function calculateMaxIterations(circlePoints: number, stepA: number, stepB: number): number {
  // Calculate how many steps each point needs to return to its starting position
  const periodA = circlePoints / gcd(circlePoints, stepA);
  const periodB = circlePoints / gcd(circlePoints, stepB);
  
  // The theoretical maximum is when both points return to their starting positions
  const theoreticalMax = lcm(periodA, periodB);
  
  // However, due to the alternating nature of two-point connections (A→B, B→A),
  // the actual pattern period can be much longer. Use a practical upper bound.
  const practicalMax = Math.min(theoreticalMax * 2, circlePoints * 4);
  
  return Math.max(1, practicalMax);
}

/**
 * Calculate the period (cycle length) for a single-point string art pattern
 * @param circlePoints Total number of points on the circle
 * @param stepSize Step size for connections
 * @returns Number of steps to complete one full cycle
 */
export function calculateSinglePointPeriod(circlePoints: number, stepSize: number): number {
  return circlePoints / gcd(circlePoints, stepSize);
}

/**
 * Check if two step sizes will create symmetric patterns
 * @param circlePoints Total number of points on the circle
 * @param stepA Step size for point A
 * @param stepB Step size for point B
 * @returns True if the pattern will be symmetric
 */
export function isSymmetricPattern(circlePoints: number, stepA: number, stepB: number): boolean {
  const periodA = calculateSinglePointPeriod(circlePoints, stepA);
  const periodB = calculateSinglePointPeriod(circlePoints, stepB);
  return periodA === periodB;
}