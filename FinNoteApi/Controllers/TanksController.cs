using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using FinNoteApi.Data;
using FinNoteApi.Models;

namespace FinNoteApi.Controllers
{
    public record CreateTankDto(string Title, string Password);
    public record AddFishDto(int FishTypeId, string SenderName, string NoteText, double PosX, double PosY);
    public record LoginDto(string Title, string Password);

    [ApiController]
    [Route("api/[controller]")]
    public class TanksController : ControllerBase
    {
        private readonly AppDbContext _context;

        public TanksController(AppDbContext context)
        {
            _context = context;
        }

        // 1. Yeni Akvaryum Oluştur
        [HttpPost]
        public async Task<IActionResult> CreateTank([FromBody] CreateTankDto dto)
        {
            var titleTrimmed = dto.Title.Trim();

            // Aynı isimde akvaryum var mı kontrolü
            var exists = await _context.Tanks.AnyAsync(t => t.Title.ToLower() == titleTrimmed.ToLower());
            if (exists) return BadRequest("Bu isimde bir akvaryum zaten var, lütfen başka bir isim seçin.");

            var code = "FN-" + Guid.NewGuid().ToString("N")[..4].ToUpper();

            var tank = new Tank
            {
                TankCode = code,
                Title = titleTrimmed,
                Password = dto.Password,
                CreatedAt = DateTime.UtcNow
            };

            _context.Tanks.Add(tank);
            await _context.SaveChangesAsync();

            return Ok(new { tankCode = tank.TankCode, title = tank.Title });
        }

        // 2. Akvaryumu Getir (Ziyaretçi veya Sahip ilk açtığında - Notlar gizlidir)
        [HttpGet("{code}")]
        public async Task<IActionResult> GetTank(string code)
        {
            var tank = await _context.Tanks
                .Include(t => t.Fishes)
                .FirstOrDefaultAsync(t => t.TankCode == code);

            if (tank == null) return NotFound("Akvaryum bulunamadı.");

            return Ok(new
            {
                code = tank.TankCode,
                title = tank.Title,
                fishCount = tank.Fishes.Count,
                fishes = tank.Fishes.Select(f => new
                {
                    id = f.Id,
                    fishId = f.FishTypeId,
                    sender = f.SenderName,
                    note = "🔒 Gizli Not",
                    date = f.CreatedAt.ToString("dd.MM.yyyy"),
                    x = f.PosX,
                    y = f.PosY
                })
            });
        }

        // 3. Akvaryuma İsim ve Şifre ile Giriş Yap (Notları açar)
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginDto dto)
        {
            var tank = await _context.Tanks
                .Include(t => t.Fishes)
                .FirstOrDefaultAsync(t => t.Title.ToLower() == dto.Title.Trim().ToLower());

            if (tank == null) return NotFound("Bu isimde bir akvaryum bulunamadı!");
            if (tank.Password != dto.Password) return Unauthorized("Şifre hatalı!");

            // 8 balık dolmuşsa gerçek notları dön, dolmamışsa yine gizli dön
            bool isFull = tank.Fishes.Count >= 8;

            return Ok(new
            {
                code = tank.TankCode,
                title = tank.Title,
                isOwner = true,
                isFull = isFull,
                fishes = tank.Fishes.Select(f => new
                {
                    id = f.Id,
                    fishId = f.FishTypeId,
                    sender = f.SenderName,
                    note = isFull ? f.NoteText : "🔒 Notlar 8 canlı tamamlandığında açılacak.",
                    date = f.CreatedAt.ToString("dd.MM.yyyy"),
                    x = f.PosX,
                    y = f.PosY
                })
            });
        }

        // 4. Balık Bırak
        [HttpPost("{code}/fishes")]
        public async Task<IActionResult> AddFish(string code, [FromBody] AddFishDto dto)
        {
            var tank = await _context.Tanks
                .Include(t => t.Fishes)
                .FirstOrDefaultAsync(t => t.TankCode == code);

            if (tank == null) return NotFound("Akvaryum bulunamadı.");
            if (tank.Fishes.Count >= 8) return BadRequest("Bu akvaryum tamamen dolmuş (8/8).");
            if (tank.Fishes.Any(f => f.FishTypeId == dto.FishTypeId))
                return BadRequest("Bu canlı türü bu akvaryuma daha önce bırakılmış, lütfen başka bir canlı seçin.");

            var fish = new Fish
            {
                TankId = tank.Id,
                FishTypeId = dto.FishTypeId,
                SenderName = dto.SenderName,
                NoteText = dto.NoteText,
                PosX = dto.PosX,
                PosY = dto.PosY,
                CreatedAt = DateTime.UtcNow
            };

            _context.Fishes.Add(fish);
            await _context.SaveChangesAsync();

            return Ok(new { success = true });
        }
    }
}