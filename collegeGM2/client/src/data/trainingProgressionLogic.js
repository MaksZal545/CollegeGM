import { applyXp } from "/data/xpSystem";

function trainPlayer(player, attribute) {
  const updated = structuredClone(player);
  applyXp(updated, attribute, 25);
  db.players.put(updated);
}
