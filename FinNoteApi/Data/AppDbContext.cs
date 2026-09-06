using Microsoft.EntityFrameworkCore;
using FinNoteApi.Models;

namespace FinNoteApi.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<Tank> Tanks => Set<Tank>();
        public DbSet<Fish> Fishes => Set<Fish>();
    }
}
