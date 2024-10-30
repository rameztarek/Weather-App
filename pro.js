const cityInput = document.querySelector('.city-input')
const weatherInfoSection = document.querySelector('.weather-info')
const searchBtn = document.querySelector('.search-btn')
const changeDegreeBtn = document.querySelector('.change-degree-btn')
const searchCitySection = document.querySelector('.search-city')
const notFoundSection = document.querySelector('.not-found')
const countryTxt= document.querySelector('.country-txt')
const tempTxt = document.querySelector('.temp-txt')
const tempTxtF = document.querySelector('.temp-txt-F')
const conditionTxt = document.querySelector('.condition-txt')
const humidityValueTxt = document.querySelector('.humidity-value-txt')
const windValueTxt = document.querySelector('.wind-value-txt')
const weatherSummaryImg = document.querySelector('.weather-summary-img')
const currentDataTxt = document.querySelector('.current-data-txt')
const forecastItemsContainer = document.querySelector('.forecast-items-container')

const apiKey = '290f9cd1effbafa9cfcef871e1d534c5'

searchBtn.addEventListener('click' , () => {
  if (cityInput.value.trim() != '') {
    updateWeatherInfo(cityInput.value)
    cityInput.value = ''
    cityInput.blur()
  }
})

cityInput.addEventListener('keydown', (event) => {
  if (event.key == 'Enter' && cityInput.value.trim() != '') {
    updateWeatherInfo(cityInput.value)
    cityInput.value = ''
    cityInput.blur()
  }
})

async function getFetchData(endPoint, city) {
  const apiUrl = `https://api.openweathermap.org/data/2.5/${endPoint}?q=${city}&appid=${apiKey}&units=metric`
  
    const response = await fetch (apiUrl)


    return await response.json()
}

function getWeatherIcon(id) {
  if (id <= 232) return 'thunderstorm.svg'
  if (id <= 321) return 'drizzle.svg'
  if (id <= 531) return 'rain.svg'
  if (id <= 622) return 'snow.svg'
  if (id <= 781) return 'atmosphere.svg'
  if (id <= 800) return 'clear.svg'
  else return 'clouds.svg'  
}

function getCurrenDate() {
  const currenDate = new Date()
  const options = {
    weekend: 'short',
    day: '2-digit',
    month: 'short',
  }
  return currenDate.toLocaleDateString('en-GB', options)
}

async function updateWeatherInfo(city) {
    const weatherData = await getFetchData('weather', city)

    if (weatherData.cod != 200) {
      showDisplaySelection(notFoundSection)
      return
    }
    
    const {
      name: country,
      main: { temp, humidity },
      weather: [{ id, main }],
      wind: { speed }
    } = weatherData
    
    countryTxt.textContent = country;
    tempTxt.textContent = Math.round(temp) + '°C';
    tempTxtF.textContent = Math.round(temp * 1.8 + 32) + '°F';
    conditionTxt.textContent = main;
    humidityValueTxt.textContent = humidity + '%';
    windValueTxt.textContent = speed + 'M/s';
    weatherSummaryImg.src = `assets/assets/weather/${getWeatherIcon(id)}`;
    currentDataTxt.textContent = getCurrenDate(city);

    showDisplaySelection(weatherInfoSection);
    await updataForecastsInfo(city)
  }
  async function updataForecastsInfo(city) {
    const forecastsData = await getFetchData('forecast', city)
    const timeTaken = '12:00:00'
    const todayDate = new Date().toISOString().split("T")[0]

    forecastItemsContainer.innerHTML=''
    forecastsData.list.forEach(forecastWeather => {
      if (forecastWeather.dt_txt.includes(timeTaken) &&
        !forecastWeather.dt_txt.includes(todayDate)) {
        updataForecastsItems(forecastWeather)
      }
    })
  }
  function updataForecastsItems(weatherData) {
    console.log(weatherData)
    const {
      dt_txt: date ,
      weather: [{ id }] ,
      main : { temp }
    } = weatherData
    
      const dateTaken = new Date(date)
      const dateOptions = {
        day: '2-digit',
        month: 'short',
      }
    const dateResult = dateTaken.toLocaleDateString('en-GB', dateOptions)
    const forecastItem =`
        <div class="forecast-item">
          <h5 class="forecast-item-data">${dateResult}</h5>
          <img src="assets/assets/weather/${getWeatherIcon(id)}" class="forecast-item-img">
          <h5 class="forecast-item-temp">${Math.round(temp)}°C</h5>
        </div>
    `
     forecastItemsContainer.insertAdjacentHTML(`beforeend` , forecastItem)
  }


changeDegreeBtn.addEventListener('click', () => {
  if (tempTxtF.style.display === 'none') {
    tempTxtF.style.display = 'block';
    tempTxt.style.display = 'none';
    changeDegreeBtn.innerHTML = '°C'
  } else {
    tempTxtF.style.display = 'none';
    tempTxt.style.display = 'block';
    changeDegreeBtn.innerHTML = '°F'
  }
});

function showDisplaySelection(section) {
  [weatherInfoSection, searchCitySection, notFoundSection]
  .forEach(section => section.style.display = 'none')
  section.style.display = 'flex'
}



