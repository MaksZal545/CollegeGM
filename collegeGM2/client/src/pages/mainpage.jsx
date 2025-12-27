import React, { useEffect, useState } from "react";
import { getLeagueDB } from "../data/db2";  // your per-league Dexie helper
import { metaDB } from "../data/metaDB";         // for meta info
import { useNavigate } from "react-router-dom";

export default function MainPage() {
  const [league, setLeague] = useState(null);
  const [college, setCollege] = useState(null);
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    async function loadLeague() {
      try {
        const leagueId = localStorage.getItem("activeLeagueId");
        const userCollegeId = localStorage.getItem("userCollegeId");

        if (!leagueId) {
          console.warn("No active league found — redirecting to league select.");
          navigate("/leagueselect");
          return;
        }

        const db = getLeagueDB(leagueId);

        // ✅ Make sure the DB is open
        await db.open();

        // Load metadata from metaDB
        const meta = await metaDB.leagues.get(Number(leagueId));
        setLeague(meta || { id: leagueId, name: "Unknown League" });

        // Load user college
        if (userCollegeId) {
          const collegeData = await db.colleges.get(Number(userCollegeId));
          setCollege(collegeData);
        }

        // Load players from user college
        if (userCollegeId) {
          const playerList = await db.players
            .where("collegeId")
            .equals(Number(userCollegeId))
            .toArray();
          setPlayers(playerList);
        }

        setLoading(false);
      } catch (err) {
        console.error("Error loading main page data:", err);
        setLoading(false);
      }
    }

    loadLeague();
  }, [navigate]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen text-gray-400 text-lg">
        Loading team data...
      </div>
    );
  }

  if (!league || !college) {
    return (
      <div className="p-6 text-center">
        <p className="text-gray-500 mb-4">
          Could not find active league data. Please return to the main menu.
        </p>
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded"
          onClick={() => navigate("/leagueselect")}
        >
          Back to League Select
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-white mb-4">{league.name}</h1>
      <h2 className="text-xl text-gray-300 mb-6">{college.name}</h2>

      <div className="bg-gray-800 rounded-xl shadow p-4">
        <h3 className="text-lg font-semibold mb-3 text-white">🏀 Team Roster</h3>

        {players.length === 0 ? (
          <p className="text-gray-400">No players found for this college.</p>
        ) : (
          <table className="w-full text-gray-200 text-sm">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="py-2 text-left">Name</th>
                <th>Position</th>
                <th>Overall</th>
                <th>Year</th>
              </tr>
            </thead>
            <tbody>
              {players.map((p) => (
                <tr key={p.id} className="border-b border-gray-700 hover:bg-gray-700/30">
                  <td className="py-2">{p.name}</td>
                  <td className="text-center">{p.position}</td>
                  <td className="text-center">{p.overall}</td>
                  <td className="text-center">{p.year}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}