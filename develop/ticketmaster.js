
let selectedCategory = 'null';

// Get references to the category links using their IDs
const filmCategoryLink = document.getElementById("film-category");
const musicCategoryLink = document.getElementById("music-category");
const sportsCategoryLink = document.getElementById("sports-category");
const miscellaneousCategoryLink = document.getElementById("miscellaneous-category");

var categoryToIdMap = {
  'Film': 'KZFzniwnSyZfZ7v7nn',
  'Miscellaneous': 'KZFzniwnSyZfZ7v7n1',
  'Sports': 'KZFzniwnSyZfZ7v7nE',
  'Music': 'KZFzniwnSyZfZ7v7nJ',
};

var selectedCategoryId = categoryToIdMap[selectedCategory];

filmCategoryLink.addEventListener("click", function(event) {
  event.preventDefault(); // Prevent the default link behavior
  selectedCategory = "Film"; // Set the selected category to "Film"
  selectedCategoryId = categoryToIdMap[selectedCategory];
  console.log("Selected category: Film");
  console.log(selectedCategoryId);
});

musicCategoryLink.addEventListener("click", function(event) {
  event.preventDefault();
  selectedCategory = "Music";
  selectedCategoryId = categoryToIdMap[selectedCategory];
  console.log("Selected category: Music");
  console.log(selectedCategoryId)
});

sportsCategoryLink.addEventListener("click", function(event) {
  event.preventDefault();
  selectedCategory = "Sports";
  selectedCategoryId = categoryToIdMap[selectedCategory];
  console.log("Selected category: Sports");
  console.log(selectedCategoryId)
});

miscellaneousCategoryLink.addEventListener("click", function(event) {
  event.preventDefault();
  selectedCategory = "Miscellaneous";
  selectedCategoryId = categoryToIdMap[selectedCategory];
  console.log("Selected category: Miscellaneous");
  console.log(selectedCategoryId)
});

// Define variables to store the entered Zipcode and Mile Range
let enteredZipcode = "";
let enteredMileRange = "";

const zipcodeInput = document.getElementById("zipcode-input");
const mileRangeInput = document.getElementById("mile-range-input");
zipcodeInput.addEventListener("input", function(event) {
  enteredZipcode = event.target.value;
  console.log("Entered Zipcode: " + enteredZipcode);
});

// Google Maps Javascript

function initMap() {
  // Set the initial center to New York City
  const initialCenter = { lat: 40.7128, lng: -74.0060 };
  const initialZoom = 10; 

  map = new google.maps.Map(document.getElementById('map'), {
    zoom: initialZoom,
    center: initialCenter,
    mapTypeId: google.maps.MapTypeId.ROADMAP
  });

  // Create a variable to store the map object for later use
  let mapInstance = map;

  // Function to update the map based on Zipcode
  function updateMapWithZipcode(zipcode, zoomLevel) {
  const geocoder = new google.maps.Geocoder();

  geocoder.geocode({ address: zipcode }, function (results, status) {
    if (status === google.maps.GeocoderStatus.OK) {
      const location = results[0].geometry.location;

      // Calculate the bounds based on the entered mile range
      const earthRadius = 3963.2; // Earth radius in miles
      const latInRadians = (enteredMileRange / earthRadius) * (180 / Math.PI);
      const lngInRadians = latInRadians / Math.cos(location.lat() * (Math.PI / 180));

      const north = location.lat() + (latInRadians / 2);
      const south = location.lat() - (latInRadians / 2);
      const east = location.lng() + (lngInRadians / 2);
      const west = location.lng() - (lngInRadians / 2);

      // Set the map bounds based on the calculated bounds
      mapInstance.fitBounds(new google.maps.LatLngBounds({ lat: south, lng: west }, { lat: north, lng: east }));

      // Set the zoom level based on the provided zoomLevel
      mapInstance.setZoom(zoomLevel);
    } else {
      console.error('Geocode error:', status);
    }
  });
}
// Example function to calculate a zoom level based on the entered Mile Range
function calculateZoomLevel(enteredMileRange) {
  const earthRadius = 3963.2; // Earth radius in miles
  const latInRadians = (enteredMileRange / earthRadius) * (180 / Math.PI);

  // Calculate the zoom level based on the latitude range
  const zoomLevel = Math.log2(360 / latInRadians);

  return Math.min(Math.max(zoomLevel, 1), 20);
}

mileRangeInput.addEventListener("input", function(event) {
  enteredMileRange = event.target.value;
  console.log("Entered Mile Range: " + enteredMileRange);

  // Calculate the zoom level based on the entered Mile Range
  const zoomLevel = calculateZoomLevel(enteredMileRange);
  console.log('Zoom Level:', zoomLevel);

  // Update the map with the new zoom level
  updateMapWithZipcode(enteredZipcode, zoomLevel);
});

  // Add an event listener to capture user input and update the map
  zipcodeInput.addEventListener('input', function () {
    const enteredZipcode = zipcodeInput.value;
    updateMapWithZipcode(enteredZipcode);
  });
}



/* "key": "MHMzpmenH0Zry7zmECgCD2HpZ1X9Bnuy" */
/* "secret" : eAGGGehkgI9ZqwyI */

/*  
id: 'KZFzniwnSyZfZ7v7nn', name: 'Film'
id: 'KZFzniwnSyZfZ7v7n1', name: 'Miscellaneous'

id: 'KZFzniwnSyZfZ7v7nE', name: 'Sports'KZFzniwnSyZfZ7v7nE
id: 'KZFzniwnSyZfZ7v7nJ', name: 'Music'
*/
function addMarkersToMap(map, eventInfoArray, selectedCategoryId) {
  const infoWindows = []; // Create an array to store InfoWindow instances
  console.log(map);
  eventInfoArray.forEach((eventInfo) => {
    const { latitude, longitude, eventName, eventCategory } = eventInfo;

    // Check if the eventCategory matches the selectedCategory
    if (eventCategory == selectedCategoryId) {
      const marker = new google.maps.Marker({
        position: { lat: latitude, lng: longitude },
        map, 
        title: eventName,
      });
      console.log(map);

      // Create an InfoWindow with the event name content
      const infoWindow = new google.maps.InfoWindow({
        content: eventName,
      });

      // Store the InfoWindow instance in the array
      infoWindows.push(infoWindow);

      // Add event listeners to the marker
      marker.addListener('mouseover', () => {
        infoWindow.open(map, marker); // Open the InfoWindow when hovering
      });

      marker.addListener('mouseout', () => {
        infoWindow.close(); // Close the InfoWindow when no longer hovering
      });
    } else {
      console.log(eventCategory);
    }
  });
}

function fetchEventData(enteredZipcode, enteredMileRange, selectedCategoryId) {
    var url = `https://app.ticketmaster.com/discovery/v2/events.json?size=100&postalCode=${enteredZipcode}&enteredMileRange=${enteredMileRange}&apikey=MHMzpmenH0Zry7zmECgCD2HpZ1X9Bnuy`;

    const eventInfoArray = [];

      fetch(url)
      .then(response => response.json())
      .then(data => {
        if (data._embedded && data._embedded.events && data._embedded.events.length > 0) {
          // Extract event information from the response
          const events = data._embedded.events;

          // Loop through events and extract name, latitude, and longitude
          events.forEach(event => {
            const eventName = event.name;
            const venues = event._embedded.venues; // Get all venues for the event
            const classifications = event.classifications;

            const segmentIds = [];

            classifications.forEach(classifications =>{
              const segmentId = classifications.segment.id;
              
              console.log(`SegmentId: ${segmentId}`);
              segmentIds.push(segmentId);
            })

            venues.forEach(venue => {
              const latitude = parseFloat(venue.location.latitude);
              const longitude = parseFloat(venue.location.longitude);
              const localDate = event.dates.start.localDate;
              const localTime = event.dates.start.localTime;

              const eventCategory = segmentIds.join(', ');

              console.log(`Event Name: ${eventName}`);
              console.log(`Venue Latitude: ${latitude}`);
              console.log(`Venue Longitude: ${longitude}`);
              console.log(`Local Date: ${localDate}`);
              console.log(`Local Time: ${localTime}`);
              console.log('--------------------------');

              const eventInfo = {
                eventName,
                latitude,
                longitude,
                localDate,
                localTime,
                eventCategory,
              };
              eventInfoArray.push(eventInfo);              
            });
          });
          console.log(map)
          console.log(eventInfoArray)
          console.log(selectedCategoryId)
          addMarkersToMap(map, eventInfoArray, selectedCategoryId);
        } else {
          console.log('No events found for the given postal code.');
          alert('No events found for the given postal code.');
        }
    })

    .catch(error => {
      console.error('Error fetching event data:', error);
    });
    /*
      fetch(url)
      .then(function(response) {
        return response.json();
      })
      .then(function(data) {
        console.log(data);
      })
      .catch(function(error) {
        console.log(error);
      });
    } else {
      console.log('Entered zipcode or mile range is zero. Skipping fetch.');
      
      USED FOR PARSING*/ 
    }

document.addEventListener("DOMContentLoaded", function () {
  const searchButton = document.getElementById("search-button");

  searchButton.addEventListener("click", function () {

    if (enteredZipcode.length === 5 && enteredMileRange !== "0" && selectedCategory !== 'null') {
      // Call the fetchEventData function with the entered values
      selectedCategoryId = categoryToIdMap[selectedCategory];
      fetchEventData(enteredZipcode, enteredMileRange, selectedCategoryId);
    } else {
      console.log('Invalid input. Please check entered values.');
    }
  });
});

window.initMap = initMap;

document.addEventListener("DOMContentLoaded", function () {
  initMap();
});

id: 'KZFzniwnSyZfZ7v7nE', name: 'Sports'
id: 'KZFzniwnSyZfZ7v7nJ', name: 'Music'
*/
  var postalCodeVar = 84044;
  var radius = "100"; // Set the search radius to 100 miles (adjust as needed)
  var url = `https://app.ticketmaster.com/discovery/v2/events.json?size=20&postalCode=${postalCodeVar}&radius=${radius}&apikey=MHMzpmenH0Zry7zmECgCD2HpZ1X9Bnuy`;

  const eventInfoArray = [];

  fetch(url)
  .then(response => response.json())
  .then(data => {
    if (data._embedded && data._embedded.events && data._embedded.events.length > 0) {
      // Extract event information from the response
      const events = data._embedded.events;
    
      // Loop through events and extract name, latitude, and longitude
      events.forEach(event => {
        const eventName = event.name;
        const venues = event._embedded.venues; // Get all venues for the event
    
        venues.forEach(venue => {
          const latitude = venue.location.latitude;
          const longitude = venue.location.longitude;
          const localDate = event.dates.start.localDate;
          const localTime = event.dates.start.localTime;
          
    
          console.log(`Event Name: ${eventName}`);
          console.log(`Venue Latitude: ${latitude}`);
          console.log(`Venue Longitude: ${longitude}`);
          console.log(`Local Date: ${localDate}`);
          console.log(`Local Time: ${localTime}`);
          console.log('--------------------------');

          const eventInfo = {
            eventName,
            latitude,
            longitude,
            localDate,
            localTime,
          };
          eventInfoArray.push(eventInfo);
        });
      });
      console.log(eventInfoArray);
    } else {
      console.log('No events found for the given postal code.');
    }
  })
  .catch(error => {
    console.error('Error fetching event data:', error);
  });

    fetch(url)
    .then(function(response) {
      return response.json();
    })
    .then(function(data) {
      console.log(data);
    })
    .catch(function(error) {
      console.log(error);
    });

