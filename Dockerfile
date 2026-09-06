FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src
COPY ["FinNoteApi/FinNoteApi.csproj", "FinNoteApi/"]
RUN dotnet restore "FinNoteApi/FinNoteApi.csproj"
COPY . .
WORKDIR "/src/FinNoteApi"
RUN dotnet publish "FinNoteApi.csproj" -c Release -o /app/publish /p:UseAppHost=false

FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS final
WORKDIR /app
COPY --from=build /app/publish .
ENV ASPNETCORE_URLS=http://+:8080
EXPOSE 8080
ENTRYPOINT ["dotnet", "FinNoteApi.dll"]