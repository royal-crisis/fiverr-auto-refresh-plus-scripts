Promise.all([
  fetch("https://www.fiverr.com/inbox/counters").then(res => res.text()),
  fetch("https://www.fiverr.com/notification_items/unread_count").then(res => res.json())
])
.then(([messagesData, notificationsData]) => {
  var stat = JSON.parse(messagesData);
  var unread_count = stat.unread;
  var notification_count = notificationsData.count;

  if (unread_count > 0 || notification_count > 0) {
    var dashboard = document.querySelector('.seller-main-item');
    var title = document.querySelector('title');

    if (dashboard) {
      // Get the original text without any notifications
      let baseText = dashboard.textContent.split('(')[0].trim();
      
      // Build the notification text
      let notificationText = '';
      if (unread_count > 0) {
        notificationText += `<span data-notification-counter="messages" style="color:red; font-size:0.8em; margin-left: 5px">(${unread_count} Unread)</span>`;
      }
      if (notification_count > 0) {
        notificationText += `<span data-notification-counter="notifications" style="color:orange; font-size:0.8em; margin-left: 10px">(${notification_count} Notifications)</span>`;
      }
      
      // Set the complete text
      dashboard.innerHTML = baseText + notificationText;
    }

    if (title) {
      // Reset title to original text before adding counts
      title.textContent = title.textContent.split('[')[0].trim();
      let titleAddition = '';
      if (unread_count > 0) titleAddition += ` [${unread_count} messages]`;
      if (notification_count > 0) titleAddition += ` [${notification_count} notifications]`;
      title.innerHTML += titleAddition;
    }
  }
})
.catch((error) => {
  console.error('Error fetching counts:', error);
});
