// File: script.js
// Author: Bertan Berker
// Javascript file that gets user input and calls the Skyscanner API to get the cheapest flights


// This function handles the submission of the form
function handleFlightSearch(event) {
    event.preventDefault(); // Prevent form submission (to handle data with JavaScript)

    // Get form input values
    const passengers = document.getElementById("passengers").value;
    const departureLocation = document.getElementById("departureLocation").value;
    const arrivalLocation = document.getElementById("arrivalLocation").value;
    const departureDate = document.getElementById("departureDate").value;
    const returnDate = document.getElementById("returnDate").value;

    // Call the API to get the results
    fetchData(passengers, departureLocation, arrivalLocation, departureDate, returnDate);
}


// This function calls the Skyscanner API to get the data in JSON format
// :param passengers: Number of passengers
// :param departureLocation: Departure Location
// :param arrivalLocation: Arrival Location
// :param departureDate: Departure Date
// :param returnDate: Return Date
async function fetchData(passengers, departureLocation, arrivalLocation, departureDate, returnDate) {

    const url = 'https://skyscanner44.p.rapidapi.com/search?adults=' + passengers + '&origin=' + departureLocation + '&destination=' + arrivalLocation + 
    '&departureDate=' + departureDate + '&returnDate=' + returnDate + '&currency=USD&locale=en-US&market=US';

    const APIKEY = "";
    const HOST = "";

    const options = {
        method: 'GET',
        headers: {
            'X-RapidAPI-Key': APIKEY,
            'X-RapidAPI-Host': HOST
        }
    };
    
    try {
        const response = await fetch(url, options);
        const result = await response.text();
        getFlightInformation(result);

    } catch (error) {
        console.error(error);
    }  
}


// Got the price and website information from the JSON that the API returned
function getFlightInformation(data) {
    
    const flightList = document.getElementById("flightList");

    const jsonObject = JSON.parse(data);
    const obj = jsonObject.itineraries.buckets

    for (const val of obj) {
        if (val.name === "Cheapest") {
            for (const item of val.items) {
                const price = item.price.formatted;
                const website = item.deeplink;
                const airline = item.legs[0].carriers.marketing[0].name;

                const flightInfo = document.createElement("li");
                const link = document.createElement("a");
                link.textContent = `${airline} - ${price}`;
                link.href = website;
                flightInfo.appendChild(link);

                flightList.appendChild(flightInfo);
            }

            break;
        }
    }
}

document.getElementById("flightSearchForm").addEventListener("submit", handleFlightSearch);