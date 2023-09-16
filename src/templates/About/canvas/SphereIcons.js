import * as THREE from "three";
import About from "./About.js";

import vertexSphereShader from "./shaders/sphere/vertex.glsl";
import fragmentSphereShader from "./shaders/sphere/fragment.glsl";
import vertexAroundSphereShader from "./shaders/sphereAround/vertex.glsl";
import fragmentAroundSphereShader from "./shaders/sphereAround/fragment.glsl";

export default class SphereIcons {
  constructor(_options) {
    const about = new About();
    this.resources = about.resources;
    this.config = about.config;
    this.scene = about.scene;
    this.time = about.time;
    this.camera = about.camera;
    this.targetElemet = about.targetElement;

    this.setModel();
  }

  setModel() {
    this.setSphereIcons();
    this.setLights();
    this.setRaycaster();
    this.setAnimation();
  }

  setSphereIcons() {
    this.model = {};

    //FOG
    const fog = new THREE.Fog("#0b1523", 6, 8);
    this.scene.fog = fog;

    //Group
    this.model.groupIcons = new THREE.Group();
    this.scene.add(this.model.groupIcons);

    //Materials
    this.model.sphereLightMaterial = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
      },
      vertexShader: vertexSphereShader,
      fragmentShader: fragmentSphereShader,
    });

    this.model.sphereAroundMaterial = new THREE.ShaderMaterial({
      side: THREE.BackSide,
      transparent: true,
      blending: THREE.AdditiveBlending,
      vertexShader: vertexAroundSphereShader,
      fragmentShader: fragmentAroundSphereShader,
    });

    //Objects
    this.model.icons = this.resources.icons.scene.children;

    this.model.sphere = this.resources.icons.scene.children.find(
      (child) => child.name === "Sphere",
    );
    this.model.sphere.material = this.model.sphereLightMaterial;

    this.model.sphereIcons = this.resources.icons.scene;
    this.model.sphereIcons.scale.set(2, 2, 2);
    this.model.sphereIcons.position.y = -1.85;
    this.model.groupIcons.add(this.model.sphereIcons);

    this.model.geometrySphereAround = new THREE.SphereBufferGeometry(
      0.4,
      30,
      30,
    );
    this.model.sphereAround = new THREE.Mesh(
      this.model.geometrySphereAround,
      this.model.sphereAroundMaterial,
    );

    this.scene.add(this.model.sphereAround);
  }

  setLights() {
    const directionalLight = new THREE.AmbientLight("#ffffff", 4);
    this.scene.add(directionalLight);

    const pointLight = new THREE.PointLight("#80eaff", 13);
    pointLight.position.y = 0.35;
    this.scene.add(pointLight);
  }

  setAnimation() {
    this.newAxis = new THREE.Vector3(-0.5, -0.5, 0).normalize();
    this.speedAnimation = 0.04;

    this.model.sphereHover = new THREE.Mesh(
      new THREE.SphereBufferGeometry(2, 4, 10),
    );
    this.model.sphereHover.position.z = -0.5;
    this.model.sphereHover.visible = false;
    this.scene.add(this.model.sphereHover);
  }

  setRaycaster() {
    this.mouse = new THREE.Vector2();

    this.targetElemet.addEventListener("mousemove", (event) => {
      const rect = event.target.getBoundingClientRect();
      this.mouse.x = ((event.clientX - rect.left) / this.config.width) * 2 - 1;
      this.mouse.y = -((event.clientY - rect.top) / this.config.height) * 2 + 1;
    });

    this.raycaster = new THREE.Raycaster();
    this.currentIntersect = null;

    this.targetElemet.addEventListener(
      "mousemove",
      () => {
        if (this.currentIntersect) {
          this.speedAnimation = 0.02;
          this.newAxis.set(this.mouse.x, this.mouse.y, 0).normalize();
          return;
        }
        this.speedAnimation = 0.04;
        this.newAxis.set(-0.5, -0.5, 0).normalize();
      },
      false,
    );
  }

  resize() {}

  update() {
    // update raycaster
    this.raycaster.setFromCamera(this.mouse, this.camera);
    const intersect = this.raycaster.intersectObject(this.model.sphereHover);

    if (intersect.length) {
      this.currentIntersect = intersect[0];
    } else {
      this.currentIntersect = null;
    }

    this.model.sphereLightMaterial.uniforms.uTime.value =
      this.time.elapsed * 0.001;
    this.model.groupIcons.rotateOnAxis(this.newAxis, this.speedAnimation);

    if (this.model.icons)
      this.model.icons.forEach((icon) => {
        icon.lookAt(this.camera.position);
        icon.rotateX(Math.PI * 0.5);
      });
  }

  destroy() {}
}
