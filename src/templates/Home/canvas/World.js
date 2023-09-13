import * as THREE from "three";

import Baked from "./Baked.js";
import Screen from "./Screen.js";
import CoffeSteam from "./CoffeSteam.js";
import Home from "./Home.js";

export default class World {
  constructor() {
    const home = new Home();
    this.config = home.config;
    this.resources = home.resources;
    this.scene = home.scene;

    this.setBaked();
    this.setScreens();
    this.setCoffeSteam();
  }

  setBaked() {
    this.baked = new Baked();
  }

  setScreens() {
    this.mainMonitor = new Screen(
      this.resources.mainMonitor.scene.children[0].clone(),
      "videos/videoCoding.mp4",
    );

    this.laptopMonitor = new Screen(
      this.resources.laptopMonitor.scene.children[0].clone(),
      "videos/videoYt.mp4",
    );

    this.leftMonitor = this.resources.leftMonitor.scene.children[0].clone();
    this.leftMonitor.material = new THREE.MeshBasicMaterial({
      map: this.resources.leftMonitorTexture,
    });
    this.scene.add(this.leftMonitor);

    this.painting = this.resources.painting.scene.children[0].clone();
    this.painting.material = new THREE.MeshBasicMaterial({
      map: this.resources.paintingTexture,
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
