//  رساله حضره
let Success = { id: "Success", txt: "" }
let Save = { id: "Success", txt: "تم حفظ البيانات بنجاح" }
let Edit = { id: "Success", txt: "تم تعديل البيانات بنجاح" }
let Delete = { id: "Success", txt: "تم حذف البيانات بنجاح" }
let SendMail = { id: "Success", txt: "تم ارسال الكود بنجاح" }

// رساله زرقه
let Empty = { id: "Notification", txt: "ادخل البيانات المطلوبه" }
let Exist = { id: "Notification", txt: "الاميل موجود بالفعل" }
let NotExist = { id: "Notification", txt: "الاميل غير موجود " }

// رساله حمره
let Error = { id: "Error", txt: "حدث خطأ ما اعد المحاوله" }
let WrongCode = { id: "Error", txt: "الكود الذي ادخلته غير صحيح حاول مره اخري " }
let WrongEmail = { id: "Error", txt: "الاميل او كلمة المرور خطأ" }
let NotSendMail = { id: "Error", txt: "فشل ارسال الكود" }


module.exports = {
  Success,
  Save,
  Edit,
  Delete,
  SendMail,
  NotSendMail,
  Empty,
  Exist,
  NotExist,
  Error,
  WrongCode,
  WrongEmail,
};