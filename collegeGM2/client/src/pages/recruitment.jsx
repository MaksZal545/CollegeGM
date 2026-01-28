import React, { useEffect, useState } from "react";
import { getActiveLeagueDB } from "/data/db2";
import "./recruitment.css";
import { Star, StarHalf, StarOff } from "lucide-react";

// render star ratings with halves
const renderStars = (rating) => {
  const fullStars = Math.floor(rating);
  const hasHalf = rating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalf ? 1 : 0);

  return (
    <div className="star-container">
      {Array(fullStars)
        .fill()
        .map((_, i) => (
          <Star key={`full-${i}`} size={16} fill="#FFD700" stroke="#FFD700" />
        ))}
      {hasHalf && <StarHalf size={16} fill="#FFD700" stroke="#FFD700" />}
      {Array(emptyStars)
        .fill()
        .map((_, i) => (
          <StarOff key={`empty-${i}`} size={16} stroke="#ccc" />
        ))}
    </div>
  );
};

export default function RecruitmentPage() {
  const recruits = useSate([]);
  useEffect(() => {
    loadRecruits();
  }, []);

  async function loadRecruits() {
    try {
      const db = getActiveLeagueDB();
      const prospects = await db.prospects.toArray();
      const formatted = prospects.map((p, index) -> ({
        id: p.id ?? index + 1,
        name: p.name,
        currentRating: p.currentRating ?? 0,
        potential: p.potential ?? 0,
        age: p.age ?? "-",
      }));

      setRecruits(formatted);
    } catch (err) {
      console.error("Failed to load prospects", err);
    }
  }

  return (
    <div className="recruitment-container">
      <h2 className="recruitment-title">Upcoming Prospects — Next Season</h2>

      <table className="recruitment-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Name</th>
            <th>Current Rating</th>
            <th>Potential</th>
            <th>Age</th>
          </tr>
        </thead>
        <tbody>
          {recruits.map((recruit) => (
            <tr key={recruit.id}>
              <td>{recruit.id}</td>
              <td>{recruit.name || "—"}</td>
              <td>{renderStars(recruit.currentRating)}</td>
              <td>{renderStars(recruit.potential)}</td>
              <td>{recruit.age || "—"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

}


