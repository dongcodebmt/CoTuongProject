using Lib.Entities;
using Lib.Services;
using System;
using System.Web.Mvc;

namespace DemoAPI.Controllers
{
    public class HomeController : Controller
    {
        ChessService chessService = new ChessService();
        public ActionResult Index()
        {
            return View();
        }
        public ActionResult Chess()
        {
            ViewBag.Title = "Home Page";

            return View();
        }
        public void insertRoom()
        {
            Room r = new Room();
            r.Id = Guid.NewGuid();
            r.Name = "test";
            chessService.insertRoom(r);
        }
    }
}
