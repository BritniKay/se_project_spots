// Define the deleteImage function in the global scope
function deleteImage(button) {
  const card = button.closest(".card");
  card.remove();
}

document.addEventListener("DOMContentLoaded", function () {
  // Profile elements
  const profileNameFirst = document.querySelector(".profile__name-first");
  const profileDescriptionFirst = document.querySelector(
    ".profile__description-first"
  );

  const inputName = document.querySelector("#profil-name-input");
  const inputDescription = document.querySelector("#profile-description-input");

  const profileEditButton = document.querySelector(".profile__edit-btn");
  const editModal = document.querySelector("#edit-modal");
  const editModalCloseBtn = editModal.querySelector(".modal__close-btn");
  const profileForm = document.forms["profile-form"];

  // Card elements
  const cardsContainer = document.querySelector(".cards__list");
  const cardTemplate = document.querySelector("#card-template").content;

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

  function getCardElement(data) {
    const cardElement = cardTemplate.cloneNode(true);
    const cardTitle = cardElement.querySelector(".card__title");
    const cardImage = cardElement.querySelector(".card__img");
    const likeButton = cardElement.querySelector(".card__like-button");
    const deleteButton = cardElement.querySelector(".card__delete-button");

    cardTitle.textContent = data.name;
    cardImage.src = data.link;
    cardImage.alt = data.name;

    // Like button event listener
    if (likeButton) {
      likeButton.addEventListener("click", () => {
        likeButton.classList.toggle("liked");
      });
    } else {
      console.error("Like button not found");
    }

    // Delete button event listener
    if (deleteButton) {
      deleteButton.addEventListener("click", () => {
        deleteImage(deleteButton);
      });
    } else {
      console.error("Delete button not found");
    }

    // Image preview modal event listener
    cardImage.addEventListener("click", () => {
      const previewModal = document.querySelector("#preview-modal");
      const previewImage = previewModal.querySelector(".modal__image");
      const previewCaption = previewModal.querySelector(".modal__caption");
      previewImage.src = data.link;
      previewImage.alt = data.name;
      previewCaption.textContent = data.name;
      openModal(previewModal);
    });

    return cardElement;
  }

  initialCards.forEach((data) => {
    const cardElement = getCardElement(data);
    cardsContainer.appendChild(cardElement);
  });

  function openModal(modal) {
    modal.classList.add("modal_opened");
  }

  function closeModal(modal) {
    modal.classList.remove("modal_opened");
  }

  function handleProfileFormSubmit(event) {
    event.preventDefault();
    profileNameFirst.textContent = inputName.value.trim();
    profileDescriptionFirst.textContent = inputDescription.value.trim();
    closeModal(editModal);
  }

  function populateProfileInputs() {
    inputName.value = profileNameFirst.textContent.trim();
    inputDescription.value = profileDescriptionFirst.textContent.trim();
  }

  profileEditButton.addEventListener("click", () => {
    populateProfileInputs();
    openModal(editModal);
  });

  if (editModalCloseBtn) {
    editModalCloseBtn.addEventListener("click", () => closeModal(editModal));
  } else {
    console.error("Edit modal close button not found.");
  }

  profileForm.addEventListener("submit", handleProfileFormSubmit);

  // New post form elements
  const addCardModal = document.querySelector("#add-card-modal");
  const addCardForm = document.forms["add-card-form"];
  const inputImageLink = document.querySelector("#profil-image-link");
  const inputCaption = document.querySelector("#profile-caption-input");
  const addCardModalCloseBtn = addCardModal.querySelector(".modal__close-btn");

  function handleAddCardFormSubmit(event) {
    event.preventDefault();
    const newCardData = {
      name: inputCaption.value.trim(),
      link: inputImageLink.value.trim(),
    };
    const newCardElement = getCardElement(newCardData);
    cardsContainer.prepend(newCardElement); // Prepend new card to the top of the container
    closeModal(addCardModal);
  }

  addCardForm.addEventListener("submit", handleAddCardFormSubmit);
  if (addCardModalCloseBtn) {
    addCardModalCloseBtn.addEventListener("click", () =>
      closeModal(addCardModal)
    );
  } else {
    console.error("Add card modal close button not found.");
  }

  // Use the button specified by the user
  const openAddCardModalButton = document.querySelector(".profile__add-btn");
  if (openAddCardModalButton) {
    console.log("Add card button found and event listener attached.");
    openAddCardModalButton.addEventListener("click", () =>
      openModal(addCardModal)
    );
  } else {
    console.error("Add card button not found.");
  }

  // Close preview modal button
  const previewModalCloseBtn = document.querySelector(
    "#preview-modal .modal__close-btn"
  );
  if (previewModalCloseBtn) {
    previewModalCloseBtn.addEventListener("click", () => {
      const previewModal = document.querySelector("#preview-modal");
      closeModal(previewModal);
    });
  } else {
    console.error("Preview modal close button not found.");
  }

  // Image preview modal script
  const modal = document.getElementById("preview-modal");
  const modalImage = modal.querySelector(".modal__img");
  const modalCaption = modal.querySelector(".modal__caption");
  const closeModalBtn = modal.querySelector(".modal__close-btn");

  document.querySelectorAll(".card__image").forEach((image) => {
    image.addEventListener("click", function () {
      modalImage.src = this.src;
      modalCaption.textContent = this.alt; // Set caption text
      modal.classList.add("modal_opened");
    });
  });

  closeModalBtn.addEventListener("click", function () {
    modal.classList.remove("modal_opened");
  });

  modal.addEventListener("click", function (e) {
    if (e.target === modal) {
      modal.classList.remove("modal_opened");
    }
  });
});
