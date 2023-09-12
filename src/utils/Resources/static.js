export default [
  {
    name: "base",
    data: {},
    items: [
      { name: "deskModel", source: "models/deskModel.glb", type: "model" },
      { name: "mainMonitor", source: "models/mainMonitor.glb", type: "model" },
      {
        name: "laptopMonitor",
        source: "models/laptopMonitor.glb",
        type: "model",
      },
      { name: "leftMonitor", source: "models/leftMonitor.glb", type: "model" },
      { name: "coffeSteam", source: "models/coffeSteam.glb", type: "model" },
      {
        name: "darkbaked",
        source: "images/bakedNoLight.jpg",
        type: "texture",
      },
      { name: "ledbaked", source: "images/ledBaked.jpg", type: "texture" },
      { name: "baked", source: "images/baked.jpg", type: "texture" },
      {
        name: "leftMonitorTexture",
        source: "images/leftMonitor.jpg",
        type: "texture",
      },
      {
        name: "paintingTexture",
        source: "images/painting.png",
        type: "texture",
      },
      { name: "painting", source: "models/painting.glb", type: "model" },
      { name: "icons", source: "models/icons-final.glb", type: "model" },

      { name: "messup", source: "images/messup.jpg", type: "texture" },
      { name: "dietapp", source: "images/dietapp.jpg", type: "texture" },
      { name: "moviestan", source: "images/moviestan.jpg", type: "texture" },
      { name: "portfolio", source: "images/portfolio.jpg", type: "texture" },
    ],
  },
];
