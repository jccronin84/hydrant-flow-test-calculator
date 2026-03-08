# Hydrant Flow Test Analyzer

A web dashboard for hydrant flow test evaluation and water distribution system capacity analysis.

## Prompt Log

Chronological log of every prompt used in this project while building the Hydrant Flow Test Calculator.

---

**Initial project setup: landing page, hero, grid layout, footer, and Olsson-inspired theme.**

```
Act as a senior expert in React, Tailwind CSS, and data visualization.

I am building a web dashboard called "Hydrant Flow Test Analyzer"
The topic is: Hydrant flow test evaluation for water distribution system capacity.

Please set up a landing page with:

1. A clean header with the title and a placeholder logo.
2. A hero section describing why hydrant flow tests matter.
3. A main content area using a grid layout.
4. A footer with my name and "Spring 2026."

Use a color theme inspired by Olsson.com website (green, black, and white).
Keep the design minimalist and professional.
```

---

**Extract formulas from the Excel calculator and implement them as JavaScript with plain-English explanations.**

```
Please read the attached Excel file (hydrant-flow-test-calculator.xlsx).
Extract all formulas used to calculate:

1. Individual hydrant outlet flow (gpm)
2. Total test flow (sum of all outlets)
3. Projected flow at static pressure using the standard NFPA 291 formula

Rewrite these formulas in clean JavaScript functions.
Explain each formula in plain English so I can include it in my assignment documentation.
```

---

**Reference the Excel file in chat.**

```
@hydrant-flow-test-calculator.xlsx 
```

---

**Add calculator panel with static/residual pressure, outlet fields, Calculate Flow button, and real-time results.**

```
Create a calculator panel in the main grid area of the webpage.

Include input fields for:
- Static pressure (psi)
- Residual pressure (psi)
- For each hydrant outlet:
    - Diameter (inches)
    - Coefficient (C)
    - Pitot pressure (psi)

Add a "Calculate Flow" button.

Display:
- Flow for each outlet
- Total test flow
- Projected flow at static pressure

Make the results update in real time as the user types.
Use Tailwind CSS for styling.
```

---

**Change coefficient to a dropdown (0.9, 0.8, 0.7) per AWWA M17; user attached an image of the excerpt.**

```
Change the coefficient field to be a drop down with three options of 0.9, 0.8, and 0.7.  This is based on the following excerpt from AWWA M17. 
```

---

**Remove M17 reference from the page.**

```
Remove the reference to M17 on the webpage.
```

---

**Rename coefficient to Inlet Coefficient and simplify dropdown labels (Rounded (0.9), etc.).**

```
Change Coefficient to Inlet Coefficient and in the drop down remove the word inlet from all three options.  The options should be Rounded (0.9) and so on.
```

---

**Show calculated flow as whole numbers.**

```
Change calculated flow to be a whole number.
```

---

**Match green to Olsson logo green from a shared screenshot.**

```
Change the green color to match the color of the word Olsson in this screenshot.  
```

---

**Use only main green.**

```

Use main green only
```

---

**Use only the lighter green.**

```

Change it to the lighter green only.
```

---

**Format flow numbers with thousands separators.**

```

add a comma in the thousandths place for the flow numbers. 
```

---

**Make all green buttons and text bright green.**

```

Make all the green buttons and text bright green. 
```

---

**Troubleshooting: green still appearing dark.**

```
Why are the green buttons and text still showing up dark?
```

---

**Apply main Olsson green to all green buttons and text.**

```
ok, please make all the green buttons and text main olsson green. 
```

---

**Use all three Olsson colors from the shared image for green text and buttons.**

```
change the green text and buttons to use all three Olsson colors identified from the image that I shared previously.
```

---

**Add name in footer bottom-left.**

```
Add my name, Jon Cronin, to the bottom left corner. 
```

---

**Add Recharts bar chart below calculator (per-outlet flow bars, total flow bar, blues/teals).**

```
Add a bar chart below the calculator using the Recharts library.

The chart should display:
- Flow from each hydrant outlet as individual bars
- Total test flow as a separate bar

Use the calculated values as the data source.
Style the chart with blues and teals to match the water theme.
```

---

**Remove the bar chart.**

```
Remove the bar chart below the calculator.
```

---

**Rename outlets to hydrants across the UI (Flow Hydrants, Add Hydrant, Hydrant #, Results).**

```
Change Hydrant Outlets to Flow Hydrants.  Change Add Outlet to Add Hydrant.  Change Outlet # to Hydrant #.  In Results change Outlet # to Hydrant #.
```

---

**Add NFPA 291 pressure–flow curve chart (Recharts, curve + measured + rating points, Olsson styling, dynamic).**

```
Create a new chart that visualizes the NFPA 291 projected flow relationship between pressure (y-axis) and flow (x-axis).

Use the formulas extracted from the hydrant-flow-test-calculator.xlsx file to compute:

- Individual outlet flows (gpm)
- Total test flow (gpm)
- Projected flow at static pressure using the NFPA 291 equation:
    Qf = Qt * ((Ps - Pf) / (Ps - Pr))^(1.85)

Where:
Ps = static pressure
Pr = residual pressure
Pf = desired pressure (typically 20 psi)
Qt = total test flow

Create a dataset of (flow, pressure) points that represent the pressure–flow curve from the measured residual pressure down to 0 psi.

Then build a Recharts <LineChart> or <ScatterChart> with:
- X-axis = Flow (gpm)
- Y-axis = Pressure (psi)
- A smooth line showing the projected pressure–flow curve
- A point marking the actual measured test condition (Qt, Pr)
- A point marking the projected flow at intervals of 20 psi (Qf, 20)

Style the chart using Olsson colors.
Make the chart responsive and update dynamically whenever the user changes any calculator inputs.
```

---

**Y-axis max: 5–10 psi above static, rounded to nearest tenth.**

```

Make the upper limit of the y-axis greater than the test static pressure.  The max value for the y-axis should be at least 5 psi and nor more than 10 psi greater than the test static pressure.  Also, the max value for the y-axis should be rounded to the nearst 10th.  
```

---

**Start with one hydrant only; user adds more as needed.**

```

When the webpage is initially launched or when it is reset, start with Hydrant 1 only.  The user can manullay add additonal hydrants as needed.  I do not want the webpage to open with input fields hydrants 1, 2, and 3.  In most hydrant flow tests, the operators only flow a single hydrant.  
```

---

**Make chart area 1.5x taller.**

```

Make the area for the chart 1.5x taller.
```

---

**Y-axis max rounded to nearest multiple of 10 (whole number), not nearest tenth.**

```

The max value for the y-axis should be rounded to the nearest whole number that is a multiple of 10, not to the nearst 10th (i.e., first decimal place).
```

---

**Remove 20 psi interval points from the chart.**

```
Remove the points showing 20 psi intervals from the chart. 
```

---

**Widen results, test pressures, and flow hydrants boxes so Inlet Coefficient dropdown is fully readable.**

```
Make the results, test pressures, and flow hydrants boxes wider. I'd like to be able to read inlet coefficient drop down menu in full.
```

---

**Fix legend: move Projected Flow symbol next to Measured and Rating, avoid overlap with x-axis title.**

```
In the chart, the projected flow symbol in the legend is overlapping with the flow (gpm) title for the x-axis.  Move the project flow symbol next to the Measured and Rating points in the legend. 
```

---

**Change Rating point color to red.**

```
Change the Rating point to the color Red.
```

---

**Format x-axis numbers with commas for values ≥ 1,000.**

```
Make the x-axis numbers have commas when the values are 1,000 or greater.
```

---

**Stronger grid: y-axis whole numbers divisible by 10, x-axis divisible by 500.**

```
Make the grid for the chart more robust. use whole numbers divisible by 10 for the y-axis and divisible from 500 for the x-axis. 
```

---

**Legend: show test flow and pressure in parentheses for Measured point.**

```
In the legend, the measured point should include the test flowrate and pressure in the parenthesis. 
```

---

**Snap cursor to curve at flow rates divisible by 25, and to measured and rating points.**

```
I like how the cursor snaps to points on the projected curve.  Please setup the chart so that the cursor only snaps to flow rates that are divisible by 25.  Also, make sure that it can also snap to the measured point and the rating point.
```

---

**Snap to flow rates divisible by 5 instead of 25.**

```
Rather than values divisible by 25, setup the curve so the cursor snaps to values divisible by 5.
```

---

**Snap to flow rates divisible by 10.**

```
Change that to numbers divisible by 10.
```

---

**Chart title: "Pressure-Flow Curve"; remove NFPA 291 and equation from title; resize/place title.**

```
Remove the NFPA 291 from the chart title.  Make the chart title Pressure-Flow Curve.  Remove the equation from below the title.  Resize and place the new title if needed to make it stand out better.
```

---

**Center the chart title and legend.**

```
Center the chart title and legend.
```

---

**Set browser/page title to Hydrant Flow Test Calculator.**

```
Change the webpage title to Hydrant Flow Test Calculator
```

---

**Header: change Analyzer to Calculator and remove HFT logo.**

```
Change the top ribbon from Analyzer to Calculator. Also, remove the HFT logo. 
```

---

**Add Olsson logo in header top-right.**

```
Add Olsson's logo in the top right corner. 
```

---

**Residual pressure placeholder: e.g. 45 → e.g. 55.**

```
In the residual pressure field, change the example pressure from e.g. 45 to e.g. 55.
```

---

**Diameter field placeholder: e.g. 2.5.**

```
in the Diameter field, change the example value to say. e.g. 2.5
```

---

**Pitot field label: "Pitot pressure (psi)".**

```
Update the Pitot field title to say Pitot pressure (psi)
```

---

**Pitot pressure placeholder: e.g. 40.**

```
update the pitot pressure field example to e.g. 40
```

---

**Static and residual pressure placeholders: e.g. 60 and e.g. 50.**

```
Update the static pressure example to e.g. 60 and the residual pressure example to e.g. 50
```

---

**Add (c) after Inlet coefficient title.**

```
Put (c) at the end of the Inlet coefficient title.
```

---

**Remove (c) from Inlet coefficient title.**

```
Actually remove (c) from the end of inlet coefficient
```

---

**Match font size in flow hydrants box to test pressures box.**

```
The font size in the flow hydrant box appears to be smaller than the font size in the test pressures box.  Please adjust them to be the same.
```

---

**Increase "Flow: XXXX" text size in flow hydrants box.**

```
In the flow hydrants box, the text for flow: XXXX looks small.  Should it be bigger to better match the other text in this area?
```

---

**Rename "Flow Hydrants" to "Flow Hydrant(s)".**

```
Change title of Flow Hydrants box to Flow Hydrant(s)
```

---

**Olsson logo size to match "Hydrant Flow Test Calculator" title.**

```
Make the Olsson logo in the top right corner bigger.  The font size should match the Hydrant Flow Test Calculator font size.
```

---

**Increase logo height to h-8.**

```
bump it to h-8
```

---

**Increase logo height to h-9.**

```
let's try h-9
```

---

**Heading above test pressures: "Hydrant flow test calculator" (capitalization as typed).**

```
Change flow test calculator to Hydrant flow test calculator.  This is for the text right above the test pressures box. 
```

---

**Capitalize first letter of all title words.**

```
Make all title words start with a capital letter
```

---

**Consider "Flow per Hydrant" instead of current label.**

```
Should it be Flow per Hydrant?  Is that more professional?
```

---

**Capitalize Static Pressure, Residual Pressure, Inlet Coefficient, Pitot Pressure.**

```
Change Static pressure to Static Pressure.  Do the same for Residual Pressure, Inlet Coefficient, and Pitot Pressure.
```

---

**Crosshair: vertical line should not extend above the curve.**

```
On the chart, I like how the a small circle follows the projected curve line based on my cursor position.  I like the vertical line that runs down to the x-axis.  Change this line so that it doesn't extend above the curve.
```

---

**Add horizontal line from curve to y-axis for crosshair.**

```
Can you add a horizontal line that runs back to the y-axis?
```

---

**Report that the last change is not working.**

```
This last change does not appear to be working right.
```

---

**Report again that the last change is not working.**

```
This last change does not appear to be working right.
```

---

**Remove Calculate Flow button because flow updates automatically.**

```
The calculator automatically calculates flow and populates the results box when input values are put into the test pressure and flow hydrants fields.  This makes the calculate flow button not useful.  I think we should remove it. 
```

---

**Rename "Test Pressures" section to "Pressure Hydrant".**

```
Please change test pressures title to Pressure Hydrant.
```

---

**First version of new webpage summary (3 bullets, no equation).**

```
Change the webpage summary to say the following. 

"Hydrant flow tests are conducted to determine pressure and flow-producing capabilitites at any location within a distribution system. Test data may be used for a variety of applications:

- Determining how much water is available for fighting fires
- Detecting where excess head loss occurs and where closed valves are likely
- Calibrating friction factors in pipes for a hydraulic model

Hydrant flow tests are based on guidelines from several industry organizations, including the American Water Works Association (AWWA), the National Fire Protection Association (NFPA), and the Verisk Insurance Services Office (ISO). This calculator is based on equations included in AWWA M32 and M17 as well as NFPA 291. This equaiton is defined below. 

This dashboard helps you analyze test data, compare results over time, and make informed decisions about system maintenance and capital improvements.
"
```

---

**Second version: 4 bullets, add equation and parameter definitions, new closing sentence.**

```
Change the webpage summary to say the following. 

"Hydrant flow tests are conducted to determine pressure and flow-producing capabilitites at any location within a distribution system. Test data may be used for a variety of applications:

- Determining how much water is available for fighting fires 
- Detecting where excess head loss occurs and where closed valves are likely
- Calibrating friction factors for pipes in a hydraulic model
- Creating dynamic boundary conditions in a hydraulic model

Hydrant flow tests are based on guidelines from several industry organizations, including the American Water Works Association (AWWA), the National Fire Protection Association (NFPA), and the Verisk Insurance Services Office (ISO). This calculator is based on equations included in AWWA M32 and M17 as well as NFPA 291. This equaiton is defined below."

Add the equaiton here and define the parameters of the equation.

"This dashboard helps you analyze hydrant flow test data and make informed decisions about the distribution system capacity at the test location."
```

---

**P parameter: clarify 20 psi for available fire flow.**

```
For P, change e.g. 20 psi for available fire flow
```

---

**Remove "or 1/2 static per NFPA 291" from P definition.**

```
remove or 1/2 static per NFPA 291
```

---

**Show each equation parameter as "variable = definition" on one line.**

```
For each equation parameter put the variable = definition of variable.  I don't like having those split across two rows.
```

---

**Increase equation font size.**

```
Make the font of the equation larger.
```

---

## Setup

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) to view the app.

## Stack

- React 18 + Vite
- Tailwind CSS (Olsson-inspired theme: green, black, white)

## Customize

- **Footer name:** Edit `src/components/Footer.jsx` and replace "Your Name" with your name.
