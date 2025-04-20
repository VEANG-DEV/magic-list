import { BaseUtil } from "./utils/BaseUtil.js";

export class ModalUtil extends BaseUtil {
  constructor() {
    super();
  }

  static modal(modalContent) {
    const modal = document.createElement("div");
    modal.id = "myModal";
    modal.className = "modal";
    modalContent.classList.add("show");
    document.body.appendChild(modal);
    modal.appendChild(modalContent);
    return modal;
  }

  static showModal(modal, duration = 800) {
    modal.style.transition = `opacity ${duration}ms ease-in-out`;
    modal.querySelector(
      ".modal-content"
    ).style.transition = `transform ${duration}ms ease-in-out`;
    modal.style.display = "block";

    setTimeout(() => {
      modal.classList.add("show");
    }, 10);
  }

  static hideModal(modal, duration = 800) {
    modal.classList.remove("show");
    setTimeout(() => {
      modal.style.display = "none";
    }, duration);
  }
}
