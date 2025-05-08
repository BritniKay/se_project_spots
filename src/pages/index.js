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

document.addEventListener("DOMContentLoaded", function () {
  const profileName = document.querySelector(".profile__name-first");
  const profileDescription = document.querySelector(
    ".profile__description-first"
  );
  const profileAvatar = document.querySelector(".profile__avatar");
  const profileAvatarEditButton = document.querySelector(
    ".profile__avatar-edit"
  );
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
  const previewImageModal = document.querySelector("#preview-modal");
  const previewImage = previewImageModal?.querySelector(
    ".modal__image_preview"
  );
  const previewCaption = previewImageModal?.querySelector(".modal__caption");

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
      console.log("API Response:", userData);
      profileName.textContent = userData.name || "Bessie Coleman";
      profileDescription.textContent = userData.about || "Civil Aviator";
      profileAvatar.src = userData.avatar.includes("placeholder")
        ? "./images/avatar.jpg"
        : userData.avatar;
    })
    .catch(console.error);

  api
    .getInitialCards()
    .then((cards) => {
      console.log("Loaded Cards:", cards);
      renderInitialCards(cards);
    })
    .catch(console.error);

  function renderInitialCards(cards) {
    cards.forEach(renderCard);
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
    const deleteButton = cardElement.querySelector(".card__delete-button");
    const likeButton = cardElement.querySelector(".card__like-button");

    cardTitle.textContent = data.name;
    cardImage.src = data.link;
    cardImage.alt = data.name;

    deleteButton.addEventListener("click", () => openDeleteModal(cardElement));
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

  function openDeleteModal(cardElement) {
    if (!deleteCardModal) {
      console.error("Delete modal not found!");
      return;
    }
    cardToDelete = cardElement;
    openModal(deleteCardModal);
  }

  if (confirmDeleteButton) {
    confirmDeleteButton.addEventListener("click", () => {
      if (!cardToDelete) return;

      api
        .removeCard(cardToDelete.dataset.cardId) // ✅ Send DELETE request
        .then(() => {
          cardToDelete.remove();
          closeModal(deleteCardModal);
        })
        .catch(console.error);
    });
  }

  if (profileEditButton) {
    profileEditButton.addEventListener("click", () => {
      resetForm(profileForm, settings);
      inputProfileName.value = profileName?.textContent.trim() || "";
      inputProfileDescription.value =
        profileDescription?.textContent.trim() || "";
      openModal(profileEditModal);
    });
  }

  if (profileForm) {
    profileForm.addEventListener("submit", (event) => {
      event.preventDefault();
      if (profileName && inputProfileName) {
        profileName.textContent = inputProfileName.value.trim();
      }
      if (profileDescription && inputProfileDescription) {
        profileDescription.textContent = inputProfileDescription.value.trim();
      }
      closeModal(profileEditModal);
    });
  }

  if (profileAvatarEditButton) {
    profileAvatarEditButton.addEventListener("click", () => {
      resetForm(avatarForm, settings);
      openModal(editAvatarModal);
    });
  }

  if (avatarForm) {
    avatarForm.addEventListener("submit", (event) => {
      event.preventDefault();
      const newAvatarUrl = inputAvatarUrl?.value.trim();
      if (!newAvatarUrl) return;
      if (profileAvatar) {
        profileAvatar.src = newAvatarUrl;
      }
      closeModal(editAvatarModal);
    });
  }

  if (openAddCardModalButton) {
    openAddCardModalButton.addEventListener("click", () =>
      openModal(addCardModal)
    );
  }

  if (addCardForm) {
    addCardForm.addEventListener("submit", (event) => {
      event.preventDefault();
      const newCardData = {
        name: inputCardCaption?.value.trim(),
        link: inputCardImageLink?.value.trim(),
      };

      if (!newCardData.name || !newCardData.link) return;

      api
        .addNewCard(newCardData)
        .then((card) => {
          renderCard(card);
          addCardForm.reset();
          closeModal(addCardModal);
        })
        .catch(console.error);
    });
  }

  enableValidation(settings);
});
