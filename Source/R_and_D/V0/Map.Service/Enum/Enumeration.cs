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

    public enum ETransactionType {ORDER,  LACK_OF_ORDER, LACK_OF_VISIT, STOP_WITHOUT_CUSTOME, MULTI}
    public enum ECustomerType { IN_LINE, OUTE_LINE, NEW }

    public enum PointType
    {
        Point = 0,
        CustomerRout = 1,
        CustomerOtherRout = 2,
        CustomerWithoutRout = 0,

        Order = 0,  
        LackOfOrder = 1, 
        LackOfVisit = 2, 
        StopWithoutCustomer = 3,
        StopWithoutActivity = 4,
        Customer = 5, 
        
        Multi = 10

    }


}
