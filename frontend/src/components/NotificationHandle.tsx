export function addNotification(notification: { notification: string, duration: number, type: "warning"|"successful" }) {
    const notificationsContainer = document.querySelector('.notifications-container');
    if (!notificationsContainer) return; // return early if notificationsContainer is null
    
    // create a new notification element
    const notificationEl = document.createElement('div');
    notificationEl.classList.add('notification');
    notificationEl.classList.add(notification.type);
  
    // set the message and timeout for the notification
    notificationEl.textContent = notification.notification;
    const timeoutId = setTimeout(() => {
      notificationEl.remove();
    }, notification.duration * 1000);
  
    // add the notification element to the UI
    notificationsContainer.appendChild(notificationEl);
  
    // return a function that can be used to remove the notification before the timeout
    const removeNotification = () => {
      clearTimeout(timeoutId);
      notificationEl.remove();
    };
    return removeNotification;
  }
  