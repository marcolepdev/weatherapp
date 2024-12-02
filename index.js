document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('cityInput');
    const searchButton = document.getElementById('searchButton');
    const weatherInfo = document.getElementById('weatherInfo');
    const locationInfo = document.getElementById('locationInfo');
    const cityName = document.getElementById('cityName');
    const countryName = document.getElementById('countryName');
    const temperature = document.getElementById('temperature');
    const conditionText = document.getElementById('conditionText');
    const weatherCondition = document.getElementById('weatherCondition');
    const errorBox = document.getElementById('errorBox');
    const loadingMessage = document.getElementById('loadingMessage');
    const currentDate = document.getElementById('currentDate');
    const dateInfo = document.getElementById('dateInfo');
    const tempDetails = document.getElementById('tempDetails');
    const windDetails = document.getElementById('windDetails');
    const additionalInfo = document.getElementById('additionalInfo');
  
 
    const displayLoading = () => {
      loadingMessage.classList.remove('hidden');
    };
  
   
    const hideLoading = () => {
      loadingMessage.classList.add('hidden');
    };
  
   
    const fetchWeatherData = async (city) => {
      try {
        displayLoading();
  
     
        errorBox.classList.add('hidden');
        weatherInfo.classList.add('hidden');
        weatherCondition.classList.add('hidden');
        additionalInfo.classList.add('hidden');
        temperature.classList.add('hidden');
        locationInfo.classList.add('hidden');
        dateInfo.classList.add('hidden');
  
      
        const geoResponse = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}`);
        if (!geoResponse.ok) {
          throw new Error('Failed to fetch geolocation data.');
        }
        const geoData = await geoResponse.json();
        if (!geoData.results || geoData.results.length === 0) {
          throw new Error('No matches found. Please check your input and try again.');
        }
  
        const exactMatch = geoData.results.find(result => result.name.toLowerCase() === city.toLowerCase());
        if (!exactMatch) {
          throw new Error('No exact match found. Please provide a valid city name.');
        }
  
        const { latitude, longitude, name, country } = exactMatch;
  
      
        const weatherResponse = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`);
        if (!weatherResponse.ok) {
          throw new Error('Failed to fetch weather data.');
        }
        const weatherData = await weatherResponse.json();
        const { temperature: temp, weathercode, windspeed } = weatherData.current_weather;
  
        cityName.textContent = name;
        countryName.textContent = `, ${country}`;
        temperature.textContent = `${temp}°C`;
        conditionText.textContent = weathercode === 0 ? 'Sunny' : 'Cloudy';
        windDetails.textContent = `${windspeed} m/s`;
  
        const today = new Date();
        const weekday = today.toLocaleString('en-US', { weekday: 'long' });
        const date = today.toLocaleDateString('en-GB');
        currentDate.textContent = `${weekday}, ${date}`;
  
       
        locationInfo.classList.remove('hidden');
        temperature.classList.remove('hidden');
        weatherInfo.classList.remove('hidden');
        weatherCondition.classList.remove('hidden');
        additionalInfo.classList.remove('hidden');
        dateInfo.classList.remove('hidden');
      } catch (error) {
        
        errorBox.textContent = error.message;
        errorBox.classList.remove('hidden');
      } finally {
        hideLoading();
      }
    };
  
    const searchHandler = () => {
      const city = searchInput.value.trim();
      if (!city) {
        errorBox.textContent = "Error: City name cannot be empty.";
        errorBox.classList.remove('hidden');
        return;
      }
      fetchWeatherData(city);
    };
  
    
    searchButton.addEventListener('click', searchHandler);
    searchInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') searchHandler();
    });
  });
  