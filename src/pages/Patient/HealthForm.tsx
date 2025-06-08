import React, { useState } from "react";

const HealthForm: React.FC = () => {
  const [form, setForm] = useState({
    fullName: "",
    age: "",
    gender: "",
    bloodGroup: "",
    phone: "",
    emergencyContactName: "",
    emergencyContactPhone: "",
    medication: "",
    chronicDiseases: "",
    allergies: "",
    surgeries: "",
    smoking: "No",
    alcohol: "No",
    activityLevel: "Moderate",
    sleepHours: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Submitted Health Form:", form);
    alert("Health details submitted successfully!");
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-semibold mb-4 text-blue-600">Patient Health Details</h2>
      <form onSubmit={handleSubmit} className="space-y-4">

        {/* Personal Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input name="fullName" placeholder="Full Name" required className="border px-4 py-2 rounded" onChange={handleChange} />
          <input name="age" type="number" placeholder="Age" required className="border px-4 py-2 rounded" onChange={handleChange} />
          <select name="gender" required className="border px-4 py-2 rounded" onChange={handleChange}>
            <option value="">Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
          <input name="bloodGroup" placeholder="Blood Group (e.g., A+, O-)" required className="border px-4 py-2 rounded" onChange={handleChange} />
          <input name="phone" placeholder="Phone Number" required className="border px-4 py-2 rounded" onChange={handleChange} />
          <input name="emergencyContactName" placeholder="Emergency Contact Name" className="border px-4 py-2 rounded" onChange={handleChange} />
          <input name="emergencyContactPhone" placeholder="Emergency Contact Number" className="border px-4 py-2 rounded" onChange={handleChange} />
        </div>

        {/* Medical History */}
        <textarea name="medication" placeholder="Current Medications (if any)" className="w-full border px-4 py-2 rounded" onChange={handleChange} />
        <textarea name="chronicDiseases" placeholder="Chronic Diseases (e.g., Diabetes, Asthma)" className="w-full border px-4 py-2 rounded" onChange={handleChange} />
        <textarea name="allergies" placeholder="Allergies (optional)" className="w-full border px-4 py-2 rounded" onChange={handleChange} />
        <textarea name="surgeries" placeholder="Past Surgeries or Hospitalizations" className="w-full border px-4 py-2 rounded" onChange={handleChange} />

        {/* Lifestyle */}
     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
  {/* Smoking Question */}
  <div>
    <label htmlFor="smoking" className="block text-sm font-medium text-gray-700 mb-1">
      Do you smoke?
    </label>
    <select
      id="smoking"
      name="smoking"
      className="w-full border px-4 py-2 rounded"
      onChange={handleChange}
    >
      <option value="">Select</option>
      <option value="No">No</option>
      <option value="Yes">Yes</option>
    </select>
  </div>

  {/* Alcohol Question */}
  <div>
    <label htmlFor="alcohol" className="block text-sm font-medium text-gray-700 mb-1">
      Do you drink alcohol?
    </label>
    <select
      id="alcohol"
      name="alcohol"
      className="w-full border px-4 py-2 rounded"
      onChange={handleChange}
    >
      <option value="">Select</option>
      <option value="No">No</option>
      <option value="Yes">Yes</option>
    </select>
  </div>

  {/* Activity Level */}
  <div>
    <label htmlFor="activityLevel" className="block text-sm font-medium text-gray-700 mb-1">
      What is your activity level?
    </label>
    <select
      id="activityLevel"
      name="activityLevel"
      className="w-full border px-4 py-2 rounded"
      onChange={handleChange}
    >
      <option value="">Select</option>
      <option value="Low">Low</option>
      <option value="Moderate">Moderate</option>
      <option value="High">High</option>
    </select>
  </div>

  {/* Sleep Hours */}
  <div>
    <label htmlFor="sleepHours" className="block text-sm font-medium text-gray-700 mb-1">
      How many hours do you sleep per night?
    </label>
    <input
      id="sleepHours"
      name="sleepHours"
      type="number"
      min="0"
      className="w-full border px-4 py-2 rounded"
      placeholder="e.g., 7"
      onChange={handleChange}
    />
  </div>
</div>


        <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
          Submit Health Details
        </button>
      </form>
    </div>
  );
};

export default HealthForm;
