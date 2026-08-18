export const DEFAULT_SOPS = [
  {
    id: "matcha-latte-sop",
    category: "Recipes",
    title: "Iced & Hot Matcha Latte (Sizes M & L)",
    lastUpdated: "2026-08-15",
    content: `
Matcha Latte Preparation Standard Operating Procedure (SOP)

Target Drinks: Hot Matcha Latte & Iced Matcha Latte (Size M: 12oz, Size L: 16oz).

1. Ingredients & Measurements:
- Size M (12oz): 2 scoops (approx 4g) Ceremonial Grade Matcha powder, 40ml hot water (80°C / 175°F), 200ml oat or whole milk, 15ml vanilla syrup (optional).
- Size L (16oz): 3 scoops (approx 6g) Ceremonial Grade Matcha powder, 60ml hot water (80°C / 175°F), 280ml oat or whole milk, 20ml vanilla syrup (optional).

2. Whisking Technique:
- Place matcha powder into the bamboo or stainless steel whisking bowl.
- Pour 80°C water (do NOT use boiling water 100°C as it burns the matcha and causes bitterness).
- Whisk vigorously in a "W" or "Z" motion for 25-30 seconds until a fine, creamy foam layer forms on top.

3. Assembly - Hot Matcha Latte:
- Steam milk to 60°C - 65°C (140°F - 150°F) in a stainless steel pitcher until microfoam is achieved.
- Pour steamed milk over whisked matcha base, finishing with latte art microfoam layer.

4. Assembly - Iced Matcha Latte:
- Fill serving glass 3/4 full with clean ice cubes.
- Pour cold milk over ice.
- Pour whisked green matcha foam slowly over top milk layer to create a distinct two-layer visual gradient.

Safety Warning: Hot water dispenser is set to 80°C. Keep pitcher spout directed away from skin when steaming milk to avoid steam burns.
`,
    metadata: {
      tags: ["matcha", "latte", "recipe", "barista", "size L", "size M"],
      steps: [
        { title: "Measure Powder", desc: "M: 2 scoops (4g), L: 3 scoops (6g) Ceremonial Matcha into bowl." },
        { title: "Whisk Base", desc: "Pour 80°C hot water (M: 40ml, L: 60ml). Whisk in 'W' motion for 30s until frothy." },
        { title: "Prepare Milk", desc: "Hot: Steam milk to 65°C. Iced: Fill cup with ice and 200ml/280ml cold milk." },
        { title: "Combine & Serve", desc: "Pour milk into matcha base (Hot) or float whisked matcha over iced milk (Iced)." }
      ],
      warning: "Never use 100°C boiling water on matcha powder. Always steam milk below 70°C to prevent scalding.",
      ingredients: [
        { name: "Matcha Powder", qty: "M: 4g / L: 6g" },
        { name: "Water Temp", qty: "80°C (175°F)" },
        { name: "Milk Volume", qty: "M: 200ml / L: 280ml" },
        { name: "Vanilla Syrup", qty: "M: 15ml / L: 20ml" }
      ]
    }
  },
  {
    id: "espresso-e02-error-sop",
    category: "Equipment Repair",
    title: "Espresso Machine Error E-02 (High Boiler Pressure Alert)",
    lastUpdated: "2026-08-10",
    content: `
Espresso Machine Error Code E-02 Emergency Response SOP

Applies to: Commercial Dual-Boiler Espresso Machines (La Marzocco / Nuova Simonelli / Synesso).

Symptom: Red warning light flashing on display, buzzer sounding, error code "E-02 OVERPRESSURE DETECTED". Pressure gauge reading above 2.2 Bar (normal range 1.1 - 1.3 Bar).

1. Immediate Emergency Action:
- STEP 1: IMMEDIATELY flip the main power toggle switch to OFF (0 position). Do NOT attempt to pull another espresso shot.
- STEP 2: CAUTION HOT STEAM. Open both steam wands fully into empty stainless steel pitchers to vent excess pressure safely. Keep hands clear of wand tip nozzle.

2. Diagnostic & Reset Protocol:
- STEP 3: Check the water inlet valve behind the machine. Ensure main water supply line is fully open and water filter pressure gauge is at 3-4 Bar.
- STEP 4: Inspect anti-vacuum valve on top plate for limescale blockage or stuck pin.
- STEP 5: Allow machine to cool for 10 minutes until steam pressure drops to 0 Bar.
- STEP 6: Turn main power ON (1 position). If E-02 clears and pressure stabilizes at 1.2 Bar, machine is ready for usage.

3. Escalation Trigger:
- If Error E-02 reappears within 5 minutes of turning back on, DO NOT USE MACHINE. Place "OUT OF SERVICE" tag and contact Master Technician immediately.

Safety Warning: HIGH PRESSURE RISK! Boiler pressure above 2.5 Bar can blow pressure release valve. Vent steam carefully before inspecting internals.
`,
    metadata: {
      tags: ["e-02", "e02", "error", "espresso machine", "high pressure", "repair", "overpressure"],
      steps: [
        { title: "Power OFF Immediately", desc: "Turn off main red power switch on machine side panel." },
        { title: "Vent Steam Pressure", desc: "Purge steam wands fully into empty pitchers to release excess boiler pressure." },
        { title: "Check Water Inlet", desc: "Verify water line valve is completely open and water filter isn't blocked." },
        { title: "Cooling & Restart", desc: "Wait 10 mins until pressure reads 0 Bar, then flip power back ON." }
      ],
      warning: "CAUTION HOT STEAM! Do not place hands near steam wand tips while purging excess pressure.",
      ingredients: [
        { name: "Normal Pressure", qty: "1.1 - 1.3 Bar" },
        { name: "Error Pressure", qty: "> 2.2 Bar" },
        { name: "Cooling Time", qty: "10 Minutes" }
      ]
    }
  },
  {
    id: "closing-sanitization-sop",
    category: "Safety & Compliance",
    title: "Daily Closing Sanitization & Hygiene Checklist",
    lastUpdated: "2026-08-01",
    content: `
Café End-of-Shift Sanitization & Hygiene Protocol

Objective: Complete 15-minute closing sanitization checklist to maintain 100% health inspection rating and prevent bacterial contamination in milk lines.

1. Espresso Group Head Backflush:
- Insert blind rubber filter disc into portafilter.
- Add 1 scoop (3g) Cafiza espresso cleaning powder.
- Lock portafilter into group head, engage pump for 10 seconds, pause 5 seconds. Repeat 5 times per group head.
- Rinse portafilter thoroughly and backflush with clean water 5 times.

2. Milk Steam Wand Sanitization:
- Fill steaming pitcher with 500ml warm water + 30ml Rinza milk line cleaner.
- Submerge steam wand tip and soak for 5 minutes.
- Purge steam for 10 seconds, then wipe clean with dedicated yellow microfiber cloth.

3. Coffee Grinder Hopper & Burrs:
- Close hopper gate, remove remaining beans into sealed container.
- Wipe inner hopper walls with food-safe sanitizer wipes (do NOT submerge hopper in water).

4. Counter & Chemical Storage:
- Spray down all stainless steel countertops with Quat sanitizer solution.
- Store sanitizing chemicals in designated chemical cabinet below sink, NEVER next to syrups or coffee beans.

Safety Warning: Chemical handling requires protective rubber gloves. Do not mix Cafiza or Rinza cleaners with bleach or hot boiling water.
`,
    metadata: {
      tags: ["sanitization", "cleaning", "closing", "hygiene", "backflush", "cafiza"],
      steps: [
        { title: "Backflush Group Heads", desc: "Use blind filter + 3g Cafiza. Run 5 cycles of 10s on / 5s off." },
        { title: "Soak Steam Wands", desc: "Submerge steam wands in 500ml water + 30ml Rinza solution for 5 mins." },
        { title: "Clean Bean Hopper", desc: "Empty beans into sealed tub. Wipe hopper interior with food-safe wipe." },
        { title: "Sanitize Countertops", desc: "Wipe down surfaces with Quat sanitizer. Lock chemicals in lower cabinet." }
      ],
      warning: "Wear protective gloves when handling chemical cleaning powders. Keep chemicals away from coffee beans.",
      ingredients: [
        { name: "Cafiza Powder", qty: "3g per group" },
        { name: "Rinza Solution", qty: "30ml in 500ml" },
        { name: "Soak Duration", qty: "5 Minutes" }
      ]
    }
  }
];
