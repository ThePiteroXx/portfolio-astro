import * as THREE from "three";

import About from "./About";

export default class Renderer {
  constructor(_options = {}) {
    const about = new About();
    this.targetElement = about.targetElement;
    this.config = about.config;
    this.stats = about.stats;
    this.time = about.time;
    this.sizes = about.sizes;
    this.scene = about.scene;
    this.camera = about.camera;

    this.usePostprocess = false;
    this.setInstance();
  }

  setInstance() {
    this.clearColor = "#0b1523";

    const antialias = Math.min(window.devicePixelRatio, 2) < 2 ? true : false;

    // Renderer
    this.instance = new THREE.WebGLRenderer({
      canvas: this.targetElement,
      alpha: false,
      antialias: antialias,
    });

    // this.instance.setClearColor(0x414141, 1)
    this.instance.setClearColor(this.clearColor, 1);
    this.instance.setSize(this.config.width, this.config.height);
    this.instance.setPixelRatio(this.config.pixelRatio);

    this.instance.physicallyCorrectLights = true;
    this.instance.outputEncoding = THREE.sRGBEncoding;
    this.instance.toneMapping = THREE.ReinhardToneMapping;
    this.instance.toneMappingExposure = 3;

    this.context = this.instance.getContext();

    // Add stats panel
    if (this.stats) {
      this.stats.setRenderPanel(this.context);
    }
  }

  resize() {
    this.config.width = this.sizes.width;
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
      this.instance.render(this.scene, this.camera);
    }

    if (this.stats) {
      this.stats.afterRender();
    }
  }

  destroy() {
    this.instance.renderLists.dispose();
    this.instance.dispose();
    // this.renderTarget.dispose()
    // this.postProcess.composer.renderTarget1.dispose()
    // this.postProcess.composer.renderTarget2.dispose()
  }
}
