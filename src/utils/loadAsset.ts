import * as THREE from "three";

import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";

export const loadAsset = async (path: string) => {
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
      const texture = await new THREE.TextureLoader().loadAsync(path);
      texture.needsUpdate = true;
      return texture;
    }

    if (extension === "glb") {
      const gltf = await gltfLoader.loadAsync(path);

      return gltf;
    }
  }
};
