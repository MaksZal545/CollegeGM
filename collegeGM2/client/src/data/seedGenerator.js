//import { db } from "./db";
import { getActiveDB } from "./db2";
const db = getActiveDB();

// Random score generator
function randomScore() {
  return Math.floor(Math.random() * 40) + 60; // 60–100
}

// Compute standings
async function calculateTeamRecords(leagueId, season) {
  const games = await db.games.where({ leagueId, season }).toArray();
  const standings = {};

  for (const game of games) {
    const { homeCollegeId, awayCollegeId, homeScore, awayScore } = game;
    if (!standings[homeCollegeId]) standings[homeCollegeId] = { wins: 0, losses: 0, pointsFor: 0, pointsAgainst: 0 };
    if (!standings[awayCollegeId]) standings[awayCollegeId] = { wins: 0, losses: 0, pointsFor: 0, pointsAgainst: 0 };

    standings[homeCollegeId].pointsFor += homeScore;
    standings[homeCollegeId].pointsAgainst += awayScore;
    standings[awayCollegeId].pointsFor += awayScore;
    standings[awayCollegeId].pointsAgainst += homeScore;

    if (homeScore > awayScore) {
      standings[homeCollegeId].wins++;
      standings[awayCollegeId].losses++;
    } else {
      standings[awayCollegeId].wins++;
      standings[homeCollegeId].losses++;
    }
  }

  return Object.entries(standings).map(([collegeId, record]) => ({
    leagueId,
    collegeId: Number(collegeId),
    season,
    ...record,
  }));
}

export async function seedInitialSeason(leagueId) {
  const season = 1;
  const games = await db.games.where({ leagueId, season }).toArray();
  const players = await db.players.where({ leagueId }).toArray();

  // Simulate scores
  for (const game of games) {
    game.homeScore = randomScore();
    game.awayScore = randomScore();
  }
  await db.games.bulkPut(games);

  // Generate fake player season stats
  const seasonStats = players.map((p) => ({
    playerId: p.id,
    leagueId,
    collegeId: p.collegeId,
    season,
    ppg: +(Math.random() * 20).toFixed(1),
    rpg: +(Math.random() * 8).toFixed(1),
    apg: +(Math.random() * 6).toFixed(1),
    spg: +(Math.random() * 3).toFixed(1),
    bpg: +(Math.random() * 2).toFixed(1),
    gamesPlayed: Math.floor(Math.random() * 18),
    overallEnd: +(p.overall + Math.random() * 0.5).toFixed(1),
  }));

  await db.seasonStats.bulkAdd(seasonStats);

  // Compute standings
  const teamRecords = await calculateTeamRecords(leagueId, season);
  await db.teamStats.bulkAdd(teamRecords);

  console.log(`✅ Seeded Season ${season} for League ${leagueId}`);
}