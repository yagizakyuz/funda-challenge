# Real Estate Agent Analytics

A full-stack application that analyzes real estate agent data from Funda across different cities in the Netherlands.

## Features

- Search agents by city with autocomplete
- Filter properties by amenities (balcony, garden, terrace)
- Real-time progress updates during data fetching
- Sortable results table showing agent statistics
- Caching system to improve performance
- Rate limiting and retry mechanisms for API calls


### Tech Stack



#### Frontend
- React 19
- TypeScript
- Vite
- Styled Components
- Server-Sent Events for real-time updates

To run:
```shell
cd frontend
npm install
npm run dev
```

### Backend
- C#
- .NET Core 9.0

To run:
```shell
cd backend
dotnet restore
dotnet run
```
