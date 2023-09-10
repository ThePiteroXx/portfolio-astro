import * as THREE from "three";

import Home from "./Home.js";
import vertexShader from "./shaders/baked/vertexShader.glsl";
import fragmentShader from "./shaders/baked/fragmentShader.glsl";
import vertexShaderLamp from "./shaders/lamp/vertexShader.glsl";
import fragmentShaderLamp from "./shaders/lamp/fragmentShader.glsl";

export default class Baked {
  constructor() {
    const home = new Home();
    this.resources = home.resources;
    this.debug = home.debug;
    this.scene = home.scene;
    this.time = home.time;
    this.targetElement = home.targetElement;
    this.camera = home.camera;
    this.width = home.config.width;
    this.height = home.config.height;

    // Debug
    if (this.debug) {
      this.debugFolder = this.debug.addFolder({
        title: "baked",
        expanded: true,
      });
    }

    this.setModel();
    this.setMouse();
    this.setRaycaster();
    this.addLampEventListeners();
  }

  setModel() {
    this.model = {};

    this.model.lampL = this.resources.items.deskModel.scene.children[0];
    this.model.baked = this.resources.items.deskModel.scene.children[1];
    this.model.lamp = this.resources.items.deskModel.scene.children[2];

    this.model.bakedTexture = this.resources.items.baked;
    this.model.bakedTexture.encoding = THREE.sRGBEncoding;
    this.model.bakedTexture.flipY = false;

    this.model.bakedDarkTexture = this.resources.items.darkbaked;
    this.model.bakedDarkTexture.encoding = THREE.sRGBEncoding;
    this.model.bakedDarkTexture.flipY = false;

    this.model.bakedLedTexture = this.resources.items.ledbaked;
    this.model.bakedLedTexture.encoding = THREE.sRGBEncoding;
    this.model.bakedLedTexture.flipY = false;

    this.model.lampLcolorOff = new THREE.Color("#4d4747");
    this.model.lampLcolorOn = new THREE.Color("#fff194");
    this.model.lampL.material = new THREE.MeshBasicMaterial({
      color: this.model.lampLcolorOff,
    });

    this.model.materialBaked = new THREE.ShaderMaterial({
      uniforms: {
        uChangeBaked: { value: false },
        uBakedTextureLight: { value: this.model.bakedTexture },
        uBakedNightTexture: { value: this.model.bakedDarkTexture },
        uLightMapTexture: { value: this.model.bakedLedTexture },
        uLightColor: { value: new THREE.Vector3(0.3, 0.8, 0.8) },
        uNightMix: { value: 1 },
        uNeutralMix: { value: 0 },
        uLightDeskStrength: { value: 1.9 },
      },
      vertexShader,
      fragmentShader,
    });

    this.model.materialLamp = new THREE.ShaderMaterial({
      uniforms: {
        uBakedTextureLight: { value: this.model.bakedTexture },
        uBakedNightTexture: { value: this.model.bakedDarkTexture },
        uLampChange: { value: false },
      },
      vertexShader: vertexShaderLamp,
      fragmentShader: fragmentShaderLamp,
    });

    this.model.baked.traverse((_child) => {
      if (_child instanceof THREE.Mesh) {
        _child.material = this.model.materialBaked;
      }
    });
    this.model.lamp.traverse((_child) => {
      if (_child instanceof THREE.Mesh) {
        _child.material = this.model.materialBaked;
      }
    });
    this.scene.add(this.model.baked, this.model.lampL, this.model.lamp);
  }

  setMouse() {
    this.mouse = new THREE.Vector2();

    this.targetElement.addEventListener("mousemove", (event) => {
      const rect = event.target.getBoundingClientRect();
      this.mouse.x = ((event.clientX - rect.left) / this.width) * 2 - 1;
      this.mouse.y = -((event.clientY - rect.top) / this.height) * 2 + 1;
    });

    this.targetElement.addEventListener(
      "touchstart",
      (event) => {
        const rect = event.target.getBoundingClientRect();
        this.mouse.x =
          ((event.touches[0].clientX - rect.left) / this.width) * 2 - 1;
        this.mouse.y =
          -((event.touches[0].clientY - rect.top) / this.height) * 2 + 1;
      },
      { passive: false },
    );
  }

  setRaycaster() {
    this.raycaster = new THREE.Raycaster();
    this.currentIntersect = null;

    this.turnLight = () => {
      this.targetElement.classList.toggle("clickLamp");

      if (this.targetElement.classList.contains("clickLamp")) {
        this.model.materialBaked.uniforms.uChangeBaked.value = true;
        this.model.lampL.material.color = this.model.lampLcolorOn;
        this.model.materialLamp.uniforms.uLampChange.value = true;
        document.querySelector(".fa-lightbulb").classList.add("active");

        return;
      }
      this.model.materialBaked.uniforms.uChangeBaked.value = false;
      this.model.lampL.material.color = this.model.lampLcolorOff;
      this.model.materialLamp.uniforms.uLampChange.value = false;
      document.querySelector(".fa-lightbulb").classList.remove("active");
    };
  }

  addLampEventListeners() {
    this.targetElement.addEventListener("click", () => {
      if (this.currentIntersect) this.turnLight();
    });
    document.querySelector("#btnLamp").addEventListener("click", () => {
      document.querySelector(".fa-lightbulb").classList.toggle("active");
      this.turnLight();
    });
    // this.targetElement.addEventListener('touchstart', turnLight, {passive: false})
  }

  resize() {
    //update sizes
    this.width = new Home().config.width;
    this.height = new Home().config.height;
  }

  update() {
    // changing led color
    this.model.materialBaked.uniforms.uLightColor.value.x = Math.abs(
      Math.sin(this.time.elapsed * 0.0009),
    );
    this.model.materialBaked.uniforms.uLightColor.value.y = Math.abs(
      Math.cos(this.time.elapsed * 0.0008),
    );
    this.model.materialBaked.uniforms.uLightColor.value.z = Math.abs(
      Math.sin(this.time.elapsed * 0.001),
    );

    // update raycaster
    this.raycaster.setFromCamera(
      this.mouse,
      this.camera.modes.default.instance,
    );

    const intersect = this.raycaster.intersectObject(this.model.lamp);

    if (intersect.length) {
      this.currentIntersect = intersect[0];
      this.model.lamp.material = this.model.materialLamp;
      this.targetElement.style.cursor = "pointer";
    } else {
      this.currentIntersect = null;
      this.targetElement.style.cursor = "default";
      this.model.lamp.material = this.model.materialBaked;
    }
  }
}
