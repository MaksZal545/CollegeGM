//import { db } from "./db";
import { getActiveDB } from "./db2";
const db = getActiveDB();

//rename this file to xp system logic

export const XP_PER_LEVEL = 100;

export function applyXP(attribute, amount) {
  if (attribute.value >= attribute.potential) return 0;

  attribute.xp += amount;
  let levelIsGained = 0;

  while (attribute.xp >= XP_PER_LEVEL && attribute.value < attribute.potential) {
    attribute.xp -= XP_PER_LEVEL;
    attribute.value += 1;
    levelIsGained += 1;
  }

  if (attribute.value >= attribute.potential) {
    attribute.xp = 0;
  }

  return levelIsGained;
}

