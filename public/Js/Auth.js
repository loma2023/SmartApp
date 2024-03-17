function Login(event) {
    fetch("/Login", {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            Email: document.querySelector(".Email").value,
            Password: document.querySelector(".Password").value,
        })
    })
        .then((res) => res.json())
        .then((Data) => {
            if (Data[0].id === "Success") {
                location.assign("/Home")
            } else {
                Toast(id = Data[0].id, txt = Data[0].txt,);
            }
        })
}

function Register(event) {
    let btn = event.target;
    let id = btn.id
    let link = "/Register"
    let status = "POST"

    if (btn.classList.contains("btn-Edit")) { link = "/Register" + id, status = "PUT"; }

    let options = {
        method: status,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            Username: document.querySelector(".Username").value,
            NameCompany: document.querySelector(".NameCompany").value,
            Email: document.querySelector(".Email").value,
            Password: document.querySelector(".Password").value,
        })
    }

    fetch(link, options)
        .then((res) => res.json())
        .then((Data) => {
            if (Data[0].id === "Success") {
                location.href =  "/ConfirmEmail" 
            } else {
                Toast(id = Data[0].id, txt = Data[0].txt,);
            }
        })
}

function MyFunction(id) {
    if (id === "ConfirmEmail") { ConfirmEmail() }
    if (id === "ResetPassword") { ResetPassword() }
}

function ResetPassword() {
    let link = "/ResetPassword"
    let options = {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            CodeTxt: CodeTxts[0].value + CodeTxts[1].value + CodeTxts[2].value + CodeTxts[3].value + CodeTxts[4].value + CodeTxts[5].value,
        })
    }

    fetch(link, options)
        .then((res) => res.json())
        .then((Data) => {
            if (Data[0].id === "Success") {
                location.href = "/NewPassword"
            } else {
                Toast(id = Data[0].id, txt = Data[0].txt,);
            }
        })
}

function ConfirmEmail() {
    let link = "/ConfirmEmail"
    let options = {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            CodeTxt: CodeTxts[0].value + CodeTxts[1].value + CodeTxts[2].value + CodeTxts[3].value + CodeTxts[4].value + CodeTxts[5].value,
        })
    }

    fetch(link, options)
        .then((res) => res.json())
        .then((Data) => {
            if (Data[0].id === "Success") {
                location.assign("/Home")
            } else {
                Toast(id = Data[0].id, txt = Data[0].txt,);
            }
        })
}

function ForgotPassword() {
    let link = "/ForgotPassword"
    let options = {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            Email: document.querySelector(".Email").value,
        })
    }

    fetch(link, options)
        .then((res) => res.json())
        .then((Data) => {
            if (Data[0].id === "Success") {
                location.href =  "/ResetPassword" 
            } else {
                Toast(id = Data[0].id, txt = Data[0].txt,);
            }
        })
}

function NewPassword() {
    let Password = document.querySelector(".Password").value
    let ConfirmPassword = document.querySelector(".ConfirmPassword").value
    if (Password !== ConfirmPassword) {
        return Toast(id = "Notification", txt = "كلمة المرور غير متطابقه",);
    }
    let link = "/NewPassword"
    let options = {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            Password: Password,
            ConfirmPassword: ConfirmPassword,
        })
    }

    fetch(link, options)
        .then((res) => res.json())
        .then((Data) => {
            if (Data[0].id === "Success") {
                location.assign("/Home")
            } else {
                Toast(id = Data[0].id, txt = Data[0].txt,);
            }
        })
}
