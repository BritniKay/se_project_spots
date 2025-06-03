import "./index.css";
import "../vendor/normalize.css";
import Api from "../utils/Api.js";
import {
  enableValidation,
  settings,
  resetForm,
} from "../scripts/validation.js";
import { handleSubmit, renderLoading } from "../utils.js";

const api = new Api({
  baseUrl: "https://around-api.en.tripleten-services.com/v1",
  headers: {
    authorization: "402df489-8b33-4cc5-a119-272d843e9751",
    "Content-Type": "application/json",
  },
});

function showErrorMessage(error, operation) {
  const errorMessages = {
    "Failed to fetch": "Network error. Please check your internet connection.",
    400: "Invalid data provided.",
    401: "Authorization error. Please try again.",
    403: "Access forbidden.",
    404: "The requested resource was not found.",
    500: "Server error. Please try again later.",
  };

  const defaultMessage = "An error occurred. Please try again.";
  const message =
    errorMessages[error.message] || error.message || defaultMessage;
  console.error(`${operation} error:`, error);
  alert(`${operation}: ${message}`);
}

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
  const inputAvatarUrl = document.querySelector("#avatar-image-url-input");
  const cardsContainer = document.querySelector(".cards__list");
  const cardTemplate = document.querySelector("#card-template").content;
  const addCardModal = document.querySelector("#add-card-modal");
  const addCardForm = document.forms["add-card-form"];
  const inputCardImageLink = document.querySelector("#card-image-url-input");
  const inputCardCaption = document.querySelector("#profile-caption-input");
  const openAddCardModalButton = document.querySelector(".profile__add-btn");
  const deleteCardModal = document.querySelector("#delete-card-modal");
  const confirmDeleteButton = document.querySelector("#confirm-delete-btn");
  const closeModalButtons = document.querySelectorAll(".modal__close-btn");
  const closeDeleteModalButton = document.querySelector(
    ".modal__close-btn-delete"
  );
  const cancelDeleteButton = document.querySelector(".modal__cancel-delete");
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

  if (closeDeleteModalButton) {
    closeDeleteModalButton.addEventListener("click", () => {
      closeModal(deleteCardModal);
    });
  }

  if (cancelDeleteButton) {
    cancelDeleteButton.addEventListener("click", () => {
      closeModal(deleteCardModal);
    });
  }

  if (deleteCardModal) {
    deleteCardModal.addEventListener("mousedown", (event) => {
      if (event.target === deleteCardModal) {
        closeModal(deleteCardModal);
      }
    });
  }

  api
    .getUserInfo()
    .then((userData) => {
      profileName.textContent = userData.name || "Bessie Coleman";
      profileDescription.textContent = userData.about || "Civil Aviator";
      profileAvatar.src = userData.avatar.includes("placeholder")
        ? "./images/avatar.jpg"
        : userData.avatar;
    })
    .catch((error) => showErrorMessage(error, "Loading profile"));

  function renderCard(data) {
    const cardElement = createCardElement(data);
    cardsContainer.prepend(cardElement);
  }

  function renderInitialCards(cards) {
    cards.forEach(renderCard);
  }

  api
    .getInitialCards()
    .then((cards) => {
      if (!Array.isArray(cards)) {
        console.error("Error: Expected an array but received:", cards);
        return;
      }
      renderInitialCards(cards);
    })
    .catch(console.error);

  function createCardElement(data) {
    const cardElement = cardTemplate.cloneNode(true).firstElementChild;
    const cardTitle = cardElement.querySelector(".card__title");
    const cardImage = cardElement.querySelector(".card__img");
    const deleteButton = cardElement.querySelector(".card__delete-button");
    const likeButton = cardElement.querySelector(".card__like-button");
    const likeCounter = cardElement.querySelector(".card__like-counter");

    cardTitle.textContent = data.name;
    cardImage.src = data.link;
    cardImage.alt = data.name;

    // Use server-provided isLiked property instead of localStorage
    if (data.isLiked) {
      likeButton.classList.add("liked");
    }

    cardElement.dataset.cardId = data._id;

    deleteButton.addEventListener("click", () => openDeleteModal(cardElement));

    likeButton.addEventListener("click", () => {
      const isLiked = likeButton.classList.contains("liked");
      const likeMethod = isLiked
        ? api.unlikeCard(data._id)
        : api.likeCard(data._id);

      likeMethod
        .then((updatedCard) => {
          likeButton.classList.toggle("liked");

          if (likeCounter && updatedCard.likes) {
            likeCounter.textContent =
              updatedCard.likes.length > 0 ? updatedCard.likes.length : "";
          }
        })
        .catch((err) => {
          showErrorMessage(err, "updating like status");
        });
    });

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

      const deleteButton = confirmDeleteButton;
      const originalText = deleteButton.textContent;

      renderLoading(true, deleteButton, originalText);

      api
        .removeCard(cardToDelete.dataset.cardId)
        .then(() => {
          cardToDelete.remove();
          closeModal(deleteCardModal);
        })
        .catch((error) => showErrorMessage(error, "Deleting card"))
        .finally(() => {
          renderLoading(false, deleteButton, originalText);
        });
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
    profileForm.addEventListener("submit", handleProfileFormSubmit);

    function handleProfileFormSubmit(evt) {
      function makeRequest() {
        return api
          .updateUserInfo({
            name: inputProfileName.value.trim(),
            about: inputProfileDescription.value.trim(),
          })
          .then(() => {
            profileName.textContent = inputProfileName.value.trim();
            profileDescription.textContent =
              inputProfileDescription.value.trim();
            closeModal(profileEditModal);
          });
      }

      handleSubmit(makeRequest, evt);
    }
  }

  if (profileAvatarEditButton) {
    profileAvatarEditButton.addEventListener("click", () => {
      resetForm(avatarForm, settings);
      openModal(editAvatarModal);
    });
  }

  if (avatarForm) {
    avatarForm.addEventListener("submit", handleAvatarFormSubmit);
  }

  function handleAvatarFormSubmit(evt) {
    function makeRequest() {
      return api.updateProfileAvatar(inputAvatarUrl.value.trim()).then(() => {
        profileAvatar.src = inputAvatarUrl.value.trim();
        closeModal(editAvatarModal);
      });
    }

    handleSubmit(makeRequest, evt);
  }

  const cardFormSubmitButton = addCardForm.querySelector(
    "button[type='submit']"
  );

  function toggleCardFormButtonState() {
    const isCaptionEmpty = inputCardCaption.value.trim() === "";
    const isLinkEmpty = inputCardImageLink.value.trim() === "";

    if (isCaptionEmpty || isLinkEmpty) {
      cardFormSubmitButton.setAttribute("disabled", true);
    } else {
      cardFormSubmitButton.removeAttribute("disabled");
    }
  }

  inputCardCaption.addEventListener("input", toggleCardFormButtonState);
  inputCardImageLink.addEventListener("input", toggleCardFormButtonState);
  toggleCardFormButtonState();

  if (openAddCardModalButton) {
    openAddCardModalButton.addEventListener("click", () => {
      resetForm(addCardForm, settings);
      openModal(addCardModal);
    });
  }

  if (addCardForm) {
    addCardForm.addEventListener("submit", handleCardFormSubmit);
  }

  function handleCardFormSubmit(evt) {
    function makeRequest() {
      return api
        .addNewCard({
          name: inputCardCaption.value.trim(),
          link: inputCardImageLink.value.trim(),
        })
        .then((cardData) => {
          renderCard(cardData);
          closeModal(addCardModal);
        })
        .finally(() => {
          addCardForm.reset();
          toggleCardFormButtonState(); // Disable button again
        });
    }

    handleSubmit(makeRequest, evt);
  }

  enableValidation(settings);
});
