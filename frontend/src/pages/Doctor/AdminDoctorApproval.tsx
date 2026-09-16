import React, { useCallback, useEffect, useState } from "react";
import { fetchDoctorRequests, updateDoctorStatus } from "../../services/adminService";
import type { Doctor, DoctorStatus } from "../../services/types";
import { Button } from "../../components/ui/Button";
import { Modal } from "../../components/ui/Modal";

type Filter = DoctorStatus | "all";

const FILTERS: { label: string; value: Filter }[] = [
  { label: "Pending", value: "pending" },
  { label: "Approved", value: "approved" },
  { label: "Rejected", value: "rejected" },
  { label: "All", value: "all" },
];

const STATUS_STYLE: Record<DoctorStatus, string> = {
  approved: "text-green-700 bg-green-50 border-green-200",
  rejected: "text-red-700 bg-red-50 border-red-200",
  pending: "text-yellow-700 bg-yellow-50 border-yellow-200",
};

const AdminDoctorApproval: React.FC = () => {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [filter, setFilter] = useState<Filter>("pending");
  const [selected, setSelected] = useState<Doctor | null>(null);
  const [remarks, setRemarks] = useState("");
  const [pendingAction, setPendingAction] = useState<DoctorStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  const loadDoctors = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // Filtering happens server-side; the page used to fetch every doctor and
      // call itself "Requests".
      setDoctors(await fetchDoctorRequests(filter === "all" ? undefined : filter));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not load doctor requests");
    } finally {
      setLoading(false);
    }
  }, [filter]);

  useEffect(() => { loadDoctors(); }, [loadDoctors]);

  const openDetails = (doc: Doctor) => {
    setSelected(doc);
    setRemarks(doc.adminRemarks ?? "");
  };

  const applyStatus = async () => {
    if (!selected || !pendingAction) return;
    setBusy(true);
    setError(null);
    try {
      await updateDoctorStatus(selected._id, pendingAction, remarks);
      setNotice(`${selected.fullName} marked ${pendingAction}.`);
      setPendingAction(null);
      setSelected(null);
      await loadDoctors();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not update status");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4 text-gray-900">Doctor Verification</h1>

      <div className="mb-4 flex flex-wrap gap-2">
        {FILTERS.map((f) => (
          <button
            key={f.value}
            onClick={() => setFilter(f.value)}
            className={`rounded-full border px-4 py-1.5 text-sm font-medium transition ${
              filter === f.value
                ? "border-indigo-600 bg-indigo-600 text-white"
                : "border-gray-300 bg-white text-gray-600 hover:bg-gray-50"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {error && (
        <p className="mb-4 rounded border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-700">{error}</p>
      )}
      {notice && (
        <p className="mb-4 rounded border border-green-200 bg-green-50 px-4 py-2 text-sm text-green-700">{notice}</p>
      )}

      {loading ? (
        <p className="text-gray-500">Loading...</p>
      ) : doctors.length === 0 ? (
        <div className="rounded-lg border border-gray-200 bg-white p-10 text-center text-gray-600">
          No {filter === "all" ? "" : filter} doctor applications.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {doctors.map((doc) => (
            <div key={doc._id} className="bg-white shadow rounded-lg p-4">
              <h2 className="text-lg font-semibold text-gray-900">{doc.fullName}</h2>
              <p className="text-sm text-gray-600">{doc.email}</p>
              <p className="text-sm text-gray-600">{doc.specialization}</p>
              <span className={`mt-2 inline-block rounded-full border px-2 py-0.5 text-xs font-medium ${STATUS_STYLE[doc.status]}`}>
                {doc.status}
              </span>
              <div className="mt-3">
                <Button size="sm" variant="secondary" onClick={() => openDetails(doc)}>
                  View details
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Details */}
      <Modal
        open={Boolean(selected) && !pendingAction}
        onClose={() => setSelected(null)}
        title={selected?.fullName}
        footer={
          <>
            <Button variant="secondary" onClick={() => setSelected(null)}>Close</Button>
            {selected?.status !== "rejected" && (
              <Button variant="danger" onClick={() => setPendingAction("rejected")}>Reject</Button>
            )}
            {selected?.status !== "approved" && (
              <Button onClick={() => setPendingAction("approved")}>Approve</Button>
            )}
          </>
        }
      >
        {selected && (
          <div className="space-y-2 text-sm text-gray-700">
            <p><strong>Email:</strong> {selected.email}</p>
            <p><strong>Phone:</strong> {selected.phone}</p>
            <p><strong>Gender:</strong> {selected.gender}</p>
            {selected.dateOfBirth && <p><strong>DOB:</strong> {selected.dateOfBirth.slice(0, 10)}</p>}
            <p><strong>Specialization:</strong> {selected.specialization}</p>
            <p><strong>Experience:</strong> {selected.experience} years</p>
            <p><strong>Education:</strong> {selected.education?.join(", ")}</p>

            {selected.clinic && (
              <>
                <p><strong>Clinic:</strong> {selected.clinic.name}</p>
                <p><strong>Address:</strong> {selected.clinic.address}</p>
                <p><strong>Consultation:</strong> {selected.clinic.consultationType}</p>
                <p><strong>Fee:</strong> ₹{selected.clinic.consultationFee}</p>
              </>
            )}

            {selected.documents && (
              <div>
                <p className="font-medium">Documents</p>
                <ul className="list-disc pl-5">
                  {selected.documents.degrees?.map((url, i) => (
                    <li key={i}>
                      <a href={url} target="_blank" rel="noreferrer" className="text-blue-600 underline">
                        Degree {i + 1}
                      </a>
                    </li>
                  ))}
                  {selected.documents.license && (
                    <li><a href={selected.documents.license} target="_blank" rel="noreferrer" className="text-blue-600 underline">License</a></li>
                  )}
                  {selected.documents.idProof && (
                    <li><a href={selected.documents.idProof} target="_blank" rel="noreferrer" className="text-blue-600 underline">ID proof</a></li>
                  )}
                </ul>
              </div>
            )}

            {selected.reviewedAt && (
              <p className="text-xs text-gray-500">
                Last reviewed {new Date(selected.reviewedAt).toLocaleString()}
                {typeof selected.reviewedBy === "object" && selected.reviewedBy
                  ? ` by ${selected.reviewedBy.name}`
                  : ""}
              </p>
            )}

            <label className="block pt-2">
              <span className="text-sm font-medium text-gray-700">
                Remarks {selected.status === "rejected" ? "" : "(shown to the doctor if rejected)"}
              </span>
              <textarea
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                rows={3}
                placeholder="Reason for the decision"
                className="mt-1 w-full rounded border border-gray-300 px-3 py-2 text-sm"
              />
            </label>
          </div>
        )}
      </Modal>

      {/* Confirmation — approving or rejecting used to be a single unconfirmed click */}
      <Modal
        open={Boolean(pendingAction)}
        onClose={() => setPendingAction(null)}
        title={`${pendingAction === "approved" ? "Approve" : "Reject"} ${selected?.fullName}?`}
        className="max-w-md"
        footer={
          <>
            <Button variant="secondary" onClick={() => setPendingAction(null)} disabled={busy}>
              Cancel
            </Button>
            <Button
              variant={pendingAction === "approved" ? "primary" : "danger"}
              onClick={applyStatus}
              loading={busy}
            >
              Yes, {pendingAction === "approved" ? "approve" : "reject"}
            </Button>
          </>
        }
      >
        <p className="text-sm text-gray-600">
          {pendingAction === "approved"
            ? "They will be able to log in and will appear in patient search."
            : "They will not be able to log in. Your remarks will be shown to them."}
          {" "}This can be changed again later.
        </p>
      </Modal>
    </div>
  );
};

export default AdminDoctorApproval;
