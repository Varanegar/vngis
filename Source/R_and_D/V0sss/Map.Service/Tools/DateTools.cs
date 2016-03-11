using System;
using System.Globalization;

namespace TrackingMap.Service.Tools
{
    public class DateTools
    {
        public static string PersianDateNow()
        {
            var persianDate = new PersianCalendar();
            var persianTime = new DateTime();
            persianTime = DateTime.Now;

            var result = string.Empty;
            var year = Convert.ToString(persianDate.GetYear(persianTime));
            var month = Convert.ToString(persianDate.GetMonth(persianTime));
            var day = Convert.ToString(persianDate.GetDayOfMonth(persianTime));
            var dateSplitter = '/';
            dateSplitter = '/';

            if (month.Length < 2) month = "0" + month;
            if (day.Length < 2) day = "0" + day;

            result = year + dateSplitter + month + dateSplitter + day;

            return result;
        }
    }

    public enum DatePart { All, Year, Month, Day }
}