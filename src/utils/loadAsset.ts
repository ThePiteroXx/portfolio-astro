import * as THREE from "three";

import { GLTF, GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";

export const loadAsset = (
  path: string,
  callback: (item: GLTF | THREE.Texture) => void,
) => {
  const dracoLoader = new DRACOLoader();
  dracoLoader.setDecoderPath("draco/");
  dracoLoader.setDecoderConfig({ type: "js" });

  const gltfLoader = new GLTFLoader();
  gltfLoader.setDRACOLoader(dracoLoader);

  const extensionMatch = path.match(/\.([a-z]+)$/);

  if (!extensionMatch) {
    console.warn(`Cannot found extension of ${path}`);
    return;
  }

  if (typeof extensionMatch[1] !== "undefined") {
    const extension = extensionMatch[1];

    if (extension === "jpg" || extension === "png") {
      new THREE.TextureLoader().load(path, (texture) => {
        texture.needsUpdate = true;
        callback(texture);
      });
      return;
    }

    if (extension === "glb") {
      gltfLoader.load(path, (data) => {
        callback(data);
      });
    }
  }
};
