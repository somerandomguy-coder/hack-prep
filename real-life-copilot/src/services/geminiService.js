/**
 * Service for Gemini API integration with local smart fallback generator
 */

export async function askCopilot(userQuery, searchResult, apiKey = null) {
  const { sop, context } = searchResult;

  // System Prompt instructing Gemini to produce structured JSON
  const systemPrompt = `You are ShiftFlow, an AI Voice Copilot for physical and shift workers.
Your task is to answer the worker's voice question based strictly on the provided SOP Context.

SOP Context:
"""
${context}
"""

Worker Question: "${userQuery}"

CRITICAL INSTRUCTIONS:
1. 'spokenAnswer' MUST be concise (1-2 sentences max), clear, and direct so it can be spoken out loud over headset in 3 seconds.
2. 'visualCard' MUST extract or format clean step-by-step instructions.

Return ONLY a valid JSON object matching this schema without markdown codeblocks:
{
  "spokenAnswer": "Short 1-2 sentence spoken answer.",
  "visualCard": {
    "title": "${sop.title}",
    "category": "${sop.category}",
    "steps": [
      { "title": "Step 1 Title", "desc": "Step 1 description" }
    ],
    "warning": "Safety alert or warning if any",
    "ingredients": [
      { "name": "Item/Spec", "qty": "Value" }
    ]
  }
}`;

  if (apiKey && apiKey.trim() !== '') {
    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: systemPrompt }] }]
          })
        }
      );

      if (response.ok) {
        const data = await response.json();
        const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
        const cleanJson = rawText.replace(/```json/g, '').replace(/```/g, '').trim();
        const parsed = JSON.parse(cleanJson);
        if (parsed.spokenAnswer && parsed.visualCard) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn("Gemini API call failed or rate limited, falling back to local smart synthesizer", e);
    }
  }

  // Smart Local Fallback (Zero-cost, instant response fallback)
  return buildLocalFallbackResponse(userQuery, sop);
}

/**
 * Intelligent local response generator when offline or no API key present
 */
function buildLocalFallbackResponse(query, sop) {
  let spoken = "";
  if (sop.id === "matcha-latte-sop") {
    spoken = query.toLowerCase().includes("size l") || query.toLowerCase().includes("large")
      ? "For a Large Matcha Latte, whisk 3 scoops of matcha with 60ml of 80°C hot water for 30 seconds, then add 280ml milk."
      : "For a Matcha Latte, whisk ceremonial matcha powder with 80°C hot water in a W motion for 30 seconds before adding milk.";
  } else if (sop.id === "espresso-e02-error-sop") {
    spoken = "Error E-02 indicates dangerous overpressure. Immediately switch off main power and fully open both steam wands into empty pitchers to vent pressure.";
  } else if (sop.id === "closing-sanitization-sop") {
    spoken = "For closing sanitization, backflush group heads 5 times using 3 grams of Cafiza powder and soak steam wands in Rinza solution for 5 minutes.";
  } else {
    spoken = `Here is the procedure for ${sop.title}. Follow the step-by-step visual guide on your display screen.`;
  }

  return {
    spokenAnswer: spoken,
    visualCard: {
      title: sop.title,
      category: sop.category,
      steps: sop.metadata?.steps || [
        { title: "Review Procedure", desc: sop.content.substring(0, 150) + "..." }
      ],
      warning: sop.metadata?.warning || null,
      ingredients: sop.metadata?.ingredients || []
    }
  };
}

/**
 * Generates 1-Minute Pre-Shift Quiz Questions
 */
export async function generatePreShiftQuiz(sopsList) {
  // Pre-configured high quality quiz questions derived from SOPs
  return [
    {
      id: "q1",
      question: "What is the correct water temperature when whisking Ceremonial Matcha powder?",
      options: [
        "100°C (Boiling water)",
        "80°C (175°F)",
        "50°C (Lukewarm water)",
        "Ice cold water"
      ],
      correctIndex: 1,
      explanation: "Boiling water (100°C) burns delicate matcha catechins causing intense bitterness. 80°C creates optimal umami foam."
    },
    {
      id: "q2",
      question: "Espresso machine displays Error Code E-02 (Overpressure). What is your FIRST emergency step?",
      options: [
        "Pull another espresso shot to relieve pressure",
        "Wipe the filter basket with a towel",
        "Flip main power switch to OFF immediately and open steam wands",
        "Pour cold water on the group head"
      ],
      correctIndex: 2,
      explanation: "E-02 signals dangerous boiler pressure over 2.2 Bar. Power OFF immediately and vent steam wands into pitchers."
    },
    {
      id: "q3",
      question: "Where should daily chemical cleaning products (Cafiza, Rinza, Quat) be stored?",
      options: [
        "Next to vanilla syrup bottles on top counter",
        "In locked chemical cabinet below sink, away from coffee beans",
        "Inside the bean hopper",
        "Under the coffee cups tray"
      ],
      correctIndex: 1,
      explanation: "Chemicals must be stored strictly in designated chemical cabinets away from consumables to prevent toxic cross-contamination."
    }
  ];
}
