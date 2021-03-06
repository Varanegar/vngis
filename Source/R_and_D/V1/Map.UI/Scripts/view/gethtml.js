﻿function getGoodReportHtml(jdata) {
    if (jdata == "")
        return "";
    
    var obj = JSON.parse(jdata);
    var html = "<br/><table>";
    if (obj != null) {
        html += "<tr> <th style='color:#ff0000' ><h5>" + obj.Title + "</h5></th></tr>";
        if (obj.OrderCount != null) {
            html += "<tr> <td> تعداد درخواست: " + addCommaSeperator(obj.OrderCount) + "</td> </tr>";
        }
        if (obj.SaleCount != null) {
            html += "<tr> <td> تعداد فاکتور: " + addCommaSeperator(obj.SaleCount) + "</td> </tr>";
        }
        if (obj.RetSaleCount != null) {
            html += "<tr> <td> تعداد برگشتی: " + addCommaSeperator(obj.RetSaleCount) + "</td> </tr>";
        }
        if (obj.SaleItemCount != null) {
            html += "<tr> <td> تعداد اقلام کالای فروش رفته: " + addCommaSeperator(obj.SaleItemCount) + "</td> </tr>";
        }
        if (obj.RetSaleItemCount != null) {
            html += "<tr> <td> تعداد اقلام کالای برگشتی: " + addCommaSeperator(obj.RetSaleItemCount) + "</td> </tr>";
        }

        if (obj.SaleQty != null) {
            html += "<tr> <td>  تعداد کالای فروش رفته : " + addCommaSeperator(obj.SaleQty) + "</td> </tr>";
        }
        if (obj.RetSaleQty != null) {
            html += "<tr> <td>  تعداد کالای برگشتی : " + addCommaSeperator(obj.RetSaleQty) + "</td> </tr>";
        }

        if (obj.SaleAmount != null) {
            html += "<tr> <td>  ریال کالای فروش رفته: " + addCommaSeperator(obj.SaleAmount) + "</td> </tr>";
        }
        if (obj.RetSaleAmount != null) {
            html += "<tr> <td>  ریال کالای برگشتی: " + addCommaSeperator(obj.RetSaleAmount) + "</td> </tr>";
        }
        if (obj.SaleWeight != null) {
            html += "<tr> <td>  وزن کالای فروش رفته: " + addCommaSeperator(obj.SaleWeight) + "</td> </tr>";
        }
        if (obj.RetSaleWeight != null) {
            html += "<tr> <td>  وزن کالای برگشتی: " + addCommaSeperator(obj.RetSaleWeight) + "</td> </tr>";
        }
        if (obj.SaleDiscount != null) {
            html += "<tr> <td>  ریال تخفیف فروش رفته: " + addCommaSeperator(obj.SaleDiscount) + "</td> </tr>";
        }
        if (obj.RetSaleDiscount != null) {
            html += "<tr> <td>  ریال تخفیف برگشتی: " + addCommaSeperator(obj.RetSaleDiscount) + "</td> </tr>";
        }
        if (obj.SalePrizeCount != null) {
            html += "<tr> <td>  تعداد اقلام جایزه: " + addCommaSeperator(obj.SalePrizeCount) + "</td> </tr>";
        }
        if (obj.PrizeQty != null) {
            html += "<tr> <td>  (تعداد جایزه (کارتن : ظرف: " + addCommaSeperator(obj.PrizeQty) + "</td> </tr>";
        }
    }
    return "</table>" + html;
}
function getFinanceReportHtml(jdata) {

    if (jdata == "")
        return "";

    var obj = JSON.parse(jdata);
    var html = "<br/><table>";
    if (obj != null) {
        html += "<tr> <th style='color:#ff0000' ><h5>" + obj.Title + "</h5></th></tr>";
        if (obj.OpenFactorCount != null) {
            html += "<tr> <td> تعدادفاکتورباز: " + addCommaSeperator(obj.OpenFactorCount) + "</td> </tr>";
        }
        if (obj.OpenFactorAmount != null) {
            html += "<tr> <td> مبلغ فاکتورباز: " + addCommaSeperator(obj.OpenFactorAmount) + "</td> </tr>";
        }
        if (obj.OpenFactorDay != null) {
            html += "<tr> <td> تعداد روز فاکتور باز: " + addCommaSeperator(obj.OpenFactorDay) + "</td> </tr>";
        }
        if (obj.RejectChequeCount != null) {
            html += "<tr> <td> تعدادچک برگشتی: " + addCommaSeperator(obj.RejectChequeCount) + "</td> </tr>";
        }
        if (obj.RejectChequeAmount != null) {
            html += "<tr> <td> مبلغ چک برگشتی: " + addCommaSeperator(obj.RejectChequeAmount) + "</td> </tr>";
        }

        if (obj.InprocessChequeCount != null) {
            html += "<tr> <td>  تعداد چک درجریان : " + addCommaSeperator(obj.InprocessChequeCount) + "</td> </tr>";
        }
        if (obj.InprocessChequeAmount != null) {
            html += "<tr> <td>  مبلغ چک درجریان : " + addCommaSeperator(obj.InprocessChequeAmount) + "</td> </tr>";
        }

        if (obj.FirstCredit != null) {
            html += "<tr> <td>  اعتباراولیه ی اسنادی : " + addCommaSeperator(obj.FirstCredit) + "</td> </tr>";
        }
        if (obj.RemainedCredit != null) {
            html += "<tr> <td>  مانده ی اعتبار اسنادی: " + addCommaSeperator(obj.RemainedCredit) + "</td> </tr>";
        }
        if (obj.FirstDebitCredit != null) {
            html += "<tr> <td>  اعتباراولیه ی بدهکاری: " + addCommaSeperator(obj.FirstDebitCredit) + "</td> </tr>";
        }
        if (obj.RemainedDebitCredit != null) {
            html += "<tr> <td>  مانده ی اعتبار بدهکاری: " + addCommaSeperator(obj.RemainedDebitCredit) + "</td> </tr>";
        }
    }
    return "</table>" + html;
}

function getOrderHtml(jdata) {
    if (jdata == "")
        return "";

    var obj = JSON.parse(jdata);
    var html = "";
    html +=
        "<br/>" +
            "<table>" +
            "<tr> <th style='color:#ff0000' >سفارش</th> </tr>" +
            "<tr> <th>" + obj.CustomerName + "</th> </tr>" +
            "<tr> <th>" + obj.CustomerCode + "</th> </tr>";

    if (obj.StoreName != null) {
        html += "<tr> <td> فروشگاه: " + obj.StoreName + "</td> </tr>";
    }
    if (obj.Address != null) {
        html += "<tr> <td> " + obj.Address + "</td> </tr>";
    }
    if (obj.Phone != null) {
        html += "<tr> <td> تلفن: " + obj.Phone + "</td> </tr>";
    }
    if (obj.WatingTime != null) {
        html += "<tr> <td> مدت توقف: " + obj.WatingTime + "</td> </tr>";
    }
    if (obj.StartTime != null) {
        html += "<tr> <td> ساعت شروع ویزیت: " + obj.StartTime + "</td> </tr>";
    }
    if (obj.EndTime != null) {
        html += "<tr> <td> ساعت خاتمه ویزیت: " + obj.EndTime + "</td> </tr>";
    }
    if (obj.OrderQty != null) {
        html += "<tr> <td> جمع اقلام سفارش: " + addCommaSeperator(obj.OrderQty) + "</td> </tr>";
    }
    if (obj.OrderAmunt != null) {
        html += "<tr> <td>مبلغ سفارش: " + addCommaSeperator(obj.OrderAmunt) + "</td> </tr>";
    }

    html += "</table>";
return html;
}

function getLackOfOrderHtml(jdata) {
    if (jdata == "")
        return "";

    var obj = JSON.parse(jdata);
    var html = "";
    html +=
        "<br/>" +
            "<table>" +
            "<tr> <th style='color:#ff0000' >عدم سفارش</th> </tr>" +
            "<tr> <th>" + obj.CustomerName + "</th> </tr>" +
            "<tr> <th>" + obj.CustomerCode + "</th> </tr>";
    
    if (obj.StoreName != null) {
        html += "<tr> <td> فروشگاه: " + obj.StoreName + "</td> </tr>";
    }
    if (obj.Address != null) {
        html += "<tr> <td> " + obj.Address + "</td> </tr>";
    }
    if (obj.Phone != null) {
        html += "<tr> <td> تلفن: " + obj.Phone + "</td> </tr>";
    }
    if (obj.Time != null) {
        html += "<tr> <td> " + obj.Time + "</td> </tr>";
    }
    if (obj.Description != null) {
        html += "<tr> <td> علت : " + obj.Description + "</td> </tr>";
    }
    html += "</table>";

    return html;
}


function getLackOfVisitHtml(jdata) {
    if (jdata == "")
        return "";
    
    var obj = JSON.parse(jdata);
    var html = "";
    html +=
        "<br/>" +
            "<table>" +
            "<tr> <th style='color:#ff0000' >عدم ویزیت</th> </tr>" +
            "<tr> <th>" + obj.CustomerName + "</th> </tr>" +
            "<tr> <th>" + obj.CustomerCode + "</th> </tr>";

    if (obj.StoreName != null) {
        html += "<tr> <td> فروشگاه: " + obj.StoreName + "</td> </tr>";
    }
    if (obj.Address != null) {
        html += "<tr> <td> " + obj.Address + "</td> </tr>";
    }
    if (obj.Phone != null) {
        html += "<tr> <td> تلفن: " + obj.Phone + "</td> </tr>";
    }
    if (obj.Time != null) {
        html += "<tr> <td> " + obj.Time + "</td> </tr>";
    }
    if (obj.Description != null) {
        html += "<tr> <td> علت : " + obj.Description + "</td> </tr>";
    }
    html += "</table>";
    return html;
}
