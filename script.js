const helpOptions = [
  {
    id: "adoption",
    title: "Adopt an Animal",
    description: "Give a rescued animal a safe and loving forever home."
  },
  {
    id: "foster",
    title: "Become a Foster",
    description: "Provide temporary care while an animal waits for a permanent home."
  },
  {
    id: "volunteer",
    title: "Volunteer",
    description: "Give your time and help animals receive the care they need."
  },
  {
    id: "donate",
    title: "Donate",
    description: "Help provide food, shelter, medical care, and other necessities."
  }
];

const contactReasons = [
  "adoption",
  "foster",
  "volunteer",
  "donate",
  "general"
];

const actionMessages = {
  adoption: "Thank you for choosing adoption! Every adoption gives an animal a second chance.",
  foster: "Fostering gives an animal a safe place to stay while waiting for a forever home.",
  volunteer: "Volunteers make a huge difference by giving their time and energy to animals in need.",
  donate: "Your donation helps provide food, shelter, medical care, and other important resources."
};

const fieldRequirements = {
  nameMinLength: 2,
  messageMinLength: 10
};

const storageKey = "tcarHelpPreference";

function saveHelpPreference(value) {
  localStorage.setItem(storageKey, value);
}

function loadHelpPreference() {
  return localStorage.getItem(storageKey);
}

function findHelpOption(id) {
  return helpOptions.find(option => option.id === id);
}

function updateActiveButton(id) {
  document.querySelectorAll(".interest-button").forEach(button => {
    button.classList.toggle("selected", button.dataset.interest === id);
  });
}

function displayHelpOption(id) {
  const option = findHelpOption(id);
  const result = document.getElementById("interest-result");

  if (!option || !result) return;

  result.innerHTML = `<strong>${option.title}</strong><p>${option.description}</p>`;
  updateActiveButton(id);
  saveHelpPreference(id);

  const saved = document.getElementById("saved-interest");
  if (saved) saved.textContent = `Saved preference: ${option.title}`;
}

function initializeHelpFeature() {
  const buttons = document.querySelectorAll(".interest-button");

  buttons.forEach(button => {
    button.addEventListener("click", () => {
      displayHelpOption(button.dataset.interest);
    });
  });

  const saved = loadHelpPreference();
  if (saved && findHelpOption(saved)) displayHelpOption(saved);
}

function clearValidationMessages() {
  document.querySelectorAll(".error-message").forEach(error => {
    error.textContent = "";
  });

  document.querySelectorAll(".input-error").forEach(field => {
    field.classList.remove("input-error");
  });
}

function showFieldError(field, message) {
  const error = document.getElementById(`${field.id}-error`);
  field.classList.add("input-error");
  if (error) error.textContent = message;
}

function validateName(field) {
  const value = field.value.trim();

  if (!value) {
    showFieldError(field, "Name is required.");
    return false;
  }

  if (value.length < fieldRequirements.nameMinLength) {
    showFieldError(field, "Name must be at least 2 characters.");
    return false;
  }

  return true;
}

function validateEmail(field) {
  const value = field.value.trim();
  const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!value) {
    showFieldError(field, "Email is required.");
    return false;
  }

  if (!pattern.test(value)) {
    showFieldError(field, "Enter a valid email address.");
    return false;
  }

  return true;
}

function validateReason(field) {
  if (!contactReasons.includes(field.value)) {
    showFieldError(field, "Please select a reason for contacting us.");
    return false;
  }

  return true;
}

function validateMessage(field) {
  const value = field.value.trim();

  if (!value) {
    showFieldError(field, "Message is required.");
    return false;
  }

  if (value.length < fieldRequirements.messageMinLength) {
    showFieldError(field, "Message must be at least 10 characters.");
    return false;
  }

  return true;
}

function validateContactForm() {
  const name = document.getElementById("name");
  const email = document.getElementById("email");
  const reason = document.getElementById("reason");
  const message = document.getElementById("message");

  const validName = validateName(name);
  const validEmail = validateEmail(email);
  const validReason = validateReason(reason);
  const validMessage = validateMessage(message);

  return validName && validEmail && validReason && validMessage;
}

function displayStoredInterestOnContact() {
  const saved = loadHelpPreference();
  const message = document.getElementById("stored-interest-message");
  const reason = document.getElementById("reason");
  const option = findHelpOption(saved);

  if (!message || !option) return;

  message.textContent = `Your saved interest is ${option.title}. We selected it below for you.`;

  if (reason) reason.value = saved;
}

function initializeContactForm() {
  const form = document.getElementById("contact-form");
  if (!form) return;

  displayStoredInterestOnContact();

  form.addEventListener("submit", event => {
    event.preventDefault();
    clearValidationMessages();

    if (!validateContactForm()) {
      document.querySelector(".input-error")?.focus();
      return;
    }

    document.getElementById("form-success").textContent =
      "Thank you! Your message is ready to be sent.";
    form.reset();
  });
}

function initializeWebsite() {
  initializeHelpFeature();
  initializeContactForm();
}

document.addEventListener("DOMContentLoaded", initializeWebsite);