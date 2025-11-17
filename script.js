'use strict';

/**
 * element toggle function
 */
const elemToggleFunc = function (elem) {
  elem.classList.toggle("active");
};

/**
 * navbar toggle
 */
const navbar = document.querySelector("[data-navbar]");
const overlay = document.querySelector("[data-overlay]");
const navCloseBtn = document.querySelector("[data-nav-close-btn]");
const navOpenBtn = document.querySelector("[data-nav-open-btn]");
const navbarLinks = document.querySelectorAll("[data-nav-link]");

const navElemArr = [overlay, navCloseBtn, navOpenBtn];
for (let i = 0; i < navbarLinks.length; i++) {
  navElemArr.push(navbarLinks[i]);
}
for (let i = 0; i < navElemArr.length; i++) {
  navElemArr[i].addEventListener("click", function () {
    elemToggleFunc(navbar);
    elemToggleFunc(overlay);
  });
}

/**
 * header active state
 */
const header = document.querySelector("[data-header]");
window.addEventListener("scroll", function () {
  window.scrollY >= 400 ? header.classList.add("active")
    : header.classList.remove("active");
});

/**
 * auth modal toggle
 */
const authModal = document.querySelector("[data-auth-modal]");
const authOverlay = document.querySelector("[data-auth-overlay]");
const authCloseBtn = document.querySelector("[data-auth-close-btn]");
const authOpenBtn = document.querySelector("[data-auth-open-btn]");

if (authOpenBtn) {
  const authElements = [authOverlay, authCloseBtn, authOpenBtn];
  for (let i = 0; i < authElements.length; i++) {
    authElements[i].addEventListener("click", function () {
      elemToggleFunc(authModal);
    });
  }
}

/**
 * form logic
 */
const signupForm = document.getElementById('signupForm');
const signupEmailInput = document.getElementById('signupEmail');
const signupPasswordInput = document.getElementById('signupPassword');
const signupMessage = document.getElementById('signupMessage');

const loginForm = document.getElementById('loginForm');
const loginEmailInput = document.getElementById('loginEmail');
const loginPasswordInput = document.getElementById('loginPassword');
const loginMessage = document.getElementById('loginMessage');

const loginTabButton = document.getElementById('login-tab');

const getAccounts = () => {
  const accountsJson = localStorage.getItem('userAccounts');
  return accountsJson ? JSON.parse(accountsJson) : [];
};

const saveAccounts = (accounts) => {
  localStorage.setItem('userAccounts', JSON.stringify(accounts));
};

const setFieldFeedback = (input, isSuccess) => {
  if (!input) return;
  input.classList.remove('is-valid', 'is-invalid');
  if (isSuccess !== null) {
    input.classList.add(isSuccess ? 'is-valid' : 'is-invalid');
  }
};

const displayAuthMessage = (element, message, type) => {
  if (!element) return;
  element.textContent = message;
  element.className = `alert alert-${type} mt-3`;
  element.classList.remove('d-none');
  setTimeout(() => {
    element.classList.add('d-none');
  }, 5000);
};

/**
 * signup logic
 */
if (signupForm) {
  signupForm.addEventListener('submit', (e) => {
    e.preventDefault();
    setFieldFeedback(signupEmailInput, null);
    setFieldFeedback(signupPasswordInput, null);

    const email = signupEmailInput.value.toLowerCase();
    const password = signupPasswordInput.value;
    const name = document.getElementById('signupName').value;
    const accounts = getAccounts();

    if (accounts.some(account => account.email === email)) {
      setFieldFeedback(signupEmailInput, false);
      displayAuthMessage(signupMessage, 'Error: An account with this email already exists.', 'danger');
      return;
    }

    if (password.length < 6) {
      setFieldFeedback(signupPasswordInput, false);
      displayAuthMessage(signupMessage, 'Password must be at least 6 characters long.', 'danger');
      return;
    }

    const newAccount = { email, password, name };
    accounts.push(newAccount);
    saveAccounts(accounts);

    setFieldFeedback(signupEmailInput, true);
    setFieldFeedback(signupPasswordInput, true);
    displayAuthMessage(signupMessage, 'Success! Account created.', 'success');
    signupForm.reset();

    setTimeout(() => {
      if (loginTabButton) loginTabButton.click();
      setFieldFeedback(loginEmailInput, null);
      setFieldFeedback(loginPasswordInput, null);
    }, 1500);
  });
}

/**
 * login logic (with redirect)
 */
if (loginForm) {
  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    setFieldFeedback(loginEmailInput, null);
    setFieldFeedback(loginPasswordInput, null);

    const email = loginEmailInput.value.toLowerCase();
    const password = loginPasswordInput.value;
    const accounts = getAccounts();

    const user = accounts.find(account =>
      account.email === email && account.password === password
    );

    if (user) {
      setFieldFeedback(loginEmailInput, true);
      setFieldFeedback(loginPasswordInput, true);

      localStorage.setItem('loggedInUser', JSON.stringify(user));
      updateAuthButton();
      elemToggleFunc(authModal);

      window.location.href = './index.html';
    } else {
      setFieldFeedback(loginEmailInput, false);
      setFieldFeedback(loginPasswordInput, false);
      displayAuthMessage(loginMessage, 'Invalid email or password. Please try again.', 'danger');
    }
  });
}

/**
 * tab switch cleanup
 */
document.querySelectorAll('.nav-link').forEach(tab => {
  tab.addEventListener('click', () => {
    setFieldFeedback(loginEmailInput, null);
    setFieldFeedback(loginPasswordInput, null);
    if (loginMessage) loginMessage.classList.add('d-none');

    setFieldFeedback(signupEmailInput, null);
    setFieldFeedback(signupPasswordInput, null);
    const signupNameInput = document.getElementById('signupName');
    if (signupNameInput) signupNameInput.classList.remove('is-valid', 'is-invalid');
    if (signupMessage) signupMessage.classList.add('d-none');
  });
});

/**
 * login/logout button logic
 */
const authButton = document.querySelector('[data-auth-btn]');
const profileIcon = document.getElementById('profileIcon');
const profileText = document.getElementById('profileText');

const updateAuthButton = () => {
  const loggedInUser = localStorage.getItem('loggedInUser');
  if (authButton) {
    if (loggedInUser) {
      profileIcon.setAttribute('name', 'log-out-outline');
      profileText.textContent = 'Logout';
      authButton.setAttribute('aria-label', 'Logout');
    } else {
      profileIcon.setAttribute('name', 'person-circle-outline');
      profileText.textContent = 'Login';
      authButton.setAttribute('aria-label', 'Login');
    }
  }
};

const logoutUser = () => {
  localStorage.removeItem('loggedInUser');
  updateAuthButton();
  alert('You have been logged out!');
};

if (authButton) {
  authButton.addEventListener('click', (event) => {
    const loggedInUser = localStorage.getItem('loggedInUser');
    if (loggedInUser) {
      logoutUser();
    } else {
      if (authModal) {
        elemToggleFunc(authModal);
      }
    }
  });

  updateAuthButton();
}
