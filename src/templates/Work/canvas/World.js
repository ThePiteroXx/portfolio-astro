import * as THREE from "three";
import Work from "./Work.js";

import Photos from "./Photos.js";
import galaxyVertexShader from "./shaders/galaxy/vertex.glsl";
import galaxyFragmentShader from "./shaders/galaxy/fragment.glsl";

export default class World {
  constructor(_options) {
    const work = new Work();
    this.scene = work.scene;
    this.renderer = work.renderer.instance;

    this.createImages();
    this.setHeader();
    this.createBackgroundScene();
  }

  createImages() {
    this.photos = new Photos();
  }

  setHeader() {
    this.header = document.querySelector(".work__container__heading");

    this.header.style.transform = `translate(-50%, ${this.photos.putDistanceY(
      -0.35,
      false,
    )}px)`;
    // this.header.style.transform = `matrix(1,0,0,1,0,${this.photos.putDistanceY(-0.35, false)})`
  }

  createBackgroundScene() {
    this.backgroundScene = {
      parameters: {
        count: 5000,
        size: 0.04,
        color: new THREE.Color("#00c9c8"),
      },
    };

    this.backgroundScene.material = new THREE.ShaderMaterial({
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      vertexColors: true,
      uniforms: {
        uTime: { value: 0 },
        uSize: { value: 30 * this.renderer.getPixelRatio() },
      },
      vertexShader: galaxyVertexShader,
      fragmentShader: galaxyFragmentShader,
    });
    this.backgroundScene.geometry = new THREE.BufferGeometry();
    this.backgroundScene.colors = new Float32Array(
      this.backgroundScene.parameters.count * 3,
    );
    this.backgroundScene.positions = new Float32Array(
      this.backgroundScene.parameters.count * 3,
    );
    this.backgroundScene.scales = new Float32Array(
      this.backgroundScene.parameters.count * 1,
    );

    for (let i = 0; i < this.backgroundScene.parameters.count; i++) {
      const i3 = i * 3;
      const angle = Math.random() * Math.PI * 2;
      const radiusX = 7 + Math.random() * 4;
      const radiusY = 3 + Math.random() * 4;
      this.backgroundScene.positions[i3] = Math.sin(angle) * radiusX;
      this.backgroundScene.positions[i3 + 1] = Math.cos(angle) * radiusY;
      this.backgroundScene.positions[i3 + 2] = (Math.random() - 1) * 3;

      this.backgroundScene.colors[i3] = this.backgroundScene.parameters.color.r;
      this.backgroundScene.colors[i3 + 1] =
        this.backgroundScene.parameters.color.g;
      this.backgroundScene.colors[i3 + 2] =
        this.backgroundScene.parameters.color.b;

      this.backgroundScene.scales[i] = Math.random();
    }

    this.backgroundScene.geometry.setAttribute(
      "position",
      new THREE.BufferAttribute(this.backgroundScene.positions, 3),
    );
    this.backgroundScene.geometry.setAttribute(
      "aScale",
      new THREE.BufferAttribute(this.backgroundScene.scales, 1),
    );
    this.backgroundScene.geometry.setAttribute(
      "color",
      new THREE.BufferAttribute(this.backgroundScene.colors, 3),
    );

    this.backgroundScene.points = new THREE.Points(
      this.backgroundScene.geometry,
      this.backgroundScene.material,
    );
    this.scene.add(this.backgroundScene.points);
  }

  resize() {
    if (this.photos) this.photos.resize();
  }

  update() {
    if (this.photos) this.photos.update();

    if (this.header)
      this.header.style.transform = `translate(-50%, ${
        this.photos.putDistanceY(-0.35, false) +
        this.photos.scroll.position * 1.8
      }px)`;

    if (this.backgroundScene) {
      for (let i = 0; i < this.backgroundScene.parameters.count; i++) {
        let i3 = i * 3;
        this.backgroundScene.positions[i3 + 2] += 0.01;
        if (this.backgroundScene.positions[i3 + 2] > 4)
          this.backgroundScene.positions[i3 + 2] = (Math.random() - 0.5) * 3;
      }
      this.backgroundScene.geometry.attributes.position.needsUpdate = true;
    }
  }
}
