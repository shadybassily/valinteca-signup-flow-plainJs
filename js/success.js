//user email that will be displayed on the success page
let storedEmail = document.querySelector(".stored-email");
storedEmail.textContent = JSON.parse(localStorage.getItem('email'))