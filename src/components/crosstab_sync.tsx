import { useEffect, useState } from "react";
import db from "../db";

export default function SyncIndicator() {
  const [status, setStatus] = useState("Connecting...");

  useEffect(() => {
    db.electric
      .syncShapesToTables({
        shapes: {
          patients: {
            shape: { url: "/sync" },
            table: "patients",
            primaryKey: ["id"],
          },
        },
        key: "patient-sync",
      })
      .then(() => setStatus("Synced"));
  }, []);

  return <div>Sync Status: {status}</div>;
}
