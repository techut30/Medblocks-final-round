import React, { useState } from "react";
import { dbOperations } from "../db";

interface Patient {
  name: string;
  dob: string;
  email: string;
  phone: string;
  address: string;
}

export default function RegistrationForm() {
  const [formData, setFormData] = useState<Patient>({
    name: "",
    dob: "",
    email: "",
    phone: "",
    address: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage("");

    try {
      await dbOperations.insertPatient(formData);
      setMessage("Patient registered successfully!");
      setFormData({
        name: "",
        dob: "",
        email: "",
        phone: "",
        address: "",
      });
    } catch (error) {
      console.error("Error registering patient:", error);
      setMessage("Error registering patient. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="registration-form">
      <h2>Patient Registration</h2>

      {message && (
        <div
          className={`message ${message.includes("Error") ? "error" : "success"}`}
        >
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Full Name *</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            disabled={isSubmitting}
          />
        </div>

        <div className="form-group">
          <label htmlFor="dob">Date of Birth *</label>
          <input
            type="date"
            id="dob"
            name="dob"
            value={formData.dob}
            onChange={handleChange}
            required
            disabled={isSubmitting}
          />
        </div>

        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            disabled={isSubmitting}
          />
        </div>

        <div className="form-group">
          <label htmlFor="phone">Phone Number</label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            disabled={isSubmitting}
          />
        </div>

        <div className="form-group">
          <label htmlFor="address">Address</label>
          <textarea
            id="address"
            name="address"
            value={formData.address}
            onChange={handleChange}
            rows={3}
            disabled={isSubmitting}
          />
        </div>

        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Registering..." : "Register Patient"}
        </button>
      </form>
    </div>
  );
}
