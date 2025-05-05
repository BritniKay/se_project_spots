import "./index.css";
import "../vendor/normalize.css";
import Api from "../utils/Api.js";
import {
  enableValidation,
  settings,
  resetForm,
} from "../scripts/validation.js";

const api = new Api({
  baseUrl: "https://around-api.en.tripleten-services.com/v1",
  headers: {
    authorization: "402df489-8b33-4cc5-a119-272d843e9751",
    "Content-Type": "application/json",
  },
});

/*
const initialCards = [
  { name: "Val Thorens", link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/1-photo-by-moritz-feldmann-from-pexels.jpg" },
  { name: "Restaurant terrace", link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/2-photo-by-ceiline-from-pexels.jpg" },
  { name: "An outdoor cafe", link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/3-photo-by-tubanur-dogan-from-pexels.jpg" },
  { name: "A very long bridge, over the forest and through the trees", link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/4-photo-by-maurice-laschet-from-pexels.jpg" },
  { name: "Tunnel with morning light", link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/5-photo-by-van-anh-nguyen-from-pexels.jpg" },
  { name: "Mountain house", link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/6-photo-by-moritz-feldmann-from-pexels.jpg" },
];
*/

const profileName = document.querySelector(".profile__name-first");
const profileDescription = document.querySelector(
  ".profile__description-first"
);
const profileAvatar = document.querySelector(".profile__avatar");
const profileAvatarEditButton = document.querySelector(".profile__avatar-edit");
const inputProfileName = document.querySelector("#profile-name-input");
const inputProfileDescription = document.querySelector(
  "#profile-description-input"
);
const profileEditButton = document.querySelector(".profile__edit-btn");
const profileEditModal = document.querySelector("#edit-modal");
const profileForm = document.forms["profile-form"];
const editAvatarModal = document.querySelector("#edit-avatar-modal");
const avatarForm = document.forms["edit-avatar-form"];
const inputAvatarUrl = document.querySelector("#avatar-url-input");
const cardsContainer = document.querySelector(".cards__list");
const cardTemplate = document.querySelector("#card-template").content;
const addCardModal = document.querySelector("#add-card-modal");
const addCardForm = document.forms["add-card-form"];
const inputCardImageLink = document.querySelector("#profile-image-link");
const inputCardCaption = document.querySelector("#profile-caption-input");
const openAddCardModalButton = document.querySelector(".profile__add-btn");
const deleteCardModal = document.querySelector("#delete-card-modal");
const confirmDeleteButton = document.querySelector("#confirm-delete-btn");
const closeModalButtons = document.querySelectorAll(".modal__close-btn");

let cardToDelete = null;

function openModal(modal) {
  if (!modal) return;
  modal.classList.add("modal_opened");
  document.addEventListener("keydown", handleEscapeKey);
}

function closeModal(modal) {
  if (!modal) return;
  modal.classList.remove("modal_opened");
  document.removeEventListener("keydown", handleEscapeKey);
}

function handleEscapeKey(event) {
  if (event.key === "Escape") {
    const openModal = document.querySelector(".modal_opened");
    if (openModal) closeModal(openModal);
  }
}

closeModalButtons.forEach((button) => {
  const modal = button.closest(".modal");
  button.addEventListener("click", () => closeModal(modal));
});

api
  .getUserInfo()
  .then((userData) => {
    if (userData.name) profileName.textContent = userData.name;
    if (userData.about) profileDescription.textContent = userData.about;
    if (userData.avatar) profileAvatar.src = userData.avatar;
  })
  .catch(console.error);

if (profileAvatarEditButton) {
  profileAvatarEditButton.addEventListener("click", () => {
    resetForm(avatarForm, settings);
    openModal(editAvatarModal);
  });
}

if (avatarForm) {
  avatarForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const submitButton = avatarForm.querySelector(".modal__submit-btn");
    submitButton.textContent = "Saving...";

    const newAvatarUrl = inputAvatarUrl.value.trim();

    api
      .updateProfileAvatar(newAvatarUrl)
      .then(() => api.getUserInfo())
      .then((userData) => {
        if (userData.avatar) profileAvatar.src = userData.avatar;
        closeModal(editAvatarModal);
      })
      .catch(console.error)
      .finally(() => {
        submitButton.textContent = "Save";
      });
  });
}

function renderInitialCards(cards) {
  cards.forEach(renderCard);
}

function renderCard(data) {
  if (!data.name || !data.link) return;
  const cardElement = createCardElement(data);
  cardsContainer.prepend(cardElement);
}

function createCardElement(data) {
  const cardElement = cardTemplate.cloneNode(true).firstElementChild;
  const cardTitle = cardElement.querySelector(".card__title");
  const cardImage = cardElement.querySelector(".card__img");
  const deleteButton = cardElement.querySelector(".card__delete-button");

  cardTitle.textContent = data.name;
  cardImage.src = data.link;
  cardImage.alt = data.name;

  deleteButton.addEventListener("click", () =>
    openDeleteModal(cardElement, data._id)
  );

  return cardElement;
}

function openDeleteModal(cardElement, cardId) {
  if (!deleteCardModal) return;
  cardToDelete = { element: cardElement, id: cardId };
  openModal(deleteCardModal);
}

if (deleteCardModal && confirmDeleteButton) {
  confirmDeleteButton.addEventListener("click", () => {
    if (!cardToDelete) return;
    confirmDeleteButton.textContent = "Deleting...";

    api
      .removeCard(cardToDelete.id)
      .then(() => {
        cardToDelete.element.remove();
        closeModal(deleteCardModal);
      })
      .catch(console.error)
      .finally(() => {
        confirmDeleteButton.textContent = "Yes, delete";
      });
  });
}

if (profileEditButton) {
  profileEditButton.addEventListener("click", () => {
    resetForm(profileForm, settings);
    inputProfileName.value = profileName.textContent.trim();
    inputProfileDescription.value = profileDescription.textContent.trim();
    openModal(profileEditModal);
  });
}

if (profileForm) {
  profileForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const submitButton = profileForm.querySelector(".modal__submit-btn");
    submitButton.textContent = "Saving...";

    const updatedName = inputProfileName.value.trim();
    const updatedDescription = inputProfileDescription.value.trim();

    api
      .updateUserInfo({ name: updatedName, about: updatedDescription })
      .then((updatedUserData) => {
        profileName.textContent = updatedUserData.name;
        profileDescription.textContent = updatedUserData.about;
        closeModal(profileEditModal);
      })
      .catch(console.error)
      .finally(() => {
        submitButton.textContent = "Save";
      });
  });
}

if (openAddCardModalButton && addCardModal) {
  openAddCardModalButton.addEventListener("click", () =>
    openModal(addCardModal)
  );
}

enableValidation(settings);
