using Lib.Data;
using Lib.Entities;
using Lib.Repositories;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Lib.Services
{
    public class ChessService
    {
        private IUnitOfWork unitOfWork;
        private RoomRespository roomRepository;
        public ChessService() {
            var dbContextFactory = new DbContextFactory();
            unitOfWork = new UnitOfWork(dbContextFactory);
            roomRepository = new RoomRespository(dbContextFactory);
        }
        public void Save() {
            unitOfWork.Commit();
        }
        public void insertRoom(Room r) {
            roomRepository.Add(r);
            Save();
        }
        public List<Room> getAllRoom() {
            return roomRepository.GetAllRooms();
        }
    }
}
