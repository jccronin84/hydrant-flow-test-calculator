/**
 * Hydrant Flow Test Formulas
 * Based on NFPA 291 and standard pitot/velocity-head methods.
 * All pressures in psi, diameters in inches, flows in US gpm.
 */

/** Nozzle coefficient of discharge (typical 0.90 for smooth-bore outlets; 0.60–0.95 by type). */
const DEFAULT_NOZZLE_COEFFICIENT = 0.9;

/**
 * 1. Individual hydrant outlet flow (gpm)
 *
 * Computes flow from one outlet using pitot pressure and outlet diameter.
 * Formula: Q = 29.83 × C × D² × √P
 *
 * @param {number} pitotPressurePsi - Pitot gauge reading at the outlet (psi).
 * @param {number} outletDiameterInches - Inside diameter of the outlet (in).
 * @param {number} [coefficient=0.9] - Nozzle coefficient of discharge (0.6–0.95).
 * @returns {number} Flow in gallons per minute (gpm).
 */
export function outletFlowGpm(pitotPressurePsi, outletDiameterInches, coefficient = DEFAULT_NOZZLE_COEFFICIENT) {
  if (pitotPressurePsi <= 0 || outletDiameterInches <= 0) return 0;
  return 29.83 * coefficient * Math.pow(outletDiameterInches, 2) * Math.sqrt(pitotPressurePsi);
}

/**
 * 2. Total test flow (sum of all outlets)
 *
 * Sum of flows from every flowing outlet during the test.
 *
 * @param {number[]} outletFlowsGpm - Flow from each outlet (gpm).
 * @returns {number} Total test flow in gpm.
 */
export function totalTestFlowGpm(outletFlowsGpm) {
  if (!Array.isArray(outletFlowsGpm)) return 0;
  return outletFlowsGpm.reduce((sum, q) => sum + (Number(q) || 0), 0);
}

/**
 * 3. Projected flow at static pressure (NFPA 291)
 *
 * Matches hydrant-flow-test-calculator.xlsx "Estimated Flow" sheet:
 *   E column formula: =$B$5*(($B$3-Dn)/($B$3-$B$4))^0.54
 * Uses pressure-drop form: Q_projected = Q_test × ((P_static − P_target) ÷ (P_static − P_residual))^0.54
 *
 * @param {number} totalTestFlowGpmValue - Total flow during test (gpm), e.g. B5 = SUM(B11,B17,B23).
 * @param {number} staticPressurePsi - Static pressure with no flow (psi), e.g. B3.
 * @param {number} residualPressurePsi - Residual pressure during test (psi), e.g. B4.
 * @param {number} targetResidualPsi - Residual pressure at which to project flow (psi), e.g. D column (20 or ½ static).
 * @returns {number} Projected flow at target residual pressure (gpm).
 */
export function projectedFlowAtStaticPressureGpm(
  totalTestFlowGpmValue,
  staticPressurePsi,
  residualPressurePsi,
  targetResidualPsi
) {
  if (totalTestFlowGpmValue <= 0) return 0;
  const dropDuringTest = staticPressurePsi - residualPressurePsi;
  if (dropDuringTest <= 0) return 0;
  const dropAtTarget = staticPressurePsi - targetResidualPsi;
  if (dropAtTarget <= 0) return 0;
  return totalTestFlowGpmValue * Math.pow(dropAtTarget / dropDuringTest, 0.54);
}

/**
 * NFPA 291 rating pressure: 20 psi residual, or half of static if static < 40 psi.
 *
 * @param {number} staticPressurePsi - Static pressure (no flow), psi.
 * @returns {number} Rating pressure to use for projection (psi).
 */
export function nfpa291RatingPressurePsi(staticPressurePsi) {
  return staticPressurePsi < 40 ? staticPressurePsi / 2 : 20;
}

/**
 * One-step: projected available flow at NFPA 291 rating pressure.
 *
 * @param {number} totalTestFlowGpmValue - Total test flow (gpm).
 * @param {number} residualPressurePsi - Residual pressure during test (psi).
 * @param {number} staticPressurePsi - Static pressure (psi).
 * @returns {number} Projected flow at rating pressure (gpm).
 */
export function projectedFlowNfpa291Gpm(totalTestFlowGpmValue, residualPressurePsi, staticPressurePsi) {
  const targetPsi = nfpa291RatingPressurePsi(staticPressurePsi);
  return projectedFlowAtStaticPressureGpm(
    totalTestFlowGpmValue,
    staticPressurePsi,
    residualPressurePsi,
    targetPsi
  );
}
