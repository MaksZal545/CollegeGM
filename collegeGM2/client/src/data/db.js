import Dexie from "dexie";

export const db = new Dexie("CollegeBasketballSimDB");

db.version(2).stores({
  // Core structures
  leagues: "++id, name, season",
  colleges: "++id, leagueId, name, colour",
  players: "++id, leagueId, collegeId, name, position, overall, potential, [leagueId+collegeId]",
  recruits: "++id, leagueId, name, position, rating, potential",
  tournaments: "++id, leagueId, year, type",

  // Dynamic / simulation data
  games: "++id, leagueId, season, homeCollegeId, awayCollegeId, homeScore, awayScore, date, tournamentId",
  playerStats: "++id, playerId, gameId, leagueId, season, points, rebounds, assists, steals, blocks, minutes",
  seasonStats: "++id, playerId, leagueId, collegeId, season, ppg, rpg, apg, spg, bpg, gamesPlayed, overallEnd",
  teamStats: "++id, leagueId, collegeId, season, wins, losses, pointsFor, pointsAgainst"
});