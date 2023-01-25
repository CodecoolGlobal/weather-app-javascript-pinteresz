
let rootElement = document.getElementById("root");
rootElement.insertAdjacentHTML("beforeend", `<div id="root2"></div>`);
let rootElement2 = document.getElementById("root2");

let cities;
let DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];


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

      const displayData = (data) =>{
        rootElement2.insertAdjacentHTML('beforeend', `<p id="cityName">${data.location.name}</p>`);
        rootElement2.insertAdjacentHTML('beforeend', `<p id="temperature">${data.current["temp_c"]} °C</p>`);
        rootElement2.insertAdjacentHTML('beforeend', `<p id="condition">${data.current.condition.text}</p>`);
        rootElement2.insertAdjacentHTML('beforeend', `<img id="icon" src="${data.current.condition.icon}"></img>`);
        rootElement2.insertAdjacentHTML('beforeend', `<p id="localtime">${data.location.localtime}</p>`);
        rootElement2.insertAdjacentHTML('beforeend', `<p id="windSpeed">${data.current["wind_kph"]}</p>`);
        rootElement2.insertAdjacentHTML('beforeend', `<p id="day">${DAYS[addWeekday(data.location.localtime.slice(0, 10))]}</p>`);

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
            Authorization: "ZIjVFWMjcK93QIV1E5WGsyMLRRs3Kvmcc3ONvbeasPvzAxGGwOZ9hhZz"
          }})
          .then(response=>response.json())
          .then(data=>{   
            if (data.photos.length > 0){    
            rootElement.style.backgroundImage = `url("${data.photos[0].src.portrait}")`;
            } else {rootElement.style.backgroundImage = `url("forecast_medium_size.jpg")`;}
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
            displayData(data);
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
      

  //
       document.getElementById("input").addEventListener('keyup', (e) => {
        for (let i = 97; i <= 122; i++){
          if(document.getElementById("input").value.length >= 3 && e.key.charCodeAt(0) === i ){
            document.querySelectorAll('option').forEach(option => option.remove())
            qParameter = document.getElementById("input").value
            fetchWeatherData()
         }
        }
      })
      
  //   
      document.getElementById("input").addEventListener('change', (e) => {
          for(let city of cities){
            if(city.name === e.target.value){
              rootElement2.textContent = "";
              fetchCityData(city.name);
              fetchBackgroundPicture(city.name);
              document.querySelectorAll('option').forEach(option => option.remove())
            }
          }      
      });
        
  //     
      addEventListener('keyup', function(event) {
        const key = event.key;
          if ((key === "Backspace" || key === "Delete") && document.getElementById("input").value.length < 3) {
            document.querySelectorAll('option').forEach(option => option.remove())
          }
      });  

    
}


window.addEventListener("load", loadEvent);