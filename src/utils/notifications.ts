import { CONFIG } from "../config";

type NotificationType = "error" | "success" | "info";

export const notifications = {
  show(
    message: string,
    type: NotificationType = "error",
    duration: number = Number(CONFIG.NOTIFICATIONS.AUTO_HIDE_DELAY),
  ): void {
    const existingNotifications = document.querySelectorAll(
      `.notification-${type}`,
    );
    existingNotifications.forEach((notification) => notification.remove());

    const notification = document.createElement("div");
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    notification.setAttribute("role", "alert");
    notification.setAttribute("aria-live", "polite");

    document.body.appendChild(notification);

    setTimeout(() => {
      notification.classList.add("notification-hide");
      setTimeout(() => {
        if (notification.parentNode) {
          notification.remove();
        }
      }, 300);
    }, duration);
  },

  error(message: string, duration?: number): void {
    this.show(message, "error", duration);
  },

  success(message: string, duration?: number): void {
    this.show(message, "success", duration);
  },

  info(message: string, duration?: number): void {
    this.show(message, "info", duration);
  },
};
