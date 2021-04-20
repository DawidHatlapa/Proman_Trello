import {
    minPasswordLength,
    hintMessageType,
    checkNotEmptyEmail,
    checkValidEmail,
    checkValidPasswordLength,
    showUserHintMessages,
    resetHintMessages,
    showWaitForResponse
} from "/static/js/register.js"

let userEmail = "";
let userPassword = "";
let hintMessages = [];

let userLoginDataCorrect = true;
let loginSuccessStatus = false;

let urlLogin = "/login";


let loginButton = document.getElementById("loginButtonSubmit");

initLoginPage();
////////////////////////////////////////////
/// main module function ///////////////////
function initLoginPage(){
    let active_url = window.location.href;
    if (active_url.includes(urlLogin)){
        initLoginButton();
    }
}

function initLoginButton(){
    loginButton.addEventListener("click", loginProcessLinkedToButton);
}


function loginProcessLinkedToButton() {
    getUserLoginInput();
    checkUserLoginData();
    sendLoginDataToServer();

}

////////////////////////////////////////////
/// module subfunctions ///////////////////
function getUserLoginInput(){
    userEmail = document.getElementById("login").value;
    userPassword = document.getElementById("password").value;
    //console.log(userEmail, userPassword);
}


function checkUserLoginData() {
    resetHintMessages(userLoginDataCorrect);
    var check_NotEmptyEmail = checkNotEmptyEmail(userEmail);
    var check_ValidEmail = checkValidEmail(userEmail);
    var chek_ValidPasswordLength = checkValidPasswordLength(userPassword);

    userLoginDataCorrect = check_NotEmptyEmail && check_ValidEmail && chek_ValidPasswordLength;
    if(userLoginDataCorrect === true){
        hintMessages.push(hintMessageType["loginDataCorrect"]);
    }
    //console.log(hintMessages);
    showUserHintMessages(userLoginDataCorrect);
}

function showServerLoginStatus(){
    hintMessages = [];
    if (loginSuccessStatus === false){
        hintMessages.push(hintMessageType['loginNotSuccessful'])
    }else{
        hintMessages.push(hintMessageType["loginSuccessful"])
    }


    let hintMessagesDiv = document.getElementById("hintMessages");
    hintMessagesDiv.innerHTML = "";

    let cssClassStatus = "hintMessagesWrong";
        if (loginSuccessStatus === true){
        cssClassStatus = "hintMessagesCorrect";
    }
    let newHintDiv = document.createElement("div");
        newHintDiv.classList.add(cssClassStatus);
        newHintDiv.innerText = hintMessages[0];
        hintMessagesDiv.appendChild(newHintDiv);
}


function sendLoginDataToServer(){
    if(userLoginDataCorrect === true){
        loginButton.hidden = true;
        showWaitForResponse("on");
        sendUserLoginData();
    }else{

    }
}


function sendUserLoginData(){
    fetch(urlLogin, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify({
            "login": userEmail,
            "password": userPassword
        })
    })
    .then(response => response.json())
    .then(function checkAndShowLoginStatus(response){
        if (response['login_success_status'] === 'login error'){
            loginSuccessStatus = false;
        }else{
            loginSuccessStatus = true;
            setTimeout(redirectToHomePage,1000);
        }
        showServerLoginStatus();
        showWaitForResponse("off");
        loginButton.hidden = false;
        //console.log(response);
    })
}


function redirectToHomePage(){
    window.location.href = '/';
}