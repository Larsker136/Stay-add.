/* ==========================================================================
   stay add. Chemistry — "Explain it" flashcards: the harder deck of every topic
   Why, predict, calculate, spot the mistake — each answer shows the reasoning.
   StayAdd.explainCards["<body data-lesson>"]["<topic data-key>"] = [[question, answer], …]
   Drawn by assets/js/flashcards.js next to the Key facts deck in js/cards.js.
   ========================================================================== */
(function () {
  "use strict";
  const SA = (window.StayAdd = window.StayAdd || {});
  SA.explainCards = SA.explainCards || {};

  Object.assign(SA.explainCards, {
    "ch-states-of-matter": {
      "solids-liquids-gases": [
        ["Explain, using particles, why a gas can be compressed but a liquid cannot.", "Gas particles are far apart with lots of empty space between them, so pushing them closer is easy. Liquid particles are already touching, so there is almost no space to remove."],
        ["A heating curve for water has two flat sections. Explain what is happening to the energy during each.", "At 0 °C (melting) and 100 °C (boiling) the energy supplied overcomes the forces of attraction between particles instead of increasing their kinetic energy — so the temperature doesn't rise until the change of state is complete."],
        ["Why does a puddle evaporate on a cool day even though it is far below 100 °C?", "Particles have a range of energies. The fastest ones at the surface have enough energy to overcome the attractions and escape, so evaporation happens at any temperature — just more slowly when cool."],
        ["A balloon is taken from a warm room into a freezer. Predict and explain what happens to its size.", "It shrinks. Colder particles move more slowly and hit the walls less often and less hard, so the pressure inside falls and the volume decreases."],
        ["Potassium manganate(VII) spreads through water in a few hours, but perfume spreads across a room in minutes. Explain the difference.", "Gas particles move much faster and have more space between them than liquid particles, so diffusion is much faster in gases."],
        ["Explain why the white ring of NH₄Cl forms nearer the HCl end of the tube.", "Ammonia (Mr 17) has lighter molecules than hydrogen chloride (Mr 36.5), so at the same temperature they move faster and travel further before the two gases meet."],
        ["A sample of a solid melts over a range from 75–79 °C. What does this tell you, and why?", "It is impure. A pure substance melts at one sharp temperature; impurities lower the melting point and spread it over a range."],
        ["Ethanol melts at −114 °C and boils at 78 °C. What state is it at 25 °C and at 100 °C?", "Liquid at 25 °C; gas at 100 °C."],
        ["Why does a gas diffuse faster at a higher temperature?", "Its particles have more kinetic energy and move faster."],
        ["Why does increasing temperature increase gas pressure at constant volume?", "Particles move faster, hitting the walls more often and with more force."],
        ["A cooling curve flattens at 80 °C. What is happening?", "The substance is freezing; energy released as forces form keeps the temperature constant."],
        ["Why does bromine vapour spread through a gas jar of air but more quickly into a vacuum?", "In a vacuum there are no air particles to collide with, so bromine particles spread unhindered."],
        ["Which diffuses faster, CO₂ (Mr 44) or NH₃ (Mr 17)? Why?", "NH₃ — it has a lower Mr, so its molecules move faster at the same temperature."],
        ["Why is energy needed to melt a solid?", "To overcome the forces of attraction holding the particles in fixed positions."],
        ["Why does a gas syringe plunger move out when the gas inside is warmed?", "The particles move faster and hit the plunger harder and more often, pushing it out until pressure balances."],
        ["Why do liquids not have a fixed shape?", "Their particles can slide past each other."]
      ]
    },

    "ch-atoms-elements-compounds": {
      "atomic-structure": [
        ["An atom has mass number 39 and proton number 19. Work out its protons, neutrons and electrons, and its electronic configuration.", "19 protons, 39 − 19 = 20 neutrons, 19 electrons (neutral). Configuration 2,8,8,1 — so it is in Group I, Period 4 (potassium)."],
        ["Why is iron sulfide a compound but a mixture of iron filings and sulfur powder is not?", "In iron sulfide the elements are chemically bonded and it has new properties (not magnetic). In the mixture they are not bonded, keep their own properties, and a magnet can separate them."],
        ["Explain why chlorine-35 and chlorine-37 react in exactly the same way.", "Both have 17 protons and 17 electrons, with 7 in the outer shell. Chemical reactions depend on outer electrons, which are identical; only the neutron number differs."],
        ["Why is the Ar of chlorine 35.5 and not a whole number?", "Ar is a weighted average of the isotopes: about 75% chlorine-35 and 25% chlorine-37 give (75×35 + 25×37) ÷ 100 = 35.5."],
        ["Element X has configuration 2,8,6. Predict its group, period and whether it is a metal.", "Six outer electrons → Group VI; three shells → Period 3; a non-metal (it is sulfur) that gains 2 electrons to form X²⁻."],
        ["Why are noble gases unreactive?", "They already have a full outer shell, so they have no tendency to lose, gain or share electrons."],
        ["²⁷₁₃Al: give the protons, neutrons, electrons and configuration.", "13 p, 14 n, 13 e; 2,8,3."],
        ["Why can a mixture be separated by physical means but a compound cannot?", "In a mixture substances aren't bonded; in a compound atoms are chemically joined."],
        ["Copper is 69% ⁶³Cu and 31% ⁶⁵Cu. Calculate Ar.", "(63 × 69 + 65 × 31) ÷ 100 = 63.6."],
        ["Element Y has configuration 2,8,8,1. Name its group and period.", "Group I, Period 4 (potassium)."],
        ["Why do isotopes have different masses?", "They have different numbers of neutrons."],
        ["Why does the number of outer electrons decide chemical properties?", "Reactions involve outer electrons being lost, gained or shared."],
        ["How many outer electrons does an element in Group VII have? Why?", "7 — the group number equals the number of outer-shell electrons."],
        ["Why do elements in the same period have the same number of shells?", "The period number is the number of occupied electron shells."]
      ],
      "ionic-bonding": [
        ["Describe what happens to the electrons when magnesium reacts with oxygen.", "Each Mg atom (2,8,2) transfers its two outer electrons to an O atom (2,6). This gives Mg²⁺ (2,8) and O²⁻ (2,8), both with full outer shells, which attract each other strongly."],
        ["Why does magnesium oxide have a much higher melting point than sodium chloride?", "Mg²⁺ and O²⁻ have double the charges of Na⁺ and Cl⁻, so the electrostatic attraction between the ions is much stronger and needs more energy to overcome."],
        ["A student says ‘solid sodium chloride conducts because it contains ions’. Correct them.", "It has ions, but in the solid they are held in fixed positions in the lattice and can't move. It conducts only when molten or dissolved, when the ions are free to move."],
        ["Work out the formula of aluminium oxide from the ion charges.", "Al³⁺ and O²⁻: the lowest common multiple of 3 and 2 is 6, so 2 Al³⁺ (6+) and 3 O²⁻ (6−) → Al₂O₃."],
        ["Why do ionic compounds form a giant lattice rather than separate molecules?", "Each ion attracts oppositely charged ions in every direction, so the attractions continue throughout the structure in a regular repeating pattern."],
        ["Explain why a metal forms a positive ion but a non-metal forms a negative ion.", "Metals have 1–3 outer electrons, which are easier to lose than gaining 5–7. Non-metals have 5–7 outer electrons, so gaining 1–3 is the easier way to a full shell."],
        ["Describe the formation of calcium chloride using electrons.", "Ca loses 2 electrons to form Ca²⁺; each of two Cl atoms gains one to form Cl⁻."],
        ["Work out the formula of magnesium nitride (Mg²⁺, N³⁻).", "Mg₃N₂ — three 2+ balance two 3−."],
        ["Why are ionic compounds brittle?", "A force shifts layers so like charges line up and repel, splitting the crystal."],
        ["Draw in words the dot-and-cross diagram for Na⁺ and Cl⁻.", "[Na]⁺ with 2,8; [Cl]⁻ with 2,8,8 including one cross from Na, each in square brackets."],
        ["Why does molten magnesium chloride conduct but solid does not?", "Ions are free to move in the liquid but are held in fixed positions in the solid."],
        ["What is the charge on an aluminium ion and why?", "3+ — it loses its 3 outer electrons to get a full shell."],
        ["Why does sodium form Na⁺ and not Na²⁺?", "It has one outer electron; losing just that gives a full shell."]
      ],
      "covalent-bonding": [
        ["Explain why water is a liquid at room temperature but sodium chloride is a solid.", "Water is simple molecular: only weak intermolecular forces hold the molecules together. NaCl is a giant ionic lattice held by strong electrostatic attraction, which needs much more energy to break."],
        ["When water boils, are the O–H bonds broken? Explain.", "No. Boiling only overcomes the weak forces between molecules. The strong covalent bonds inside each H₂O molecule stay intact — steam is still H₂O."],
        ["Describe the bonding in a nitrogen molecule, N₂.", "Each N atom has 5 outer electrons and needs 3 more. They share three pairs — a triple bond — so each has 8 in its outer shell."],
        ["Why does CO₂ contain double bonds?", "Carbon needs 4 more electrons and each oxygen needs 2. Carbon shares two pairs with each oxygen (O=C=O), giving every atom a full outer shell."],
        ["Why doesn't sugar solution conduct electricity?", "Sugar is a covalent molecular substance: it dissolves as neutral molecules, with no ions or free electrons to carry charge."],
        ["Why does the boiling point increase from methane to propane?", "Larger molecules have stronger intermolecular forces, so more energy is needed to separate them."],
        ["Describe the dot-and-cross diagram of HCl.", "One shared pair between H and Cl; Cl also has three lone pairs."],
        ["Describe the bonding in methanol, CH₃OH.", "Three C–H, one C–O and one O–H single bond; O has two lone pairs."],
        ["Why is chlorine a gas at room temperature?", "Cl₂ molecules have only weak intermolecular forces, which little energy overcomes."],
        ["Describe the bonding in ethene, C₂H₄.", "A C=C double bond and four C–H single bonds."],
        ["Why does a covalent bond hold atoms together?", "Both nuclei are attracted to the shared pair of electrons."],
        ["Why do simple molecular substances not conduct even when molten?", "There are no ions or free electrons to carry charge."],
        ["Describe the bonding in ammonia, NH₃.", "Three N–H single bonds; N has one lone pair."],
        ["Why is oxygen gas O₂ held by a double bond?", "Each oxygen needs two more electrons, so they share two pairs."]
      ],
      "giant-structures": [
        ["Graphite and diamond are both pure carbon. Explain why only graphite conducts.", "In graphite each carbon bonds to only 3 others, so one electron per atom is delocalised and moves along the layers. In diamond all 4 outer electrons are used in bonds."],
        ["Why is graphite used as a lubricant and in pencils?", "Its layers are held together only by weak forces, so they slide over each other easily and rub off onto paper."],
        ["Why does silicon dioxide have a very high melting point although it is covalent?", "It is a giant covalent structure: melting means breaking many strong covalent bonds throughout the lattice, not just weak intermolecular forces."],
        ["Explain why metals conduct electricity in both solid and liquid states.", "The delocalised electrons are free to move through the structure in either state and carry charge."],
        ["Explain why a metal can be hammered into shape without shattering.", "The layers of positive ions slide over each other, but the sea of delocalised electrons still holds them together, so the bonding is not broken."],
        ["A substance melts at 1700 °C, does not conduct as solid or liquid, and is insoluble. What structure is it most likely to have?", "Giant covalent (like SiO₂) — very high melting point, but no ions or free electrons to conduct."],
        ["Why is diamond used in cutting tools?", "It is extremely hard, because every carbon is bonded to four others."],
        ["Why does graphite have a high melting point although it is soft?", "Melting breaks strong covalent bonds within the layers; softness comes from weak forces between layers."],
        ["Why is silicon dioxide similar to diamond?", "Both are giant covalent structures with each atom strongly bonded in a 3D network."],
        ["Why is graphite used for electrodes?", "It conducts electricity, has a high melting point and is fairly unreactive."],
        ["A substance melts at 98 °C and conducts when solid. What type of structure?", "Metallic (e.g. sodium)."],
        ["A substance melts at 801 °C, conducts only when molten or dissolved. What type?", "Giant ionic."],
        ["Why are metals ductile?", "Layers of ions can slide past each other while the delocalised electrons keep them bonded."],
        ["Why does graphite feel slippery?", "Layers slide over each other easily because forces between them are weak."]
      ]
    },

    "ch-stoichiometry": {
      "formulae": [
        ["Balance: Al + O₂ → Al₂O₃.", "4Al + 3O₂ → 2Al₂O₃ — 4 Al and 6 O on each side."],
        ["Write a balanced equation with state symbols for magnesium reacting with hydrochloric acid.", "Mg(s) + 2HCl(aq) → MgCl₂(aq) + H₂(g)"],
        ["Calculate the Mr of Ca(OH)₂ (Ca 40, O 16, H 1). Why do the brackets matter?", "40 + 2 × (16 + 1) = 74. The 2 multiplies everything inside the bracket — both O and H."],
        ["What is the empirical formula of glucose, C₆H₁₂O₆? Explain.", "CH₂O — divide every subscript by the highest common factor, 6."],
        ["Write the ionic equation for silver nitrate reacting with sodium chloride. Which ions are spectators?", "Ag⁺(aq) + Cl⁻(aq) → AgCl(s). Na⁺ and NO₃⁻ are spectator ions — they don't change."],
        ["A student balances H₂ + O₂ → H₂O by writing H₂ + O₂ → H₂O₂. What is wrong?", "They changed the formula of the product: H₂O₂ is hydrogen peroxide, a different substance. Only coefficients may change: 2H₂ + O₂ → 2H₂O."],
        ["Calculate the percentage by mass of nitrogen in ammonium nitrate, NH₄NO₃ (N 14, H 1, O 16).", "Mr = 14 + 4 + 14 + 48 = 80. Mass of N = 28. 28 ÷ 80 × 100 = 35%."],
        ["Balance: Fe + Cl₂ → FeCl₃.", "2Fe + 3Cl₂ → 2FeCl₃."],
        ["Balance: C₃H₈ + O₂ → CO₂ + H₂O.", "C₃H₈ + 5O₂ → 3CO₂ + 4H₂O."],
        ["Calculate the Mr of (NH₄)₂SO₄ (N 14, H 1, S 32, O 16).", "2(14 + 4) + 32 + 64 = 132."],
        ["What is the empirical formula of C₂H₄?", "CH₂."],
        ["Write the ionic equation for precipitating barium sulfate.", "Ba²⁺(aq) + SO₄²⁻(aq) → BaSO₄(s)."],
        ["Calculate the % by mass of oxygen in water (H 1, O 16).", "16 ÷ 18 × 100 = 88.9%."],
        ["Why can't you change the small numbers in formulae to balance an equation?", "That changes the substance itself; only the big numbers in front can change."],
        ["Balance: Na + H₂O → NaOH + H₂.", "2Na + 2H₂O → 2NaOH + H₂."]
      ],
      "the-mole": [
        ["What mass of CO₂ forms when 10 g of CaCO₃ decomposes? CaCO₃ → CaO + CO₂ (Mr 100 and 44)", "10 ÷ 100 = 0.1 mol CaCO₃ → 0.1 mol CO₂ (1 : 1) → 0.1 × 44 = 4.4 g."],
        ["What volume of hydrogen at r.t.p. forms when 2.4 g of Mg reacts with excess acid? (Ar Mg 24)", "2.4 ÷ 24 = 0.1 mol Mg → 0.1 mol H₂ → 0.1 × 24 = 2.4 dm³."],
        ["25.0 cm³ of NaOH is neutralised by 20.0 cm³ of 0.100 mol/dm³ HCl. Find the NaOH concentration.", "Moles HCl = 0.100 × 0.0200 = 0.00200 mol = moles NaOH (1 : 1). 0.00200 ÷ 0.0250 = 0.0800 mol/dm³."],
        ["A compound is 2.4 g C and 0.6 g H. Find its empirical formula.", "C: 2.4 ÷ 12 = 0.2; H: 0.6 ÷ 1 = 0.6. Ratio 0.2 : 0.6 = 1 : 3 → CH₃."],
        ["The theoretical yield is 50 g but only 40 g is collected. Give the percentage yield and two reasons it isn't 100%.", "40 ÷ 50 × 100 = 80%. Reasons: product lost when filtering or transferring, the reaction is reversible or incomplete, side reactions."],
        ["How many atoms are in 0.5 mol of water molecules?", "0.5 × 6.02 × 10²³ = 3.01 × 10²³ molecules, each with 3 atoms → 9.03 × 10²³ atoms."],
        ["Explain how you decide which reactant is limiting.", "Convert each mass to moles, divide by its coefficient in the equation; the smallest value is limiting — it runs out first and fixes the amount of product."],
        ["How many moles are in 9 g of water (Mr 18)?", "9 ÷ 18 = 0.5 mol."],
        ["Find the mass of 0.25 mol of NaCl (Mr 58.5).", "0.25 × 58.5 = 14.6 g."],
        ["What volume do 0.2 mol of oxygen occupy at r.t.p.?", "0.2 × 24 = 4.8 dm³."],
        ["How many moles of HCl are in 50 cm³ of 2.0 mol/dm³ acid?", "2.0 × 0.050 = 0.10 mol."],
        ["Convert 0.5 mol/dm³ NaOH (Mr 40) to g/dm³.", "0.5 × 40 = 20 g/dm³."],
        ["A compound is 40% C, 6.7% H, 53.3% O. Find its empirical formula.", "Moles: 3.33, 6.7, 3.33 → ratio 1:2:1, CH₂O."],
        ["The empirical formula is CH₂ and the Mr is 56. Find the molecular formula.", "CH₂ = 14; 56 ÷ 14 = 4, so C₄H₈."],
        ["A product is 8 g of a 10 g sample. What is the percentage purity?", "8 ÷ 10 × 100 = 80%."],
        ["What mass of MgO forms from 6 g of Mg? (2Mg + O₂ → 2MgO; Ar Mg 24, O 16)", "6 ÷ 24 = 0.25 mol Mg → 0.25 mol MgO × 40 = 10 g."],
        ["How many moles are in 1.2 dm³ of CO₂ at r.t.p.?", "1.2 ÷ 24 = 0.05 mol."]
      ]
    },

    "ch-electrochemistry": {
      "electrolysis": [
        ["Predict the products at each electrode when aqueous copper(II) chloride is electrolysed with carbon electrodes.", "Cathode: copper (less reactive than hydrogen). Anode: chlorine (a concentrated chloride)."],
        ["Predict the products of electrolysing aqueous potassium sulfate. Explain.", "Cathode: hydrogen, because K is more reactive than hydrogen. Anode: oxygen, because sulfate is not a halide. Effectively water is split."],
        ["Why is the electrolysis of molten lead(II) bromide done in a fume cupboard?", "Bromine vapour is given off at the anode, and it is toxic."],
        ["Explain why electrolysis at the cathode is described as reduction.", "Positive ions gain electrons at the cathode, e.g. Cu²⁺ + 2e⁻ → Cu. Gain of electrons is reduction."],
        ["During electrolysis of dilute sulfuric acid, why is the volume of hydrogen twice the volume of oxygen?", "4 electrons make 2 H₂ (2H⁺ + 2e⁻ → H₂, twice) but only 1 O₂ (4OH⁻ → O₂ + 2H₂O + 4e⁻). Same charge → 2 : 1 by moles, so by volume."],
        ["Why is the solution alkaline after electrolysing concentrated sodium chloride solution?", "H⁺ is discharged at the cathode and Cl⁻ at the anode, leaving Na⁺ and OH⁻ — sodium hydroxide."],
        ["Write the half-equation at the cathode for aqueous silver nitrate.", "Ag⁺ + e⁻ → Ag"],
        ["Predict the products of electrolysing molten sodium chloride.", "Sodium at the cathode; chlorine at the anode."],
        ["Predict the products of electrolysing dilute sulfuric acid.", "Hydrogen at the cathode; oxygen at the anode."],
        ["Write the half-equation at the cathode for aqueous copper(II) sulfate.", "Cu²⁺ + 2e⁻ → Cu."],
        ["Why is hydrogen produced instead of sodium in aqueous NaCl?", "Sodium is more reactive than hydrogen, so H⁺ ions are discharged instead."],
        ["What would you observe at each electrode in CuSO₄(aq) with carbon electrodes?", "Pink-brown copper coats the cathode; bubbles of oxygen at the anode."],
        ["Why is chlorine produced from concentrated but oxygen from dilute NaCl?", "At high concentration Cl⁻ ions are discharged preferentially; when dilute, OH⁻ (from water) is discharged."],
        ["Why does an electrolyte need ions?", "Moving ions carry the charge through the liquid."],
        ["Why does copper not form at the cathode when aqueous sodium sulfate is electrolysed?", "There are no copper ions; hydrogen ions are discharged instead."]
      ],
      "applications": [
        ["Explain why the object to be plated must be the cathode.", "Metal ions are positive, so they move to the negative cathode, gain electrons and are deposited as metal on its surface."],
        ["During copper plating with a copper anode, why does the electrolyte stay the same colour?", "Copper atoms from the anode dissolve as Cu²⁺ at the same rate as Cu²⁺ is deposited on the object, so the concentration of Cu²⁺ stays constant."],
        ["Why is tin plating used on food cans rather than zinc?", "Tin is unreactive, so it doesn't react with the food and resists corrosion; zinc compounds could get into the food."],
        ["Fuel cell cars are said to be ‘zero emission’. Evaluate this claim.", "Only water comes out of the car, so true at the point of use. But hydrogen is often made from fossil fuels (methane) or with electricity from power stations, which produce CO₂."],
        ["Write the overall equation for a hydrogen fuel cell and say why it is like combustion but more useful.", "2H₂ + O₂ → 2H₂O. Same reaction as burning hydrogen, but the energy is released as electricity directly, which is more efficient than heat."],
        ["Give the electrolyte and electrodes you would use to plate a nickel layer on an iron key.", "Key as cathode, nickel anode, a solution of a nickel salt (e.g. nickel sulfate) as electrolyte."],
        ["Write the half-equation for plating silver at the cathode.", "Ag⁺ + e⁻ → Ag."],
        ["Why is a fuel cell more efficient than burning hydrogen in an engine?", "It converts chemical energy straight into electrical energy, with less wasted as heat."],
        ["Why is storing hydrogen in cars difficult?", "It is a flammable gas and must be stored at high pressure in heavy tanks."],
        ["Why might electroplating be done on a cheaper metal?", "It gives a valuable or protective surface without the cost of a solid object."],
        ["Why would a dirty spoon plate unevenly?", "Grease stops the metal ions reaching and sticking to the surface."],
        ["Why does the mass of the anode decrease in electroplating?", "Metal atoms lose electrons and go into solution as ions."],
        ["Why might hydrogen made by electrolysis still cause pollution?", "The electricity may come from fossil fuel power stations."]
      ]
    },

    "electrolysis": {
      "molten": [
        ["Why must ionic compounds be molten to electrolyse them without water?", "Melting breaks down the lattice so ions can move to the electrodes; in the solid they are fixed."],
        ["Predict the products of electrolysing molten zinc chloride, with half-equations.", "Cathode: zinc, Zn²⁺ + 2e⁻ → Zn. Anode: chlorine, 2Cl⁻ → Cl₂ + 2e⁻."],
        ["Explain how electric charge flows round the complete circuit during electrolysis.", "Electrons flow through the wires from the anode to the cathode; in the electrolyte, ions carry the charge — cations to the cathode, anions to the anode."],
        ["Why does the bulb only light once the lead bromide has melted?", "Only then are the ions free to move and carry charge, completing the circuit."],
        ["Bromide ions are oxidised at the anode. Explain what that means for the electrons.", "Each Br⁻ loses an electron (2Br⁻ → Br₂ + 2e⁻). Loss of electrons is oxidation; the electrons pass into the wire."],
        ["Molten aluminium oxide is electrolysed. Write both half-equations.", "Cathode: Al³⁺ + 3e⁻ → Al. Anode: 2O²⁻ → O₂ + 4e⁻."],
        ["Predict the products of electrolysing molten potassium iodide.", "Potassium at the cathode; iodine at the anode."],
        ["Write the cathode half-equation for molten zinc chloride.", "Zn²⁺ + 2e⁻ → Zn."],
        ["Why do electrons flow out of the anode into the wire?", "Negative ions give up electrons there, which the power supply pulls round the circuit."],
        ["Write the anode half-equation for molten sodium chloride.", "2Cl⁻ → Cl₂ + 2e⁻."],
        ["Why are two Br⁻ ions needed to make one bromine molecule?", "Bromine exists as Br₂, so two atoms pair up after losing one electron each."],
        ["What happens to the bulb if the heating stops and the lead bromide solidifies?", "It goes out — the ions are fixed again and can't carry charge."],
        ["Predict the products of electrolysing molten calcium bromide.", "Calcium at the cathode; bromine at the anode."]
      ],
      "solutions": [
        ["In aqueous NaCl, both Na⁺ and H⁺ reach the cathode. Why is hydrogen discharged?", "Hydrogen is less reactive than sodium, so H⁺ gains electrons more easily — the less reactive element is discharged."],
        ["Concentrated vs dilute NaCl: why is the anode product different?", "Concentrated: lots of Cl⁻, so chlorine forms. Dilute: few Cl⁻, so OH⁻ from water is discharged and oxygen forms."],
        ["Predict the products of electrolysing aqueous copper(II) sulfate with carbon electrodes.", "Cathode: copper (less reactive than H). Anode: oxygen (sulfate is not a halide). The solution becomes acidic and the blue fades."],
        ["Predict the products for aqueous potassium iodide (concentrated).", "Cathode: hydrogen (K more reactive than H). Anode: iodine (a halide) — the solution turns brown near the anode."],
        ["How would you test the gases from electrolysing dilute sulfuric acid?", "Cathode gas: lighted splint pops → hydrogen. Anode gas: relights a glowing splint → oxygen."],
        ["What is left in solution after electrolysing aqueous copper(II) sulfate with carbon electrodes?", "Sulfuric acid — Cu²⁺ and OH⁻ are removed, leaving H⁺ and SO₄²⁻."],
        ["Predict the products of electrolysing aqueous silver nitrate.", "Silver at the cathode; oxygen at the anode."],
        ["Predict the products of electrolysing aqueous sodium sulfate.", "Hydrogen at the cathode; oxygen at the anode."],
        ["Predict the products for concentrated hydrochloric acid.", "Hydrogen at the cathode; chlorine at the anode."],
        ["Why is the volume of chlorine collected often less than expected?", "Chlorine is slightly soluble in water."],
        ["Why does aqueous copper(II) sulfate become acidic during electrolysis with carbon electrodes?", "Cu²⁺ and OH⁻ are removed, leaving H⁺ and SO₄²⁻ — sulfuric acid."],
        ["Why does the solution around the anode bleach indicator paper in brine electrolysis?", "Chlorine is produced there, and it is a bleach."],
        ["Why does universal indicator turn purple near the cathode in brine electrolysis?", "Hydroxide ions build up there as hydrogen is released."]
      ],
      "copper": [
        ["In copper purification the anode loses 6.4 g. Roughly what does the cathode gain, and why is it a little less?", "Just under 6.4 g. Copper atoms move from anode to cathode, but impurities from the anode fall as sludge instead of depositing."],
        ["Why do impurities fall to the bottom as sludge during copper purification?", "Unreactive impurities (like silver and gold) don't form ions, so they are released and sink as the anode dissolves."],
        ["Compare what happens at the anode with copper electrodes and carbon electrodes in CuSO₄(aq).", "Copper anode: copper dissolves, Cu → Cu²⁺ + 2e⁻. Carbon anode: inert, so OH⁻ is discharged and oxygen bubbles off."],
        ["Why does the blue colour fade with carbon electrodes but not copper electrodes?", "With carbon, Cu²⁺ is removed at the cathode and not replaced. With copper, the anode supplies new Cu²⁺ at the same rate."],
        ["Why is pure copper needed for electrical wires?", "Impurities increase the resistance, so wires would heat up and waste energy."],
        ["A student plates a spoon but the coating flakes off. Suggest a cause.", "The spoon was not cleaned (grease or oxide stops the metal bonding), or the current was too high so the metal was deposited too fast."],
        ["Why does the cathode get heavier during copper purification?", "Cu²⁺ ions gain electrons and deposit as copper on it."],
        ["Why is the mass gained by the cathode equal to the mass lost by a pure copper anode?", "Each copper atom that dissolves at the anode is matched by one deposited at the cathode."],
        ["Why can valuable metals be recovered from anode sludge?", "Less reactive metals like silver and gold don't dissolve, so they collect below the anode."],
        ["What would you see at the cathode with carbon electrodes in CuSO₄(aq)?", "A pink-brown coating of copper."],
        ["How could you show that the mass changes depend on the current?", "Weigh electrodes before and after; repeat with different currents for the same time."],
        ["Why must the key be cleaned before copper plating?", "So the copper sticks evenly to a clean surface."],
        ["Why is the impure copper anode made thinner over time?", "Its copper atoms are oxidised to Cu²⁺ ions and dissolve."]
      ]
    },

    "ch-energetics": {
      "exo-endo": [
        ["The temperature of a solution rises from 20 °C to 31 °C during a reaction. Is it exo- or endothermic? Is ΔH positive or negative?", "Exothermic: energy was transferred to the surroundings (the solution). ΔH is negative."],
        ["Explain in terms of bonds why combustion is exothermic.", "More energy is released when the new bonds in CO₂ and H₂O form than is taken in to break the bonds in the fuel and oxygen."],
        ["H₂ + Cl₂ → 2HCl. Bonds: H–H 436, Cl–Cl 242, H–Cl 431 kJ/mol. Calculate ΔH.", "Broken: 436 + 242 = 678. Made: 2 × 431 = 862. ΔH = 678 − 862 = −184 kJ/mol (exothermic)."],
        ["Why do reactions need activation energy even if they are exothermic?", "Bonds in the reactants must start to break before new bonds can form; that needs an initial input of energy — the hump on the diagram."],
        ["Sketch in words the reaction pathway diagram for an endothermic reaction with a catalyst.", "Products higher than reactants; ΔH arrow points up; the catalysed hump is lower than the uncatalysed one, but reactant and product levels are unchanged."],
        ["Dissolving ammonium nitrate in water makes the beaker cold. Explain.", "The process is endothermic: it takes in thermal energy from the water and surroundings, so their temperature falls."],
        ["Why does a match need to be struck to start burning?", "Striking supplies the activation energy; once burning, the energy released keeps supplying the activation energy for more fuel."],
        ["CH₄ + 2O₂ → CO₂ + 2H₂O. C–H 412, O=O 496, C=O 743, O–H 463 kJ/mol. Find ΔH.", "Broken: 4(412) + 2(496) = 2640. Made: 2(743) + 4(463) = 3338. ΔH = −698 kJ/mol."],
        ["Why does an exothermic reaction feel warm?", "Energy is transferred from the reacting chemicals to the surroundings, including your hand."],
        ["Why is a cold pack endothermic?", "Dissolving the salt takes energy from the surroundings, lowering their temperature."],
        ["On a pathway diagram, why is the products' level higher for an endothermic reaction?", "The products have more energy than the reactants; energy was taken in."],
        ["Why does a catalyst not change ΔH?", "Reactants and products have the same energy; only the route (activation energy) changes."],
        ["Is photosynthesis exo- or endothermic? Explain.", "Endothermic — it takes in energy from light."],
        ["Why do bond energy calculations give only approximate values?", "They use average bond energies, which vary slightly between molecules."],
        ["Why is respiration exothermic?", "More energy is released forming bonds in CO₂ and water than is used breaking bonds in glucose and oxygen."],
        ["Why does a hand warmer get hot?", "An exothermic reaction (e.g. iron oxidising) releases energy to the surroundings."]
      ]
    },

    "ch-chemical-reactions": {
      "rate": [
        ["Marble chips and marble powder react with the same acid. Which is faster, and why?", "Powder: it has a larger surface area, so more particles are exposed and collisions are more frequent."],
        ["Explain why a 10 °C rise can roughly double the rate.", "Particles move faster so collide more often — but mainly a much greater proportion of collisions now have energy ≥ Eₐ, so far more collisions are successful."],
        ["The concentration of acid is doubled but the amount of magnesium (limiting) is the same. What happens to the rate and to the final volume of gas?", "Rate increases (more frequent collisions), but the final volume of H₂ stays the same, because the magnesium limits it."],
        ["Why does a reaction slow down as it goes on?", "Reactants are used up, so their concentration falls and collisions become less frequent."],
        ["How does a catalyst increase the rate without being used up?", "It gives an alternative pathway with a lower activation energy, so more collisions are successful; it is regenerated at the end."],
        ["Why are flour mills and coal mines at risk of explosions?", "Fine powder has a huge surface area, so in air it can burn so fast it explodes."],
        ["On a gas volume–time graph, how would a lower temperature change the curve?", "Shallower gradient at the start (slower rate), reaching the same final volume, but later."],
        ["Why does chewing food help digestion work faster?", "It increases the surface area for enzymes to act on."],
        ["Why does a reaction stop?", "One reactant (the limiting reactant) is used up."],
        ["How would adding a catalyst change a gas volume–time graph?", "Steeper at the start; same final volume, reached sooner."],
        ["Why does food go off more slowly in a fridge?", "Lower temperature slows the reactions of microorganisms and enzymes."],
        ["Calculate the average rate: 60 cm³ of gas in 30 s.", "60 ÷ 30 = 2 cm³/s."],
        ["Why does higher temperature increase the rate more than collision frequency alone explains?", "More particles have energy greater than the activation energy, so a bigger fraction of collisions succeed."],
        ["In the disappearing-cross experiment, how is the rate related to time?", "Rate is proportional to 1 ÷ time: shorter time, faster rate."],
        ["Why is a cotton wool plug used in a mass-loss experiment?", "It lets gas out but stops acid spraying out."]
      ],
      "equilibrium": [
        ["N₂ + 3H₂ ⇌ 2NH₃ is exothermic. Predict the effect of raising the temperature on the yield of ammonia.", "The equilibrium shifts in the endothermic (backward) direction to oppose the rise, so the yield of NH₃ falls."],
        ["Explain why raising the pressure increases the yield of ammonia.", "There are 4 gas molecules on the left and 2 on the right; higher pressure shifts equilibrium to the side with fewer molecules — the ammonia side."],
        ["Why does the Haber process use 200 atm and not 1000 atm?", "Higher pressure would give more ammonia, but the equipment would be very expensive and dangerous — 200 atm is a compromise."],
        ["Why is the ammonia removed as a liquid and the unreacted gases recycled?", "Removing ammonia allows more to form; recycling N₂ and H₂ means none is wasted, so the overall conversion is high."],
        ["Explain why dynamic equilibrium is called ‘dynamic’.", "Both reactions are still happening, at equal rates — so the concentrations stay constant even though particles keep reacting."],
        ["2SO₂ + O₂ ⇌ 2SO₃ is exothermic. Why isn't a low temperature used in the Contact process?", "A low temperature would give a higher yield but the rate would be too slow; about 450 °C with a V₂O₅ catalyst is a compromise."],
        ["Blue hydrated copper(II) sulfate is heated, then water is added. Describe and explain what you see.", "Turns white as water is driven off (endothermic); when water is added it turns blue again and gets hot — the reverse reaction is exothermic."],
        ["Why do the concentrations stay constant at equilibrium even though reactions continue?", "Forward and reverse reactions happen at the same rate."],
        ["How does removing ammonia affect the Haber equilibrium?", "It shifts right to replace the ammonia, increasing the yield."],
        ["Why does a catalyst not change the yield at equilibrium?", "It speeds up both forward and reverse reactions equally."],
        ["2SO₂ + O₂ ⇌ 2SO₃: why does higher pressure favour SO₃?", "There are fewer gas molecules on the right (2 vs 3)."],
        ["Why are high pressures expensive and dangerous?", "They need strong equipment and lots of energy, with a risk of explosion."],
        ["Why does heating hydrated copper sulfate take in energy, but adding water gives it out?", "The reaction is reversible; if one direction is endothermic, the reverse is exothermic by the same amount."],
        ["H₂ + I₂ ⇌ 2HI: what effect does pressure have on yield?", "None — there are 2 gas molecules on each side."],
        ["Why is the Haber process carried out continuously?", "Unreacted gases are recycled, so most of them eventually become ammonia."]
      ],
      "redox": [
        ["In Zn + CuSO₄ → ZnSO₄ + Cu, identify what is oxidised and reduced in terms of electrons.", "Zn loses 2 electrons → Zn²⁺ (oxidised). Cu²⁺ gains 2 electrons → Cu (reduced)."],
        ["Identify the oxidising agent and the reducing agent in Fe₂O₃ + 3CO → 2Fe + 3CO₂.", "CO is the reducing agent (it takes oxygen and is oxidised to CO₂). Fe₂O₃ is the oxidising agent (it is reduced to Fe)."],
        ["What is the oxidation number of S in SO₄²⁻? (O = −2)", "4 × (−2) = −8; total charge −2, so S = +6."],
        ["In Cl₂ + 2KI → 2KCl + I₂, explain which species is oxidised using oxidation numbers.", "Iodine goes from −1 (I⁻) to 0 (I₂): an increase, so I⁻ is oxidised. Chlorine goes from 0 to −1: reduced."],
        ["Why must oxidation and reduction always happen together?", "Electrons lost by one substance must be gained by another — they can't just disappear."],
        ["Acidified potassium manganate(VII) is added to an unknown solution and goes colourless. What does that tell you?", "The solution contains a reducing agent: it reduced the purple manganate(VII) ions."],
        ["What is the oxidation number of Fe in Fe₂O₃?", "+3 (2x + 3(−2) = 0)."],
        ["In 2Mg + O₂ → 2MgO, what is oxidised?", "Magnesium — it gains oxygen and loses electrons."],
        ["What is the oxidation number of Mn in MnO₄⁻?", "+7 (x + 4(−2) = −1)."],
        ["Why is carbon monoxide a reducing agent in the blast furnace?", "It removes oxygen from iron(III) oxide and is itself oxidised to CO₂."],
        ["Why is the reaction of Fe²⁺ to Fe³⁺ oxidation?", "Fe²⁺ loses an electron; its oxidation number rises from +2 to +3."],
        ["In Cu²⁺ + Zn → Cu + Zn²⁺, which is the oxidising agent?", "Cu²⁺ — it accepts electrons from zinc."],
        ["Is a reaction where oxidation numbers don't change a redox reaction?", "No — e.g. neutralisation is not redox."],
        ["What is the oxidation number of N in NH₃?", "−3 (x + 3(+1) = 0)."]
      ]
    },

    "ch-acids-bases-salts": {
      "acids-bases": [
        ["Hydrochloric and ethanoic acid at the same concentration react with magnesium. Which fizzes faster, and why?", "Hydrochloric: it is a strong acid, fully ionised, so it has a higher concentration of H⁺ ions and more frequent collisions."],
        ["Explain why a weak acid can still be concentrated.", "‘Weak’ is about how much it ionises; ‘concentrated’ is about how much acid is dissolved per dm³. A lot of a poorly ionised acid is concentrated and weak."],
        ["Write the ionic equation for any acid–alkali neutralisation and explain why it's the same for all.", "H⁺(aq) + OH⁻(aq) → H₂O(l). The other ions are spectators; the reaction is always H⁺ and OH⁻ making water."],
        ["In HCl + NH₃ → NH₄Cl, explain which is the acid and which is the base using protons.", "HCl donates a proton (H⁺) — acid. NH₃ accepts it to become NH₄⁺ — base."],
        ["Zinc oxide reacts with both hydrochloric acid and sodium hydroxide. What does this tell you?", "It is amphoteric — it can behave as a base (with acids) and as an acid (with bases)."],
        ["Why is sulfur dioxide described as an acidic oxide?", "It is a non-metal oxide that dissolves in water to form an acidic solution (and reacts with bases)."],
        ["Solution A has pH 1, solution B pH 3. Compare their H⁺ concentrations.", "A has the higher H⁺ concentration — lower pH means more H⁺ (in fact about 100 times more)."],
        ["What do you see when magnesium is added to hydrochloric acid? Name the products.", "Fizzing as the metal dissolves; magnesium chloride and hydrogen."],
        ["Name the salt formed from calcium carbonate and nitric acid.", "Calcium nitrate (plus water and carbon dioxide)."],
        ["Why is ammonia gas given off when NaOH is warmed with ammonium chloride?", "The alkali takes H⁺ from the ammonium ion, forming NH₃."],
        ["Why is ethanoic acid a weak acid?", "It only partly dissociates into ions in water."],
        ["Why does a strong acid have a lower pH than a weak acid of the same concentration?", "It fully dissociates, giving a higher concentration of H⁺ ions."],
        ["Why is lime added to acidic soil?", "It is a base and neutralises the acid."],
        ["Why does carbon dioxide make limewater go cloudy but also dissolve to form an acid?", "CO₂ is an acidic oxide: it forms a weak acid in water and reacts with calcium hydroxide to give insoluble CaCO₃."],
        ["Why do indigestion tablets contain bases?", "They neutralise excess stomach acid."]
      ],
      "salts": [
        ["Describe how to make pure dry copper(II) sulfate crystals from copper(II) oxide.", "Warm dilute sulfuric acid, add CuO until no more dissolves (excess), filter off the excess, heat the filtrate to the crystallisation point, leave to cool, filter and dry the crystals."],
        ["Why can't you make sodium chloride by adding excess sodium hydroxide and filtering?", "NaOH is soluble, so the excess can't be filtered off. Use titration to find the exact volumes, then repeat without indicator."],
        ["Choose a method and reagents to make lead(II) iodide.", "It is insoluble, so precipitation: mix lead(II) nitrate and potassium iodide solutions, filter, wash with distilled water, dry."],
        ["Why is the solution only heated to the crystallisation point and not to dryness?", "Heating to dryness can drive off the water of crystallisation and may decompose the salt, giving a powder rather than crystals."],
        ["Why is the precipitate washed with distilled water?", "To remove the soluble ions (e.g. KNO₃) left on it, so the salt is pure."],
        ["Which acid and which carbonate would you use to make zinc nitrate?", "Nitric acid with zinc carbonate (in excess)."],
        ["Heating 5.0 g of hydrated CuSO₄ gives 3.2 g anhydrous. Find x in CuSO₄·xH₂O. (Mr CuSO₄ 160, H₂O 18)", "Water = 1.8 g → 0.1 mol; CuSO₄ = 3.2 ÷ 160 = 0.02 mol. Ratio 0.02 : 0.1 = 1 : 5 → x = 5."],
        ["Describe how to make sodium sulfate by titration.", "Titrate NaOH with H₂SO₄ using an indicator, repeat without the indicator, then evaporate and crystallise."],
        ["Choose reagents to make barium sulfate.", "Barium chloride (or nitrate) solution + sodium sulfate solution (or sulfuric acid)."],
        ["Why is excess copper(II) oxide filtered off after reacting with acid?", "It is insoluble, so filtering leaves just the salt solution."],
        ["Which acid and base make potassium nitrate?", "Nitric acid and potassium hydroxide."],
        ["How do you know all the acid has reacted when adding a metal carbonate?", "Fizzing stops and solid remains in the flask."],
        ["Why can't you make copper sulfate by adding copper metal to sulfuric acid?", "Copper is below hydrogen in the reactivity series, so it doesn't react with dilute acid."],
        ["Write the equation for making silver chloride by precipitation.", "AgNO₃(aq) + NaCl(aq) → AgCl(s) + NaNO₃(aq)."],
        ["Why is a salt solution left to cool slowly?", "Larger crystals form."]
      ]
    },

    "ch-periodic-table": {
      "arrangement": [
        ["Why do elements in the same group react in similar ways?", "They have the same number of outer-shell electrons, and reactions involve outer electrons."],
        ["Element Q is in Period 3, Group II. Write its electronic configuration and the formula of its chloride.", "2,8,2 (magnesium). It forms Q²⁺, so the chloride is QCl₂."],
        ["How does the type of oxide change across Period 3?", "From basic (metal oxides on the left, e.g. Na₂O) to acidic (non-metal oxides on the right, e.g. SO₂)."],
        ["Why do Group VII elements form 1− ions?", "They have 7 outer electrons and gain 1 to reach a full outer shell."],
        ["Mendeleev left gaps in his table. Why was this a good idea?", "He predicted undiscovered elements would fit there; when they were found, their properties matched his predictions."],
        ["Predict whether element 34 (selenium, Group VI) is a metal and the charge of its ion.", "Non-metal (right of the staircase), forming Se²⁻."],
        ["Element Z has configuration 2,8,3. Where is it in the table?", "Group III, Period 3 (aluminium)."],
        ["Why do metals become less reactive across a period?", "Atoms hold their outer electrons more tightly, so it's harder to lose them."],
        ["Predict the formula of the compound of Group II element X with chlorine.", "XCl₂."],
        ["Why does Group VIII have no ions?", "Atoms already have full outer shells, so they don't lose or gain electrons."],
        ["Predict whether rubidium (Group I) reacts with water more or less vigorously than potassium.", "More vigorously — reactivity increases down Group I."],
        ["Why do elements in Group II form 2+ ions?", "They lose their 2 outer electrons to reach a full shell."],
        ["Why is hydrogen hard to place in the Periodic Table?", "It has one electron like Group I, but is a non-metal gas."]
      ],
      "groups": [
        ["Explain why potassium is more reactive than sodium.", "Its outer electron is in a shell further from the nucleus, with more shielding, so it is lost more easily."],
        ["Predict what happens when caesium is put in water.", "It reacts explosively: caesium hydroxide (alkaline) and hydrogen form — even more violently than potassium."],
        ["Explain why fluorine is more reactive than chlorine.", "A halogen reacts by gaining an electron. Fluorine is smaller, so the incoming electron is closer to the nucleus and attracted more strongly."],
        ["Bromine water is added to potassium iodide. Predict and explain the result.", "The solution turns brown: bromine is more reactive than iodine, so it displaces it — Br₂ + 2KI → 2KBr + I₂."],
        ["Write the ionic equation for chlorine displacing bromine and explain why it is redox.", "Cl₂ + 2Br⁻ → 2Cl⁻ + Br₂. Chlorine gains electrons (reduced); bromide ions lose electrons (oxidised)."],
        ["Why are transition metals and their compounds useful in industry?", "They often act as catalysts (iron in the Haber process), and they are strong with high melting points."],
        ["Why are alkali metals stored under oil?", "They react quickly with oxygen and water vapour in the air; oil keeps air and moisture away."],
        ["Write the equation for potassium reacting with water.", "2K + 2H₂O → 2KOH + H₂."],
        ["Why does reactivity increase down Group I?", "The outer electron is further from the nucleus, so it is lost more easily."],
        ["Why does reactivity decrease down Group VII?", "The outer shell is further from the nucleus, so an electron is gained less easily."],
        ["Predict the state of astatine at room temperature.", "Solid — melting points rise down Group VII."],
        ["Why does iodine not react with potassium chloride solution?", "Iodine is less reactive than chlorine, so it can't displace it."],
        ["Why do transition metal compounds give coloured solutions?", "Transition metal ions are usually coloured, e.g. Cu²⁺ is blue."],
        ["What colour does the solution turn when chlorine displaces iodine from potassium iodide?", "Brown (iodine)."],
        ["Why are noble gases used in light bulbs and signs?", "They are unreactive, and some glow when electricity passes through."]
      ]
    },

    "ch-metals": {
      "properties": [
        ["Explain, using structure, why bronze is harder than pure copper.", "Tin atoms are a different size from copper atoms, which distorts the regular layers so they can't slide over each other easily."],
        ["Why is aluminium, not iron, used for overhead power cables (with a steel core)?", "Aluminium has a low density (lighter cables), conducts well and resists corrosion; the steel core adds strength."],
        ["A metal is used for food cans because of its properties. Which two properties matter most?", "Non-toxic and resistant to corrosion (often tin-plated steel), plus malleable so it can be shaped."],
        ["Why is stainless steel used for cutlery instead of pure iron?", "Chromium and nickel make it resistant to rusting, and it is harder."],
        ["Give two pieces of evidence that would show an unknown element is a metal.", "It conducts electricity as a solid, and its oxide is basic (reacts with acid). Also shiny, malleable."],
        ["Why are alloys usually less malleable than pure metals?", "The different-sized atoms stop the layers sliding, so the metal resists changing shape."],
        ["Why do different-sized atoms make alloys harder?", "They disrupt the regular layers, so layers can't slide easily."],
        ["Why is copper used for water pipes?", "It doesn't react with water, is easy to bend and conducts heat."],
        ["Why is mild steel used for car bodies?", "It is strong, malleable and cheap."],
        ["Why is iron rarely used in its pure form?", "It is too soft and rusts easily."],
        ["Why does brass suit musical instruments and fittings?", "It is harder than copper, resists corrosion and looks attractive."],
        ["Why does a metal oxide dissolve in acid?", "It is a base, so it neutralises the acid to form a salt and water."],
        ["Why is aluminium alloy used in drinks cans?", "It is light, resists corrosion and can be recycled."]
      ],
      "reactivity": [
        ["Magnesium is added to copper(II) sulfate solution. Predict what you see and write the equation.", "Blue colour fades, brown copper forms, the mixture warms. Mg + CuSO₄ → MgSO₄ + Cu."],
        ["Why does nothing happen when copper is added to magnesium sulfate solution?", "Copper is less reactive than magnesium, so it can't displace it."],
        ["Explain displacement in terms of electrons.", "The more reactive metal loses electrons more easily: e.g. Mg → Mg²⁺ + 2e⁻ and Cu²⁺ + 2e⁻ → Cu."],
        ["A student says aluminium is unreactive because it doesn't corrode. Explain why that is wrong.", "Aluminium is quite reactive, but it quickly forms a thin, tough oxide layer that stops air and water reaching the metal underneath."],
        ["Design an experiment to show that both water and oxygen are needed for rusting.", "Three tubes with iron nails: (1) air + water; (2) dry air with calcium chloride; (3) boiled water with oil on top (no oxygen). Only (1) rusts."],
        ["Why does galvanising protect iron even when the zinc is scratched, but paint does not?", "Zinc is more reactive, so it is oxidised instead of the iron (sacrificial protection). Scratched paint lets water and oxygen reach the iron."],
        ["Why is magnesium attached to a ship's hull and replaced regularly?", "Magnesium is more reactive than iron, so it corrodes instead of the hull; it gets used up."],
        ["Write the equation for magnesium reacting with steam.", "Mg + H₂O → MgO + H₂."],
        ["Zinc is added to iron(II) sulfate. Predict and explain.", "Zinc displaces iron, as it is more reactive: Zn + FeSO₄ → ZnSO₄ + Fe."],
        ["Why does painting a bike stop rust?", "It keeps oxygen and water away from the iron."],
        ["Why does a scratched painted car rust but galvanised steel doesn't?", "Paint is only a barrier; zinc still corrodes in preference to iron where scratched."],
        ["How can you place an unknown metal in the reactivity series?", "Test it in solutions of other metals' salts and see which it displaces (or compare reactions with water and acid)."],
        ["Why does salt water speed up rusting?", "Dissolved ions make the water conduct, speeding up the electron transfer."],
        ["Write the ionic equation for iron displacing copper.", "Fe + Cu²⁺ → Fe²⁺ + Cu."],
        ["Calcium fizzes in cold water but magnesium barely does. What does this show?", "Calcium is more reactive than magnesium."]
      ],
      "extraction": [
        ["Why can zinc be extracted with carbon but aluminium cannot?", "Zinc is below carbon in the reactivity series, so carbon can remove its oxygen. Aluminium is above carbon, so carbon can't reduce it."],
        ["Explain why extraction of a metal from its oxide is reduction.", "The metal oxide loses oxygen (and the metal ions gain electrons) — both are reduction."],
        ["Describe the three main reactions in the blast furnace.", "C + O₂ → CO₂ (heats the furnace); CO₂ + C → 2CO (makes the reducing agent); Fe₂O₃ + 3CO → 2Fe + 3CO₂ (reduction of the ore)."],
        ["Why is aluminium extraction expensive?", "It uses huge amounts of electricity to melt and electrolyse the ore, and the carbon anodes must be replaced."],
        ["Write the half-equations at each electrode in aluminium extraction.", "Cathode: Al³⁺ + 3e⁻ → Al. Anode: 2O²⁻ → O₂ + 4e⁻ (the O₂ then reacts with carbon to make CO₂)."],
        ["Why is gold found as the pure element in the ground?", "It is so unreactive that it doesn't combine with oxygen or other elements."],
        ["Why is recycling aluminium better than extracting it?", "It uses far less energy, saves bauxite ore and reduces mining and landfill."],
        ["Why is coke burned in the blast furnace?", "It reacts with oxygen to give heat and CO₂, which reacts with more coke to make CO."],
        ["Write the equation for limestone decomposing in the blast furnace.", "CaCO₃ → CaO + CO₂."],
        ["Write the equation for slag forming.", "CaO + SiO₂ → CaSiO₃."],
        ["Why is cryolite used instead of just heating aluminium oxide?", "It lowers the melting point, saving energy and cost."],
        ["Why does molten slag float on molten iron?", "Slag is less dense, so it can be removed separately."],
        ["Write the equation for zinc oxide being reduced by carbon.", "ZnO + C → Zn + CO."],
        ["Why does the blast furnace need hot air?", "Oxygen burns the coke to provide heat and carbon dioxide."],
        ["Why is iron from the blast furnace often made into steel?", "Pig iron is brittle due to impurities; removing carbon and adding alloys gives better properties."]
      ]
    },

    "ch-environment": {
      "water": [
        ["Explain step by step how fertiliser runoff can kill fish.", "Nitrates enter water → algae grow fast (algal bloom) → light is blocked and plants die → bacteria decompose them, using up dissolved oxygen → fish suffocate."],
        ["Why is chlorine added to drinking water but not used to remove solids?", "Chlorine kills microbes. It can't remove solids — sedimentation and filtration do that earlier."],
        ["A sample of liquid boils at 102 °C. Is it pure water? Explain.", "No: pure water boils at exactly 100 °C; dissolved impurities raise the boiling point."],
        ["Why is carbon used in water treatment?", "It adsorbs substances that cause bad tastes and smells."],
        ["Why do farmers use NPK fertilisers?", "Crops need nitrogen (for proteins and growth), phosphorus (roots) and potassium (fruit and healthy leaves); harvesting removes these from the soil."],
        ["How could you show that a clear liquid contains water, and whether it is pure?", "Add anhydrous copper(II) sulfate: white → blue shows water. Then check it boils at exactly 100 °C (and freezes at 0 °C) for purity."],
        ["Why are phosphates harmful in rivers?", "They cause algal growth and eutrophication."],
        ["Why does eutrophication reduce oxygen in water?", "Dead algae are decomposed by bacteria, which use up dissolved oxygen."],
        ["Why might untreated water carry disease?", "It can contain harmful microbes from sewage."],
        ["Why do fertilisers contain both ammonium nitrate and potassium salts?", "To supply both nitrogen and potassium needed by plants."],
        ["Why are metal compounds in water harmful?", "Some, like lead and mercury, are toxic and build up in organisms."],
        ["Why is filtration done before chlorination?", "Particles can shield microbes from chlorine and waste the chlorine."],
        ["Why is seawater not drinkable without treatment?", "It contains too much dissolved salt."]
      ],
      "air": [
        ["Explain how burning coal causes acid rain.", "Coal contains sulfur, which burns to sulfur dioxide; SO₂ dissolves in rainwater to form acids that damage buildings, trees and lakes."],
        ["Where do oxides of nitrogen in the air come from?", "In hot car engines, nitrogen and oxygen from the air react together."],
        ["Why is carbon monoxide dangerous although it is colourless and odourless?", "It binds to haemoglobin, so the blood carries less oxygen — and you can't detect it without an alarm."],
        ["Explain the greenhouse effect correctly.", "Sunlight passes through the atmosphere and warms the Earth; the Earth emits infrared, which greenhouse gases absorb and re-emit, so less heat escapes to space."],
        ["Write the equation for a catalytic converter removing CO and NO, and say why it helps.", "2CO + 2NO → 2CO₂ + N₂. Toxic CO and acid-rain-forming NO become less harmful gases."],
        ["How does flue gas desulfurisation work?", "Calcium oxide (a base) reacts with acidic sulfur dioxide in the waste gases, removing it before it reaches the air."],
        ["Why does reducing livestock farming help limit climate change?", "Cattle produce methane, a powerful greenhouse gas."],
        ["Why do car engines produce oxides of nitrogen?", "The high temperature makes nitrogen and oxygen from the air react."],
        ["Why does a catalytic converter use a honeycomb structure?", "It gives a large surface area for the catalyst."],
        ["Why does planting trees help reduce climate change?", "Trees absorb carbon dioxide for photosynthesis."],
        ["Why is calcium oxide or carbonate used in flue gas desulfurisation?", "They are bases that react with acidic sulfur dioxide."],
        ["Give three effects of climate change.", "Rising sea levels, more extreme weather, melting ice caps, changes to habitats."],
        ["Why does burning hydrogen not contribute to climate change?", "Its only product is water — no carbon dioxide."],
        ["Write the equation for nitrogen monoxide forming in an engine.", "N₂ + O₂ → 2NO."],
        ["Why does carbon monoxide reduce oxygen transport?", "It binds to haemoglobin more strongly than oxygen."]
      ]
    },

    "ch-organic": {
      "formulae": [
        ["Draw in words the displayed formula of ethanol, C₂H₅OH.", "H₃C–CH₂–O–H with every bond shown: each carbon has 4 bonds, the O has 2 (to C and H)."],
        ["Butane and methylpropane are both C₄H₁₀. Why are they different compounds?", "They are structural isomers: the atoms are arranged differently (one straight chain, one branched), so they have different properties."],
        ["The alkanes CH₄, C₂H₆, C₃H₈… What is the next member, and how do you know?", "C₄H₁₀ — add CH₂ each time (general formula CₙH₂ₙ₊₂)."],
        ["Why do members of a homologous series have similar chemical properties?", "They have the same functional group, which decides how they react."],
        ["Why does boiling point rise along a homologous series?", "Molecules get larger, so intermolecular forces get stronger and need more energy to overcome."],
        ["Is C₃H₆ saturated or unsaturated? Explain.", "Unsaturated: it fits CₙH₂ₙ (an alkene, propene), so it has a C=C double bond."],
        ["Write the molecular formula of the alkane with 6 carbons.", "C₆H₁₄."],
        ["Is C₄H₁₀ saturated? Explain.", "Yes — it's an alkane, with only single C–C bonds."],
        ["Draw in words the displayed formula of ethene.", "Two carbons joined by a double bond, each with two hydrogens."],
        ["Why are but-1-ene and but-2-ene isomers?", "Same molecular formula (C₄H₈), but the double bond is in a different position."],
        ["What is the trend in physical properties along a homologous series?", "Boiling point, viscosity and density increase with chain length."],
        ["Why is C₂H₅OH not a hydrocarbon?", "It contains oxygen as well as carbon and hydrogen."],
        ["Why do propane and butane have similar reactions?", "They are in the same homologous series with the same functional group pattern."]
      ],
      "families": [
        ["Explain how fractional distillation separates crude oil.", "Crude oil is vaporised; the column is hot at the bottom and cooler at the top. Each fraction condenses at the height where the temperature falls below its boiling point."],
        ["Why does incomplete combustion happen, and why is it dangerous?", "Not enough oxygen: carbon monoxide (toxic) and soot form, and less energy is released."],
        ["Complete the cracking equation: C₁₀H₂₂ → C₈H₁₈ + ?", "C₂H₄ (ethene) — atoms must balance: 10 − 8 = 2 C, 22 − 18 = 4 H."],
        ["Why do bromine water tests distinguish alkanes from alkenes?", "Alkenes have a C=C bond that bromine adds across (addition reaction), removing the orange colour; alkanes have no double bond, so nothing happens."],
        ["Why does fermentation need no oxygen and a temperature of 25–35 °C?", "Without oxygen yeast respires anaerobically to make ethanol (with oxygen it makes CO₂ and water). Too cold is slow; too hot denatures the yeast's enzymes."],
        ["Write the equation for ethene reacting with steam and give the conditions.", "C₂H₄ + H₂O → C₂H₅OH; about 300 °C, 60 atm, phosphoric acid catalyst."],
        ["Ethanoic acid reacts with sodium carbonate. Predict what you see and name the salt.", "Fizzing (CO₂ given off); sodium ethanoate forms."],
        ["Why do fractions at the top have lower boiling points?", "They have smaller molecules with weaker intermolecular forces."],
        ["Why is cracking done if there is enough crude oil?", "Demand for short-chain fractions like petrol is higher than supply; cracking also makes alkenes."],
        ["Write the equation for complete combustion of methane.", "CH₄ + 2O₂ → CO₂ + 2H₂O."],
        ["Write the equation for methane reacting with chlorine in UV light.", "CH₄ + Cl₂ → CH₃Cl + HCl."],
        ["Give an advantage of fermentation over hydration of ethene.", "Uses renewable sugar and needs low temperature (but it is slower and gives less pure ethanol)."],
        ["Why does ethanoic acid react more slowly than hydrochloric acid with magnesium?", "It is a weak acid with fewer H⁺ ions."],
        ["Write the equation for ethene reacting with bromine.", "C₂H₄ + Br₂ → C₂H₄Br₂."],
        ["Why is ethene useful?", "Its double bond makes it reactive, so it is used to make polymers and ethanol."]
      ],
      "polymers": [
        ["Draw in words the repeat unit of poly(propene) from propene, CH₂=CHCH₃.", "–[CH₂–CH(CH₃)]– : the C=C opens to a single bond, the CH₃ hangs off one carbon, and bonds extend through the brackets."],
        ["How is addition polymerisation different from condensation polymerisation?", "Addition: alkene monomers join with nothing else produced. Condensation: monomers with two functional groups join and a small molecule (water) is lost at each link."],
        ["Why are most plastics a problem in the environment?", "They are non-biodegradable, so they stay in landfill and oceans for centuries; burning them releases toxic gases."],
        ["Name the link in nylon and in proteins. Why are they similar?", "Both have amide links; both are polyamides made by condensation."],
        ["Why does an addition polymer have no C=C double bond?", "The double bond opens to link to the next monomer; only single bonds remain in the chain."],
        ["Why is recycling PET better than recycling many other plastics?", "PET can be broken back down into its monomers and repolymerised, giving new plastic of the same quality."],
        ["Draw in words the repeat unit of poly(ethene).", "–CH₂–CH₂– in brackets with n."],
        ["Why does burning plastics cause pollution?", "It releases CO₂ and toxic gases."],
        ["Which type of polymerisation makes nylon, and what is lost?", "Condensation polymerisation; water is lost."],
        ["What monomer makes poly(chloroethene) (PVC)?", "Chloroethene, CH₂=CHCl."],
        ["Why do plastics last a long time in landfill?", "They are non-biodegradable."],
        ["Why do addition polymers form from alkenes but not alkanes?", "Alkenes have a C=C double bond that can open up to link."],
        ["Why can PET be broken down into monomers?", "It is a condensation polymer, so hydrolysis can break the ester links."]
      ]
    },

    "naming-organic": {
      "chain": [
        ["Name CH₃CH₂CH₂OH and explain the number.", "Propan-1-ol: 3 carbons (prop), –OH group (-ol) on carbon 1, numbered from the end nearest the group."],
        ["Why is ‘pentan-4-ol’ wrong?", "The chain must be numbered from the end that gives the –OH the lowest number: it is pentan-2-ol."],
        ["Name CH₂=CHCH₂CH₃.", "But-1-ene: 4 carbons, C=C starting at carbon 1."],
        ["A chain is drawn bent around a corner with 6 carbons in a line. How many carbons in the root?", "Count the longest continuous chain regardless of bends — 6, so hex-."],
        ["Why is ethanol not called ‘ethan-1-ol’?", "With 2 carbons the –OH can only be at the end, so the number is not needed."],
        ["Name CH₃CH₂CH₂COOH.", "Butanoic acid: 4 carbons including the COOH carbon, which is always carbon 1."],
        ["Name CH₃CH₂CH₂CH₂OH.", "Butan-1-ol."],
        ["Name CH₂=CHCH₂CH₂CH₃.", "Pent-1-ene."],
        ["Why is ‘but-3-ene’ wrong?", "Numbering from the other end gives but-1-ene; use the lowest number."],
        ["Name HCOOH.", "Methanoic acid."],
        ["Name CH₃CH(OH)CH₃.", "Propan-2-ol."],
        ["Why is the carbon in COOH counted in the root?", "It is part of the main chain, as carbon 1."],
        ["Name CH₃CH₂COOH.", "Propanoic acid."]
      ],
      "side": [
        ["Name CH₃CH(CH₃)CH₂CH₃.", "2-methylbutane: longest chain 4 C, a methyl on carbon 2."],
        ["Name CH₃CHClCH₂CH(CH₃)CH₃.", "2-chloro-4-methylpentane: chain 5, chloro on 2, methyl on 4; chloro before methyl alphabetically."],
        ["Name C(CH₃)₄.", "2,2-dimethylpropane: chain 3 carbons, two methyls both on carbon 2."],
        ["Why is ‘3-methylbutane’ wrong?", "Number from the other end: the methyl is on carbon 2 — 2-methylbutane."],
        ["In 1-bromo-2-chloropropane, why does bromo come first?", "Side chains are listed alphabetically: b before c."],
        ["Draw in words 3-ethylpentane.", "A five-carbon chain with a –CH₂CH₃ on the middle carbon (carbon 3)."],
        ["Name CH₂ClCH₂Cl.", "1,2-dichloroethane."],
        ["Name CH₃C(CH₃)₂CH₃.", "2,2-dimethylpropane."],
        ["Name CH₃CH(CH₃)CH(CH₃)CH₂CH₃.", "2,3-dimethylpentane."],
        ["Why is ‘2-methylbutane’ numbered from the left?", "That gives the side chain the lowest possible number."],
        ["Name CH₃CH(C₂H₅)CH₂CH₃ carefully.", "3-methylpentane — the longest chain has 5 carbons."],
        ["Why do side chains go in alphabetical order?", "It's the agreed rule, so every compound has one correct name."],
        ["Name CH₃CH(CH₃)CH₂CH₂CH₃.", "2-methylpentane."]
      ],
      "practice": [
        ["‘2-ethylbutane’ — what is the correct name and why?", "3-methylpentane: the ethyl group makes a longer chain of 5 carbons, with a methyl on carbon 3."],
        ["‘2,3,dimethylpentane’ — fix the punctuation.", "2,3-dimethylpentane: comma between numbers, hyphen between number and word."],
        ["‘1-methylpropane’ — what is really there?", "Butane: a methyl on the end carbon simply extends the chain."],
        ["‘3-chloro-2-methylbutane’ or ‘2-chloro-3-methylbutane’?", "2-chloro-3-methylbutane. Both ends give {2,3}; when tied, the first group alphabetically (chloro) gets the lower number."],
        ["Why must you check the root before anything else?", "Every other step depends on the longest chain; a wrong chain gives wrong numbers and side chains."],
        ["Name CH₃CH(OH)CH(CH₃)CH₃.", "3-methylbutan-2-ol: number from the end nearest the –OH (carbon 2), methyl on carbon 3."],
        ["‘2,2-methylbutane’: what is wrong?", "Two methyls need ‘di’: 2,2-dimethylbutane."],
        ["‘3-ethyl-2-methylbutane’: what is the correct name?", "The longest chain has 5 carbons: 2,3-dimethylpentane."],
        ["‘1-chloro-2-methylbutane’ or ‘2-methyl-1-chlorobutane’?", "1-chloro-2-methylbutane — alphabetical order."],
        ["Name CH₃CHClCHClCH₃.", "2,3-dichlorobutane."],
        ["Why might you need to look around corners for the longest chain?", "The longest chain isn't always drawn in a straight line."],
        ["Name CH₃CH₂CH(OH)CH₃.", "Butan-2-ol."],
        ["‘2-methylpent-4-ene’: what's wrong?", "The double bond needs the lower number: 4-methylpent-1-ene."]
      ],
      "esters": [
        ["Name the ester made from propanol and ethanoic acid.", "Propyl ethanoate: alcohol part first (-yl), acid part second (-oate)."],
        ["Ethyl methanoate and methyl ethanoate — are they the same? Explain.", "No. Ethyl methanoate comes from ethanol + methanoic acid; methyl ethanoate from methanol + ethanoic acid. They are isomers (both C₃H₆O₂)."],
        ["Write the word equation for making methyl propanoate.", "methanol + propanoic acid → methyl propanoate + water (acid catalyst)."],
        ["Give two structural isomers of C₃H₈O.", "Propan-1-ol and propan-2-ol (the –OH on a different carbon)."],
        ["Why do structural isomers have different boiling points?", "Different shapes change how closely molecules pack, so the intermolecular forces differ — branched isomers usually boil lower."],
        ["Which alcohol and acid make ethyl butanoate (pineapple smell)?", "Ethanol and butanoic acid."],
        ["Name the ester from methanol and ethanoic acid.", "Methyl ethanoate."],
        ["Name the ester from ethanol and methanoic acid.", "Ethyl methanoate."],
        ["Which acid and alcohol make propyl propanoate?", "Propanoic acid and propan-1-ol."],
        ["Give a structural isomer of butane.", "Methylpropane, CH₃CH(CH₃)CH₃."],
        ["Give two isomers of C₄H₈ that are alkenes.", "But-1-ene and but-2-ene (also methylpropene)."],
        ["Why are esters often recognised by smell?", "Many are volatile with fruity smells."],
        ["Why are esters used in perfumes?", "They are volatile and pleasant-smelling."]
      ]
    },

    "ch-experimental": {
      "techniques": [
        ["Why is a volumetric pipette used to measure the alkali in a titration, not a measuring cylinder?", "It delivers one fixed volume much more accurately, so the calculated concentration is more reliable."],
        ["Why do you do a rough titration first?", "To find the approximate end point, so in the accurate runs you can add the solution drop by drop near it."],
        ["Titres: 24.20, 23.70, 23.80, 23.75 cm³. Which do you use for the mean, and what is it?", "Ignore the rough 24.20. The concordant ones (within 0.10): 23.70, 23.80, 23.75 → mean 23.75 cm³."],
        ["Why is the conical flask swirled during a titration?", "To mix the solutions so the indicator changes colour only at the true end point."],
        ["Why is the burette rinsed with the acid it will contain, not water?", "Water would dilute the acid, lowering its concentration."],
        ["Why would heating a solution to dryness give an impure salt?", "Soluble impurities would be left with the salt; letting crystals form and filtering leaves impurities in the solution."],
        ["Why is a white tile placed under the flask in a titration?", "To see the colour change at the end-point clearly."],
        ["Why is the indicator only a few drops?", "Indicators are weak acids or bases and could affect the result."],
        ["Why are only concordant titres averaged?", "They agree closely, giving a reliable mean."],
        ["Why is a gas syringe more accurate than collecting over water?", "Some gases dissolve in water; a syringe measures directly."],
        ["Why add acid drop by drop near the end-point?", "So you don't overshoot the end-point."],
        ["How could you get more reliable results in a rate experiment?", "Repeat and calculate a mean, ignoring anomalies."],
        ["Why is a pipette filler used?", "For safety — to avoid mouth contact with chemicals."]
      ],
      "separation": [
        ["How would you get pure water from sea water? Explain why it works.", "Simple distillation: water boils off, then condenses in the condenser; the salt (high boiling point) is left behind."],
        ["How would you get salt crystals from rock salt?", "Dissolve in water, filter to remove the sand (residue), then evaporate/crystallise the filtrate."],
        ["A spot moves 3.0 cm and the solvent 7.5 cm. Calculate Rf.", "3.0 ÷ 7.5 = 0.40 — no units."],
        ["A food dye gives 3 spots. Two match known dyes A and C. What can you conclude?", "The dye is a mixture of at least 3 substances, including A and C; the third is unknown."],
        ["Why would ethanol and water be separated by fractional distillation, not simple distillation?", "Their boiling points (78 °C and 100 °C) are close, so a fractionating column is needed to separate them well."],
        ["Why does purity matter for medicines, and how can you check it?", "Impurities could be harmful. Check for a sharp melting point at the expected temperature, or one spot on a chromatogram."],
        ["Why should the solvent level be below the base line?", "Otherwise spots dissolve into the solvent instead of moving up."],
        ["Two substances have the same Rf in one solvent. Are they the same?", "Possibly — test in another solvent to be sure."],
        ["How would you separate sand and salt?", "Add water, stir, filter off sand, evaporate filtrate to crystallise salt."],
        ["Why does Rf always lie between 0 and 1?", "A spot can't move further than the solvent."],
        ["How would you separate an insoluble solid from a mixture of two dissolved salts?", "Filter off the solid; then crystallisation or chromatography to separate the salts."],
        ["Why use distillation to get water from ink?", "Water boils off and condenses; the dyes stay behind."],
        ["A substance melts sharply at 122 °C, as expected. What does that tell you?", "It is probably pure."],
        ["Why is a lid placed on the chromatography beaker?", "To stop the solvent evaporating, so it rises evenly."]
      ],
      "identification": [
        ["A solution gives a green precipitate with NaOH and a white precipitate with acidified barium nitrate. Identify it.", "Iron(II) sulfate: green precipitate → Fe²⁺; white precipitate with Ba²⁺ → SO₄²⁻."],
        ["A white solid gives a lilac flame and a cream precipitate with acidified silver nitrate. Identify it.", "Potassium bromide."],
        ["How would you tell zinc ions from aluminium ions using aqueous ammonia?", "Both give white precipitates with NaOH that dissolve in excess. With excess ammonia, zinc's dissolves but aluminium's does not."],
        ["Why use nitric acid, not hydrochloric acid, to acidify before the silver nitrate test?", "HCl adds chloride ions, which would give a white precipitate whatever the sample contained."],
        ["How would you test for nitrate ions?", "Warm with sodium hydroxide and aluminium foil: ammonia is given off, turning damp red litmus blue."],
        ["A gas turns damp red litmus blue. What is it and how might it have formed?", "Ammonia — e.g. from warming an ammonium salt with an alkali."],
        ["Why might a flame test give an unclear result?", "A mixture of metal ions masks colours (sodium's yellow is strong), or the wire was not cleaned."],
        ["A solution gives a light blue precipitate with NaOH and a white precipitate with acidified silver nitrate. Identify it.", "Copper(II) chloride."],
        ["A solid fizzes with acid, giving a gas that turns limewater milky, and gives a red flame. Identify it.", "Lithium carbonate."],
        ["How do you test a gas for oxygen?", "A glowing splint relights."],
        ["How do you test a gas for hydrogen?", "A lighted splint gives a squeaky pop."],
        ["Why does adding NaOH and warming identify ammonium ions?", "Ammonia gas forms, turning damp red litmus blue."],
        ["How can you tell Al³⁺ from Ca²⁺ using NaOH?", "Both give white precipitates, but only Al³⁺ dissolves in excess."],
        ["How is the nitrate test carried out?", "Add NaOH and aluminium foil, then warm; ammonia is given off."],
        ["Why is a clean nichrome or platinum wire used in flame tests?", "Contamination from other ions could change the colour."]
      ]
    }
  });
})();
