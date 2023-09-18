const rootElement = document.querySelector("body");

export const createModal = ({ ...props }) => {
  const {
    textureImg,
    desc,
    name,
    shortDesc,
    subpoints,
    technologies,
    hrefCr,
    hrefLive,
  } = props;

  const modalTemp = document.querySelector("#modal-temp");
  const modal = modalTemp.content.cloneNode(true);
  const backgroundModal = modal.querySelector(".modal__background");
  const exitButton = modal.querySelector(".modal__exit");
  const title = modal.querySelector(".modal__title");
  const technologiesContainer = modal.querySelector(".modal__technologies");
  const image = modal.querySelector(".modal__img");
  const description = modal.querySelector(".modal__desc");
  const shortDescription = modal.querySelector(".modal__mainDesc");
  const liveButton = modal.querySelector(".modal__btn--live");
  const codeButton = modal.querySelector(".modal__btn--code");
  const box = modal.querySelector(".modal__box");

  title.textContent = name;
  image.src = textureImg.image.attributes.src.value;
  shortDescription.textContent = shortDesc;
  description.textContent = desc;
  codeButton.href = hrefCr;

  if (hrefLive) liveButton.href = hrefLive;
  else {
    liveButton.classList.add("hidden");
    codeButton.style.marginLeft = 0;
  }

  technologies.forEach((techString) => {
    const liTechnology = document.createElement("li");
    liTechnology.textContent = techString;
    liTechnology.classList.add("modal__technology");

    technologiesContainer.appendChild(liTechnology);
  });

  if (subpoints.length !== 0) {
    subpoints.forEach(({ title, desc }) => {
      const subpointTitle = document.createElement("p");
      subpointTitle.classList.add("modal__box__title");
      subpointTitle.textContent = title;

      const subpointDesc = document.createElement("p");
      subpointDesc.classList.add("modal__box__desc");
      subpointDesc.textContent = desc;

      box.append(subpointTitle, subpointDesc);
    });
  }

  exitButton.addEventListener("click", () => {
    rootElement.removeChild(document.querySelector(".modal"));
  });

  backgroundModal.addEventListener("click", () => {
    rootElement.removeChild(document.querySelector(".modal"));
  });

  rootElement.appendChild(modal);
};
