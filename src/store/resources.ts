import { BehaviorSubject } from "rxjs";

import type { GLTF } from "three/examples/jsm/loaders/GLTFLoader.js";

type Resources = {
  [key: string]: GLTF | THREE.Texture;
} | null;

const resources = new BehaviorSubject<Resources>(null);

export const getResources = () => resources.getValue();

export const updateResources = (data: Resources) =>
  resources.next({ ...resources.getValue(), ...data });
