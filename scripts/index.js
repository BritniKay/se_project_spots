document.addEventListener("DOMContentLoaded", function () {
  const profileNameFirst = document.querySelector(".profile__name-first");
  const profileDescriptionFirst = document.querySelector(
    ".profile__description-first"
  );

  const inputName = document.querySelector("#profil-name-input");
  const inputDescription = document.querySelector("#profile-description-input");

  const profileEditButton = document.querySelector(".profile__edit-btn");
  const editModal = document.querySelector("#edit-modal");
  const editModalCloseBtn = editModal.querySelector(".modal__close-btn");
  const form = document.querySelector(".modal__form");

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

    cardTitle.textContent = data.name;
    cardImage.src = data.link;
    cardImage.alt = data.name;

    return cardElement;
  }

  initialCards.forEach((data) => {
    const cardElement = getCardElement(data);
    cardsContainer.appendChild(cardElement);
  });

  function getFirstTwoWords(text) {
    const words = text.trim().split(/\s+/);
    return words.slice(0, 2).join(" ");
  }

  function openModal() {
    inputName.value = profileNameFirst.textContent.trim();
    inputDescription.value = profileDescriptionFirst.textContent.trim();
    editModal.classList.add("modal_opened");
  }

  function closeModal() {
    editModal.classList.remove("modal_opened");
  }

  function handleFormSubmit(event) {
    event.preventDefault();
    profileNameFirst.textContent = getFirstTwoWords(inputName.value);
    profileDescriptionFirst.textContent = getFirstTwoWords(
      inputDescription.value
    );
    closeModal();
  }

  profileEditButton.addEventListener("click", openModal);
  editModalCloseBtn.addEventListener("click", closeModal);
  form.addEventListener("submit", handleFormSubmit);
});
