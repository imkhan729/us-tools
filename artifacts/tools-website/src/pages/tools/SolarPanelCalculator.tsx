import { useMemo, useState } from "react";
import { Construction, Sun, Zap } from "lucide-react";
import ConstructionToolPageShell from "./ConstructionToolPageShell";

function formatNumber(value: number, digits = 2) {
  return value.toLocaleString("en-US", { maximumFractionDigits: digits });
}

export default function SolarPanelCalculator() {
  const [monthlyUsage, setMonthlyUsage] = useState("900");
  const [sunHours, setSunHours] = useState("5");
  const [panelWattage, setPanelWattage] = useState("400");
  const [systemLoss, setSystemLoss] = useState("20");
  const [panelArea, setPanelArea] = useState("21");
  const [roofArea, setRoofArea] = useState("500");

  const result = useMemo(() => {
    const usage = parseFloat(monthlyUsage);
    const hours = parseFloat(sunHours);
    const wattage = parseFloat(panelWattage);
    const loss = parseFloat(systemLoss);
    const moduleArea = parseFloat(panelArea);
    const usableRoofArea = parseFloat(roofArea);

    if (
      !Number.isFinite(usage) ||
      !Number.isFinite(hours) ||
      !Number.isFinite(wattage) ||
      !Number.isFinite(loss) ||
      !Number.isFinite(moduleArea) ||
      !Number.isFinite(usableRoofArea) ||
      usage <= 0 ||
      hours <= 0 ||
      wattage <= 0 ||
      loss < 0 ||
      loss >= 100 ||
      moduleArea <= 0 ||
      usableRoofArea < 0
    ) {
      return null;
    }

    const performanceFactor = 1 - loss / 100;
    const dailyUsage = usage / 30;
    const panelProductionPerDay = (wattage / 1000) * hours * performanceFactor;

    if (panelProductionPerDay <= 0) {
      return null;
    }

    const panelsNeeded = Math.ceil(dailyUsage / panelProductionPerDay);
    const systemSizeKw = (panelsNeeded * wattage) / 1000;
    const monthlyProduction = panelsNeeded * panelProductionPerDay * 30;
    const annualProduction = panelsNeeded * panelProductionPerDay * 365;
    const roofAreaRequired = panelsNeeded * moduleArea;
    const maxPanelsByRoof = usableRoofArea > 0 ? Math.floor(usableRoofArea / moduleArea) : null;
    const roofFits = usableRoofArea > 0 ? roofAreaRequired <= usableRoofArea : null;
    const coveragePercent = (monthlyProduction / usage) * 100;

    return {
      dailyUsage,
      panelProductionPerDay,
      panelsNeeded,
      systemSizeKw,
      monthlyProduction,
      annualProduction,
      roofAreaRequired,
      maxPanelsByRoof,
      roofFits,
      coveragePercent,
    };
  }, [monthlyUsage, sunHours, panelWattage, systemLoss, panelArea, roofArea]);

  return (
    <ConstructionToolPageShell
      title="Solar Panel Calculator"
      seoTitle="Solar Panel Calculator - Estimate Panels, System Size, And Roof Area"
      seoDescription="Calculate how many solar panels you need from monthly energy use, sun hours, panel wattage, and system loss. Free solar panel calculator with roof area planning."
      canonical="https://usonlinetools.com/construction/solar-panel-calculator"
      heroDescription="Estimate the number of solar panels, required system size, expected energy output, and roof area needed for a home or small building based on real consumption and site assumptions."
      heroIcon={<Sun className="w-3.5 h-3.5" />}
      calculatorLabel="Solar Array Estimator"
      calculatorDescription="Size a simple solar array from monthly usage, sun hours, panel wattage, and usable roof space."
      calculator={
        <div className="space-y-5">
          <div className="rounded-2xl border border-amber-500/15 bg-amber-500/5 p-5">
            <div className="mb-4 flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-600 dark:text-amber-400" />
              <h3 className="text-lg font-bold text-foreground">Energy and site assumptions</h3>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
              <div>
                <label className="mb-2 block text-xs font-bold uppercase tracking-widest text-muted-foreground">Monthly Usage (kWh)</label>
                <input type="number" min="1" value={monthlyUsage} onChange={(event) => setMonthlyUsage(event.target.value)} className="tool-calc-input w-full" />
              </div>
              <div>
                <label className="mb-2 block text-xs font-bold uppercase tracking-widest text-muted-foreground">Peak Sun Hours / Day</label>
                <input type="number" min="0.1" step="0.1" value={sunHours} onChange={(event) => setSunHours(event.target.value)} className="tool-calc-input w-full" />
              </div>
              <div>
                <label className="mb-2 block text-xs font-bold uppercase tracking-widest text-muted-foreground">Panel Wattage (W)</label>
                <input type="number" min="1" value={panelWattage} onChange={(event) => setPanelWattage(event.target.value)} className="tool-calc-input w-full" />
              </div>
              <div>
                <label className="mb-2 block text-xs font-bold uppercase tracking-widest text-muted-foreground">System Loss %</label>
                <input type="number" min="0" max="99" value={systemLoss} onChange={(event) => setSystemLoss(event.target.value)} className="tool-calc-input w-full" />
              </div>
              <div>
                <label className="mb-2 block text-xs font-bold uppercase tracking-widest text-muted-foreground">Panel Area (sq ft each)</label>
                <input type="number" min="1" step="0.1" value={panelArea} onChange={(event) => setPanelArea(event.target.value)} className="tool-calc-input w-full" />
              </div>
              <div>
                <label className="mb-2 block text-xs font-bold uppercase tracking-widest text-muted-foreground">Usable Roof Area (sq ft)</label>
                <input type="number" min="0" value={roofArea} onChange={(event) => setRoofArea(event.target.value)} className="tool-calc-input w-full" />
              </div>
            </div>
          </div>

          {result ? (
            <div className="space-y-4">
              <div className="rounded-2xl border border-amber-500/20 bg-background p-5 text-center">
                <p className="mb-1 text-xs font-bold uppercase tracking-widest text-muted-foreground">Estimated Panels Needed</p>
                <p className="text-5xl font-black text-amber-700 dark:text-amber-400">{result.panelsNeeded}</p>
                <p className="mt-2 text-sm text-muted-foreground">{formatNumber(result.systemSizeKw, 2)} kW system size</p>
              </div>

              <div className="grid grid-cols-1 gap-3 md:grid-cols-4">
                <div className="rounded-xl border border-border bg-card p-4 text-center">
                  <p className="mb-1 text-xs font-bold uppercase tracking-widest text-muted-foreground">Daily Use</p>
                  <p className="text-2xl font-black text-foreground">{formatNumber(result.dailyUsage, 1)}</p>
                  <p className="mt-1 text-xs text-muted-foreground">kWh/day</p>
                </div>
                <div className="rounded-xl border border-border bg-card p-4 text-center">
                  <p className="mb-1 text-xs font-bold uppercase tracking-widest text-muted-foreground">Monthly Output</p>
                  <p className="text-2xl font-black text-foreground">{formatNumber(result.monthlyProduction, 0)}</p>
                  <p className="mt-1 text-xs text-muted-foreground">kWh/month</p>
                </div>
                <div className="rounded-xl border border-border bg-card p-4 text-center">
                  <p className="mb-1 text-xs font-bold uppercase tracking-widest text-muted-foreground">Annual Output</p>
                  <p className="text-2xl font-black text-foreground">{formatNumber(result.annualProduction, 0)}</p>
                  <p className="mt-1 text-xs text-muted-foreground">kWh/year</p>
                </div>
                <div className="rounded-xl border border-border bg-card p-4 text-center">
                  <p className="mb-1 text-xs font-bold uppercase tracking-widest text-muted-foreground">Coverage</p>
                  <p className="text-2xl font-black text-foreground">{formatNumber(result.coveragePercent, 0)}%</p>
                  <p className="mt-1 text-xs text-muted-foreground">of entered usage</p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
                <div className="rounded-xl border border-border bg-card p-4 text-center">
                  <p className="mb-1 text-xs font-bold uppercase tracking-widest text-muted-foreground">Per Panel Output</p>
                  <p className="text-2xl font-black text-foreground">{formatNumber(result.panelProductionPerDay, 2)}</p>
                  <p className="mt-1 text-xs text-muted-foreground">kWh/day each</p>
                </div>
                <div className="rounded-xl border border-border bg-card p-4 text-center">
                  <p className="mb-1 text-xs font-bold uppercase tracking-widest text-muted-foreground">Roof Area Needed</p>
                  <p className="text-2xl font-black text-foreground">{formatNumber(result.roofAreaRequired, 0)}</p>
                  <p className="mt-1 text-xs text-muted-foreground">sq ft</p>
                </div>
                <div className="rounded-xl border border-border bg-card p-4 text-center">
                  <p className="mb-1 text-xs font-bold uppercase tracking-widest text-muted-foreground">Roof Fit Check</p>
                  <p className="text-2xl font-black text-foreground">
                    {result.roofFits === null ? "N/A" : result.roofFits ? "Fits" : "Tight"}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {result.maxPanelsByRoof === null ? "No roof limit entered" : `${result.maxPanelsByRoof} max panels by area`}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">Enter valid consumption, solar, and panel assumptions to estimate the array size.</p>
          )}

          <div className="rounded-2xl border border-yellow-500/15 bg-yellow-500/5 p-5">
            <div className="mb-3 flex items-center gap-2">
              <Construction className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />
              <h3 className="text-lg font-bold text-foreground">Planning note</h3>
            </div>
            <p className="text-sm leading-relaxed text-muted-foreground">
              This estimate assumes an average month and a simple roof-area model. Final solar design should also check local shading, panel orientation, inverter sizing, setbacks, and utility interconnection rules.
            </p>
          </div>
        </div>
      }
      howToTitle="How to Use the Solar Panel Calculator"
      howToIntro="A practical solar estimate starts with energy demand, local sun availability, and realistic system losses before turning the answer into panels and roof area."
      howSteps={[
        {
          title: "Enter the monthly energy usage",
          description: "Use a recent electric bill or a yearly average converted into monthly kilowatt-hours. This is the load you want the solar array to offset.",
        },
        {
          title: "Add your solar assumptions",
          description: "Enter peak sun hours per day, the wattage of the panel you want to use, and a system loss percentage to account for inverter losses, heat, dirt, and other real-world performance factors.",
        },
        {
          title: "Check the panel count and roof fit",
          description: "The calculator estimates system size, total panel count, energy production, and the roof area needed. If you enter usable roof space, it also checks whether the array is likely to fit.",
        },
      ]}
      formulaTitle="Solar Panel Formulas"
      formulaIntro="These simplified formulas are commonly used for first-pass solar planning before a detailed site survey or installer proposal."
      formulaCards={[
        {
          label: "Daily Energy Need",
          formula: "Daily Usage = Monthly kWh / 30",
          detail: "Converting monthly consumption into average daily demand makes it easier to compare the load with daily solar production.",
        },
        {
          label: "Panel Production",
          formula: "Panel kWh/day = (Panel Watts / 1000) x Sun Hours x (1 - Loss %)",
          detail: "Each panel produces energy based on its power rating, the available sun hours, and the expected system efficiency after losses.",
        },
        {
          label: "Panel Count",
          formula: "Panels Needed = ceil(Daily Usage / Panel kWh/day)",
          detail: "The result is rounded up because you cannot install a fraction of a panel in a real system.",
        },
      ]}
      examplesTitle="Solar Panel Examples"
      examplesIntro="These examples show how energy usage and sun availability change the number of panels required."
      examples={[
        {
          title: "Moderate Home Usage",
          value: "900 kWh/month",
          detail: "A home using 900 kWh each month needs about 30 kWh per day before solar sizing begins.",
        },
        {
          title: "Typical 400 W Panel",
          value: "1.60 kWh/day",
          detail: "At 5 sun hours and 20% system loss, one 400 W panel produces about 1.6 kWh per day.",
        },
        {
          title: "Estimated Array",
          value: "19 Panels",
          detail: "That same usage profile would need roughly 19 panels, or about a 7.6 kW array, to offset the load.",
        },
      ]}
      contentTitle="Why Solar Estimates Need More Than Just Panel Wattage"
      contentIntro="Solar planning looks simple on the surface, but a useful estimate depends on both the energy target and the site conditions that affect production."
      contentSections={[
        {
          title: "Why sun hours matter",
          paragraphs: [
            "Two homes with the same monthly electric bill may need different array sizes if one location receives more peak sun hours than the other. Better solar exposure means each panel produces more energy each day.",
            "That is why local solar maps and installer proposals focus heavily on sun hours, orientation, and shading rather than only panel wattage.",
          ],
        },
        {
          title: "Why system loss should not be ignored",
          paragraphs: [
            "Real systems lose energy through inverter conversion, wiring, temperature, dust, and imperfect installation conditions. Ignoring those losses usually makes a spreadsheet estimate look better than the installed system will perform.",
            "Including a loss factor keeps the result conservative enough for planning without pretending the system will operate at lab conditions all year.",
          ],
        },
        {
          title: "Why roof area is a useful second check",
          paragraphs: [
            "A panel count may look reasonable in energy terms but still fail once the layout is compared with usable roof area. Vents, setbacks, orientation, and awkward roof geometry can all reduce the practical installation space.",
            "This calculator treats roof fit as a fast screening check. Final layouts should always be confirmed from actual module dimensions and a site-specific roof plan.",
          ],
        },
      ]}
      faqs={[
        {
          q: "How many solar panels does a house usually need?",
          a: "It depends mainly on monthly electricity usage, local sun hours, panel wattage, and system losses. A typical home might need anywhere from a small one-digit panel count to several dozen panels.",
        },
        {
          q: "What are peak sun hours?",
          a: "Peak sun hours describe the equivalent number of hours per day when sunlight averages the same energy intensity used for solar production estimates. They are not the same as total daylight hours.",
        },
        {
          q: "Why does the calculator include system loss?",
          a: "Because real solar systems do not convert every watt of panel nameplate power into delivered electricity. Losses from heat, inverter efficiency, wiring, dirt, and mismatch reduce actual output.",
        },
        {
          q: "Is this enough for a final solar purchase decision?",
          a: "No. This tool is for planning and comparison. Final solar design should verify shading, orientation, utility rules, actual module dimensions, and the installer's production model.",
        },
      ]}
      relatedTools={[
        { title: "Electrical Load Calculator", href: "/construction/electrical-load-calculator", benefit: "Estimate the electrical demand the array is trying to offset." },
        { title: "Roof Area Calculator", href: "/construction/roof-area-calculator", benefit: "Measure roof space before checking panel fit." },
        { title: "Material Cost Calculator", href: "/construction/material-cost-calculator", benefit: "Turn system size and component counts into a rough budget." },
      ]}
      quickFacts={[
        { label: "Best For", value: "Early Solar Planning", detail: "Useful for homeowner research and first-pass feasibility checks." },
        { label: "Core Output", value: "Panels And kW Size", detail: "Shows array size, output estimate, and required roof area." },
        { label: "Important Note", value: "Site Survey Still Matters", detail: "Shading, setbacks, and orientation can change the final design." },
      ]}
    />
  );
}
