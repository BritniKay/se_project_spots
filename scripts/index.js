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
  const previewImage = previewImageModal.querySelector(".modal__image");
  const previewCaption = previewImageModal.querySelector(".modal__caption");
  const closeModalButtons = document.querySelectorAll(".modal__close-btn");

  const settings = {
    formSelector: ".modal__form",
    inputSelector: ".modal__input",
    submitButtonSelector: ".modal__submit-btn",
    inactiveButtonClass: "modal__submit-btn_disabled",
    inputErrorClass: "modal__input_type_error",
    errorClass: "modal__error_visible",
  };

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

  function renderCard(item, method = "prepend") {
    const cardElement = createCardElement(item);
    if (method === "prepend") {
      cardsContainer.prepend(cardElement);
    } else {
      cardsContainer.append(cardElement);
    }
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

    deleteButton.addEventListener("click", () => {
      cardElement.remove();
    });
    likeButton.addEventListener("click", (event) => {
      event.target.classList.toggle("liked");
    });

    cardImage.addEventListener("click", () => {
      previewImage.src = data.link;
      previewImage.alt = data.name;
      previewCaption.textContent = data.name;
      openModal(previewImageModal);
    });

    return cardElement;
  }

  initialCards.forEach((data) => {
    renderCard(data);
  });

  function openModal(modal) {
    modal.classList.add("modal_opened");
    document.addEventListener("keydown", handleEscClose);
  }

  function closeModal(modal) {
    modal.classList.remove("modal_opened");
    document.removeEventListener("keydown", handleEscClose);
  }

  function handleEscClose(event) {
    if (event.key === "Escape") {
      const openedModal = document.querySelector(".modal_opened");
      if (openedModal) {
        closeModal(openedModal);
      }
    }
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

  openAddCardModalButton.addEventListener("click", () => {
    openModal(addCardModal);
  });

  addCardForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const newCardData = {
      name: inputCardCaption.value.trim(),
      link: inputCardImageLink.value.trim(),
    };
    renderCard(newCardData);
    addCardForm.reset();
    disableButton(event.submitter, settings);
    closeModal(addCardModal);
  });

  closeModalButtons.forEach((button) => {
    const modal = button.closest(".modal");
    button.addEventListener("click", () => closeModal(modal));
  });

  document.querySelectorAll(".modal").forEach((modal) => {
    modal.addEventListener("mousedown", (event) => {
      if (event.target === modal) {
        closeModal(modal);
      }
    });
  });
});
