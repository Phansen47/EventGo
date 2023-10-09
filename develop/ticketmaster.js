/* "key": "MHMzpmenH0Zry7zmECgCD2HpZ1X9Bnuy" */
/* "secret" : eAGGGehkgI9ZqwyI */

/*  
id: 'KZFzniwnSyZfZ7v7nn', name: 'Film'
id: 'KZFzniwnSyZfZ7v7n1', name: 'Miscellaneous'
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