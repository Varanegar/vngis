using System.ComponentModel.DataAnnotations;

namespace TrackingMap.Service.Entity
{
     public class BaseEntity
    {
        [Key]
        public int Id { get; set; }

    }
}
