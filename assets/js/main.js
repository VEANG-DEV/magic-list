import { AuthUtil } from "./utils/AuthUtil.js";
class Main extends AuthUtil {
  constructor() {
    super();
    this.sessionTimer = null;
    this.init();
  }

  async init() {
    if (false === (await this.#checkAuth())) return;

    AuthUtil.logout();
    AuthUtil.startSessionTimer(this.sessionTimer);
    AuthUtil.displayUserInfo();

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
