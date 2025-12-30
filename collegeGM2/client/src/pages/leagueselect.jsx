import React, { useEffect, useState } from "react";
import { metaDB, getAllLeagues, createLeagueMeta } from "../data/metaDB";
import { createNewLeague } from "../data/leagueGenerator";
import { useNavigate } from "react-router-dom"; // or however you handle navigation

import Dexie from "dexie";

export default function LeagueSelect() {
  const [leagues, setLeagues] = useState([]);
  const [newLeagueName, setNewLeagueName] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Load all leagues on mount
  useEffect(() => {
    async function loadLeagues() {
      const data = await getAllLeagues();
      setLeagues(data.sort((a, b) => new Date(b.lastPlayed) - new Date(a.lastPlayed)));
    }
    loadLeagues();
  }, []);

  // Create a new league
  async function handleCreateLeague() {
    if (!newLeagueName.trim()) return;
    setLoading(true);

    try {
      const leagueId = await createNewLeague(newLeagueName.trim());
      setNewLeagueName("");
      await refreshLeagues();
      localStorage.setItem("activeLeagueId", leagueId);
      navigate("/main"); // go to main game page
    } catch (err) {
      console.error("Error creating league:", err);
    } finally {
      setLoading(false);
    }
  }

  // Refresh league list
  async function refreshLeagues() {
    const data = await getAllLeagues();
    setLeagues(data.sort((a, b) => new Date(b.lastPlayed) - new Date(a.lastPlayed)));
  }

  // Load existing league
  function handleLoadLeague(leagueId) {
    localStorage.setItem("activeLeagueId", leagueId);
    navigate("/main"); // go to main game screen
  }

  // Delete a league 
  async function handleDeleteLeague(leagueId) {
    if (!window.confirm("Are you sure you want to delete this league?")) return;
    await metaDB.leagues.delete(leagueId);
    await Dexie.delete(`League_${leagueId}`);
    await refreshLeagues();
  }

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-4 text-center">🏀 College Leagues</h1>

      {/* New league creation */}
      <div className="flex mb-6 gap-2">
        <input
          type="text"
          className="border rounded px-3 py-2 flex-1"
          placeholder="Enter new league name..."
          value={newLeagueName}
          onChange={(e) => setNewLeagueName(e.target.value)}
        />
        <button
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
          onClick={handleCreateLeague}
          disabled={loading}
        >
          {loading ? "Creating..." : "Create"}
        </button>
      </div>

      {/* List existing leagues */}
      {leagues.length === 0 ? (
        <p className="text-center text-gray-500">No leagues yet. Create one above!</p>
      ) : (
        <div className="space-y-3">
          {leagues.map((league) => (
            <div
              key={league.id}
              className="flex items-center justify-between bg-white shadow rounded-lg p-4 hover:bg-gray-50"
            >
              <div>
                <div className="font-semibold">{league.name}</div>
                <div className="text-sm text-gray-500">
                  Season {league.season} • Last Played:{" "}
                  {new Date(league.lastPlayed).toLocaleDateString()}
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded"
                  onClick={() => handleLoadLeague(league.id)}
                >
                  Load
                </button>
                <button
                  className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                  onClick={() => handleDeleteLeague(league.id)}
                >
                  🗑
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

}
