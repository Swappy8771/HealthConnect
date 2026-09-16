import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader } from "../../../components/ui/Card";
import { Avatar, AvatarFallback } from "../../../components/ui/Avatar";
import { getDoctorListings } from "../../../services/doctorListingService";
import { Skeleton } from "../../../components/ui/Skeleton";

// Mirrors what GET /api/patient/doctors returns. `location` and
// `profileImage` were on this type but do not exist on the Doctor schema —
// the address lives on `clinic`, and there is no doctor image field.
type Doctor = {
  _id: string;
  fullName: string;
  specialization: string;
  experience: number;
  clinic?: {
    name?: string;
    address?: string;
    consultationType?: string;
    consultationFee?: number;
  };
};

const DoctorsList: React.FC = () => {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getDoctorListings()
      .then((data) => {
        // The endpoint returns an array; guard so an unexpected shape renders
        // an empty list instead of throwing on .map().
        setDoctors(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch doctors:", err);
        setError(err instanceof Error ? err.message : "Could not load doctors");
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <Card key={i}>
            <CardHeader className="flex gap-4 items-center">
              <Skeleton className="h-12 w-12 rounded-full" />
              <div className="space-y-2 w-full">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            </CardHeader>
            <CardContent>
              <Skeleton className="h-4 w-2/3 mb-2" />
              <Skeleton className="h-4 w-1/2" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-center">
        <p className="text-red-700">{error}</p>
      </div>
    );
  }

  if (doctors.length === 0) {
    return (
      <div className="rounded-lg border border-gray-200 bg-white p-10 text-center">
        <p className="text-gray-600">No doctors are available yet.</p>
        <p className="mt-1 text-sm text-gray-500">
          Doctors appear here once an administrator approves them.
        </p>
      </div>
    );
  }

  const initialsOf = (name: string) =>
    name.split(" ").filter(Boolean).slice(0, 2).map((part) => part[0]).join("").toUpperCase();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {doctors.map((doc) => (
        <Card key={doc._id} className="hover:shadow-lg transition-shadow duration-200">
          <CardHeader className="flex items-center gap-4">
            <Avatar>
              <AvatarFallback initials={initialsOf(doc.fullName)} />
            </Avatar>
            <div>
              <h3 className="font-semibold text-lg text-gray-800">{doc.fullName}</h3>
              <p className="text-sm text-gray-500">{doc.specialization}</p>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600">Experience: {doc.experience} years</p>
            {doc.clinic?.name && (
              <p className="text-sm text-gray-600">Clinic: {doc.clinic.name}</p>
            )}
            {doc.clinic?.address && (
              <p className="text-sm text-gray-600">Location: {doc.clinic.address}</p>
            )}
            {doc.clinic?.consultationFee !== undefined && (
              <p className="text-sm text-gray-600">Fee: ₹{doc.clinic.consultationFee}</p>
            )}
            <Link
              to={`/landing/patient/doctors/${doc._id}/book`}
              className="mt-4 inline-block rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
            >
              Book appointment
            </Link>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default DoctorsList;
