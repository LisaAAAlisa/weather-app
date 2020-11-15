// api key 53e2dc180d74909b3053da110929b86a
// api url api.openweathermap.org/data/2.5/weather?q={city name}&appid=53e2dc180d74909b3053da110929b86a;

$("#input-city").on("keyup", function (event) {
    if (event.keyCode === 13) {
        event.preventDefault();
        document.getElementById("btn-search").click();
    }
});
//THE EVENT LISTENER THAT DOESN'T WORK!!
// var cityList = document.getElementById("list-group-item");
// cityList.addEventListener('click', function (event) {
//     event.preventDefault();
//        console.log(event);
// });

$("#btn-search").on("click", function (event) {
    // Preventing the button from trying to submit the form
    event.preventDefault();
    // Storing the input city
    var inputCity = $("#input-city").val().trim();
    //setting up the request api with parameters and key

    
    var query1day = "http://api.openweathermap.org/data/2.5/weather?q=" + inputCity + "&appid=53e2dc180d74909b3053da110929b86a&units=imperial";
    //setting the latitude and longitude values to 0 
    var currentLat = 0;
    var currentLon = 0;
    //pulling the variables from the html
    var currentCity = document.getElementById("currentCity");
    var currentTemp = document.getElementById("currentTemp");
    var currentHum = document.getElementById("currentHumidity");
    var currentWind = document.getElementById("currentWindSpeed");
    var currentUV = document.getElementById("currentUVIndex");
    var day1temp = document.getElementById("todayTemp");
    var day2temp = document.getElementById("todayPlusOneTemp");
    var day3temp = document.getElementById("todayPlusTwoTemp")
    var day4temp = document.getElementById("todayPlusThreeTemp");
    var day5temp = document.getElementById("todayPlusFourTemp");
    var day1hum = document.getElementById("todayHumidity");
    var day2hum = document.getElementById("todayPlusOneHumidity");
    var day3hum = document.getElementById("todayPlusTwoHumidity");
    var day4hum = document.getElementById("todayPlusThreeHumidity");
    var day5hum = document.getElementById("todayPlusFourHumidity");


    //setting the ajax request to get the data from api
    $.ajax({
        url: query1day,
        method: "GET"
    }).then(function (response) {

        //setting up the date to display next to city name
        console.log(response);
        var cityWeather = response;
        var now = new Date();
        var day = ("0" + now.getDate()).slice(-2);
        var month = ("0" + (now.getMonth() + 1)).slice(-2);
        var today = (month) + "/" + (day) + "/" + now.getFullYear();
        currentCity.textContent = cityWeather.name + " (" + today + ")";
        // var weather = cityWeather.weather[0].main;
        // if (weather === "clouds") {
        //     <i class="fas fa-cloud"></i>
        // }
        // setting up the lat and long to be used in the api request below
        currentLat = cityWeather.coord.lat;
        currentLon = cityWeather.coord.lon;
    });
    //api request to pull data based on lat and long
    var query5day = "https://api.openweathermap.org/data/2.5/onecall?lat=" + currentLat + "&lon=" + currentLon + "&units=imperial&exclude=hourly,minutely,alerts&appid=53e2dc180d74909b3053da110929b86a";
    //ajax request to the api
    $.ajax({
        url: query5day,
        method: "GET"
        //function to get response and logging the output into html
    }).then(function (response) {
        var cityWeather = response;
        currentTemp.textContent = "Temperature: " + cityWeather.current.temp.toFixed(1) + " \xB0F";
        currentHum.textContent = "Humidity: " + cityWeather.current.humidity + "%";
        currentWind.textContent = "Wind Speed: " + cityWeather.current.wind_speed.toFixed(1) + " mph";
        currentUV.textContent = "UV Index: " + cityWeather.current.uvi.toFixed(1);
        console.log(cityWeather.daily[0].dt);
        for (i = 0; i <= 5; i++) {
            tempsForDates = cityWeather.daily[i].dt;
            var tempDate = new Date(tempsForDates * 1000);
            console.log(tempDate);
            var day = ("0" + tempDate.getDate()).slice(-2);
            var month = ("0" + (tempDate.getMonth() + 1)).slice(-2);
            var tempsForDates = (month) + "/" + (day) + "/" + tempDate.getFullYear();
        }
        day1temp.textContent = "Temperature: " + cityWeather.daily[0].temp.day.toFixed(1) + " \xB0F"; 
        day2temp.textContent = "Temperature: " + cityWeather.daily[1].temp.day.toFixed(1) + " \xB0F"; 
        day3temp.textContent = "Temperature: " + cityWeather.daily[2].temp.day.toFixed(1) + " \xB0F"; 
        day4temp.textContent = "Temperature: " + cityWeather.daily[3].temp.day.toFixed(1) + " \xB0F"; 
        day5temp.textContent = "Temperature: " + cityWeather.daily[4].temp.day.toFixed(1) + " \xB0F"; 
        day1hum.textContent = " Humidity: " + cityWeather.daily[0].humidity.toFixed(1) + " %";
        day2hum.textContent = " Humidity: " + cityWeather.daily[1].humidity.toFixed(1) + " %";
        day3hum.textContent = " Humidity: " + cityWeather.daily[2].humidity.toFixed(1) + " %";
        day4hum.textContent = " Humidity: " + cityWeather.daily[3].humidity.toFixed(1) + " %";
        day5hum.textContent = " Humidity: " + cityWeather.daily[4].humidity.toFixed(1) + " %";
    });
});


