using System.Reflection;
using System.Web.Http;
using System.Web.Mvc;
using Autofac;
using Autofac.Integration.Mvc;
using Autofac.Integration.WebApi;
using TrackingMap.Service.BL;
using TrackingMap.Service.DBManagement;
using TrackingMap.Service.Vn.BL;
using TrackingMap.Service.Vn.DBManagement;

namespace TrackingMap.Infrastructure
{
    public class DependencyRegistrar
    {
        public static IContainer Register()
        {
            var builder = new ContainerBuilder();

            builder.RegisterControllers(Assembly.GetExecutingAssembly());
            builder.RegisterApiControllers(Assembly.GetExecutingAssembly());

            //DbContext
            //builder.Register<IDbContext>(c => MapContextFactory.Create()).InstancePerLifetimeScope();
            builder.Register<IDbContext>(c => new MapContext()).InstancePerLifetimeScope();
            builder.RegisterType<MapVnContext>().InstancePerLifetimeScope();
            //repository
            builder.RegisterGeneric(typeof(EfRepository<>)).As(typeof(IRepository<>)).InstancePerLifetimeScope();
            //services
            builder.RegisterType<ConfigService>().InstancePerLifetimeScope();
            builder.RegisterType<LogService>().InstancePerLifetimeScope();
            builder.RegisterType<AreaService>().InstancePerLifetimeScope();
            builder.RegisterType<AreaPointService>().InstancePerLifetimeScope();
            builder.RegisterType<CustomerService>().InstancePerLifetimeScope();
            builder.RegisterType<SettingService>().InstancePerLifetimeScope();
            builder.RegisterType<VisitorService>().InstancePerLifetimeScope();
            builder.RegisterType<LastStatusService>().InstancePerLifetimeScope();
            builder.RegisterType<TransactionService>().InstancePerLifetimeScope();
            builder.RegisterType<CustomerReportService>().InstancePerLifetimeScope();
            builder.RegisterType<GoodReportService>().InstancePerLifetimeScope();
            builder.RegisterType<GoodByValueReportService>().InstancePerLifetimeScope();
            
            //Vn     
            builder.RegisterType<VnGoodReportService>().InstancePerLifetimeScope();

            //--------------------------------------------------------------------------
            var container = builder.Build();

            //set api dependency
            var webApiResolver = new AutofacWebApiDependencyResolver(container);
            GlobalConfiguration.Configuration.DependencyResolver = webApiResolver;

            //set mvc dependency resolver
            DependencyResolver.SetResolver(new AutofacDependencyResolver(container));
            
            return container;
        }
    }
}