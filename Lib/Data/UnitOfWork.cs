using System.Data.Entity;

namespace Lib.Data
{
    public interface IUnitOfWork
    {
        void Commit();

        DbContextTransaction BeginTransaction();
    }

    public class UnitOfWork : IUnitOfWork
    {
        public ApplicationDbContext DataContext
        {
            get;
            set;
        }

        public UnitOfWork(DbContextFactory factory)
        {
            DataContext = factory.DataContext;
        }

        public UnitOfWork()
        {
            DataContext = new ApplicationDbContext();
        }

        public DbContextTransaction BeginTransaction()
        {
            return DataContext.Database.BeginTransaction();
        }

        public void Commit()
        {
            DataContext.SaveChanges();
        }
    }
}
