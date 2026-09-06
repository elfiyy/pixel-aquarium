using Microsoft.EntityFrameworkCore;
using FinNoteApi.Data;

var builder = WebApplication.CreateBuilder(args);

// 1. CORS Tanýmý (Vercel ve tüm kaynaklara izin ver)
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});

// 2. DbContext Tanýmý
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// Otomatik Migration (Tablolarý Render'da otomatik açmasý için)
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    db.Database.Migrate();
}

// 3. CORS Middleware'ini Aktif Et (UseRouting öncesi/sonrasý güvenli yerleþim)
app.UseCors("AllowAll");

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseAuthorization();
app.MapControllers();

app.Run();