function Hero() {
  return (
    <section className="bg-olsson-black text-olsson-white py-20 px-6">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-semibold tracking-tight mb-6 text-center">
          Why Hydrant Flow Tests Matter
        </h2>
        <div className="text-lg text-olsson-white/90 leading-relaxed space-y-4">
          <p>
            Hydrant flow tests are conducted to determine pressure and flow-producing
            capabilities at any location within a distribution system. Test data may be
            used for a variety of applications:
          </p>
          <ul className="list-disc list-inside space-y-2 ml-2">
            <li>Determining how much water is available for fighting fires</li>
            <li>Detecting where excess head loss occurs and where closed valves are likely</li>
            <li>Calibrating friction factors for pipes in a hydraulic model</li>
            <li>Creating dynamic boundary conditions in a hydraulic model</li>
          </ul>
          <p>
            Hydrant flow tests are based on guidelines from several industry organizations,
            including the American Water Works Association (AWWA), the National Fire
            Protection Association (NFPA), and the Verisk Insurance Services Office (ISO).
            This calculator is based on equations included in AWWA M32 and M17 as well as
            NFPA 291. The equation is defined below.
          </p>
          <div className="my-6 p-4 rounded-lg bg-olsson-white/10 border border-olsson-white/20">
            <p className="font-mono text-xl mb-3 text-center">
              Q = Q<sub>t</sub> × ((P<sub>s</sub> − P) ÷ (P<sub>s</sub> − P<sub>r</sub>))<sup>0.54</sup>
            </p>
            <ul className="text-sm space-y-1.5 list-none pl-0">
              <li><strong>Q</strong> = Projected flow at a chosen residual pressure (gpm)</li>
              <li><strong>Q<sub>t</sub></strong> = Total test flow during the test (gpm)</li>
              <li><strong>P<sub>s</sub></strong> = Static pressure with no flow (psi)</li>
              <li><strong>P<sub>r</sub></strong> = Residual pressure during the test (psi)</li>
              <li><strong>P</strong> = Residual pressure at which flow is projected (psi); e.g. 20 psi for available fire flow</li>
            </ul>
          </div>
          <p>
            This dashboard helps you analyze hydrant flow test data and make informed
            decisions about the distribution system capacity at the test location.
          </p>
        </div>
      </div>
    </section>
  )
}

export default Hero
