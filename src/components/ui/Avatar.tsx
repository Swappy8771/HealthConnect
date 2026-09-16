import * as React from "react";

export const Avatar: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="relative inline-block h-14 w-14 rounded-full overflow-hidden bg-gray-200">
    {children}
  </div>
);

export const AvatarImage: React.FC<{ src: string; alt: string }> = ({ src, alt }) => (
  <img className="h-full w-full object-cover" src={src} alt={alt} />
);

export const AvatarFallback: React.FC<{ initials: string }> = ({ initials }) => (
  <div className="flex h-full w-full items-center justify-center text-gray-500 text-sm font-medium">
    {initials}
  </div>
);
