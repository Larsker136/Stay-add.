// Daily quiz question bank. One question per topic is drawn each day.
// `a` is the index of the correct option; options are shuffled when shown.
window.STAY_QUIZ = [
  // 01 Motion, forces & energy
  { topic: "mech", q: "A car accelerates uniformly from rest to 20 m/s in 5 s. What is its acceleration?", o: ["4 m/s²", "100 m/s²", "0.25 m/s²", "25 m/s²"], a: 0, why: "a = Δv ⁄ t = 20 ⁄ 5 = 4 m/s²." },
  { topic: "mech", q: "Which of these quantities is a vector?", o: ["Speed", "Mass", "Momentum", "Kinetic energy"], a: 2, why: "Momentum has a direction as well as a size; the others are scalars." },
  { topic: "mech", q: "A 2.0 kg trolley moves at 3.0 m/s. What is its momentum?", o: ["1.5 kg m/s", "6.0 kg m/s", "9.0 kg m/s", "18 kg m/s"], a: 1, why: "p = mv = 2.0 × 3.0 = 6.0 kg m/s." },
  { topic: "mech", q: "What does the area under a speed–time graph represent?", o: ["Acceleration", "Distance travelled", "Average speed", "Resultant force"], a: 1, why: "Speed × time = distance, so the area under the line is the distance travelled." },
  // 02 Thermal physics
  { topic: "thermal", q: "Water boils at a constant 100 °C while it is heated. What is the energy supplied used for?", o: ["Increasing the kinetic energy of the molecules", "Overcoming the forces between molecules", "Raising the temperature of the steam", "Heating the surroundings only"], a: 1, why: "During a change of state the energy (latent heat) separates the molecules; temperature does not rise." },
  { topic: "thermal", q: "A gas in a sealed, rigid container is heated. Why does its pressure increase?", o: ["The particles get bigger", "The particles hit the walls more often and harder", "The number of particles increases", "The particles stop colliding with each other"], a: 1, why: "Faster particles collide with the walls more frequently and with more force per collision." },
  { topic: "thermal", q: "Which process can transfer thermal energy through a vacuum?", o: ["Conduction", "Convection", "Infrared radiation", "Evaporation"], a: 2, why: "Radiation is an electromagnetic wave and needs no medium; conduction and convection need particles." },
  // 03 Waves
  { topic: "waves", q: "Light passes from air into glass. What happens to its speed and wavelength?", o: ["Both decrease", "Both increase", "Speed decreases, wavelength increases", "Speed stays the same, wavelength decreases"], a: 0, why: "The frequency is fixed by the source, so v = fλ means λ falls when v falls." },
  { topic: "waves", q: "Which electromagnetic wave has the longest wavelength?", o: ["Microwaves", "Radio waves", "Visible light", "X-rays"], a: 1, why: "Radio waves sit at the long-wavelength, low-frequency end of the spectrum." },
  { topic: "waves", q: "A wave has a frequency of 50 Hz and a wavelength of 4.0 m. What is its speed?", o: ["12.5 m/s", "54 m/s", "200 m/s", "0.08 m/s"], a: 2, why: "v = fλ = 50 × 4.0 = 200 m/s." },
  // 04 Electricity & magnetism
  { topic: "elec", q: "A current of 0.50 A flows through a 12 Ω resistor. What is the p.d. across it?", o: ["6.0 V", "24 V", "0.042 V", "12.5 V"], a: 0, why: "V = IR = 0.50 × 12 = 6.0 V." },
  { topic: "elec", q: "Two 6.0 Ω resistors are connected in parallel. What is their combined resistance?", o: ["12 Ω", "6.0 Ω", "3.0 Ω", "36 Ω"], a: 2, why: "Identical resistors in parallel: R = 6.0 ⁄ 2 = 3.0 Ω — always less than either one." },
  { topic: "elec", q: "A transformer has 100 turns on the primary and 400 on the secondary. The input is 12 V a.c. What is the output?", o: ["3.0 V", "12 V", "48 V", "400 V"], a: 2, why: "Vs ⁄ Vp = Ns ⁄ Np, so Vs = 12 × 400 ⁄ 100 = 48 V." },
  // 05 Nuclear physics
  { topic: "nuclear", q: "A sample has a half-life of 8 days. What fraction remains after 24 days?", o: ["1⁄3", "1⁄4", "1⁄6", "1⁄8"], a: 3, why: "24 days is three half-lives: ½ × ½ × ½ = 1⁄8." },
  { topic: "nuclear", q: "Which type of radiation is the most strongly ionising?", o: ["Alpha", "Beta", "Gamma", "All are equal"], a: 0, why: "Alpha particles are large and doubly charged, so they ionise strongly and are stopped by paper." },
  { topic: "nuclear", q: "What is an alpha particle made of?", o: ["One electron", "Two protons and two neutrons", "One neutron", "An electromagnetic wave"], a: 1, why: "It is a helium nucleus: two protons and two neutrons." },
  // 06 Space physics
  { topic: "space", q: "What keeps a planet in orbit around the Sun?", o: ["Its own momentum only", "The Sun’s magnetic field", "The gravitational attraction of the Sun", "Radiation pressure from the Sun"], a: 2, why: "Gravity provides the centripetal force that keeps changing the planet’s direction." },
  { topic: "space", q: "Light from distant galaxies is red-shifted. What does this suggest?", o: ["The galaxies are getting hotter", "The Universe is expanding", "The galaxies are moving towards us", "The light has lost energy in dust"], a: 1, why: "Red-shift increases with distance, evidence that galaxies are moving apart — the Universe is expanding." },
  { topic: "space", q: "Roughly how long does light take to travel from the Sun to the Earth?", o: ["8 seconds", "8 minutes", "8 hours", "8 days"], a: 1, why: "About 1.5 × 10¹¹ m ⁄ 3.0 × 10⁸ m/s ≈ 500 s, a little over 8 minutes." },
];
