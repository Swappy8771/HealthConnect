import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader } from "../../../components/ui/Card";
import { Avatar, AvatarImage, AvatarFallback } from "../../../components/ui/Avatar";
import { getDoctorListings } from "../../../services/doctorListingService";
import { Skeleton } from "../../../components/ui/Skeleton";

type Doctor = {
  _id: string;
  fullName: string;
  specialization: string;
  experience: number;
  location: string;
  profileImage?: string;
};

const DoctorsList: React.FC = () => {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getDoctorListings()
      .then((data) => {
        setDoctors(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch doctors:", err);
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

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {doctors.map((doc) => (
        <Card key={doc._id} className="hover:shadow-lg transition-shadow duration-200">
          <CardHeader className="flex items-center gap-4">
            <Avatar>
              <AvatarImage src={doc.profileImage || "/default-doctor.png"} alt={""} />
              <AvatarFallback initials={""}>{doc.fullName.slice(0, 2)}</AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-semibold text-lg text-gray-800">{doc.fullName}</h3>
              <p className="text-sm text-gray-500">{doc.specialization}</p>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600">Experience: {doc.experience} years</p>
            <p className="text-sm text-gray-600">Location: {doc.location}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default DoctorsList;
