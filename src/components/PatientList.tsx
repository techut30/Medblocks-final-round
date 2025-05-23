import React, { useState, useEffect } from "react";
import { dbOperations, dbEvents, Patient } from "../db";

export default function PatientList() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [syncStatus, setSyncStatus] = useState("Synced");

  const loadPatients = async () => {
    try {
      setLoading(true);
      const result = await dbOperations.getAllPatients();
      const patients = (result.rows as Patient[]).filter(
        (row) => row && typeof row === "object" && "id" in row && "name" in row,
      );
      setPatients(patients);
    } catch (error) {
      console.error("Error loading patients:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPatients();

    const handlePatientInserted = (patient: Patient) => {
      setPatients((prev) => [patient, ...prev]);
      setSyncStatus("New patient added");
      setTimeout(() => setSyncStatus("Synced"), 2000);
    };

    const handlePatientUpdated = (patient: Patient) => {
      setPatients((prev) =>
        prev.map((p) => (p.id === patient.id ? patient : p)),
      );
      setSyncStatus("Patient updated");
      setTimeout(() => setSyncStatus("Synced"), 2000);
    };

    const handlePatientDeleted = ({ id }: { id: string }) => {
      setPatients((prev) => prev.filter((p) => p.id !== id));
      setSyncStatus("Patient deleted");
      setTimeout(() => setSyncStatus("Synced"), 2000);
    };

    dbEvents.on("patientInserted", handlePatientInserted);
    dbEvents.on("patientUpdated", handlePatientUpdated);
    dbEvents.on("patientDeleted", handlePatientDeleted);

    return () => {
      dbEvents.off("patientInserted", handlePatientInserted);
      dbEvents.off("patientUpdated", handlePatientUpdated);
      dbEvents.off("patientDeleted", handlePatientDeleted);
    };
  }, []);

  const handleDelete = async (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to delete patient "${name}"?`)) {
      try {
        await dbOperations.deletePatient(id);
      } catch (error) {
        console.error("Error deleting patient:", error);
      }
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const calculateAge = (dob: string) => {
    const today = new Date();
    const birthDate = new Date(dob);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }

    return age;
  };

  if (loading) {
    return <div className="loading">Loading patients...</div>;
  }

  return (
    <div className="patient-list">
      <div className="list-header">
        <h2>Registered Patients ({patients.length})</h2>
        <div className="sync-status">
          <span
            className={`sync-indicator ${syncStatus === "Synced" ? "synced" : "updating"}`}
          >
            ● {syncStatus}
          </span>
        </div>
      </div>

      {patients.length === 0 ? (
        <div className="no-patients">
          No patients registered yet. Use the registration form to add patients.
        </div>
      ) : (
        <div className="patients-grid">
          {patients.map((patient) => (
            <div key={patient.id} className="patient-card">
              <div className="patient-header">
                <h3>{patient.name}</h3>
                <div className="patient-actions">
                  <button
                    onClick={() => handleDelete(patient.id, patient.name)}
                    className="delete-btn"
                    title="Delete Patient"
                  >
                    ×
                  </button>
                </div>
              </div>

              <div className="patient-details">
                <div className="detail-row">
                  <span className="label">Age:</span>
                  <span>{calculateAge(patient.dob)} years</span>
                </div>

                <div className="detail-row">
                  <span className="label">DOB:</span>
                  <span>{formatDate(patient.dob)}</span>
                </div>

                {patient.email && (
                  <div className="detail-row">
                    <span className="label">Email:</span>
                    <span>{patient.email}</span>
                  </div>
                )}

                {patient.phone && (
                  <div className="detail-row">
                    <span className="label">Phone:</span>
                    <span>{patient.phone}</span>
                  </div>
                )}

                {patient.address && (
                  <div className="detail-row">
                    <span className="label">Address:</span>
                    <span>{patient.address}</span>
                  </div>
                )}

                <div className="detail-row">
                  <span className="label">Registered:</span>
                  <span>{formatDate(patient.created_at)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
