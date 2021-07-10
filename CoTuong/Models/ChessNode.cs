using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace DemoAPI.Models
{
    public class ChessNode
    {
        public string id { get; set; }
        public string src { get; set; }
        public int top { get; set; }
        public int left { get; set; }
        public string visible { get; set; }
    }
}