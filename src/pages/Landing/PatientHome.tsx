import React from "react";

const PatientHome: React.FC = () => {
  return (
    <div style={styles.container}>
      <h1>Welcome to the Patient Home Page</h1>
      <p>This is a placeholder for patient-specific content after login.</p>
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

export default PatientHome;
