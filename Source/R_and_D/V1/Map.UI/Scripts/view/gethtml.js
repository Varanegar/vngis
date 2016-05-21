function getGoodReportHtml(jdata) {
    var obj = JSON.parse(jdata);
    var html = "";

    html += "<h5>" + obj.Title + "</h5><hr>";
    if (obj.OrderCount != null)
    {
        html += "<div>تعداد درخواست: " + addCommaSeperator(obj.OrderCount) + "</div>";
    }
    if (obj.SaleCount != null)
    {
        html += "<div>تعداد فاکتور: " + addCommaSeperator(obj.SaleCount) + "</div>";
    }
    if (obj.RetSaleCount != null)
    {
        html += "<div>تعداد برگشتی: " + addCommaSeperator(obj.RetSaleCount) + "</div>";
    }
    if (obj.SaleItemCount != null)
    {
        html += "<div>تعداد اقلام کالای فروش رفته: " + addCommaSeperator(obj.SaleItemCount) + "</div>";
    }
    if (obj.RetSaleItemCount != null)
    {
        html += "<div>تعداد اقلام کالای برگشتی: " + addCommaSeperator(obj.RetSaleItemCount) + "</div>";
    }

    if (obj.SaleQty != null)
    {
        html += "<div> تعداد کالای فروش رفته : " + addCommaSeperator(obj.SaleQty) + "</div>";
    }
    if (obj.RetSaleQty != null)
    {
        html += "<div> تعداد کالای برگشتی : " + addCommaSeperator(obj.RetSaleQty) + "</div>";
    }

    if (obj.SaleAmount != null)
    {
        html += "<div> ریال کالای فروش رفته: " + addCommaSeperator(obj.SaleAmount) + "</div>";
    }
    if (obj.RetSaleAmount != null)
    {
        html += "<div> ریال کالای برگشتی: " + addCommaSeperator(obj.RetSaleAmount) + "</div>";
    }
    if (obj.SaleWeight != null)
    {
        html += "<div> وزن کالای فروش رفته: " + addCommaSeperator(obj.SaleWeight) + "</div>";
    }
    if (obj.RetSaleWeight != null)
    {
        html += "<div> وزن کالای برگشتی: " + addCommaSeperator(obj.RetSaleWeight) + "</div>";
    }
    if (obj.SaleDiscount != null)
    {
        html += "<div> ریال تخفیف فروش رفته: " + addCommaSeperator(obj.SaleDiscount) + "</div>";
    }
    if (obj.RetSaleDiscount != null)
    {
        html += "<div> ریال تخفیف برگشتی: " + addCommaSeperator(obj.RetSaleDiscount) + "</div>";
    }
    if (obj.SalePrizeCount != null)
    {
        html += "<div> تعداد اقلام جایزه: " + addCommaSeperator(obj.SalePrizeCount) + "</div>";
    }
    if (obj.PrizeQty != null) {
        html += "<div> (تعداد جایزه (کارتن : ظرف: " + addCommaSeperator(obj.PrizeQty) + "</div>";
    }
    return html;
}

function getOrderHtml(jdata) {
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
}
