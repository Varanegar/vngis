using System;
using System.Collections.Generic;
using System.Linq;

namespace TrackingMap.Common.Tools
{
    public class GeneralTools
    {
        public static string IntListTostring(List<int> list)
        {
            return list.Aggregate("", (current, i) => current + (i + ','));
        }

        public static string GuidListTostring(List<Guid> list)
        {
            var str = list.Aggregate("", (current, i) => current + (i.ToString() + ','));
            if (str.Length > 0)
                str = str.Remove(str.Length - 1);
            return str;
        }
    }
}
