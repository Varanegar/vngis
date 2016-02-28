using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TrackingMap.Service.Enum
{
    class Enumeration
    {
    }

    public enum ETransactionType {ORDER, LACK_OF_VISIT, LACK_OF_ORDER, STOP_WITHOUT_CUSTOME, MULTI}
    public enum ECustomerType { OUTE_LINE, IN_LINE, NEW }
}
