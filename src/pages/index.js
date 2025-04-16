// Import styles
import "./index.css";
import "../vendor/normalize.css";

// Validation Imports & Configuration
import {
  enableValidation,
  settings,
  resetForm,
  toggleButtonState,
} from "../scripts/validation.js";

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
  const previewCaption = previewImageModal.querySelector(".modal__caption");
  const closeModalButtons = document.querySelectorAll(".modal__close-btn");

  function renderCard(item, method = "prepend") {
    if (!item.name || !item.link) return;
    console.log("Rendering card:", item);
    const cardElement = createCardElement(item);
    method === "prepend"
      ? cardsContainer.prepend(cardElement)
      : cardsContainer.append(cardElement);
  }

  function createCardElement(data) {
    console.log("Creating card element with data:", data);
    const cardElement = cardTemplate.cloneNode(true).firstElementChild;
    const cardTitle = cardElement.querySelector(".card__title");
    const cardImage = cardElement.querySelector(".card__img");

    cardTitle.textContent = data.name;
    cardImage.src = data.link;
    cardImage.alt = data.name;

    console.log("Image set to:", cardImage.src);

    const deleteButton = cardElement.querySelector(".card__delete-button");
    const likeButton = cardElement.querySelector(".card__like-button");

    deleteButton.addEventListener("click", () => cardElement.remove());
    likeButton.addEventListener("click", (event) =>
      event.target.classList.toggle("liked")
    );

    cardImage.addEventListener("click", () => {
      previewImageModal.querySelector(".modal__image_preview").src = data.link;
      previewCaption.textContent = data.name;
      openModal(previewImageModal);
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
    disableButton(event.submitter, settings);
    closeModal(addCardModal);
  });

  closeModalButtons.forEach((button) => {
    const modal = button.closest(".modal");
    button.addEventListener("click", () => closeModal(modal));
  });
});
