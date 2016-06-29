using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Text;
using System.Web;
using System.Web.Configuration;
using Newtonsoft.Json;
using Thinktecture.IdentityModel.Client;

namespace TrackingMap.UI.Controllers
{

    public class ServiceCall
    {


        public static object CallApi<T>(string path, object req)
        {

            try
             {

                 var OwnerKey = WebConfigurationManager.AppSettings["OwnerKey"];
                 var DataOwnerKey = WebConfigurationManager.AppSettings["DataOwnerKey"];
                 var DataOwnerCenterKey = WebConfigurationManager.AppSettings["DataOwnerCenterKey"];

                 var ServserURI = WebConfigurationManager.AppSettings["ServserURI"];
                 var UserName = WebConfigurationManager.AppSettings["UserName"];
                 var Password = WebConfigurationManager.AppSettings["Password"];               

                var oauthClient = new OAuth2Client(new Uri(ServserURI + "/oauth/token"));
                var client = new HttpClient();
                client.Timeout = TimeSpan.FromHours(1);
                var oauthresult =
                    oauthClient.RequestResourceOwnerPasswordAsync(UserName, Password, OwnerKey + "," + DataOwnerKey)
                        .Result; //, "foo bar"
                if (oauthresult.AccessToken != null)
                {
                    client.SetBearerToken(oauthresult.AccessToken);

                    string data = JsonConvert.SerializeObject(req);
                    HttpContent content = new StringContent(data, Encoding.UTF8, "application/json");
                    content.Headers.Add("OwnerKey", OwnerKey);
                    content.Headers.Add("DataOwnerKey", DataOwnerKey);
                    content.Headers.Add("DataOwnerCenterKey", DataOwnerCenterKey);

                    var result8 = client.PostAsync(ServserURI + "/api/dsd/"+ path, content).Result;
                    var json8 = result8.Content.ReadAsStringAsync().Result;

                    if (json8 != "")
                    {
                        var x = JsonConvert.DeserializeObject<T>(json8);
                        return x;
                    }
                }

            }
            catch (Exception ex)
            {
                //log.Error("error", ex);
                Console.WriteLine("Error, {0}", ex.Message);
            }
            return null;

        }
    }
}