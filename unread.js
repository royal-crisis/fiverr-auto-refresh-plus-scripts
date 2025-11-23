// Configuration
const CONFIG = {
  endpoints: {
    messages: 'https://www.fiverr.com/inbox/counters',
    notifications: 'https://www.fiverr.com/notification_items/unread_count'
  },
  selectors: {
    dashboard: '.seller-main-item',
    title: 'title'
  },
  styles: {
    messages: 'color: #e74c3c; font-size: 0.8em; margin-left: 5px;',
    notifications: 'color: #e67e22; font-size: 0.8em; margin-left: 10px;'
  },
  dataAttributes: {
    counter: 'data-notification-counter',
    originalTitle: 'data-original-title'
  }
};

// Fetch unread message count
async function fetchMessageCount() {
  try {
    const response = await fetch(CONFIG.endpoints.messages);
    if (!response.ok) throw new Error(`Messages API returned ${response.status}`);
    const data = await response.json();
    return data.unread || 0;
  } catch (error) {
    console.error('Error fetching message count:', error);
    return 0;
  }
}

// Fetch notification count
async function fetchNotificationCount() {
  try {
    const response = await fetch(CONFIG.endpoints.notifications);
    if (!response.ok) throw new Error(`Notifications API returned ${response.status}`);
    const data = await response.json();
    return data.count || 0;
  } catch (error) {
    console.error('Error fetching notification count:', error);
    return 0;
  }
}

// Remove existing counter elements from dashboard
function clearExistingCounters(dashboard) {
  const existingCounters = dashboard.querySelectorAll(`[${CONFIG.dataAttributes.counter}]`);
  existingCounters.forEach(counter => counter.remove());
}

// Get or store the original title
function getOriginalTitle(titleElement) {
  if (!titleElement.hasAttribute(CONFIG.dataAttributes.originalTitle)) {
    titleElement.setAttribute(CONFIG.dataAttributes.originalTitle, titleElement.textContent);
  }
  return titleElement.getAttribute(CONFIG.dataAttributes.originalTitle);
}

// Update dashboard with notification counts
function updateDashboard(dashboard, messageCount, notificationCount) {
  clearExistingCounters(dashboard);

  if (messageCount > 0) {
    const messageSpan = document.createElement('span');
    messageSpan.setAttribute(CONFIG.dataAttributes.counter, 'messages');
    messageSpan.style.cssText = CONFIG.styles.messages;
    messageSpan.textContent = `(${messageCount} Unread)`;
    dashboard.appendChild(messageSpan);
  }

  if (notificationCount > 0) {
    const notificationSpan = document.createElement('span');
    notificationSpan.setAttribute(CONFIG.dataAttributes.counter, 'notifications');
    notificationSpan.style.cssText = CONFIG.styles.notifications;
    notificationSpan.textContent = `(${notificationCount} Notifications)`;
    dashboard.appendChild(notificationSpan);
  }
}

// Update browser tab title
function updateTitle(titleElement, messageCount, notificationCount) {
  const originalTitle = getOriginalTitle(titleElement);

  const parts = [];
  if (messageCount > 0) parts.push(`${messageCount} messages`);
  if (notificationCount > 0) parts.push(`${notificationCount} notifications`);

  titleElement.textContent = parts.length > 0
    ? `[${parts.join(', ')}] ${originalTitle}`
    : originalTitle;
}

// Main execution
(async function() {
  const [messageCount, notificationCount] = await Promise.all([
    fetchMessageCount(),
    fetchNotificationCount()
  ]);

  const dashboard = document.querySelector(CONFIG.selectors.dashboard);
  const titleElement = document.querySelector(CONFIG.selectors.title);

  if (dashboard) {
    updateDashboard(dashboard, messageCount, notificationCount);
  }

  if (titleElement) {
    updateTitle(titleElement, messageCount, notificationCount);
  }
})();
