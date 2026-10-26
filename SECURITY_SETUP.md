# Security Setup Guide

## Overview
This application uses environment variables for sensitive configuration to keep secrets out of source code.

## Local Development Setup

### 1. Set JWT Secret (Development)
The application automatically uses a development secret when running locally. No action needed for local testing.

**Development appsettings.Development.json** includes:
- Default JWT secret (safe for development only)
- CORS allows localhost:3000 and localhost:5000
- Detailed logging enabled

### 2. Running Locally
```powershell
cd src/Hostel.Api
dotnet run
```

The app will automatically load `appsettings.Development.json` and work with default test credentials:
- **Admin**: `admin` / `admin` (ROLE_ADMIN)
- **User**: `user` / `user` (ROLE_USER)

---

## Production Deployment

### Required Environment Variables

Set these before deploying to production:

```bash
# Generate a strong secret (at least 32 characters)
JWT_SECRET="YourVeryLongSecureRandomKeyHere_MinimumLength32Characters!"

# CORS: Set to your actual domain
# (Configure in appsettings.Production.json or as env var)

# Database connection (if not using default)
ConnectionStrings__DefaultConnection="Data Source=/var/lib/hostel/hostel.db"
```

### 1. Generate JWT Secret
```powershell
# PowerShell: Generate random string
$secret = [System.Convert]::ToBase64String([System.Text.Encoding]::UTF8.GetBytes([System.Guid]::NewGuid().ToString() + [System.Guid]::NewGuid().ToString()))
Write-Host "JWT_SECRET=$secret"
```

Or use online generator: https://www.lastpass.com/password-generator

**Requirements**:
- Minimum 32 characters
- Mix of uppercase, lowercase, numbers, special characters
- Store in secure environment variable management system

### 2. Update CORS Configuration
Edit `src/Hostel.Api/appsettings.Production.json`:
```json
"AllowedOrigins": [
  "https://your-domain.com",
  "https://www.your-domain.com"
]
```

### 3. Change Default Seed Credentials
**CRITICAL**: Do NOT deploy with default test credentials in production.

Modify `src/Hostel.Api/Data/DbInitializer.cs` or disable seeding entirely:
- Either change the hardcoded admin/user passwords
- Or remove the seed logic and create users via API after deployment
- Or use a migration system to manage production credentials

### 4. Enable HTTPS
Update `appsettings.Production.json`:
```json
"Kestrel": {
  "Endpoints": {
    "Https": {
      "Url": "https://0.0.0.0:443",
      "Certificate": {
        "Path": "/etc/certs/hostel-cert.pfx",
        "Password": "${CERTIFICATE_PASSWORD}"
      }
    }
  }
}
```

### 5. Deploy with Environment Variables

#### Docker
```dockerfile
ENV JWT_SECRET="YourSecretHere"
ENV ASPNETCORE_ENVIRONMENT=Production
```

#### Kubernetes
```yaml
env:
  - name: JWT_SECRET
    valueFrom:
      secretKeyRef:
        name: hostel-secrets
        key: jwt-secret
  - name: ASPNETCORE_ENVIRONMENT
    value: "Production"
```

#### Azure App Service
Set in Configuration → Application settings:
- `ASPNETCORE_ENVIRONMENT` = `Production`
- `Jwt:Secret` = `[your secure secret]`
- `ConnectionStrings:DefaultConnection` = `[your database connection]`

#### AWS Lambda / ECS
Use AWS Secrets Manager and reference in task definition:
```json
{
  "name": "JWT_SECRET",
  "valueFrom": "arn:aws:secretsmanager:region:account:secret:hostel/jwt-secret"
}
```

---

## Configuration Files Reference

### appsettings.json (Base)
- **Purpose**: Shared across all environments
- **Contains**: Non-sensitive defaults, database URL template
- **Never commit**: Secrets

### appsettings.Development.json
- **Purpose**: Local development
- **Contains**: Dev JWT secret, localhost CORS
- **In .gitignore**: Yes (secret-safe to version, but development-only)

### appsettings.Production.json
- **Purpose**: Production template
- **Contains**: Structure, HTTPS config, production CORS
- **JWT Secret**: Filled from `JWT_SECRET` env var
- **NEVER**: Commit actual secrets

---

## Verification Checklist

Before deploying to production:

- [ ] JWT_SECRET environment variable is set (32+ chars, random, strong)
- [ ] Default credentials (admin/admin, user/user) are changed
- [ ] CORS allows only your actual domains
- [ ] HTTPS/TLS is enabled
- [ ] Database connection is to production database
- [ ] Logging level is Warning or higher
- [ ] RequireHttpsMetadata is `true` in production
- [ ] Database backups are configured
- [ ] Secrets are stored in secure vault (not in code, not in logs)

---

## Troubleshooting

### "JWT Secret must be set via environment variable in production"
**Solution**: Set `JWT_SECRET` environment variable before running in production mode.

### "Failed to bind to address already in use"
**Solution**: Change port in `appsettings.Production.json` or kill existing process.

### "Access denied" on database
**Solution**: Verify `ConnectionStrings:DefaultConnection` and database permissions.

### CORS errors in browser console
**Solution**: Add your domain to `AllowedOrigins` in appsettings file or environment config.

---

## References
- [ASP.NET Core Configuration](https://docs.microsoft.com/en-us/aspnet/core/fundamentals/configuration/)
- [User Secrets in Development](https://docs.microsoft.com/en-us/aspnet/core/security/app-secrets)
- [JWT Bearer in ASP.NET Core](https://docs.microsoft.com/en-us/aspnet/core/security/authentication/jwt)
