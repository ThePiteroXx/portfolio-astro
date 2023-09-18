import * as THREE from "three";
import Work from "./Work.js";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass.js";

import vertexShader from "./shaders/post/vertex.glsl";
import fragmentShader from "./shaders/post/fragment.glsl";

export default class Renderer {
  constructor() {
    const work = new Work();
    this.targetElement = work.targetElement;
    this.resources = work.resources;
    this.config = work.config;
    this.debug = work.debug;
    this.stats = work.stats;
    this.time = work.time;
    this.sizes = work.sizes;
    this.scene = work.scene;
    this.camera = work.camera;
    this.usePostprocess = true;
    this.setInstance();
    this.setPostProcess();
    this.setMouse();
  }

  setInstance() {
    this.clearColor = "#0b1523";

    // Renderer
    this.instance = new THREE.WebGLRenderer({
      canvas: this.targetElement,
      alpha: false,
      antialias: false,
    });

    // this.instance.setClearColor(0x414141, 1)
    this.instance.setClearColor(this.clearColor, 1);
    this.instance.setSize(this.config.width, this.config.height);
    this.instance.setPixelRatio(this.config.pixelRatio);

    this.instance.physicallyCorrectLights = true;
    this.instance.outputEncoding = THREE.sRGBEncoding;
    this.instance.toneMapping = THREE.ReinhardToneMapping;
    this.instance.toneMappingExposure = 3;

    this.context = this.instance.getContext();

    // Add stats panel
    if (this.stats) {
      this.stats.setRenderPanel(this.context);
    }
  }

  setPostProcess() {
    this.postProcess = {};

    /**
     * Render pass
     */
    this.postProcess.renderPass = new RenderPass(
      this.scene,
      this.camera.instance,
    );

    /**
     * Effect composer
     */
    // const RenderTargetClass = this.config.pixelRatio >= 2 ? THREE.WebGLRenderTarget : THREE.WebGLMultisampleRenderTarget
    const RenderTargetClass = THREE.WebGLRenderTarget;

    this.renderTarget = new RenderTargetClass(
      this.config.width,
      this.config.height,
      {
        generateMipmaps: false,
        minFilter: THREE.LinearFilter,
        magFilter: THREE.LinearFilter,
        format: THREE.RGBFormat,
        encoding: THREE.sRGBEncoding,
      },
    );
    this.postProcess.composer = new EffectComposer(this.instance);
    this.postProcess.composer.setSize(this.config.width, this.config.height);
    this.postProcess.composer.setPixelRatio(this.config.pixelRatio);

    this.postProcess.composer.addPass(this.postProcess.renderPass);

    this.postProcess.customPass = new ShaderPass({
      uniforms: {
        tDiffuse: { value: null },
        distort: { value: 0 },
        resolution: {
          value: new THREE.Vector2(1, window.innerHeight / window.innerWidth),
        },
        uMouse: { value: new THREE.Vector2(-10, -10) },
        uVelo: { value: 0 },
        uScale: { value: 0 },
        time: { value: 0 },
      },
      vertexShader: vertexShader,
      fragmentShader: fragmentShader,
    });
    this.postProcess.composer.addPass(this.postProcess.customPass);
  }

  setMouse() {
    this.mouse = new THREE.Vector2();
    this.prevMouse = new THREE.Vector2();
    this.followMouse = new THREE.Vector2();
    this.targetSpeed = 0;

    window.addEventListener("mousemove", (event) => {
      this.mouse.x = event.clientX / window.innerWidth;
      this.mouse.y = -(event.clientY / window.innerHeight) + 1;
    });
  }

  resize() {
    // Instance
    this.instance.setSize(this.config.width, this.config.height);
    this.instance.setPixelRatio(this.config.pixelRatio);

    // Post process
    this.postProcess.composer.setSize(this.config.width, this.config.height);
    this.postProcess.composer.setPixelRatio(this.config.pixelRatio);

    this.postProcess.customPass.uniforms.resolution.value.y =
      this.config.height / this.config.width;
  }

  update() {
    if (this.stats) {
      this.stats.beforeRender();
    }

    if (this.usePostprocess) {
      this.postProcess.customPass.uniforms.time.value = this.time.elapsed;

      this.speed = Math.sqrt(
        (this.prevMouse.x - this.mouse.x) ** 2 +
          (this.prevMouse.y - this.mouse.y) ** 2,
      );
      this.targetSpeed -= 0.1 * (this.targetSpeed - this.speed);
      this.followMouse.x -= 0.1 * (this.followMouse.x - this.mouse.x);
      this.followMouse.y -= 0.1 * (this.followMouse.y - this.mouse.y);
      this.prevMouse.x = this.mouse.x;
      this.prevMouse.y = this.mouse.y;

      this.postProcess.customPass.uniforms.uVelo.value = Math.min(
        this.targetSpeed,
        0.05,
      );
      this.targetSpeed *= 0.999;
      this.postProcess.customPass.uniforms.uMouse.value = this.followMouse;
      this.postProcess.composer.render();
    } else {
      this.instance.render(this.scene, this.camera.instance);
    }

    if (this.stats) {
      this.stats.afterRender();
    }
  }

  destroy() {
    this.instance.renderLists.dispose();
    this.instance.dispose();
    this.renderTarget.dispose();
    this.postProcess.composer.renderTarget1.dispose();
    this.postProcess.composer.renderTarget2.dispose();
  }
}
