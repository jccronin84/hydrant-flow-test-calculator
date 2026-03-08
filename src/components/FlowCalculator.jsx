import { useState, useMemo } from 'react'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceDot,
  Legend,
} from 'recharts'
import {
  outletFlowGpm,
  totalTestFlowGpm,
  projectedFlowAtStaticPressureGpm,
  projectedFlowNfpa291Gpm,
  nfpa291RatingPressurePsi,
} from '../lib/hydrantFlowFormulas'

/** Crosshair cursor: vertical line from point to x-axis, horizontal line from point to y-axis. Requires Tooltip shared={true}. */
function CrosshairCursor(props) {
  const offset = props.offset || {}
  const left = props.left ?? offset.left ?? 0
  const top = props.top ?? offset.top ?? 0
  const width = props.width ?? offset.width ?? 0
  const height = props.height ?? offset.height ?? 0
  const { points, payload, yAxisMax } = props
  if (!points?.length || !payload?.length || yAxisMax == null || !height) return null
  const x = points[0].x
  const data = payload[0]?.payload
  const pressure = data?.pressure
  if (x == null || pressure == null || Number.isNaN(Number(pressure))) return null
  const y = top + height - (Number(pressure) / Number(yAxisMax)) * height
  const stroke = '#0a0a0a'
  const strokeWidth = 1
  const strokeDasharray = '3 3'
  const bottom = top + height
  return (
    <g>
      <line x1={x} y1={y} x2={x} y2={bottom} stroke={stroke} strokeWidth={strokeWidth} strokeDasharray={strokeDasharray} />
      <line x1={left} y1={y} x2={x} y2={y} stroke={stroke} strokeWidth={strokeWidth} strokeDasharray={strokeDasharray} />
    </g>
  )
}

/** Outlet-nozzle coefficients by inlet type */
const COEFFICIENT_OPTIONS = [
  { value: '0.9', label: 'Rounded (0.9)' },
  { value: '0.8', label: 'Square (0.8)' },
  { value: '0.7', label: 'Protruding (0.7)' },
]

const defaultOutlet = () => ({
  diameter: '',
  coefficient: '0.9',
  pitot: '',
})

function FlowCalculator() {
  const [staticPsi, setStaticPsi] = useState('')
  const [residualPsi, setResidualPsi] = useState('')
  const [outlets, setOutlets] = useState([defaultOutlet()])

  const addOutlet = () => setOutlets((prev) => [...prev, defaultOutlet()])
  const removeOutlet = (index) => {
    if (outlets.length <= 1) return
    setOutlets((prev) => prev.filter((_, i) => i !== index))
  }

  const updateOutlet = (index, field, value) => {
    setOutlets((prev) =>
      prev.map((o, i) => (i === index ? { ...o, [field]: value } : o))
    )
  }

  const outletFlows = useMemo(() => {
    return outlets.map((o) => {
      const d = Number(o.diameter)
      const c = Number(o.coefficient) || 0.9
      const p = Number(o.pitot)
      return outletFlowGpm(p, d, c)
    })
  }, [outlets])

  const totalFlow = useMemo(
    () => totalTestFlowGpm(outletFlows),
    [outletFlows]
  )

  const staticNum = Number(staticPsi)
  const residualNum = Number(residualPsi)
  const ratingPsi = useMemo(
    () => (staticNum ? nfpa291RatingPressurePsi(staticNum) : 20),
    [staticNum]
  )
  const projectedFlow = useMemo(() => {
    if (!totalFlow || !staticNum || !residualNum || residualNum >= staticNum)
      return 0
    return projectedFlowNfpa291Gpm(totalFlow, residualNum, staticNum)
  }, [totalFlow, staticNum, residualNum])

  const formatNum = (n) => (Number.isFinite(n) && n > 0 ? Math.round(n).toLocaleString() : '—')

  // NFPA 291 pressure-flow curve: Q = Qt * ((Ps - P) / (Ps - Pr))^0.54
  // Inverse: P = Ps - (Ps - Pr) * (Q/Qt)^(1/0.54)
  const NFPA_INVERSE_EXP = 1 / 0.54

  const { curveData, measuredPoint, ratingPoint } = useMemo(() => {
    const points = []
    let measured = null
    let rating = null

    if (
      totalFlow > 0 &&
      staticNum > 0 &&
      residualNum > 0 &&
      residualNum < staticNum
    ) {
      const drop = staticNum - residualNum
      const qMax =
        totalFlow *
        Math.pow(staticNum / drop, 0.54)

      for (let q = 0; q <= qMax; q += 10) {
        const ratio = q / totalFlow
        const p =
          ratio <= 0
            ? staticNum
            : staticNum - drop * Math.pow(ratio, NFPA_INVERSE_EXP)
        points.push({
          flow: q,
          pressure: Math.round(Math.max(0, p) * 10) / 10,
        })
      }
      if (points.length && points[points.length - 1].flow < qMax) {
        const p = 0
        points.push({ flow: Math.round(qMax), pressure: p })
      }

      measured = { flow: Math.round(totalFlow), pressure: residualNum }
      rating = { flow: Math.round(projectedFlow), pressure: ratingPsi }

      const addOrReplace = (flow, pressure) => {
        const i = points.findIndex((d) => d.flow === flow)
        if (i >= 0) points[i] = { flow, pressure }
        else points.push({ flow, pressure })
      }
      addOrReplace(measured.flow, measured.pressure)
      addOrReplace(rating.flow, rating.pressure)
      points.sort((a, b) => a.flow - b.flow)

      return {
        curveData: points,
        measuredPoint: measured,
        ratingPoint: rating,
      }
    }

    return {
      curveData: points,
      measuredPoint: measured,
      ratingPoint: rating,
    }
  }, [totalFlow, staticNum, residualNum, projectedFlow, ratingPsi])

  const showChart =
    curveData.length > 0 && measuredPoint && totalFlow > 0 && staticNum > 0

  // Y-axis max: 5–10 psi above static, rounded to nearest multiple of 10
  const yAxisMax = useMemo(() => {
    if (!staticNum || !showChart) return 'auto'
    const minVal = staticNum + 5
    return Math.ceil(minVal / 10) * 10
  }, [staticNum, showChart])

  // Grid ticks: y every 10 psi, x every 500 gpm
  const yAxisTicks = useMemo(() => {
    if (typeof yAxisMax !== 'number') return []
    const ticks = []
    for (let p = 0; p <= yAxisMax; p += 10) ticks.push(p)
    return ticks
  }, [yAxisMax])

  const xAxisTicks = useMemo(() => {
    if (!curveData.length) return []
    const maxFlow = Math.max(...curveData.map((d) => d.flow), 0)
    const maxTick = Math.ceil(maxFlow / 500) * 500
    const ticks = []
    for (let q = 0; q <= maxTick; q += 500) ticks.push(q)
    return ticks
  }, [curveData])

  return (
    <section className="max-w-7xl mx-auto px-6 py-10">
      <h2 className="text-2xl font-semibold text-olsson-black mb-8">
        Hydrant Flow Test Calculator
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-[1.35fr_1fr] gap-8">
        {/* Inputs */}
        <div className="space-y-6">
          <div className="p-6 border border-olsson-black/10 rounded-lg bg-white">
            <h3 className="text-sm font-semibold text-olsson-green-dark uppercase tracking-wide mb-4">
              Pressure Hydrant
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <label className="block">
                <span className="text-sm text-olsson-black/80">Static Pressure (psi)</span>
                <input
                  type="number"
                  min="0"
                  step="0.1"
                  value={staticPsi}
                  onChange={(e) => setStaticPsi(e.target.value)}
                  placeholder="e.g. 60"
                  className="mt-1 block w-full rounded border border-olsson-black/20 px-3 py-2 text-olsson-black focus:border-olsson-green focus:outline-none focus:ring-1 focus:ring-olsson-green"
                />
              </label>
              <label className="block">
                <span className="text-sm text-olsson-black/80">Residual Pressure (psi)</span>
                <input
                  type="number"
                  min="0"
                  step="0.1"
                  value={residualPsi}
                  onChange={(e) => setResidualPsi(e.target.value)}
                  placeholder="e.g. 50"
                  className="mt-1 block w-full rounded border border-olsson-black/20 px-3 py-2 text-olsson-black focus:border-olsson-green focus:outline-none focus:ring-1 focus:ring-olsson-green"
                />
              </label>
            </div>
          </div>

          <div className="p-6 border border-olsson-black/10 rounded-lg bg-white">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-olsson-green-dark uppercase tracking-wide">
                Flow Hydrant(s)
              </h3>
              <button
                type="button"
                onClick={addOutlet}
                className="text-sm font-medium text-olsson-green-light hover:underline"
              >
                + Add Hydrant
              </button>
            </div>
            <div className="space-y-4">
              {outlets.map((outlet, i) => (
                <div
                  key={i}
                  className="p-4 rounded-lg border border-olsson-black/10 bg-olsson-white/50"
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-medium text-olsson-black/80">
                      Hydrant {i + 1}
                    </span>
                    {outlets.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeOutlet(i)}
                        className="text-sm text-olsson-black/60 hover:text-olsson-green-light"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    <label className="block">
                      <span className="text-sm text-olsson-black/80">Outlet Diameter (in)</span>
                      <input
                        type="number"
                        min="0"
                        step="0.1"
                        value={outlet.diameter}
                        onChange={(e) => updateOutlet(i, 'diameter', e.target.value)}
                        placeholder="e.g. 2.5"
                        className="mt-1 block w-full rounded border border-olsson-black/20 px-3 py-2 text-olsson-black focus:border-olsson-green focus:outline-none focus:ring-1 focus:ring-olsson-green"
                      />
                    </label>
                    <label className="block">
                      <span className="text-sm text-olsson-black/80">Outlet Coefficient</span>
                      <select
                        value={outlet.coefficient}
                        onChange={(e) => updateOutlet(i, 'coefficient', e.target.value)}
                        className="mt-1 block w-full rounded border border-olsson-black/20 px-3 py-2 text-olsson-black focus:border-olsson-green focus:outline-none focus:ring-1 focus:ring-olsson-green bg-white"
                      >
                        {COEFFICIENT_OPTIONS.map((opt) => (
                          <option key={opt.value} value={opt.value}>
                            {opt.label}
                          </option>
                        ))}
                      </select>
                    </label>
                    <label className="block">
                      <span className="text-sm text-olsson-black/80">Pitot Pressure (psi)</span>
                      <input
                        type="number"
                        min="0"
                        step="0.1"
                        value={outlet.pitot}
                        onChange={(e) => updateOutlet(i, 'pitot', e.target.value)}
                        placeholder="e.g. 40"
                        className="mt-1 block w-full rounded border border-olsson-black/20 px-3 py-2 text-olsson-black focus:border-olsson-green focus:outline-none focus:ring-1 focus:ring-olsson-green"
                      />
                    </label>
                  </div>
                  <p className="mt-2 text-base text-olsson-black/80">
                    Flow: <strong className="text-olsson-green">{formatNum(outletFlows[i])} gpm</strong>
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="p-6 border border-olsson-black/10 rounded-lg bg-olsson-black text-olsson-white">
          <h3 className="text-sm font-semibold text-olsson-white/90 uppercase tracking-wide mb-6">
            Results
          </h3>
          <div className="space-y-6">
            <div>
              <p className="text-sm text-olsson-white/70">Flow per Hydrant (gpm)</p>
              <ul className="mt-2 space-y-1">
                {outletFlows.map((q, i) => (
                  <li key={i} className="flex justify-between text-lg">
                    <span>Hydrant {i + 1}</span>
                    <span className="font-mono font-medium">{formatNum(q)}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="pt-4 border-t border-olsson-white/20">
              <p className="text-sm text-olsson-white/70">Total Test Flow</p>
              <p className="mt-1 text-2xl font-semibold font-mono">{formatNum(totalFlow)} gpm</p>
            </div>
            <div className="pt-4 border-t border-olsson-white/20">
              <p className="text-sm text-olsson-white/70">
                Projected Flow at Static Pressure
                {staticNum > 0 && (
                  <span className="block text-olsson-white/60">
                    (at {ratingPsi} psi residual, NFPA 291)
                  </span>
                )}
              </p>
              <p className="mt-1 text-2xl font-semibold font-mono">{formatNum(projectedFlow)} gpm</p>
            </div>
          </div>
        </div>
      </div>

      {showChart && (
        <div className="mt-10 p-6 border border-olsson-black/10 rounded-lg bg-white">
          <h3 className="text-xl font-semibold text-olsson-black mb-6 text-center">
            Pressure–Flow Curve
          </h3>
          <div className="h-[30rem] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={curveData}
                margin={{ top: 10, right: 20, left: 0, bottom: 20 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis
                  dataKey="flow"
                  type="number"
                  domain={[0, xAxisTicks.length ? xAxisTicks[xAxisTicks.length - 1] : 'auto']}
                  ticks={xAxisTicks}
                  stroke="#0a0a0a"
                  tick={{ fill: '#0a0a0a', fontSize: 12 }}
                  tickFormatter={(value) => Number(value).toLocaleString()}
                  label={{
                    value: 'Flow (gpm)',
                    position: 'bottom',
                    fill: '#0a0a0a',
                  }}
                />
                <YAxis
                  dataKey="pressure"
                  type="number"
                  domain={[0, yAxisMax]}
                  ticks={yAxisTicks}
                  stroke="#0a0a0a"
                  tick={{ fill: '#0a0a0a', fontSize: 12 }}
                  label={{
                    value: 'Pressure (psi)',
                    angle: -90,
                    position: 'insideLeft',
                    fill: '#0a0a0a',
                  }}
                />
                <Tooltip
                  shared
                  cursor={props => <CrosshairCursor {...props} yAxisMax={yAxisMax} />}
                  content={({ active, payload }) =>
                    active && payload?.[0] ? (
                      <div className="bg-olsson-white border border-olsson-black/20 rounded px-3 py-2 text-sm shadow">
                        <span className="font-medium">
                          {payload[0].payload.flow?.toLocaleString()} gpm
                        </span>
                        <span className="text-olsson-black/70">, </span>
                        <span className="font-medium">
                          {payload[0].payload.pressure} psi
                        </span>
                      </div>
                    ) : null
                  }
                />
                <Line
                  type="monotone"
                  dataKey="pressure"
                  stroke="#8CC63F"
                  strokeWidth={2}
                  dot={false}
                  name="Projected Curve"
                  connectNulls
                />
                {measuredPoint && (
                  <ReferenceDot
                    x={measuredPoint.flow}
                    y={measuredPoint.pressure}
                    r={6}
                    fill="#679A46"
                    stroke="#0a0a0a"
                    strokeWidth={1}
                  />
                )}
                {ratingPoint && (
                  <ReferenceDot
                    x={ratingPoint.flow}
                    y={ratingPoint.pressure}
                    r={6}
                    fill="#DC2626"
                    stroke="#0a0a0a"
                    strokeWidth={1}
                  />
                )}
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-3 flex flex-wrap items-center justify-center gap-4 text-xs text-olsson-black/70">
            <span className="flex items-center gap-1.5">
              <span className="inline-block w-3 h-3 rounded-full bg-[#679A46] shrink-0" />
              Measured ({formatNum(totalFlow)} gpm, {residualNum} psi)
            </span>
            <span className="flex items-center gap-1.5">
              <span className="inline-block w-3 h-3 rounded-full bg-[#DC2626] shrink-0" />
              Rating ({formatNum(projectedFlow)} gpm, {ratingPsi} psi)
            </span>
            <span className="flex items-center gap-1.5">
              <span
                className="inline-block h-0.5 w-6 shrink-0 rounded bg-[#8CC63F]"
                style={{ minWidth: 24 }}
              />
              Projected Curve
            </span>
          </div>
        </div>
      )}
    </section>
  )
}

export default FlowCalculator
