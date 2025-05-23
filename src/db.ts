import { PGlite } from "@electric-sql/pglite";

const db = new PGlite("idb://patient-db");

const initDB = async () => {
  try {
    await db.query(`
      CREATE TABLE IF NOT EXISTS patients (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name TEXT NOT NULL,
        dob DATE NOT NULL,
        email TEXT,
        phone TEXT,
        address TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await db.query(`
      CREATE INDEX IF NOT EXISTS idx_patients_name ON patients(name);
    `);

    console.log("Database initialized successfully");
  } catch (error) {
    console.error("Error initializing database:", error);
  }
};

export interface Patient {
  id: string;
  name: string;
  dob: string;
  email?: string;
  phone?: string;
  address?: string;
  created_at: string;
  updated_at: string;
}

export interface PatientInput {
  name: string;
  dob: string;
  email?: string;
  phone?: string;
  address?: string;
}

const broadcastChannel = new BroadcastChannel("patient-db-sync");

class DBEventEmitter {
  private listeners: { [key: string]: Function[] } = {};

  on(event: string, callback: Function) {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event].push(callback);
  }

  off(event: string, callback: Function) {
    if (this.listeners[event]) {
      this.listeners[event] = this.listeners[event].filter(
        (cb) => cb !== callback,
      );
    }
  }

  emit(event: string, data?: any) {
    if (this.listeners[event]) {
      this.listeners[event].forEach((callback) => callback(data));
    }
    broadcastChannel.postMessage({ event, data });
  }

  hasListeners(event: string): boolean {
    return !!(this.listeners[event] && this.listeners[event].length > 0);
  }
}

export const dbEvents = new DBEventEmitter();

broadcastChannel.addEventListener("message", (event) => {
  const { event: eventName, data } = event.data;
  if (dbEvents.hasListeners(eventName)) {
    dbEvents.emit(eventName, data);
  }
});

export const dbOperations = {
  async insertPatient(patientData: PatientInput) {
    try {
      const result = await db.query(
        `INSERT INTO patients (name, dob, email, phone, address)
         VALUES ($1, $2, $3, $4, $5)
         RETURNING *`,
        [
          patientData.name,
          patientData.dob,
          patientData.email,
          patientData.phone,
          patientData.address,
        ],
      );
      const patient = result.rows[0] as Patient;
      dbEvents.emit("patientInserted", patient);
      return patient;
    } catch (error) {
      console.error("Insert failed:", error);
      throw error;
    }
  },

  async updatePatient(id: string, patientData: Partial<PatientInput>) {
    try {
      const setParts = Object.keys(patientData)
        .map((key, index) => `${key} = $${index + 2}`)
        .join(", ");
      const values = [id, ...Object.values(patientData)];
      const result = await db.query(
        `UPDATE patients SET ${setParts}, updated_at = CURRENT_TIMESTAMP
         WHERE id = $1
         RETURNING *`,
        values,
      );
      const patient = result.rows[0] as Patient;
      dbEvents.emit("patientUpdated", patient);
      return patient;
    } catch (error) {
      console.error("Update failed:", error);
      throw error;
    }
  },

  async deletePatient(id: string) {
    try {
      const result = await db.query(
        "DELETE FROM patients WHERE id = $1 RETURNING *",
        [id],
      );
      dbEvents.emit("patientDeleted", { id });
      return result.rows[0] as Patient;
    } catch (error) {
      console.error("Delete failed:", error);
      throw error;
    }
  },

  async getAllPatients(): Promise<Patient[]> {
    try {
      const result = await db.query(
        "SELECT * FROM patients ORDER BY created_at DESC",
      );
      return result.rows as Patient[];
    } catch (error) {
      console.error("Get all failed:", error);
      throw error;
    }
  },

  async getPatientById(id: string): Promise<Patient | undefined> {
    try {
      const result = await db.query("SELECT * FROM patients WHERE id = $1", [
        id,
      ]);
      return result.rows[0] as Patient | undefined;
    } catch (error) {
      console.error("Get by id failed:", error);
      throw error;
    }
  },

  async executeQuery(query: string, params: any[] = []) {
    try {
      return await db.query(query, params);
    } catch (error) {
      console.error("Query failed:", error);
      throw error;
    }
  },
};

initDB();

export default db;
