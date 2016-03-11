using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TrackingMap.Service.Entity
{
    [Table("Customer")]
    public class CustomerEntity : BaseEntity
    {
        [Column("Title", TypeName = "varchar")]
        [MaxLength(200)]
        public string Title { set; get; }
        
        [Column("Address", TypeName = "varchar")]
        [MaxLength(500)]
        public string Address { set; get; }

        [Column("Latitude")]
        public double Latitude { set; get; }

        [Column("Longitude")]
        public double Longitude { set; get; }

    }
}
