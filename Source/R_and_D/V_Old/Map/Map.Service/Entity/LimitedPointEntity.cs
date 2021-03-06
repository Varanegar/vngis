﻿using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TrackingMap.Service.ViewModel;

namespace TrackingMap.Service.Entity
{
    [Table("area_point")]
    public class AreaPointEntity : BaseEntity
    {
        [Column("master_id", TypeName = "int")]
        public int MasterId { set; get; }

        [Column("latitude")]
        public double Latitude { set; get; }

        [Column("longitude")]
        public double Longitude { set; get; }

        public AreaPointEntity()
        {
        }

        public AreaPointEntity(AreaPointView view)
        {
            this.Id = view.Id;
            this.Latitude = view.Lat;
            this.Longitude = view.Lng;
            this.MasterId = view.MasterId;
        }

    }
}
