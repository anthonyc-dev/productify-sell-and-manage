 
# API Tools

## 1. OpenWeather API
- Purpose: Fetch weather data for a city.
- Endpoint: GET https://api.openweathermap.org/data/2.5/weather?q={city}&appid={API_KEY}
- Input: city name
- Output: JSON with temperature, humidity, weather description
- Usage Example: "Fetch current weather for Manila"

## 2. GitHub API
- Purpose: Query repository info, commits, or issues.
- Endpoint: GET https://api.github.com/repos/{owner}/{repo}
- Input: owner, repo name
- Output: Repository metadata in JSON
- Usage Example: "List last 5 commits for my repo"

> Guidelines:
> - Only call APIs listed here.
> - Validate inputs before calling.
> - Output should be formatted in readable JSON or markdown.