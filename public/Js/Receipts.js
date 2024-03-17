let date = new Date(), yeer = date.getFullYear(), mons = date.getMonth() + 1, day = date.getDate(), fulldate
if (mons < 10 && day < 10) { fulldate = yeer + '-0' + mons + '-0' + day }
else if (mons > 10 && day > 10) { fulldate = yeer + '-' + mons + '-' + day }
else if (mons > 10 && day < 10) { fulldate = yeer + '-' + mons + '-0' + day }
else if (mons < 10 && day > 10) { fulldate = yeer + '-0' + mons + '-' + day }
document.querySelector('.Receipt-Date').value = fulldate

let Products = []
fetch('/GetReceipts')
  .then((res) => res.json())
  .then((Data) => {
    let DataProducts = Data.DataProducts
    DataProducts.forEach(Product => {
      let UnitsArray = []
      let Units = Product.Units
      Units.forEach(Unit => {
        let ObjUnit = {
          NameUnit: Unit.NameUnit,
          QtyUnit: Unit.QtyUnit,
          PriceUnitBuy: Unit.PriceUnitBuy,
          PriceUnitSales: Unit.PriceUnitSales,
        }
        UnitsArray.push(ObjUnit)
      });
      let Obj = {
        NameProduct: Product.NameProduct,
        CurrentQty: Product.CurrentQty,
        CurrentCost: Product.CurrentCost,
        QRCODE: Product.QRCODE,
        Units: UnitsArray,
      }
      Products.push(Obj)
    });
  })



  
function QRRead(event) {
    let input = event.target;
    let parent = input.parentElement.parentElement
    let value = input.value
    let select = parent.querySelector(".Name-Product")
    let Units = parent.querySelector('.Units-Item')
    select.options[0].selected = true
    Units.innerHTML = ""
    Units.innerHTML += `<option value="empty" selected disabled hidden>الوحده</option>`
    let inputs = parent.querySelectorAll("input")
    inputs.forEach(input => { input.value = "0" });
    input.value = ""
    Products.forEach((Product, index) => {
      if (Product.QRCODE === value) {
        select.options[index + 1].selected = true
        GetPriceItem(event)
      }
    });
}

function GetPriceItem(event) {
  let input = event.target;
  let id = input.id
  let parent = input.parentElement.parentElement
  let TypeReceipt = document.querySelector('.Receipt-Type').value;
  let select1 = parent.querySelector(".Name-Product")
  let select2 = parent.querySelector(".Units-Item")
  let PriceItem
  if (id === "Name-Product") {
    let Units = parent.querySelector('.Units-Item')
    let ItemSelect = Products[select1.selectedIndex - 1].Units
    parent.querySelector(".QRCODE").value = Products[select1.selectedIndex - 1].QRCODE
    Units.innerHTML = ""
    for (let i = 0; i < ItemSelect.length; i++) {
      Units.innerHTML += `<option BuyPrice="${ItemSelect[i].PriceUnitBuy}"
                                  SalesPrice="${ItemSelect[i].PriceUnitSales}"
                                     value="${ItemSelect[i].NameUnit}">${ItemSelect[i].NameUnit}</option>`
    }
    if (document.title.includes("مبيعات")) {
      PriceItem = Products[select1.selectedIndex - 1].Units[0].PriceUnitSales      
    }else{
      PriceItem = Products[select1.selectedIndex - 1].Units[0].PriceUnitBuy      
    }

  } else {
    if (document.title.includes("مبيعات")) {
      PriceItem = select2.options[select2.selectedIndex].getAttribute('SalesPrice')
    }else{
      PriceItem = select2.options[select2.selectedIndex].getAttribute('BuyPrice')
    }
  }

  parent.querySelector('.Price-Item').value = PriceItem
  parent.querySelector('.Total-Item').value = PriceItem
  parent.querySelector('.Quantity-Item').value = 1
  parent.querySelector('.Quantity-Item').focus()
  TotalReceipt()
  NewItem()
}

function TotalItem(event) {
  let input = event.target;
  let parent = input.parentElement.parentElement
  let Quantity = parent.querySelector('.Quantity-Item').value
  let PriceItem = parent.querySelector('.Price-Item').value
  parent.querySelector('.Total-Item').value = (Quantity * PriceItem).toFixed(2)
  TotalReceipt()
}

function TotalReceipt() {
  let Table = document.querySelector('.table-body')
  let Rows = Table.querySelectorAll('tr')
  let Total = 0
  Rows.forEach(Row => {
    Total = Total + parseFloat(Row.querySelector('.Total-Item').value)
  });
  let Tax = Total * 14 / 100
  let Discount = document.querySelector('.Discount').value
  document.querySelector('.SubTotal').innerText = Total.toFixed(2)
  document.querySelector('.Tax').innerText = Tax.toFixed(2)
  document.querySelector('.Total-Receipt').innerText = (Total + Tax - Discount).toFixed(2)
  document.querySelector('.Amount-Paid').value = (Total + Tax - Discount).toFixed(2)
}

let table = document.querySelector('.table-body')
let FirstRow = table.querySelectorAll('tr')[0].innerHTML
function NewItem() {
  let tr = table.querySelectorAll('tr')
  let Total = tr[tr.length - 1].querySelector('.Total-Item').value
  if (Total != 0) {
    $('.table-body').append(`<tr> ${FirstRow}</tr> `);
  }
}

function CRUD_Redeipts() {
  let TypeReceipt = document.querySelector('.Receipt-Type').value;
  let TypeAmount = document.querySelector('.Type-Amount').value;
  let NamePerson = document.querySelector('.Name-Person').value;
  let MyArray = []
  let Table = document.querySelector('.table-body')
  let rows = Table.querySelectorAll('tr')

  if (TypeReceipt == 'empty') { Toast(id = 'Notification', txt = 'يرجي ادخال نوع الفاتورة',); return }
  if (TypeAmount == 'empty') { Toast(id = 'Notification', txt = 'يرجي ادخال نوع الدفع',); return }
  if (NamePerson == 'empty') { Toast(id = 'Notification', txt = 'يرجي ادخال اسم العميل ',); return }
  if (Table.querySelectorAll('.Name-Product')[0].value == 'empty') {
    Toast(id = 'Notification', txt = 'يرجي ادخال صنف علي الاقل ',);
    return
  }

  for (let i = 0; i < rows.length - 1; i++) {
    let obj = {
      NameProduct: rows[i].querySelector('.Name-Product').value,
      UnitsItem: rows[i].querySelector('.Units-Item').value,
      QuantityItem: rows[i].querySelector('.Quantity-Item').value,
      PriceItem: rows[i].querySelector('.Price-Item').value,
      TotalItem: rows[i].querySelector('.Total-Item').value,
    }
    MyArray.push(obj)
  }

  let link = '/DataReceipts'
  let options = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      DateReceipt: document.querySelector('.Receipt-Date').value,
      TypeReceipt: TypeReceipt,
      TypeAmount: TypeAmount,
      NamePerson: NamePerson,  // ID Customer
      SubTotal: document.querySelector('.SubTotal').innerText,
      Tax: document.querySelector('.Tax').innerText,
      Discount: document.querySelector('.Discount').value,
      Total: document.querySelector('.Total-Receipt').innerText,
      Products: MyArray,
    })
  }

  fetch(link, options)
    .then((res) => res.json())
    .then((Data) => {
      Toast(id = Data[0].id, txt = Data[0].txt,); 
      if (Data[0].id === "Success") {
      let inputs = document.querySelectorAll("input")
      let selects = document.querySelectorAll("select")
      inputs.forEach(input => {input.value = ""});
      selects.forEach(select => {select.options[0].selected = true});
      document.querySelector('.Receipt-Date').value = fulldate
      table.innerHTML = FirstRow  
      TotalReceipt()
      }
    })
    .catch((err) => { return location.href = '/error' })
}





