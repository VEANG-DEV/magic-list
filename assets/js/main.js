import { AuthUtil } from "./utils/AuthUtil.js";
import { ToggleTheme } from "./ToggleDarkMode.js";
class Main extends AuthUtil {
  constructor() {
    super();
    this.sessionTimer = null;
    this.toggleTheme = null;
    this.init();
  }

  async init() {
    if (false === (await this.#checkAuth())) return;

    AuthUtil.logout();
    AuthUtil.startSessionTimer(this.sessionTimer);
    AuthUtil.displayUserInfo();

    //initialize dark mode toggle
    this.toggleTheme = new ToggleTheme();
  }

  async #checkAuth() {
    const isValid = await AuthUtil.validateToken();

    if (!isValid) {
      AuthUtil.clearToken();
      AuthUtil._remove("user");
      AuthUtil._redirect("/pages/login.html");
      return false;
    }

    return true;
  }
}

// Start
document.addEventListener("DOMContentLoaded", () => {
  new Main();
});
