// Set up our register function
function register () {
  // Get all our input fields
  let email = document.getElementById('email').value
  let username = document.getElementById('username').value
  let password = document.getElementById('password').value

  // Validate input fields
  if (validate_email(email) == false || validate_password(password) == false || username.trim()=="") {
    error("User Credentials are invalid");
    return
    // Don't continue running the code
  }

  (new FetchRequest("POST", "users/register", {email, username, password})).send(registerSuccess, registerFailure);
}

function registerSuccess(data) {
  error("");

  alert("Registration was successful!");

  let location = data.role=="nurse" ? `/nurse/${data.username}` : "/";

  window.location.replace(location);
}

function registerFailure(data) {
  error(data.message);
}

// Set up our login function
function login () {
  // Get all our input fields
  email    = document.getElementById('email').value
  password = document.getElementById('password').value

  // Validate input fields
  if (validate_email(email) == false || validate_password(password) == false) {
    error("User Credentials are invalid");
    return
    // Don't continue running the code
  }

  (new FetchRequest("POST", "users/login", {username: email, password})).send(loginSuccess, loginFailure);
}

function loginSuccess(data) {
  error("");

  let location = "/";

  if(data.role=="nurse"){
    location += "nurse/"
  }
  else if(data.role=="visitor"){
    location += "visitor/"
  }

  window.location.replace(`${location + data.username}`);
}

function loginFailure(data) {
  error(data.message);
}

function error(message) {
  let responseError = document.querySelector("#error");

  responseError.innerHTML = message;
}




// Validate Functions
function validate_email(email) {
  expression = /^[^@]+@\w+(\.\w+)+\w$/
  if (expression.test(email) == true) {
    // Email is good
    return true
  } else {
    // Email is not good
    return false
  }
}

function validate_password(password) {
  // Firebase only accepts lengths greater than 6
  if (password < 6) {
    return false
  } else {
    return true
  }
}

function validate_field(field) {
  if (field == null) {
    return false
  }

  if (field.length <= 0) {
    return false
  } else {
    return true
  }
}