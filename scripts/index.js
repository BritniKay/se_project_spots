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
  const errorCaptionMessage = document.querySelector(
    "#profile-caption-input-error"
  );
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
    const cardElement = cardTemplate.cloneNode(true);
    const cardTitle = cardElement.querySelector(".card__title");
    const cardImage = cardElement.querySelector(".card__img");
    const deleteButton = cardElement.querySelector(".card__delete-button");

    cardTitle.textContent = data.name;
    cardImage.src = data.link;
    cardImage.alt = data.name;

    deleteButton.addEventListener("click", () => {
      cardElement.remove();
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

  function showInputError(formElement, inputElement, errorMessage, config) {
    const errorElement = formElement.querySelector(`#${inputElement.id}-error`);
    inputElement.classList.add(config.inputErrorClass);
    errorElement.textContent = errorMessage;
    errorElement.classList.add(config.errorClass);
  }

  function hideInputError(formElement, inputElement, config) {
    const errorElement = formElement.querySelector(`#${inputElement.id}-error`);
    inputElement.classList.remove(config.inputErrorClass);
    errorElement.classList.remove(config.errorClass);
    errorElement.textContent = "";
  }

  function checkInputValidity(formElement, inputElement, config) {
    let errorMessage = "";

    if (inputElement.validity.valueMissing) {
      errorMessage = "This field is required.";
    } else if (
      inputElement.validity.typeMismatch &&
      inputElement.type === "url"
    ) {
      errorMessage = "Please enter a valid URL, like https://example.com.";
    } else if (inputElement.validity.tooShort) {
      errorMessage = `Minimum length is ${inputElement.minLength} characters. You have entered ${inputElement.value.length}.`;
    } else if (inputElement.validity.tooLong) {
      errorMessage = `Maximum length is ${inputElement.maxLength} characters. Please shorten your input.`;
    }

    if (errorMessage) {
      showInputError(formElement, inputElement, errorMessage, config);
    } else {
      hideInputError(formElement, inputElement, config);
    }
  }

  function setEventListeners(formElement, config) {
    const inputList = Array.from(
      formElement.querySelectorAll(config.inputSelector)
    );
    const buttonElement = formElement.querySelector(
      config.submitButtonSelector
    );

    inputList.forEach((inputElement) => {
      inputElement.addEventListener("input", () => {
        checkInputValidity(formElement, inputElement, config);
        toggleButtonState(inputList, buttonElement, config);
      });
    });
  }

  function toggleButtonState(inputList, buttonElement, config) {
    if (inputList.some((input) => !input.validity.valid)) {
      buttonElement.classList.add(config.inactiveButtonClass);
      buttonElement.disabled = true;
    } else {
      buttonElement.classList.remove(config.inactiveButtonClass);
      buttonElement.disabled = false;
    }
  }

  function resetForm(formElement, config) {
    formElement.reset();
    const inputList = Array.from(
      formElement.querySelectorAll(config.inputSelector)
    );
    const buttonElement = formElement.querySelector(
      config.submitButtonSelector
    );

    inputList.forEach((inputElement) => {
      hideInputError(formElement, inputElement, config);
    });

    buttonElement.classList.add(config.inactiveButtonClass);
    buttonElement.disabled = true;
  }

  function enableValidation(config) {
    const formList = Array.from(document.querySelectorAll(config.formSelector));
    formList.forEach((formElement) => {
      setEventListeners(formElement, config);

      formElement.addEventListener("submit", (event) => {
        event.preventDefault();

        const inputList = Array.from(
          formElement.querySelectorAll(config.inputSelector)
        );
        inputList.forEach((inputElement) => {
          checkInputValidity(formElement, inputElement, config);
        });

        if (formElement.checkValidity()) {
          console.log("Form submitted successfully!");
        }
      });
    });
  }

  enableValidation(settings);

  profileEditButton.addEventListener("click", () => {
    resetForm(profileForm, settings);
    openModal(profileEditModal);
  });

  profileForm.addEventListener("submit", (event) => {
    event.preventDefault();
    if (profileForm.checkValidity()) {
      profileName.textContent = inputProfileName.value.trim();
      profileDescription.textContent = inputProfileDescription.value.trim();
      closeModal(profileEditModal);
    }
  });

  openAddCardModalButton.addEventListener("click", () => {
    resetForm(addCardForm, settings);
    openModal(addCardModal);
  });

  addCardForm.addEventListener("submit", (event) => {
    event.preventDefault();
    if (addCardForm.checkValidity()) {
      const newCardData = {
        name: inputCardCaption.value.trim(),
        link: inputCardImageLink.value.trim(),
      };
      renderCard(newCardData);
      resetForm(addCardForm, settings);
      closeModal(addCardModal);
    }
  });

  closeModalButtons.forEach((button) => {
    const modal = button.closest(".modal");
    button.addEventListener("click", () => closeModal(modal));
  });

  previewImageModal.addEventListener("click", (event) => {
    if (event.target === previewImageModal) {
      closeModal(previewImageModal);
    }
  });

  document.querySelectorAll(".modal").forEach((modal) => {
    modal.addEventListener("mousedown", (event) => {
      if (event.target === modal) {
        closeModal(modal);
      }
    });
  });
});
