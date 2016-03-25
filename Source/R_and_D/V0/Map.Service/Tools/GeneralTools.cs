using System;
using System.Collections.Generic;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TrackingMap.Common.ViewModel;

namespace TrackingMap.Service.Tools
{
    public class GeneralTools
    {
        public static string IntListTostring(List<int> list )
        {
            return list.Aggregate("", (current, i) => current + (i + ','));
        }
        public static string GuidListTostring(List<Guid> list)
        {
            var str = list.Aggregate("", (current, i) => current + (i.ToString() + ','));
            if (str.Length > 0)
              str = str.Remove(str.Length - 1);
            return str;
        }

        public static Color GetRandomColor()
        {   var randonGen = new Random();
            var c = Color.FromArgb(randonGen.Next(1, 255), randonGen.Next(1, 255), 
                                randonGen.Next(1, 255));
            return c;
        }

        public static List<PolyView> PointListToPolyList(List<PointView> list, bool closeline, bool randomColor)
        {
            Guid? group = null;
            var lines = new List<PolyView>();
            var line = new List<PointView>();
            var color = Color.Black;


            foreach (var pointView in list)
            {
                if (group == null)
                    group = pointView.MasterId;

                if (group != pointView.MasterId)
                {
                    if (randomColor) color = GetRandomColor();
                    if ((!pointView.IsLeaf) && (closeline)) line.Add(line.ElementAt(0));
                        

                    lines.Add(new PolyView()
                    {
                        Points = line,
                        Color = color.ToArgb().ToString()
                    });
                    line = new List<PointView>();
                    group = pointView.MasterId;
                }
                line.Add(pointView);
            }
            if (line.Count > 0)
            {
                if ((closeline) && (!line.ElementAt(0).IsLeaf)) line.Add(line.ElementAt(0));
            }
            
            if (randomColor) color = GetRandomColor();
            lines.Add(new PolyView()
                {
                    Points = line,
                    Color = color.ToArgb().ToString()
                });
            
            return lines;
        }
    }
}
