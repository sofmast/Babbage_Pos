
function loginUser(user){

    localStorage.setItem(
        "currentUser",
        JSON.stringify(user)
    );
}

const loginForm =
document.getElementById(
    "loginForm"
);

loginForm.addEventListener(
    "submit",
    function(e){

        e.preventDefault();

        const email =
            document.querySelector(
                'input[type="text"]'
            ).value;

        const password =
            document.querySelector(
                'input[type="password"]'
            ).value;

        if(
            email === "pos" &&
            password === "admin"
        ){

            loginUser({

                id:1,
                name:"Administrator",
                email,
                role:"admin"

            });

            window.location.href =
            "index.html";

        }else{

            window.location.href =
            "welcome.html";
        }
    }
);