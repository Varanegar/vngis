﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TrackingMap.Common.ViewModel
{
    public class AreaPointListView
    {
        public Guid Id { set; get; } 
        public List<AreaPointView> Points{set; get;}

    }
}
