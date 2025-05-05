// Import required modules
import "./index.css";
import "../vendor/normalize.css";
import Api from "../utils/Api.js"; // Import API class
import {
  enableValidation,
  settings,
  resetForm,
  toggleButtonState,
} from "../scripts/validation.js";

// Create API instance
const api = new Api({
  baseUrl: "https://around-api.en.tripleten-services.com/v1",
  headers: {
    authorization: "402df489-8b33-4cc5-a119-272d843e9751", // Your correct authorization code
    "Content-Type": "application/json",
  },
});

// DOM Elements
const profileName = document.querySelector(".profile__name-first");
const profileDescription = document.querySelector(
  ".profile__description-first"
);
const profileAvatar = document.querySelector(".profile__avatar");
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
const deleteCardModal = document.querySelector("#delete-card-modal");
const confirmDeleteButton = document.querySelector("#confirm-delete-btn");
const deletePicModal = document.querySelector("#delete-pic-modal");
const confirmDeletePicButton = document.querySelector(
  "#confirm-delete-pic-btn"
);
const closeModalButtons = document.querySelectorAll(".modal__close-btn");

let cardToDelete = null;
let picToDelete = null;

console.log("Profile Name Before API:", profileName?.textContent);
console.log("Profile Description Before API:", profileDescription?.textContent);
console.log("Profile Avatar Before API:", profileAvatar?.src);

// Fetch User Data & Cards Together
api
  .getAppData()
  .then(({ userData, cards }) => {
    console.log("API User Data:", userData);
    console.log("API Cards Data:", cards);

    if (userData && userData.name !== "Placeholder name") {
      profileName.textContent = userData.name;
      profileDescription.textContent = userData.about;
      profileAvatar.src = userData.avatar;
      profileAvatar.alt = `Avatar of ${userData.name || "User"}`;
    } else {
      console.warn(
        "Warning: API returned placeholder data. Profile not updated."
      );
    }

    renderInitialCards(cards);
  })
  .catch(console.error);

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
  if (!deleteCardModal) {
    console.error("Error: Delete card modal not found!");
    return;
  }

  cardToDelete = { element: cardElement, id: cardId };
  openModal(deleteCardModal);
}

confirmDeleteButton.addEventListener("click", () => {
  if (!cardToDelete) return;

  api
    .deleteCard(cardToDelete.id)
    .then(() => {
      cardToDelete.element.remove();
      closeModal(deleteCardModal);
    })
    .catch(console.error);
});

// ✅ Delete Picture Modal Logic
function openDeletePicModal(picElement, picId) {
  if (!deletePicModal) {
    console.error("Error: Delete picture modal not found!");
    return;
  }

  picToDelete = { element: picElement, id: picId };
  openModal(deletePicModal);
}

confirmDeletePicButton.addEventListener("click", () => {
  if (!picToDelete) return;

  picToDelete.element.remove();
  closeModal(deletePicModal);
});

function openModal(modal) {
  modal.classList.add("modal_opened");
  document.addEventListener("keydown", handleEscapeKey);
}

function closeModal(modal) {
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

profileEditButton.addEventListener("click", () => {
  resetForm(profileForm, settings);
  inputProfileName.value = profileName.textContent.trim();
  inputProfileDescription.value = profileDescription.textContent.trim();
  openModal(profileEditModal);
});

profileForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const updatedName = inputProfileName.value.trim();
  const updatedDescription = inputProfileDescription.value.trim();

  api
    .updateUserInfo({ name: updatedName, about: updatedDescription })
    .then((updatedUserData) => {
      profileName.textContent = updatedUserData.name;
      profileDescription.textContent = updatedUserData.about;
      closeModal(profileEditModal);
    })
    .catch(console.error);
});

addCardForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const newCardName = inputCardCaption.value.trim();
  const newCardLink = inputCardImageLink.value.trim();

  api
    .addNewCard({ name: newCardName, link: newCardLink })
    .then((newCard) => {
      renderCard(newCard);
      addCardForm.reset();
      closeModal(addCardModal);
    })
    .catch(console.error);
});

openAddCardModalButton.addEventListener("click", () => openModal(addCardModal));

enableValidation(settings);
