import {capitals} from '/data.js';

let rootElement = document.getElementById("root");

let cities;


const loadEvent = function() {

    const url = "http://api.weatherapi.com/v1/search.json?key=";
    const url2 = "http://api.weatherapi.com/v1/current.json?key=";
    const apiKey = "eea065bb85d943208ab85913232401&q=";
    let qParameter

    rootElement.insertAdjacentHTML("beforeend", `<label>Choose a city</label>`)
    rootElement.insertAdjacentHTML("beforeend", `<input id="input" list="datalist">`)
    rootElement.insertAdjacentHTML("beforeend", `<datalist id="datalist">`)

      const fetchCityData = (city) =>{
        try{
          fetch(`${url2}${apiKey}${city}`)
          .then(response=>response.json())
          .then(data=>{           
            console.log(data);
          })
        }catch(error){
          console.log(error)
        }
      }
  
      const fetchWeatherData = () =>{
          try{
            fetch(`${url}${apiKey}${qParameter}`)
            .then(response=>response.json())
            .then(data=>{           
              cities = JSON.parse(JSON.stringify(data));
              console.log(cities);
              cities.forEach(city => {
                document.getElementById("datalist").insertAdjacentHTML("beforeend", optionElement(city))
                });
            })
          }catch(error){
            console.log(error)
          }
      }

      
      let optionElement = function (city){
          return `<option id="${city.name}" value="${city.name}">`
      }
      


        document.getElementById("input").addEventListener('keyup', (e) => {
          console.log(e.key.charCodeAt(0));
          for (let i = 97; i <= 122; i++){
            if(document.getElementById("input").value.length >= 3 && e.key.charCodeAt(0) === i ){
              document.querySelectorAll('option').forEach(option => option.remove())
              qParameter = document.getElementById("input").value
              fetchWeatherData()
            }
        }
      })
      
      
      document.getElementById("input").addEventListener('change', (e) => {
        console.log("asd");
          for(let city of cities){
            if(city.name === e.target.value){
              console.log(city);
              fetchCityData(city.name);
              document.querySelectorAll('option').forEach(option => option.remove())
            }
          }
          
        });
        
        
        addEventListener('keyup', function(event) {
        const key = event.key;
          if ((key === "Backspace" || key === "Delete") && document.getElementById("input").value.length < 3) {
            document.querySelectorAll('option').forEach(option => option.remove())
          }
        });  

    
}


window.addEventListener("load", loadEvent);