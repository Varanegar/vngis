using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TrackingMap.Service.Entity
{
    [Table("VisitorGroup")]
    public class VisitorGroupEntity : BaseEntity
    {
        [Column("Title", TypeName = "varchar")]
        [MaxLength(200)]
        public string Title { set; get; }

    }
}
