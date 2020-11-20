// this function is for the search button
$("#input-city").on("keyup", function (event) {
    if (event.keyCode === 13) {
        event.preventDefault();
        document.getElementById("btn-search").click();
    }
});
// trying to get the form to clear input after submitting
//      function submitForm() {
//     var frm = document.getElementsByName("#input-city")[0];
//     frm.submit(); // Submit
//     frm.reset();  // Reset
//     return false; // Prevent page refresh
// }
//this function stores city input and generates weather 
$("#city-list").on("click", function (event) {
    event.preventDefault();
    var city = event.target.innerHTML;
    getCityWeather(city);

});

$("#btn-search").on("click", function (event) {
    // Preventing the button from trying to submit the form
    event.preventDefault();
//all user input to lowercase
    var inputCity = $("#input-city").val().trim().toLowerCase();
//validating city input
    if (inputCity === "") {
        alert("Must enter city!");
        //storing input in local storage
    } else {

        var cityList = localStorage.getItem("cityList");
        var cities;

        if (cityList != "") {
            cities = JSON.parse(localStorage.getItem("cityList"));
        }
        console.log(cityList);

        // Create an array to store cities in.
        var citiesAry = [];
        for (key in cities) {
            citiesAry.push(cities[key]);
        }
        console.log(citiesAry);
        // Remove the city in the array if it exists.
        for (i = 0; i < citiesAry.length; i++) {
            if (inputCity === citiesAry[i]) {
                citiesAry.splice(i, 1);
            }
        }
        console.log(citiesAry);
        // Add the city to the beginning of the array.
        citiesAry.unshift(inputCity);
        console.log(citiesAry);
        // <li class="list-group-item">Houston</li>

        $("#city-list").empty();

        // Gets around formatting issue. Without this it'll leave a white bar
        // along the bottom of the search bar if there are no cities.
        $("#city-section").attr("class", "card");

        // Create a card item for each city via the DOM.
        for (i = 0; i < citiesAry.length; i++) {

            var $cityListItem = $("<li class='list-group-item'>");
            $cityListItem.append(citiesAry[i]);

            $("#city-list").append($cityListItem);
        }

        // Add each city in the array to a JSON object and then store it.
        var citiesJson = {};

        for (i = 0; i < citiesAry.length; i++) {
            citiesJson[i] = citiesAry[i];
        }

        console.log(citiesJson);

        localStorage.setItem("cityList", JSON.stringify(citiesJson));
        // localStorage.setItem("cityList", "");  //-- ZERO OUT FOR THE LIST
        getCityWeather(inputCity);
    }

});

//function for date
function formatDate(millis) {
    var now = new Date(millis);
    var day = ("0" + now.getDate()).slice(-2);
    var month = ("0" + (now.getMonth() + 1)).slice(-2);
    var formattedDate = (month) + "/" + (day) + "/" + now.getFullYear();
    return (formattedDate);
}
//function to get data for current city
function getCityWeather(inputCity) {
    //setting up the request API with parameters and key
    var query1day = "http://api.openweathermap.org/data/2.5/weather?q=" + inputCity + "&appid=f4905c76bda3444b817ac1595d84c3fc&units=imperial";
    //setting the latitude and longitude values to 0 
    var currentLat = 0;
    var currentLon = 0;
    //pulling the variables from the html
    var currentCity = document.getElementById("currentCity");
    var currentTemp = document.getElementById("currentTemp");
    var currentHum = document.getElementById("currentHumidity");
    var currentWind = document.getElementById("currentWindSpeed");
    var currentUV = document.getElementById("currentUVIndex");

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
        console.log(cityWeather);
        var weather = cityWeather.weather[0].main;
        var weatherIcon;

        if (weather === "Clear") {
            weatherIcon = "<span class='fa fa-sun-o'></span></i> ";
        }
        if (weather === "Clouds") {
            weatherIcon = "<span class='fa fa-cloud'></span>";
        }
        if (weather === "Rain") {
            weatherIcon = "<span class='fa fa-bolt'></span>";
        }
        currentCity.innerHTML = cityWeather.name + " (" + today + ")" + weatherIcon;

        // setting up the lat and long to be used in the api request below
        currentLat = cityWeather.coord.lat;
        currentLon = cityWeather.coord.lon;
        console.log(currentLat);
        console.log(currentLon);
        //api request to pull data based on lat and long
        var query5day = "https://api.openweathermap.org/data/2.5/onecall?lat=" + currentLat + "&lon=" + currentLon + "&units=imperial&exclude=hourly,minutely,alerts&appid=f4905c76bda3444b817ac1595d84c3fc";
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
            // currentUV.textContent = "UV Index: " + cityWeather.current.uvi.toFixed(1);
            var uvIndex = cityWeather.current.uvi.toFixed(1);
            currentUV.innerHTML = "&nbsp" + uvIndex + "&nbsp";
            if (uvIndex < 3) { currentUV.style.backgroundColor = "#98f58e"; }
            if (uvIndex >= 2 && uvIndex < 6) { currentUV.style.backgroundColor = "#ffc56e"; }
            if (uvIndex >= 6) {
                currentUV.style.backgroundColor = "#ff4942";
                currentUV.style.color = "white";
            }

            $("#forecast-cards").empty();


            //for loop to poutput dates in the 5-day forecast starting with "tomorrow"
            for (i = 1; i < 6; i++) {
                var $forecastCol = $("<div class='col-sm'>");
                var $forecastCard = $("<div class='card forecast'>");
                $forecastCard.append("<span><strong>" + formatDate(cityWeather.daily[i].dt * 1000) + "</strong></span>");
                $forecastCard.append("<span><strong>Temp:</strong> " + cityWeather.daily[i].temp.day.toFixed(1) + " \xB0F</span");
                $forecastCard.append("<span><strong>Humidity:</strong> " + cityWeather.daily[i].humidity.toFixed(0) + " %</span>");
                $forecastCol.append($forecastCard);
                $("#forecast-cards").append($forecastCol);
            }
        }); // ajax2
    }); // ajax1
}; // getCityWeather

$(function () {

    var cityList = localStorage.getItem("cityList");
    var cities;

    console.log(cityList);

    if (cityList != "") {
        cities = JSON.parse(localStorage.getItem("cityList"));

        // Create an array to store cities in.
        var citiesAry = [];
        for (key in cities) {
            citiesAry.push(cities[key]);
        }
        // <li class="list-group-item">Houston</li>
        $("#city-list").empty();

        // Gets around formatting issue. Without this it'll leave a white bar
        // along the bottom of the search bar if there are no cities.
        $("#city-section").attr("class", "card");

        // Create a card item for each city via the DOM.
        for (i = 0; i < citiesAry.length; i++) {

            var $cityListItem = $("<li class='list-group-item'>");
            $cityListItem.append(citiesAry[i]);

            $("#city-list").append($cityListItem);
        }

        // Add each city in the array to a JSON object and then store it.
        var citiesJson = {};

        for (i = 0; i < citiesAry.length; i++) {
            citiesJson[i] = citiesAry[i];
        }

        getCityWeather(citiesAry[0]);
        console.log(citiesAry[0]);
    }

});



