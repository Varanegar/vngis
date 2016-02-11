using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TrackingMap.Service.Entity
{
    [Table("area")]
    public class AreaEntity : BaseEntity
    {
        [Column("parent_id", TypeName = "int")]
        public int ParentId { set; get; }

        [Column("code", TypeName = "int")]
        public int Code { set; get; }

        [Column("left_code", TypeName = "int")]
        public int LeftCode { set; get; }
        
        [Column("right_code", TypeName = "int")]
        public int RightCode { set; get; }


        [Column("title", TypeName = "varchar")]
        [MaxLength(200)]
        public string Title { set; get; }

        [Column("isleaf", TypeName = "bit")]
        public bool IsLeaf { set; get; }
    }
}
