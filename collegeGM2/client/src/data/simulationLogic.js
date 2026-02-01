import { getActiveLeagueDB } from "../data/db2";
import { applyXpBundle } from "./playerProgression";

export async function simulateWeek() {
  const db = getActiveLeagueDB();

  const leagueMeta = await db.meta.toCollection().first();
  if (!leagueMeta) throw new Error("League meta not found");

  console.log(`Simulating week of season ${leagueMeta.season}`);

  await simulateGames(db);
  await applyTrainingXP(db);

}

export async function simulateWeeks(weeks = 1) {
  for (let i = 0; i < weeks; i++) {
    await simulateWeek();
  }
}

async function simulateGames(db) {
  const colleges = await db.colleges.toArray();

  // placeholder
  for (let i = 0; i < colleges.length; i += 2) {
    const home = colleges[i];
    const away = colleges[i + 1];
    if (!away) continue;

    const homeScore = Math.floor(Math.random() * 40 + 60);
    const awayScore = Math.floor(Math.random() * 40 + 60);

    await db.games.add({
      leagueId: home.leagueId,
      homeCollegeId: home.id,
      awayCollegeId: away.id,
      season: 1,
      homeScore,
      awayScore,
      playedAt: new Date().toISOString(),
    });

    await updateTeamRecords(db, home, away, homeScore, awayScore);
    await applyGameXP(db, home.id);
    await applyGameXP(db, away.id);
  }
}

async function updateTeamRecords(db, home, away, homeScore, awayScore) {
  const homeWin = homeScore > awayScore;

  await db.colleges.update(home.id, {
    record: {
      wins: home.record.wins + (homeWin ? 1 : 0),
      losses: home.record.losses + (!homeWin ? 1 : 0),
    },
  });

  await db.colleges.update(away.id, {
    record: {
      wins: away.record.wins + (!homeWin ? 1 : 0),
      losses: away.record.losses + (homeWin ? 1 : 0),
    },
  });
}
