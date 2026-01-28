//import { db } from "./db";
import { getActiveDB } from "./db2";
const db = getActiveDB();

//rename this file to xp system logic

export const XP_PER_LEVEL = 100;

export function applyXP(attribute, amount) {
  if (attribute.value >= attribute.potential) return false;

  attribute.xp += amount;

  if (attribute.xp >= XP_PER_LEVEL) {
    attribute.xp -= XP_PER_LEVEL;
    attribute.value += 1;
    return true; // leveled up
  }

  return false;
}
