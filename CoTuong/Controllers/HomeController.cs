using Lib;
using Lib.Entities;
using Lib.Services;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace DemoAPI.Controllers
{
    public class HomeController : Controller
    {
        StudentService stService = new StudentService();
        ChessService chessService = new ChessService();
        public ActionResult Index()
        {
            
           
            ViewBag.Title = "Home Page";
            /*ApplicationDbContext _dbContext;
            _dbContext = new ApplicationDbContext();
            Lib.Entities.Student st = new Lib.Entities.Student();
            st.Id = Guid.NewGuid();
            st.Name = "test";
            st.IdentifyCode = "test 2";
            _dbContext.Student.Add(st);
            _dbContext.SaveChanges();
            */
            insertRoom();


            return View();
        }
        public void insertRoom() {
            Room r = new Room();
            r.Id = Guid.NewGuid();
            r.Name = "test";
            chessService.insertRoom(r);
        }
    }
}
