namespace FinNoteApi.Models
{
    public class Tank
    {
        public int Id { get; set; }
        public string TankCode { get; set; } = string.Empty;
        public string Title { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; }

        public List<Fish> Fishes { get; set; } = new();
    }

    public class Fish
    {
        public int Id { get; set; }
        public int TankId { get; set; }
        public int FishTypeId { get; set; }
        public string SenderName { get; set; } = string.Empty;
        public string NoteText { get; set; } = string.Empty;
        public double PosX { get; set; }
        public double PosY { get; set; }
        public DateTime CreatedAt { get; set; }

        public Tank? Tank { get; set; }
    }
}