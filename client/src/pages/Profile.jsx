import { useContext } from "react";
import AuthContext from "../context/AuthContext";

function Profile() {
  const { user } = useContext(AuthContext);

  if (!user) {
    return <p>Loading profile...</p>;
  }

  return (
    <div className="container mt-4">
      <div className="card shadow-sm mx-auto" style={{ maxWidth: "600px" }}>
        <div className="card-header bg-primary text-white">
          <h3 className="mb-0">My Profile</h3>
        </div>

        <div className="card-body">
          <div className="mb-3">
            <strong>Name:</strong>
            <p>{user.name || "Not available"}</p>
          </div>

          <div className="mb-3">
            <strong>Email:</strong>
            <p>{user.email || "Not available"}</p>
          </div>

          <div className="mb-3">
            <strong>Role:</strong>
            <p className="text-capitalize">{user.role || "Not available"}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;