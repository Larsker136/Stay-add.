/* ==========================================================================
   stay add. Physics — exam practice: Calculate it (with Read the graph) and Plan it
   StayAdd.drills[lesson][topic] = [question types], StayAdd.plans[lesson][topic] = practical
   Drawn by assets/js/practice.js, which explains every field. g = 9.8 N/kg throughout.
   ========================================================================== */
(function () {
  "use strict";
  const SA = (window.StayAdd = window.StayAdd || {});
  SA.drills = SA.drills || {};
  SA.plans = SA.plans || {};
  const F = (n, sf) => SA.fmt(n, sf);
  const ceilTo = (x, s) => Math.ceil(x / s) * s;
  const deg = (r) => (r * 180) / Math.PI, rad = (d) => (d * Math.PI) / 180;
  const G = 9.8;

  Object.assign(SA.drills, {
    "ph-motion-forces-energy": {
      "measurement": [
        { id: "resultant", title: "Resultant force",
          v: ({ r }) => ({ a: r(3, 24), b: r(3, 24) }),
          q: ({ a, b }) => `Two forces of ${a} N and ${b} N act on an object at right angles to each other. Calculate the size of the resultant force.`,
          a: ({ a, b }) => Math.hypot(a, b), unit: "N",
          steps: ({ a, b }) => [`At right angles, use Pythagoras: R² = ${a}² + ${b}²`, `R² = ${a * a} + ${b * b} = ${a * a + b * b}`, `R = √${a * a + b * b}`],
          traps: ({ a, b }) => [[a + b, "You added the forces. That only works when they act in the same direction; at right angles use Pythagoras."], [Math.abs(a - b), "You subtracted the forces. At right angles use Pythagoras."]] },
        { id: "period", title: "Period of a pendulum",
          v: ({ r, p }) => ({ n: p([10, 20]), tot: r(9, 44, 0.1) }),
          q: ({ n, tot }) => `A student times ${n} complete swings of a pendulum and gets ${tot} s. Calculate the period of the pendulum.`,
          a: ({ n, tot }) => tot / n, unit: "s",
          steps: ({ n, tot }) => [`Period = time for one swing = total time ÷ number of swings`, `T = ${tot} ÷ ${n}`],
          traps: ({ n, tot }) => [[tot, "That is the time for all the swings. Divide by the number of swings."], [n / tot, "You divided the wrong way round: total time ÷ number of swings."]] }
      ],
      "motion": [
        { id: "accel", title: "Acceleration",
          v: ({ r }) => { const u = r(0, 15); return { u, v: u + r(4, 24), t: r(2, 10) }; },
          q: ({ u, v, t }) => `A car speeds up from ${u} m/s to ${v} m/s in ${t} s. Calculate its acceleration.`,
          a: ({ u, v, t }) => (v - u) / t, unit: "m/s²",
          steps: ({ u, v, t }) => [`a = (v − u) ÷ t`, `a = (${v} − ${u}) ÷ ${t}`, `a = ${v - u} ÷ ${t}`],
          traps: ({ u, v, t }) => u ? [[v / t, "You used only the final speed. Acceleration uses the change in speed, v − u."]] : [] },
        { id: "avg-speed", title: "Average speed",
          v: ({ r }) => ({ d: r(2, 30, 0.5), t: r(5, 60) }),
          q: ({ d, t }) => `A cyclist travels ${d} km in ${t} minutes. Calculate the average speed in m/s.`,
          a: ({ d, t }) => (d * 1000) / (t * 60), unit: "m/s",
          steps: ({ d, t }) => [`Convert: ${d} km = ${d * 1000} m and ${t} min = ${t * 60} s`, `speed = distance ÷ time = ${d * 1000} ÷ ${t * 60}`],
          traps: ({ d, t }) => [[d / t, "You left the units as km and minutes. Convert to metres and seconds first."], [(d * 1000) / t, "You converted the distance but not the time: minutes × 60 = seconds."], [d / (t * 60), "You converted the time but not the distance: km × 1000 = m."]] },
        { id: "st-gradient", title: "Gradient of a speed–time graph",
          v: ({ r, p }) => { const V = p([8, 10, 12, 16, 20]), t1 = r(2, 6), t2 = t1 + r(3, 6), t3 = t2 + r(2, 5); return { V, t1, t2, t3 }; },
          q: ({ t1 }) => `The graph shows a journey. Calculate the acceleration during the first ${t1} s.`,
          a: ({ V, t1 }) => V / t1, unit: "m/s²",
          graph: ({ V, t1, t2, t3 }) => ({ x: { label: "time / s", max: ceilTo(t3 + 1, 2), step: 2 }, y: { label: "speed / (m/s)", max: ceilTo(V + 2, 4), step: 4 }, lines: [{ pts: [[0, 0], [t1, V], [t2, V], [t3, 0]], tc: "var(--c-mech)" }] }),
          show: ({ V, t1 }) => ({ tri: [[0, 0], [t1, V]] }),
          steps: ({ V, t1 }) => [`Acceleration = gradient = change in speed ÷ time`, `= (${V} − 0) ÷ (${t1} − 0)`],
          traps: ({ V, t1 }) => [[V * t1, "You multiplied. The gradient is the change in speed divided by the time."], [t1 / V, "You divided the wrong way round: speed ÷ time."]] },
        { id: "st-area", title: "Area under a speed–time graph",
          v: ({ r, p }) => { const V = p([8, 10, 12, 16, 20]), t1 = r(2, 6), t2 = t1 + r(3, 6), t3 = t2 + r(2, 5); return { V, t1, t2, t3 }; },
          q: () => `The graph shows a journey. Calculate the total distance travelled.`,
          a: ({ V, t1, t2, t3 }) => 0.5 * V * t1 + V * (t2 - t1) + 0.5 * V * (t3 - t2), unit: "m",
          graph: ({ V, t1, t2, t3 }) => ({ x: { label: "time / s", max: ceilTo(t3 + 1, 2), step: 2 }, y: { label: "speed / (m/s)", max: ceilTo(V + 2, 4), step: 4 }, lines: [{ pts: [[0, 0], [t1, V], [t2, V], [t3, 0]], tc: "var(--c-mech)" }] }),
          show: ({ V, t1, t2, t3 }) => ({ area: [[0, 0], [t1, V], [t2, V], [t3, 0]] }),
          steps: ({ V, t1, t2, t3 }) => [`Distance = area under the line: a triangle, a rectangle and a triangle`, `½ × ${t1} × ${V} = ${F(0.5 * V * t1)}`, `${t2 - t1} × ${V} = ${V * (t2 - t1)}`, `½ × ${t3 - t2} × ${V} = ${F(0.5 * V * (t3 - t2))}`, `Add them up`],
          traps: ({ V, t3 }) => [[V * t3, "You used one rectangle for the whole journey. Split the area into triangles and a rectangle."]] }
      ],
      "mass-weight": [
        { id: "weight", title: "Weight on another world",
          v: ({ r, p }) => ({ m: r(2, 90), w: p([["the Moon", 1.6], ["Mars", 3.7], ["Earth", 9.8], ["Jupiter", 24.8]]) }),
          q: ({ m, w }) => `An object has a mass of ${m} kg. Calculate its weight on ${w[0]}, where g = ${w[1]} N/kg.`,
          a: ({ m, w }) => m * w[1], unit: "N",
          steps: ({ m, w }) => [`W = m × g`, `W = ${m} × ${w[1]}`],
          traps: ({ m, w }) => [[m / w[1], "You divided. Weight = mass × gravitational field strength."], [m, "That is the mass, in kg. Weight is a force: multiply by g."]] },
        { id: "mass", title: "Mass from weight",
          v: ({ r }) => ({ W: r(20, 900) }),
          q: ({ W }) => `An object weighs ${W} N on Earth (g = 9.8 N/kg). Calculate its mass.`,
          a: ({ W }) => W / G, unit: "kg",
          steps: ({ W }) => [`m = W ÷ g`, `m = ${W} ÷ 9.8`],
          traps: ({ W }) => [[W * G, "You multiplied. Rearrange W = mg to m = W ÷ g."]] }
      ],
      "density": [
        { id: "density", title: "Density",
          v: ({ r }) => ({ m: r(20, 900), V: r(10, 300) }),
          q: ({ m, V }) => `A block has a mass of ${m} g and a volume of ${V} cm³. Calculate its density.`,
          a: ({ m, V }) => m / V, unit: "g/cm³",
          steps: ({ m, V }) => [`ρ = m ÷ V`, `ρ = ${m} ÷ ${V}`],
          traps: ({ m, V }) => [[V / m, "You divided the wrong way round: density = mass ÷ volume."], [m * V, "You multiplied. Density = mass ÷ volume."]] },
        { id: "displacement", title: "Density of a stone",
          v: ({ r }) => ({ v1: r(20, 60), rise: r(4, 30), m: r(10, 200) }),
          q: ({ v1, rise, m }) => `A measuring cylinder holds ${v1} cm³ of water. A stone of mass ${m} g is lowered in and the reading rises to ${v1 + rise} cm³. Calculate the density of the stone.`,
          a: ({ rise, m }) => m / rise, unit: "g/cm³",
          steps: ({ v1, rise, m }) => [`Volume of stone = rise in level = ${v1 + rise} − ${v1} = ${rise} cm³`, `ρ = m ÷ V = ${m} ÷ ${rise}`],
          traps: ({ v1, rise, m }) => [[m / (v1 + rise), "You used the final reading as the volume. The stone's volume is the rise in level."], [m / v1, "You used the starting volume. The stone's volume is the rise in level."]] }
      ],
      "forces": [
        { id: "fma", title: "Resultant force and acceleration",
          v: ({ r }) => ({ m: r(600, 2000, 100), d: r(1500, 6000, 100), f: r(200, 1200, 50) }),
          q: ({ m, d, f }) => `A car of mass ${m} kg has a driving force of ${d} N and a total resistive force of ${f} N. Calculate its acceleration.`,
          a: ({ m, d, f }) => (d - f) / m, unit: "m/s²",
          steps: ({ m, d, f }) => [`Resultant force = ${d} − ${f} = ${d - f} N`, `a = F ÷ m = ${d - f} ÷ ${m}`],
          traps: ({ m, d }) => [[d / m, "You used the driving force alone. Use the resultant force: driving force − resistive force."]] },
        { id: "hooke", title: "Hooke's law",
          v: ({ r }) => ({ k: r(10, 60, 5), x: r(2, 20) }),
          q: ({ k, x }) => `A spring has a spring constant of ${k} N/m. Calculate the force needed to stretch it by ${x} cm (within the limit of proportionality).`,
          a: ({ k, x }) => (k * x) / 100, unit: "N",
          steps: ({ k, x }) => [`Convert: ${x} cm = ${x / 100} m`, `F = k × x = ${k} × ${x / 100}`],
          traps: ({ k, x }) => [[k * x, "You used the extension in cm. The spring constant is in N/m, so convert cm to m first."]] },
        { id: "moments", title: "Balancing moments",
          v: ({ r }) => ({ w1: r(200, 600, 10), d1: r(0.5, 2, 0.1), w2: r(300, 800, 10) }),
          q: ({ w1, d1, w2 }) => `A child of weight ${w1} N sits ${d1} m from the pivot of a see-saw. How far from the pivot, on the other side, must an adult of weight ${w2} N sit to balance it?`,
          a: ({ w1, d1, w2 }) => (w1 * d1) / w2, unit: "m",
          steps: ({ w1, d1, w2 }) => [`Balanced: clockwise moment = anticlockwise moment`, `${w2} × d = ${w1} × ${d1} = ${F(w1 * d1)} N m`, `d = ${F(w1 * d1)} ÷ ${w2}`],
          traps: ({ w1, d1, w2 }) => [[(w2 * d1) / w1, "You swapped the weights. The heavier person must sit closer to the pivot."]] },
        { id: "spring-k", title: "Spring constant from a graph",
          v: ({ p }) => ({ k: p([20, 25, 40, 50]) }),
          q: () => `The graph shows how the force on a spring changes its extension. Use the straight part of the graph to calculate the spring constant in N/m.`,
          a: ({ k }) => k, unit: "N/m",
          // straight up to 14 cm (the limit of proportionality), then it bends: less force for each extra cm
          graph: ({ k }) => { const lim = 14, pts = []; for (let x = 0; x <= 20; x += 1) pts.push([x, x <= lim ? (k * x) / 100 : (k * lim) / 100 + (k * (x - lim)) / 100 * 0.5]); return { x: { label: "extension / cm", max: 20, step: 2 }, y: { label: "force / N", max: ceilTo((k * 20) / 100 + 0.5, 2), step: k >= 40 ? 2 : 1 }, lines: [{ pts, tc: "var(--c-mech)" }] }; },
          show: ({ k }) => ({ tri: [[0, 0], [10, k / 10]] }),
          steps: ({ k }) => [`k = force ÷ extension, from the straight part`, `At 10 cm the force is ${F(k / 10)} N`, `10 cm = 0.10 m, so k = ${F(k / 10)} ÷ 0.10`],
          traps: ({ k }) => [[k / 100, "That is in N/cm. Convert the extension to metres: the answer is 100 times bigger."]] }
      ],
      "momentum": [
        { id: "stick", title: "Collision: they stick together",
          v: ({ r }) => ({ m1: r(1, 5, 0.5), u: r(2, 8, 0.5), m2: r(1, 5, 0.5) }),
          q: ({ m1, u, m2 }) => `A ${m1} kg trolley moving at ${u} m/s hits a stationary ${m2} kg trolley. They stick together. Calculate their speed just after the collision.`,
          a: ({ m1, u, m2 }) => (m1 * u) / (m1 + m2), unit: "m/s",
          steps: ({ m1, u, m2 }) => [`Momentum before = ${m1} × ${u} = ${F(m1 * u)} kg m/s`, `Momentum after = (${m1} + ${m2}) × v`, `v = ${F(m1 * u)} ÷ ${m1 + m2}`],
          traps: ({ m1, u, m2 }) => [[(m1 * u) / m2, "You used only the second trolley's mass. They move together, so use the total mass."]] },
        { id: "impulse", title: "Force from a change in momentum",
          v: ({ r }) => ({ m: r(0.05, 0.5, 0.05), v: r(5, 30), t: r(0.02, 0.2, 0.01) }),
          q: ({ m, v, t }) => `A ball of mass ${m} kg moving at ${v} m/s is caught and brought to rest in ${t} s. Calculate the average force on the ball.`,
          a: ({ m, v, t }) => (m * v) / t, unit: "N",
          steps: ({ m, v, t }) => [`Change in momentum = ${m} × ${v} = ${F(m * v)} kg m/s`, `F = change in momentum ÷ time = ${F(m * v)} ÷ ${t}`],
          traps: ({ m, v, t }) => [[m * v * t, "You multiplied by the time. Force = change in momentum ÷ time."], [m * v, "That is the change in momentum. Divide by the time to get the force."]] }
      ],
      "energy": [
        { id: "ke", title: "Kinetic energy",
          v: ({ r }) => ({ m: r(2, 80), v: r(2, 25) }),
          q: ({ m, v }) => `A ${m} kg object moves at ${v} m/s. Calculate its kinetic energy.`,
          a: ({ m, v }) => 0.5 * m * v * v, unit: "J",
          steps: ({ m, v }) => [`E = ½mv²`, `E = ½ × ${m} × ${v}²`, `E = ½ × ${m} × ${v * v}`],
          traps: ({ m, v }) => [[m * v * v, "You left out the ½."], [0.5 * m * v, "You forgot to square the speed."]] },
        { id: "gpe", title: "Gravitational potential energy",
          v: ({ r }) => ({ m: r(1, 80), h: r(1, 50) }),
          q: ({ m, h }) => `A ${m} kg mass is lifted through a height of ${h} m. Calculate the gain in gravitational potential energy (g = 9.8 N/kg).`,
          a: ({ m, h }) => m * G * h, unit: "J",
          steps: ({ m, h }) => [`ΔE = mgΔh`, `ΔE = ${m} × 9.8 × ${h}`],
          traps: ({ m, h }) => [[m * h, "You left out g."]] },
        { id: "efficiency", title: "Efficiency",
          v: ({ r }) => { const inp = r(100, 2000, 10); return { inp, out: Math.round(inp * r(0.15, 0.9, 0.01)) }; },
          q: ({ inp, out }) => `A motor is supplied with ${inp} J of energy and does ${out} J of useful work. Calculate its efficiency as a percentage.`,
          a: ({ inp, out }) => (out / inp) * 100, unit: "%",
          steps: ({ inp, out }) => [`efficiency = useful energy output ÷ total energy input × 100%`, `= ${out} ÷ ${inp} × 100%`],
          traps: ({ inp, out }) => [[out / inp, "That is the efficiency as a decimal. Multiply by 100 for a percentage."], [(inp / out) * 100, "You divided the wrong way round. Efficiency can never be above 100%."]] },
        { id: "power", title: "Power",
          v: ({ r }) => ({ f: r(20, 500, 10), h: r(1, 10), t: r(2, 20) }),
          q: ({ f, h, t }) => `A motor lifts a load of weight ${f} N through ${h} m in ${t} s. Calculate its useful power output.`,
          a: ({ f, h, t }) => (f * h) / t, unit: "W",
          steps: ({ f, h, t }) => [`Work done = force × distance = ${f} × ${h} = ${f * h} J`, `P = W ÷ t = ${f * h} ÷ ${t}`],
          traps: ({ f, h }) => [[f * h, "That is the work done, in joules. Power = work done ÷ time."]] }
      ],
      "pressure": [
        { id: "pressure", title: "Pressure on a surface",
          v: ({ r }) => ({ f: r(100, 900, 10), A: r(20, 400, 10) }),
          q: ({ f, A }) => `A force of ${f} N acts on an area of ${A} cm². Calculate the pressure in pascals.`,
          a: ({ f, A }) => f / (A / 10000), unit: "Pa",
          steps: ({ f, A }) => [`Convert: ${A} cm² = ${A} ÷ 10 000 = ${F(A / 10000)} m²`, `p = F ÷ A = ${f} ÷ ${F(A / 10000)}`],
          traps: ({ f, A }) => [[f / A, "You used the area in cm². Pascals need m²: divide cm² by 10 000."], [f / (A / 100), "1 m² is 10 000 cm², not 100 cm²."]] },
        { id: "depth", title: "Pressure with depth",
          v: ({ r, p }) => ({ h: r(2, 40), w: p([["fresh water", 1000], ["sea water", 1030]]) }),
          q: ({ h, w }) => `Calculate the extra pressure due to ${w[0]} at a depth of ${h} m (density ${w[1]} kg/m³, g = 9.8 N/kg).`,
          a: ({ h, w }) => w[1] * G * h, unit: "Pa",
          steps: ({ h, w }) => [`Δp = ρgΔh`, `Δp = ${w[1]} × 9.8 × ${h}`],
          traps: ({ h, w }) => [[w[1] * h, "You left out g."]] }
      ]
    },

    "ph-thermal": {
      "particles": [
        { id: "boyle", title: "Pressure and volume",
          v: ({ r }) => { const V1 = r(100, 600, 10); let V2 = r(50, 800, 10); if (V2 === V1) V2 += 50; return { p1: r(80, 300, 10), V1, V2 }; },
          q: ({ p1, V1, V2 }) => `A gas at ${p1} kPa has a volume of ${V1} cm³. Its volume changes to ${V2} cm³ at constant temperature. Calculate the new pressure.`,
          a: ({ p1, V1, V2 }) => (p1 * V1) / V2, unit: "kPa",
          steps: ({ p1, V1, V2 }) => [`p₁V₁ = p₂V₂`, `p₂ = p₁V₁ ÷ V₂ = ${p1} × ${V1} ÷ ${V2}`],
          traps: ({ p1, V1, V2 }) => [[(p1 * V2) / V1, "You swapped the volumes. A smaller volume means a higher pressure."]] },
        { id: "kelvin", title: "Celsius to kelvin",
          v: ({ r }) => ({ c: r(-200, 400) }),
          q: ({ c }) => `Convert ${String(c).replace("-", "−")} °C into kelvin.`,
          a: ({ c }) => c + 273, unit: "K", tol: 0,
          steps: ({ c }) => [`T (K) = θ (°C) + 273`, `= ${c} + 273`],
          traps: ({ c }) => [[c - 273, "Add 273 to go from °C to K; subtract to go back."]] },
        { id: "cooling", title: "Freezing point from a cooling curve",
          v: ({ r, p }) => ({ tf: p([45, 50, 55, 60, 65, 70, 75, 80]), t1: r(2, 5), d: r(4, 7) }),
          q: () => `The graph shows the temperature of a liquid as it cools and turns solid. Use the graph to find its freezing point.`,
          a: ({ tf }) => tf, unit: "°C",
          // the liquid cools from 95 °C, stays flat while it freezes, then the solid cools towards room temperature
          graph: ({ tf, t1, d }) => { const pts = []; for (let t = 0; t <= t1; t += 0.25) pts.push([t, tf + (95 - tf) * (1 - t / t1) ** 1.6]); pts.push([t1 + d, tf]); for (let t = t1 + d + 0.5; t <= 16; t += 0.5) pts.push([t, tf - (tf - 20) * (1 - Math.exp(-0.3 * (t - t1 - d)))]); return { x: { label: "time / min", max: 16, step: 2 }, y: { label: "temperature / °C", max: 100, step: 10 }, lines: [{ pts, tc: "var(--c-temp)" }] }; },
          show: ({ tf, t1, d }) => ({ read: [[t1 + d / 2, tf]] }),
          steps: ({ tf }) => [`While the liquid freezes the temperature stays constant: the flat part`, `Read across from the flat part to the temperature axis: ${tf} °C`],
          tol: 0.03 }
      ],
      "properties": [
        { id: "shc", title: "Energy to heat something",
          v: ({ r, p }) => { const T1 = r(10, 30); return { m: r(0.2, 5, 0.1), s: p([["water", 4200], ["aluminium", 900], ["copper", 390], ["oil", 2000]]), T1, T2: T1 + r(5, 70) }; },
          q: ({ m, s, T1, T2 }) => `Calculate the energy needed to heat ${m} kg of ${s[0]} from ${T1} °C to ${T2} °C. (specific heat capacity of ${s[0]} = ${s[1]} J/(kg °C))`,
          a: ({ m, s, T1, T2 }) => m * s[1] * (T2 - T1), unit: "J",
          steps: ({ m, s, T1, T2 }) => [`ΔT = ${T2} − ${T1} = ${T2 - T1} °C`, `ΔE = mcΔT = ${m} × ${s[1]} × ${T2 - T1}`],
          traps: ({ m, s, T2 }) => [[m * s[1] * T2, "You used the final temperature. Use the temperature change, ΔT."]] },
        { id: "find-c", title: "Specific heat capacity from data",
          v: ({ r, p }) => { const m = r(0.5, 2, 0.1), c = p([450, 900, 390, 4200, 2100]), dT = r(5, 40); return { m, dT, E: Math.round(m * c * dT) }; },
          q: ({ m, dT, E }) => `${E} J of energy raises the temperature of a ${m} kg block by ${dT} °C. Calculate the specific heat capacity of the material.`,
          a: ({ m, dT, E }) => E / (m * dT), unit: "J/(kg °C)",
          steps: ({ m, dT, E }) => [`c = ΔE ÷ (mΔT)`, `c = ${E} ÷ (${m} × ${dT})`, `c = ${E} ÷ ${F(m * dT)}`],
          traps: ({ m, dT, E }) => [[E / dT, "You left out the mass."], [(E * m) / dT, "Divide by the mass as well as the temperature change."]] }
      ]
    },

    "ph-waves": {
      "properties": [
        { id: "wave-eq", title: "The wave equation",
          v: ({ r }) => ({ f: r(2, 500), l: r(0.1, 5, 0.1) }),
          q: ({ f, l }) => `A wave has a frequency of ${f} Hz and a wavelength of ${l} m. Calculate its speed.`,
          a: ({ f, l }) => f * l, unit: "m/s",
          steps: ({ f, l }) => [`v = f × λ`, `v = ${f} × ${l}`],
          traps: ({ f, l }) => [[f / l, "You divided. Speed = frequency × wavelength."]] },
        { id: "freq", title: "Frequency from the period",
          v: ({ r }) => ({ T: r(0.02, 2, 0.02) }),
          q: ({ T }) => `A wave has a period of ${T} s. Calculate its frequency.`,
          a: ({ T }) => 1 / T, unit: "Hz",
          steps: ({ T }) => [`f = 1 ÷ T`, `f = 1 ÷ ${T}`] }
      ],
      "light": [
        { id: "n", title: "Refractive index",
          v: ({ r }) => { const i = r(20, 70), n = r(1.3, 1.9, 0.05); return { i, rr: Math.round(deg(Math.asin(Math.sin(rad(i)) / n))) }; },
          q: ({ i, rr }) => `A ray of light enters a glass block with an angle of incidence of ${i}°. The angle of refraction is ${rr}°. Calculate the refractive index of the glass.`,
          a: ({ i, rr }) => Math.sin(rad(i)) / Math.sin(rad(rr)), unit: "",
          steps: ({ i, rr }) => [`n = sin i ÷ sin r`, `n = sin ${i}° ÷ sin ${rr}°`, `n = ${F(Math.sin(rad(i)))} ÷ ${F(Math.sin(rad(rr)))}`],
          traps: ({ i, rr }) => [[i / rr, "Use the sines of the angles, not the angles themselves."], [Math.sin(rad(rr)) / Math.sin(rad(i)), "You divided the wrong way round: sin i ÷ sin r is always more than 1."]] },
        { id: "critical", title: "Critical angle",
          v: ({ r }) => ({ n: r(1.3, 2.4, 0.05) }),
          q: ({ n }) => `A material has a refractive index of ${n}. Calculate its critical angle.`,
          a: ({ n }) => deg(Math.asin(1 / n)), unit: "°",
          steps: ({ n }) => [`sin c = 1 ÷ n = 1 ÷ ${n} = ${F(1 / n)}`, `c = sin⁻¹(${F(1 / n)})`],
          traps: ({ n }) => [[1 / n, "That is sin c. Use sin⁻¹ to find the angle."]] }
      ],
      "spectrum": [
        { id: "lambda", title: "Wavelength of a radio wave",
          v: ({ r }) => ({ f: r(80, 110, 0.1) }),
          q: ({ f }) => `A radio station broadcasts at ${f} MHz. Calculate the wavelength (speed of light = 3.0 × 10⁸ m/s).`,
          a: ({ f }) => 3e8 / (f * 1e6), unit: "m",
          steps: ({ f }) => [`${f} MHz = ${f} × 10⁶ Hz`, `λ = v ÷ f = 3.0 × 10⁸ ÷ ${F(f * 1e6)}`],
          traps: ({ f }) => [[3e8 / f, "MHz means millions of hertz: multiply by 10⁶ first."]] }
      ],
      "sound": [
        { id: "echo", title: "Distance from an echo",
          v: ({ r, p }) => ({ t: r(0.2, 4, 0.1), m: p([["air", 340], ["water", 1500]]) }),
          q: ({ t, m }) => `A pulse of sound is sent through ${m[0]} towards a wall. The echo returns after ${t} s. The speed of sound in ${m[0]} is ${m[1]} m/s. How far away is the wall?`,
          a: ({ t, m }) => (m[1] * t) / 2, unit: "m",
          steps: ({ t, m }) => [`The sound travels there and back: total distance = ${m[1]} × ${t} = ${F(m[1] * t)} m`, `Distance to the wall = half of that`],
          traps: ({ t, m }) => [[m[1] * t, "That is the distance there and back. Halve it."]] }
      ]
    },

    "ph-electricity-magnetism": {
      "quantities": [
        { id: "charge", title: "Charge",
          v: ({ r }) => ({ I: r(0.2, 5, 0.1), t: r(1, 10) }),
          q: ({ I, t }) => `A current of ${I} A flows for ${t} minutes. Calculate the charge that flows.`,
          a: ({ I, t }) => I * t * 60, unit: "C",
          steps: ({ I, t }) => [`${t} min = ${t * 60} s`, `Q = I × t = ${I} × ${t * 60}`],
          traps: ({ I, t }) => [[I * t, "Time must be in seconds: minutes × 60."]] },
        { id: "resistance", title: "Resistance",
          v: ({ r }) => ({ V: r(1.5, 24, 0.5), I: r(0.1, 3, 0.1) }),
          q: ({ V, I }) => `A p.d. of ${V} V drives a current of ${I} A through a resistor. Calculate its resistance.`,
          a: ({ V, I }) => V / I, unit: "Ω",
          steps: ({ V, I }) => [`R = V ÷ I`, `R = ${V} ÷ ${I}`],
          traps: ({ V, I }) => [[V * I, "You multiplied (that would be power). R = V ÷ I."], [I / V, "You divided the wrong way round: R = V ÷ I."]] },
        { id: "cost", title: "Cost of electricity",
          v: ({ r }) => ({ P: r(0.5, 3, 0.1), h: r(1, 8, 0.5), c: r(15, 40) }),
          q: ({ P, h, c }) => `A ${P} kW heater is used for ${h} hours. Electricity costs ${c}p per kWh. Calculate the cost.`,
          a: ({ P, h, c }) => P * h * c, unit: "p",
          steps: ({ P, h, c }) => [`Energy = P × t = ${P} kW × ${h} h = ${F(P * h)} kWh`, `Cost = ${F(P * h)} × ${c}p`],
          traps: ({ P, h, c }) => [[P * 1000 * h * c, "Keep the power in kW and the time in hours: the price is per kWh."]] },
        { id: "iv-r", title: "Resistance from an I–V graph",
          v: ({ p }) => ({ R: p([4, 5, 6, 8, 10, 12, 15, 20]) }),
          q: () => `The graph shows how the current through a resistor depends on the p.d. across it. Calculate the resistance.`,
          a: ({ R }) => R, unit: "Ω",
          graph: ({ R }) => { const imax = 12 / R; const yMax = imax > 2 ? 4 : imax > 1 ? 2 : imax > 0.5 ? 1 : 0.6; return { x: { label: "p.d. / V", max: 12, step: 2 }, y: { label: "current / A", max: yMax, step: yMax / 4 }, lines: [{ pts: [[0, 0], [12, imax]], tc: "var(--c-vx)" }] }; },
          show: ({ R }) => ({ tri: [[0, 0], [12, 12 / R]] }),
          steps: ({ R }) => [`R = V ÷ I: read one point on the line`, `At 12 V the current is ${F(12 / R)} A`, `R = 12 ÷ ${F(12 / R)}`],
          traps: ({ R }) => [[1 / R, "That is the gradient, I ÷ V. Resistance is V ÷ I — the inverse of this graph's gradient."]] }
      ],
      "circuits": [
        { id: "series", title: "Current in a series circuit",
          v: ({ r }) => ({ R1: r(2, 20), R2: r(2, 20), V: r(3, 24, 1.5) }),
          q: ({ R1, R2, V }) => `Resistors of ${R1} Ω and ${R2} Ω are connected in series to a ${V} V supply. Calculate the current.`,
          a: ({ R1, R2, V }) => V / (R1 + R2), unit: "A",
          steps: ({ R1, R2, V }) => [`In series, R = ${R1} + ${R2} = ${R1 + R2} Ω`, `I = V ÷ R = ${V} ÷ ${R1 + R2}`],
          traps: ({ R1, R2, V }) => [[V / R1, "Use the total resistance of both resistors."], [V / ((R1 * R2) / (R1 + R2)), "That is the parallel combination. In series, just add the resistances."]] },
        { id: "parallel", title: "Two resistors in parallel",
          v: ({ r }) => ({ R1: r(2, 30), R2: r(2, 30) }),
          q: ({ R1, R2 }) => `Calculate the combined resistance of a ${R1} Ω and a ${R2} Ω resistor connected in parallel.`,
          a: ({ R1, R2 }) => 1 / (1 / R1 + 1 / R2), unit: "Ω",
          steps: ({ R1, R2 }) => [`1/R = 1/${R1} + 1/${R2} = ${F(1 / R1 + 1 / R2)}`, `R = 1 ÷ ${F(1 / R1 + 1 / R2)}`],
          traps: ({ R1, R2 }) => [[R1 + R2, "That is the series total. In parallel the combined resistance is less than either resistor."], [1 / R1 + 1 / R2, "That is 1/R. Take the reciprocal to get R."]] },
        { id: "divider", title: "Potential divider",
          v: ({ r }) => ({ V: r(4, 24, 2), R1: r(1, 10), R2: r(1, 10) }),
          q: ({ V, R1, R2 }) => `A ${R1} kΩ and a ${R2} kΩ resistor are in series across a ${V} V supply. Calculate the p.d. across the ${R2} kΩ resistor.`,
          a: ({ V, R1, R2 }) => (V * R2) / (R1 + R2), unit: "V",
          steps: ({ V, R1, R2 }) => [`The p.d. is shared in the ratio of the resistances`, `V₂ = ${V} × ${R2} ÷ (${R1} + ${R2})`],
          traps: ({ V, R1, R2 }) => [[(V * R1) / (R1 + R2), "That is the p.d. across the other resistor."]] }
      ],
      "safety": [
        { id: "fuse", title: "Current for choosing a fuse",
          v: ({ r }) => ({ P: r(100, 3000, 50) }),
          q: ({ P }) => `A ${P} W appliance runs on the 230 V mains. Calculate the current it draws.`,
          a: ({ P }) => P / 230, unit: "A",
          steps: ({ P }) => [`I = P ÷ V = ${P} ÷ 230`, `Choose the fuse just above this (3 A, 5 A or 13 A)`],
          traps: ({ P }) => [[P * 230, "You multiplied. I = P ÷ V."]] }
      ],
      "electromagnetism": [
        { id: "transformer", title: "Transformer output",
          v: ({ r, p }) => { const Np = r(100, 2000, 50); let Ns = r(50, 2000, 50); if (Ns === Np) Ns += 50; return { Np, Ns, Vp: p([12, 24, 230]) }; },
          q: ({ Np, Ns, Vp }) => `A transformer has ${Np} turns on the primary coil and ${Ns} turns on the secondary. The input is ${Vp} V a.c. Calculate the output voltage.`,
          a: ({ Np, Ns, Vp }) => (Vp * Ns) / Np, unit: "V",
          steps: ({ Np, Ns, Vp }) => [`Vs ÷ Vp = Ns ÷ Np`, `Vs = ${Vp} × ${Ns} ÷ ${Np}`],
          traps: ({ Np, Ns, Vp }) => [[(Vp * Np) / Ns, "You turned the ratio upside down: more secondary turns means a higher output."]] },
        { id: "transformer-i", title: "Primary current (100% efficient)",
          v: ({ r }) => ({ Vs: r(6, 24, 0.5), Is: r(0.5, 5, 0.1) }),
          q: ({ Vs, Is }) => `A 100% efficient transformer steps 230 V down to ${Vs} V and supplies ${Is} A. Calculate the current in the primary coil.`,
          a: ({ Vs, Is }) => (Vs * Is) / 230, unit: "A",
          steps: ({ Vs, Is }) => [`Power in = power out: Vp × Ip = Vs × Is`, `Ip = ${Vs} × ${Is} ÷ 230`],
          traps: ({ Vs, Is }) => [[(230 * Is) / Vs, "You turned it upside down. Stepping the voltage down steps the current up, so the primary current is smaller."]] }
      ]
    },

    "ph-nuclear": {
      "atom": [
        { id: "neutrons", title: "Neutrons in a nucleus",
          v: ({ p }) => ({ n: p([["uranium-235", 235, 92], ["carbon-14", 14, 6], ["cobalt-60", 60, 27], ["iodine-131", 131, 53], ["strontium-90", 90, 38], ["potassium-40", 40, 19], ["radium-226", 226, 88]]) }),
          q: ({ n }) => `How many neutrons are in a nucleus of ${n[0]}? (proton number ${n[2]})`,
          a: ({ n }) => n[1] - n[2], unit: "", tol: 0,
          steps: ({ n }) => [`neutrons = nucleon number − proton number`, `= ${n[1]} − ${n[2]}`],
          traps: ({ n }) => [[n[1] + n[2], "Subtract the proton number from the nucleon number."]] }
      ],
      "radioactivity": [
        { id: "remaining", title: "Count rate after some half-lives",
          v: ({ r, p }) => ({ c0: p([800, 1600, 3200, 6400]), T: r(2, 12), n: r(2, 5) }),
          q: ({ c0, T, n }) => `A source has a count rate of ${c0} counts/min and a half-life of ${T} hours. What will the count rate be after ${T * n} hours?`,
          a: ({ c0, n }) => c0 / 2 ** n, unit: "counts/min",
          steps: ({ c0, T, n }) => [`${T * n} hours ÷ ${T} hours = ${n} half-lives`, `Halve ${n} times: ${Array.from({ length: n + 1 }, (_, i) => c0 / 2 ** i).join(" → ")}`],
          traps: ({ c0, n }) => [[c0 / (2 * n), "Halve once for each half-life, rather than dividing by 2 × the number of half-lives."]] },
        { id: "half-life-graph", title: "Half-life from a decay curve",
          v: ({ p }) => ({ c0: p([80, 100, 120, 160]), T: p([2, 4, 6, 8]) }),
          q: () => `The graph shows the count rate from a radioactive source. Use the graph to find the half-life.`,
          a: ({ T }) => T, unit: "min", tol: 0.05,
          graph: ({ c0, T }) => { const pts = []; for (let t = 0; t <= 4 * T; t += T / 8) pts.push([t, c0 * 0.5 ** (t / T)]); return { x: { label: "time / min", max: 4 * T, step: T / 2 }, y: { label: "count rate / (counts/min)", max: c0, step: c0 / 8 }, lines: [{ pts, tc: "var(--c-energy)" }] }; },
          show: ({ c0, T }) => ({ read: [[0, c0], [T, c0 / 2]] }),
          steps: ({ c0, T }) => [`Start at ${c0} counts/min; half of that is ${c0 / 2}`, `Read across from ${c0 / 2} to the curve, then down to the time axis: ${T} min`] },
        { id: "background", title: "Correcting for background",
          v: ({ r }) => ({ m: r(40, 300), b: r(15, 40) }),
          q: ({ m, b }) => `A detector near a source reads ${m} counts/min. The background count is ${b} counts/min. What is the count rate from the source alone?`,
          a: ({ m, b }) => m - b, unit: "counts/min", tol: 0,
          steps: ({ m, b }) => [`Source count = measured − background = ${m} − ${b}`],
          traps: ({ m, b }) => [[m + b, "Subtract the background; it is already included in the reading."]] }
      ]
    },

    "ph-space": {
      "solar-system": [
        { id: "orbit", title: "Orbital speed",
          v: ({ p }) => ({ o: p([["the Earth around the Sun", 1.5e11, 365], ["Mars around the Sun", 2.28e11, 687], ["Venus around the Sun", 1.08e11, 225], ["the Moon around the Earth", 3.84e8, 27.3]]) }),
          q: ({ o }) => `Calculate the average orbital speed of ${o[0]}. Orbital radius = ${F(o[1])} m; orbital period = ${o[2]} days.`,
          a: ({ o }) => (2 * Math.PI * o[1]) / (o[2] * 86400), unit: "m/s",
          steps: ({ o }) => [`T = ${o[2]} × 24 × 3600 = ${F(o[2] * 86400)} s`, `v = 2πr ÷ T = 2π × ${F(o[1])} ÷ ${F(o[2] * 86400)}`],
          traps: ({ o }) => [[(2 * Math.PI * o[1]) / o[2], "The period must be in seconds: days × 24 × 3600."]] },
        { id: "light-time", title: "Time for light to travel",
          v: ({ p }) => ({ d: p([["from the Sun to the Earth", 1.5e11], ["from the Sun to Mars", 2.28e11], ["from the Earth to the Moon", 3.84e8], ["from the Sun to Jupiter", 7.8e11]]) }),
          q: ({ d }) => `How long does light take to travel ${d[0]}, a distance of ${F(d[1])} m? (speed of light = 3.0 × 10⁸ m/s)`,
          a: ({ d }) => d[1] / 3e8, unit: "s",
          steps: ({ d }) => [`t = distance ÷ speed = ${F(d[1])} ÷ 3.0 × 10⁸`],
          traps: ({ d }) => [[d[1] * 3e8, "You multiplied. Time = distance ÷ speed."]] }
      ],
      "stars": [
        { id: "hubble", title: "Distance from Hubble's law",
          v: ({ r }) => ({ v: r(1, 30) * 1e6 }),
          q: ({ v }) => `A galaxy is moving away at ${F(v)} m/s. Taking H₀ = 2.2 × 10⁻¹⁸ per second, calculate its distance.`,
          a: ({ v }) => v / 2.2e-18, unit: "m",
          steps: ({ v }) => [`H₀ = v ÷ d, so d = v ÷ H₀`, `d = ${F(v)} ÷ 2.2 × 10⁻¹⁸`],
          traps: ({ v }) => [[v * 2.2e-18, "You multiplied. d = v ÷ H₀."]] }
      ]
    }
  });

  Object.assign(SA.plans, {
    "ph-motion-forces-energy": {
      "measurement": {
        title: "The period of a pendulum", setup: "You test how the length of a pendulum affects how long each swing takes.",
        iv: { a: "the length of the string", x: ["the time for 20 swings", "the mass of the bob"], why: "You choose it and set it before each reading." },
        dv: { a: "the time for 20 swings (then the period)", x: ["the length of the string", "the starting angle"], why: "It is what you read on the stopwatch, and it changes because of the length." },
        cv: { a: ["the mass of the bob", "the starting angle (amplitude)"], x: ["the length of the string", "the time for 20 swings"], why: "Anything else that could change the swing must stay the same, so only the length changes the result." },
        more: [{ q: "Why time 20 swings rather than one?", a: "Your reaction time becomes a tiny fraction of the total time", x: ["It makes the pendulum swing more regularly", "It removes every error", "The first swing is always too fast"], why: "The same reaction-time error (about 0.2 s) is spread over 20 swings, so the period is more accurate." }]
      },
      "forces": {
        title: "Stretching a spring", setup: "You hang loads on a spring and measure how far it stretches, to test Hooke's law.",
        iv: { a: "the load (force) on the spring", x: ["the extension", "the length of the ruler"], why: "You choose how many masses to hang." },
        dv: { a: "the extension of the spring", x: ["the load on the spring", "the spring constant"], why: "You measure it with the ruler each time: new length − original length." },
        cv: { a: ["the same spring throughout", "measuring from the same fixed point on the spring"], x: ["the load on the spring", "the extension"], why: "A different spring, or reading from a different point, would change the extension for reasons other than the load." },
        more: [{ q: "How do you avoid parallax error when reading the ruler?", a: "Keep your eye level with the pointer", x: ["Read the ruler from above", "Use a longer spring", "Take the reading quickly"], why: "Looking from an angle makes the pointer appear against the wrong mark." }]
      }
    },
    "ph-thermal": {
      "properties": {
        title: "Specific heat capacity of a metal block", setup: "An electric heater warms a 1 kg aluminium block; you record the energy supplied and the temperature rise.",
        iv: { a: "the energy supplied (heating time)", x: ["the temperature rise", "the mass of the block"], why: "You control how long the heater is on, and so how much energy goes in." },
        dv: { a: "the temperature rise of the block", x: ["the energy supplied", "the power of the heater"], why: "You read it on the thermometer; it depends on the energy supplied." },
        cv: { a: ["the mass of the block", "the power of the heater"], x: ["the temperature rise", "the time on the stopwatch"], why: "Both affect the temperature rise, so they must not change between readings." },
        more: [{ q: "Why is the value of c you calculate usually too high?", a: "Some energy is lost to the surroundings, so the temperature rises less than it should", x: ["The thermometer reads too high", "Aluminium gains mass when heated", "The heater supplies more energy than its rating"], why: "c = E ÷ (mΔT): a smaller measured ΔT gives a larger c. Insulating the block reduces this." }]
      },
      "transfer": {
        title: "Which can cools fastest?", setup: "Cans with different surfaces are filled with hot water; you record how much each one cools in ten minutes.",
        iv: { a: "the colour and texture of the can's surface", x: ["the drop in temperature", "the starting temperature"], why: "That is what is different between the cans." },
        dv: { a: "the fall in temperature after 10 minutes", x: ["the colour of the can", "the volume of water"], why: "You read it on each thermometer." },
        cv: { a: ["the starting temperature of the water", "the volume of water in each can"], x: ["the colour of the can", "the fall in temperature"], why: "Hotter water, or more of it, would change how fast it cools, whatever the surface." },
        more: [{ q: "Why put a lid on each can?", a: "To cut energy loss by evaporation and convection from the top", x: ["To stop radiation completely", "To make the water boil", "To keep the thermometer in place only"], why: "Then the difference between the cans comes mostly from radiation through their sides." }]
      }
    },
    "ph-waves": {
      "light": {
        title: "Refraction through a glass block", setup: "You shine a ray from a ray box into a rectangular glass block and trace the rays.",
        iv: { a: "the angle of incidence", x: ["the angle of refraction", "the thickness of the block"], why: "You choose it by turning the ray box." },
        dv: { a: "the angle of refraction", x: ["the angle of incidence", "the brightness of the ray"], why: "You measure it with a protractor from the normal." },
        cv: { a: ["the same glass block", "the same colour of light"], x: ["the angle of incidence", "the angle of refraction"], why: "A different material or colour would refract by a different amount." },
        more: [{ q: "Why mark each ray with two crosses far apart?", a: "So the direction of the ray can be drawn more accurately", x: ["To make the ray brighter", "To find the critical angle", "To measure the speed of light"], why: "A small error in a cross position changes the angle less when the crosses are far apart." }]
      }
    },
    "ph-electricity-magnetism": {
      "quantities": {
        title: "Resistance of a wire", setup: "You connect different lengths of a wire into a circuit with an ammeter and voltmeter.",
        iv: { a: "the length of the wire", x: ["the resistance", "the current"], why: "You change it by moving the crocodile clip." },
        dv: { a: "the resistance (from V ÷ I)", x: ["the length of the wire", "the supply voltage"], why: "You calculate it from the meter readings for each length." },
        cv: { a: ["the thickness (diameter) of the wire", "the material of the wire"], x: ["the length of the wire", "the resistance"], why: "Thickness and material also change resistance, so they must stay the same." },
        more: [{ q: "Why switch off the current between readings?", a: "So the wire does not heat up, which would change its resistance", x: ["To save the battery only", "To reset the ammeter to zero", "Because the voltmeter needs to cool"], why: "Resistance rises with temperature; a warm wire would give readings that are too high." }]
      }
    }
  });
})();
