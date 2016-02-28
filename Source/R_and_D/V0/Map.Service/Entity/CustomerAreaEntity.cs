using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TrackingMap.Service.Entity
{
    [Table("CustomerArea")]
    public class CustomerAreaEntity : BaseEntity
    {
        [Column("CustomerId", TypeName = "int")]
        public int CustomerEntityId { get; set; }
        public virtual CustomerEntity CustomerEntity { set; get; }


        [Column("AreaId", TypeName = "int")]
        public int AreaEntityId { get; set; }
        public virtual AreaEntity AreaEntity { set; get; }

    }
}
