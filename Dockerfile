# Dockerfile for ASP.NET Core API

# Base image for running the app
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
WORKDIR /app
EXPOSE 8080
EXPOSE 8081

# Build stage
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Copy csproj files to restore dependencies first (for layer caching)
COPY ["HospitalERP.API/HospitalERP.API.csproj", "HospitalERP.API/"]
COPY ["HospitalERP.Application/HospitalERP.Application.csproj", "HospitalERP.Application/"]
COPY ["HospitalERP.Domain/HospitalERP.Domain.csproj", "HospitalERP.Domain/"]
COPY ["HospitalERP.Infrastructure/HospitalERP.Infrastructure.csproj", "HospitalERP.Infrastructure/"]

RUN dotnet restore "HospitalERP.API/HospitalERP.API.csproj"

# Copy the remaining files
COPY . .
WORKDIR "/src/HospitalERP.API"

# Build and Publish
RUN dotnet build "HospitalERP.API.csproj" -c Release -o /app/build
RUN dotnet publish "HospitalERP.API.csproj" -c Release -o /app/publish /p:UseAppHost=false

# Final production stage
FROM base AS final
WORKDIR /app
COPY --from=build /app/publish .
ENTRYPOINT ["dotnet", "HospitalERP.API.dll"]
