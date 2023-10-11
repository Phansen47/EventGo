let selectedCategory = 'null';

// Get references to the category links using their IDs
const filmCategoryLink = document.getElementById("film-category");
const musicCategoryLink = document.getElementById("music-category");
const sportsCategoryLink = document.getElementById("sports-category");
const miscellaneousCategoryLink = document.getElementById("miscellaneous-category");

// Translates user inputs and readable terms to their category IDs
var categoryToIdMap = {
  'Film': 'KZFzniwnSyZfZ7v7nn',
  'Miscellaneous': 'KZFzniwnSyZfZ7v7n1',
  'Sports': 'KZFzniwnSyZfZ7v7nE',
  'Music': 'KZFzniwnSyZfZ7v7nJ',
};

var selectedCategoryId = categoryToIdMap[selectedCategory];

// Definign eventlisters for each of the four categories a user can select

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

  // Create a variable to store the map object
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
   // Add an event listener to capture user input  for mile range and update the map
mileRangeInput.addEventListener("input", function(event) {
  enteredMileRange = event.target.value;
  console.log("Entered Mile Range: " + enteredMileRange);

  // Calculate the zoom level based on the entered Mile Range
  const zoomLevel = calculateZoomLevel(enteredMileRange);
  console.log('Zoom Level:', zoomLevel);

  updateMapWithZipcode(enteredZipcode, zoomLevel);
});

  // Add an event listener to capture user input  for zipcode and update the map
  zipcodeInput.addEventListener('input', function () {
    const enteredZipcode = zipcodeInput.value;
    updateMapWithZipcode(enteredZipcode);
  });
}



// Google Map markers - this section tells the Google Maps API to add markers to where events are and what to do when moused over
function addMarkersToMap(map, eventInfoArray, selectedCategoryId) {
  const infoWindows = [];
  console.log(map);
  eventInfoArray.forEach((eventInfo) => {
    const { latitude, longitude, eventName, eventCategory } = eventInfo;

    if (eventCategory == selectedCategoryId) {
      const marker = new google.maps.Marker({
        position: { lat: latitude, lng: longitude },
        map, 
        title: eventName,
      });
      console.log(map);

      const infoWindow = new google.maps.InfoWindow({
        content: eventName,
      });

      infoWindows.push(infoWindow);

      // Add event listeners to the marker
      marker.addListener('mouseover', () => {
        infoWindow.open(map, marker);
      });

      marker.addListener('mouseout', () => {
        infoWindow.close();
      });
    } else {
      console.log(eventCategory);
    }
  });
}

// Ticketmaster data function - this handles finding event information based on the inputs of the geographic parameters and selected category
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
            const venues = event._embedded.venues; 
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
            
            // Create new array of only the information we need
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
          localStorage.setItem('savedZipcode', enteredZipcode);
          savedZipcode = enteredZipcode;
          addSavedZipcodeToHistory(savedZipcode);
          addMarkersToMap(map, eventInfoArray, selectedCategoryId);
        } else {
          console.log('No events found for the given postal code.');
          openModal(document.getElementById('custom-modal'));
        }
    })

    .catch(error => {
      console.error('Error fetching event data:', error);
    });
    }

// Search button listener and functionality
      document.addEventListener("DOMContentLoaded", function () {
        const searchButton = document.getElementById("search-button");

        searchButton.addEventListener("click", function () {

          if (enteredZipcode.length === 5 && enteredMileRange !== "0" && selectedCategory !== 'null') {
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

// Modal section - this section handles the creation and usablity of the modals
  function openModal($el) {
    $el.classList.add('is-active');
  }

  function closeModal($el) {
    $el.classList.remove('is-active');
  }

  function closeAllModals() {
    (document.querySelectorAll('.modal') || []).forEach(($modal) => {
      closeModal($modal);
    });
  }
  (document.querySelectorAll('.js-modal-trigger') || []).forEach(($trigger) => {
    const modal = $trigger.dataset.target;
    const $target = document.getElementById(modal);

    $trigger.addEventListener('click', () => {
      openModal($target);
    });
  });

  (document.querySelectorAll('.modal-background, .modal-close, .modal-card-head .delete, .modal-card-foot .button') || []).forEach(($close) => {
    const $target = $close.closest('.modal');

    $close.addEventListener('click', () => {
      closeModal($target);
    });
  });

  document.addEventListener('keydown', (event) => {
    if (event.code === 'Escape') {
      closeAllModals();
    }
  });

// Saved zipcode information
var savedZipcode = "12345";

function addSavedZipcodeToHistory(zipcode) {
  const listItem = document.createElement("li");

  const button = document.createElement("button");
  button.textContent = zipcode;
  button.className = "button is-small is-rounded";
  
  button.addEventListener("click", function() {
    document.getElementById("zipcode-input").value = zipcode;
  });

  listItem.appendChild(button);

  document.getElementById("history-list").appendChild(listItem);
}

// Add the saved ZIP code to the history
addSavedZipcodeToHistory(savedZipcode);