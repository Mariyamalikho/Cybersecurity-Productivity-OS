export function calculateLevel(xp: number): number {
  // Using an escalating curve: Level = floor(sqrt(XP / 50)) + 1
  // Lvl 1: 0 XP
  // Lvl 2: 50 XP
  // Lvl 3: 200 XP
  // Lvl 4: 450 XP
  // Lvl 5: 800 XP
  return Math.floor(Math.sqrt(Math.max(0, xp) / 50)) + 1;
}

export function getXpForNextLevel(level: number): number {
  // Inverse of the curve to find XP required for the NEXT level
  return Math.pow(level, 2) * 50;
}

export function getLevelTitle(level: number): string {
  if (level < 5) return "Cyber Rookie";
  if (level < 10) return "Script Kiddie";
  if (level < 20) return "Junior Analyst";
  if (level < 30) return "Security Engineer";
  if (level < 40) return "Ethical Hacker";
  if (level < 50) return "Red Teamer";
  return "CISO";
}
