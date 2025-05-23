import React, { useState } from "react";
import RegistrationForm from "./components/Form_Registration";
import PatientList from "./components/PatientList";
import SqlQuery from "./components/Query";
import "./App.css";

type TabType = "register" | "list" | "query";

function App() {
  const [activeTab, setActiveTab] = useState<TabType>("register");

  const renderContent = () => {
    switch (activeTab) {
      case "register":
        return <RegistrationForm />;
      case "list":
        return <PatientList />;
      case "query":
        return <SqlQuery />;
      default:
        return <RegistrationForm />;
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Patient Registration System</h1>
        <p>A frontend-only patient management system with PGlite database</p>
      </header>

      <nav className="tab-navigation">
        <button
          className={activeTab === "register" ? "active" : ""}
          onClick={() => setActiveTab("register")}
        >
          Register Patient
        </button>
        <button
          className={activeTab === "list" ? "active" : ""}
          onClick={() => setActiveTab("list")}
        >
          Patient List
        </button>
        <button
          className={activeTab === "query" ? "active" : ""}
          onClick={() => setActiveTab("query")}
        >
          SQL Query
        </button>
      </nav>

      <main className="main-content">{renderContent()}</main>

      <footer className="App-footer">
        <p>
          Built with React, TypeScript, and PGlite • Data persists across
          sessions and syncs across tabs
        </p>
      </footer>
    </div>
  );
}

export default App;
