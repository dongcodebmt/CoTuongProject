using Lib.Data;
using Lib.Entities;
using Lib.Repositories;
using System.Collections.Generic;

namespace Lib.Services
{
    public class ChessService
    {
        private IUnitOfWork unitOfWork;
        private RoomRespository roomRepository;
        public ChessService()
        {
            var dbContextFactory = new DbContextFactory();
            unitOfWork = new UnitOfWork(dbContextFactory);
            roomRepository = new RoomRespository(dbContextFactory);
        }
        public void Save()
        {
            unitOfWork.Commit();
        }
        public void insertRoom(Room r)
        {
            roomRepository.Add(r);
            Save();
        }
        public List<Room> getAllRoom()
        {
            return roomRepository.GetAllRooms();
        }
    }
}
