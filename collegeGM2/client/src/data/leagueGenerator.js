import { createLeagueMeta } from "./metaDB";
import { getLeagueDB } from "./db2";

export async function createNewLeague(name) {
  // Step 1: Create meta entry
  const meta = await createLeagueMeta(name);
  const leagueId = meta.id;

  // Step 2: Create actual league DB
  const db = getLeagueDB(leagueId);

  await db.meta.add({
    name,
    season: 1,
    createdAt: new Date().toISOString(),
  });

  // Step 3: Generate sample colleges
  const colors = ["#ffbe0b", "#3a86ff", "#ff006e", "#8338ec", "#007f5f", "#00b4d8", "#d62828", "#fb5607", "#f5b342", "#0096c7"];
  const colleges = Array.from({ length: 10 }).map((_, i) => ({
    leagueId,
    name: `College ${i + 1}`,
    colour: colors[i],
    record: { wins: 0, losses: 0 },
  }));

  const collegeIds = await db.colleges.bulkAdd(colleges, { allKeys: true });

  // Step 4: Generate players
  const positions = ["PG", "SG", "SF", "PF", "C"];
  const randomName = () => {
    const first = ["Jayden", "Malik", "Luca", "Tobias", "Eli", "Bryce", "Amari"];
    const last = ["Johnson", "Lee", "Brown", "Clark", "Evans", "Bennett", "Davis"];
    return `${first[Math.floor(Math.random() * first.length)]} ${last[Math.floor(Math.random() * last.length)]}`;
  };

  const players = [];
  for (const id of collegeIds) {
    for (let j = 0; j < 9; j++) {
      players.push({
        leagueId,
        collegeId: id,
        name: randomName(),
        position: positions[Math.floor(Math.random() * positions.length)],
        overall: +(Math.random() * 4 + 1).toFixed(1),
        year: Math.ceil(Math.random() * 4),
      });
    }
  }

  await db.players.bulkAdd(players);

  // Step 5: Save league as active
  localStorage.setItem("activeLeagueId", leagueId);
  localStorage.setItem("userCollegeId", collegeIds[0]);

  return leagueId;
}