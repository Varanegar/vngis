using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Web;
using System.Web.Cors;
using System.Web.Http.Cors;

namespace TrackingMap.Infrastructure
{
    [AttributeUsage(AttributeTargets.Method | AttributeTargets.Class, AllowMultiple = false)]
    public class MapCorsPolicyAttribute : Attribute, ICorsPolicyProvider 
    {
        private CorsPolicy _policy;

        public MapCorsPolicyAttribute()
        {
            // Create a CORS policy.
            _policy = new CorsPolicy
            {
                AllowAnyMethod = true,
                AllowAnyHeader = true
            };

            // Add allowed origins.
            _policy.Origins.Add("http://localhost:2333");
            //_policy.Origins.Add("");
        }


        public System.Threading.Tasks.Task<CorsPolicy> GetCorsPolicyAsync(System.Net.Http.HttpRequestMessage request, System.Threading.CancellationToken cancellationToken)
        {
            return Task.FromResult(_policy);
        }
    }
}