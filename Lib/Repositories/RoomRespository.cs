using Lib.Data;
using Lib.Entities;
using System.Collections.Generic;
using System.Linq;

namespace Lib.Repositories
{
    public interface IRoomRepository : IRepository<Room>
    {
        List<Room> GetAllRooms();
    }
    public class RoomRespository : RepositoryBase<Room>, IRoomRepository
    {
        public RoomRespository(DbContextFactory factory)
            : base(factory)
        {

        }
        public List<Room> GetAllRooms()
        {
            var query = dataContext.Room.AsQueryable();
            return query.ToList();
        }
    }
}
