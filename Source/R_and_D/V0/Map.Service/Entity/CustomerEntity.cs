using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TrackingMap.Service.Entity
{
    [Table("customer")]
    public class CustomerEntity : BaseEntity
    {
        [Column("title", TypeName = "varchar")]
        [MaxLength(200)]
        public string Title { set; get; }
        
        [Column("address", TypeName = "varchar")]
        [MaxLength(500)]
        public string Address { set; get; }

        [Column("latitude")]
        public double Latitude { set; get; }

        [Column("longitude")]
        public double Longitude { set; get; }

    }
}
