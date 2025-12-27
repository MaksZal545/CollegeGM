import Dexie from "dexie";

export function getLeagueDB(leagueId) {
  if (!leagueId) throw new Error("League ID is required");

  const db = new Dexie(`League_${leagueId}`);

  db.version(5).stores({
    meta: "name,season,createdAt",
    colleges: "++id,leagueId,name,colour",
    players: "++id,leagueId,collegeId,name,position,overall,isStarter",
    recruits: "++id,leagueId,name,position,rating,potential",
    games: "++id,leagueId,homeCollegeId,awayCollegeId,season",
    seasonStats: "++id,[leagueId+collegeId],playerId,season",
    teamStats: "++id,[leagueId+collegeId],season",
  });

  return db;
}

export function getActiveLeagueDB() {
  const leagueId = localStorage.getItem("activeLeagueId");
  if (!leagueId) throw new Error("No active league set");
  return getLeagueDB(leagueId);
}