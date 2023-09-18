import * as THREE from "three";

import Time from "~/utils/Time.js";
import { getResources } from "~/store/resources.ts";

import Sizes from "./Sizes.js";
import World from "./World.js";
import Camera from "./Camera.js";
import Renderer from "./Renderer.js";

export default class Work {
  static instance;

  constructor(targetElement) {
    if (!targetElement && Work.instance) {
      return Work.instance;
    }
    Work.instance = this;

    this.targetElement = targetElement;

    if (!this.targetElement) {
      console.warn("Missing 'targetElement' property");
      return;
    }

    this.resources = getResources();
    if (!this.resources) throw Error("First, you need set up the resources");

    this.time = new Time();
    this.sizes = new Sizes();
    this.setConfig();
    this.scene = new THREE.Scene();
    this.camera = new Camera();
    this.renderer = new Renderer();
    this.world = new World();

    this.sizes.on("resize", () => {
      this.resize();
    });
  }

  setConfig() {
    this.config = {};

    this.config.pixelRatio = Math.min(Math.max(window.devicePixelRatio, 1), 2);

    this.config.width = this.sizes.viewport.width;
    this.config.height = this.sizes.viewport.height;

    this.config.scrollRender = false;
  }

  update() {
    this.renderer.update();

    this.camera.update();

    if (this.world) this.world.update();
  }

  resize() {
    // Update sizes
    this.config.width = this.sizes.width;
    this.config.height = this.sizes.height;

    // Update camera
    if (this.camera) this.camera.resize();

    // Update renderer
    if (this.renderer) this.renderer.resize();

    if (this.world) this.world.resize();
  }

  destroy() {
    this.time.stop();
    this.time.off("tick");
    this.sizes.off("resize");
    this.renderer.destroy();
    this.world = null;
    this.scene = null;
    this.config = null;
  }
}
