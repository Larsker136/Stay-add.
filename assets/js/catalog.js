/* ==========================================================================
   stay add. — content catalog
   The single source of truth for subjects, topics and lessons. The header,
   the subject menu, search, the subject home pages and the STEM home all
   read from here.

   · To publish a lesson: add it to a topic's `lessons` with status "live"
     and an `href` (relative to the site root).
   · To add a subject: add an entry here and a folder <id>/ with an
     index.html (see README.md).
   ========================================================================== */
window.StayAdd = window.StayAdd || {};

window.StayAdd.catalog = {
  subjects: [
    {
      id: "chemistry",
      name: "Chemistry",
      syllabus: "Cambridge IGCSE 0620 / 0971",
      home: "chemistry/index.html",
      hint: "Particles, reactions and the periodic table",
      nav: [
        { id: "topics", label: "Topics", href: "chemistry/index.html#topics" },
        { id: "electrolysis", label: "Electrolysis", href: "chemistry/lessons/electrolysis.html" },
        { id: "collision-theory", label: "Collision theory", href: "chemistry/lessons/collision-theory.html" },
        { id: "naming-organic", label: "Organic naming", href: "chemistry/lessons/naming-organic.html" },
        { id: "map", label: "Syllabus map", href: "chemistry/index.html#map" }
      ],
      topics: [
        { num: 1,  id: "states-of-matter", title: "States of matter", blurb: "Solids, liquids, gases and diffusion", lessons: [] },
        { num: 2,  id: "atoms-elements-compounds", title: "Atoms, elements & compounds", blurb: "Atomic structure, isotopes and bonding", lessons: [] },
        { num: 3,  id: "stoichiometry", title: "Stoichiometry", blurb: "Formulae, equations and the mole", lessons: [] },
        {
          num: 4, id: "electrochemistry", title: "Electrochemistry", blurb: "Electrolysis and fuel cells",
          lessons: [
            {
              id: "electrolysis",
              title: "Electrolysis",
              blurb: "Why molten and dissolved ionic compounds split, and how to predict what forms at each electrode.",
              href: "chemistry/lessons/electrolysis.html",
              status: "live",
              tags: ["electrolysis", "anode", "cathode", "electrolyte", "half-equation", "electroplating", "oxidation", "reduction"]
            }
          ]
        },
        { num: 5,  id: "chemical-energetics", title: "Chemical energetics", blurb: "Exothermic and endothermic reactions", lessons: [] },
        {
          num: 6, id: "chemical-reactions", title: "Chemical reactions", blurb: "Rates, reversible reactions and redox",
          lessons: [
            {
              id: "collision-theory",
              title: "Collision theory",
              blurb: "How temperature, concentration, pressure and catalysts change the rate of reaction.",
              href: "chemistry/lessons/collision-theory.html",
              status: "live",
              tags: ["rate of reaction", "activation energy", "temperature", "concentration", "pressure", "catalyst"]
            }
          ]
        },
        { num: 7,  id: "acids-bases-salts", title: "Acids, bases & salts", blurb: "pH, neutralisation and making salts", lessons: [] },
        { num: 8,  id: "periodic-table", title: "The Periodic Table", blurb: "Groups, periods and trends", lessons: [] },
        { num: 9,  id: "metals", title: "Metals", blurb: "Reactivity series, extraction and alloys", lessons: [] },
        { num: 10, id: "environment", title: "Chemistry of the environment", blurb: "Water, fertilisers and air quality", lessons: [] },
        {
          num: 11, id: "organic", title: "Organic chemistry", blurb: "Hydrocarbons, alcohols and polymers",
          lessons: [
            {
              id: "naming-organic",
              title: "Naming organic compounds",
              blurb: "Seven steps from a drawing to an IUPAC name: main chain, group, numbering, side chains, di/tri, alphabetical order, punctuation.",
              href: "chemistry/lessons/naming-organic.html",
              status: "live",
              tags: ["naming", "alkane", "alkene", "alcohol", "carboxylic acid", "ester", "homologous series", "functional group", "isomer", "displayed formula"]
            }
          ]
        },
        { num: 12, id: "experimental", title: "Experimental techniques", blurb: "Separation, chromatography and tests", lessons: [] }
      ]
    },
    {
      id: "physics",
      name: "Physics",
      syllabus: "Cambridge IGCSE 0625 / 0972",
      home: "physics/index.html",
      hint: "Motion, energy, waves and fields",
      nav: [
        { id: "topics", label: "Topics", href: "physics/index.html#topics" },
        { id: "refraction", label: "Labs", href: "physics/labs/refraction.html" },
        { id: "quiz", label: "Daily six", href: "physics/index.html#quiz-sec" }
      ],
      topics: [
        { num: 1, id: "motion-forces-energy", title: "Motion, forces & energy", blurb: "Speed–time graphs, momentum, moments, work and power", lessons: [] },
        { num: 2, id: "thermal", title: "Thermal physics", blurb: "Kinetic particle model, gas pressure, specific heat capacity", lessons: [] },
        {
          num: 3, id: "waves", title: "Waves, light & sound", blurb: "Refraction, lenses, the electromagnetic spectrum, sound",
          lessons: [
            {
              id: "refraction",
              title: "Refraction",
              blurb: "Snell’s law as a lab: aim a laser into water, glass or diamond and read the angles.",
              href: "physics/labs/refraction.html",
              status: "live",
              tags: ["refraction", "snell", "refractive index", "critical angle", "light", "normal"]
            }
          ]
        },
        { num: 4, id: "electricity-magnetism", title: "Electricity & magnetism", blurb: "Circuits, Ohm’s law, the motor effect, transformers", lessons: [] },
        { num: 5, id: "nuclear", title: "Nuclear physics", blurb: "The nuclear atom, radioactive decay, half-life", lessons: [] },
        { num: 6, id: "space", title: "Space physics", blurb: "The Solar System, orbits, stars and the Universe", lessons: [] }
      ]
    },
    {
      id: "biology",
      name: "Biology",
      syllabus: "Cambridge IGCSE 0610 / 0970",
      home: "biology/index.html",
      hint: "Cells, body systems, genes and ecosystems",
      nav: [
        { id: "topics", label: "Topics", href: "biology/index.html#topics" },
        { id: "enzymes", label: "Enzymes", href: "biology/lessons/enzymes.html" },
        { id: "reproduction", label: "Reproduction", href: "biology/lessons/reproduction.html" },
        { id: "inheritance", label: "Inheritance", href: "biology/lessons/inheritance.html" },
        { id: "method", label: "How it works", href: "biology/index.html#method" }
      ],
      // strands group the 21 topics on the Biology home
      strands: [
        { id: "cells", title: "Cells & molecules" },
        { id: "transport", title: "Nutrition & transport" },
        { id: "body", title: "The human body" },
        { id: "genes", title: "Reproduction & inheritance" },
        { id: "eco", title: "Ecology & biotechnology" }
      ],
      topics: [
        { num: 1,  strand: "cells", id: "classification", title: "Characteristics & classification", blurb: "MRS GREN, keys and the five kingdoms", lessons: [] },
        { num: 2,  strand: "cells", id: "organisation", title: "Organisation of the organism", blurb: "Cells, tissues, organs and magnification", lessons: [] },
        { num: 3,  strand: "cells", id: "movement-in-out", title: "Movement into & out of cells", blurb: "Diffusion, osmosis and active transport", lessons: [] },
        { num: 4,  strand: "cells", id: "biological-molecules", title: "Biological molecules", blurb: "Carbohydrates, fats, proteins and food tests", lessons: [] },
        {
          num: 5, strand: "cells", id: "enzymes-topic", title: "Enzymes", blurb: "Biological catalysts, temperature and pH",
          lessons: [
            {
              id: "enzymes",
              title: "Enzymes",
              blurb: "Why each enzyme fits one substrate, and how temperature and pH change its active site.",
              href: "biology/lessons/enzymes.html",
              status: "live",
              tags: ["enzyme", "active site", "substrate", "lock and key", "denatured", "optimum", "temperature", "pH", "catalyst", "amylase", "protease", "lipase"]
            }
          ]
        },
        { num: 6,  strand: "transport", id: "plant-nutrition", title: "Plant nutrition", blurb: "Photosynthesis and limiting factors", lessons: [] },
        { num: 7,  strand: "transport", id: "human-nutrition", title: "Human nutrition", blurb: "Diet, digestion and absorption", lessons: [] },
        { num: 8,  strand: "transport", id: "transport-plants", title: "Transport in plants", blurb: "Xylem, phloem and transpiration", lessons: [] },
        { num: 9,  strand: "transport", id: "transport-animals", title: "Transport in animals", blurb: "The heart, blood vessels and blood", lessons: [] },
        { num: 10, strand: "body", id: "disease-immunity", title: "Diseases & immunity", blurb: "Pathogens, defences and antibodies", lessons: [] },
        { num: 11, strand: "body", id: "gas-exchange", title: "Gas exchange in humans", blurb: "Lungs, alveoli and breathing", lessons: [] },
        { num: 12, strand: "body", id: "respiration", title: "Respiration", blurb: "Aerobic and anaerobic respiration", lessons: [] },
        { num: 13, strand: "body", id: "excretion", title: "Excretion in humans", blurb: "The kidneys and the liver", lessons: [] },
        { num: 14, strand: "body", id: "coordination", title: "Coordination & response", blurb: "Nerves, hormones and homeostasis", lessons: [] },
        { num: 15, strand: "body", id: "drugs", title: "Drugs", blurb: "Medicinal drugs and antibiotics", lessons: [] },
        {
          num: 16, strand: "genes", id: "reproduction-topic", title: "Reproduction", blurb: "Asexual and sexual reproduction in plants and humans",
          lessons: [
            {
              id: "reproduction",
              title: "Reproduction",
              blurb: "16.1–16.6: clones and new mixes, flowers, pollination and germination, sperm, egg and pregnancy, the 28-day cycle, and HIV.",
              href: "biology/lessons/reproduction.html",
              status: "live",
              tags: ["asexual", "sexual", "gamete", "zygote", "fertilisation", "haploid", "diploid", "pollination", "flower", "anther", "stigma", "ovule", "sperm", "egg", "placenta", "menstrual cycle", "oestrogen", "progesterone", "testosterone", "FSH", "LH", "germination", "STI", "HIV", "AIDS"]
            }
          ]
        },
        {
          num: 17, strand: "genes", id: "inheritance-topic", title: "Inheritance", blurb: "Genes, cell division and genetic crosses",
          lessons: [
            {
              id: "inheritance",
              title: "Inheritance",
              blurb: "17.1–17.4: genes and protein synthesis, mitosis, meiosis, and genetic crosses with Punnett squares and pedigrees.",
              href: "biology/lessons/inheritance.html",
              status: "live",
              tags: ["chromosome", "gene", "allele", "DNA", "protein synthesis", "mRNA", "ribosome", "mitosis", "meiosis", "stem cell", "sex chromosomes", "haploid", "diploid", "Punnett square", "genotype", "phenotype", "dominant", "recessive", "codominance", "sex-linked", "pedigree", "test cross", "blood group"]
            }
          ]
        },
        { num: 18, strand: "genes", id: "variation-selection", title: "Variation & selection", blurb: "Mutation, adaptation and natural selection", lessons: [] },
        { num: 19, strand: "eco", id: "environment", title: "Organisms & their environment", blurb: "Food chains, energy flow and nutrient cycles", lessons: [] },
        { num: 20, strand: "eco", id: "human-influences", title: "Human influences on ecosystems", blurb: "Habitat loss, pollution and conservation", lessons: [] },
        { num: 21, strand: "eco", id: "biotechnology", title: "Biotechnology & genetic engineering", blurb: "Microorganisms, fermenters and gene transfer", lessons: [] }
      ]
    }
  ]
};
