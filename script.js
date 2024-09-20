// let docTitle = document.title;
// window.addEventListener("blur", ()=> {
//     document.title = "Come Back!"
// })
// window.addEventListener("focus", ()=>{
//     document.title = docTitle;
// })


// // YOUR LOCATION
// function getLocation(){
//     if(navigator.geolocation){
//         navigator.geolocation.getCurrentPosition(showPosition)
//     }else{
//         console.log('Unable to locate')
//     }
// }

// function showPosition(position){
//     let lat = position.coords.latitude;
//     let lon = position.coords.longitude;
//     console.log(lat);
//     console.log(lon);
// }


const userTab = document.querySelector("[data-userWeather]")
const searchTab = document.querySelector("[data-searchWeather]")
const userContainer = document.querySelector(".weather-container")
const grantLocation = document.querySelector(".grant-location")
const searchForm = document.querySelector("[data-searchForm]")
const loadingScreen = document.querySelector(".loading-container")
const weatherInfo = document.getElementById("weather-info")
const API_key = 'd1845658f92b31c64bd94f06f7188c9c';
getfromSessionStorage();


let currentTab = userTab;
currentTab.classList.add("current-tab")

// search form
function switchTab(clickedTab){
 if(clickedTab != currentTab){
    currentTab.classList.remove("current-tab");
    currentTab = clickedTab;
    currentTab.classList.add("current-tab");

    // if search form container is not visible, then make it visible
    if(!searchForm.classList.contains("active")){
        weatherInfo.classList.remove("active");
        grantLocation.classList.remove("active");
        searchForm.classList.add("active");
    }
    else{
        searchForm.classList.remove("active");
        weatherInfo.classList.remove("active");

        // now i'm in You Weather tab, so have to display the weather too so lets check local storage for coordinates
        getfromSessionStorage();
    }

 }   
}
userTab.addEventListener("click", ()=> {
    // pass clicked tab as input parameter
    switchTab(userTab)
})
searchTab.addEventListener("click", ()=> {
    // pass clicked tab as input parameter
    switchTab(searchTab)
})



// check if coordinates are already present in the session storage
function getfromSessionStorage(){
    const localCoordinates = sessionStorage.getItem("user-coordinates");
    if(!localCoordinates){
        // if local coords are not present
        grantLocation.classList.add("active");
    }
    else{
        const coordinates = JSON.parse(localCoordinates);
        fetchUserWeatherInfo(coordinates);
    }
}


async function fetchUserWeatherInfo(coordinates){
    const {lat, lon} = coordinates;
    // make grant container invisible
    grantLocation.classList.remove("active");
    // make loader visible
    loadingScreen.classList.add("active")

    // API CALL
    try{
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_key}&units=metric`);
        const data = await response.json();
        loadingScreen.classList.remove("active");
        weatherInfo.classList.add("active");

        renderWeatherInfo(data);
    }
    catch(err){
        loadingScreen.classList.remove("active");
        console.log("Error: ", err)
    }
}



function renderWeatherInfo(data){
    const cityName = document.querySelector("[data-cityName]");
    const countryIcon = document.querySelector("[data-countryIcon]");
    const desc = document.querySelector("[data-weatherDescription]");
    const weatherIcon = document.querySelector("[data-weatherIcon]");
    const temp = document.querySelector("[data-temp]");
    const windSpeed = document.querySelector("[data-windSpeed]");
    const humidity = document.querySelector("[data-humidity]");
    const clouds = document.querySelector("[data-clouds]");

    cityName.innerHTML = data?.name;
    countryIcon.src = `https://flagcdn.com/144x108/${data?.sys?.country.toLowerCase()}.png`;
    desc.innerHTML = data?.weather?.[0]?.description;
    weatherIcon.src = `https://openweathermap.org/img/w/${data?.weather?.[0]?.icon}.png`;
    temp.innerHTML = `${data?.main?.temp} °C`;
    windSpeed.innerHTML = `${data?.wind?.speed}m/s`;
    humidity.innerHTML = `${data?.main?.humidity}%`;
    clouds.innerHTML = `${data?.clouds?.all}%`;
    console.log(data)
}


function getLocation(){
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(showPosition);
    }
    else{
        alert("No Geo Location support available")
    }
}

function showPosition(position){
    const userCoordinates = {
        lat: position.coords.latitude,
        lon: position.coords.longitude,
    }

    sessionStorage.setItem("user-coordinates",JSON.stringify(userCoordinates));
    fetchUserWeatherInfo(userCoordinates);
}


const grantAccessButton = document.querySelector("[data-grantAccess]");
grantAccessButton.addEventListener("click", getLocation);



// for searching and displaying the weather 
const searchInput = document.querySelector("[data-searchInput]");
searchForm.addEventListener("submit", (e)=> {
    e.preventDefault();
    let cityName = searchInput.value;

    if(cityName === "") 
        return;
    else
        fetchSearchWeatherInfo(cityName);
})
// enter key
searchForm.addEventListener("keypress", (e)=>{
    if(e.key === "Enter" || e.keyCode === 13){
    e.preventDefault();
    let cityName = searchInput.value;

    if(cityName === "") 
        return;
    else
        fetchSearchWeatherInfo(cityName);
    }
})
async function fetchSearchWeatherInfo(cityName){
    loadingScreen.classList.add("active");
    weatherInfo.classList.remove("active");
    grantLocation.classList.remove("active");

    try{
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${API_key}&units=metric`);
        const data = await response.json();

        loadingScreen.classList.remove("active");
        weatherInfo.classList.add("active");
        renderWeatherInfo(data);
    }
    catch(err){
        console.log("Error: ", err);
    }
}


