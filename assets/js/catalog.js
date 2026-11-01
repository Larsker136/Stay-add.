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
        {
          num: 1, strand: "cells", id: "classification-topic", title: "Characteristics & classification", blurb: "MRS GREN, keys and the five kingdoms",
          lessons: [
            {
              id: "classification",
              title: "Characteristics & classification",
              blurb: "1.1\u20131.3: MRS GREN, species and binomial names, dichotomous keys, the five kingdoms, vertebrates, arthropods, plants and viruses.",
              href: "biology/lessons/classification.html",
              status: "live",
              tags: ["characteristics", "MRS GREN", "classification", "species", "binomial", "genus", "dichotomous key", "kingdom", "prokaryote", "protoctist", "fungus", "vertebrate", "mammal", "arthropod", "insect", "arachnid", "crustacean", "myriapod", "monocot", "dicot", "fern", "virus"]
            }
          ]
        },
        {
          num: 2, strand: "cells", id: "organisation-topic", title: "Organisation of the organism", blurb: "Cells, tissues, organs and magnification",
          lessons: [
            {
              id: "organisation",
              title: "Organisation of the organism",
              blurb: "2.1\u20132.2: animal, plant and bacterial cells, specialised cells, tissues to organ systems, and magnification.",
              href: "biology/lessons/organisation.html",
              status: "live",
              tags: ["cell", "nucleus", "mitochondria", "ribosome", "chloroplast", "vacuole", "cell wall", "bacteria", "plasmid", "specialised cell", "root hair", "red blood cell", "tissue", "organ", "organ system", "magnification", "micrometre"]
            }
          ]
        },
        {
          num: 3, strand: "cells", id: "movement-in-out-topic", title: "Movement into & out of cells", blurb: "Diffusion, osmosis and active transport",
          lessons: [
            {
              id: "movement",
              title: "Movement into & out of cells",
              blurb: "3.1\u20133.3: diffusion and what speeds it up, osmosis, turgor and plasmolysis, and active transport.",
              href: "biology/lessons/movement.html",
              status: "live",
              tags: ["diffusion", "concentration gradient", "osmosis", "water potential", "partially permeable", "turgid", "flaccid", "plasmolysis", "active transport", "carrier protein", "surface area"]
            }
          ]
        },
        {
          num: 4, strand: "cells", id: "biological-molecules-topic", title: "Biological molecules", blurb: "Carbohydrates, fats, proteins and food tests",
          lessons: [
            {
              id: "molecules",
              title: "Biological molecules",
              blurb: "4: carbohydrates, fats and proteins and their building blocks, the five food tests, DNA base pairing and water as a solvent.",
              href: "biology/lessons/molecules.html",
              status: "live",
              tags: ["carbohydrate", "starch", "glycogen", "cellulose", "glucose", "fat", "fatty acids", "glycerol", "protein", "amino acid", "iodine", "Benedict's", "biuret", "emulsion", "DCPIP", "vitamin C", "DNA", "base pairing"]
            }
          ]
        },
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
        {
          num: 6, strand: "transport", id: "plant-nutrition-topic", title: "Plant nutrition", blurb: "Photosynthesis and limiting factors",
          lessons: [
            {
              id: "plant-nutrition",
              title: "Plant nutrition",
              blurb: "6.1\u20136.2: the photosynthesis equations, uses of glucose, nitrate and magnesium, starch tests and limiting factors, and the layers of a leaf.",
              href: "biology/lessons/plant-nutrition.html",
              status: "live",
              tags: ["photosynthesis", "chlorophyll", "chloroplast", "glucose", "starch", "limiting factor", "light intensity", "carbon dioxide", "nitrate", "magnesium", "iodine", "variegated", "pondweed", "hydrogencarbonate indicator", "leaf", "palisade", "spongy mesophyll", "stomata", "guard cells"]
            }
          ]
        },
        {
          num: 7, strand: "transport", id: "human-nutrition-topic", title: "Human nutrition", blurb: "Diet, digestion and absorption",
          lessons: [
            {
              id: "human-nutrition",
              title: "Human nutrition",
              blurb: "7.1\u20137.5: a balanced diet and deficiencies, the alimentary canal, teeth, enzymes, acid and bile, and absorption in the villi.",
              href: "biology/lessons/human-nutrition.html",
              status: "live",
              tags: ["balanced diet", "vitamin C", "vitamin D", "iron", "calcium", "fibre", "scurvy", "rickets", "anaemia", "digestion", "ingestion", "egestion", "absorption", "assimilation", "teeth", "peristalsis", "amylase", "protease", "lipase", "maltase", "pepsin", "trypsin", "bile", "villi", "lacteal"]
            }
          ]
        },
        {
          num: 8, strand: "transport", id: "transport-plants-topic", title: "Transport in plants", blurb: "Xylem, phloem and transpiration",
          lessons: [
            {
              id: "transport-plants",
              title: "Transport in plants",
              blurb: "8.1\u20138.4: xylem and phloem, root hairs and water uptake, transpiration and the potometer, and translocation from source to sink.",
              href: "biology/lessons/transport-plants.html",
              status: "live",
              tags: ["xylem", "phloem", "vascular bundle", "lignin", "root hair", "osmosis", "transpiration", "stomata", "humidity", "potometer", "wilting", "cohesion", "translocation", "source", "sink", "sucrose"]
            }
          ]
        },
        {
          num: 9, strand: "transport", id: "transport-animals-topic", title: "Transport in animals", blurb: "The heart, blood vessels and blood",
          lessons: [
            {
              id: "transport-animals",
              title: "Transport in animals",
              blurb: "9.1\u20139.4: single and double circulation, the heart, heart rate and coronary heart disease, blood vessels, and blood cells, plasma and clotting.",
              href: "biology/lessons/transport-animals.html",
              status: "live",
              tags: ["circulation", "double circulation", "heart", "atrium", "ventricle", "valve", "septum", "aorta", "vena cava", "pulmonary artery", "coronary heart disease", "pulse", "artery", "vein", "capillary", "red blood cell", "haemoglobin", "phagocyte", "lymphocyte", "platelet", "plasma", "fibrin"]
            }
          ]
        },
        {
          num: 10, strand: "body", id: "disease-immunity-topic", title: "Diseases & immunity", blurb: "Pathogens, defences and antibodies",
          lessons: [
            {
              id: "disease-immunity",
              title: "Diseases & immunity",
              blurb: "10.1: pathogens and how they spread, controlling spread, the body's barriers, antibodies, active and passive immunity, vaccination and cholera.",
              href: "biology/lessons/disease-immunity.html",
              status: "live",
              tags: ["pathogen", "transmissible disease", "vector", "hygiene", "sewage", "skin", "mucus", "stomach acid", "phagocyte", "lymphocyte", "antibody", "antigen", "memory cell", "vaccination", "active immunity", "passive immunity", "herd immunity", "cholera"]
            }
          ]
        },
        {
          num: 11, strand: "body", id: "gas-exchange-topic", title: "Gas exchange in humans", blurb: "Lungs, alveoli and breathing",
          lessons: [
            {
              id: "gas-exchange",
              title: "Gas exchange in humans",
              blurb: "11.1: gas exchange surfaces, the airways and alveoli, mucus and cilia, the mechanism of breathing, inspired and expired air, and exercise.",
              href: "biology/lessons/gas-exchange.html",
              status: "live",
              tags: ["gas exchange", "alveoli", "trachea", "bronchi", "bronchioles", "cartilage", "diaphragm", "intercostal muscles", "inhalation", "exhalation", "limewater", "expired air", "goblet cells", "cilia", "breathing rate", "exercise"]
            }
          ]
        },
        {
          num: 12, strand: "body", id: "respiration-topic", title: "Respiration", blurb: "Aerobic and anaerobic respiration",
          lessons: [
            {
              id: "respiration",
              title: "Respiration",
              blurb: "12.1\u201312.3: uses of energy, respirometers, aerobic respiration in mitochondria, anaerobic respiration in muscles and yeast, and oxygen debt.",
              href: "biology/lessons/respiration.html",
              status: "live",
              tags: ["respiration", "energy", "aerobic", "anaerobic", "mitochondria", "glucose", "oxygen", "carbon dioxide", "lactic acid", "yeast", "ethanol", "oxygen debt", "respirometer"]
            }
          ]
        },
        {
          num: 13, strand: "body", id: "excretion-topic", title: "Excretion in humans", blurb: "The kidneys and the liver",
          lessons: [
            {
              id: "excretion",
              title: "Excretion in humans",
              blurb: "13.1: excretory products, deamination and urea in the liver, the urinary system, kidney structure, and filtration and reabsorption in the nephron.",
              href: "biology/lessons/excretion.html",
              status: "live",
              tags: ["excretion", "urea", "deamination", "liver", "kidney", "ureter", "bladder", "urethra", "renal artery", "renal vein", "cortex", "medulla", "nephron", "glomerulus", "Bowman's capsule", "reabsorption", "urine"]
            }
          ]
        },
        {
          num: 14, strand: "body", id: "coordination-topic", title: "Coordination & response", blurb: "Nerves, hormones and homeostasis",
          lessons: [
            {
              id: "coordination",
              title: "Coordination & response",
              blurb: "14.1\u201314.5: neurones, reflex arcs and synapses, the eye, hormones and adrenaline, homeostasis of glucose and temperature, and tropic responses.",
              href: "biology/lessons/coordination.html",
              status: "live",
              tags: ["nervous system", "CNS", "neurone", "reflex arc", "synapse", "neurotransmitter", "eye", "retina", "lens", "iris", "pupil reflex", "accommodation", "rods", "cones", "hormone", "adrenaline", "insulin", "glucagon", "homeostasis", "negative feedback", "diabetes", "vasodilation", "sweating", "shivering", "auxin", "phototropism", "gravitropism"]
            }
          ]
        },
        {
          num: 15, strand: "body", id: "drugs-topic", title: "Drugs", blurb: "Medicinal drugs and antibiotics",
          lessons: [
            {
              id: "drugs",
              title: "Drugs",
              blurb: "15.1\u201315.2: what a drug is, medicinal drugs, how antibiotics work, why they do not affect viruses, and antibiotic resistance.",
              href: "biology/lessons/drugs.html",
              status: "live",
              tags: ["drug", "medicinal drug", "painkiller", "antibiotic", "antiviral", "vaccine", "penicillin", "bacteria", "virus", "resistance", "MRSA", "mutation", "natural selection"]
            }
          ]
        },
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
        {
          num: 18, strand: "genes", id: "variation-selection-topic", title: "Variation & selection", blurb: "Mutation, adaptation and natural selection",
          lessons: [
            {
              id: "variation",
              title: "Variation & selection",
              blurb: "18.1\u201318.3: continuous and discontinuous variation, mutation, xerophytes and hydrophytes, natural selection and selective breeding.",
              href: "biology/lessons/variation.html",
              status: "live",
              tags: ["variation", "continuous", "discontinuous", "mutation", "sickle-cell", "adaptive feature", "fitness", "xerophyte", "hydrophyte", "natural selection", "adaptation", "evolution", "peppered moth", "selective breeding", "artificial selection"]
            }
          ]
        },
        {
          num: 19, strand: "eco", id: "environment-topic", title: "Organisms & their environment", blurb: "Food chains, energy flow and nutrient cycles",
          lessons: [
            {
              id: "ecology",
              title: "Organisms & their environment",
              blurb: "19.1\u201319.4: energy flow, food chains, webs and pyramids, the carbon and nitrogen cycles, and population growth curves.",
              href: "biology/lessons/ecology.html",
              status: "live",
              tags: ["energy flow", "food chain", "food web", "producer", "consumer", "herbivore", "carnivore", "decomposer", "trophic level", "pyramid of numbers", "pyramid of biomass", "carbon cycle", "nitrogen cycle", "nitrogen fixation", "nitrification", "denitrification", "population", "community", "ecosystem", "sigmoid curve"]
            }
          ]
        },
        {
          num: 20, strand: "eco", id: "human-influences-topic", title: "Human influences on ecosystems", blurb: "Habitat loss, pollution and conservation",
          lessons: [
            {
              id: "human-influences",
              title: "Human influences on ecosystems",
              blurb: "20.1\u201320.4: food production and monocultures, habitat destruction and deforestation, pollution, eutrophication and the greenhouse effect, and conservation.",
              href: "biology/lessons/human-influences.html",
              status: "live",
              tags: ["agriculture", "fertiliser", "pesticide", "monoculture", "intensive farming", "famine", "habitat destruction", "deforestation", "biodiversity", "pollution", "eutrophication", "plastics", "greenhouse effect", "climate change", "methane", "sustainable", "conservation", "fish stocks", "quotas", "captive breeding", "seed bank"]
            }
          ]
        },
        {
          num: 21, strand: "eco", id: "biotechnology-topic", title: "Biotechnology & genetic engineering", blurb: "Microorganisms, fermenters and gene transfer",
          lessons: [
            {
              id: "biotechnology",
              title: "Biotechnology & genetic modification",
              blurb: "21.1\u201321.3: why bacteria are useful, yeast, pectinase, washing powders and lactase, fermenters, and making human insulin and GM crops.",
              href: "biology/lessons/biotechnology.html",
              status: "live",
              tags: ["biotechnology", "bacteria", "plasmid", "yeast", "biofuel", "ethanol", "bread", "pectinase", "biological washing powder", "lactase", "fermenter", "genetic modification", "restriction enzyme", "sticky ends", "DNA ligase", "recombinant plasmid", "insulin", "GM crops"]
            }
          ]
        }
      ]
    }
  ]
};
