import { BaseUtil } from "./BaseUtil.js";

export class AuthUtil extends BaseUtil {
  static USERS_KEY = "app_users";
  static TOKEN_KEY = "auth_token";
  static TOKEN_EXPIRY_KEY = "token_expiry";
  static TOKEN_DURATION = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

  static initUsers() {
    if (!this._get(this.USERS_KEY)) {
      this._set(this.USERS_KEY, {});
    }
  }

  // Simple client-side hashing (for educational purposes only)
  static hashPassword(password) {
    let hash = 0;
    for (let i = 0; i < password.length; i++) {
      const char = password.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash;
    }
    return hash.toString(36) + password.length;
  }

  static async validateToken() {
    const token = this.getToken();
    if (!token) return false;

    const expiry = this._get(this.TOKEN_EXPIRY_KEY);
    if (!expiry || Date.now() > parseInt(expiry)) {
      this.clearToken();
      return false;
    }

    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(this.isValidToken(token));
      }, 300);
    });
  }

  static getToken() {
    return this._get(this.TOKEN_KEY);
  }

  static setToken(token) {
    const expiry = Date.now() + this.TOKEN_DURATION;
    this._set(this.TOKEN_KEY, token);
    this._set(this.TOKEN_EXPIRY_KEY, expiry.toString());
  }

  static clearToken() {
    this._remove(this.TOKEN_KEY);
    this._remove(this.TOKEN_EXPIRY_KEY);
  }

  static isValidToken(token) {
    return !!token && token.startsWith("mock-jwt-");
  }

  static generateToken(email) {
    const randomPart = Math.random().toString(36).substring(2, 15);
    const timePart = Date.now().toString(36);
    return `mock-jwt-${btoa(email)}-${randomPart}-${timePart}`;
  }

  static getRemainingSessionTime() {
    const expiry = this._get(this.TOKEN_EXPIRY_KEY);
    if (!expiry) return 0;
    return Math.max(0, parseInt(expiry) - Date.now());
  }

  static async login(email, password) {
    return new Promise((resolve) => {
      setTimeout(() => {
        this.initUsers();
        const users = this._get(this.USERS_KEY);
        const user = users[email];

        if (!user) {
          resolve({ error: "Invalid user, Please sing-up" });
          return;
        }

        // Verify hashed password
        if (this.hashPassword(password) !== user.password) {
          resolve({ error: "Invalid password" });
          return;
        }

        const token = this.generateToken(email);
        this.setToken(token);

        resolve({
          token,
          user: { email: user.email, name: user.name },
        });
      }, 1000);
    });
  }

  static async signup(name, email, password) {
    return new Promise((resolve) => {
      setTimeout(() => {
        this.initUsers();
        const users = this._get(this.USERS_KEY);

        if (users[email]) {
          resolve({ error: "Email already exists" });
          return;
        }

        if (password.length < 8) {
          resolve({ error: "Password must be at least 8 characters" });
          return;
        }

        // Store user with hashed password
        users[email] = {
          name,
          email,
          password: this.hashPassword(password),
          createdAt: new Date().toISOString(),
        };

        this._set(this.USERS_KEY, users);

        // Auto-login after signup
        const token = this.generateToken(email);
        this.setToken(token);

        resolve({
          token,
          user: { email, name },
        });
      }, 1500);
    });
  }

  static logout() {
    document.getElementById("logoutBtn")?.addEventListener("click", () => {
      this.clearToken();
      this._remove("user");
      this._redirect("/pages/login.html");
    });
  }

  static getCurrentUser() {
    const token = this._get(this.TOKEN_KEY);
    if (!token) return null;

    try {
      // Extract email from mock token
      const email = atob(token.split("-")[2]);
      const users = this._get(this.USERS_KEY) || {};
      return users[email] || null;
    } catch {
      return null;
    }
  }

  // Start SessionTimer
  static startSessionTimer(sessionTimer) {
    if (sessionTimer) {
      clearInterval(sessionTimer);
    }

    this.updateSessionTimer();

    sessionTimer = setInterval(() => {
      this.updateSessionTimer();
    }, 6000); // 60,000ms = 1 minute
  }

  static updateSessionTimer() {
    const remainingTime = this.getRemainingSessionTime();

    this.displayRemainingTime(remainingTime);
    if (remainingTime <= 0) {
      this.handleSessionExpiry();
    }
  }

  static displayRemainingTime(ms) {
    const hours = Math.floor(ms / (1000 * 60 * 60));
    const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));

    const timerElement = document.getElementById("sessionTimer");
    if (timerElement) {
      timerElement.textContent = `Session expires in ${hours}h ${minutes}m`;
    }
  }

  static handleSessionExpiry() {
    clearInterval(this.sessionTimer);
    this.sessionTimer = null;

    this.clearToken();
    this._remove("user");

    alert("Your session has expired. Please login again.");

    this._redirect("/pages/login.html");
  }

  static displayUserInfo() {
    const user = this.getCurrentUser();
    const userInfoElement = document.getElementById("userInfo");

    if (userInfoElement && user) {
      userInfoElement.textContent = `Welcome, ${user.name}`;
    }
  }
}
