import { createLeagueMeta } from "./metaDB";
import { getLeagueDB } from "./db2";

export async function createNewLeague(name) {
  
  const meta = await createLeagueMeta(name);
  const leagueId = meta.id;

  const db = getLeagueDB(leagueId);

  await db.meta.add({
    name,
    season: 1,
    createdAt: new Date().toISOString(),
  });

  const collegeNames = [
    "Redwood State",
    "Ironclad University",
    "Northshore Tech",
    "Pioneer College",
    "Summit Valley",
    "Blue Ridge",
    "Granite Coast",
    "Highland Institute",
    "Lakeside Academy",
    "Canyon State",
  ];

  const colorSchemes = [
    { primary: "#e63946", secondary: "#1d3557" },
    { primary: "#457b9d", secondary: "#f1faee" },
    { primary: "#2a9d8f", secondary: "#264653" },
    { primary: "#f4a261", secondary: "#2f3e46" },
    { primary: "#8338ec", secondary: "#ffbe0b" },
    { primary: "#3a86ff", secondary: "#ff006e" },
    { primary: "#007f5f", secondary: "#d8f3dc" },
    { primary: "#d62828", secondary: "#fcbf49" },
    { primary: "#6a040f", secondary: "#f48c06" },
    { primary: "#0096c7", secondary: "#caf0f8" },
  ];

  const colleges = collegeNames.map((collegeName, i) => ({
    leagueId,
    name: collegeName,
    colours: colorSchemes[i],
    record: { wins: 0, losses: 0 },
    isUser: i === 0, // first college is user
  }));

  const collegeIds = await db.colleges.bulkAdd(colleges, { allKeys: true });

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
