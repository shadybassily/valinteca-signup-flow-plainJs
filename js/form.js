// selecting the signup form and its inputs
let signUpForm = document.getElementById("signup-form");
let usernameInput = document.getElementById("username");
let emailInput = document.getElementById("email");
let password1Input = document.getElementById("password");
let password2Input = document.getElementById("confirm-password");
//errors
let usernameErrTag = document.getElementById("username-error");
let emailErrTag = document.getElementById("email-error");
let password1ErrTag = document.getElementById("password1-error");
let password2ErrTag = document.getElementById("password2-error");
//errors
let usernameErr, emailErr, password1Err, password2Err;
let errors = { usernameErr, emailErr, password1Err, password2Err };
//values
let username, email, password1, password2;
let data = { username, email, password1, password2 };

usernameInput.addEventListener("input", handleUsernameInput);
emailInput.addEventListener("input", handleEmailInput);
password1Input.addEventListener("input", handlePassword1Input);
password2Input.addEventListener("input", handlePassword2Input);
signUpForm.addEventListener("submit", handleSubmit);

//validating inputs
function isValidUsername(username) {
  //username must be betweeen 5-15characters
  //including only letters and numbers
  //cant start or end with numbers
  let usernameRegex = /^(?=.{5,15}$)[a-z]+\d*[a-z]+$/i;
  return usernameRegex.test(username);
}
function isValidEmail(email) {
  if (email === "") {
    return false;
  }
  let emailRegex = /^[A-Za-z0-9_!#$%&'*+\/=?`{|}~^.-]+@[A-Za-z0-9.-]+$/;
  return emailRegex.test(email);
}
function isvalidPassword(password) {
  return password.length < 8 ? false : true;
}
function isPasswordMatch(password1, password2) {
  if (!password1 || !password2) {
    return false;
  }
  return password1 !== password2 ? false : true;
}

//handling inputs events
function handleUsernameInput(e) {
  if (isValidUsername(e.target.value)) {
    usernameErr = "";
    data["username"] = e.target.value;
    usernameInput.closest(".input-container").classList.remove("error-border")
  } else {
    usernameErr =
      "Username must be 5-15 characters, containing only letters and numbers, can't start or end with numbers.";
      usernameInput.closest(".input-container").classList.add("error-border")
  }
  usernameErrTag.innerText = usernameErr;
}

function handleEmailInput(e) {
  if (isValidEmail(e.target.value)) {
    emailErr = "";
    emailInput.closest(".input-container").classList.remove("error-border")
    data["email"] = e.target.value;
    
  } else {
    emailErr = "Invalid email";
    emailInput.closest(".input-container").classList.add("error-border")

  }
  emailErrTag.innerText = emailErr;
}

function handlePassword1Input(e) {
  if (isvalidPassword(e.target.value)) {
    password1Err = "";
    data["password1"] = e.target.value;
    password1Input.closest(".input-container").classList.remove("error-border")

  } else {
    password1Err = "Password must be at least 8 characters";
    password1Input.closest(".input-container").classList.add("error-border")

  }
  password1ErrTag.innerText = password1Err;
}

function handlePassword2Input(e) {
  if (isPasswordMatch(data["password1"], e.target.value)) {
    password2Err = "";
    password2Input.closest(".input-container").classList.remove("error-border")

    data["password2"] = e.target.value;
  } else {
    password2Err = "Passwords don't match";
    password2Input.closest(".input-container").classList.add("error-border")
  }
  password2ErrTag.innerText = password2Err;
}

function handleSubmit(e) {
  e.preventDefault();
  //if the form is valid, 
  //perform the post request
  if (isFormValid()) {
    let stringifiedData = JSON.stringify({
      username: data["username"],
      email: data["email"],
      password: data["password1"],
      password_confirmation: data["password2"],
    });
    postData(
      "https://goldblv.com/api/hiring/tasks/register",
      stringifiedData
    ).then((data) => {
      //if there are errors 
      data.errors;
      if (data.errors) {
        // display the errors
        password1ErrTag.innerText = data.errors.password;
      } else {
        loginSuccessfull(data);
      }
    });
  } else {
    displayErrors();
  }
}

function isFormValid() {
  //if we have empty values, then false
  if (Object.values(data).some((value) => value === undefined)) {
    return false;
    //if we dont have empty values, and our errors are undefined,
    //means the user entered the right data the first time
  } else {
    if (Object.values(errors).every((err) => err === undefined)) {
      return true;
    }
  }
  //if we dont have empty values, the user entered wrong data
  //but then corrected them, that will lead the errors to == ""
  if (Object.values(errors).some((err) => err !== "")) {
    return false;
  }
  return true;
}

function displayErrors() {
  usernameErrTag.innerText =
    usernameErr != ""
      ? "Username must be 5-15 characters, containing only letters and numbers, can't start or end with numbers."
      : "";
      usernameInput.closest(".input-container").classList.add("error-border")

  emailErrTag.innerText = emailErr != "" ? "Invalid email." : "";
  emailInput.closest(".input-container").classList.add("error-border")

  password1ErrTag.innerText =
    password1Err != "" ? "Password must be at least 8 characters." : "";
  password1Input.closest(".input-container").classList.add("error-border")

  password2ErrTag.innerText =
    password2Err != "" ? "Passwords don't match." : "";
    password2Input.closest(".input-container").classList.add("error-border")
}

const loginSuccessfull = (data) => {
  //saving the email used, to local storage
  localStorage.setItem("email", JSON.stringify(data.email));
  clearEventListeners();
  //dynamic URL that will work in development and deployment
  let url = window.location.href
  console.log(url.replace("signUp", "successful"))
  location.replace(url.replace("signUp", "successful"));
};
function clearEventListeners() {
  usernameInput.removeEventListener("input", handleUsernameInput);
  emailInput.removeEventListener("input", handleEmailInput);
  password1Input.removeEventListener("input", handlePassword1Input);
  password2Input.removeEventListener("input", handlePassword2Input);
  signUpForm.removeEventListener("submit", handleSubmit);
}
async function postData(url = "", data = {}) {
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: data,
  });
  return response.json();
}
