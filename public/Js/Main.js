window.onload = function () {
    const sidebar = document.querySelector(".sidebar");
    const ToggleBtn = document.querySelectorAll(".Toggle");

    ToggleBtn.forEach(btn => {
        btn.addEventListener("click", function () {
            sidebar.classList.toggle("open")
            if (sidebar.classList.contains("open")) {
                btn.classList.replace("bx-menu", "bx-menu-alt-right")
            } else {
                btn.classList.replace("bx-menu-alt-right", "bx-menu")
            }
        })
    });
}

$(".nav-list > li").click(function (e) {
    $(this).siblings().removeClass("active");
    $(this).toggleClass("active");
    $(this).find("ul").slideToggle();
    $(this).siblings().find("ul").slideUp();
    $(this).siblings().find("ul").find("li").removeClass("active")
})

function GetFullScreenElement() {
    return document.fullscreenElement
        || document.webkitFullscreenElement
        || document.mozFullscreenElement
        || document.msFullscreenElement;
}

function ToggleFullScreen() {
    if (GetFullScreenElement()) {
        document.exitFullscreen();
    } else {
        document.documentElement.requestFullscreen().catch(console.log)
    }
}

document.addEventListener("fullscreenchange", () => {
    let btn = document.querySelector(".FullScreen")
    if (GetFullScreenElement()) {
        Toast(id = "Notification", txt = "تم تفعيل وضع ملء الشاشه")
        btn.classList.replace("bx-fullscreen", "bx-exit-fullscreen")
    } else {
        Toast(id = "Notification", txt = "تم الغاء وضع ملء الشاشه")
        btn.classList.replace("bx-exit-fullscreen", "bx-fullscreen")
    }
})

document.addEventListener("fullscreenchange", () => {
    btn.classList.replace("bx-fullscreen", "bx-exit-fullscreen")
    Toast(id = "Notification", txt = "تم تفعيل وضع ملء الشاشه")
})

function LogOut() { location.href = "/SignOut" }

function Toast(id, txt) {
    let Notification = document.querySelector(".Notification")
    let icon = "bell"
    if (id === "Success") { icon = "check" }
    if (id === "Error") { icon = "x" }
    let toast = `
        <div class="Toast" id="${id}">
            <i onclick="canselToast(event)" class="bx bx-x X-Toast"></i>
            <div class="Toast-head">
                <div>
                    <i class="bx bx-${icon}"></i>
                    <h4>${id}</h4>
                </div>
                <h5>Just Now</h5>
            </div>
            <h4 class="Toast-body"> ${txt} .</h4>
        </div>`
    Notification.classList.add("NotiActive")
    Notification.innerHTML += toast

    setTimeout(() => {
        Notification.querySelectorAll(".Toast")[0].remove()
        let AllToast = Notification.querySelectorAll(".Toast")
        if (AllToast.length == 0) {
            Notification.classList.remove("NotiActive")
        }
    }, 10000);
}

function canselToast(event) {
    let btn = event.target
    let parent = btn.parentElement
    parent.remove()
    let Notification = document.querySelector(".Notification")
    let toasts = Notification.querySelectorAll(".Toast")
    if (toasts.length == 0) {
        document.querySelector(".Notification").classList.remove("NotiActive")
    }
}

// *********************************************************************

function Alert(id) {
    let MyAlert = document.querySelector(".Alert")
    MyAlert.classList.add("Active-Container")
    MyAlert.querySelector(".btn-Delete").id = id
}

function ContainerForm() {
    let form = document.querySelector(".ContainerForm")
    form.classList.toggle("Active-Container")
    form.querySelectorAll("input")[0].focus()
    form.querySelector(".btn-joint").id = "Save"
    form.querySelector(".btn-joint").classList.replace("btn-Edit", "btn-Save")
}

function Hide_Container() {
    let PopUps = document.querySelectorAll(".PopUp-Container")
    PopUps.forEach(Pop => { Pop.classList.remove("Active-Container") });
    let form = document.querySelector(".ContainerForm")
    let inputs = form.querySelectorAll("input")
    inputs.forEach(input => { input.value = "" });
}

function Show_Search() {
    document.querySelector(".Search-Container").classList.toggle("active")
}
