import { useState, useEffect } from "react";
import { auth, db } from "../firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { toast } from "react-toastify";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    const fetchUser = async () => {
      const userDoc = await getDoc(doc(db, "users", auth.currentUser.uid));
      if (userDoc.exists()) {
        setUser({ id: userDoc.id, ...userDoc.data() });
        setName(userDoc.data().name);
        setEmail(userDoc.data().email);
      }
    };
    fetchUser();
  }, []);

  const handleUpdateProfile = async () => {
    try {
      await updateDoc(doc(db, "users", auth.currentUser.uid), { name, email });
      toast.success("Profile updated successfully!");
    } catch (error) {
      toast.error("Error updating profile: " + error.message);
    }
  };

  if (!user) return <div>Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="container mx-auto">
        <h1 className="text-3xl font-bold mb-8">Profile</h1>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-2 border rounded"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 border rounded"
            />
          </div>
          <button
            onClick={handleUpdateProfile}
            className="bg-blue-600 text-white p-2 rounded"
          >
            Update Profile
          </button>
        </div>
      </div>
    </div>
  );
}
