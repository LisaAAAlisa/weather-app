// api key 53e2dc180d74909b3053da110929b86a
// api url api.openweathermap.org/data/2.5/weather?q={city name}&appid=53e2dc180d74909b3053da110929b86a;

$("#input-city").on("keyup", function(event) {
if (event.keyCode === 13) {
    event.preventDefault();
    document.getElementById("btn-search").click();
}
});


$("#btn-search").on("click", function (event) {
    // Preventing the button from trying to submit the form
    event.preventDefault();
    // Storing the artist name
    var inputCity = $("#input-city").val().trim();


    console.log(inputCity);
    var query1day = "http://api.openweathermap.org/data/2.5/weather?q=" + inputCity + "&appid=53e2dc180d74909b3053da110929b86a&units=imperial";

    var currentLat = 0;
    var currentLon = 0;

    var currentCity = document.getElementById("currentCity");
    var currentTemp = document.getElementById("currentTemp");
    var currentHum = document.getElementById("currentHumidity");
    var currentWind = document.getElementById("currentWindSpeed");
    var currentUV = document.getElementById("currentUVIndex");

    console.log(query1day);
    $.ajax({
        url: query1day,
        method: "GET"
    }).then(function (response) {

        // Printing the entire object to console
        console.log(response);
        var cityWeather = response;
        var now = new Date();
        var day = ("0" + now.getDate()).slice(-2);
        var month = ("0" + (now.getMonth() + 1)).slice(-2);
        var today =  (month) + "/" + (day) +"/" + now.getFullYear();
        currentCity.textContent = cityWeather.name + " ("+today+")"; 
        // var weather = cityWeather.weather[0].main;
        // if (weather === "clouds") {
        //     <i class="fas fa-cloud"></i>
        // }


        // console.log(cityWeather.weather[0].main);

        currentLat = cityWeather.coord.lat;
        currentLon = cityWeather.coord.lon;
    });

    var query5day = "https://api.openweathermap.org/data/2.5/onecall?lat="+currentLat+"&lon="+currentLon+"&units=imperial&exclude=hourly,minutely,alerts&appid=53e2dc180d74909b3053da110929b86a";

    $.ajax({
        url: query5day,
        method: "GET"
    }).then(function (response) {
        var cityWeather = response;
        currentTemp.textContent = "Temperature: " + cityWeather.current.temp.toFixed(1) + " \xB0F";
        currentHum.textContent = "Humidity: " + cityWeather.current.humidity + "%";
        currentWind.textContent = "Wind Speed: " + cityWeather.current.wind_speed + " mph";
        currentUV.textContent = "UV Index: " + cityWeather.current.uvi;
        console.log(cityWeather.daily[0].dt);
        for (i=0; i <5; i++) {
            tempDate= cityWeather.daily[i].dt;
        }
        // var tom= cityWeather.daily[1].dt;
        // var tempDate = new Date(tom*1000);
        // var day2= cityWeather.daily[2].dt;
        // var tempDate2 = new Date(day2*1000);
        // var day3= cityWeather.daily[3].dt;
        // var tempDate3 = new Date(day3*1000);
        // var day4= cityWeather.daily[4].dt;
        // var tempDate4 = new Date(day4*1000);
        // var day5= cityWeather.daily[5].dt;
        // var tempDate5 = new Date(day5*1000);

        console.log(tempDate);
        var day = ("0" + tempDate.getDate()).slice(-2);
        var month = ("0" + (tempDate.getMonth() + 1)).slice(-2);
        var tomorrow =  (month) + "/" + (day) +"/" + tempDate.getFullYear();
        console.log(tomorrow);



    });
});


