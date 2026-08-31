using Hostel.Api.Models.Entities;
using Microsoft.EntityFrameworkCore;

namespace Hostel.Api.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
    {
    }

    public DbSet<User> Users => Set<User>();
    public DbSet<Role> Roles => Set<Role>();
    public DbSet<Room> Rooms => Set<Room>();
    public DbSet<Order> Orders => Set<Order>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<Role>(entity =>
        {
            entity.ToTable("t_role");
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Name).HasMaxLength(255);
        });

        modelBuilder.Entity<User>(entity =>
        {
            entity.ToTable("t_user");
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Username).HasMaxLength(255).IsRequired();
            entity.Property(e => e.Password).HasMaxLength(255).IsRequired();

            entity.HasMany(u => u.Roles)
                  .WithMany(r => r.Users)
                  .UsingEntity<Dictionary<string, object>>(
                      "t_user_roles",
                      j => j.HasOne<Role>().WithMany().HasForeignKey("roles_id"),
                      j => j.HasOne<User>().WithMany().HasForeignKey("user_id"),
                      j =>
                      {
                          j.ToTable("t_user_roles");
                          j.HasKey("user_id", "roles_id");
                      });
        });

        modelBuilder.Entity<Room>(entity =>
        {
            entity.ToTable("h_room");
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Name).HasMaxLength(60).IsRequired();
            entity.Property(e => e.Capacity).IsRequired();
        });

        modelBuilder.Entity<Order>(entity =>
        {
            entity.ToTable("h_order");
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Name).HasMaxLength(255).IsRequired();
            entity.Property(e => e.DocumentId).HasMaxLength(60);
            entity.Property(e => e.DateFrom).IsRequired();
            entity.Property(e => e.DateTo).IsRequired();
            entity.Property(e => e.Night).IsRequired();

            entity.HasOne(o => o.Room)
                  .WithMany(r => r.Orders)
                  .HasForeignKey(o => o.RoomId)
                  .OnDelete(DeleteBehavior.SetNull);
        });
    }
}
