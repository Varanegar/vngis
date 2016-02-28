using System.Reflection;
using System.Web.Http;
using System.Web.Mvc;
using Autofac;
using Autofac.Integration.Mvc;
using Autofac.Integration.WebApi;
using TrackingMap.Service.BL;
using TrackingMap.Service.DBManagement;

namespace TrackingMap.Infrastructure
{
    public class DependencyRegistrar
    {
        public static IContainer Register()
        {
            var builder = new ContainerBuilder();

            builder.RegisterControllers(Assembly.GetExecutingAssembly());
            builder.RegisterApiControllers(Assembly.GetExecutingAssembly());

            builder.Register<IDbContext>(c => MapContextFactory.Create()).InstancePerLifetimeScope();

            builder.RegisterGeneric(typeof(EfRepository<>)).As(typeof(IRepository<>)).InstancePerLifetimeScope();

            builder.RegisterType<ConfigService>().InstancePerLifetimeScope();
            builder.RegisterType<LogService>().InstancePerLifetimeScope();
            builder.RegisterType<AreaService>().InstancePerLifetimeScope();
            builder.RegisterType<AreaPointService>().InstancePerLifetimeScope();
            builder.RegisterType<CustomerService>().InstancePerLifetimeScope();
            builder.RegisterType<SettingService>().InstancePerLifetimeScope();
            builder.RegisterType<VisitorService>().InstancePerLifetimeScope();
            builder.RegisterType<TransactionService>().InstancePerLifetimeScope();

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