using Lib;
using Lib.Entities;
using Lib.Services;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web.Mvc;

namespace DemoAPI.Controllers.api
{
    public class StudentController : Controller
    {
        //ApplicationDbContext _dbContext = new ApplicationDbContext();
        StudentService stService = new StudentService();
        //[HttpGet]
        [Route("api/Student/getbyId")]
        public ActionResult getbyId(Student pv)
        {
            List<Student> stList = stService.GetStudents();
            int totalRecord = stList.Count;
            return
            Json(new
            {
                total = totalRecord,
                data = stList //_dbContext.Student.OrderBy(s=>s.Id).Skip(2).Take(3).ToList() //Where(s=>s.Id == Guid.Parse(id)).FirstOrDefault()
            }, JsonRequestBehavior.AllowGet);
        }
        [HttpGet]
        [Route("api/Student/getbyId1")]
        public ActionResult getbyId1(Student pv)
        {
            //int totalRecord = _dbContext.Student.Count();
            return Json(new
            {
                total = 0,
                data = "test"
            }, JsonRequestBehavior.AllowGet);
        }
    }
}