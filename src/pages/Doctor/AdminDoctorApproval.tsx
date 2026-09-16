import React, { useEffect, useState } from "react";
import { fetchDoctorRequests, updateDoctorStatus } from "../../services/adminService";

interface Doctor {
  _id: string;
  fullName: string;
  email: string;
  phone: string;
  gender: string;
  dateOfBirth?: string;
  specialization: string;
  experience: number;
  education: string[];
  clinic?: {
    name?: string;
    address?: string;
    consultationType?: string;
    consultationFee?: number;
  };
  documents?: {
    degrees?: string[];
    license?: string;
    idProof?: string;
  };
  status: string;
  adminRemarks?: string;
}

const AdminDoctorApproval: React.FC = () => {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const loadDoctors = async () => {
    try {
      const data = await fetchDoctorRequests();
      setDoctors(data);
    } catch (error) {
      console.error("Error fetching doctors:", error);
      alert((error as Error).message);
    }
  };

  useEffect(() => {
    loadDoctors();
  }, []);

  const handleStatusChange = async (id: string, status: "approved" | "rejected") => {
    try {
      await updateDoctorStatus(id, status);
      await loadDoctors();
      setModalOpen(false);
    } catch (error) {
      console.error(`Error updating doctor status:`, error);
      alert((error as Error).message);
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-6 text-center text-blue-700">Doctor Verification Requests</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {doctors.map((doc) => (
          <div key={doc._id} className="bg-white shadow p-4 rounded">
            <h2 className="text-lg font-semibold">{doc.fullName}</h2>
            <p>Email: {doc.email}</p>
            <p>Specialization: {doc.specialization}</p>
            <p>Status: <span className={
              doc.status === "approved" ? "text-green-600" :
              doc.status === "rejected" ? "text-red-600" : "text-yellow-600"
            }>{doc.status}</span></p>
            <button
              className="mt-2 text-blue-500 underline"
              onClick={() => {
                setSelectedDoctor(doc);
                setModalOpen(true);
              }}
            >
              View Details
            </button>
          </div>
        ))}
      </div>

      {/* Modal */}
      {modalOpen && selectedDoctor && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-2xl p-6 rounded shadow-lg overflow-y-auto max-h-[90vh]">
            <h2 className="text-xl font-bold mb-4">{selectedDoctor.fullName}</h2>
            <div className="space-y-2">
              <p><strong>Email:</strong> {selectedDoctor.email}</p>
              <p><strong>Phone:</strong> {selectedDoctor.phone}</p>
              <p><strong>Gender:</strong> {selectedDoctor.gender}</p>
              <p><strong>DOB:</strong> {selectedDoctor.dateOfBirth?.slice(0, 10)}</p>
              <p><strong>Specialization:</strong> {selectedDoctor.specialization}</p>
              <p><strong>Experience:</strong> {selectedDoctor.experience} years</p>
              <p><strong>Education:</strong> {selectedDoctor.education?.join(", ")}</p>

              {selectedDoctor.clinic && (
                <>
                  <p><strong>Clinic Name:</strong> {selectedDoctor.clinic.name}</p>
                  <p><strong>Clinic Address:</strong> {selectedDoctor.clinic.address}</p>
                  <p><strong>Consultation Type:</strong> {selectedDoctor.clinic.consultationType}</p>
                  <p><strong>Fee:</strong> ₹{selectedDoctor.clinic.consultationFee}</p>
                </>
              )}

              {selectedDoctor.documents && (
                <div>
                  <p><strong>Degrees:</strong></p>
                  <ul className="list-disc pl-5">
                    {selectedDoctor.documents.degrees?.map((url, i) => (
                      <li key={i}><a href={url} target="_blank" rel="noreferrer" className="text-blue-500 underline">Degree {i + 1}</a></li>
                    ))}
                  </ul>
                  <p><a href={selectedDoctor.documents.license} target="_blank" rel="noreferrer" className="text-blue-500 underline">License</a></p>
                  <p><a href={selectedDoctor.documents.idProof} target="_blank" rel="noreferrer" className="text-blue-500 underline">ID Proof</a></p>
                </div>
              )}
            </div>

            <div className="mt-6 flex gap-4 justify-end">
              <button
                onClick={() => handleStatusChange(selectedDoctor._id, "approved")}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
              >
                Approve
              </button>
              <button
                onClick={() => handleStatusChange(selectedDoctor._id, "rejected")}
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
              >
                Reject
              </button>
              <button
                onClick={() => setModalOpen(false)}
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDoctorApproval;
