import Dexie from "dexie";

export const metaDB = new Dexie("MetaDB");

metaDB.version(1).stores({
  leagues: "++id,name,createdAt,lastPlayed,season", // stores league info
});

export async function createLeagueMeta(name) {
  const league = {
    name,
    createdAt: new Date().toISOString(),
    lastPlayed: new Date().toISOString(),
    season: 1,
  };
  const id = await metaDB.leagues.add(league);
  return { ...league, id };
}

export async function getAllLeagues() {
  return metaDB.leagues.toArray();
}

export async function updateLeagueLastPlayed(id) {
  await metaDB.leagues.update(id, { lastPlayed: new Date().toISOString() });
}