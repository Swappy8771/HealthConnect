import React from "react";

const DoctorHome: React.FC = () => {
  return (
    <div style={styles.container}>
      <h1>Welcome to the Doctor Home Page</h1>
      <p>This is a placeholder for Doctor-specific content after login.</p>
    </div>
  );
};

const styles = {
  container: {
    padding: "2rem",
    textAlign: "center" as const,
    backgroundColor: "#f4f4f4",
    minHeight: "100vh",
  },
};

export default DoctorHome;
