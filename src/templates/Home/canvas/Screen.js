import * as THREE from "three";

import Home from "./Home.js";

export default class Screen {
  constructor(_mesh, _sourcePath) {
    const home = new Home();
    this.scene = home.scene;

    this.mesh = _mesh;
    this.sourcePath = _sourcePath;

    this.setModel();
  }

  setModel() {
    this.model = {};

    // Element
    this.model.element = document.createElement("video");
    this.model.element.muted = true;
    this.model.element.loop = true;
    this.model.element.controls = true;
    this.model.element.playsInline = true;
    this.model.element.autoplay = true;
    this.model.element.src = this.sourcePath;
    this.model.element.play();

    // Texture
    this.model.texture = new THREE.VideoTexture(this.model.element);
    this.model.texture.encoding = THREE.sRGBEncoding;

    // Material
    this.model.material = new THREE.MeshBasicMaterial({
      map: this.model.texture,
    });

    // Mesh
    this.model.mesh = this.mesh;
    this.model.mesh.material = this.model.material;
    this.scene.add(this.model.mesh);
  }

  update() {}
}
