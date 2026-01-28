import { applyXp } from "/data/seedGenerator";

function trainPlayer(player, attribute) {
  const updated = structuredClone(player);
  applyXp(updated, attribute, 25);
  db.players.put(updated);
}
