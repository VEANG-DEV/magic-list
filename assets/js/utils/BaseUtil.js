export class BaseUtil {
  constructor() {
    console.log("BaseUtil initialized");
  }

  // Hide a DOM element with null check
  static _hide(element) {
    if (element) {
      element.style.display = "none";
    }
  }

  // Show a DOM element with optional display type
  static _show(element, displayType = "block") {
    if (element) {
      element.style.display = displayType;
    }
  }

  // Safer localStorage set with try-catch
  static _set(key, value) {
    try {
      const toStore = typeof value === "string" ? value : JSON.stringify(value);
      localStorage.setItem(key, toStore);
    } catch (e) {
      console.error("Failed to save to localStorage", e);
    }
  }

  // Get with error handling
  static _get(key) {
    try {
      const value = localStorage.getItem(key);
      if (value === null) return null;

      try {
        return JSON.parse(value);
      } catch {
        return value;
      }
    } catch (e) {
      console.error("Failed to read from localStorage", e);
      return null;
    }
  }
  
  // Remove is fine as is
  static _remove(key) {
    localStorage.removeItem(key);
  }

  // Delay is perfect
  static _delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  // Redirect is fine
  static _redirect(path) {
    window.location.href = path;
  }
}
