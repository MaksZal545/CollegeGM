import React, { useEffect, useState } from "react";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { getActiveLeagueDB } from "../data/db2"; // import league db helper
import "./roster.css";

function SortableRow({ player, index, isDivider }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: player.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  if (isDivider) {
    return (
      <tr>
        <td colSpan="4">
          <div className="roster-divider"></div>
        </td>
      </tr>
    );
  }

  return (
    <tr
      ref={setNodeRef}
      style={style}
      className={`roster-row ${isDragging ? "dragging" : ""}`}
      {...attributes}
      {...listeners}
    >
      <td>{index + 1}</td>
      <td>{player.name}</td>
      <td>{player.position}</td>
      <td>{player.overall}</td>
    </tr>
  );
}

export default function RosterManager() {
  const [players, setPlayers] = useState([]);
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

  useEffect(() => {
    loadPlayers();
  }, []);

  async function loadPlayers() {
    try {
      const db = getActiveLeagueDB();
      const userCollegeId = Number(localStorage.getItem("userCollegeId"));
      const playerList = await db.players.where("collegeId").equals(userCollegeId).toArray();

      // Tag first 5 as starters, rest as bench
      const withStatus = playerList.map((p, i) => ({
        ...p,
        status: i < 5 ? "starter" : "bench",
      }));

      setPlayers(withStatus);
    } catch (err) {
      console.error("Error loading players:", err);
    }
  }

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = players.findIndex((p) => p.id === active.id);
    const newIndex = players.findIndex((p) => p.id === over.id);

    const newPlayers = arrayMove(players, oldIndex, newIndex);
    
    const updated = newPlayers.map((p, i) => ({
      ...p,
      status: i < 5 ? "starter" : "bench",
    }));

    setPlayers(updated);
  };

  return (
    <div className="roster-manager">
      <h2 className="roster-title">Roster Management</h2>
      <table className="roster-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Player</th>
            <th>Position</th>
            <th>OVR</th>
          </tr>
        </thead>

        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={players} strategy={verticalListSortingStrategy}>
            <tbody>
              {players.map((player, index) => {
                // Insert divider after 5th player (between starters & bench)
                const isDivider = index === 5;
                return (
                  <React.Fragment key={player.id}>
                    {isDivider && <SortableRow player={{ id: "divider" }} isDivider />}
                    <SortableRow player={player} index={index} />
                  </React.Fragment>
                );
              })}
            </tbody>
          </SortableContext>
        </DndContext>
      </table>
    </div>
  );

}

