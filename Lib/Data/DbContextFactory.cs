using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

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
