import { AuthUtil } from "./utils/AuthUtil.js";

export class AuthForm extends AuthUtil {
  constructor(formId, isLoginForm = true) {
    super();
    this.form = document.getElementById(formId);
    this.isLoginForm = isLoginForm;

    // Common fields
    this.emailInput = document.getElementById("email");
    this.passwordInput = document.getElementById("password");

    // Signup-specific fields
    this.nameInput = document.getElementById("name");
    this.confirmPasswordInput = document.getElementById("confirmPassword");

    this.initEventListeners();
  }

  initEventListeners() {
    this.form.addEventListener("submit", (e) => this.handleSubmit(e));

    if (!this.isLoginForm && this.confirmPasswordInput) {
      this.confirmPasswordInput.addEventListener("input", () => {
        this.validatePasswordMatch();
      });
    }
  }

  async handleSubmit(e) {
    e.preventDefault();

    if (this.isLoginForm) {
      await this.handleLogin();
    } else {
      await this.handleSignup();
    }
  }

  async handleLogin() {
    const email = this.emailInput.value.trim();
    const password = this.passwordInput.value.trim();

    if (!this.validateEmail(email)) {
      this.showError("Please enter a valid email address");
      return;
    }

    if (password.length < 6) {
      this.showError("Password must be at least 6 characters long");
      return;
    }

    await this.login(email, password);
  }

  async handleSignup() {
    const email = this.emailInput.value.trim();
    const password = this.passwordInput.value.trim();
    const name = this.nameInput?.value.trim();
    const confirmPassword = this.confirmPasswordInput?.value.trim();

    if (!name || name.length < 2) {
      this.showError("Please enter a valid name");
      return;
    }

    if (!this.validateEmail(email)) {
      this.showError("Please enter a valid email address");
      return;
    }

    if (password.length < 8) {
      this.showError("Password must be at least 8 characters long");
      return;
    }

    if (password !== confirmPassword) {
      this.showError("Passwords do not match");
      return;
    }

    await this.signup(name, email, password);
  }

  async login(email, password) {
    try {
      this.showLoading(true);
      const response = await AuthUtil.login(email, password);

      if (response?.token) {
        AuthUtil._set("user", response.user);
        AuthUtil.startSessionTimer();
        AuthUtil._redirect("/index.html");
      } else {
        this.showError(response?.error || "Invalid credentials");
      }
    } catch (error) {
      this.showError("Login failed. Please try again.");
      console.error("Login error:", error);
    } finally {
      this.showLoading(false);
    }
  }

  async signup(name, email, password) {
    try {
      this.showLoading(true);
      const response = await AuthUtil.signup(name, email, password);

      if (response?.token) {
        AuthUtil._set("user", response.user);
        AuthUtil.startSessionTimer();
        AuthUtil._redirect("/index.html");
      } else {
        this.showError(response?.error || "Signup failed. Please try again.");
      }
    } catch (error) {
      this.showError(error.message || "Signup failed. Please try again.");
      console.error("Signup error:", error);
    } finally {
      this.showLoading(false);
    }
  }

  validatePasswordMatch() {
    if (!this.isLoginForm) {
      const password = this.passwordInput.value;
      const confirmPassword = this.confirmPasswordInput.value;

      if (password && confirmPassword && password !== confirmPassword) {
        this.confirmPasswordInput.setCustomValidity("Passwords do not match");
      } else {
        this.confirmPasswordInput.setCustomValidity("");
      }
    }
  }

  showError(message) {
    const existingError = this.form.querySelector(".error-message");
    if (existingError) existingError.remove();

    const errorElement = document.createElement("div");
    errorElement.className = "error-message alert alert-danger";
    errorElement.textContent = message;
    this.form.prepend(errorElement);

    setTimeout(() => {
      errorElement.remove();
    }, 5000);
  }

  showLoading(show) {
    const submitButton = this.form.querySelector("button[type='submit']");
    if (submitButton) {
      submitButton.disabled = show;
      submitButton.innerHTML = show
        ? '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Processing...'
        : this.isLoginForm
        ? "Sign In"
        : "Sign Up";
    }
  }

  validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  }
}
