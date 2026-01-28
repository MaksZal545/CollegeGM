import { addXp } from "/data/seedGenerator";

function trainPlayer(player, attribute) {
  const updated = structuredClone(player);
  addXp(updated, attribute, 25);
  db.players.put(updated);
}
