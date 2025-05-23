import { useState } from "react";
import db from "../db";

export default function SqlQuery() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);

  const execute = async () => {
    const res = await db.query(query);
    setResults(res.rows);
  };

  return (
    <div>
      <textarea value={query} onChange={(e) => setQuery(e.target.value)} />
      <button onClick={execute}>Execute</button>
      <pre>{JSON.stringify(results, null, 2)}</pre>
    </div>
  );
}
