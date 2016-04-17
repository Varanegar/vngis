using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TrackingMap.Vn.ViewModel;

namespace TrackingMap.Vn.Extention
{
    public static class HtmlExtention
    {
        public static string GetHtml(this CustomerReportView view)
        {
            var html = "";
            if (!string.IsNullOrEmpty(view.Desc))
            {
                html += "<h3>" + view.Desc + "</h3>";
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
        public static string GetHtml(this GoodReportView view)
        {
            var html = "";
            if (!string.IsNullOrEmpty(view.Desc))
            {
                html += "<h3>" + view.Desc + "</h3>";
            }
            if (view.RequestCount != null)
            {
                html += "<div>فعداد درخواست: " + view.RequestCount.Value.ToString("#,#") + "</div>";
            }
            if (view.FactorCount != null)
            {
                html += "<div>تعداد فاکتور: " + view.FactorCount.Value.ToString("#,#") + "</div>";
            }
            if (view.RejectCount != null)
            {
                html += "<div>تعداد برگشتی: " + view.RejectCount.Value.ToString("#,#") + "</div>";
            }
            if (view.SaleItemCount != null)
            {
                html += "<div>تعداد اقلام کالای فروش رفته: " + view.SaleItemCount.Value.ToString("#,#") + "</div>";
            }
            if (view.RejectItemCount != null)
            {
                html += "<div>تعداد اقلام کالای برگشتی: " + view.RejectItemCount.Value.ToString("#,#") + "</div>";
            }

            if (view.SaleAmount != null)
            {
                html += "<div> تعداد کالای فروش رفته (کارتن : ظرف): " + view.SaleAmount.Value.ToString("#,#") + "</div>";
            }
            if (view.RejectAmount != null)
            {
                html += "<div> تعداد کالای برگشتی (کارتن : ظرف): " + view.RejectAmount.Value.ToString("#,#") + "</div>";
            }

            if (view.SalePrice != null)
            {
                html += "<div> ریال کالای فروش رفته: " + view.SalePrice.Value.ToString("#,#") + "</div>";
            }
            if (view.RejectPrice != null)
            {
                html += "<div> ریال کالای برگشتی: " + view.RejectPrice.Value.ToString("#,#") + "</div>";
            }
            if (view.SaleWeight != null)
            {
                html += "<div> وزن کالای فروش رفته: " + view.SaleWeight.Value.ToString("#,#") + "</div>";
            }
            if (view.RejectWeight != null)
            {
                html += "<div> وزن کالای برگشتی: " + view.RejectWeight.Value.ToString("#,#") + "</div>";
            }
            if (view.SaleDiscount != null)
            {
                html += "<div> ریال تخفیف فروش رفته: " + view.SaleDiscount.Value.ToString("#,#") + "</div>";
            }
            if (view.RejectDiscount != null)
            {
                html += "<div> ریال تخفیف برگشتی: " + view.RejectDiscount.Value.ToString("#,#") + "</div>";
            }
            if (view.BonusCount != null)
            {
                html += "<div> تعداد اقلام جایزه: " + view.BonusCount.Value.ToString("#,#") + "</div>";
            }
            if (view.BonusAmount != null)
            {
                html += "<div> تعداد جایزه (کارتن : ظرف: " + view.BonusAmount.Value.ToString("#,#") + "</div>";
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
