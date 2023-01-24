import {capitals} from '/data.js';

console.log(capitals[0]);  

let rootElement = document.getElementById("root");

let cities;
let optionsHistory = []

const loadEvent = function() {

    const url = "http://api.weatherapi.com/v1/search.json?key=";
    const apiKey = "eea065bb85d943208ab85913232401&q=";
    let qParameter

    rootElement.insertAdjacentHTML("beforeend", `<label>Choose a capital</label>`)
    rootElement.insertAdjacentHTML("beforeend", `<input id="input" list="datalist">`)
    rootElement.insertAdjacentHTML("beforeend", `<datalist id="datalist">`)

     
  
      const fetchWeatherData = () =>{
          try{
            fetch(`${url}${apiKey}${qParameter}`)
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

      
      let optionElement = function (city){
        //  if(!optionsHistory.includes(city.name)){
        //    optionsHistory.push(city.name)
           console.log(optionsHistory);
          return `<option id="${city.name}" value="${city.name}">`
        //  }
      }
      


        document.getElementById("input").addEventListener('keyup', () => {
        if(document.getElementById("input").value.length >= 3){
          qParameter = document.getElementById("input").value
          fetchWeatherData()
        }
      })
      
      
      document.getElementById("input").addEventListener('change', (e) => {
        console.log("asd");
          for(let city of cities){
            if(city.name === e.target.value){
              console.log(city);
            }
          }
          
          document.querySelectorAll('option').forEach(option => option.remove())
        });
        
        
        addEventListener('keydown', function(event) {
        const key = event.key;
          if (key === "Backspace" || key === "Delete") {
            document.querySelectorAll('option').forEach(option => option.remove())
          }
        });  

    
}


window.addEventListener("load", loadEvent);