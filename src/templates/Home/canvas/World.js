import * as THREE from "three";
import Baked from "./Baked.js";
import Screen from "./Screen.js";
import CoffeSteam from "./CoffeSteam.js";
import Home from "./Home.js";

export default class World {
  constructor() {
    const home = new Home();
    this.targetElement = home.targetElement;
    this.config = home.config;
    this.resources = home.resources;
    this.debug = home.debug;
    this.scene = home.scene;
    this.time = home.time;
    this.camera = home.camera;

    this.resources.on("groupEnd", (_group) => {
      if (_group.name === "base") {
        this.setBaked();
        this.setScreens();
        this.setCoffeSteam();
      }
    });
  }

  setBaked() {
    this.baked = new Baked();
  }

  setScreens() {
    this.mainMonitor = new Screen(
      this.resources.items.mainMonitor.scene.children[0],
      "videos/videoCoding.mp4",
    );

    this.laptopMonitor = new Screen(
      this.resources.items.laptopMonitor.scene.children[0],
      "videos/videoYt.mp4",
    );

    this.leftMonitor = this.resources.items.leftMonitor.scene.children[0];
    this.leftMonitor.material = new THREE.MeshBasicMaterial({
      map: this.resources.items.leftMonitorTexture,
    });
    this.scene.add(this.leftMonitor);

    this.painting = this.resources.items.painting.scene.children[0];
    this.painting.material = new THREE.MeshBasicMaterial({
      map: this.resources.items.paintingTexture,
    });
    this.scene.add(this.painting);
  }

  setCoffeSteam() {
    this.coffeSteam = new CoffeSteam();
  }

  resize() {
    if (this.baked) this.baked.resize();
  }

  update() {
    if (this.coffeSteam) this.coffeSteam.update();

    if (this.baked) this.baked.update();
  }

  destroy() {
    this.coffeSteam = null;
    this.baked = null;
  }
}
