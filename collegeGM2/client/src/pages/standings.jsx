import React from "react";
import "./standings.css";

export default function StandingsTable() {
  const rows = Array.from({ length: 10 }, (_, i) => ({
    rank: i + 1,
    team: "",
    wins: "",
    losses: "",
    pct: "",
  }));

  return (
    <div className="standings-container">
      <h2 className="standings-title">Western Conference Standings</h2>

      <table className="standings-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Team</th>
            <th>W</th>
            <th>L</th>
            <th>PCT</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => (
            <tr
              key={row.rank}
              className={`standings-row ${
                index === 7 ? "cutoff-row" : ""
              }`}
            >
              <td>{row.rank}</td>
              <td>{row.team || "—"}</td>
              <td>{row.wins || "—"}</td>
              <td>{row.losses || "—"}</td>
              <td>{row.pct || "—"}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="cutoff-label">
        <span>Top 8 teams qualify for playoffs</span>
      </div>
    </div>
  );
}