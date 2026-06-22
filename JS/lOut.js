
function logoutUser(){

    localStorage.removeItem(
        "currentUser"
    );

    window.location.href =
    "login.html";
}