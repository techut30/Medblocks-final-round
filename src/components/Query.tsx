import React, { useState } from "react";
import { dbOperations } from "../db";

export default function SqlQuery() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [isExecuting, setIsExecuting] = useState(false);
  const [error, setError] = useState("");
  const [executionTime, setExecutionTime] = useState<number | null>(null);

  const predefinedQueries = [
    {
      name: "All Patients",
      query: "SELECT * FROM patients ORDER BY created_at DESC;",
    },
    {
      name: "Patients Count",
      query: "SELECT COUNT(*) as total_patients FROM patients;",
    },
    {
      name: "Recent Registrations",
      query:
        "SELECT name, created_at FROM patients WHERE created_at >= CURRENT_DATE - INTERVAL '7 days' ORDER BY created_at DESC;",
    },
    {
      name: "Patients by Age",
      query:
        "SELECT name, dob, EXTRACT(YEAR FROM AGE(dob)) as age FROM patients ORDER BY age DESC;",
    },
  ];

  const executeQuery = async () => {
    if (!query.trim()) {
      setError("Please enter a query");
      return;
    }

    setIsExecuting(true);
    setError("");
    setResults([]);

    const startTime = performance.now();

    try {
      const result = await dbOperations.executeQuery(query);
      const endTime = performance.now();

      setResults(result.rows || []);
      setExecutionTime(endTime - startTime);
    } catch (err: any) {
      setError(err.message || "An error occurred while executing the query");
    } finally {
      setIsExecuting(false);
    }
  };

  const loadPredefinedQuery = (predefinedQuery: string) => {
    setQuery(predefinedQuery);
    setError("");
    setResults([]);
    setExecutionTime(null);
  };

  const formatResults = () => {
    if (results.length === 0) return null;

    return (
      <div className="results-container">
        <div className="results-header">
          <h3>Query Results ({results.length} rows)</h3>
          {executionTime && (
            <span className="execution-time">
              Executed in {executionTime.toFixed(2)}ms
            </span>
          )}
        </div>

        <div className="results-table-container">
          <table className="results-table">
            <thead>
              <tr>
                {Object.keys(results[0]).map((key) => (
                  <th key={key}>{key}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {results.map((row, index) => (
                <tr key={index}>
                  {Object.values(row).map((value: any, cellIndex) => (
                    <td key={cellIndex}>
                      {value instanceof Date
                        ? value.toLocaleString()
                        : String(value)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  return (
    <div className="sql-query">
      <h2>SQL Query Interface</h2>

      <div className="predefined-queries">
        <h3>Quick Queries:</h3>
        <div className="query-buttons">
          {predefinedQueries.map((pq, index) => (
            <button
              key={index}
              type="button"
              className="predefined-query-btn"
              onClick={() => loadPredefinedQuery(pq.query)}
              disabled={isExecuting}
            >
              {pq.name}
            </button>
          ))}
        </div>
      </div>

      <div className="query-input">
        <label htmlFor="sql-textarea">SQL Query:</label>
        <textarea
          id="sql-textarea"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Enter your SQL query here..."
          rows={8}
          disabled={isExecuting}
        />
      </div>

      <button
        onClick={executeQuery}
        disabled={isExecuting || !query.trim()}
        className="execute-btn"
      >
        {isExecuting ? "Executing..." : "Execute Query"}
      </button>

      {error && (
        <div className="error-message">
          <strong>Error:</strong> {error}
        </div>
      )}

      {formatResults()}

      <div className="query-help">
        <h4>Database Schema:</h4>
        <pre>
          {`patients (
  id          UUID PRIMARY KEY,
  name        TEXT NOT NULL,
  dob         DATE NOT NULL,
  email       TEXT,
  phone       TEXT,
  address     TEXT,
  created_at  TIMESTAMP,
  updated_at  TIMESTAMP
)`}
        </pre>
      </div>
    </div>
  );
}
