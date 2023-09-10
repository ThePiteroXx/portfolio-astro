import * as THREE from "three";
import Home from "./Home.js";

export default class Renderer {
  constructor() {
    const home = new Home();
    this.targetElement = home.targetElement;
    this.config = home.config;
    this.stats = home.stats;
    this.time = home.time;
    this.sizes = home.sizes;
    this.scene = home.scene;
    this.camera = home.camera;

    this.usePostprocess = false;

    this.setInstance();
  }

  setInstance() {
    this.clearColor = "#010101";

    const antialias = Math.min(window.devicePixelRatio, 2) < 2 ? true : false;

    // Renderer
    this.instance = new THREE.WebGLRenderer({
      canvas: this.targetElement,
      alpha: false,
      antialias: antialias,
    });

    this.instance.setClearColor(this.clearColor, 1);
    this.instance.setSize(this.config.width, this.config.height);
    this.instance.setPixelRatio(this.config.pixelRatio);

    this.instance.outputEncoding = THREE.sRGBEncoding;

    this.context = this.instance.getContext();

    // Add stats panel
    if (this.stats) {
      this.stats.setRenderPanel(this.context);
    }
  }

  resize() {
    // Instance
    this.instance.setSize(this.config.width, this.config.height);
    this.instance.setPixelRatio(this.config.pixelRatio);
  }

  update() {
    if (this.stats) {
      this.stats.beforeRender();
    }

    if (this.usePostprocess) {
      this.postProcess.composer.render();
    } else {
      this.instance.render(this.scene, this.camera.instance);
    }

    if (this.stats) {
      this.stats.afterRender();
    }
  }

  destroy() {
    this.instance.renderLists.dispose();
    this.instance.dispose();
    this.renderTarget.dispose();
    this.postProcess.composer.renderTarget1.dispose();
    this.postProcess.composer.renderTarget2.dispose();
  }
}
