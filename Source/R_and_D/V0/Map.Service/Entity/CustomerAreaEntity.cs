using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TrackingMap.Service.Entity
{
    [Table("customer_area")]
    public class CustomerAreaEntity : BaseEntity
    {
        [Column("customer_id", TypeName = "int")]
        public int CustomerEntityId { get; set; }
        public virtual CustomerEntity CustomerEntity { set; get; }


        [Column("area_id", TypeName = "int")]
        public int AreaEntityId { get; set; }
        public virtual AreaEntity AreaEntity { set; get; }

    }
}
