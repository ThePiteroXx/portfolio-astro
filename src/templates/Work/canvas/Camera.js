import * as THREE from "three";
import Work from "./Work.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

export default class Camera {
  constructor() {
    // Options
    const work = new Work();
    this.config = work.config;
    this.debug = work.debug;
    this.time = work.time;
    this.sizes = work.sizes;
    this.targetElement = work.targetElement;
    this.scene = work.scene;

    // Set up
    this.mode = "default"; // defaultCamera \ debugCamera

    this.setInstance();
    this.setModes();
  }

  setInstance() {
    //set fov
    this.fov = 54;
    this.tanFOV = Math.tan(((Math.PI / 180) * this.fov) / 2);
    this.windowHeight = 710;
    const realFov =
      (360 / Math.PI) *
      Math.atan(this.tanFOV * (this.config.height / this.windowHeight));

    // Set up
    this.instance = new THREE.PerspectiveCamera(
      realFov,
      this.config.width / this.config.height,
      0.1,
      100,
    );
    this.instance.rotation.reorder("YXZ");

    this.scene.add(this.instance);
  }

  setModes() {
    this.modes = {};

    // Default
    this.modes.default = {};
    this.modes.default.instance = this.instance.clone();
    this.modes.default.instance.rotation.reorder("YXZ");
    this.modes.default.instance.position.set(0, 0, 7);
    this.modes.default.instance.lookAt(0, 0, 0);

    // Debug
    this.modes.debug = {};
    this.modes.debug.instance = this.instance.clone();
    this.modes.debug.instance.rotation.reorder("YXZ");
    this.modes.debug.instance.position.set(0, 0, 7);

    this.modes.debug.orbitControls = new OrbitControls(
      this.modes.debug.instance,
      this.targetElement,
    );
    this.modes.debug.orbitControls.enabled = this.modes.debug.active;
    this.modes.debug.orbitControls.screenSpacePanning = true;
    this.modes.debug.orbitControls.enableKeys = false;
    this.modes.debug.orbitControls.zoomSpeed = 0.25;
    this.modes.debug.orbitControls.enableDamping = true;
    this.modes.debug.orbitControls.update();
  }

  resize() {
    this.instance.aspect = this.config.width / this.config.height;
    this.instance.fov =
      (360 / Math.PI) *
      Math.atan(this.tanFOV * (this.config.height / this.windowHeight));
    this.instance.updateProjectionMatrix();

    this.modes.default.instance.aspect = this.config.width / this.config.height;
    this.modes.default.instance.fov =
      (360 / Math.PI) *
      Math.atan(this.tanFOV * (this.config.height / this.windowHeight));

    this.modes.default.instance.updateProjectionMatrix();

    this.modes.debug.instance.aspect = this.config.width / this.config.height;
    this.modes.debug.instance.updateProjectionMatrix();
  }

  update() {
    // Update debug orbit controls
    this.modes.debug.orbitControls.update();

    // Apply coordinates
    this.instance.position.copy(this.modes[this.mode].instance.position);
    this.instance.quaternion.copy(this.modes[this.mode].instance.quaternion);
    this.instance.updateMatrixWorld(); // To be used in projection
  }

  destroy() {
    this.modes.debug.orbitControls.destroy();
  }
}
