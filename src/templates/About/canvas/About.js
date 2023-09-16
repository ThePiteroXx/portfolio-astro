import * as THREE from "three";

import Time from "~/utils/Time.js";
import { getResources } from "~/store/resources.ts";

import Sizes from "./Sizes.js";
import World from "./World.js";

import Renderer from "./Renderer.js";

export default class About {
  static instance;

  constructor(targetElement) {
    if (!targetElement && About.instance) {
      return About.instance;
    }
    About.instance = this;

    this.targetElement = targetElement;

    if (!this.targetElement) {
      console.warn("Missing 'targetElement' property");
      return;
    }

    this.resources = getResources();
    if (!this.resources) throw Error("First, you need set up the resources");

    this.sizes = new Sizes();
    this.time = new Time();
    this.setConfig();
    this.scene = new THREE.Scene();
    this.setCamera();
    this.renderer = new Renderer();
    this.world = new World();

    this.sizes.on("resize", () => {
      this.resize();
    });
  }

  setConfig() {
    this.config = {};

    this.config.pixelRatio = Math.min(Math.max(window.devicePixelRatio, 1), 2);

    this.config.width = this.sizes.width;
    this.config.height = this.sizes.height;

    this.config.debug = this.config.width > 420;
  }

  setCamera() {
    this.camera = new THREE.PerspectiveCamera(
      45,
      this.config.width / this.config.height,
      0.1,
      100,
    );
    this.camera.position.x = 0;
    this.camera.position.y = 0.3;
    this.camera.position.z = 7;

    this.scene.add(this.camera);
  }

  update() {
    this.renderer.update();

    if (this.world) this.world.update();
  }

  resize() {
    // Update sizes
    this.config.width = this.sizes.width;
    this.config.height = this.sizes.height;

    // Update camera
    this.camera.aspect = this.config.width / this.config.height;
    this.camera.updateProjectionMatrix();

    // Update renderer
    if (this.renderer) this.renderer.resize();
  }

  destroy() {
    this.time.stop();
    this.time.off("tick");
    this.sizes.off("resize");
    this.renderer.destroy();
    this.world.destroy();
    this.scene = null;
    this.config = null;
    this.stats = null;
  }
}
