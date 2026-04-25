export const MOCK_ASSETS = [
  {
    id: "carajas-s11d",
    name: "Carajás S11D",
    localName: "Complexo Minerador de Carajás",
    primaryCommodity: "IRON_ORE",
    classification: "OPEN",
    status: "ACTIVE",
    location: {
      lat: -6.0833, lng: -50.1667,
      country: "BR", countryName: "Brazil",
      region: "Pará", nearestCity: "Parauapebas"
    },
    operator: {
      name: "Vale S.A.",
      ticker: "VALE3.SA",
      headquarters: "Rio de Janeiro, Brazil",
      ownership: [{ entity: "Vale S.A.", stake: 100 }]
    },
    metrics: {
      reserves: { value: 7200, unit: "Mt", grade: "66.7% Fe" },
      annualProduction: { value: 90, unit: "Mt/y", trend: "up", yoyChange: 2.3 },
      lifespan: { yearsRemaining: 80, plannedClosure: 2103 },
      workforce: 7000
    },
    intel: {
      strategicImportance: 95,
      supplyChainCriticality: 88,
      threatLevel: "LOW",
      globalRanking: { metric: "iron ore production", position: 1, scope: "world" },
      geopoliticalRisk: {
        composite: 28, political: 30, security: 25,
        regulatory: 35, operational: 20, environmental: 55
      }
    },
    description: {
      detailed: "The Carajás S11D complex, part of the larger Carajás Mineral Province, is the single largest iron ore producer in the world. It utilizes a truckless system to reduce its environmental footprint.",
      highlights: [
        "Highest-grade iron ore globally (66-67% Fe)",
        "Truckless mining system (world's largest)",
        "Operates within Carajás National Forest",
        "Critical for China's steel industry supply"
      ]
    },
    timeline: [
      { date: "1967-07", type: "DISCOVERY", severity: "INFO", headline: "Iron deposits discovered by US Steel geologists" },
      { date: "2016-12", type: "MILESTONE", severity: "INFO", headline: "S11D inaugurated, world's largest iron ore project" },
      { date: "2023-10", type: "MILESTONE", severity: "INFO", headline: "Record 90.4 Mt annual production" }
    ],
    relations: {
      primaryBuyers: ["China (65%)", "Japan (8%)", "Europe (15%)"]
    }
  },
  {
    id: "escondida",
    name: "Escondida",
    localName: "Minera Escondida",
    primaryCommodity: "COPPER",
    classification: "RESTRICTED",
    status: "ACTIVE",
    location: {
      lat: -24.2667, lng: -69.0667,
      country: "CL", countryName: "Chile",
      region: "Antofagasta", nearestCity: "Antofagasta"
    },
    operator: {
      name: "BHP",
      ticker: "BHP",
      headquarters: "Melbourne, Australia",
      ownership: [
        { entity: "BHP", stake: 57.5 },
        { entity: "Rio Tinto", stake: 30 },
        { entity: "JECO Corp", stake: 10 },
        { entity: "JECO 2 Corp", stake: 2.5 }
      ]
    },
    metrics: {
      reserves: { value: 32000, unit: "Mt", grade: "0.5% Cu" },
      annualProduction: { value: 1.05, unit: "Mt/y", trend: "down", yoyChange: -4.2 },
      lifespan: { yearsRemaining: 50, plannedClosure: 2073 },
      workforce: 10000
    },
    intel: {
      strategicImportance: 98,
      supplyChainCriticality: 92,
      threatLevel: "MEDIUM",
      globalRanking: { metric: "copper production", position: 1, scope: "world" },
      geopoliticalRisk: {
        composite: 45, political: 50, security: 30,
        regulatory: 60, operational: 40, environmental: 65
      }
    },
    description: {
      detailed: "Escondida is a copper porphyry deposit in the Atacama Desert in northern Chile. It currently produces over 1 million tonnes of copper per year, making it the highest producing copper mine in the world.",
      highlights: [
        "World's largest copper producing mine",
        "Pivotal to global renewable energy supply chains",
        "Relies heavily on desalinated water due to arid location",
        "Frequent labor disputes influence global copper prices"
      ]
    },
    timeline: [
      { date: "1990-12", type: "MILESTONE", severity: "INFO", headline: "Initial production begins" },
      { date: "2017-02", type: "INCIDENT", severity: "SEVERE", headline: "44-day historic workers strike halts production" },
      { date: "2024-02", type: "MILESTONE", severity: "WARNING", headline: "Water scarcity forces $3B desalination plant investment" }
    ],
    relations: {
      primaryBuyers: ["China (50%)", "South Korea (15%)", "Japan (12%)"]
    }
  },
  {
    id: "mountain-pass",
    name: "Mountain Pass",
    localName: "Mountain Pass Rare Earth Mine",
    primaryCommodity: "RARE_EARTHS",
    classification: "RESTRICTED",
    status: "ACTIVE",
    location: {
      lat: 35.4833, lng: -115.5333,
      country: "US", countryName: "United States",
      region: "California", nearestCity: "Las Vegas"
    },
    operator: {
      name: "MP Materials",
      ticker: "MP",
      headquarters: "Las Vegas, Nevada, US",
      ownership: [{ entity: "MP Materials", stake: 100 }]
    },
    metrics: {
      reserves: { value: 20, unit: "Mt", grade: "8% REO" },
      annualProduction: { value: 0.04, unit: "Mt/y", trend: "up", yoyChange: 15.0 },
      lifespan: { yearsRemaining: 35, plannedClosure: 2058 },
      workforce: 500
    },
    intel: {
      strategicImportance: 100,
      supplyChainCriticality: 98,
      threatLevel: "ELEVATED",
      globalRanking: { metric: "rare earth production", position: 2, scope: "world" },
      geopoliticalRisk: {
        composite: 35, political: 20, security: 15,
        regulatory: 65, operational: 30, environmental: 70
      }
    },
    description: {
      detailed: "Mountain Pass is the only operating rare earth element (REE) mine in the United States and is a key asset in western efforts to reduce reliance on Chinese rare earth supply chains.",
      highlights: [
        "Sole functioning rare earth mine in North America",
        "Crucial for US defense and green energy sectors",
        "Currently exports concentrate to China for processing, transitioning to domestic processing",
        "High environmental regulatory scrutiny"
      ]
    },
    timeline: [
      { date: "1952-01", type: "DISCOVERY", severity: "INFO", headline: "Bastnäsite ore discovered" },
      { date: "2015-08", type: "INCIDENT", severity: "SEVERE", headline: "Previous owner Molycorp files for bankruptcy" },
      { date: "2017-07", type: "MILESTONE", severity: "INFO", headline: "MP Materials acquires mine, restarts production" },
      { date: "2023-01", type: "MILESTONE", severity: "INFO", headline: "DoD awards $35M for domestic heavy rare earth processing" }
    ],
    relations: {
      primaryBuyers: ["China (80%) - for processing", "US domestic (increasing)"]
    }
  }
];
