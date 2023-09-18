import EventEmitter from "~/utils/EventEmitter.js";

export default class Sizes extends EventEmitter {
  /**
   * Constructor
   */
  constructor(element) {
    super();

    this.targetElemet = element;
    this.width = window.innerWidth;
    this.height = window.innerHeight;

    // Canvas size
    this.viewport = {};
    this.sizeViewport = document.createElement("div");
    this.sizeViewport.style.width = "100vw";
    this.sizeViewport.style.height = "100vh";
    this.sizeViewport.style.position = "absolute";
    this.sizeViewport.style.top = 0;
    this.sizeViewport.style.left = 0;
    this.sizeViewport.style.pointerEvents = "none";

    // Resize event
    this.resize = this.resize.bind(this);
    window.addEventListener("resize", this.resize);

    this.resize();
  }

  /**
   * Resize
   */
  resize() {
    this.width = window.innerWidth;
    this.height = window.innerHeight;

    document.body.appendChild(this.sizeViewport);
    this.viewport.width = this.sizeViewport.clientWidth;
    this.viewport.height = this.sizeViewport.clientHeight;
    document.body.removeChild(this.sizeViewport);

    this.trigger("resize");
  }
}
