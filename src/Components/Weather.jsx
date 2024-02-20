// src/components/Weather.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../App.css'

const Weather = () => {
  const [weatherData, setWeatherData] = useState(null);
  const [forecastData, setForecastData] = useState(null);
  const [city, setCity] = useState('');
  const [error, setError] = useState('');
  const isDaytime = ''

  const apiKey = '41ff18fcfbaa872a4c5ef50d9730b033';

  const getWeatherData = async () => {
    try {
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`
      );
      setWeatherData(response.data);
      setError('');
    } catch (error) {
      console.error('Error fetching weather data:', error);
      setError('Error fetching weather data. Please try again.');
    }
  };

  const getForecastData = async () => {
    try {
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}`
      );
      setForecastData(response.data);
    } catch (error) {
      console.error('Error fetching forecast data:', error);
    }
  };

  const formatTimestamp = (timestamp, timezone) => {
    const date = new Date(timestamp * 1000); // Convert from seconds to milliseconds
    const localTime = new Date(date.toLocaleString('en-US', { timeZone: timezone }));
    return localTime.toLocaleString(); // Adjust the formatting as needed
  };

  const fetchTimezone = async (latitude, longitude) => {
    try {
      const response = await axios.get(
        `http://api.geonames.org/timezoneJSON?lat=${latitude}&lng=${longitude}&username=sakshi3maurya`
      );
      const { timezoneId, sunrise, sunset } = response.data;
      const currentTime = new Date().getTime() / 1000; // Current time in seconds
      isDaytime = currentTime >= sunrise && currentTime < sunset;
      
      return { timezoneId, isDaytime };
    } catch (error) {
      console.error('Error fetching timezone:', error);
      return null;
    }
  };



  useEffect(()=>{
    getWeatherData();
    getForecastData();
  },[city]); //Fetch Data whenever the city changes


  return (

    <div className='weather-container'>
    <div className='inputs'>
      <input
        type="text"
        placeholder="Enter city"
        value={city}
        onChange={(e) => setCity(e.target.value)}
      />
      <button onClick={getWeatherData}>Get Weather</button>

    </div>
      
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {weatherData && (
        <div className={isDaytime? 'headerday' : 'headernight'}>
        
          <h2 className='temperature'>{weatherData.name}</h2>
          <p className='temperature'>Temperature: {(weatherData.main.temp- 273.15).toFixed(2)} &deg;C</p>
          {/* Add more weather details as needed */}
        </div>
      )}

      {forecastData && (
        <>
        <h2 className='h2class'>5-Day Forecast</h2>
        <div className='forecast-container'>
          
          {/* Loop through forecast data and display daily and hourly forecasts */}
          {/* You may need to adjust the data structure based on the OpenWeatherMap API response */}
          {forecastData.list.map((forecast, index) => (
            <div key={index} className='forecast-day'>
              <p className='forecast-time'>{forecast.dt_txt}</p>
              <p className='forecast'>Temperature: {(forecast.main.temp - 273.15).toFixed(2)} &deg;C</p>
              <p className='forecast-description'>Weather Description: {forecast.weather[0].description}</p>
              {/* Add more details as needed */}
            </div>
          ))}
        </div>
        </>
      )}

    </div>
  );
};

export default Weather;
