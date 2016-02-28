using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TrackingMap.Service.Tools
{
    public class GeneralTools
    {
        public static string IntListTostring(List<int> list )
        {
            return list.Aggregate("", (current, i) => current + (i + ','));
        }
    }
}
