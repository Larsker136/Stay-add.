/* ==========================================================================
   stay add. Biology — exam practice: Calculate it (with Read the graph) and Plan it
   StayAdd.drills[lesson][topic] = [question types], StayAdd.plans[lesson][topic] = practical
   Drawn by assets/js/practice.js, which explains every field.
   ========================================================================== */
(function () {
  "use strict";
  const SA = (window.StayAdd = window.StayAdd || {});
  SA.drills = SA.drills || {};
  SA.plans = SA.plans || {};
  const F = (n, sf) => SA.fmt(n, sf);

  Object.assign(SA.drills, {
    "organisation": {
      "size": [
        { id: "mag", title: "Magnification",
          v: ({ r }) => ({ img: r(10, 120), act: r(5, 200) }),
          q: ({ img, act }) => `A cell is ${act} µm across. In a drawing it is ${img} mm across. Calculate the magnification of the drawing.`,
          a: ({ img, act }) => (img * 1000) / act, unit: "×",
          steps: ({ img, act }) => [`Same units first: ${img} mm = ${img * 1000} µm`, `magnification = image size ÷ actual size = ${img * 1000} ÷ ${act}`],
          traps: ({ img, act }) => [[img / act, "The two sizes are in different units. Convert mm to µm (× 1000) first."], [act / (img * 1000), "You divided the wrong way round: image ÷ actual."]] },
        { id: "actual", title: "Actual size",
          v: ({ r, p }) => ({ img: r(10, 150), M: p([40, 100, 400, 1000, 1500, 4000]) }),
          q: ({ img, M }) => `An image of a cell is ${img} mm long at a magnification of ×${M}. Calculate the actual length of the cell in µm.`,
          a: ({ img, M }) => (img * 1000) / M, unit: "µm",
          steps: ({ img, M }) => [`actual size = image size ÷ magnification = ${img} ÷ ${M} = ${F(img / M)} mm`, `mm → µm: × 1000`],
          traps: ({ img, M }) => [[img / M, "That is in mm. Multiply by 1000 to give µm."], [img * M, "You multiplied. Actual size = image size ÷ magnification."]] }
      ]
    },

    "movement": {
      "osmosis": [
        { id: "pct-mass", title: "Percentage change in mass",
          v: ({ r }) => { const m1 = r(1.5, 4, 0.01); let f = r(-0.25, 0.2, 0.01); if (!f) f = 0.05; return { m1, m2: +(m1 * (1 + f)).toFixed(2) }; },
          q: ({ m1, m2 }) => `A potato cylinder has a mass of ${m1.toFixed(2)} g. After an hour in a sugar solution its mass is ${m2.toFixed(2)} g. Calculate the percentage change in mass. (Use − for a loss.)`,
          a: ({ m1, m2 }) => ((m2 - m1) / m1) * 100, unit: "%", tol: 0.02,
          steps: ({ m1, m2 }) => [`change = final − initial = ${m2.toFixed(2)} − ${m1.toFixed(2)} = ${F(m2 - m1)} g`, `% change = change ÷ initial mass × 100 = ${F(m2 - m1)} ÷ ${m1.toFixed(2)} × 100`],
          traps: ({ m1, m2 }) => [[-((m2 - m1) / m1) * 100, `Check the sign: the mass ${m2 > m1 ? "went up, so the change is positive" : "went down, so the change is negative"}.`], [((m2 - m1) / m2) * 100, "Divide by the starting mass, not the final mass."], [m2 - m1, "That is the change in grams. Divide by the starting mass and × 100."]] }
      ]
    },

    "ecology": {
      "chains": [
        { id: "efficiency", title: "Energy transfer between levels",
          v: ({ r }) => { const e1 = r(1000, 50000, 500); return { e1, e2: Math.round(e1 * r(0.05, 0.2, 0.01)) }; },
          q: ({ e1, e2 }) => `Producers in a food chain hold ${e1} kJ of energy; the primary consumers get ${e2} kJ. Calculate the percentage of energy transferred.`,
          a: ({ e1, e2 }) => (e2 / e1) * 100, unit: "%",
          steps: ({ e1, e2 }) => [`% transferred = energy at the next level ÷ energy at this level × 100`, `= ${e2} ÷ ${e1} × 100`],
          traps: ({ e1, e2 }) => [[e2 / e1, "Multiply by 100 for a percentage."], [(e1 / e2) * 100, "You divided the wrong way round."]] }
      ],
      "populations": [
        { id: "bacteria", title: "Bacterial growth",
          v: ({ r, p }) => ({ n0: p([100, 200, 500, 1000]), d: p([20, 30]), k: r(2, 6) }),
          q: ({ n0, d, k }) => `A population of ${n0} bacteria doubles every ${d} minutes. How many bacteria will there be after ${d * k} minutes, if nothing limits their growth?`,
          a: ({ n0, k }) => n0 * 2 ** k, unit: "", tol: 0,
          steps: ({ n0, d, k }) => [`${d * k} ÷ ${d} = ${k} doublings`, `${Array.from({ length: k + 1 }, (_, i) => n0 * 2 ** i).join(" → ")}`],
          traps: ({ n0, k }) => [[n0 * 2 * k, "The population doubles each time — multiply by 2 again and again, not by 2 × the number of doublings."]] }
      ]
    },

    "transport-animals": {
      "heart": [
        { id: "pulse", title: "Heart rate from a pulse count",
          v: ({ r, p }) => { const s = p([10, 15, 20, 30]); return { s, b: Math.round((r(55, 160) * s) / 60) }; },
          q: ({ s, b }) => `A student counts ${b} pulse beats in ${s} seconds. Calculate the heart rate in beats per minute.`,
          a: ({ s, b }) => (b * 60) / s, unit: "beats/min",
          steps: ({ s, b }) => [`60 ÷ ${s} = ${60 / s}, so multiply the count by ${60 / s}`, `${b} × ${60 / s}`],
          traps: ({ s, b }) => [[b, "That is the count for " + s + " seconds. Scale it up to 60 seconds."]] }
      ]
    },

    "inheritance": {
      "crosses": [
        { id: "cross", title: "Chance from a genetic cross",
          v: ({ p }) => ({ c: p([
            ["Tt × Tt", "short (tt)", 25, "T = tall, t = short"],
            ["Tt × Tt", "tall", 75, "T = tall, t = short"],
            ["Tt × tt", "short (tt)", 50, "T = tall, t = short"],
            ["TT × tt", "short (tt)", 0, "T = tall, t = short"],
            ["Bb × bb", "blue-eyed (bb)", 50, "B = brown, b = blue"],
            ["Ff × Ff", "affected by cystic fibrosis (ff)", 25, "F = unaffected, f = cystic fibrosis"],
            ["IᴬIᴼ × IᴮIᴼ", "blood group O", 25, "Iᴬ and Iᴮ codominant, Iᴼ recessive"],
            ["IᴬIᴼ × IᴮIᴼ", "blood group AB", 25, "Iᴬ and Iᴮ codominant, Iᴼ recessive"],
            ["XᴮXᵇ × XᴮY", "a colour-blind son, out of all children", 25, "Xᵇ = colour blind"]
          ]) }),
          q: ({ c }) => `Parents ${c[0]} (${c[3]}). What is the percentage chance that a child is ${c[1]}?`,
          a: ({ c }) => c[2], unit: "%", tol: 0,
          steps: ({ c }) => [`Draw a Punnett square for ${c[0]}: each parent's two alleles along one side`, `Count the boxes that give ${c[1]}, out of 4: ${c[2] / 25} out of 4 = ${c[2]}%`] }
      ]
    },

    "enzymes": {
      "temp": [
        { id: "optimum", title: "Optimum temperature from a graph",
          v: ({ p }) => ({ opt: p([30, 35, 40, 45, 50]) }),
          q: () => `The graph shows the rate of an enzyme-controlled reaction at different temperatures. What is the optimum temperature of the enzyme?`,
          a: ({ opt }) => opt, unit: "°C", tol: 0.04,
          graph: ({ opt }) => { const pts = []; for (let t = 0; t <= 70; t += 1) { const rate = t <= opt ? 10 * Math.pow(t / opt, 1.8) : Math.max(0, 10 * (1 - Math.pow((t - opt) / 14, 1.6))); pts.push([t, rate]); } return { x: { label: "temperature / °C", max: 70, step: 10 }, y: { label: "rate of reaction (arbitrary units)", max: 12, step: 2 }, lines: [{ pts, tc: "var(--c-bio)" }] }; },
          show: ({ opt }) => ({ read: [[opt, 10]] }),
          steps: ({ opt }) => [`The optimum is where the rate is highest: the peak of the curve`, `Read down from the peak to the temperature axis: ${opt} °C`] }
      ]
    },

    "plant-nutrition": {
      "limits": [
        { id: "bubbles", title: "Rate from a bubble count",
          v: ({ r, p }) => { const m = p([2, 3, 4, 5]); return { m, n: r(10, 120) }; },
          q: ({ m, n }) => `A piece of pondweed gives off ${n} bubbles in ${m} minutes. Calculate the rate of photosynthesis in bubbles per minute.`,
          a: ({ m, n }) => n / m, unit: "bubbles/min",
          steps: ({ m, n }) => [`rate = number of bubbles ÷ time = ${n} ÷ ${m}`],
          traps: ({ m, n }) => [[n * m, "You multiplied. Rate = bubbles ÷ time."]] },
        { id: "light-graph", title: "Rate from a light-intensity graph",
          v: ({ p }) => ({ top: p([20, 24, 30]), k: p([0.07, 0.1, 0.14]), at: p([10, 20, 30]) }),
          q: ({ at }) => `The graph shows how light intensity affects the rate of photosynthesis. Use it to find the rate at a light intensity of ${at} units.`,
          a: ({ top, k, at }) => top * (1 - Math.exp(-k * at)), unit: "bubbles/min", tol: 0.06,
          graph: ({ top, k }) => { const pts = []; for (let x = 0; x <= 60; x += 1) pts.push([x, top * (1 - Math.exp(-k * x))]); return { x: { label: "light intensity (arbitrary units)", max: 60, step: 10 }, y: { label: "rate / (bubbles/min)", max: Math.ceil((top + 4) / 4) * 4, step: 4, minor: 2 }, lines: [{ pts, tc: "var(--c-bio)" }] }; },
          show: ({ top, k, at }) => ({ read: [[at, top * (1 - Math.exp(-k * at))]] }),
          steps: ({ top, k, at }) => [`Go up from ${at} to the curve, then across to the rate axis`, `It reads about ${F(top * (1 - Math.exp(-k * at)), 2)} bubbles/min (within half a small square is fine)`] }
      ]
    }
  });

  Object.assign(SA.plans, {
    "enzymes": {
      "temp": {
        title: "Amylase and temperature", setup: "You mix amylase with starch at different temperatures and test drops with iodine every 30 seconds until the starch has gone.",
        iv: { a: "the temperature of the water bath", x: ["the time for the starch to disappear", "the colour of the iodine"], why: "You choose the temperature for each run." },
        dv: { a: "the time until iodine no longer turns blue-black", x: ["the temperature of the water bath", "the volume of amylase"], why: "You time it; a shorter time means a faster reaction." },
        cv: { a: ["the volume and concentration of the amylase", "the volume and concentration of the starch"], x: ["the temperature of the water bath", "the time for the starch to disappear"], why: "More enzyme or less starch would change the time, whatever the temperature." },
        more: [{ q: "Why leave the starch and the amylase in the water bath separately for a few minutes before mixing?", a: "So both reach the test temperature before the reaction starts", x: ["To let the enzyme multiply", "To denature the enzyme first", "So the iodine can react"], why: "Otherwise the reaction would start at the wrong temperature." }]
      },
      "ph": {
        title: "Amylase and pH", setup: "You digest starch with amylase in buffer solutions of different pH, at a constant temperature.",
        iv: { a: "the pH of the buffer solution", x: ["the time for the starch to disappear", "the temperature"], why: "You choose which buffer to add." },
        dv: { a: "the time until the starch has been digested", x: ["the pH of the buffer", "the volume of iodine"], why: "You time it using the iodine test." },
        cv: { a: ["the temperature", "the volume and concentration of the amylase"], x: ["the pH of the buffer", "the time for the starch to disappear"], why: "Temperature and the amount of enzyme also change the rate." },
        more: [{ q: "Why use a buffer solution?", a: "It keeps the pH constant during the experiment", x: ["It speeds up the enzyme", "It turns blue-black with starch", "It stops the enzyme denaturing at any pH"], why: "The pH must not drift, or you couldn't link the rate to one pH." }]
      }
    },
    "movement": {
      "osmosis": {
        title: "Potato cylinders in sugar solution", setup: "You put potato cylinders into sugar solutions of different concentrations and weigh them before and after.",
        iv: { a: "the concentration of the sugar solution", x: ["the percentage change in mass", "the length of the cylinders"], why: "You make up the different solutions." },
        dv: { a: "the percentage change in mass of the cylinders", x: ["the concentration of the solution", "the time in the solution"], why: "You calculate it from the masses before and after." },
        cv: { a: ["the size of the cylinders", "the time they spend in the solution"], x: ["the concentration of the solution", "the percentage change in mass"], why: "Bigger cylinders or longer times change how much water moves." },
        more: [{ q: "Why blot the cylinders dry before weighing them at the end?", a: "Solution on the surface would add mass that was not absorbed", x: ["To stop osmosis continuing", "To make them lighter on purpose", "To remove the potato skin"], why: "Only water that moved into or out of the cells should count." }]
      }
    },
    "plant-nutrition": {
      "limits": {
        title: "Pondweed and light", setup: "You move a lamp to different distances from a piece of pondweed and count the bubbles it gives off.",
        iv: { a: "the light intensity (distance of the lamp)", x: ["the number of bubbles per minute", "the temperature of the water"], why: "You change it by moving the lamp." },
        dv: { a: "the number of bubbles per minute", x: ["the distance of the lamp", "the length of the pondweed"], why: "You count them; more bubbles means faster photosynthesis." },
        cv: { a: ["the temperature of the water", "the carbon dioxide concentration"], x: ["the distance of the lamp", "the number of bubbles per minute"], why: "Temperature and CO₂ are also limiting factors, so they must not change." },
        more: [{ q: "Why wait a few minutes at each new distance before counting?", a: "So the rate of photosynthesis can settle at the new light intensity", x: ["So the pondweed can grow", "To let the water cool down completely", "So the bubbles get bigger"], why: "Counting straight away would mix the old rate with the new one." }]
      }
    },
    "transport-plants": {
      "transpiration": {
        title: "A bubble potometer", setup: "You measure how far an air bubble moves along a capillary tube as a leafy shoot takes up water, with and without a fan.",
        iv: { a: "the air movement (fan on or off)", x: ["the distance the bubble moves", "the length of the capillary tube"], why: "You choose the condition." },
        dv: { a: "the distance the bubble moves in a set time", x: ["the air movement", "the number of leaves"], why: "You read it from the scale." },
        cv: { a: ["the same shoot", "the temperature and light intensity"], x: ["the air movement", "the distance the bubble moves"], why: "A different shoot, or more heat or light, would change the rate of water uptake." },
        more: [{ q: "Why must the potometer be airtight?", a: "Air leaking in would move the bubble without water being taken up", x: ["To stop the shoot wilting", "To keep the light out", "So the shoot can't transpire"], why: "The bubble must move only because the shoot takes up water." }]
      }
    },
    "gas-exchange": {
      "air": {
        title: "Exercise and breathing", setup: "You count breaths per minute at rest, after one minute of step-ups and after two minutes.",
        iv: { a: "how long the exercise lasts", x: ["the number of breaths per minute", "the person's height"], why: "You choose the length of exercise." },
        dv: { a: "the number of breaths per minute", x: ["how long the exercise lasts", "the height of the step"], why: "You count them straight after the exercise." },
        cv: { a: ["the same type of exercise (same step height and pace)", "the same person"], x: ["how long the exercise lasts", "the number of breaths per minute"], why: "Harder exercise, or a different person, would change the breathing rate." },
        more: [{ q: "Why repeat the test with several people?", a: "To see whether the pattern is the same, since people differ", x: ["To make each person fitter", "To remove the need for a control", "Because one person can only breathe once a minute"], why: "Repeats and more people make the results more reliable." }]
      }
    },
    "respiration": {
      "energy": {
        title: "A respirometer with germinating seeds", setup: "You measure how far a drop of coloured liquid moves in a respirometer holding germinating seeds at different temperatures.",
        iv: { a: "the temperature", x: ["the distance the liquid moves", "the mass of soda lime"], why: "You set it with a water bath." },
        dv: { a: "the distance the liquid moves in a set time", x: ["the temperature", "the type of seed"], why: "It moves as the seeds use up oxygen." },
        cv: { a: ["the mass and type of seeds", "the amount of soda lime"], x: ["the temperature", "the distance the liquid moves"], why: "More seeds, or less CO₂ absorbed, would change the movement whatever the temperature." },
        more: [{ q: "What is the soda lime for?", a: "It absorbs the carbon dioxide, so the liquid moves only because oxygen is used", x: ["It gives the seeds energy", "It keeps the seeds warm", "It produces oxygen"], why: "Without it, the CO₂ given out would replace the O₂ used and the liquid would barely move." }]
      }
    }
  });
})();
