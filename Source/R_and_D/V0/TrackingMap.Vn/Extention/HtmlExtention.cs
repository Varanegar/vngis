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
            var html = "<br/>";
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
    }
}
