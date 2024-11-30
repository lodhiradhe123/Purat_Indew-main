

const NotificationsAlerts = () => {
  return (
    <div className="flex flex-row space-x-4 h-full">
      <div className="flex-1 pr-4">
        <h3 className="text-xl font-semibold">Email and SMS Alerts</h3>
        <p>Set up notifications for low credits, campaign status, and support ticket updates.</p>
      </div>
      <div className="border-r border-gray-300 h-auto self-stretch"></div> {/* Vertical Line */}
      <div className="flex-1 pl-4">
        <h3 className="text-xl font-semibold">System Announcements</h3>
        <p>Announce new features, maintenance schedules, and important updates.</p>
      </div>
    </div>
  );
};

export default NotificationsAlerts;



