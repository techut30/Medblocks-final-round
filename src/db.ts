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

const broadcastChannel = new BroadcastChannel("patient-db-sync");

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

class DBEventEmitter {
  public listeners: { [key: string]: Function[] } = {};

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
    dbEvents.listeners[eventName].forEach((callback) => callback(data));
  }
});

export const dbOperations = {
  async insertPatient(patientData: PatientInput) {
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

    dbEvents.emit("patientInserted", result.rows[0] as Patient);
    return result;
  },

  async updatePatient(id: string, patientData: Partial<PatientInput>) {
    const setParts = Object.keys(patientData).map(
      (key, index) => `${key} = ${index + 2}`,
    );
    const values = [id, ...Object.values(patientData)];

    const result = await db.query(
      `UPDATE patients SET ${setParts.join(", ")}, updated_at = CURRENT_TIMESTAMP
       WHERE id = $1
       RETURNING *`,
      values,
    );

    dbEvents.emit("patientUpdated", result.rows[0] as Patient);
    return result;
  },

  async deletePatient(id: string) {
    const result = await db.query(
      "DELETE FROM patients WHERE id = $1 RETURNING *",
      [id],
    );
    dbEvents.emit("patientDeleted", { id });
    return result;
  },

  async getAllPatients(): Promise<{ rows: Patient[] }> {
    const result = await db.query(
      "SELECT * FROM patients ORDER BY created_at DESC",
    );
    return { rows: result.rows as Patient[] };
  },

  async getPatientById(id: string): Promise<{ rows: Patient[] }> {
    const result = await db.query("SELECT * FROM patients WHERE id = $1", [id]);
    return { rows: result.rows as Patient[] };
  },

  async executeQuery(query: string, params: any[] = []) {
    return await db.query(query, params);
  },
};

initDB();

export default db;
