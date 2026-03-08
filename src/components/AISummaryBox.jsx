/**
 * AISummaryBox – natural-language summary of hydrant flow test results.
 * Uses conditional, interpretive language and general engineering reasoning
 * inspired by industry practices. No quoted text from standards. All content derived from props.
 */
function AISummaryBox({
  staticPressure,
  residualPressure,
  pitotPressure,
  flowAt20,
  gpmMeasured,
  percentDrop,
  mainCapacityCategory,
}) {
  const hasPressure = (n) => n != null && Number.isFinite(Number(n))
  const hasFlow = (n) => n != null && Number.isFinite(Number(n)) && Number(n) > 0
  const num = (n) => (n != null && Number.isFinite(Number(n)) ? Number(n) : null)
  const fmt = (n, decimals = 0) =>
    n != null && Number.isFinite(n) ? Number(n).toFixed(decimals) : '—'
  const fmtFlow = (n) => {
    if (n == null || !Number.isFinite(Number(n))) return '—'
    const val = Number(n)
    return val >= 1000 ? Math.round(val).toLocaleString() : String(Math.round(val))
  }

  const staticNum = num(staticPressure)
  const residualNum = num(residualPressure)
  const pitotNum = num(pitotPressure)
  const flowAt20Num = num(flowAt20)
  const gpmMeasuredNum = num(gpmMeasured)
  const percentDropNum = num(percentDrop)
  const category = mainCapacityCategory != null && String(mainCapacityCategory).trim() ? String(mainCapacityCategory).trim() : null

  const hasValidTest = hasPressure(staticNum) && hasPressure(residualNum) && staticNum > 0
  const drop = hasValidTest ? staticNum - residualNum : null
  const dropPercent = percentDropNum ?? (hasValidTest && staticNum > 0 ? (drop / staticNum) * 100 : null)

  /** Sections: { ref: string, bullets: string[] } */
  const sections = []

  // NFPA 291 – pressure drop (conditional, interpretive language)
  if (dropPercent != null && hasValidTest) {
    const bullets = []
    if (dropPercent <= 0) {
      bullets.push('Based on the measured values, no pressure drop was observed (residual at or above static), which may be consistent with no-flow or very low flow during the test.')
    } else if (dropPercent < 10) {
      bullets.push(`Based on the measured pressure drop of approximately ${fmt(dropPercent, 1)}%, the system appears to have excellent stability under the test conditions.`)
    } else if (dropPercent < 25) {
      bullets.push(`The observed pressure drop of approximately ${fmt(dropPercent, 1)}% suggests normal distribution system behavior under flow; the pressure drop pattern may indicate typical demand response.`)
    } else {
      bullets.push(`The pressure drop of approximately ${fmt(dropPercent, 1)}% may indicate limited main capacity or high system demand; these results suggest that available capacity at this location could be a constraint.`)
    }
    if (bullets.length) sections.push({ ref: 'NFPA 291', bullets })
  }

  // AWWA M31/M32 – available fire flow (conditional language)
  if (hasFlow(flowAt20Num)) {
    const q = flowAt20Num
    let fireFlowContext
    if (q < 500) fireFlowContext = 'minimal demand applications'
    else if (q < 1000) fireFlowContext = 'rural or low-density areas'
    else if (q < 1500) fireFlowContext = 'residential areas'
    else if (q < 2500) fireFlowContext = 'most suburban areas'
    else fireFlowContext = 'commercial or industrial areas'
    sections.push({
      ref: 'AWWA M31/M32',
      bullets: [
        `The calculated fire flow at the rating residual is approximately ${fmtFlow(flowAt20Num)} gpm. This level of available fire flow is generally consistent with ${fireFlowContext}.`,
        `The calculated fire flow at the rating pressure suggests the main may be capable of supporting this level of demand at the test location under the conditions applied.`,
      ],
    })
  }

  // AWWA M31 – system capacity (interpretive, evidence-based language)
  const m31Bullets = []
  if (hasValidTest && residualNum < staticNum && staticNum > 0) {
    const ratio = residualNum / staticNum
    if (ratio >= 0.75) {
      m31Bullets.push('The relationship between static and residual pressure implies that the distribution main may have strong capacity under the test flow.')
    } else if (ratio >= 0.5) {
      m31Bullets.push('These values may indicate that the distribution main has adequate capacity under the test flow.')
    } else {
      m31Bullets.push('The relationship between static and residual pressure may indicate that the system could be experiencing notable demand at this flow; main capacity may be a consideration.')
    }
  }
  if (category) {
    m31Bullets.push(`The available data implies a system capacity classification of ${category}.`)
  }
  if (hasFlow(flowAt20Num) && hasPressure(staticNum) && staticNum > 0 && staticNum < 50 && flowAt20Num >= 2000) {
    m31Bullets.push('The calculated flow at rating pressure, relative to static pressure, suggests the main may be capable of supporting relatively high flow at this point.')
  }
  if (m31Bullets.length) sections.push({ ref: 'AWWA M31', bullets: m31Bullets })

  // AWWA M17 – hydrant performance (conditional, no absolute statements)
  if (hasPressure(pitotNum)) {
    const pitotLowThreshold = 8
    const pitotHighThreshold = 50
    let bullet
    if (pitotNum < pitotLowThreshold && hasFlow(gpmMeasuredNum)) {
      bullet = `If accurate, the pitot pressure of ${fmt(pitotNum)} psi at ${fmtFlow(gpmMeasuredNum)} gpm may indicate that the hydrant or outlet warrants verification of condition, nozzle type, and full opening.`
    } else if (pitotNum > pitotHighThreshold) {
      bullet = `The pitot reading may indicate that the hydrant is operating with relatively high outlet pressure (${fmt(pitotNum)} psi); if representative, this could suggest the main may be delivering adequate pressure at this location.`
    } else {
      bullet = `The pitot reading may indicate that the hydrant is operating normally for the test conditions (${fmt(pitotNum)} psi); documenting outlet type and condition is recommended for future comparison.`
    }
    sections.push({ ref: 'AWWA M17', bullets: [bullet] })
  } else if (hasFlow(gpmMeasuredNum)) {
    sections.push({
      ref: 'AWWA M17',
      bullets: [`The available data implies a measured flow of ${fmtFlow(gpmMeasuredNum)} gpm; recording outlet details and hydrant condition is recommended for consistency with future tests.`],
    })
  }

  const hasContent = sections.length > 0

  return (
    <div className="mt-6 rounded-lg border border-olsson-black/10 bg-white p-6">
      <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-olsson-green-dark">
        AI-Generated Summary
      </h3>
      {hasContent ? (
        <ul className="list-none space-y-4 pl-0 text-sm leading-relaxed text-olsson-black/80">
          {sections.map((section, i) => (
            <li key={i} className="space-y-1.5">
              <span className="text-sm font-semibold text-olsson-green-dark">{section.ref}</span>
              <ul className="mt-1 list-disc space-y-1 pl-5 text-olsson-black/80">
                {section.bullets.map((bullet, j) => (
                  <li key={j}>{bullet}</li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-sm leading-relaxed text-olsson-black/80">
          Enter static pressure, residual pressure, and flow data in the calculator to generate an interpretive summary of your hydrant flow test results, with reasoning inspired by common industry practices.
        </p>
      )}
    </div>
  )
}

export default AISummaryBox
