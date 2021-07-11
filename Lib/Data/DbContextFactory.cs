namespace Lib.Data
{
    public class DbContextFactory
    {
        private ApplicationDbContext dataContext = null;
        public ApplicationDbContext DataContext
        {
            get
            {
                if (dataContext == null)
                {
                    dataContext = new ApplicationDbContext();

                }
                return dataContext;
            }
            set
            {
                dataContext = value;
            }
        }
    }
}
