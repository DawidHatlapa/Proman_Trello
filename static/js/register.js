let userRegistrationEmail = "";
let userRegistrationPassword = "";
let userRegistrationPasswordConfirmed = "";
let userRegistrationHashedPassword = "";
let registrationSuccessStatus = "false";

export const minPasswordLength = 4;
let hintMessages = [];
let userRegistrationDataCorrect = true;

let urlRegister = "/register";

export const hintMessageType = {
    "errorConfirmation": "Passwords don't match.",
    "errorEmailTaken": "Email is already taken.",
    "errorEmptyEmail": "Email is empty.",
    "errorNotValidEmail": "Email is wrong. Enter Valid email.",
    "errorEmptyPassword": "Password can't be empty.",
    "errorMinPasswordLength": `Password's min. lenght is ${minPasswordLength}` ,
    "registrationSuccessful": "Success! Your account is registered.",
    "registrationFailed": "Login already exist. Try again.",
    "registrationDataCorrect": "Your registration data is correct.",
    "loginDataCorrect": "Your login data is correct.",
    "loginSuccessful": "Login successful!",
    "loginNotSuccessful": "Login or password isn't correct! "
}

let registerButton = document.getElementById("registerButtonSubmit");

initRegisterPage();

////////////////////////////////////////////
/// main module function ///////////////////
function initRegisterPage(){
    let active_url = window.location.href;
    if (active_url.includes(urlRegister)){
        initRegisterButton();
    }
}
function initRegisterButton(){
    registerButton.addEventListener("click", registerProcessLinkedToButton);

}

function registerProcessLinkedToButton(e){
    //console.log(e);
    getUserRegisterInput();
    checkUserRegistrationData();
    sendRegistrationDataToServer();
}


////////////////////////////////////////////
/// module subfunctions ///////////////////

export function showWaitForResponse(status){
    let waitForResponseDiv = document.getElementById("waitForResponse");
    if(status === "on"){
        waitForResponseDiv.innerText = "Please wait ...";
    }else {
        waitForResponseDiv.innerText = "";
    }
}

function getUserRegisterInput(){
    userRegistrationEmail = document.getElementById("login").value;
    userRegistrationPassword = document.getElementById("password1").value;
    userRegistrationPasswordConfirmed = document.getElementById("password2").value;

}

function checkUserRegistrationData(){
    resetHintMessages(userRegistrationDataCorrect);
    var check_MatchPasswords = checkPasswordConfirmedMatchPassword(
        userRegistrationPassword, userRegistrationPasswordConfirmed
    );
    var check_PasswordLenght = checkValidPasswordLength(userRegistrationPassword);
    var check_ValidEmail = checkValidEmail(userRegistrationEmail);
    var check_NotEmptyEmail = checkNotEmptyEmail(userRegistrationEmail);
    userRegistrationDataCorrect = check_MatchPasswords && check_PasswordLenght && check_ValidEmail && check_NotEmptyEmail;
    if (userRegistrationDataCorrect == true){
        hintMessages.push(hintMessageType["registrationDataCorrect"]);
    }
    //console.log(hintMessages);
    showUserHintMessages(userRegistrationDataCorrect);

}

function sendRegistrationDataToServer(){
    if (userRegistrationDataCorrect === true){

        registerButton.hidden = true;
        showWaitForResponse("on");
        sendUserRegistrationData();
    }else{

    }
}


export function resetHintMessages(userDataCorrect){
    userDataCorrect = true;
    hintMessages = [];
}

export function showUserHintMessages(userDataCorrectCheck){
    let hintMessagesDiv = document.getElementById("hintMessages");
    hintMessagesDiv.innerHTML = "";

    let cssClassStatus = "hintMessagesWrong";
    if (userDataCorrectCheck == true){
        cssClassStatus = "hintMessagesCorrect";
    }

    hintMessages.forEach((hint) => {
        let newHintDiv = document.createElement("div");
        newHintDiv.classList.add(cssClassStatus);
        newHintDiv.innerText = hint;
        hintMessagesDiv.appendChild(newHintDiv);
    });
}

function showServerRegistrationStatus(){
    hintMessages = [];
    if (registrationSuccessStatus === false){
        hintMessages.push(hintMessageType['registrationFailed'])
    }else{
        hintMessages.push(hintMessageType["registrationSuccessful"])
    }


    let hintMessagesDiv = document.getElementById("hintMessages");
    hintMessagesDiv.innerHTML = "";

    let cssClassStatus = "hintMessagesWrong";
        if (registrationSuccessStatus === true){
        cssClassStatus = "hintMessagesCorrect";
    }
    let newHintDiv = document.createElement("div");
        newHintDiv.classList.add(cssClassStatus);
        newHintDiv.innerText = hintMessages[0];
        hintMessagesDiv.appendChild(newHintDiv);
}


export function checkValidPasswordLength(password){
    if (password.length <= minPasswordLength){
      hintMessages.push(hintMessageType["errorMinPasswordLength"]);
      return false;
    }else{
        return true;
    }
}

export function checkValidEmail(email) {
    if ((email.indexOf("@") == -1) ||
        (email.indexOf(".") == -1)) {
        hintMessages.push(hintMessageType["errorNotValidEmail"]);
        return false;
    }else{
        return true;
    }
}
function checkPasswordConfirmedMatchPassword(password1, password2){
    if (password1 !== password2){
        hintMessages.push(hintMessageType["errorConfirmation"]);
        return false;
    }else{
        return true;
    }
}

export function checkNotEmptyEmail(email){
    if (email.length === 0){
        hintMessages.push(hintMessageType["errorEmptyEmail"]);
        return false;
    }else{
        return true;
    }
}


function sendUserRegistrationData(){
    fetch(urlRegister,{
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
            },
        body: JSON.stringify({
            "login": userRegistrationEmail,
            "password": userRegistrationPassword
        })
    })
    .then(response => response.json())
    .then(function checkAndShowRegistrationStatus(response){
        if (response['registration_success_status'] === "login exist"){
            registrationSuccessStatus = false;
        }else{
            registrationSuccessStatus = true;
        }
        showServerRegistrationStatus();
        showWaitForResponse("off");
        registerButton.hidden = false;
        //console.log(response);
    })
}
