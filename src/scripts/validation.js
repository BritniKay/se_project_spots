export const settings = {
  formSelector: ".modal__form",
  inputSelector: ".modal__input",
  submitButtonSelector: ".modal__submit-btn",
  inactiveButtonClass: "modal__submit-btn_disabled",
  inputErrorClass: "modal__input_type_error",
  errorClass: "modal__error_visible",
  validationRules: {
    name: { minLength: 2, maxLength: 40 },
    description: { minLength: 2, maxLength: 200 },
    url: { pattern: /^(ftp|http|https):\/\/[^ "]+$/ },
  },
};

export const validationconfig = {
  allowEmptyFields: false,
  validateOnBlur: true,
  errorMessages: {
    required: "This field is required.",
    invalidFormat: "Invalid format.",
  },
};

export function getErrorElement(inputElement) {
  return document.querySelector(`#${inputElement.id}-error`);
}

export function showInputError(
  formElement,
  inputElement,
  errorMessage,
  config
) {
  const errorElement = getErrorElement(inputElement);
  if (!errorElement) {
    console.error(`Error: No error element found for ${inputElement.id}`);
    return;
  }
  inputElement.classList.add(config.inputErrorClass);
  errorElement.textContent = errorMessage;
  errorElement.classList.add(config.errorClass);
  errorElement.setAttribute("aria-live", "polite");
  inputElement.setAttribute("aria-describedby", inputElement.id + "-error");
}

export function hideInputError(formElement, inputElement, config) {
  const errorElement = getErrorElement(inputElement);
  if (!errorElement) return;
  inputElement.classList.remove(config.inputErrorClass);
  errorElement.classList.remove(config.errorClass);
  errorElement.textContent = "";
  errorElement.removeAttribute("aria-live");
  inputElement.removeAttribute("aria-describedby");
}

export function checkInputValidity(formElement, inputElement, config) {
  const rules = config.validationRules;

  if (
    inputElement.type === "url" &&
    !rules.url.pattern.test(inputElement.value)
  ) {
    showInputError(
      formElement,
      inputElement,
      "Please enter a valid URL.",
      config
    );
    return;
  }

  if (!inputElement.validity.valid) {
    showInputError(
      formElement,
      inputElement,
      inputElement.validationMessage,
      config
    );
  } else {
    hideInputError(formElement, inputElement, config);
  }
}

export function debounce(func, delay = 300) {
  let timeout;
  return function (...args) {
    const context = this;
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(context, args), delay);
  };
}

export function setEventListeners(formElement, config) {
  if (!formElement) {
    console.error(
      "Error: formElement is undefined, cannot set event listeners."
    );
    return;
  }
  const inputList = Array.from(
    formElement.querySelectorAll(config.inputSelector)
  );
  const buttonElement = formElement.querySelector(config.submitButtonSelector);

  toggleButtonState(inputList, buttonElement, config);

  inputList.forEach((inputElement) => {
    inputElement.addEventListener(
      "input",
      debounce(() => {
        checkInputValidity(formElement, inputElement, config);
        toggleButtonState(inputList, buttonElement, config);
      }, 300)
    );
  });
}

export function renderLoading(
  buttonElement,
  isLoading,
  buttonText = "Save",
  loadingText = "Saving..."
) {
  if (!buttonElement) return;

  if (isLoading) {
    buttonElement.textContent = loadingText;
    buttonElement.disabled = true;
  } else {
    buttonElement.textContent = buttonText;
    buttonElement.disabled = false;
  }
}

export function toggleButtonState(inputList, buttonElement, config) {
  if (!buttonElement) {
    console.error(
      "Error: buttonElement is undefined, cannot toggle button state."
    );
    return;
  }

  const isFormInvalid = inputList.some((input) => {
    return !input.validity.valid || !input.value.trim();
  });

  if (isFormInvalid) {
    buttonElement.classList.add(config.inactiveButtonClass);
    buttonElement.disabled = true;
  } else {
    buttonElement.classList.remove(config.inactiveButtonClass);
    buttonElement.disabled = false;
  }
}

export function resetForm(formElement, config) {
  if (!formElement) {
    console.error("Error: resetForm called with undefined formElement.");
    return;
  }
  formElement.reset();
  const inputList = Array.from(
    formElement.querySelectorAll(config.inputSelector)
  );
  const buttonElement = formElement.querySelector(config.submitButtonSelector);

  inputList.forEach((inputElement) => {
    hideInputError(formElement, inputElement, config);
  });

  if (buttonElement) {
    buttonElement.classList.add(config.inactiveButtonClass);
    buttonElement.disabled = true;
  }
}

export function enableValidation(config) {
  const formList = Array.from(document.querySelectorAll(config.formSelector));
  formList.forEach((formElement) => {
    setEventListeners(formElement, config);
  });
}
