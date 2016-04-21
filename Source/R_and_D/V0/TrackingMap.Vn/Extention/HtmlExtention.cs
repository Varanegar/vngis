using TrackingMap.Common.ViewModel;

namespace TrackingMap.Service.Vn.Extention
{
    public static class HtmlExtention
    {
        public static string GetHtml(this CustomerReportView view)
        {
            var html = "";
            if (!string.IsNullOrEmpty(view.Desc))
            {
                html += "<h5>" + view.Desc + "</h5><hr/>";
            }
            if (view.ActiveCustomerCount != null)
            {
                html += "<div>تعداد مشتری فعال: " + view.ActiveCustomerCount.Value.ToString("#,#") + "</div>";
            }
            if (view.NewCustomerCount != null)
            {
                html += "<div>تعداد مشتری جدید: " + view.NewCustomerCount.Value.ToString("#,#") + "</div>";
            }
            if (view.VisitCount != null)
            {
                html += "<div>تعداد ویزیت شده: " + view.VisitCount.Value.ToString("#,#") + "</div>";
            }
            if (view.LackOfVisitCount != null)
            {
                html += "<div>تعداد عدم ویزیت: " + view.LackOfVisitCount.Value.ToString("#,#") + "</div>";
            }
            if (view.LackOfSaleCount != null)
            {
                html += "<div>تعداد عدم فروش: " + view.LackOfSaleCount.Value.ToString("#,#") + "</div>";
            }

            if (view.DuringCheckCount != null)
            {
                html += "<div> تعداد چک در جریان: " + view.DuringCheckCount.Value.ToString("#,#") + "</div>";
            }
            if (view.DuringCheckPrice != null)
            {
                html += "<div> مبلغ چک در جریان: " + view.DuringCheckPrice.Value.ToString("#,#") + "</div>";
            }

            if (view.RejectCheckCount != null)
            {
                html += "<div> تعداد چک در جریان: " + view.RejectCheckCount.Value.ToString("#,#") + "</div>";
            }
            if (view.RejectCheckPrice != null)
            {
                html += "<div> مبلغ چک در جریان: " + view.RejectCheckPrice.Value.ToString("#,#") + "</div>";
            }

            return html;
        }
        
        public static string GetHtml(this GoodReportView view, string desc)
        {
            var html = "";
            if (!string.IsNullOrEmpty(desc))
            {
                html += "<h5>" + desc + "</h5>";
            }
            if (view.OrderCount != null)
            {
                html += "<div>تعداد درخواست: " + view.OrderCount.Value.ToString("#,#") + "</div>";
            }
            if (view.SaleCount != null)
            {
                html += "<div>تعداد فاکتور: " + view.SaleCount.Value.ToString("#,#") + "</div>";
            }
            if (view.RetSaleCount != null)
            {
                html += "<div>تعداد برگشتی: " + view.RetSaleCount.Value.ToString("#,#") + "</div>";
            }
            if (view.SaleItemCount != null)
            {
                html += "<div>تعداد اقلام کالای فروش رفته: " + view.SaleItemCount.Value.ToString("#,#") + "</div>";
            }
            if (view.RetSaleItemCount != null)
            {
                html += "<div>تعداد اقلام کالای برگشتی: " + view.RetSaleItemCount.Value.ToString("#,#") + "</div>";
            }

            if (view.SaleQty != null)
            {
                html += "<div> تعداد کالای فروش رفته (کارتن : ظرف): " + view.SaleQty.Value.ToString("#,#") + "</div>";
            }
            if (view.RetSaleQty != null)
            {
                html += "<div> تعداد کالای برگشتی (کارتن : ظرف): " + view.RetSaleQty.Value.ToString("#,#") + "</div>";
            }

            if (view.SaleAmount != null)
            {
                html += "<div> ریال کالای فروش رفته: " + view.SaleAmount.Value.ToString("#,#") + "</div>";
            }
            if (view.RetSaleAmount != null)
            {
                html += "<div> ریال کالای برگشتی: " + view.RetSaleAmount.Value.ToString("#,#") + "</div>";
            }
            if (view.SaleWeight != null)
            {
                html += "<div> وزن کالای فروش رفته: " + view.SaleWeight.Value.ToString("#,#") + "</div>";
            }
            if (view.RetSaleWeight != null)
            {
                html += "<div> وزن کالای برگشتی: " + view.RetSaleWeight.Value.ToString("#,#") + "</div>";
            }
            if (view.SaleDiscount != null)
            {
                html += "<div> ریال تخفیف فروش رفته: " + view.SaleDiscount.Value.ToString("#,#") + "</div>";
            }
            if (view.RetSaleDiscount != null)
            {
                html += "<div> ریال تخفیف برگشتی: " + view.RetSaleDiscount.Value.ToString("#,#") + "</div>";
            }
            if (view.SalePrizeCount != null)
            {
                html += "<div> تعداد اقلام جایزه: " + view.SalePrizeCount.Value.ToString("#,#") + "</div>";
            }
            if (view.PrizeQty != null)
            {
                html += "<div> تعداد جایزه (کارتن : ظرف: " + view.PrizeQty.Value.ToString("#,#") + "</div>";
            }

            return html;
        }        
       
        public static string GetHtml(this GoodByValueReportView view)
        {
            var html = "";
            if (!string.IsNullOrEmpty(view.Desc))
            {
                html += "<h3>" + view.Desc + "</h3>";
            }

            return html;
        }
    


    }
}
