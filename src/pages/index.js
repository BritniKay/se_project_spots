import "./index.css";
import "../vendor/normalize.css";

import {
  enableValidation,
  settings,
  resetForm,
  toggleButtonState,
} from "../scripts/validation.js";

const initialCards = [
  {
    name: "Val Thorens",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/1-photo-by-moritz-feldmann-from-pexels.jpg",
  },
  {
    name: "Restaurant terrace",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/2-photo-by-ceiline-from-pexels.jpg",
  },
  {
    name: "An outdoor cafe",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/3-photo-by-tubanur-dogan-from-pexels.jpg",
  },
  {
    name: "A very long bridge, over the forest and through the trees",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/4-photo-by-maurice-laschet-from-pexels.jpg",
  },
  {
    name: "Tunnel with morning light",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/5-photo-by-van-anh-nguyen-from-pexels.jpg",
  },
  {
    name: "Mountain house",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/6-photo-by-moritz-feldmann-from-pexels.jpg",
  },
];
const api = new Api({
  baseUrl: "https://around-api.en.tripleten-services.com/v1",
  headers: {
    authorization: "402df489-8b33-4cc5-a119-272d843e9751",
    "Content-Type": "application/json",
  },
});

api.getinitialCards().then((cards) => {
  console.log(cards);
});

document.addEventListener("DOMContentLoaded", function () {
  const profileName = document.querySelector(".profile__name-first");
  const profileDescription = document.querySelector(
    ".profile__description-first"
  );
  const inputProfileName = document.querySelector("#profile-name-input");
  const inputProfileDescription = document.querySelector(
    "#profile-description-input"
  );
  const profileEditButton = document.querySelector(".profile__edit-btn");
  const profileEditModal = document.querySelector("#edit-modal");
  const profileForm = document.forms["profile-form"];
  const cardsContainer = document.querySelector(".cards__list");
  const cardTemplate = document.querySelector("#card-template").content;
  const addCardModal = document.querySelector("#add-card-modal");
  const addCardForm = document.forms["add-card-form"];
  const inputCardImageLink = document.querySelector("#profile-image-link");
  const inputCardCaption = document.querySelector("#profile-caption-input");
  const openAddCardModalButton = document.querySelector(".profile__add-btn");
  const previewImageModal = document.querySelector("#preview-modal");
  const previewImage = previewImageModal?.querySelector(
    ".modal__image_preview"
  );
  const previewCaption = previewImageModal?.querySelector(".modal__caption");
  const closeModalButtons = document.querySelectorAll(".modal__close-btn");

  function openModal(modal) {
    if (!modal) return;
    modal.classList.add("modal_opened");
  }

  function closeModal(modal) {
    if (!modal) return;
    modal.classList.remove("modal_opened");
  }

  function renderInitialCards() {
    initialCards.forEach((cardData) => renderCard(cardData, "append"));
  }

  function renderCard(data, method = "prepend") {
    if (!data.name || !data.link) return;
    const cardElement = createCardElement(data);
    method === "prepend"
      ? cardsContainer.prepend(cardElement)
      : cardsContainer.append(cardElement);
  }

  function createCardElement(data) {
    const cardElement = cardTemplate.cloneNode(true).firstElementChild;
    const cardTitle = cardElement.querySelector(".card__title");
    const cardImage = cardElement.querySelector(".card__img");

    cardTitle.textContent = data.name;
    cardImage.src = data.link;
    cardImage.alt = data.name;

    const deleteButton = cardElement.querySelector(".card__delete-button");
    const likeButton = cardElement.querySelector(".card__like-button");

    deleteButton.addEventListener("click", () => cardElement.remove());
    likeButton.addEventListener("click", (event) =>
      event.target.classList.toggle("liked")
    );

    cardImage.addEventListener("click", () => {
      if (previewImageModal && previewImage && previewCaption) {
        previewImage.src = data.link;
        previewImage.alt = data.name;
        previewCaption.textContent = data.name;
        openModal(previewImageModal);
      }
    });

    return cardElement;
  }

  enableValidation(settings);

  profileEditButton.addEventListener("click", () => {
    resetForm(profileForm, settings);
    inputProfileName.value = profileName.textContent.trim();
    inputProfileDescription.value = profileDescription.textContent.trim();
    openModal(profileEditModal);
  });

  profileForm.addEventListener("submit", (event) => {
    event.preventDefault();
    profileName.textContent = inputProfileName.value.trim();
    profileDescription.textContent = inputProfileDescription.value.trim();
    closeModal(profileEditModal);
  });

  openAddCardModalButton.addEventListener("click", () =>
    openModal(addCardModal)
  );

  addCardForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const newCardData = {
      name: inputCardCaption.value.trim(),
      link: inputCardImageLink.value.trim(),
    };
    if (!newCardData.name || !newCardData.link) return;
    renderCard(newCardData);
    addCardForm.reset();
    closeModal(addCardModal);
  });

  closeModalButtons.forEach((button) => {
    const modal = button.closest(".modal");
    button.addEventListener("click", () => closeModal(modal));
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      const openModal = document.querySelector(".modal_opened");
      if (openModal) {
        closeModal(openModal);
      }
    }
  });

  renderInitialCards();
});
