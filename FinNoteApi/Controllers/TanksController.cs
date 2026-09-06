using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using FinNoteApi.Data;
using FinNoteApi.Models;

namespace FinNoteApi.Controllers
{
    public record CreateTankDto(string Title, string Password);
    public record AddFishDto(int FishTypeId, string SenderName, string NoteText, double PosX, double PosY);
    public record UnlockDto(string Password);

    [ApiController]
    [Route("api/[controller]")]
    public class TanksController : ControllerBase
    {
        private readonly AppDbContext _context;

        public TanksController(AppDbContext context)
        {
            _context = context;
        }

        [HttpPost]
        public async Task<IActionResult> CreateTank([FromBody] CreateTankDto dto)
        {
            var code = "FN-" + Guid.NewGuid().ToString("N")[..4].ToUpper();

            var tank = new Tank
            {
                TankCode = code,
                Title = dto.Title,
                Password = dto.Password,
                CreatedAt = DateTime.UtcNow
            };

            _context.Tanks.Add(tank);
            await _context.SaveChangesAsync();

            return Ok(new { tankCode = tank.TankCode, title = tank.Title });
        }

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
                    x = f.PosX,
                    y = f.PosY
                })
            });
        }

        [HttpPost("{code}/fishes")]
        public async Task<IActionResult> AddFish(string code, [FromBody] AddFishDto dto)
        {
            var tank = await _context.Tanks
                .Include(t => t.Fishes)
                .FirstOrDefaultAsync(t => t.TankCode == code);

            if (tank == null) return NotFound("Akvaryum bulunamadı.");
            if (tank.Fishes.Count >= 8) return BadRequest("Akvaryum dolmuş.");
            if (tank.Fishes.Any(f => f.FishTypeId == dto.FishTypeId)) 
                return BadRequest("Bu canlı türü zaten eklenmiş.");

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

        [HttpPost("{code}/unlock")]
        public async Task<IActionResult> UnlockNotes(string code, [FromBody] UnlockDto dto)
        {
            var tank = await _context.Tanks
                .Include(t => t.Fishes)
                .FirstOrDefaultAsync(t => t.TankCode == code);

            if (tank == null) return NotFound();
            if (tank.Password != dto.Password) return Unauthorized("Hatalı şifre!");
            if (tank.Fishes.Count < 8) return BadRequest("Notlar 8 canlı tamamlanmadan açılamaz.");

            return Ok(new
            {
                fishes = tank.Fishes.Select(f => new
                {
                    id = f.Id,
                    fishId = f.FishTypeId,
                    sender = f.SenderName,
                    note = f.NoteText,
                    date = f.CreatedAt.ToString("dd.MM.yyyy"),
                    x = f.PosX,
                    y = f.PosY
                })
            });
        }
    }
}