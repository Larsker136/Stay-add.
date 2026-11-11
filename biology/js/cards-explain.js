/* ==========================================================================
   stay add. Biology — "Explain it" flashcards: the harder deck of every topic
   Why, predict, calculate, spot the mistake — each answer shows the reasoning.
   StayAdd.explainCards["<body data-lesson>"]["<topic data-key>"] = [[question, answer], …]
   Drawn by assets/js/flashcards.js next to the Key facts deck in js/cards.js.
   ========================================================================== */
(function () {
  "use strict";
  const SA = (window.StayAdd = window.StayAdd || {});
  SA.explainCards = SA.explainCards || {};

  Object.assign(SA.explainCards, {
    "classification": {
      "life": [
        ["A car moves, uses oxygen, and gives out carbon dioxide. Why isn't it alive?", "It doesn't show all seven characteristics — it can't grow, reproduce or show sensitivity by itself."],
        ["Why is growth defined as an increase in dry mass?", "Water content changes from hour to hour; dry mass measures the permanent increase in actual material."],
        ["How does a plant show movement and sensitivity?", "Shoots bend towards light and roots grow down (tropisms); some plants close leaves or flowers in response to touch or darkness."],
        ["Why is removing CO₂ from the lungs excretion, but passing faeces is not?", "CO₂ is a waste product of metabolism (respiration in cells); faeces are undigested food that never entered the cells."],
        ["Why do all living things need nutrition and respiration?", "Nutrition supplies materials and energy-containing molecules; respiration releases the energy from them to power life processes."],
        ["A crystal grows in a salt solution. Is it alive?", "No — it grows, but doesn't respire, reproduce, excrete, feed or show sensitivity."],
        ["Which characteristic is shown when a cat's pupils narrow in bright light?", "Sensitivity."],
        ["A dry seed is dormant. Is it alive? Explain.", "Yes — it respires very slowly and will grow when conditions are right."],
        ["Why is a virus usually not counted as living?", "It shows no life processes outside a host cell."],
        ["Why is it hard to see movement in plants?", "Plants move slowly, mostly by growth, and stay rooted in one place."],
        ["Why does a plant still need respiration although it photosynthesises?", "Photosynthesis makes glucose; respiration is what releases the energy from it."],
        ["A robot can move, sense and use energy. Why isn't it alive?", "It can't grow, reproduce, respire or excrete as organisms do."]
      ],
      "classify": [
        ["A horse and a donkey produce a mule. Why are they still different species?", "The mule is infertile, so they can't produce fertile offspring — the test for one species."],
        ["Panthera leo and Panthera tigris — what does the name tell you about lions and tigers?", "They share a genus (Panthera), so they are closely related, but they are different species."],
        ["Why is ‘Is it big?’ a poor question in a dichotomous key?", "Size is relative and varies with age; key questions need clear features that are either present or absent."],
        ["How many questions does a key need to identify 6 organisms?", "5 — one fewer than the number of organisms, as each question splits one group into two."],
        ["Why are scientific names used instead of common names?", "Common names differ between places and languages; a binomial name is understood by scientists worldwide."],
        ["Species A and B differ by 2 bases in a gene; A and C by 15. Which pair is more closely related, and why?", "A and B — more similar DNA sequences mean a more recent common ancestor."],
        ["Write the binomial name for humans correctly and explain each part.", "Homo sapiens: Homo = genus (capital), sapiens = species (lower case), in italics."],
        ["Felis catus and Canis lupus: are cats and wolves in the same genus?", "No — Felis and Canis are different genera."],
        ["Why is ‘Does it have wings?’ a good question in a key?", "Wings are either present or absent, so the answer is clear."],
        ["Why is DNA evidence more reliable than appearance for classification?", "Unrelated organisms can look similar; DNA shows true relatedness."],
        ["Two species share genus, family and order. What does this say?", "They are closely related, sharing a recent common ancestor."],
        ["Why does each pair of statements in a key need to be opposites?", "So every organism fits only one choice and is identified without doubt."],
        ["Why might two species that look very different be closely related?", "They may share a recent common ancestor, shown by similar DNA."]
      ],
      "kingdoms": [
        ["An organism has cells with a nucleus, a cell wall of chitin, and no chloroplasts. Which kingdom?", "Fungi."],
        ["An organism is single-celled with a nucleus, and some have chloroplasts. Which kingdom?", "Protoctists."],
        ["Why can viruses only reproduce inside host cells?", "They have no ribosomes, enzymes or metabolism of their own; they use the host cell's machinery to make copies."],
        ["Why is ‘has a cell wall’ not enough to say an organism is a plant?", "Fungi and bacteria also have cell walls. Plants have a cellulose wall plus chloroplasts."],
        ["How do fungi feed, and why does this make them important in ecosystems?", "Saprotrophically: they secrete enzymes onto dead matter and absorb the products, so they decompose material and recycle nutrients."],
        ["Why are bacteria called prokaryotes?", "Their cells have no nucleus — the DNA is free in the cytoplasm."],
        ["Is yeast a plant? Explain.", "No — it has no chloroplasts and a chitin cell wall, so it is a fungus."],
        ["Why are protoctists a varied group?", "It includes single-celled eukaryotes that are neither plants, animals nor fungi, some plant-like, some animal-like."],
        ["What feature of a virus lets it enter a specific host cell?", "Its protein coat fits receptors on that host cell."],
        ["An organism has a cell wall, a circular chromosome and no nucleus. Which kingdom?", "Prokaryotes."],
        ["Why do fungi not need light?", "They don't photosynthesise; they feed on dead or living organic material."],
        ["Why are mushrooms not classified as plants?", "They have no chlorophyll, have chitin walls and feed saprotrophically."]
      ],
      "animals": [
        ["An animal has 8 legs and two body parts. Which group?", "Arachnid (e.g. a spider)."],
        ["An animal lays eggs with shells on land and has dry scales. Which class?", "Reptile."],
        ["How do amphibians differ from reptiles?", "Amphibians have moist, permeable skin and lay soft eggs in water; reptiles have dry scaly skin and lay shelled eggs on land."],
        ["Why is a whale a mammal, not a fish?", "It has hair (a little), breathes air with lungs, gives birth to live young and feeds them milk."],
        ["Why is a woodlouse a crustacean and not an insect?", "It has more than 6 legs (14) and two pairs of antennae."],
        ["An animal has 6 legs, 3 body parts and wings. Which group?", "Insect."],
        ["An animal has feathers and a beak. Which class?", "Bird."],
        ["An animal has many segments, each with two pairs of legs. Which group?", "Myriapod (a millipede)."],
        ["Why must arthropods moult to grow?", "The hard exoskeleton can't stretch, so it is shed and replaced."],
        ["Why is a spider not an insect?", "It has 8 legs and 2 body parts, not 6 legs and 3 parts; no antennae."],
        ["A crab has 10 legs and a hard shell. Which group?", "Crustacean."],
        ["A bat flies and has fur. Is it a bird or a mammal?", "A mammal — it has fur and feeds its young on milk."]
      ],
      "plants": [
        ["A plant has parallel leaf veins and flower parts in threes. Classify it.", "A flowering plant, monocotyledon (e.g. grass, lily)."],
        ["Why can ferns grow without flowers?", "They reproduce by spores released from the underside of fronds, so they don't need pollination."],
        ["Compare a fern and a flowering plant.", "Fern: fronds, spores, no flowers or seeds. Flowering plant: flowers, seeds inside fruits."],
        ["A seed splits into two halves when soaked. What does that suggest?", "It has two cotyledons — a dicotyledon (e.g. a bean)."],
        ["A plant has net-veined leaves and flower parts in fives. Classify it.", "Dicotyledon."],
        ["A plant has fronds and brown spots underneath. What is it, and what are the spots?", "A fern; the spots contain spores."],
        ["Why does a maize grain have only one cotyledon?", "Maize is a monocotyledon."],
        ["Why are ferns usually found in damp, shady places?", "Their reproduction needs moisture, and they have no flowers or seeds to survive dry conditions."],
        ["How could you tell a monocot from a dicot without the seed?", "Look at the leaf veins (parallel vs branching) and number of flower parts."],
        ["Why do seeds help flowering plants spread more widely than ferns?", "Seeds carry a food store and protective coat, so they survive dry conditions and can be dispersed."]
      ]
    },

    "enzymes": {
      "fit": [
        ["Explain why amylase breaks down starch but not protein.", "Amylase's active site has a shape complementary to starch; protein molecules have a different shape, so they don't fit and no enzyme–substrate complex forms."],
        ["Why would life be impossible without enzymes?", "Reactions such as digestion and respiration would be far too slow at body temperature to supply energy and materials."],
        ["Why does the rate of an enzyme reaction stop increasing when more substrate is added?", "All active sites become occupied (enzyme concentration becomes limiting), so adding substrate can't form complexes faster."],
        ["Describe the lock-and-key model in three steps.", "Substrate fits into the complementary active site → enzyme–substrate complex → reaction happens and products leave, leaving the enzyme unchanged."],
        ["Why do cells need many different enzymes?", "Each enzyme is specific to one substrate, and cells carry out thousands of different reactions."],
        ["Why can one enzyme molecule catalyse many reactions?", "It is unchanged after each reaction, so it releases the products and binds a new substrate."],
        ["Why does a lower amount of enzyme slow a reaction?", "Fewer active sites are available, so fewer complexes form each second."],
        ["Why does lipase not break down starch?", "Starch doesn't fit lipase's active site."],
        ["How do enzymes speed up reactions?", "They lower the activation energy needed."],
        ["Why do enzymes work faster when substrate concentration increases (at first)?", "More collisions between substrate and active sites each second."],
        ["What test shows starch has been broken down by amylase?", "Iodine stays orange-brown instead of turning blue-black."],
        ["Why is ‘lock and key’ a good name for the model?", "Only one key (substrate) fits each lock (active site)."]
      ],
      "temp": [
        ["Explain why an enzyme reaction is slow at 10 °C.", "Molecules have little kinetic energy, so they collide less often and fewer enzyme–substrate complexes form per second."],
        ["Explain why the rate falls steeply above 40 °C for a human enzyme.", "Vibrations break bonds holding the enzyme's shape; the active site changes shape so the substrate no longer fits — the enzyme denatures."],
        ["An enzyme was heated to 80 °C, then cooled to 37 °C. Predict its activity and explain.", "No activity: denaturing is permanent, so the active site stays the wrong shape."],
        ["Why do enzymes in bacteria from hot springs work at 80 °C?", "Their enzymes have shapes held by stronger bonds, so they don't denature until much higher temperatures — their optimum is higher."],
        ["Why do biological washing powders work best at about 40 °C?", "This is near the optimum for their enzymes; at hotter temperatures they would denature."],
        ["Why do frozen foods last longer?", "Low temperatures slow microbial enzymes almost to a stop."],
        ["Two tubes of amylase at 20 °C and 37 °C: which digests starch faster and why?", "37 °C — more collisions with enough energy; it's near the optimum."],
        ["Why does a high fever become dangerous?", "Body enzymes may begin to denature, upsetting metabolism."],
        ["Why does the rate fall steeply above the optimum, rather than gradually?", "More and more enzyme molecules denature quickly as the temperature rises."],
        ["An enzyme from a polar fish works best at 5 °C. Why might it denature at 30 °C?", "Its shape is stable only at cold temperatures; 30 °C breaks its bonds."],
        ["How would you show that boiled amylase no longer works?", "Mix boiled amylase with starch; iodine still turns blue-black."],
        ["Why do some enzymes in washing powders work at 60 °C?", "They come from bacteria adapted to high temperatures."]
      ],
      "ph": [
        ["Why does pepsin stop working when it reaches the small intestine?", "The small intestine is alkaline (about pH 8); far from pepsin's optimum pH 2, its active site changes shape and it denatures."],
        ["Two enzymes have optimum pH 2 and pH 8. Where in the gut does each work?", "pH 2: stomach (pepsin). pH 8: small intestine (pancreatic enzymes)."],
        ["Why does saliva stop digesting starch once food reaches the stomach?", "Stomach acid lowers the pH far below amylase's optimum (about 7), denaturing it."],
        ["Describe how to investigate the effect of pH on amylase.", "Mix starch and amylase in buffers of different pH at constant temperature; sample into iodine every 30 s; time until it no longer turns blue-black."],
        ["Why must temperature be kept constant in a pH experiment?", "Temperature also affects the rate; only one variable should change so you know pH caused the difference."],
        ["Why must a buffer be used in an enzyme pH experiment?", "To keep the pH constant throughout the experiment."],
        ["Why does adding vinegar to amylase and starch slow digestion?", "It lowers the pH below amylase's optimum, changing its active site."],
        ["Why is bile important for lipase in the small intestine?", "It neutralises the acid, giving the alkaline pH lipase needs, and emulsifies fat."],
        ["How do you know when amylase has digested all the starch?", "A sample no longer turns iodine blue-black."],
        ["Why is iodine tested at regular intervals in the amylase experiment?", "To find the time when starch disappears, which gives the rate."],
        ["Why does pepsin work in the stomach but not in the mouth?", "It needs acidic conditions (pH 2); the mouth is near neutral."],
        ["Why does an enzyme at the wrong pH stop working?", "The charges on its active site change, so the substrate no longer fits."]
      ]
    },

    "organisation": {
      "cells": [
        ["Why do muscle cells have many mitochondria?", "Contraction needs a lot of energy, released by aerobic respiration in mitochondria."],
        ["Why does a plant cell not burst in pure water but a red blood cell does?", "The plant cell's strong cellulose wall resists the pressure as water enters; animal cells have no wall."],
        ["Why are ribosomes found in every type of cell, including bacteria?", "All cells must make proteins, such as enzymes."],
        ["What does a large permanent vacuole do for a plant?", "It stores cell sap and, when full of water, pushes the cytoplasm against the wall, keeping the cell firm (turgid)."],
        ["How would you tell a bacterial cell from a plant cell under a microscope?", "Bacteria are much smaller and have no nucleus (DNA loose, plus plasmids) and no chloroplasts or vacuole."],
        ["Why do plant cells have a regular shape but animal cells don't?", "The rigid cell wall gives plant cells a fixed shape."],
        ["Why do leaf palisade cells contain many chloroplasts?", "To absorb as much light as possible for photosynthesis."],
        ["Why does a bacterial cell have no mitochondria but still respire?", "Respiration enzymes are in its cytoplasm and membrane."],
        ["Why do sperm cells have many mitochondria?", "To release energy for the tail to swim."],
        ["Why do cells that make enzymes have many ribosomes?", "Enzymes are proteins, which are made on ribosomes."],
        ["Why does the cell membrane control what enters the cell?", "It is partially permeable, letting some substances through and not others."],
        ["Why can't animal cells photosynthesise?", "They have no chloroplasts."]
      ],
      "special": [
        ["Explain how a nerve cell is adapted to its job.", "It is very long to carry impulses over long distances, and has branched endings to connect with many other cells."],
        ["Why do xylem vessels have no cytoplasm or end walls?", "They form a continuous hollow tube so water can flow up easily."],
        ["Why is the stomach called an organ, not a tissue?", "It is made of several tissues (muscle, glandular, epithelial) working together."],
        ["What is differentiation, and why is it needed?", "Cells become specialised for particular functions, so a multicellular organism can carry out many jobs efficiently."],
        ["Why does an egg cell have a large cytoplasm?", "It stores nutrients to supply the embryo until it implants."],
        ["Why does a red blood cell have no nucleus?", "More space for haemoglobin to carry oxygen."],
        ["Why is a red blood cell biconcave?", "It gives a large surface area for oxygen to diffuse in and out."],
        ["Why do ciliated cells line the trachea?", "Cilia sweep mucus with trapped dust and pathogens away from the lungs."],
        ["Why does a root hair cell have a long extension?", "Large surface area to absorb water and mineral ions."],
        ["Why is the heart an organ?", "It is made of several tissues working together to pump blood."],
        ["Why does a sperm cell have enzymes in its head?", "To digest a way through the egg's jelly coat."],
        ["Why do multicellular organisms need specialised cells?", "Different jobs need different cell structures to be done efficiently."]
      ],
      "size": [
        ["A mitochondrion is 2 µm long and drawn 10 mm long. Find the magnification.", "10 mm = 10 000 µm; 10 000 ÷ 2 = ×5000."],
        ["A cell image is 45 mm at ×1500. What is the real size in µm?", "45 ÷ 1500 = 0.03 mm = 30 µm."],
        ["A student calculates a cell is 30 m wide. What went wrong?", "Units weren't matched — probably mm and µm were mixed up. Convert first, then divide."],
        ["Why must image size and actual size be in the same units?", "Magnification is a ratio with no units; mixed units give an answer 1000 times too big or small."],
        ["An image of a 0.1 mm hair is 50 mm wide. Find the magnification.", "50 ÷ 0.1 = ×500."],
        ["A cell 50 µm wide is drawn 100 mm wide. Find the magnification.", "100 mm = 100 000 µm; 100 000 ÷ 50 = ×2000."],
        ["A bacterium is 2 µm long at ×5000. How long is the image in mm?", "2 × 5000 = 10 000 µm = 10 mm."],
        ["An image is 24 mm at ×800. Find the actual size in µm.", "24 ÷ 800 = 0.03 mm = 30 µm."],
        ["Convert 0.004 mm into µm.", "4 µm."],
        ["A drawing has magnification ×200 and the cell is 0.2 mm. How big is the drawing?", "0.2 × 200 = 40 mm."],
        ["Why is magnification written with a ×?", "It's a ratio (times bigger), so it has no units."],
        ["An image is 6 cm and magnification ×300. Find the actual size in mm.", "60 mm ÷ 300 = 0.2 mm."]
      ]
    },

    "movement": {
      "diffusion": [
        ["Why does oxygen diffuse from the alveoli into the blood?", "Oxygen concentration is higher in the air in the alveoli than in the blood arriving at the lungs, so there is a net movement down the gradient."],
        ["Why does a single-celled organism not need a transport system, but a large animal does?", "A small organism has a large surface area to volume ratio and short distances, so diffusion is fast enough. Large animals have a small ratio and long distances."],
        ["Why do breathing and blood flow keep diffusion fast in the lungs?", "They keep bringing in oxygen-rich air and taking away oxygenated blood, maintaining a steep concentration gradient."],
        ["Agar cubes of 1 cm and 2 cm sides are placed in acid. Which changes colour completely first, and why?", "The 1 cm cube: higher surface area to volume ratio and shorter distance to the centre."],
        ["Why does diffusion stop having a net effect even though particles keep moving?", "When concentrations are equal, as many particles move each way, so there's no net change."],
        ["Calculate the SA : V ratio of a 2 cm cube.", "SA = 6 × 4 = 24 cm²; V = 8 cm³; ratio 3 : 1."],
        ["Why does CO₂ diffuse into a leaf during the day?", "Photosynthesis uses it up, so concentration inside is lower than outside."],
        ["Calculate the SA : V ratio of a 1 cm cube.", "6 cm² : 1 cm³ = 6 : 1."],
        ["Calculate the SA : V ratio of a 3 cm cube.", "54 : 27 = 2 : 1."],
        ["Why do large organisms need specialised exchange surfaces?", "Their SA : V ratio is too small for diffusion through the body surface alone."],
        ["Why does urea diffuse from cells into the blood?", "Its concentration is higher in cells, where it's made, than in blood."],
        ["Why does diffusion of glucose into villi slow down after a meal is absorbed?", "The concentration gradient becomes smaller."],
        ["Why does the smell of perfume spread across a room?", "Perfume molecules diffuse from high to low concentration."]
      ],
      "osmosis": [
        ["Potato cylinders lose mass in 0.8 mol/dm³ sugar. Explain using water potential.", "The solution has lower water potential than the potato cells, so water leaves the cells by osmosis through their partially permeable membranes."],
        ["Why do farmers' crops wilt if too much fertiliser is applied?", "Soil water becomes concentrated (lower water potential than root cells), so water leaves the roots by osmosis instead of entering."],
        ["Why do you blot potato cylinders before weighing?", "To remove surface water, which isn't part of the cylinder and would give a false mass."],
        ["Why use percentage change in mass rather than change in mass?", "The cylinders may start with different masses; percentage change allows a fair comparison."],
        ["Why must a drip in hospital have the same concentration as blood?", "Otherwise water would move into or out of red blood cells by osmosis, making them burst or shrink."],
        ["Why does salting slugs kill them?", "The salt gives very low water potential outside the slug, so water leaves its cells by osmosis and it dehydrates."],
        ["A potato cylinder goes from 2.0 g to 2.4 g. Find the % change.", "0.4 ÷ 2.0 × 100 = +20%."],
        ["Why does a plant cell not burst in pure water?", "The cell wall resists the pressure of water pushing in."],
        ["Why do fresh-water fish not need to drink?", "Water enters their bodies by osmosis."],
        ["Why do salad leaves go crisp in cold water?", "Cells take in water by osmosis and become turgid."],
        ["Why is jam high in sugar unlikely to grow bacteria?", "Bacteria lose water to the concentrated sugar by osmosis."],
        ["Why does watering a plant revive it?", "Cells absorb water by osmosis and become turgid again."],
        ["Why do plant roots need soil water to be more dilute than cell sap?", "So water moves into the root by osmosis."]
      ],
      "active": [
        ["Root hair cells absorb nitrate ions although the soil has fewer than the cell. Explain how.", "Active transport: carrier proteins move the ions against the concentration gradient using energy from respiration."],
        ["Uptake of an ion stops when cyanide is added. What does this tell you?", "The ion was taken in by active transport: cyanide stops respiration, so no energy for the carriers."],
        ["Why does waterlogged soil reduce mineral uptake by roots?", "Water fills the air spaces, so roots get little oxygen; aerobic respiration slows and less energy is available for active transport."],
        ["Why does the gut need active transport to absorb glucose fully?", "As glucose is absorbed its concentration in the gut falls below that in the blood; diffusion would stop, but active transport can take up the rest."],
        ["How is active transport different from diffusion?", "It moves particles against the gradient (low → high), needs energy from respiration and carrier proteins."],
        ["Why does lack of oxygen stop active transport in root hairs?", "Less aerobic respiration means less energy for carrier proteins."],
        ["Why do carrier proteins only carry specific molecules?", "Their shape fits only certain molecules or ions."],
        ["Why might temperature affect active transport?", "Respiration enzymes and carrier proteins work best at optimum temperatures."],
        ["Why can't diffusion move glucose into the blood when the gut has less?", "Diffusion only moves particles down a concentration gradient."],
        ["Why are kidney tubule cells full of mitochondria?", "They actively reabsorb glucose, which needs energy."],
        ["Give an example of active transport in the kidney.", "Reabsorption of glucose from the nephron tubule into the blood."]
      ]
    },

    "molecules": {
      "building": [
        ["Why is glucose stored as starch in plants rather than as glucose?", "Starch is insoluble so it doesn't affect osmosis and stays in place; glucose would dissolve and draw water into cells."],
        ["What happens to a protein in digestion, and why?", "Proteases break it into amino acids, which are small and soluble enough to be absorbed into the blood."],
        ["Why does a protein's sequence of amino acids matter?", "It decides how the chain folds, and so the protein's shape — e.g. an enzyme's active site."],
        ["Fat stores more energy than carbohydrate. Why do animals store fat for long-term storage?", "It stores about twice as much energy per gram, so less mass is carried; it also insulates."],
        ["Which element would you find in a protein but not in starch?", "Nitrogen."],
        ["Why is starch insoluble useful?", "It doesn't affect water movement by osmosis in the cell."],
        ["Why can't humans digest cellulose?", "We don't make an enzyme that breaks it down."],
        ["Why do fats make good insulation?", "They conduct heat poorly, keeping body heat in."],
        ["Why are enzymes made of protein?", "Proteins fold into specific shapes that create active sites."],
        ["Why is glycogen stored in liver and muscle?", "So glucose can be released quickly when needed."],
        ["Why is nitrogen needed by plants for protein?", "Amino acids contain nitrogen."],
        ["Why do seeds often store oil?", "Oil stores a lot of energy in a small mass."]
      ],
      "tests": [
        ["A food turns Benedict's orange and biuret purple, but iodine stays orange-brown. What does it contain?", "Reducing sugar and protein, but no starch."],
        ["Why is a control tube with water used in food tests?", "It shows the negative colour, so you can be sure any colour change is caused by the food."],
        ["How could you compare the amount of reducing sugar in two juices?", "Benedict's test with equal volumes at the same temperature and time; compare the final colour (green → yellow → orange → brick-red) or how long it takes to change."],
        ["Why is the ethanol test done away from flames?", "Ethanol is flammable."],
        ["Juice A needs 5 drops to decolourise DCPIP, juice B needs 15. Which has more vitamin C?", "Juice A — fewer drops were needed."],
        ["Why does sucrose give a negative Benedict's test?", "Sucrose is not a reducing sugar (it must first be broken down into glucose and fructose)."],
        ["A food turns biuret purple and gives a cloudy emulsion. What does it contain?", "Protein and fat."],
        ["Why are food samples ground and mixed with water first?", "So the chemicals can reach the nutrients."],
        ["Why is the Benedict's test only semi-quantitative?", "Colours show roughly how much sugar, not an exact amount."],
        ["Why might iodine look blue-black in a potato?", "Potato stores starch."],
        ["Why does onion test positive for reducing sugar but not starch?", "Onions store glucose, not starch."],
        ["Why should equal volumes be used in food tests?", "To compare amounts fairly."],
        ["Why might a food test give a false positive?", "Dirty equipment or mixed samples can contaminate the test."]
      ],
      "dna": [
        ["A DNA strand reads AATGCG. Write the complementary strand and explain.", "TTACGC — A always pairs with T, and C with G."],
        ["DNA is 22% C. Work out the percentage of A.", "C = G = 22% → 44%. A + T = 56% → A = 28%."],
        ["Why does complementary base pairing allow DNA to be copied accurately?", "Each strand acts as a template: only one base can pair with each base, so the new strand is an exact match."],
        ["Why is water important in the blood plasma?", "It is a solvent that carries dissolved glucose, amino acids, urea, hormones and ions around the body."],
        ["Why must digested food dissolve in water before absorption?", "Only dissolved, small molecules can pass through the wall of the small intestine into the blood."],
        ["DNA is 40% G. What is the % of each base?", "G 40%, C 40%, A 10%, T 10%."],
        ["Why must A always equal T?", "A always pairs with T across the two strands."],
        ["Write the complementary strand to TTACGA.", "AATGCT."],
        ["Why is water a good transport medium in plants?", "Mineral ions and sugars dissolve in it."],
        ["Why does the order of bases matter?", "It codes for the order of amino acids, which decides the protein's shape and function."],
        ["If a strand has 100 bases, how many base pairs does double-stranded DNA have?", "100."]
      ]
    },

    "plant-nutrition": {
      "photo": [
        ["Where do the carbon atoms in a plant's glucose come from?", "Carbon dioxide from the air, which enters through the stomata."],
        ["Why do leaves look green?", "Chlorophyll absorbs mainly red and blue light and reflects green light."],
        ["Why does a plant need sunlight to make glucose from CO₂ and water?", "Photosynthesis needs energy to build glucose; chlorophyll absorbs light energy and transfers it into chemical energy."],
        ["Why do plants convert glucose into sucrose for transport?", "Sucrose is less reactive and is transported efficiently in the phloem without being used up on the way."],
        ["A plant has yellow leaves between green veins. What is likely wrong, and why?", "Magnesium deficiency: magnesium is needed to make chlorophyll."],
        ["Why does a plant grown without nitrates have stunted growth?", "Nitrates are needed to make amino acids and proteins for new cells."],
        ["Why do plants without magnesium have yellow leaves?", "Magnesium is needed to make chlorophyll."],
        ["Why does a plant need nitrogen to grow?", "To make amino acids and proteins."],
        ["Why is sucrose used for transport, not glucose?", "Sucrose is less reactive and is not used up on the way."],
        ["Why does a plant take in oxygen at night?", "It still respires but cannot photosynthesise in the dark."],
        ["Why does photosynthesis count as endothermic?", "It takes in energy from light."],
        ["Why do plants store oil in seeds?", "It holds a lot of energy for germination in a small mass."],
        ["Why does a plant turn glucose into amino acids?", "To make proteins for growth (using nitrate ions)."]
      ],
      "limits": [
        ["Why is a leaf boiled in water and then put in ethanol before the iodine test?", "Boiling breaks the cell membranes so iodine can get in; ethanol removes the chlorophyll so the colour change can be seen."],
        ["A variegated leaf is tested for starch. Predict the result and explain.", "Only the green areas turn blue-black: only they have chlorophyll, so only they photosynthesised and made starch."],
        ["Why is a beaker of water put between the lamp and the pondweed?", "It absorbs heat from the lamp, so temperature doesn't change and only light intensity varies."],
        ["The rate of photosynthesis levels off as light increases. Explain.", "Light is no longer the limiting factor — CO₂ concentration or temperature is now in shortest supply."],
        ["Why does photosynthesis slow down at very high temperatures?", "The enzymes involved denature."],
        ["Hydrogencarbonate indicator around a leaf in the dark turns yellow. Explain.", "In the dark there is no photosynthesis, only respiration, so CO₂ builds up."],
        ["Why does a dim light limit photosynthesis even with plenty of CO₂?", "Not enough energy is absorbed; light is the limiting factor."],
        ["Why is iodine solution added at the end of a starch test?", "It turns blue-black where starch is present."],
        ["Pondweed gives 20 bubbles/min at 10 cm and 5 at 20 cm. Explain.", "Light intensity falls with distance, so photosynthesis is slower."],
        ["Why does hydrogencarbonate stay red in moderate light?", "Photosynthesis uses CO₂ as fast as respiration makes it."],
        ["Why is counting bubbles less accurate than measuring gas volume?", "Bubbles vary in size."],
        ["Why does raising CO₂ in a glasshouse increase yield?", "CO₂ is often the limiting factor, so more glucose is made."],
        ["Why might light intensity stop limiting the rate at high intensity?", "Another factor, like CO₂ or temperature, becomes limiting."]
      ],
      "leaf": [
        ["Why are most stomata on the lower surface of a leaf?", "It is cooler and shaded, so less water is lost by evaporation."],
        ["Why do palisade cells sit near the upper surface?", "They receive the most light there, and they are packed with chloroplasts."],
        ["How do guard cells balance photosynthesis with water loss?", "They open stomata to let in CO₂ in light, and close them in the dark or when water is short to reduce water loss."],
        ["Why does the waxy cuticle not stop photosynthesis?", "It is transparent, so light passes through it, while it reduces water loss."],
        ["Trace the path of a CO₂ molecule from the air to a chloroplast.", "Through a stoma → air spaces of the spongy mesophyll → dissolves in the moist cell wall → diffuses into a palisade or spongy cell → chloroplast."],
        ["Why do upper epidermis cells have no chloroplasts?", "So light passes straight through to the palisade cells."],
        ["Why does the leaf need xylem?", "To supply water for photosynthesis."],
        ["Why does the leaf need phloem?", "To carry sucrose away to other parts of the plant."],
        ["Why does closing stomata reduce photosynthesis?", "Less CO₂ can diffuse into the leaf."],
        ["Why are palisade cells tall and tightly packed?", "To fit in many chloroplasts and absorb lots of light."],
        ["Why do air spaces help gas exchange?", "They give a large internal surface area for diffusion."],
        ["Why do stomata open in the light?", "So CO₂ can diffuse in for photosynthesis."]
      ]
    },

    "human-nutrition": {
      "diet": [
        ["Why does a teenager need more energy and protein than an elderly adult?", "They are growing (protein for new tissues) and usually more active."],
        ["Why does a pregnant woman need extra iron and calcium?", "Iron for the extra blood (haemoglobin) for her and the fetus; calcium for the baby's bones and teeth."],
        ["Explain how lack of iron causes tiredness.", "Iron is needed for haemoglobin; with less haemoglobin the blood carries less oxygen, so less aerobic respiration releases energy."],
        ["Why does fibre help prevent constipation?", "It adds bulk, giving the gut muscles something to push against during peristalsis."],
        ["Why is vitamin D needed with calcium?", "Vitamin D helps the body absorb calcium for strong bones; lack of either can cause rickets."],
        ["Why might an athlete eat more carbohydrates?", "Exercise needs more energy from respiration."],
        ["Why can too much saturated fat be harmful?", "It can raise cholesterol, leading to heart disease."],
        ["Why does a lack of protein stunt growth?", "Protein is needed to build new cells and tissues."],
        ["Why does obesity increase health risks?", "Linked to heart disease, type 2 diabetes and joint problems."],
        ["Why does vitamin C deficiency cause bleeding gums?", "Collagen can't be made, so tissues weaken."],
        ["Why do children need more calcium?", "Their bones are growing."],
        ["Why does an office worker need less energy than a builder?", "They are less physically active."]
      ],
      "system": [
        ["Why is egestion not excretion?", "Faeces are undigested food that was never part of the body's cells; excretion removes waste made by metabolism."],
        ["How does chewing speed up digestion?", "Breaking food into smaller pieces increases its surface area for enzymes to act on."],
        ["Describe how peristalsis moves food.", "Circular muscles contract behind the food and relax in front of it, pushing it along in a wave."],
        ["Why does sugary food cause tooth decay?", "Bacteria in plaque respire the sugar and produce acid, which dissolves enamel and dentine."],
        ["Why is fluoride added to toothpaste?", "It strengthens enamel, making it more resistant to acid."],
        ["Which organs add juices to the gut without food passing through them?", "Salivary glands, pancreas, liver (with gall bladder)."],
        ["Why do bacteria in the mouth cause tooth decay?", "They feed on sugar and make acid that dissolves enamel."],
        ["Why is the stomach wall muscular?", "To churn food and mix it with gastric juice."],
        ["Why is the small intestine long?", "To give more time and surface area for digestion and absorption."],
        ["Why is regular brushing important?", "It removes plaque and bacteria."],
        ["How does circular muscle cause peristalsis?", "It contracts behind the food, squeezing it forward."],
        ["Why does food pass through the stomach before the small intestine?", "Acid kills bacteria and pepsin starts protein digestion."],
        ["Why do teeth have enamel?", "It's hard and protects the inner tooth."]
      ],
      "chemical": [
        ["Why does bile not count as chemical digestion?", "Bile contains no enzymes; emulsification breaks fat into droplets but doesn't break the fat molecules."],
        ["How does bile speed up fat digestion?", "Emulsification gives a much larger surface area for lipase, and bile's alkali gives lipase its optimum pH."],
        ["Explain why starch digestion starts in the mouth, stops in the stomach and continues in the small intestine.", "Salivary amylase works at pH 7 in the mouth; stomach acid denatures it; pancreatic amylase works again in the alkaline small intestine."],
        ["Why does the stomach produce hydrochloric acid?", "To kill pathogens in food, and to give the acidic pH that pepsin works best at."],
        ["What would happen to fat digestion if the gall bladder was removed?", "Bile isn't stored and released in large amounts after a meal, so fats are emulsified less and digested more slowly."],
        ["Why must maltose be broken down further after amylase acts?", "Maltose is still too big to absorb efficiently; maltase breaks it into glucose."],
        ["Why does emulsifying fat help digestion?", "It increases the surface area for lipase."],
        ["Why does the pancreas release enzymes into the duodenum?", "To digest food leaving the stomach."],
        ["Why is maltase found on the epithelium of the small intestine?", "It breaks maltose into glucose just before absorption."],
        ["Why might people without a pancreas struggle to digest food?", "They lack amylase, protease and lipase from pancreatic juice."],
        ["Why is pepsin stopped when food enters the duodenum?", "The alkaline conditions change its active site."],
        ["What would happen to a protein meal if the stomach made no acid?", "Pepsin wouldn't work well, and protein digestion would start late."],
        ["Why does bile need to be alkaline?", "To neutralise stomach acid so intestinal enzymes work."]
      ],
      "absorption": [
        ["Explain how each feature of a villus speeds up absorption.", "Microvilli and folds: large surface area. One-cell-thick wall: short distance. Dense capillaries: carry nutrients away, keeping a steep gradient. Lacteal: absorbs fats."],
        ["Why might a disease that flattens the villi cause weight loss?", "The surface area for absorption is reduced, so fewer nutrients are absorbed."],
        ["Why does most water absorption happen in the small intestine, not the colon?", "The small intestine is long with a huge surface area; the colon absorbs most of what remains."],
        ["Why are fats absorbed into lacteals rather than capillaries?", "Fatty acids and glycerol are reassembled into fat droplets too large for capillaries; they enter the lymph."],
        ["Why do villi use both diffusion and active transport?", "Diffusion works while gut concentration is high; active transport absorbs the rest against the gradient."],
        ["Why do villi have many capillaries?", "To carry away absorbed food and keep a steep concentration gradient."],
        ["Why does food go to the liver first after absorption?", "The liver processes nutrients and removes toxins."],
        ["Why does diarrhoea cause dehydration?", "Less water is absorbed in the colon, so it is lost."],
        ["Why does the small intestine have microvilli?", "Further increases surface area for faster absorption."],
        ["Why are amino acids absorbed into blood capillaries?", "They are water-soluble and carried in the plasma."],
        ["Why is a long small intestine helpful for absorption?", "It gives a large surface area and more time for absorption."]
      ]
    },

    "coordination": {
      "nerves": [
        ["You touch a hot pan and pull your hand away before feeling pain. Explain the pathway.", "Heat receptor → sensory neurone → relay neurone in the spinal cord → motor neurone → biceps contracts. Signals reach the brain later, so you feel pain after moving."],
        ["Why are reflex actions faster than voluntary actions?", "The impulse goes through the spinal cord via a relay neurone without conscious thought in the brain, so fewer synapses and no decision."],
        ["Why do reflexes help survival?", "They protect the body automatically and quickly from harm — e.g. blinking, withdrawing from pain."],
        ["Explain how a drug that blocks neurotransmitter receptors affects nerve signals.", "The transmitter can't bind to the next neurone, so no new impulse starts — signals across that synapse stop."],
        ["Why can impulses only travel one way across a synapse?", "Only the first neurone has vesicles releasing transmitter; only the second has receptors."],
        ["Is the pupil reflex an example of the nervous system or hormones? Explain.", "The nervous system: it is a fast, automatic reflex using neurones and muscles in the iris."],
        ["Name the effector and response when you blink at a bright flash.", "Eyelid muscles contract; the eye closes."],
        ["Why don't reflex actions involve the conscious brain?", "The relay neurone in the spinal cord connects directly to a motor neurone, saving time."],
        ["Describe what happens at a synapse step by step.", "Impulse arrives; vesicles release neurotransmitter; it diffuses across the gap; binds receptors; a new impulse starts."],
        ["Why does damage to the spinal cord cause paralysis?", "Impulses can't travel between the brain and the muscles below the damage."],
        ["Give the receptor, coordinator and effector in the knee-jerk reflex.", "Stretch receptor in the thigh muscle; spinal cord; thigh muscle."],
        ["Why can you choose not to drop a hot plate?", "The brain can override the reflex with a voluntary action."],
        ["Why do motor neurones have long axons?", "To carry impulses from the spinal cord to distant muscles."]
      ],
      "eye": [
        ["Walking from a dark room into sunlight — explain what happens to the pupil.", "Light receptors detect bright light → reflex → circular muscles of the iris contract and radial muscles relax → pupil constricts, protecting the retina."],
        ["Explain how the eye focuses on a book after looking out of a window.", "Ciliary muscles contract, suspensory ligaments slacken, the lens becomes fatter and refracts light more, focusing the near image on the retina."],
        ["Why is colour vision poor at night?", "Cones need bright light; in dim light only rods work, which give black-and-white vision."],
        ["Why do you see most clearly when looking straight at an object?", "Light focuses on the fovea, which is packed with cones."],
        ["Why is there a ‘blind spot’ in each eye?", "Where the optic nerve leaves the retina there are no rods or cones."],
        ["Why are the iris muscles called antagonistic?", "Circular and radial muscles have opposite effects — when one contracts, the other relaxes."],
        ["Why does the lens become fatter for near objects?", "The ciliary muscles contract, suspensory ligaments slacken, so the lens rounds up and bends light more."],
        ["Why does the pupil reflex protect the eye?", "It stops too much bright light damaging the retina."],
        ["Which muscles contract in the iris in bright light?", "The circular muscles contract and the radial muscles relax."],
        ["Why do animals active at night have many rods?", "Rods are sensitive to dim light."],
        ["Why are rods found mostly around the edge of the retina?", "So the edge of vision can detect dim light and movement."],
        ["Why is the image on the retina upside down but you see it the right way?", "The brain interprets the image."],
        ["Why do pupils widen in dim light?", "To let more light reach the retina."]
      ],
      "hormones": [
        ["Explain how adrenaline prepares the body for ‘fight or flight’.", "It raises heart and breathing rate and blood glucose, so more glucose and oxygen reach the muscles for respiration — releasing more energy for action."],
        ["Why do hormones affect only their target organs, although blood carries them everywhere?", "Only target cells have receptors that the hormone can bind to."],
        ["Why is a hormone a better way than nerves to control growth?", "Growth is slow and long-lasting and involves the whole body; hormones act slowly, widely and for a long time."],
        ["Compare how fast and how long nervous and hormonal responses last, with an example of each.", "Nervous: milliseconds, short (pulling away from heat). Hormonal: seconds to years, long-lasting (puberty, blood glucose control)."],
        ["Why does your heart keep pounding for a while after a fright?", "Adrenaline remains in the blood for some time until it is broken down."],
        ["Why does adrenaline increase blood glucose?", "To supply more glucose to muscles for respiration."],
        ["Why does adrenaline increase heart rate?", "To deliver oxygen and glucose to muscles faster."],
        ["Why do hormones take longer to act than nerves?", "They travel in the blood, which is slower than electrical impulses."],
        ["Why is the pancreas both an endocrine organ and part of the digestive system?", "It secretes insulin and glucagon into the blood and digestive enzymes into the gut."],
        ["Which is better for withdrawing from a hot surface: nerves or hormones? Why?", "Nerves — they act in milliseconds."],
        ["Give one long-term effect of a hormone.", "e.g. testosterone causing growth of facial hair at puberty."],
        ["Why does adrenaline make breathing faster?", "To take in more oxygen for respiration in muscles."]
      ],
      "homeostasis": [
        ["Blood glucose rises after a meal. Describe how it returns to normal.", "The pancreas detects the rise and releases insulin → liver and muscle cells take up glucose and convert it to glycogen → blood glucose falls."],
        ["Explain why homeostasis uses negative feedback.", "Any change from the set point triggers a response that reverses it, keeping conditions stable."],
        ["Why must body temperature stay near 37 °C?", "It is the optimum for the body's enzymes; too hot denatures them, too cold slows reactions."],
        ["Explain how vasodilation helps you cool down.", "Arterioles near the skin widen, so more blood flows near the surface and more heat is lost by radiation."],
        ["Why does shivering warm you up?", "Rapid muscle contractions increase respiration, which releases heat."],
        ["Why must a person with type 1 diabetes balance insulin, food and exercise?", "Too much insulin or exercise without food → dangerously low glucose; too little insulin → glucose stays high."],
        ["Why is glucose found in the urine of untreated diabetics?", "Blood glucose is so high that the kidneys can't reabsorb it all from the filtrate."],
        ["Why does blood glucose fall during exercise?", "Muscles use glucose faster for respiration."],
        ["Describe how glucagon raises blood glucose.", "The pancreas releases glucagon; the liver converts glycogen to glucose, which enters the blood."],
        ["Why does skin look red when hot?", "Vasodilation brings more blood to skin capillaries near the surface."],
        ["Why does hair standing up do little for humans?", "Human body hair is too sparse to trap much insulating air."],
        ["Why is the hypothalamus important?", "It detects blood temperature and coordinates responses to keep it constant."],
        ["Why do people with diabetes test blood glucose?", "To decide how much insulin to inject or food to eat."],
        ["Why do people get hypothermia in cold water?", "Water conducts heat away quickly, so body temperature falls below normal."]
      ],
      "tropisms": [
        ["A shoot is lit from the left. Explain in detail why it bends left.", "Auxin from the tip collects on the shaded right side → cells there elongate more → the right side grows longer → the shoot bends left, towards the light."],
        ["A shoot has its tip covered with foil. Predict and explain.", "It grows straight up with no bending: the tip detects light and makes auxin, so with no light reaching it there is no unequal auxin."],
        ["Why do roots grow downwards?", "Positive gravitropism: they grow towards gravity, which takes them to water and minerals and anchors the plant."],
        ["Why do seedlings on a rotating clinostat grow straight?", "Gravity (or light) acts equally on all sides as it turns, so auxin is spread evenly."],
        ["Why do synthetic auxin weedkillers not harm wheat?", "Broad-leaved weeds absorb more and grow uncontrollably until they die; narrow-leaved crops like wheat are not affected."],
        ["Why does more auxin on the shaded side make a shoot bend towards light?", "Cells on the shaded side elongate more, so the shoot curves towards the light."],
        ["A shoot tip is cut off. Predict what happens and explain.", "It stops bending (and growing) — the tip makes the auxin."],
        ["A seedling is placed on its side. What happens to the shoot and why?", "It bends upwards — auxin collects on the lower side, making those cells elongate more."],
        ["Why does a shoot lit from all sides grow straight?", "Auxin is spread evenly, so all sides elongate equally."],
        ["Why do synthetic auxins kill broad-leaved weeds?", "They cause rapid, uncontrolled growth that the plant can't sustain."],
        ["Plan an experiment to show shoots grow towards light.", "Grow seedlings in a box lit from one side; control box lit evenly; compare after a few days."],
        ["Why do roots bend downwards when placed on their side?", "Auxin gathers on the lower side, slowing growth there, so the root curves down."]
      ]
    },

    "disease-immunity": {
      "pathogens": [
        ["Explain how washing hands after the toilet prevents disease.", "It removes pathogens from faeces, so they aren't transferred to food or the mouth."],
        ["Why does sewage treatment reduce cholera?", "Cholera bacteria are in human faeces; treatment stops them getting into drinking water."],
        ["Why does malaria spread more in places with standing water?", "Mosquitoes, the vector, breed in still water."],
        ["Why is refrigerating food important?", "Low temperature slows the reproduction of bacteria in the food."],
        ["Why should raw and cooked meat be kept apart?", "Pathogens from raw meat could transfer to cooked food, which won't be cooked again to kill them."],
        ["Why does a fly landing on food spread disease?", "It carries pathogens from faeces or waste on its body."],
        ["How does the body react to cholera-infected water?", "Bacteria in the intestine release a toxin, causing diarrhoea."],
        ["Why does living in crowded conditions increase disease spread?", "Pathogens pass easily between people in close contact."],
        ["Why does covering a sneeze help?", "Droplets carrying pathogens are trapped instead of spreading through the air."],
        ["How does proper waste disposal reduce disease?", "It removes food for flies and rats that carry pathogens."],
        ["Why are mosquito nets useful against malaria?", "They stop mosquitoes biting people at night, preventing transmission."],
        ["Why does cooking food kill pathogens?", "High temperatures denature their proteins."]
      ],
      "defences": [
        ["How does mucus protect the lungs?", "It traps dust and pathogens; cilia sweep it up to the throat to be swallowed, where stomach acid kills the pathogens."],
        ["Why does a cut in the skin increase the risk of infection?", "The skin is a barrier; breaking it lets pathogens enter directly — which is why blood clots seal wounds fast."],
        ["Explain why a lymphocyte that makes measles antibodies doesn't protect against chickenpox.", "Antibodies are specific: their shape fits only the measles antigens, not the different chickenpox antigens."],
        ["Describe how a phagocyte destroys a bacterium.", "It moves to the bacterium, engulfs it into a vacuole, and digests it with enzymes."],
        ["How do antibodies help phagocytes?", "Antibodies bind to antigens, clumping pathogens together and marking them so phagocytes find and engulf them more easily."],
        ["Why do antibodies only fit one antigen?", "Each antibody has a specific shape complementary to that antigen."],
        ["Why does a person with fewer lymphocytes get more infections?", "They make fewer antibodies, so pathogens are not destroyed quickly."],
        ["Why does blood clotting help defence?", "It seals cuts, preventing pathogens entering."],
        ["Why do antibodies cause pathogens to clump together?", "Each antibody can bind two antigens, sticking pathogens together so phagocytes engulf them easily."],
        ["Why is stomach acid a defence?", "Its low pH kills most pathogens swallowed with food."],
        ["Why does smoking increase chest infections?", "It damages cilia, so mucus and pathogens build up in the lungs."],
        ["Why does a fever help fight infection?", "Higher temperature slows pathogen growth and speeds up the immune response."]
      ],
      "immunity": [
        ["Explain why you get ill the first time you catch a virus but not the second.", "First time, lymphocytes take days to make enough antibodies. Memory cells then remain; next time they respond much faster with more antibodies, killing the virus before symptoms."],
        ["Why do vaccines contain antigens, not antibodies?", "Antigens trigger your own lymphocytes to make antibodies and memory cells, giving long-term active immunity."],
        ["Why is passive immunity only short-term?", "The antibodies come from another source and are broken down; no memory cells are made."],
        ["Explain how herd immunity protects a newborn baby who is too young to be vaccinated.", "If most people around are immune, the pathogen can't spread, so the baby is unlikely to meet it."],
        ["Why does cholera cause dehydration?", "Its toxin makes chloride ions move into the gut; water follows by osmosis from the blood, leading to severe diarrhoea."],
        ["Why is oral rehydration solution an effective cholera treatment?", "It replaces the water, salts and glucose lost, and glucose helps salts and water be absorbed."],
        ["Why does the antibody level rise faster after a second exposure?", "Memory cells quickly divide and produce antibodies."],
        ["Why do some vaccines need booster doses?", "To increase memory cells and antibody levels for longer protection."],
        ["Why might a flu vaccine not protect you next year?", "The virus mutates, changing its antigens, so old antibodies don't fit."],
        ["Why does breastfeeding help protect babies?", "Breast milk contains antibodies, giving passive immunity."],
        ["Why does cholera toxin cause water to move into the intestine?", "It makes cells secrete chloride ions into the gut; water follows by osmosis."],
        ["Why might vaccinating 95% of people protect the other 5%?", "Herd immunity — the pathogen has few hosts to spread through."],
        ["Why does herd immunity fall if fewer people are vaccinated?", "More people can catch and pass on the disease."]
      ]
    },

    "drugs": {
      "drugs": [
        ["Is caffeine a drug? Explain using the definition.", "Yes — it is taken into the body and modifies chemical reactions (it stimulates the nervous system)."],
        ["Why does a doctor prescribe a specific dose of a medicine?", "Too little may not work; too much can be harmful (side effects or poisoning)."],
        ["How can a drug affect the nervous system at a synapse?", "It can copy a neurotransmitter and trigger impulses, or block receptors and stop them."],
        ["Why is a painkiller said to treat symptoms, not the cause?", "It reduces the feeling of pain but doesn't remove the pathogen or problem causing it."],
        ["Why should medicines not be shared between people?", "The dose and drug are chosen for one person's illness, weight and health; they may be harmful or useless for someone else."],
        ["Why can drug abuse be harmful even with legal drugs?", "Too much or too frequent use can damage organs and lead to addiction."],
        ["Why do drugs affect the nervous system?", "Many change how neurotransmitters work at synapses."],
        ["Why should you read the label of a medicine?", "To take the correct dose and know possible side effects."],
        ["Why can tolerance lead to overdose?", "People take ever-larger amounts to get the same effect."],
        ["Why is alcohol classed as a drug?", "It is taken into the body and changes its chemical reactions — it slows the nervous system (a depressant)."],
        ["Why should drivers not drink alcohol?", "It slows reaction times and impairs judgement."]
      ],
      "antibiotics": [
        ["A patient with flu asks for antibiotics. Why will the doctor refuse?", "Flu is caused by a virus; antibiotics target bacterial structures like the cell wall, which viruses don't have. Unnecessary use also increases resistance."],
        ["Explain how MRSA became resistant to antibiotics.", "A random mutation gave some bacteria resistance; antibiotics killed the non-resistant ones; resistant ones survived, reproduced and passed on the allele — natural selection."],
        ["Why should you finish a course of antibiotics even if you feel better?", "Some bacteria may survive — often the most resistant; finishing the course kills them so resistance doesn't spread."],
        ["Why does using antibiotics in farm animals increase resistance?", "Widespread use gives resistant bacteria an advantage, so they multiply and can spread to humans."],
        ["Why can antibiotics kill bacteria without harming human cells?", "They target structures found only in bacteria, such as the cell wall, so our cells are unaffected."],
        ["A student says ‘bacteria become immune to antibiotics’. Correct this.", "Individual bacteria don't change; resistant ones already exist due to mutation, and they survive and reproduce while others die."],
        ["Why should antibiotics only be used when needed?", "Each use gives resistant bacteria a chance to survive and spread."],
        ["Why does stopping antibiotics early help resistance?", "Some bacteria survive, often the most resistant, and multiply."],
        ["Why is MRSA a problem in hospitals?", "Many patients are weak and antibiotics are widely used, so resistant bacteria spread."],
        ["Why do new antibiotics need to be developed?", "Bacteria keep evolving resistance to existing ones."],
        ["How does hand hygiene in hospitals reduce MRSA?", "It stops resistant bacteria spreading between patients."],
        ["Why do mutations matter for antibiotic resistance?", "Random mutations can give a bacterium resistance."],
        ["Why is it good to use a narrow-spectrum antibiotic when possible?", "It targets the specific bacteria and gives fewer bacteria the chance to evolve resistance."]
      ]
    },

    "excretion": {
      "waste": [
        ["Why is CO₂ an excretory product but O₂ from photosynthesis also counts as excretion in plants?", "Both are waste products of metabolism: CO₂ from respiration, O₂ from photosynthesis."],
        ["Explain why we can't store excess amino acids.", "There is no store for them, so the liver deaminates them: the nitrogen part becomes urea, the rest is used for energy or stored as glycogen or fat."],
        ["Why does a high-protein diet increase urea production?", "More amino acids are taken in than needed, so more are deaminated in the liver, making more urea."],
        ["Why is a build-up of CO₂ in the blood harmful?", "It forms an acid, lowering blood pH, which affects enzymes."],
        ["Trace a nitrogen atom from a protein in a meal to the urine.", "Protein → amino acids (digestion) → absorbed into blood → deaminated in the liver → urea → blood → kidneys → urine."],
        ["Why is urea toxic if allowed to build up?", "High levels damage cells and disrupt body functions."],
        ["What happens to the remainder of an amino acid after deamination?", "It is converted into carbohydrate and used in respiration or stored."],
        ["Why can't the body store protein like fat?", "There is no storage form for amino acids, so excess is deaminated."],
        ["Why does breathing faster remove more CO₂?", "More air moves through the lungs, keeping the concentration gradient steep."],
        ["Why does the liver have a large blood supply?", "It processes nutrients, toxins and waste from blood quickly."],
        ["Why is excess water excreted?", "To keep the water potential of blood constant."],
        ["Why does sweating not count as the main way of excreting urea?", "Only small amounts of urea leave in sweat; the kidneys remove most of it."]
      ],
      "kidneys": [
        ["Why is urine more concentrated after exercise on a hot day?", "Water is lost in sweat, so the kidneys reabsorb more water to conserve it, making a small volume of concentrated urine."],
        ["Why does healthy urine contain no glucose?", "All the glucose filtered is reabsorbed back into the blood."],
        ["Protein in the urine suggests what kind of damage?", "Damage to the filter (glomerulus), because protein molecules are normally too big to be filtered."],
        ["Why do people with kidney failure need dialysis?", "Urea and excess water and salts would build up in the blood to toxic levels."],
        ["Describe the path of urine, naming every tube.", "Kidney → ureter → bladder (stored) → urethra → out of the body."],
        ["Why does drinking lots of water make urine paler?", "The kidneys excrete more water to get rid of the excess."],
        ["How does dialysis keep useful substances in the blood?", "The dialysis fluid contains glucose and ions at the same concentration as normal blood."],
        ["Why does blood leaving the kidney have less urea?", "Urea is filtered out into the urine."],
        ["Give an advantage of a kidney transplant over dialysis.", "Freedom from regular sessions and a normal diet (but risk of rejection)."],
        ["Why is the dialysis fluid flowing in the opposite direction to blood?", "It keeps a concentration gradient along the whole length."],
        ["Why is a kidney transplant patient given drugs?", "To suppress the immune system and prevent rejection."],
        ["Why can a person live with one kidney?", "One kidney can filter enough blood for the body's needs."]
      ],
      "nephron": [
        ["Why must blood enter the glomerulus at high pressure?", "The pressure forces small molecules out of the capillaries into the Bowman's capsule — that's filtration."],
        ["Which substances are filtered and then completely reabsorbed?", "Glucose — all of it is reabsorbed in the tubule."],
        ["Why are cells lining the first part of the tubule packed with mitochondria?", "Glucose is reabsorbed partly by active transport, which needs energy from respiration."],
        ["Compare the composition of the filtrate and the urine.", "Filtrate: water, glucose, urea, ions. Urine: no glucose, less water and fewer ions, but more concentrated urea."],
        ["How do the kidneys keep the water content of the blood constant?", "They change how much water is reabsorbed in the tubule and collecting duct — more when dehydrated, less when there's excess."],
        ["Why is glucose reabsorbed by active transport?", "It is moved against a concentration gradient, so energy is needed."],
        ["Why does urine contain urea but no glucose?", "All glucose is reabsorbed; urea is not."],
        ["Why does the afferent arteriole have a wider diameter than the efferent?", "It builds up high pressure in the glomerulus for filtration."],
        ["Why might a damaged glomerulus let protein into urine?", "Its walls become leaky, letting large molecules through."],
        ["Why does the filtrate contain urea, water, glucose and ions?", "They are small enough to pass through the capillary walls."],
        ["Why are many nephrons needed in each kidney?", "To filter the whole blood volume many times a day."],
        ["Why does the volume of filtrate fall along the nephron?", "Most water is reabsorbed into the blood."]
      ]
    },

    "gas-exchange": {
      "lungs": [
        ["Explain how each feature of the alveoli speeds up gas exchange.", "Large surface area (millions of alveoli); thin walls (one cell each for alveolus and capillary); good blood supply and ventilation keep the gradient steep; moist so gases dissolve."],
        ["Why does emphysema (alveoli walls breaking down) cause breathlessness?", "Fewer, larger air spaces mean a much smaller surface area, so less oxygen diffuses into the blood."],
        ["How does smoking damage the airway's defences?", "Tar and chemicals stop cilia beating and increase mucus, so mucus and pathogens build up, causing coughs and infections."],
        ["Why is the trachea supported by C-shaped rings, not complete rings?", "The rings keep it open; the gap at the back lets the oesophagus expand when food is swallowed."],
        ["Why do fish need gills instead of lungs?", "Gills have a huge surface area in contact with water, where oxygen is dissolved; they work like lungs for water."],
        ["Why do alveoli have walls one cell thick?", "To give a short diffusion distance."],
        ["Why does a good blood supply help gas exchange?", "It maintains a steep concentration gradient."],
        ["Why are alveoli moist?", "Gases dissolve before diffusing across the wall."],
        ["Why do so many alveoli help?", "They give a huge surface area for diffusion."],
        ["How does mucus help protect the lungs?", "It traps dust and pathogens."],
        ["Why do smokers often cough?", "Cilia are damaged, so mucus builds up and must be coughed up."],
        ["Why do alveoli need a moist lining?", "Oxygen dissolves before diffusing into the blood."]
      ],
      "breathing": [
        ["Explain how breathing in happens, in the right order.", "External intercostals contract (ribs up and out) and the diaphragm contracts and flattens → thorax volume increases → pressure falls below atmospheric → air flows in."],
        ["Why is ‘the lungs expand and suck in air’ wrong?", "The lungs have no muscles; the muscles enlarge the thorax, lowering the pressure, and air is pushed in by atmospheric pressure."],
        ["What happens during forced exhalation, such as coughing?", "Internal intercostals contract, pulling the ribs down and in, and abdominal muscles push the diaphragm up — air is forced out quickly."],
        ["Why does a bell-jar model with a rubber sheet show breathing?", "Pulling the sheet down increases volume and lowers pressure, so the balloons (lungs) inflate — like the diaphragm."],
        ["Why does a puncture in the chest wall stop a lung inflating?", "Air enters the space around the lung, so lowering the pressure no longer draws air into the lung."],
        ["Why does air rush out when you breathe out?", "The thorax volume falls, raising the pressure above atmospheric."],
        ["Why is the diaphragm flattened during inhalation?", "Its muscle contracts, pulling it down and increasing the thorax volume."],
        ["Why does the lung need to be airtight in the chest?", "A pressure difference can only form if air can't enter the chest cavity elsewhere."],
        ["What happens to the abdominal muscles during forced exhalation?", "They contract, pushing the diaphragm up."],
        ["Why is breathing out at rest mostly passive?", "The muscles relax and the lungs recoil elastically."],
        ["Why does climbing high mountains make breathing harder?", "Air pressure is lower, so less oxygen enters with each breath."]
      ],
      "air": [
        ["Explain why expired air contains more CO₂ and less O₂ than inspired air.", "Cells use oxygen in respiration and produce CO₂; in the alveoli oxygen diffuses into the blood and CO₂ diffuses out into the air."],
        ["Why is expired air still about 16% oxygen?", "Not all the oxygen in the alveoli diffuses into the blood; air also stays in the airways without reaching the alveoli."],
        ["During exercise, what triggers deeper, faster breathing?", "Muscles respire faster, making more CO₂; the brain detects higher CO₂ in the blood and sends impulses to the breathing muscles."],
        ["Why does breathing stay fast after exercise ends?", "To supply oxygen to break down lactic acid built up during anaerobic respiration (the oxygen debt)."],
        ["Design a fair test of exercise on breathing rate.", "Count breaths per minute at rest, after a set exercise for a fixed time, and every minute during recovery; use the same person and repeat."],
        ["Why is expired air warmer than inspired air?", "It is warmed by the body."],
        ["Why does limewater go cloudy faster with expired air?", "Expired air contains much more carbon dioxide."],
        ["Why does exercise increase CO₂ in the blood?", "Muscles respire faster, producing more CO₂."],
        ["How can you measure breathing rate?", "Count breaths per minute."],
        ["Why might a fitter person's breathing return to normal sooner?", "Their heart and lungs deliver oxygen more efficiently, so less oxygen debt builds up."],
        ["What is the oxygen debt?", "The extra oxygen needed after exercise to break down lactic acid."],
        ["Why does breathing rate increase before you start exercising?", "Adrenaline prepares the body in anticipation."]
      ]
    },

    "respiration": {
      "energy": [
        ["Why does a respirometer with germinating seeds show the liquid moving towards the seeds?", "Seeds take in oxygen; the CO₂ they give out is absorbed by soda lime, so gas volume falls and the liquid is pulled in."],
        ["Why do mammals and birds need more energy from respiration than reptiles?", "They keep a constant body temperature, releasing heat from respiration even in the cold."],
        ["Why does respiration slow down at low temperatures?", "It is controlled by enzymes, which work slowly when molecules have less kinetic energy."],
        ["Why do boiled seeds make a good control?", "They are dead, so they don't respire — any change must be due to something else, e.g. temperature."],
        ["Why is it wrong to say respiration ‘makes energy’?", "Energy can't be created; respiration releases energy stored in the chemical bonds of glucose."],
        ["Why does more activity raise respiration rate?", "Muscles need more energy for contraction."],
        ["Why do germinating seeds respire quickly?", "They need energy for growth."],
        ["Why do cold-blooded animals respire less?", "They don't use energy to keep warm."],
        ["Why does a respirometer need to be in a water bath?", "To keep temperature constant, as it affects gas volume and respiration."],
        ["Why is respiration called a chemical process?", "It involves breaking down glucose with enzymes."],
        ["Why does body temperature rise during exercise?", "More respiration releases more heat."]
      ],
      "aerobic": [
        ["How is the aerobic respiration equation related to photosynthesis?", "It is the reverse: photosynthesis stores energy in glucose from CO₂ and water; respiration releases it, giving back CO₂ and water."],
        ["Why do sperm cells have many mitochondria in their midpiece?", "Swimming needs a lot of energy from aerobic respiration."],
        ["Trace an oxygen molecule from the air to a muscle cell mitochondrion.", "Alveolus → diffuses into blood → binds haemoglobin in a red cell → carried to muscle capillaries → diffuses into the muscle cell → mitochondrion."],
        ["Why does a lack of oxygen affect active transport?", "Without oxygen there's less aerobic respiration, so less energy is available for carrier proteins."],
        ["A balanced equation: C₆H₁₂O₆ + 6O₂ → ? Complete and explain the numbers.", "6CO₂ + 6H₂O: 6 carbons give 6 CO₂; 12 hydrogens give 6 H₂O; oxygen balances at 18 atoms on each side."],
        ["Why is aerobic respiration the reverse of photosynthesis?", "Reactants and products are swapped."],
        ["Why does breathing rate increase during exercise?", "To supply more oxygen and remove more CO₂."],
        ["Why do root cells need oxygen?", "For aerobic respiration to release energy for active transport."],
        ["Why do cells in the liver have many mitochondria?", "The liver carries out many energy-demanding processes."],
        ["Why do plants respire all the time?", "All living cells need energy at all times."],
        ["Why does a lack of oxygen cause death quickly?", "Cells can't release enough energy for vital processes."]
      ],
      "anaerobic": [
        ["Why do muscles respire anaerobically in a sprint?", "The heart and lungs can't deliver oxygen fast enough for the energy needed, so muscles also release energy without oxygen."],
        ["Why does anaerobic respiration release far less energy than aerobic?", "Glucose is only partly broken down — lactic acid (or ethanol) still contains a lot of chemical energy."],
        ["Why does lactic acid cause muscle fatigue?", "It builds up in muscles, lowering pH and stopping them contracting efficiently, causing pain and cramp."],
        ["Why does bread rise but contain no alcohol after baking?", "Yeast makes CO₂ bubbles that raise the dough; baking evaporates the ethanol and kills the yeast."],
        ["Explain the oxygen debt.", "After exercise, extra oxygen is needed to break down lactic acid in the liver, so breathing and heart rate stay high."],
        ["Why do brewers keep yeast without oxygen?", "Without oxygen, yeast respires anaerobically and makes ethanol; with oxygen it would make CO₂ and water instead."],
        ["Why do you breathe heavily after a sprint?", "To repay the oxygen debt."],
        ["Why does yeast make alcohol in the absence of oxygen?", "It respires anaerobically, producing ethanol."],
        ["Why does lactic acid build up in muscles?", "Muscles respire anaerobically when oxygen supply can't meet demand."],
        ["Why is lactic acid carried to the liver?", "The liver breaks it down using oxygen (aerobic respiration)."],
        ["Why do bakers want CO₂ but brewers want ethanol?", "CO₂ makes bread rise; ethanol makes the drink alcoholic."],
        ["Why does a fitter athlete build up less lactic acid?", "Their heart and lungs supply oxygen better, so more respiration is aerobic."],
        ["Why is anaerobic respiration only used for short periods?", "It releases little energy and lactic acid builds up."]
      ]
    },

    "transport-animals": {
      "circulation": [
        ["Explain why a double circulation suits mammals better than a single one.", "Blood returns to the heart after the lungs and is pumped again at high pressure, so oxygen reaches the body tissues fast enough for a high metabolic rate."],
        ["Why is blood pumped to the lungs at lower pressure?", "High pressure could damage the delicate lung capillaries; low pressure also allows time for gas exchange."],
        ["Why is blood in a fish slow when it reaches the body?", "It loses pressure passing through the gill capillaries and isn't pumped again before going to the body."],
        ["Trace blood from the right ventricle back to the right atrium.", "Right ventricle → pulmonary artery → lungs → pulmonary vein → left atrium → left ventricle → aorta → body → vena cava → right atrium."],
        ["Why do birds and mammals need more efficient circulation than fish?", "They keep a constant body temperature, so they respire a lot and need fast oxygen delivery."],
        ["Why does blood need to return to the heart after the lungs?", "It loses pressure in the lung capillaries, so it must be pumped again to reach the body."],
        ["Why does a fish's single circulation work for it?", "Fish are supported by water and need less energy, so lower pressure is enough."],
        ["Trace blood from the lungs to the body.", "Pulmonary vein → left atrium → left ventricle → aorta → body."],
        ["Why must oxygenated and deoxygenated blood be kept apart?", "So the body receives blood with as much oxygen as possible."],
        ["Why does high pressure in the systemic circuit help?", "Blood reaches all organs quickly, delivering oxygen and glucose fast."],
        ["Why does blood leaving the lungs have more oxygen?", "It picks up oxygen in the alveoli capillaries."]
      ],
      "heart": [
        ["Why is the left ventricle wall thicker than the right?", "It pumps blood at high pressure all round the body; the right ventricle only pumps to the nearby lungs."],
        ["What would happen if a heart valve didn't close properly?", "Blood would flow backwards, so less blood is pumped forward each beat; the heart must work harder."],
        ["Why does the heart rate rise during exercise?", "Muscles respire faster, needing more oxygen and glucose and producing more CO₂; a faster heart rate delivers more blood and removes CO₂."],
        ["Explain how a blocked coronary artery causes a heart attack.", "Heart muscle beyond the block gets no oxygen or glucose, can't respire, and dies."],
        ["How does a stent treat coronary heart disease?", "A mesh tube holds the narrowed artery open so blood can flow to the heart muscle."],
        ["Why does a fit person's heart rate return to normal faster after exercise?", "Their heart is stronger and pumps more blood per beat, and their oxygen debt is repaid quicker."],
        ["Why do atria have thinner walls than ventricles?", "They only pump blood a short distance into the ventricles."],
        ["Why does the heart need its own blood supply?", "Heart muscle respires constantly and needs oxygen and glucose."],
        ["Why is a high-fat diet a risk for coronary heart disease?", "Fatty deposits build up in coronary arteries, narrowing them."],
        ["Why does stress raise heart rate?", "Adrenaline is released, increasing heart rate."],
        ["Why is smoking a risk factor for heart disease?", "Chemicals damage artery walls and raise blood pressure."],
        ["How does exercise help prevent heart disease?", "It strengthens the heart, lowers blood pressure and helps control weight."],
        ["How is a pulse measured?", "Count beats at the wrist or neck for a set time and convert to beats per minute."],
        ["Why do ventricles contract after atria?", "So blood fills ventricles before being pumped out."]
      ],
      "vessels": [
        ["Explain how artery structure suits high pressure.", "Thick walls with muscle and elastic tissue withstand the pressure, stretching and recoiling to smooth the flow."],
        ["Why don't capillaries need thick walls?", "Blood pressure is lower there, and thin walls make diffusion of substances to cells fast."],
        ["How is blood returned up the legs to the heart?", "Leg muscles squeeze the veins, and valves stop blood flowing back down."],
        ["Why does the pulmonary vein carry oxygenated blood though it's a vein?", "Veins carry blood towards the heart; this one brings oxygenated blood from the lungs."],
        ["Why does the hepatic portal vein go from the gut to the liver, not straight to the heart?", "So the liver can process absorbed nutrients (e.g. store glucose, remove toxins) before blood reaches the rest of the body."],
        ["Why do capillaries have walls one cell thick?", "Short diffusion distance for fast exchange."],
        ["Why does blood pressure fall in capillaries?", "They are narrow and many, spreading blood over a large area."],
        ["Why are capillaries close to every cell?", "So every cell has a short diffusion distance."],
        ["Why does elastic recoil of arteries help?", "It smooths out blood flow and keeps pressure up between heartbeats."],
        ["In a section, why does an artery stay round but a vein often looks flattened?", "The artery's thick muscular, elastic wall holds its shape; the vein's thin wall collapses."],
        ["Name the blood vessels into and out of the lungs.", "Pulmonary artery in; pulmonary vein out."],
        ["Why do arteries pulse?", "Their walls stretch and recoil with each heartbeat."]
      ],
      "blood": [
        ["How is a red blood cell adapted to carry oxygen?", "Full of haemoglobin, no nucleus (more room), biconcave disc (large surface area), small and flexible to squeeze through capillaries."],
        ["Describe how a blood clot forms after a cut.", "Platelets at the wound trigger reactions that turn soluble fibrinogen into insoluble fibrin; fibrin threads form a mesh that traps red blood cells — a clot."],
        ["Why is clotting important besides stopping bleeding?", "It seals the wound, stopping pathogens entering."],
        ["What would a very high white blood cell count suggest?", "The body is fighting an infection."],
        ["Why does lack of iron make blood carry less oxygen?", "Iron is part of haemoglobin, so less iron means less haemoglobin."],
        ["Why does a lymphocyte have a large nucleus?", "To make large amounts of antibody (protein)."],
        ["Why does a phagocyte have a lobed nucleus?", "It helps the cell squeeze through capillary walls."],
        ["Why does haemoglobin release oxygen in respiring tissues?", "Oxygen concentration is low there."],
        ["Why is a scab useful?", "It seals the wound while new skin grows beneath, keeping pathogens out."],
        ["Name four substances transported by plasma.", "Glucose, amino acids, CO₂, urea, hormones, ions."],
        ["What happens to carbon dioxide in the blood?", "It is carried mostly in plasma to the lungs."],
        ["Why do people living at high altitude have more red blood cells?", "To carry enough oxygen where air has less of it."]
      ]
    },

    "transport-plants": {
      "vessels": [
        ["Explain how xylem structure suits its job.", "Long, dead, hollow cells with no end walls make continuous tubes for water flow; lignin strengthens the walls so they don't collapse and support the plant."],
        ["Why does phloem need living cells but xylem doesn't?", "Phloem actively moves sucrose and amino acids, which needs living cells; xylem just carries water pulled up by transpiration."],
        ["Why are vascular bundles arranged in a ring near the edge of a stem?", "It gives strength against bending, like a tube."],
        ["Why does the root have xylem in the centre?", "Roots must resist pulling forces; a central core is strong in tension, and water reaches it from the root hairs across the cortex."],
        ["How could you show that phloem, not xylem, carries sugars?", "Remove a ring of bark (including phloem): sugars build up above the ring and the roots below are starved, while water still reaches the leaves."],
        ["Why do xylem walls need lignin?", "To withstand tension and support the plant."],
        ["Why does phloem carry sucrose and amino acids?", "They are made in leaves but needed throughout the plant."],
        ["Where are xylem and phloem in a stem's vascular bundle?", "Xylem towards the inside, phloem towards the outside."],
        ["Why does ringing bark (removing phloem) kill a tree?", "Sugars can't reach the roots."],
        ["How can you identify xylem in a stained stem section?", "Xylem stains red with dye taken up in water."],
        ["Why are xylem vessels continuous tubes?", "Water can flow without obstruction from roots to leaves."]
      ],
      "uptake": [
        ["Explain how water moves from the soil into the xylem.", "Soil water has a higher water potential than root hair cell sap → enters by osmosis → moves cell to cell across the cortex down a water potential gradient → into the xylem."],
        ["Why do root hair cells have no chloroplasts?", "They are underground with no light, so they can't photosynthesise."],
        ["Why might a plant transplanted carelessly wilt?", "Root hairs are damaged, so the surface area for water uptake falls."],
        ["Celery in red dye shows red dots in a stem section. What are the dots?", "Xylem vessels — the dye is carried with the water."],
        ["Why do mineral ions need active transport into root hairs?", "Their concentration in the soil is usually lower than inside the cell, so they must move against the gradient."],
        ["Why do root hairs have a lower water potential than soil water?", "Their sap has dissolved substances, so water moves in by osmosis."],
        ["Why do plants struggle in salty soil?", "Soil water potential is lower, so water may leave roots."],
        ["Why does fertiliser too strong damage roots?", "Water moves out of root cells by osmosis."],
        ["Why does damaging root hairs slow water uptake?", "Surface area for absorption is reduced."],
        ["Why is the root hair cell not involved in photosynthesis?", "It's underground with no light; it has no chloroplasts."],
        ["Why does a plant need nitrate ions in the soil?", "To make amino acids and proteins."]
      ],
      "transpiration": [
        ["Explain how water is pulled up the xylem.", "Water evaporates from mesophyll cells and diffuses out of the stomata; it is replaced from the xylem, creating tension; cohesion between water molecules pulls the whole column up."],
        ["Why does transpiration increase on a windy day?", "Wind removes water vapour from around the leaf, keeping a steep concentration gradient for diffusion."],
        ["Why does transpiration decrease in humid air?", "The air already has a lot of water vapour, so the gradient between the leaf and the air is smaller."],
        ["Why does a potometer measure uptake, not transpiration exactly?", "Some water taken up is used in photosynthesis or kept in cells rather than lost from the leaves."],
        ["Why must the shoot be cut under water when setting up a potometer?", "To stop air entering the xylem and breaking the water column."],
        ["Why do stomata close when a plant is short of water?", "To reduce water loss and prevent wilting (though it also reduces CO₂ uptake)."],
        ["Why does transpiration increase on a hot day?", "Water evaporates faster and diffuses out faster."],
        ["Why do plants in dry areas have fewer stomata?", "To reduce water loss."],
        ["Why does an air bubble in a potometer move?", "The shoot takes up water, pulling the bubble along."],
        ["Why do cacti have spines instead of leaves?", "Reduced surface area for water loss."],
        ["Why does water move up a plant even though xylem cells are dead?", "Transpiration pull and cohesion of water molecules."],
        ["Why does closing stomata on a dry day reduce growth?", "Less CO₂ enters for photosynthesis."],
        ["Why do plants transpire less at night?", "Stomata close in the dark."]
      ],
      "translocation": [
        ["Explain why a growing fruit is a sink.", "It uses and stores large amounts of sucrose for growth and to make sugars and starch, so sucrose flows to it."],
        ["Why can phloem carry sucrose up and down?", "It flows from wherever it's made or released (sources) to wherever it's used or stored (sinks), which can be above or below."],
        ["In spring, why does sucrose move upwards from a potato tuber?", "The tuber breaks starch into sucrose, becoming a source that supplies new shoots before they have leaves to photosynthesise."],
        ["Why is it wrong to say phloem carries ‘glucose’?", "Glucose is converted to sucrose for transport; phloem carries sucrose and amino acids."],
        ["Aphids feed by piercing phloem. Why do they target phloem and not xylem?", "Phloem sap is rich in sucrose and amino acids; xylem carries mostly water and minerals."],
        ["Why is a root a sink?", "It can't photosynthesise and needs sucrose for respiration and growth."],
        ["Why is a seed a sink while it develops but a source when it germinates?", "While developing it stores food sent from the plant; on germination its stores are broken down and sent to the growing shoot and root."],
        ["Why do plants transport sucrose rather than starch?", "Starch is insoluble and can't be carried in solution."],
        ["Why does fruit ripen with more sugar?", "Sucrose is translocated to it from leaves."],
        ["Why is translocation different from transpiration?", "Translocation moves sugars in phloem both ways; transpiration moves water in xylem upwards."],
        ["Why does a leaf in shade become a sink?", "It can't photosynthesise enough for its own needs."]
      ]
    },

    "ecology": {
      "energy": [
        ["Why can energy not be recycled in an ecosystem like carbon?", "Energy is lost as heat at each step, which can't be captured by producers; only light from the Sun can enter food chains."],
        ["Where does the energy in a lion's muscles originally come from?", "The Sun — captured by plants in photosynthesis, passed to herbivores, then to the lion."],
        ["Why does most energy get lost as heat?", "Each organism respires to release energy for life processes, and much of it is transferred to the surroundings as heat."],
        ["Why do ecosystems with more producers support more animals?", "More photosynthesis captures more light energy, so more energy is available to pass along food chains."],
        ["Why are producers always at the start of a food chain?", "They capture energy from sunlight by photosynthesis."],
        ["Why do warm-blooded animals pass on less energy?", "They use more energy keeping body temperature constant."],
        ["Why do decomposers get energy from all trophic levels?", "They feed on dead organisms and waste from every level."],
        ["Why does a cow pass on only a small fraction of energy from grass?", "Much energy is lost in respiration, movement, faeces and heat."],
        ["Why do organisms need a constant energy supply from the Sun?", "Energy is lost as heat at every step and can't be reused."],
        ["Why do producers capture only a small fraction of sunlight?", "Much light is reflected, misses chloroplasts or is the wrong wavelength."]
      ],
      "chains": [
        ["In grass → rabbit → fox, predict what happens if rabbits die from disease.", "Foxes decrease (less food) and grass increases (less grazing)."],
        ["A tree has 5000 caterpillars on it. Why is the pyramid of numbers inverted but the biomass pyramid not?", "One tree is a single organism but huge in mass; its biomass is greater than all the caterpillars together."],
        ["Grass has 10 000 kJ; rabbits get 1000 kJ. Find the efficiency and explain the loss.", "1000 ÷ 10 000 × 100 = 10%. The rest is lost in respiration (heat), uneaten parts and faeces."],
        ["Why are there few top predators in an ecosystem?", "Only a small fraction of energy reaches the top trophic level, so it can support only a few animals."],
        ["Why is it more sustainable to grow crops for people than for livestock?", "Each step loses about 90% of energy; eating plants directly removes a step, feeding more people from the same land."],
        ["Why can an omnivore be at two trophic levels?", "It eats plants (primary consumer) and animals (secondary or higher consumer)."],
        ["Why is a food web more realistic than a food chain?", "Most animals eat more than one food and are eaten by more than one predator."],
        ["Why might removing a predator cause a crash in plant numbers?", "Herbivores increase without control and overeat the plants."],
        ["Why do pyramids of biomass usually get narrower towards the top?", "Energy is lost at each level, so less biomass can be supported."],
        ["In a food web, why does losing one species affect many others?", "Species are linked by feeding relationships."],
        ["10 000 kJ in grass → 100 kJ in foxes via rabbits. How much in rabbits roughly?", "About 1000 kJ (10% passed on at each level)."],
        ["Why does eating plants feed more people from the same land?", "Less energy is lost, because one trophic level is skipped."],
        ["Why might a single oak tree support many caterpillars?", "One large producer has lots of biomass and energy for many small consumers."]
      ],
      "cycles": [
        ["Explain how carbon in a plant can end up back in the air.", "The plant respires; or it's eaten and the animal respires; or it dies and decomposers respire; or it's burned — all release CO₂."],
        ["Why do decomposers matter in both the carbon and nitrogen cycles?", "They break down dead matter and waste, releasing CO₂ (carbon) and ammonium ions (nitrogen) back for reuse."],
        ["Why do farmers plant legumes like clover in rotation?", "Nitrogen-fixing bacteria in their root nodules add nitrogen compounds to the soil, acting as natural fertiliser."],
        ["Why is waterlogged soil bad for the nitrogen content?", "Without oxygen, denitrifying bacteria turn nitrates into nitrogen gas, which is lost to the air."],
        ["Why does ploughing (adding air to soil) help nitrification?", "Nitrifying bacteria need oxygen to turn ammonium into nitrates."],
        ["How do fossil fuels link to the carbon cycle?", "They are carbon from organisms that died long ago and didn't decompose; burning them returns that carbon as CO₂ much faster than it's removed."],
        ["Why can't plants use nitrogen gas directly?", "N₂ is very unreactive; plants need it as nitrate ions."],
        ["Why do root nodules help legumes grow in poor soil?", "Bacteria in them fix nitrogen, providing nitrogen compounds."],
        ["Trace a nitrogen atom from the air into an animal's protein.", "Fixed to ammonium by bacteria → nitrate → absorbed by plant → made into protein → eaten by animal."],
        ["Why does increased CO₂ contribute to climate change?", "It enhances the greenhouse effect."],
        ["Why do denitrifying bacteria thrive in waterlogged soil?", "There is little oxygen, which suits these anaerobic bacteria."],
        ["Why is it important to preserve forests for the carbon cycle?", "Trees remove CO₂ by photosynthesis and store carbon."],
        ["Why does photosynthesis lower atmospheric CO₂ during the day?", "Plants take in CO₂ faster than they release it in respiration."]
      ],
      "populations": [
        ["Why is there a lag phase when yeast is added to sugar solution?", "Few cells are present and they are adjusting (making enzymes), so numbers grow slowly at first."],
        ["Explain the exponential phase.", "Plenty of food and space and little waste: birth rate is much higher than death rate, so numbers double repeatedly."],
        ["Why does a population enter the death phase in a flask?", "Food runs out and toxic waste (e.g. ethanol) builds up, so death rate exceeds birth rate."],
        ["Why doesn't a wild population keep growing exponentially?", "Limiting factors — food, space, predators, disease — increase the death rate until it matches the birth rate."],
        ["Predict what happens to prey if predator numbers rise.", "Prey numbers fall as more are eaten; then predators decline from lack of food, and prey recover — the cycle repeats."],
        ["Why do predator numbers peak after prey numbers?", "Predators take time to reproduce after food becomes plentiful."],
        ["Why does the human population still grow?", "Better food supply, medicine and hygiene have lowered death rates."],
        ["Why does disease increase in crowded populations?", "Pathogens spread more easily between individuals."],
        ["What happens in the stationary phase in terms of births and deaths?", "Births equal deaths, so numbers stay constant."],
        ["Why might a population crash after reaching its peak?", "Food runs out or disease spreads, and death rate rises sharply."],
        ["Give two factors that might cause the death phase in a yeast culture.", "Sugar runs out and toxic alcohol builds up."],
        ["Why do populations of rabbits rise and fall with fox numbers?", "More rabbits feed more foxes; more foxes then eat more rabbits, so rabbit numbers fall."]
      ]
    },

    "human-influences": {
      "food": [
        ["Explain how pesticides increase crop yield but can harm ecosystems.", "They kill pests that eat crops, but may kill harmless insects (like pollinators) and build up in food chains."],
        ["Why do monocultures help pests spread?", "One crop over a large area means lots of food for that pest and little biodiversity to include its predators."],
        ["Give two arguments for and against intensive livestock farming.", "For: cheap food, efficient use of land. Against: disease spreads fast, poor welfare, overuse of antibiotics, pollution."],
        ["Why can famine happen even when the world produces enough food?", "Food is unequally distributed; poverty, war, and transport problems stop it reaching people."],
        ["How does selective breeding improve food production?", "Choosing and breeding plants or animals with high yields or disease resistance over generations increases output."],
        ["Why does an increasing population cause food shortages?", "Demand rises faster than food production."],
        ["Why can droughts or floods cause famine?", "Crops fail and livestock die."],
        ["Why can poverty cause famine?", "People can't afford food even when it's available."],
        ["Why might insecticides harm predators like birds?", "They build up in food chains."],
        ["Why does intensive farming increase disease risk?", "Animals in close contact spread pathogens easily."],
        ["Why do monocultures reduce biodiversity?", "Large areas grow only one species, removing habitats."],
        ["Why might food prices rise during a drought?", "Lower harvests reduce supply."]
      ],
      "habitats": [
        ["Explain how deforestation can cause local flooding.", "Without trees fewer roots absorb water and less is transpired; soil is washed into rivers, silting them up, so water runs off quickly and floods."],
        ["Why does deforestation reduce local rainfall?", "Fewer trees transpire, so less water vapour enters the air to form clouds."],
        ["Why does losing one species affect others in a food web?", "Animals that ate it lose food, and its prey may increase, disrupting the whole web."],
        ["Why does biodiversity matter for humans?", "It provides food, medicines and genes for breeding, and stable ecosystems that clean water and air."],
        ["Why does clearing forest raise CO₂ levels in two ways?", "Fewer trees remove CO₂ by photosynthesis, and burning or decomposing wood releases CO₂."],
        ["Why does deforestation reduce oxygen production?", "Fewer trees carry out photosynthesis."],
        ["Why does deforestation lead to extinctions?", "Many species depend on the forest for food and shelter."],
        ["Why does deforestation increase flooding downstream?", "Without trees, water runs off quickly into rivers instead of soaking in."],
        ["Why does the soil become infertile after deforestation?", "Nutrients are leached and soil is eroded."],
        ["Why does burning forest add CO₂ quickly?", "Combustion releases carbon stored in the wood."],
        ["Why do roads through forests harm wildlife?", "They split habitats and cause deaths from traffic."]
      ],
      "pollution": [
        ["Explain why fish die in eutrophication even though algae make oxygen.", "When algae and plants die, decomposing bacteria multiply and use up the dissolved oxygen in aerobic respiration faster than it is replaced."],
        ["Why are microplastics a problem in food chains?", "Small animals eat them, and they and attached toxins pass up the chain, building up in larger animals."],
        ["Explain the enhanced greenhouse effect.", "Extra CO₂ and methane absorb more of the infrared emitted by the Earth and re-emit it back, so more heat is trapped and temperatures rise."],
        ["How could sewage entering a river cause the same effect as fertiliser runoff?", "Sewage adds nitrates and phosphates (nutrients), causing an algal bloom and then eutrophication."],
        ["Why is methane from cattle and landfill important?", "Methane is a powerful greenhouse gas, trapping much more heat per molecule than CO₂."],
        ["Why do algae grow quickly in eutrophication?", "Fertiliser adds nitrates and phosphates."],
        ["Why does decomposition use up oxygen in eutrophication?", "Bacteria respire aerobically as they break down dead organisms."],
        ["Why do plastics last so long?", "Decomposers can't break them down."],
        ["Why is climate change a threat to food supply?", "Changes in weather patterns affect crop growth."],
        ["How does the enhanced greenhouse effect differ from the natural one?", "Extra greenhouse gases from humans trap more heat, warming Earth more."],
        ["Why does fertiliser runoff mainly happen after heavy rain?", "Rain washes fertiliser off fields into rivers."],
        ["Why does acid rain harm lakes?", "It lowers pH, killing fish and other organisms."]
      ],
      "conservation": [
        ["Explain how fishing quotas and net mesh sizes conserve fish stocks.", "Quotas limit the total catch; larger mesh lets young fish escape so they can grow and breed, keeping the population sustainable."],
        ["Why is a small, isolated population at greater risk of extinction?", "It has little genetic variation, so it is less able to adapt to disease or environmental change."],
        ["How do zoos use artificial insemination in captive breeding?", "Sperm can be moved between zoos, increasing genetic variation without moving animals."],
        ["Give three reasons for conserving endangered species.", "Maintain biodiversity and food webs, possible medicines or useful genes, ecotourism, and ethical reasons."],
        ["Why is replanting forests described as sustainable?", "Trees are replaced as fast as they're cut, so the resource doesn't run out."],
        ["Why does a larger mesh size help fish stocks?", "Young fish escape and grow to breed."],
        ["Why does genetic variation matter for survival?", "It gives a better chance that some individuals can survive changes."],
        ["Why is habitat protection better than captive breeding?", "It protects whole ecosystems, not just one species."],
        ["Why might seed banks be important in the future?", "They store genetic material if wild plants become extinct."],
        ["Why do conservation programmes face problems?", "Cost, conflict with local people's needs and illegal hunting."],
        ["Why do conservationists reintroduce species into the wild?", "To restore populations and ecosystems."]
      ]
    },

    "biotechnology": {
      "microbes": [
        ["Why do bacteria multiply so fast?", "They reproduce asexually by binary fission, dividing every 20 minutes or so in good conditions."],
        ["Why can bacteria read a human insulin gene?", "All organisms use the same genetic code, so the bacterium's ribosomes translate the human gene into the same protein."],
        ["Why are plasmids useful in genetic engineering?", "They are small rings of DNA that are easy to remove, cut, insert a gene into, and put back into bacteria."],
        ["Why are there fewer ethical concerns about using bacteria than animals?", "Bacteria have no nervous system and don't feel pain."],
        ["Why can a gene from a human work in a bacterium?", "The genetic code is the same in all organisms."],
        ["Why do bacteria contain plasmids?", "Plasmids carry extra genes, such as for antibiotic resistance."],
        ["Why can large quantities of product be made from bacteria?", "They multiply rapidly in fermenters."],
        ["Why are bacteria used to make enzymes for industry?", "They grow fast, are easy to control and their enzymes can be harvested."],
        ["Why are bacteria able to make complex molecules?", "They have the enzymes needed to make proteins following DNA instructions."],
        ["Why do bacteria have few ethical issues compared with animals?", "They don't feel pain and are not conscious."]
      ],
      "biotech": [
        ["Explain how pectinase increases juice yield.", "It breaks down pectin in plant cell walls, so cells break open more easily, releasing more juice and making it clearer."],
        ["Why do biological washing powders work at low temperatures?", "Their enzymes work best around 30–40 °C, so stains are digested without hot water — saving energy."],
        ["Why must a fermenter be sterilised first?", "Other microorganisms would compete for nutrients and could contaminate or spoil the product."],
        ["Why does a fermenter need a water jacket?", "Respiring microorganisms release heat; cooling keeps the temperature at the enzymes' optimum and prevents denaturing."],
        ["Why is sterile air pumped into a fermenter making penicillin?", "The fungus respires aerobically and needs oxygen to grow and make the product."],
        ["Why is lactose-free milk useful?", "People who are lactose intolerant can't digest lactose; lactase breaks it into glucose and galactose."],
        ["Why must yeast be kept warm in bread-making?", "Its enzymes work best at warm temperatures."],
        ["Why is a fermenter pH monitored?", "Enzymes work best at an optimum pH."],
        ["Why are nutrients added to a fermenter?", "To supply the microorganisms with raw materials for growth."],
        ["Why does a fermenter get hot?", "Microorganisms respire, releasing heat."],
        ["Why is penicillin extracted near the end of fermentation?", "It is made mainly once the fungus has grown and nutrients run low."],
        ["Why are biological washing powders less effective at high temperatures?", "Their enzymes denature."],
        ["Why does yeast stop working in very sweet dough?", "Too much sugar draws water out of yeast cells by osmosis."]
      ],
      "gm": [
        ["Why must the same restriction enzyme cut both the gene and the plasmid?", "It leaves matching sticky ends, so the gene and plasmid bases pair up and can be joined by ligase."],
        ["Why is insulin from GM bacteria better than insulin from animals?", "It is identical to human insulin (fewer reactions), can be made in large amounts cheaply, and avoids using animals."],
        ["How does an insect-resistant GM crop increase yield?", "It makes a toxin that kills insects eating it, so less of the crop is damaged and less pesticide is needed."],
        ["Why is golden rice useful?", "It has genes added to make vitamin A precursor, helping prevent deficiency in places where rice is the main food."],
        ["Give one ecological concern about herbicide-resistant crops.", "Farmers may spray more herbicide, harming wild plants; genes could transfer to weeds, making ‘superweeds’."],
        ["Put in order: insert plasmid into bacteria, cut with restriction enzyme, grow in fermenter, join with ligase.", "Cut with restriction enzyme → join with ligase → insert into bacteria → grow in fermenter."],
        ["Why do sticky ends allow genes to be joined?", "Complementary bases pair up, so the gene fits into the cut plasmid."],
        ["Why might GM crops reduce biodiversity?", "Herbicides kill weeds, removing food and habitat for insects and birds."],
        ["Why do some people worry about eating GM food?", "Concerns about unknown long-term effects on health."],
        ["Why might seed costs rise with GM crops?", "Companies own patents, and farmers may need to buy new seed every year."],
        ["How is genetic modification different from selective breeding?", "It transfers specific genes directly, even between species, in one generation."],
        ["Why is human insulin from bacteria less likely to cause allergic reactions?", "It is identical to the insulin humans make."],
        ["Why might GM herbicide-resistant crops increase herbicide use?", "Farmers can spray more freely without harming the crop."]
      ]
    },

    "inheritance": {
      "genes": [
        ["Explain how a change in one DNA base can change a protein.", "It can change a triplet and so one amino acid; the protein may fold differently, changing its shape and function."],
        ["Why does DNA need mRNA to make proteins?", "DNA is too large to leave the nucleus, but proteins are made at ribosomes in the cytoplasm; mRNA carries a copy of the gene out."],
        ["A gene has 300 bases. How many amino acids does it code for?", "300 ÷ 3 = 100 (each triplet codes for one amino acid)."],
        ["Every body cell has the insulin gene. Why do only pancreas cells make insulin?", "Cells only express the genes they need; in other cells the insulin gene is switched off."],
        ["Explain why there's always a 50% chance of a boy.", "Mother (XX) always gives X; father (XY) gives X or Y equally. Punnett square: 2 XX : 2 XY."],
        ["A cat has 38 chromosomes in body cells. How many in its eggs?", "19 — gametes are haploid."],
        ["Why does each cell express only some genes?", "Only the genes for proteins it needs are switched on."],
        ["How many bases code for one amino acid?", "Three."],
        ["Why does a woman pass an X chromosome to every child?", "Her eggs all contain an X chromosome."],
        ["Why do mutations sometimes have no effect?", "The protein made may be the same or work as well."],
        ["Why do mRNA molecules leave the nucleus?", "Ribosomes are in the cytoplasm."],
        ["How many chromosomes in a human zygote, and why?", "46 — 23 from each gamete."],
        ["Why do brother and sister share only some alleles?", "Each inherits a random half of each parent's alleles."]
      ],
      "mitosis": [
        ["Why must chromosomes be copied before mitosis?", "So each new cell gets a complete set and the chromosome number doesn't halve."],
        ["Why are cells produced by mitosis genetically identical?", "Each chromosome is copied exactly, and one copy of every chromosome goes into each new cell."],
        ["Why might stem cells be used to treat diseases?", "They can divide and become specialised cells to replace damaged ones — e.g. new blood cells from bone marrow stem cells."],
        ["Why is mitosis used in asexual reproduction?", "It produces genetically identical offspring from one parent, without gametes."],
        ["Give two situations where mitosis happens in your body today.", "Repairing a cut in the skin, replacing red blood cells, growth of hair."],
        ["Why do skin cells divide by mitosis often?", "To replace cells constantly lost from the surface."],
        ["What happens if mitosis is uncontrolled?", "Cells divide too much, causing a tumour (cancer)."],
        ["Why is mitosis important in plant growth?", "It adds new cells in root and shoot tips."],
        ["Why are embryonic stem cells more useful than adult ones?", "They can develop into any type of cell."],
        ["Why do people worry about using embryonic stem cells?", "Ethical concerns about destroying embryos."],
        ["How many chromosomes are in a skin cell made by mitosis?", "46."],
        ["Why might skin cancer develop from too much UV?", "UV damages DNA, causing uncontrolled mitosis."]
      ],
      "meiosis": [
        ["Explain why meiosis is called reduction division.", "It halves the chromosome number from diploid to haploid, so gametes have one of each pair."],
        ["What would happen if gametes were made by mitosis?", "They would be diploid, so the zygote would have double the chromosome number, doubling every generation."],
        ["How many genetically different gametes can an organism with 3 chromosome pairs make by independent assortment?", "2³ = 8."],
        ["Explain two sources of variation in sexual reproduction.", "Meiosis shuffles chromosomes randomly into gametes; random fertilisation combines any sperm with any egg."],
        ["Compare the daughter cells of mitosis and meiosis.", "Mitosis: 2 diploid, genetically identical cells. Meiosis: 4 haploid, genetically different cells."],
        ["Why do gametes need half the chromosome number?", "So the zygote has the correct diploid number after fertilisation."],
        ["Why is meiosis important for evolution?", "It produces variation, which natural selection acts on."],
        ["How many chromosomes are in a human egg?", "23."],
        ["Why do siblings look different but similar?", "They get different combinations of their parents' alleles."],
        ["Why does random fertilisation add variation?", "Any sperm can fuse with any egg."],
        ["Why do gametes from one person differ?", "Each gets a different random mix of chromosomes."]
      ],
      "crosses": [
        ["Cross Tt × Tt (T = tall). What fraction of offspring are tall, and what fraction of the tall ones are heterozygous?", "3/4 are tall (TT, Tt, Tt); of the tall ones, 2/3 are heterozygous."],
        ["Brown eyes (B) are dominant. Two brown-eyed parents have a blue-eyed child. Explain.", "The child must be bb, so each parent passed on a b: both parents are Bb carriers."],
        ["How would you find out if a tall plant is TT or Tt?", "Test cross with a short (tt) plant: all tall offspring → TT; about half short → Tt."],
        ["Parents with blood groups A (IᴬIᴼ) and B (IᴮIᴼ). What groups can their children have?", "AB, A, B and O — 25% each."],
        ["A carrier woman (XᴮXᵇ) and a normal man (XᴮY). What is the chance a son is colour-blind?", "50% of sons: sons get Y from the father and either Xᴮ or Xᵇ from the mother."],
        ["Why can a man not pass colour blindness to his son?", "He passes his Y chromosome to his son, and the allele is on the X."],
        ["Why might a family of four children from Tt × Tt all be tall?", "3 : 1 is a probability for each child; with small numbers, actual results often differ from the ratio."],
        ["Two heterozygous parents: what's the chance of a homozygous recessive child?", "25% (1 in 4)."],
        ["Group O parents IᴼIᴼ × IᴼIᴼ. What groups can their children have?", "Only O."],
        ["A tall plant crossed with a short one gives half tall, half short. What was the tall parent?", "Heterozygous (Tt)."],
        ["Why do ratios not always match predictions?", "Fertilisation is random; ratios are probabilities."],
        ["A colour-blind man (XᵇY) and a non-carrier woman (XᴮXᴮ). Children?", "All sons unaffected; all daughters carriers."],
        ["Why can a person with blood group A have genotype IᴬIᴬ or IᴬIᴼ?", "Iᴬ is dominant over Iᴼ."],
        ["Two carrier parents for cystic fibrosis (Ff × Ff). Chance of an affected child?", "25%."]
      ]
    },

    "reproduction": {
      "asexual": [
        ["Why do farmers grow potatoes from tubers rather than seeds?", "Tubers grow faster with stored food, and the new plants are identical to a good parent, keeping its desirable features."],
        ["Why could a disease wipe out a whole field of cloned bananas?", "They are genetically identical, so if one is susceptible, all are; there's no variation for some to survive."],
        ["Why is asexual reproduction an advantage for bacteria?", "One cell can rapidly produce huge numbers to colonise a good environment, without needing a partner."],
        ["Two clones grown in different conditions look different. Explain.", "They have identical genes, so the differences must be caused by the environment, such as light or nutrients."],
        ["Is a strawberry runner asexual? Explain.", "Yes — a new plantlet grows from one parent by mitosis, with no gametes, so it is genetically identical."],
        ["Why is asexual reproduction quick?", "Only one parent is needed and no gametes or mating."],
        ["Why do gardeners take cuttings?", "To produce identical plants with desired features."],
        ["Why is lack of variation a problem?", "All offspring are vulnerable to the same disease or change."],
        ["Why can asexual reproduction be useful in a stable environment?", "Offspring inherit features already suited to it."],
        ["Is a bacterium dividing an example of mitosis?", "No — bacteria divide by binary fission, but it is still asexual."],
        ["Why do bacteria multiply so fast by asexual reproduction?", "Binary fission is quick and needs no mate."]
      ],
      "sexual": [
        ["Why must human gametes have 23 chromosomes, not 46?", "At fertilisation two gametes fuse; 23 + 23 = 46 keeps the number constant across generations."],
        ["Explain why sexual reproduction helps a species survive environmental change.", "Offspring vary, so some may have features that let them survive the change and pass on their alleles."],
        ["Why is it wrong to say fertilisation is ‘when the sperm meets the egg’?", "Fertilisation is the fusion of the two gamete nuclei, not just the cells touching."],
        ["Give a disadvantage of sexual reproduction for an organism in a stable environment.", "It is slower, needs a mate, and may break up successful combinations of genes."],
        ["A zygote of a species has 24 chromosomes. How many are in its gametes and its skin cells?", "Gametes 12 (haploid); skin cells 24 (diploid, made by mitosis from the zygote)."],
        ["Why does sexual reproduction take longer?", "Gametes must be made and brought together."],
        ["Why does variation help natural selection?", "Some individuals may be better adapted and survive."],
        ["Why is a mate needed for sexual reproduction?", "Two gametes from two parents fuse."],
        ["Why might sexual reproduction need more energy?", "Gametes, flowers or courtship need energy."],
        ["How does fertilisation restore the diploid number?", "Two haploid gametes each give one set of chromosomes."],
        ["Why are many eggs produced by fish?", "Most are eaten or not fertilised, so many are needed for some to survive."]
      ],
      "plants": [
        ["Explain how a feathery stigma suits a wind-pollinated flower.", "It has a large surface area and hangs outside the flower to catch pollen grains blowing past."],
        ["Why do wind-pollinated plants produce huge amounts of pollen?", "Pollination by wind is random; most pollen never reaches a stigma, so lots is needed for some to succeed."],
        ["Why is cross-pollination better for a species than self-pollination?", "It combines genes from two plants, increasing variation and the chance of adapting to change."],
        ["Explain why pollination and fertilisation are different.", "Pollination moves pollen from anther to stigma; fertilisation is the later fusion of the male nucleus with the egg nucleus inside the ovule, after a pollen tube grows."],
        ["Why does a seed need water to germinate?", "Water makes the seed swell and activates enzymes that break down stored food for growth."],
        ["In the germination experiment, why is tube B (damp, 20 °C) the control?", "It has all three conditions; comparing other tubes to it shows the effect of removing one condition at a time."],
        ["Why do insect-pollinated flowers have nectar?", "To attract insects."],
        ["Why do wind-pollinated flowers have no petals?", "They don't need to attract insects."],
        ["Why does a pollen tube grow down the style?", "To carry the male nucleus to the ovule."],
        ["Why does a seed need oxygen to germinate?", "For aerobic respiration to release energy."],
        ["Why does a seed need a suitable temperature?", "Enzymes work best at the right temperature."],
        ["Why does self-pollination reduce variation?", "Gametes come from the same plant."],
        ["Why do seeds need to be dispersed?", "To reduce competition with the parent and colonise new areas."]
      ],
      "humans": [
        ["Explain how the placenta is adapted for exchange.", "Large surface area (villi), thin barrier between the two bloods, and a good blood supply on both sides keep diffusion fast."],
        ["Why do the mother's and fetus's blood not mix in the placenta?", "Mixing could cause harm from different blood groups and high maternal pressure; substances cross by diffusion instead."],
        ["Why does smoking during pregnancy lower the baby's birth weight?", "Nicotine and carbon monoxide cross the placenta; CO reduces oxygen carried, slowing growth."],
        ["Why are millions of sperm released when only one fertilises the egg?", "Most die or get lost on the journey; many are needed for one to reach the egg in the oviduct."],
        ["Trace the path of a sperm from the testis to the site of fertilisation.", "Testis → sperm duct → urethra → vagina → cervix → uterus → oviduct."],
        ["Why is amniotic fluid important?", "It cushions the fetus against bumps and allows it to move."],
        ["Why does the placenta have a large surface area?", "For fast exchange of substances."],
        ["Why does alcohol harm a developing fetus?", "It crosses the placenta and damages development."],
        ["Why does the egg cell not swim?", "It's moved along the oviduct by cilia and muscle contractions."],
        ["Why is breast milk good for babies?", "It contains nutrients and antibodies."],
        ["Why does a fetus need a placenta?", "It can't feed or breathe itself, so it gets oxygen and nutrients from the mother."],
        ["Why does the placenta also make hormones?", "It produces progesterone to maintain pregnancy."]
      ],
      "hormones": [
        ["Explain how FSH, oestrogen and LH work together to cause ovulation.", "FSH makes a follicle develop; the follicle releases oestrogen, which builds the lining; peak oestrogen triggers an LH surge, which causes ovulation."],
        ["Why does progesterone stay high during pregnancy?", "The corpus luteum (then the placenta) keeps making it, which keeps the uterus lining thick so the embryo can develop."],
        ["On a hormone graph, how do you find the day of ovulation?", "Find the LH peak — about day 14."],
        ["Why does the uterus lining thicken each month?", "To be ready to receive an embryo if fertilisation happens."],
        ["What causes menstruation?", "Without pregnancy the corpus luteum breaks down, progesterone falls, and the lining is shed."],
        ["Why do boys' voices deepen at puberty?", "Testosterone from the testes causes secondary sexual characteristics, including growth of the larynx."],
        ["Why does oestrogen rise in the first half of the cycle?", "The developing follicle produces it."],
        ["Why does progesterone fall at the end of the cycle?", "The corpus luteum breaks down if there is no pregnancy."],
        ["Why does puberty start?", "The pituitary releases hormones that trigger the testes or ovaries to make sex hormones."],
        ["Why might the timing of ovulation vary?", "Hormone levels vary between people and cycles."],
        ["Why does LH surge mid-cycle?", "High oestrogen stimulates the pituitary to release LH."],
        ["Why does the menstrual cycle stop during pregnancy?", "High progesterone prevents FSH release and keeps the lining."]
      ],
      "stis": [
        ["Explain why people with AIDS die of other infections.", "HIV destroys lymphocytes, so fewer antibodies are made; the body can't fight infections like TB or pneumonia, which then cause death."],
        ["Why is it hard to make a vaccine against HIV?", "HIV keeps changing its surface proteins (antigens), so antibodies and memory cells don't recognise new forms."],
        ["Why might someone spread HIV without knowing?", "After infection there may be no symptoms for years."],
        ["Why does using a condom reduce STI spread?", "It is a barrier that stops the exchange of semen, vaginal fluids and blood containing pathogens."],
        ["Why can chlamydia be treated with antibiotics but HIV can't?", "Chlamydia is a bacterium; HIV is a virus, which antibiotics don't affect."],
        ["Why do antiretroviral drugs extend lives?", "They slow HIV reproduction, protecting the immune system."],
        ["Why does testing help control HIV?", "People who know they have it can be treated and avoid spreading it."],
        ["Why can a mother pass HIV to her baby?", "Through the placenta, birth or breast milk."],
        ["Why does sharing needles spread HIV?", "Infected blood passes between people."],
        ["Why does HIV infection lead to AIDS years later?", "Lymphocyte numbers gradually drop until the immune system fails."],
        ["Why do some STIs go unnoticed?", "They may have no symptoms early on."]
      ],
      "parts-quiz": [
        ["Why are the anthers of a grass flower outside the flower?", "So the wind can easily blow the pollen away."],
        ["Why does the sperm duct join the urethra?", "Sperm travel from the testes along the sperm duct, mixing with fluids, and leave through the urethra."],
        ["Why is the uterus wall muscular?", "It contracts strongly during birth to push the baby out."],
        ["Why are the testes outside the body in the scrotum?", "Sperm production works best a few degrees below body temperature."],
        ["What happens to the petals, stamens and ovary after fertilisation?", "Petals and stamens wither and fall; the ovary becomes the fruit containing seeds."],
        ["Why is the cervix a ring of muscle?", "To keep the baby in the uterus until birth, then dilate."],
        ["Why does the oviduct have cilia?", "To move the egg towards the uterus."],
        ["Why do testes need to be cooler than the body?", "Sperm production works best below body temperature."],
        ["Why does the ovary of a flower become a fruit?", "It protects the seeds and helps dispersal."],
        ["Why does the prostate gland add fluid?", "To give sperm nutrients and a medium to swim in."],
        ["Why are anthers of insect-pollinated flowers inside the flower?", "So insects brush against them when visiting."]
      ]
    },

    "variation": {
      "variation": [
        ["Is human height continuous or discontinuous? Explain the causes.", "Continuous: a range of values, caused by many genes plus environment (diet, health)."],
        ["Why are identical twins useful for studying environmental variation?", "They have identical genes, so any differences between them must be caused by the environment."],
        ["Explain why most mutations are harmful or neutral.", "A random change in DNA usually disrupts a working protein or changes nothing important; rarely it improves a protein."],
        ["Why does ionising radiation increase the risk of cancer?", "It damages DNA, causing mutations that can make cells divide uncontrollably."],
        ["Explain why the sickle-cell allele is common in malaria regions.", "Heterozygous carriers are protected against malaria and survive to reproduce more, so the allele is selected for there."],
        ["Is tongue rolling continuous or discontinuous, and which graph would you use?", "Discontinuous (can or can't) — a bar chart with gaps between bars."],
        ["Why does sickle-cell anaemia affect oxygen transport?", "Abnormal haemoglobin makes red blood cells sickle-shaped, carrying less oxygen."],
        ["Why are mutations the source of new alleles?", "They change the DNA, producing new versions of genes."],
        ["Why do plants of the same variety vary in height in a field?", "Differences in light, water and nutrients."],
        ["Why is blood group discontinuous?", "There are only a few distinct groups, controlled by genes."],
        ["Why are heterozygotes for sickle-cell protected against malaria?", "Their red blood cells are less suitable for the malaria parasite."],
        ["Why does smoking increase mutation rates?", "Tobacco smoke contains chemical mutagens."],
        ["Why do identical twins have the same blood group?", "Blood group is determined by genes only."]
      ],
      "adaptation": [
        ["Explain how sunken stomata help a xerophyte.", "Moist air is trapped near the stomata, reducing the water vapour gradient, so less water is lost by transpiration."],
        ["Why do cacti have spines instead of leaves?", "Spines have a tiny surface area, reducing water loss, and deter animals from eating the stored water."],
        ["Why are a water lily's stomata on the upper surface?", "The lower surface is underwater; stomata on top are in contact with the air for gas exchange."],
        ["Why do hydrophytes have little xylem?", "Water surrounds them and supports them, so they need less tissue for transport and support."],
        ["Is a tan from sunbathing an adaptive feature? Explain.", "No — adaptive features are inherited; a tan is acquired during life and not passed on."],
        ["Why does a thick waxy cuticle help a cactus?", "It reduces water loss by evaporation."],
        ["Why do cacti store water in stems?", "They survive long dry periods."],
        ["Why do water lilies have large flat leaves?", "To float and absorb maximum light."],
        ["Why are hairs on xerophyte leaves helpful?", "They trap moist air, reducing water loss."],
        ["Why is camouflage an adaptive feature?", "It helps an animal avoid predators or catch prey."],
        ["Why do arctic foxes have small ears?", "Smaller surface area reduces heat loss."]
      ],
      "selection": [
        ["Explain how giraffes' long necks could have evolved by natural selection.", "Variation in neck length; longer-necked giraffes reached more food and survived to breed, passing on alleles for long necks; over generations the allele became common."],
        ["Why did dark peppered moths decrease again after clean air laws?", "Trees became lighter, so dark moths were easier for birds to see and eat; pale moths survived better."],
        ["Compare natural selection with selective breeding.", "Natural: the environment decides who survives, over long periods. Selective breeding: humans choose parents for useful features, faster."],
        ["Give one problem with selective breeding.", "Reduced genetic variation makes populations vulnerable to disease, and can cause health problems (e.g. inbreeding in dogs)."],
        ["Why doesn't natural selection create the variation it acts on?", "Variation comes from mutation and sexual reproduction; selection only decides which variants survive."],
        ["Why do bacteria evolve resistance much faster than animals evolve?", "Bacteria reproduce every 20 minutes, so many generations pass quickly for selection to act."],
        ["Why did resistant bacteria become common?", "Antibiotics killed non-resistant bacteria, so resistant ones survived and reproduced."],
        ["Why does selective breeding reduce genetic variation?", "Only individuals with desired traits are bred."],
        ["Why can selective breeding cause health problems?", "Inbreeding can increase harmful recessive alleles."],
        ["Why does natural selection take many generations?", "Changes in allele frequency happen gradually."],
        ["How do farmers select cows for more milk?", "Breed cows that produce the most milk, over many generations."],
        ["Why does natural selection need variation?", "Without differences, no individuals would be better suited to survive."]
      ]
    }
  });
})();
