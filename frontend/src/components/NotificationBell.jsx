const NotificationBell = () => {
  return (
    <div className="relative">
      <button
        className="relative p-2 rounded-full hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
        aria-label="Notifications"
      >
        🔔
      </button>
    </div>
  );
}

export default NotificationBell;
