# Hydrant Flow Test Formulas — Assignment Documentation

This document explains the formulas used to compute hydrant flow test results, in plain English, for use in your assignment documentation.

---

## 1. Individual hydrant outlet flow (gpm)

**Formula (symbolic):**  
**Q = 29.83 × C × D² × √P**

**What it does:**  
Computes the flow from a single hydrant outlet (e.g., one pitot reading at one nozzle) in gallons per minute (gpm).

**Plain English:**

- You measure the **pitot pressure** (P) at the outlet in psi. This is the pressure of the water jet from that outlet.
- You use the **inside diameter** (D) of that outlet in inches (e.g., 2½ in).
- You choose a **nozzle coefficient** (C), usually 0.90 for smooth-bore outlets; it can range from about 0.60 to 0.95 depending on the outlet shape.
- The constant **29.83** converts the result into US gallons per minute when pressure is in psi and diameter is in inches.

So: *“Flow from this one outlet (gpm) = 29.83 × coefficient × (diameter in inches)² × square root of (pitot pressure in psi).”*

You repeat this for every flowing outlet; each outlet gets its own flow based on its own pitot reading and diameter.

---

## 2. Total test flow (sum of all outlets)

**Formula (symbolic):**  
**Q_total = Q₁ + Q₂ + … + Qₙ**

**What it does:**  
Adds the flow from every outlet that was flowing during the test to get the total flow during the test.

**Plain English:**

- For each outlet you have already calculated a flow (Q₁, Q₂, etc.) using the outlet flow formula above.
- You add all of those flows together.

So: *“Total test flow (gpm) = sum of the flow from outlet 1 + outlet 2 + … + outlet n.”*

This total is the flow that was actually discharging during the test and is used in the next formula.

---

## 3. Projected flow at static pressure (NFPA 291)

**Formula (symbolic), as in hydrant-flow-test-calculator.xlsx:**  
**Q_projected = Q_test × ( (P_static − P_target) ÷ (P_static − P_residual) )^0.54**

**What it does:**  
Estimates the flow that would be available at a chosen “target” residual pressure (e.g., 20 psi or half of static for low-pressure systems), using the total test flow and the static and residual pressures you measured.

**Plain English:**

- **Q_test** is the total test flow (from step 2) in gpm.
- **P_static** is the static pressure (psi) with no hydrants flowing.
- **P_residual** is the residual pressure (psi) you measured at the test hydrant *while* the outlets were flowing.
- **P_target** is the residual pressure (psi) at which you want to know the flow. NFPA 291 typically uses:
  - **20 psi** when static pressure is 40 psi or more, or
  - **half of the static pressure** when static is below 40 psi.
- The fraction **(P_static − P_target) ÷ (P_static − P_residual)** is the ratio of “pressure drop available at the target residual” to “pressure drop that actually occurred during the test.” Flow is proportional to (pressure drop)^0.54, so we scale the test flow by this ratio raised to 0.54.
- The exponent **0.54** comes from the Hazen–Williams relationship between pressure and flow in pipes and is the standard used in NFPA 291.

So: *“Projected flow at the target residual pressure (gpm) = total test flow × ( (static − target residual) ÷ (static − residual during test) )^0.54.”*

This gives you the *available flow at the chosen rating pressure*, used for hydrant marking and system capacity evaluation.

---

## Summary table

| Quantity | Formula | In plain English |
|----------|---------|------------------|
| **Outlet flow** | Q = 29.83 × C × D² × √P | Flow from one outlet = constant × coefficient × (diameter)² × √(pitot pressure). |
| **Total test flow** | Q_total = Σ (each outlet flow) | Total flow = sum of all outlet flows during the test. |
| **Projected flow (NFPA 291)** | Q_proj = Q_test × ((P_static − P_target)/(P_static − P_residual))^0.54 | Projected flow = test flow × (pressure-drop ratio)^0.54. |

---

## Source: hydrant-flow-test-calculator.xlsx

The JavaScript in `src/lib/hydrantFlowFormulas.js` matches the “Estimated Flow” sheet:

- **Outlet flow:** `29.83*B9*B8^2*SQRT(B10)` (and same pattern for B17, B23) → `outletFlowGpm(pitot, diameter, coefficient)`.
- **Total test flow:** `SUM(B11,B17,B23)` → `totalTestFlowGpm([q1, q2, q3])`.
- **Projected flow:** `$B$5*(($B$3-Dn)/($B$3-$B$4))^0.54` → `projectedFlowAtStaticPressureGpm(totalFlow, staticPsi, residualPsi, targetResidualPsi)`.
