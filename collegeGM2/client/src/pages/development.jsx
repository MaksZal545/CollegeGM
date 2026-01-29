import React, { useEffect, useState } from "react";
import "./development.css";
import { getActiveLeagueDB } from "/data/db2";
import { Star, StarHalf, StarOff } from "lucide-react";

const attributes = [
  "2PT Shooting",
  "3PT Shooting",
  "Dribbling",
  "Passing",
  "Rebounding",
  "Stealing",
  "Blocking",
];

// Reusable star rendering function
const renderStars = (rating) => {
  const fullStars = Math.floor(rating);
  const hasHalf = rating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalf ? 1 : 0);

  return (
    <div className="star-container">
      {Array(fullStars)
        .fill()
        .map((_, i) => (
          <Star key={`full-${i}`} size={14} fill="#FFD700" stroke="#FFD700" />
        ))}
      {hasHalf && <StarHalf size={14} fill="#FFD700" stroke="#FFD700" />}
      {Array(emptyStars)
        .fill()
        .map((_, i) => (
          <StarOff key={`empty-${i}`} size={14} stroke="#ccc" />
        ))}
    </div>
  );
};

export default function DevelopmentPage() {
  // Placeholder roster of 10 players (empty data)
  const [players, setPlayers] = useState([]);
  useEffect{{ => {
    loadPlayers();
  }, []);

  async function loadPlayers() {
    try {
      const db = getActiveLeagueDB();
      const userCollegeId = Number(localStorage.getItem("userCollegeId"));

      const rosterPlayers = await db.players.where("collegeId").equals(userCollegeId).toArray();

      const formattedPlayers = rosterPlayers.map((p) => ({
        id: p.id,
        position: p.position,
        name: p.name,
        currentRating: p.currentRating ?? 0,
        potential: p.potential ?? 0,
        attributes: {
          "2Pt Shooting": p.attributes?.["2Pt Shotting"] ?? "-",
          "3Pt Shooting": p.attributes?.["3Pt Shotting"] ?? "-",
          Dribbling: p.attributes?.Dribbling ?? "-",
          Passing: p.attributes?.Passing ?? "-",
          Rebounding: p.attributes?.Rebounding ?? "-",
          Stealing: p.attributes?.Stealing ?? "-",
          Blocking: p.attributes?.Blocking ?? "-",
          IQ: p.attributes?.IQ ?? "-",
        },
        trainingFocus: p.trainingFocus ?? "",
        traits: p.traits ?? [],
      }));

      setPlayers(formattedPlayers);
    } catch (err) {
      console.error("Failed to load development players:", err);
    }
  }

  const handleTrainingChange = (id, value) => {
    setPlayers((prev) =>
      prev.map((p) => (p.id === id ? { ...p, trainingFocus: value } : p))
    );

    const db = getActiveLeagueDB();
    await db.players.update(id, { trainingFocus: value });
  };

  return (
    <div className="development-container">
      <h2 className="development-title">Player Development</h2>

      <div className="development-scroll">
        <table className="development-table">
          <thead>
            <tr>
              <th>Pos</th>
              <th>Name</th>
              <th>Current</th>
              <th>Potential</th>
              {attributes.map((attr) => (
                <th key={attr}>{attr}</th>
              ))}
              <th>Training</th>
              <th>Traits</th>
            </tr>
          </thead>
          <tbody>
            {players.map((player) => (
              <tr key={player.id}>
                <td>{player.position || "—"}</td>
                <td>{player.name || "—"}</td>
                <td>{renderStars(player.currentRating)}</td>
                <td>{renderStars(player.potential)}</td>

                {attributes.map((attr) => (
                  <td key={attr} className="attr-cell">
                    {player.attributes[attr] || "-"}
                  </td>
                ))}

                <td>
                  <select
                    className="training-select"
                    value={player.trainingFocus}
                    onChange={(e) =>
                      handleTrainingChange(player.id, e.target.value)
                    }
                  >
                    <option value="">Select</option>
                    {attributes.map((attr) => (
                      <option key={attr} value={attr}>
                        {attr}
                      </option>
                    ))}
                  </select>
                </td>

                <td className="traits-cell">
                  {player.traits.length ? player.traits.join(", ") : "—"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

}



