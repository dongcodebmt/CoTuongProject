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
    public class StudentService
    {
        private IUnitOfWork unitOfWork;
        private StudentRespository studentRepository;
        public StudentService()
        {
            var dbContextFactory = new DbContextFactory();
            unitOfWork = new UnitOfWork(dbContextFactory);
            studentRepository = new StudentRespository(dbContextFactory);
        }
        public void Save()
        {
            unitOfWork.Commit();
        }
        public List<Student> GetStudents() {
            return studentRepository.GetStudents();
        }
        public bool addStudent(Student st) {
            using (var trans = unitOfWork.BeginTransaction())
            {
                try
                {
                    // respository add/update
                    Save();
                }
                catch (Exception ex)
                {
                    trans.Rollback();
                    return false;
                }
                
            }
            
            return true;
        }
    }
}
