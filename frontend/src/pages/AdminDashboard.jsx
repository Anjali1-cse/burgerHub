import React from "react";

export default function AdminDashboard() {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  return (
    <div style={{ padding: 20 }}>
      <h2>Admin Dashboard</h2>
      <p>Welcome {user.name}</p>
      <p>(Implement admin routes separately)</p>
    </div>
  );
}
