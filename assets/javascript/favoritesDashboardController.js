/*
 * HTML Controller (i.e. renderring functionality)
 * ====================================================================================================
 */
let favoritePlaces = []; // array of objects for all the favorite cities

/*
 * Renderring weather data for now while waiting on Kelsie
 * ====================================================================================================
 */
function weatherWeeklyRender() {
    $(`#weatherDataWeek`).empty();
    let newDay;

    // need to get todays date from moments
    newDay = $(`<div data-key="65" data-day="Monday" class="key weatherDay">`).append(
        $(`<kbd>`).text("Monday"),
        $(`<div class="sound" class="temperature">65</div>`),
        $(`<span>`).attr("class", "value"),
        $(`<span>`).attr("id", "switch"),
        $(`<canvas width="54px" height="54px" id="icon"></canvas>`),
        $(`<div class="sound" class="mood">Snow</div>`)
    );
    $(`#weatherDataWeek`).append(newDay);
    newDay = $(`<div data-key="66" data-day="Tuesday" class="key weatherDay">`).append(
        $(`<kbd>`).text("Tuesday"),
        $(`<div class="sound" class="temperature">66</div>`),
        $(`<span>`).attr("class", "value"),
        $(`<span>`).attr("id", "switch"),
        $(`<canvas width="54px" height="54px" id="icon"></canvas>`),
        $(`<div class="sound" class="mood">Snow</div>`)
    );
    $(`#weatherDataWeek`).append(newDay);

}

function selectedDaysWeatherRender(dayWeatherObject) {
    $("#selectedDay").text(dayWeatherObject.day);

    $(`#weatherDataDay`).empty();
    let newRow;

    newRow = $(`<tr data-day="${dayWeatherObject.day}">`).append(
        $("<td>").text(`${dayWeatherObject.currentTemp}`),
        $("<td>").text(`${dayWeatherObject.lowTemp}`),
        $("<td>").text(`${dayWeatherObject.highTemp}`),
        $("<td>").text(`${dayWeatherObject.humidity}`),
        $("<td>").text(`${dayWeatherObject.wind}`),
        $("<td>").text(`${dayWeatherObject.clouds}`)
    );
    $(`#weatherDataDay`).append(newRow);

}

// render the HTML from the the array into the table
function favoritesDropdwnRender(favorites) {

    $("#favorites-dropdown").empty();
    let newRow;

    for (let i in favorites) {
        let favoritePlace = favorites[i];
        newRow = $(`<li class="dropdown-item" id="${favoritePlace.key}" data-key="${favoritePlace.key}" data-index="${i}">${favoritePlace.name}</li>`);

        // Append the new row to the table
        $("#favorites-dropdown").append(newRow);
    }
}

function currentFavoriteHandler(key) {
    favoriteGet(key, function (favoriteFB) {
        console.log(favoriteFB);

        // do not try to do anything if it wasnt found
        if (favoriteFB.name != undefined) {
            // render the name in the text field so you know
            $("#dataPull").val(favoriteFB.name);

            // get lat long from Justins API
            // hardcode for now
            let geoLocation = {};
            geoLocation.lat = 33.787549;
            geoLocation.long = -84.314085;

            // geoLocation = getLatLong(favoriteFB.city);

            // Call weatherAPI with lat long
            getWeather(geoLocation.lat, geoLocation.long);

            // Call places api
            // getPlaceInfo(favoriteFB);
        }

    });
}

// Wait for doc to be ready
$(document).ready(function () {

    // Select a row/favorite 
    $(document.body).on("click", "#favorites-dropdown li", function () {

        var key = $(this).attr("data-key");

        // save it for next time
        saveKeyToLocalStorage(key);

        // run the function that calls the DB and handles the result
        currentFavoriteHandler(key);
    });

    // Select a day 
    $(document.body).on("click", ".weatherDay", function () {

        var key = $(this).attr("data-key");
        var day = $(this).attr("data-day");

        let selectedDayWeather = {};
        selectedDayWeather.day = day;
        selectedDayWeather.currentTemp = 65.5;
        selectedDayWeather.lowTemp = 32;
        selectedDayWeather.highTemp = 71;
        selectedDayWeather.humidity = "35%";
        selectedDayWeather.wind = "8mph";
        selectedDayWeather.clouds = "Partly Cloudy";

        selectedDaysWeatherRender(selectedDayWeather);

    });


    // MAIN Start
    // Populate this list of favorite places in the database
    favoritesGetByName(function (favs) {
        favoritePlaces = favs; // copy the array into the global var for this context
        // render fav list
        favoritesDropdwnRender(favoritePlaces);

        // check to see if there is a value in local storage
        key = getKeyFromLocalStorage();

        if (key != undefined) {
            currentFavoriteHandler(key);
        } else {
            // if there are any favorites, populate the first on
            if (favoritePlaces.length > 0) {
                currentFavoriteHandler(favoritePlaces[0].key);
            }
        }
    });

    // Render top weather data
    weatherWeeklyRender();

}); // (document).ready