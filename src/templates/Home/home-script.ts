import bakedNoLightImage from "~/assets/images/bakedNoLight.jpg";
import ledBakedImage from "~/assets/images/ledBaked.jpg";
import bakedImage from "~/assets/images/baked.jpg";
import leftMonitorImage from "~/assets/images/leftMonitor.jpg";
import paintingImage from "~/assets/images/painting.png";

import { updateResources } from "~/store/resources";
import { loadAsset } from "~/utils/loadAsset";
import HomeCanvas from "./canvas/Home.js";

const assetPaths = [
  "models/deskModel.glb",
  "models/mainMonitor.glb",
  "models/laptopMonitor.glb",
  "models/leftMonitor.glb",
  "models/coffeSteam.glb",
  bakedNoLightImage.src,
  ledBakedImage.src,
  bakedImage.src,
  leftMonitorImage.src,
  paintingImage.src,
  "models/painting.glb",
];

// load resources
const assetPromises = assetPaths.map(loadAsset);
const assets = await Promise.all(assetPromises);

const isFoundedAssets = assets.every((asset) => asset !== undefined);

if (isFoundedAssets) {
  const [
    deskModel,
    mainMonitor,
    laptopMonitor,
    leftMonitor,
    coffeSteam,
    darkbaked,
    ledBaked,
    baked,
    leftMonitorTexture,
    paintingTexture,
    painting,
  ] = assets as NonNullable<(typeof assets)[number]>[];

  updateResources({
    deskModel,
    mainMonitor,
    laptopMonitor,
    leftMonitor,
    coffeSteam,
    darkbaked,
    ledBaked,
    baked,
    leftMonitorTexture,
    paintingTexture,
    painting,
  });
}

let myReq: number;
let homeCanvas: HomeCanvas;

document.addEventListener("astro:page-load", () => {
  if (window.location.pathname === "/") {
    homeCanvas = new HomeCanvas(document.querySelector(".canvas-home"));

    const update = () => {
      homeCanvas.update();
      myReq = requestAnimationFrame(update);
    };
    update();
  }
});

document.addEventListener("astro:after-swap", () => {
  cancelAnimationFrame(myReq);
  homeCanvas.destroy();
});
