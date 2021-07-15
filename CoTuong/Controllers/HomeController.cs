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
            ViewBag.Title = "Trang chủ";
            return View();
        }
        public ActionResult Chess()
        {
            ViewBag.Title = "Phòng chơi";

            return View();
        }
        public ActionResult AutoChess()
        {
            ViewBag.Title = "Đánh với máy";

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
