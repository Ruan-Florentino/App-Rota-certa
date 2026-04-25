import axios from "axios";

const API_KEY = process.env.OPENWEATHERMAP_API_KEY;

export interface WeatherData {
  temp: number;
  description: string;
  icon: string;
  date: string;
}

export const getWeather = async (city: string): Promise<WeatherData[]> => {
  if (!API_KEY) {
    // Mock data if no API key
    return [
      { temp: 28, description: "Céu limpo", icon: "01d", date: "Hoje" },
      {
        temp: 26,
        description: "Parcialmente nublado",
        icon: "02d",
        date: "Amanhã",
      },
      {
        temp: 24,
        description: "Chuva leve",
        icon: "10d",
        date: "Depois de amanhã",
      },
    ];
  }

  try {
    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&lang=pt_br&appid=${API_KEY}`,
    );

    // Get one forecast per day (every 8th item as it's 3-hour intervals)
    return response.data.list
      .filter((_: any, i: number) => i % 8 === 0)
      .map((item: any) => ({
        temp: Math.round(item.main.temp),
        description: item.weather[0].description,
        icon: item.weather[0].icon,
        date: new Date(item.dt * 1000).toLocaleDateString("pt-BR", {
          weekday: "short",
        }),
      }));
  } catch (error) {
    console.error("Error fetching weather:", error);
    return [];
  }
};
