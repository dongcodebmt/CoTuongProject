using System;
using System.ComponentModel.DataAnnotations;

namespace Lib.Entities
{
    //[Table("Student")]
    public class Student
    {
        [Key]
        public Guid Id { get; set; }
        public string Name { get; set; }
        public string IdentifyCode { get; set; }
    }
}
