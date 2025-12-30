import React from "react";
import "./schedule.css";

export default function SchedulePage() {
  // For now generate a mock 18-game schedule
  const teams = [
    "Lakers", "Warriors", "Bucks", "Celtics", "Heat",
    "Suns", "76ers", "Mavericks", "Nuggets", "Clippers"
  ];

  const schedule = [];

  // Generate 18 games
  for (let i = 0; i < 9; i++) {
    schedule.push({
      id: i * 2 + 1,
      home: "User Team",
      away: teams[i],
      homeScore: null,
      awayScore: null,
      status: "upcoming",
    });
    schedule.push({
      id: i * 2 + 2,
      home: teams[i],
      away: "User Team",
      homeScore: null,
      awayScore: null,
      status: "upcoming",
    });
  }

  return (
    <div className="schedule-container">
      <h2 className="schedule-title">Season Schedule</h2>

      <div className="schedule-grid">
        {schedule.map((game) => (
          <div key={game.id} className="game-card">
            <div className="team-row">
              <span className="team-name">{game.home}</span>
              <span className="score">
                {game.homeScore !== null ? game.homeScore : "-"}
              </span>
            </div>

            <div className="vs-label">VS</div>

            <div className="team-row">
              <span className="team-name">{game.away}</span>
              <span className="score">
                {game.awayScore !== null ? game.awayScore : "-"}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

}
