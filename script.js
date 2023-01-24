import {capitals} from '/data.js';

console.log(capitals[0]);  

const loadEvent = function() {

    const url = "http://api.weatherapi.com/v1/current.json?key=";
    const apiKey = "eea065bb85d943208ab85913232401&q=";
    let qParameter = capitals[1].city;

   const fetchWeatherData = () =>{
        try{
          fetch(`${url}${apiKey}${qParameter}`)
          .then(response=>response.json())
          .then(data=>{
            console.log(data)
        // displayData(data)
          })
        }catch(error){
          console.log(error)
        }
      }

     
      fetchWeatherData()

}


window.addEventListener("load", loadEvent);