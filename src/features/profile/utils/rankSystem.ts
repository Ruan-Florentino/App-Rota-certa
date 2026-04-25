export const RANKS = [
  { min: 0,   title: "Wanderer",         color: "#64748B", icon: "🌱" },
  { min: 1,   title: "Explorer",         color: "#22D3EE", icon: "🧭" },
  { min: 5,   title: "Voyager",          color: "#A855F7", icon: "⚡" },
  { min: 10,  title: "Globetrotter",     color: "#EC4899", icon: "🔥" },
  { min: 25,  title: "World Citizen",    color: "#FBBF24", icon: "⭐" },
  { min: 50,  title: "Continental Lord", color: "#F97316", icon: "👑" },
  { min: 100, title: "Legend",           color: "#EF4444", icon: "🏆" },
];

export const getRank = (countries: number) => {
  return [...RANKS].reverse().find(r => countries >= r.min) || RANKS[0];
};

export const getNextRank = (countries: number) => {
  return RANKS.find(r => countries >= (RANKS.find(_r => _r.min > countries)?.min || Infinity) ? false : r.min > countries);
};
