import "./index.css";
import "../vendor/normalize.css";

import {
  enableValidation,
  settings,
  resetForm,
  toggleButtonState,
} from "../scripts/validation.js";

import profileAvatar from "../images/avatar.jpg";
import editIcon from "../images/edit__pen.svg";
import addPostIcon from "../images/plus__icon.svg";
import previewImage from "../images/preview-image.png";
import logo from "../images/Logo.svg";
import favicon from "../images/favicon.ico";

document.querySelector(".profile__avatar").src = profileAvatar;
document.querySelector(".profile__pencil").src = editIcon;
document.querySelector(".profile__add-icon").src = addPostIcon;
document.querySelector(".modal__image_preview").src = previewImage;
document.querySelector(".header__logo").src = logo;
document.querySelector("link[rel='icon']").href = favicon;

const initialCards = [
  { name: "Beautiful Lake", link: "./images/lake.jpg" },
  { name: "Sunny Beach", link: "./images/beach.jpg" },
  { name: "City Skyline", link: "./images/skyline.jpg" },
  { name: "Forest Path", link: "./images/forest.jpg" },
  { name: "Mountain View", link: "./images/mountain.jpg" },
  { name: "Snowy Village", link: "./images/village.jpg" },
];

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

  renderInitialCards();
});
