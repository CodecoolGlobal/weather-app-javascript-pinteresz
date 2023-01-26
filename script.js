
let rootElement = document.getElementById("root");
rootElement.insertAdjacentHTML("beforeend", `<div id="root2"></div>`);
let rootElement2 = document.getElementById("root2");

let cities;
let DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
let favourites = [];
let currentCity;

const loadEvent = function() {

 
 

  // API urls and keys and q parameter
    const citySearch = "http://api.weatherapi.com/v1/search.json?key="; // Weather API's url for city search 
    const cityData = "http://api.weatherapi.com/v1/current.json?key="; // Weather API's url for the chosen city's datas
    const backgroundUrl = "https://api.pexels.com/v1/search?query="  // Pexels API's url for city background img
    const cityApiKey = "eea065bb85d943208ab85913232401&q="; // Weather API key
    const backgroundApiKey = "ZIjVFWMjcK93QIV1E5WGsyMLRRs3Kvmcc3ONvbeasPvzAxGGwOZ9hhZz";  // Pexels API key for city background img

    let qParameter; // Weather API's required q parameter

  // Start of DOM manipulation  
    rootElement.insertAdjacentHTML("beforeend", `<label>Choose a city</label>`)
    rootElement.insertAdjacentHTML("beforeend", `<input id="input" list="datalist">`)
    rootElement.insertAdjacentHTML("beforeend", `<datalist id="datalist">`)
    rootElement.insertAdjacentHTML("beforeend", `<button id="favourites">Add city to favourites</button>`)
    document.getElementById("favourites").style.visibility = "hidden";
    rootElement.insertAdjacentHTML("beforeend", `<div hidden id="spinner"></div>`)

    const spinner = document.getElementById("spinner"); 

  // Display the fetched data in the Browser

      const displayData = (data) =>{
        rootElement2.insertAdjacentHTML('beforeend', `<p id="cityName">${data.location.name.toUpperCase()}</p>`);
        rootElement2.insertAdjacentHTML('beforeend', `<p id="temperature">${data.current["temp_c"]} °C</p>`);
        rootElement2.insertAdjacentHTML('beforeend', `<p id="condition">${data.current.condition.text}</p>`);
        rootElement2.insertAdjacentHTML('beforeend', `<img id="icon" src="${data.current.condition.icon}"></img>`);
        rootElement2.insertAdjacentHTML('beforeend', `<p id="localtime">${data.location.localtime}</p>`);
        rootElement2.insertAdjacentHTML('beforeend', `<p id="windSpeed">${data.current["wind_kph"]} km/h</p>`);
        rootElement2.insertAdjacentHTML('beforeend', `<img id="windPic" src="wind_icon.png"></img>`);
        rootElement2.insertAdjacentHTML('beforeend', `<p id="day">${DAYS[addWeekday(data.location.localtime.slice(0, 10))]}</p>`);
      }

  // Loading time spinner
  function loadSpinner() {
    spinner.removeAttribute('hidden');
    fetch('https://www.mocky.io/v2/5185415ba171ea3a00704eed?mocky-delay=2000ms')
      .then(response => response.json())
      .then(data => {
        spinner.setAttribute('hidden', '');
        console.log(data)
      });
  }


  // Get the actual day of the week
  let addWeekday = (str) =>{
    const actualDate = new Date(str);
    const actualDay = actualDate.getDay();
    return actualDay;
  }
      
  // Fetching data for the background picture of chosen city - for css
      const fetchBackgroundPicture = (city) =>{
        try{
          fetch(`${backgroundUrl}${city}`, {headers: {
            Authorization: backgroundApiKey
          }})
          .then(response=>response.json())
          .then(data=>{   
            (data.photos.length > 0) ?    
            rootElement.style.backgroundImage = `url("${data.photos[0].src.large}")`
             : rootElement.style.backgroundImage = `url("forecast_medium_size.jpg")`;
          })
        }catch(error){
          console.log(error)
        }
      }

  // Fetching data for the chosen city
      const fetchCityData = (city) =>{
        try{
          fetch(`${cityData}${cityApiKey}${city}`)
          .then(response=>response.json())
          .then(data=>{           
            console.log(data);
            setTimeout(displayData, 2000, data);
          })
        }catch(error){
          console.log(error)
        }
      }
  
   // Fetching city names for options to choose form   
      const fetchWeatherData = () =>{
         try{
          fetch(`${citySearch}${cityApiKey}${qParameter}`)
          .then(response=>response.json())
          .then(data=>{           
            cities = JSON.parse(JSON.stringify(data));
            cities.forEach(city => {
              document.getElementById("datalist").insertAdjacentHTML("beforeend", optionElement(city))
                });
            })
          }catch(error){
            console.log(error)
          }
      }

   // DOM: city option elements  
      let optionElement = function (city){
        return `<option id="${city.name}" value="${city.name}">`
      }
      

  // Input field autocomplete feature
       document.getElementById("input").addEventListener('keyup', (e) => {
        for (let i = 97; i <= 122; i++){
          if(document.getElementById("input").value.length >= 3 && e.key.charCodeAt(0) === i ){
            document.querySelectorAll('option').forEach(option => option.remove())
            qParameter = document.getElementById("input").value
            fetchWeatherData()
         }
        }
      })
      
  // Fetch the weather data and load it to the HTML, favourites button visible, put favourites as options in the datalist 
      document.getElementById("input").addEventListener('change', (e) => {
        if (favourites.includes(e.target.value)){
          rootElement2.textContent = "";
            loadSpinner();
            fetchCityData(e.target.value);
            fetchBackgroundPicture(e.target.value);
            currentCity = e.target.value;
            document.getElementById("favourites").style.visibility = "visible";
        } else {
        for(let city of cities){
          if(city.name === e.target.value){
            rootElement2.textContent = "";
            loadSpinner();
            fetchCityData(city.name);
            fetchBackgroundPicture(city.name);
            currentCity = city.name;
            document.getElementById("favourites").style.visibility = "visible";
          }
        }  
      }    
        if (document.getElementById("input").value.length === 0 && favourites.length !== 0){
          favourites.forEach(element => {
            document.getElementById("datalist").insertAdjacentHTML("beforeend", `<option id="${element}" value="${element}">`)
          });
        }
      });
        
  // Delete option elements from the datalist if there are lesser then 3 characters in the input field    
      addEventListener('keyup', function(event) {
        const key = event.key;
          if ((key === "Backspace" || key === "Delete") && document.getElementById("input").value.length < 3) {
            document.querySelectorAll('option').forEach(option => option.remove())
          }
      });  

  // Add actual city to favourites if button is pressed
    document.getElementById("favourites").addEventListener('click', () => {
      if(!favourites.includes(currentCity)){
      favourites.push(currentCity);
      console.log(favourites);
      }
    })

}


window.addEventListener("load", loadEvent);