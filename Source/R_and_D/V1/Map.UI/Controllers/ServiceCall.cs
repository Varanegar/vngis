using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Text;
using System.Web;
using Newtonsoft.Json;
using Thinktecture.IdentityModel.Client;

namespace TrackingMap.UI.Controllers
{

    public class ServiceCall
    {
        private const string OwnerKey = "79A0D598-0BD2-45B1-BAAA-0A9CF9EFF240";
        protected const string DataOwnerKey = "DD86E785-7171-498E-A9BB-82E1DBE334EE";
        protected const string DataOwnerCenterKey = "02313882-9767-446D-B4CE-54004EF0AAC4";



        private const string ServserURI = "http://217.218.53.71:4040/";
        private const string UserName = "Gis";
        private const string Password = "1";


        public static object CallApi<T>(string path, object req)
        {

            try
            {
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