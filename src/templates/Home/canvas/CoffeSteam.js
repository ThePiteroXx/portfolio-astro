import * as THREE from "three";
import Home from "./Home.js";
import vertexShader from "./shaders/coffeSteam/vertexShader.glsl";
import fragmentShader from "./shaders/coffeSteam/fragmentShader.glsl";

export default class CoffeSteam {
  constructor() {
    const home = new Home();
    this.resources = home.resources;
    this.scene = home.scene;
    this.time = home.time;

    this.setModel();
  }

  setModel() {
    this.model = {};

    this.model.color = "#9f9f91";

    // Material
    this.model.material = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uTimeFrequency: { value: 0.0006 },
        uUvFrequency: { value: new THREE.Vector2(4, 3) },
        uColor: { value: new THREE.Color(this.model.color) },
      },
      vertexShader: vertexShader,
      fragmentShader: fragmentShader,
      transparent: true,
      side: THREE.DoubleSide,
      depthWrite: false,
    });

    // Mesh
    this.model.mesh = this.resources.items.coffeSteam.scene.children[0];
    this.model.mesh.material = this.model.material;
    this.scene.add(this.model.mesh);
  }

  update() {
    this.model.material.uniforms.uTime.value = this.time.elapsed;
  }
}
