import * as THREE from "three";
import Work from "./Work.js";
import { setWorkList } from "./workList.js";
import { createModal } from "./Modal.js";

import vertexImgShader from "./shaders/img/vertex.glsl";
import fragmentImgShader from "./shaders/img/fragment.glsl";

export default class Photos {
  constructor() {
    this.work = new Work();
    this.scene = this.work.scene;
    this.camera = this.work.camera.modes.default.instance;
    this.config = this.work.config;

    this.myWorks = setWorkList(this.work.resources);

    this.sizes = {
      mobile: 700,
      desktop: 1400,
    };

    this.img = document.querySelector(".work__container__img-mainOptions");

    this.images = {};
    this.meshes = [];

    this.imageWidth = this.img.clientWidth;
    this.imageHeight = this.img.clientHeight;

    this.init();
  }

  init() {
    this.setImages();
    this.setScroll();
    this.resize();
    this.setRaycaster();
  }

  setImages() {
    this.myWorks.forEach((work) => this.createImage(work));
  }

  createImage(props) {
    const { id, name, category, textureImg } = props;

    //create image webgl
    const geometry = new THREE.PlaneBufferGeometry(1, 1, 1, 1);
    const material = new THREE.ShaderMaterial({
      uniforms: {
        image: { value: textureImg },
      },
      vertexShader: vertexImgShader,
      fragmentShader: fragmentImgShader,
    });
    const mesh = new THREE.Mesh(geometry, material);
    mesh.scale.x = this.imageWidth / 100;
    mesh.scale.y = this.imageHeight / 100;
    this.scene.add(mesh);

    //create img dom
    const container = document.querySelector(".work__container");
    const imgSet = document.createElement("div");
    const imgIn = document.createElement("div");
    const title = document.createElement("span");
    const description = document.createElement("span");
    const number = document.createElement("span");

    imgSet.classList.add("work__container__img-set");
    imgIn.classList.add("work__container__img-in");
    title.classList.add("title");
    description.classList.add("desc");
    number.classList.add("number");

    title.textContent = name;
    description.textContent = category;
    number.textContent = `#${id}`;
    imgIn.style.width = `${this.imageWidth}px`;
    imgIn.style.height = `${this.imageHeight}px`;

    imgIn.append(title, description, number);
    imgSet.appendChild(imgIn);
    container.appendChild(imgSet);

    const styleSet = getComputedStyle(imgSet);
    const matrix = new WebKitCSSMatrix(styleSet.transform);
    const cloneMeshPosition = mesh.position.clone();

    //set object
    this.images[name] = {};
    this.images[name].mesh = mesh;
    this.images[name].cloneMeshPosition = cloneMeshPosition;
    this.images[name].domElement = imgSet;
    this.images[name].matrix = matrix;
    this.meshes.push(mesh);

    //listeners
    imgIn.addEventListener("click", () => {
      createModal(props);
    });
  }

  putDistanceY(y, boolean) {
    //if boolean == true calculate y position of webgl object
    // if boolean == false calculate y position dom element
    if (boolean) {
      return (y * this.config.height) / 100;
    }
    return this.config.height * (y + 0.5);
  }

  putDistanceX(x, boolean) {
    if (boolean) {
      return (this.config.width * x) / 100;
    }
    return this.config.width * x;
  }

  setScroll() {
    this.scroll = {};
    this.scroll.position = 0;
    this.scroll.speed = 0;
    this.scroll.limit = 0;
    this.scroll.render = this.config.scrollRender;

    window.addEventListener("wheel", (e) => {
      if (!document.querySelector(".modal")) {
        this.scroll.speed -= e.deltaY * 0.04;
      }
    });

    //Restart scroll position
    const navLinks = [...document.querySelectorAll(".navLi")];
    navLinks.forEach((link) =>
      link.addEventListener("click", () =>
        setTimeout(() => (this.scroll.position = 0), 1000),
      ),
    );
    /*
     * On mobile
     */
    let start = 0;
    const touchStart = (event) => {
      start = event.touches[0].pageY;
    };

    const touchMove = (event) => {
      if (!document.querySelector(".modal")) {
        const offset = start - event.touches[0].pageY;
        this.scroll.speed -= offset * 0.15;
        start = event.touches[0].pageY;

        //set touch-action: none while we scrolling to prevent refreshing page on mobile
        const containerWork = document.querySelector(".work__container");
        if (this.scroll.position < 0)
          containerWork.classList.add("touch-action-none");
        else containerWork.classList.remove("touch-action-none");
      }
    };

    window.addEventListener("touchstart", touchStart);
    window.addEventListener("touchmove", touchMove);
  }

  setRaycaster() {
    this.raycaster = new THREE.Raycaster();
    this.currentIntersect = null;

    this.mouse = new THREE.Vector2(-100, -100);
    window.addEventListener("mousemove", (e) => {
      this.mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
      this.mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
    });
  }

  resize() {
    this.imageWidth = this.img.clientWidth;
    this.imageHeight = this.img.clientHeight;

    let imagesLength = 0;
    const keys = [];

    for (const key in this.images) {
      //fit images
      this.images[key].mesh.scale.x = this.imageWidth / 100;
      this.images[key].mesh.scale.y = this.imageHeight / 100;

      //update styles images
      this.images[
        key
      ].domElement.children[0].style.width = `${this.imageWidth}px`;
      this.images[
        key
      ].domElement.children[0].style.height = `${this.imageHeight}px`;

      //push images object to array
      imagesLength++;
      if (keys[imagesLength] !== key) keys.push(key);
    }

    /*
     *   UPDATE DISTANCE IN TERM OF SIZE VIEWPORT
     */
    let distanceY = 0;
    let distanceX = 0;

    for (let i = 0; i < imagesLength; i++) {
      if (window.innerWidth < this.sizes.mobile) {
        //update position y
        if (window.innerHeight < 600) distanceY += 0.2;
        this.images[keys[i]].matrix.f = this.putDistanceY(distanceY, false);
        this.images[keys[i]].cloneMeshPosition.y = -this.putDistanceY(
          distanceY,
          true,
        );
        distanceY += 0.4;
        //update position x
        this.images[keys[i]].matrix.e = this.putDistanceX(distanceX, false);
        this.images[keys[i]].cloneMeshPosition.x = this.putDistanceY(
          distanceX,
          true,
        );

        if (window.innerHeight < 600) {
          distanceY += 0.3;

          if (window.innerHeight < 260) distanceY += 0.3;
        }
      } else if (window.innerWidth < this.sizes.desktop) {
        if (i % 2) {
          //update position y

          this.images[keys[i]].matrix.f = this.putDistanceY(distanceY, false);
          this.images[keys[i]].cloneMeshPosition.y = -this.putDistanceY(
            distanceY,
            true,
          );
          distanceY += 0.45;
          //update position x
          distanceX = 0.22;
          this.images[keys[i]].matrix.e = this.putDistanceX(distanceX, false);
          this.images[keys[i]].cloneMeshPosition.x = this.putDistanceX(
            distanceX,
            true,
          );

          if (window.innerHeight < 600) {
            distanceY += 0.3;
            if (window.innerHeight < 260) distanceY += 0.5;
          }
        } else {
          //update position y
          if (window.innerHeight < 600) distanceY += 0.2;
          this.images[keys[i]].matrix.f = this.putDistanceY(distanceY, false);
          this.images[keys[i]].cloneMeshPosition.y = -this.putDistanceY(
            distanceY,
            true,
          );
          //update position x
          distanceX = -0.22;
          this.images[keys[i]].matrix.e = this.putDistanceX(distanceX, false);
          this.images[keys[i]].cloneMeshPosition.x = this.putDistanceX(
            distanceX,
            true,
          );
        }
      } else {
        if (!(i % 3) && i !== 0) {
          distanceY += 0.45;

          if (window.innerHeight < 600) {
            distanceY += 0.3;
            if (window.innerHeight < 260) distanceY += 0.3;
          }
        }
        if (!(i % 3)) distanceX = -0.3;
        if (!(i % 3) && window.innerHeight < 600) distanceY += 0.2;
        //update position y
        this.images[keys[i]].matrix.f = this.putDistanceY(distanceY, false);
        this.images[keys[i]].cloneMeshPosition.y = -this.putDistanceY(
          distanceY,
          true,
        );
        //update position x
        this.images[keys[i]].matrix.e = this.putDistanceX(distanceX, false);
        this.images[keys[i]].cloneMeshPosition.x = this.putDistanceX(
          distanceX,
          true,
        );
        distanceX += 0.3;
      }
    }
    // Add limit scroll
    this.lastImg = keys[keys.length - 1];
    const distanceTop =
      this.images[this.lastImg].matrix.f -
      window.innerHeight +
      this.imageHeight;
    this.scroll.limit = distanceTop;
  }

  update() {
    //Add break points scroll

    if (this.scroll.position >= -this.scroll.limit && this.scroll.position <= 0)
      this.scroll.position += this.scroll.speed;

    if (this.scroll.position > 0) this.scroll.position = 0;
    if (this.scroll.position <= -this.scroll.limit)
      this.scroll.position = -this.scroll.limit;

    this.scroll.speed *= 0.9;

    for (const key in this.images) {
      const imgSet = this.images[key].domElement;
      const imgIn = imgSet.children[0];

      const matrix = this.images[key].matrix;

      imgIn.style.transform = `matrix(1,0,0,1, ${-this.imageWidth / 2}, ${
        -this.imageHeight / 2
      })`;

      const clonePosition = this.images[key].cloneMeshPosition;

      this.images[key].mesh.position.y =
        clonePosition.y - this.scroll.position / 100;
      imgSet.style.transform = `matrix(${matrix.a},${matrix.b},${matrix.c},${
        matrix.d
      },${matrix.e},${matrix.f + this.scroll.position})`;

      this.images[key].mesh.position.x = clonePosition.x;
    }

    //update raycaster
    this.raycaster.setFromCamera(this.mouse, this.camera);
    const intersect = this.raycaster.intersectObjects(this.meshes);
    const limit = 0.3;
    const speed = 0.04;
    const _x = this.imageWidth / 100;
    const _y = this.imageHeight / 100;

    if (intersect.length) {
      const x = intersect[0].object.scale.x;
      const y = intersect[0].object.scale.y;
      intersect[0].object.scale.set(
        Math.min(x + speed, _x + limit),
        Math.min(y + speed, _y + limit),
        1,
      );
      this.currentIntersect = intersect[0].object;
    }
    if (!intersect.length && this.currentIntersect) {
      const x = this.currentIntersect.scale.x;
      const y = this.currentIntersect.scale.y;
      this.currentIntersect.scale.set(
        Math.max(x - speed, _x),
        Math.max(y - speed, _y),
        1,
      );
    }

    this.meshes.forEach((element) => {
      const scaleX = element.scale.x;
      const scaleY = element.scale.y;
      if (this.currentIntersect !== element)
        element.scale.set(
          Math.max(scaleX - speed, _x),
          Math.max(scaleY - speed, _y),
          1,
        );
    });
  }
}
