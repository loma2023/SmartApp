let MyTxt = ""
if (document.title.includes("العملاء")) { MyTxt = "اضافة عميل جديد" }
if (document.title.includes("الموردين")) { MyTxt = "اضافة مورد جديد" }
document.querySelector(".AddCustomerSupplier").innerText = MyTxt


function CRUD_Data(event) {
    let btn = event.target;
    let id = btn.id
    let Name = document.querySelector(".Name").value
    let Page = "/DataCustomers"
    if (document.title.includes("الموردين")) { Page = "/DataSuppliers" }
    let link = Page
    let status = "POST"


    if (btn.classList.contains("btn-Edit")) { status = "PUT"; link = Page + id }

    let options = {
        method: status,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            Name: Name,
            City: document.querySelector(".City").value,
            Address: document.querySelector(".Address").value,
            Phone: document.querySelector(".Phone").value,
            Balance: document.querySelector(".Balance").value,
        })
    }

    if (btn.classList.contains("btn-Delete")) {
        link = Page + id; options = { method: "DELETE" }
        document.querySelector(".Alert").classList.remove("Active-Container")
    } else {
        if (Name === "") { return Toast(id = "Notification", txt = "يرجي ادخال البيانات المطلوبه",); }
    }

    fetch(link, options)
        .then((res) => res.json())
        .then((Data) => { ShowData(Data) })
        .catch((err) => { return location.href = "/error" })
}

function ShowData(Data) {
    Toast(id = Data[0].id, txt = Data[0].txt,);
    if (Data[0].id === "Success") {
        let form = document.querySelector(".ContainerForm")
        form.classList.remove("Active-Container")
        let inputs = form.querySelectorAll("input")
        inputs.forEach(input => { input.value = "" });
        let MyData = Data[1].DataCustomers
        if (document.title.includes("الموردين")) { MyData = Data[1].DataSuppliers }
        document.querySelector(".table-body").innerHTML = ""

        MyData.forEach((Element, index) => {
            let createdBy = ''
            if (Element.createdBy == Data[1]._id) { createdBy = Data[1].Username }
            else { Data[1].DataUsers.forEach(Item => { if (Data.createdBy == Item._id) { createdBy = Item.Username } }); }
            document.querySelector(".table-body").innerHTML += `
            <tr>
                <td>${index + 1}</td>
                <td>${Element.Name}</td>
                <td>${Element.City}</td>
                <td>${Element.Address}</td>
                <td>${Element.Phone}</td>
                <td>${Element.Balance}</td>
                <td>${createdBy}</td>
                <td>
                    <button type="button" class="btn Tbtn btn-Eye"><i class="bx bx-show"></i></button>
                    <button type="button" class="btn Tbtn btn-Edit" id="${Element._id}" onclick="EditData(event)"><i
                        class="bx bxs-pencil"></i></button>
                    <button type="button" class="btn Tbtn btn-Delete" id="${Element._id}" onclick="Alert(id)"><i
                        class="bx bxs-trash"></i></button>
                </td>
            </tr>`
        });

        CreateArray()
    }
}


function EditData(event) {
    let btn = event.target;
    let id = btn.parentElement.id
    let parent = btn.parentElement.parentElement.parentElement
    let form = document.querySelector(".ContainerForm")
    form.classList.add("Active-Container")
    form.querySelector(".Name").value = parent.querySelectorAll("td")[1].innerText
    form.querySelector(".City").value = parent.querySelectorAll("td")[2].innerText
    form.querySelector(".Address").value = parent.querySelectorAll("td")[3].innerText
    form.querySelector(".Phone").value = parent.querySelectorAll("td")[4].innerText
    form.querySelector(".Balance").value = parent.querySelectorAll("td")[5].innerText
    form.querySelector(".btn-joint").id = id
    form.querySelector(".btn-joint").classList.replace("btn-Save", "btn-Edit")
}

let TableArray = []
function CreateArray() {
    let table = document.querySelector(".table-body")
    let AllRows = table.querySelectorAll("tr")
    TableArray = []; TableObj = {}
    AllRows.forEach((row) => {
        let TableObj = {
            ID: row.querySelector(".btn-Edit").id,
            Name: row.querySelectorAll("td")[1].innerText,
            City: row.querySelectorAll("td")[2].innerText,
            Address: row.querySelectorAll("td")[3].innerText,
            Phone: row.querySelectorAll("td")[4].innerText,
            Balance: row.querySelectorAll("td")[5].innerText,
            createdBy: row.querySelectorAll("td")[6].innerText,
        }
        TableArray.push(TableObj)
    });
}CreateArray()

function Search() {
    let Name = document.querySelector(".NameSearch").value
    let SDate = document.querySelector(".SDate").value
    let EDate = document.querySelector(".EDate").value

    let NextYear = new Date().getFullYear() + 1
    if (SDate === "") { SDate = "01-01-1997" }
    if (EDate === "") { EDate = NextYear + "-01-01" }
    if (Name == "اسم العميل") { Name = "" }

    document.querySelector(".table-body").innerHTML = ""
    TableArray.forEach(TableObj => {
        let table = document.querySelector(".table-body")
        let index = table.querySelectorAll("tr")
        // if (TableObj.Date >= SDate && TableObj.Date <= EDate && TableObj.Name.includes(Name)) {
        if (TableObj.Name.includes(Name)) {
            table.innerHTML += `
            <tr>
                <td>${index.length + 1}</td>
                <td>${TableObj.Name}</td>
                <td>${TableObj.City}</td>
                <td>${TableObj.Address}</td>
                <td>${TableObj.Phone}</td>
                <td>${TableObj.Balance}</td>
                <td>${TableObj.createdBy}</td>
                <td>
                    <button type="button" class="btn Tbtn btn-Eye"><i class="bx bx-show"></i></button>
                    <button type="button" class="btn Tbtn btn-Edit" id="${TableObj.ID}" onclick="EditData(event)"><i
                        class="bx bxs-pencil"></i></button>
                    <button type="button" class="btn Tbtn btn-Delete" id="${TableObj.ID}" onclick="Alert(id)"><i
                        class="bx bxs-trash"></i></button>
                </td>
            </tr>`
        }
    });
}

