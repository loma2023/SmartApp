function CRUD_Data(event) {
    let btn = event.target;
    let id = btn.id
    let link = "/DataProducts"
    let status = "POST"

    let MyArray = []
    let rows = document.querySelectorAll(".Row-Units")
    for (let i = 0; i < rows.length; i++) {
        let obj = {
            NameUnit: rows[i].querySelector('.NameUnit').value,
            QtyUnit: rows[i].querySelector('.QtyUnit').value,
            PriceUnitBuy: rows[i].querySelector('.PriceUnitBuy').value,
            PriceUnitSales: rows[i].querySelector('.PriceUnitSales').value,
        }
        MyArray.push(obj)
    }

    if (btn.classList.contains("btn-Edit")) { status = "PUT"; link = link + id }

    let options = {
        method: status,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            NameProduct: document.querySelector('.NameProduct').value,
            MinQty: document.querySelector('.MinQty').value,
            MaxQty: document.querySelector('.MaxQty').value,
            QRCODE:document.querySelector('.QRCODE').value,
            Units: MyArray,
        })
    }

    if (btn.classList.contains("btn-Delete")) {
        link = link + id; options = { method: "DELETE" }
        document.querySelector(".Alert").classList.remove("Active-Container")
    }

    fetch(link, options)
        .then((res) => res.json())
        .then((Data) => { ShowData(Data) })
        .catch((err) => { return location.href = '/error' })

}

function ShowData(Data) {
    Toast(id = Data[0].id, txt = Data[0].txt,);
    if (Data[0].id === "Success") {
        let form = document.querySelector(".ContainerForm")
        form.classList.remove("Active-Container")
        let inputs = form.querySelectorAll("input")
        inputs.forEach(input => { input.value = "" });
        let MyData = Data[1].DataProducts
        document.querySelector(".table-body").innerHTML = ""

        MyData.forEach((Element, index) => {
            let createdBy = ''
            if (Element.createdBy == Data[1]._id) { createdBy = Data[1].Username }
            else { Data[1].DataUsers.forEach(Item => { if (Data.createdBy == Item._id) { createdBy = Item.Username } }); }
            document.querySelector(".table-body").innerHTML += `
            <tr>
                <td>${index + 1}</td>
                <td>${Element.NameProduct}</td>
                <td>${Element.MinQty}</td>
                <td>${Element.MaxQty}</td>
                <td>${Element.QRCODE}</td>
                <td>${Element.Units[0].NameUnit}</td>
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
    form.querySelector(".NameProduct").value = parent.querySelectorAll("td")[1].innerText
    form.querySelector(".MinQty").value = parent.querySelectorAll("td")[2].innerText
    form.querySelector(".MaxQty").value = parent.querySelectorAll("td")[3].innerText
    form.querySelector(".QRCODE").value = parent.querySelectorAll("td")[4].innerText
    form.querySelector(".NameUnit").value = parent.querySelectorAll("td")[5].innerText
    form.querySelector(".btn-joint").id = id
    form.querySelector(".btn-joint").classList.replace("btn-Save", "btn-Edit")
}

let TableArray = []
function CreateArray() {
    let table = document.querySelector(".table-body")
    let AllRows = table.querySelectorAll("tr")
    TableArray = [];
    AllRows.forEach((row) => {
        let TableObj = {
            ID: row.querySelector(".btn-Edit").id,
            NameProduct: row.querySelectorAll("td")[1].innerText,
            MinQty: row.querySelectorAll("td")[2].innerText,
            MaxQty: row.querySelectorAll("td")[3].innerText,
            QRCODE: row.querySelectorAll("td")[4].innerText,
            Units: row.querySelectorAll("td")[5].innerText,
            createdBy: row.querySelectorAll("td")[6].innerText,
        }
        TableArray.push(TableObj)
    });
} CreateArray()

function Search() {
    let Name = document.querySelector(".NameSearch").value
    let SDate = document.querySelector(".SDate").value
    let EDate = document.querySelector(".EDate").value

    let NextYear = new Date().getFullYear() + 1
    if (SDate === "") { SDate = "01-01-1997" }
    if (EDate === "") { EDate = NextYear + "-01-01" }

    document.querySelector(".table-body").innerHTML = ""
    TableArray.forEach(TableObj => {
        let table = document.querySelector(".table-body")
        let index = table.querySelectorAll("tr")
        // if (TableObj.Date >= SDate && TableObj.Date <= EDate && TableObj.Name.includes(Name)) {
        if (TableObj.NameProduct.includes(Name)) {
            table.innerHTML += `
            <tr>
                <td>${index.length + 1}</td>
                <td>${TableObj.NameProduct}</td>
                <td>${TableObj.MinQty}</td>
                <td>${TableObj.MaxQty}</td>
                <td>${TableObj.QRCODE}</td>
                <td>${TableObj.Units}</td>
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
