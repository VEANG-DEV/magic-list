import { BaseUtil } from "./baseUtil.js";

export class Util extends BaseUtil {
  constructor() {
    super();
    console.log("Util initialized");
  }

  utilMethod() {
    console.log("Method from Util");
  }
}
