import { useState } from "react";
import db from "../db";

export default function RegistrationForm() {
  const [name, setName] = useState("");
  const [dob, setDob] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await db.query("INSERT INTO patients (name, dob) VALUES ($1, $2)", [
      name,
      dob,
    ]);
    setName("");
    setDob("");
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />
      <input
        type="date"
        value={dob}
        onChange={(e) => setDob(e.target.value)}
        required
      />
      <button type="submit">Register</button>
    </form>
  );
}
