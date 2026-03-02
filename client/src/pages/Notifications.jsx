import { useEffect, useState } from "react";
import API from "../utils/axiosConfig";
import Header from "../layout/Header";

const Notifications = () => {

  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    API.get("/api/v1/notifications/my")
      .then(res => setNotifications(res.data.notifications));
  }, []);

  const markAsRead = async (id) => {
    await API.put(`/api/v1/notifications/read/${id}`);
    setNotifications(prev =>
      prev.map(n =>
        n._id === id ? { ...n, isRead: true } : n
      )
    );
  };

  return (
    <main className="relative flex-1 p-5 pt-28 ">
    <Header />
    <div className="p-10 bg-gray-50 min-h-screen">
      <h2 className="text-2xl font-bold mb-6">
        🔔 Notifications
      </h2>

      {notifications.length === 0 && (
        <p>No notifications available</p>
      )}

      {notifications.map((note) => (
        <div
          key={note._id}
          className={`p-4 mb-3 rounded shadow cursor-pointer
            ${note.isRead ? "bg-white" : "bg-blue-50"}
          `}
          onClick={() => markAsRead(note._id)}
        >
          <p className="font-medium">{note.message}</p>
          <p className="text-sm text-gray-500">
            {new Date(note.createdAt).toLocaleString()}
          </p>
        </div>
      ))}
    </div>
    </main>
  );
};

export default Notifications;