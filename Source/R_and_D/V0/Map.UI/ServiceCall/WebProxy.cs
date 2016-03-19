using System;
using System.Collections.Generic;
using System.Net;
using System.Web;

namespace TrackingMap.UI.ServiceCall
{
    public class WebProxy : WebClient
    {
        public WebProxy() {
            this.Headers["Content-Type"] = "application/json";
            this.Encoding = System.Text.Encoding.UTF8;    
        }

        public string RegisterRoutes(string path)
        {
            //TODO: 
            return "http://localhost:8398/api/" + path;
        }

    }

}