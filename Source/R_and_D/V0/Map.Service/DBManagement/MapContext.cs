using System.Collections.Generic;
using System.Data.Entity;
using TrackingMap.Service.Entity;

namespace TrackingMap.Service.DBManagement
{
    public class MapContext : DbContext, IDbContext
    {
        public MapContext(string constr)
            : base(constr)
        {
            var customCommands = new List<string>();
            customCommands.AddRange(
                DBUtility.ParseCommands(DefaultValue.GetAppDataPath() + "SqlServer.StoredProcedures.sql", false));
            //
            var initializer = new MapDBInitializer(customCommands.ToArray());
            Database.SetInitializer<MapContext>(initializer);
          
         
           // Console.Write(Database.Connection.ConnectionString);
        }

        public new IDbSet<TEntity> Set<TEntity>() where TEntity : BaseEntity
        {
            return base.Set<TEntity>();
        }

        public Database GetDatabase()
        {
            return this.Database;
        }

        public DbSet<AreaEntity> Areas { get; set; }
        public DbSet<AreaPointEntity> AreaPoints { get; set; }

    
    }
}
