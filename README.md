## EventGO
Event platforms are complex and full of ads and fees. 

Finding something fun to do should be simple.

With EventGo, we eliminate the noise and allow you to quickly search for events in your area. 

## Saved info
"key": "MHMzpmenH0Zry7zmECgCD2HpZ1X9Bnuy"
"secret" : eAGGGehkgI9ZqwyI


## User Story

* As a social person
* I want to be able to search for events in my local area and filter by genre
* So that, I can find events that interest me most

## User Experience

1. Landing Page
Upon visiting the application, you'll be greeted with a clean and modern landing page, displaying the EventGo title, a subheading, and a brief description of the service.
2. Event Categories
The application offers a selection of four event categories: Film, Music, Sports, and Miscellaneous. These categories allow you to filter and discover events based on your interests.
3. Interactive Map
The heart of the application is an interactive map that displays event markers based on your selected category and geographic parameters. The map provides a visual representation of where events are happening near you.
4. Saved Searches
EventGo conveniently stores your previous searches in a "Search History" section, making it easy for you to revisit your previous searches.
5. Search Input
You can enter your zipcode and specify a mile range to search for events in your local area. After entering your zipcode and mile range, click the "Search" button to initiate a search.
6. Modal Feedback
If no events are found for the entered postal code or if there's any other important information to convey, you'll receive feedback through a modal dialog.

## Javascript Functionality
The JavaScript code provided in this project is responsible for handling various aspects of a web application related to event discovery. It includes functionality for selecting event categories, specifying geographic parameters (zipcode and mile range), integrating with Google Maps, fetching event data from Ticketmaster API, handling search button clicks, and displaying modals for user feedback. Additionally, it manages saved zip code information.

* Event Categories
The code allows users to select from four event categories: Film, Music, Sports, and Miscellaneous. The selected category is translated into a corresponding category ID used in the Ticketmaster API request.
* Geographic Parameters
Users can enter a 5-digit postal code (zipcode).
Users can specify a mile range from the entered zipcode.
* Google Maps Integration
Google Maps is integrated to display event markers on the map.
The map center initially defaults to New York City.
The map is updated based on the entered zipcode and mile range.
* Fetching Event Data
Event data is fetched from the Ticketmaster API using the entered zipcode, mile range, and selected category.
The data includes event names, location coordinates, local date, and local time.
Event data is displayed on the Google Map with markers for each event.
* Search Button Functionality
The "Search" button triggers the event data retrieval.
It validates user inputs (zipcode, mile range, and category) and ensures they are in the correct format.
When inputs are valid, it calls the function to fetch event data from Ticketmaster.
* Modal Functionality
Modals are used to display user feedback and alerts.
Modals are triggered when there are no events found for the given postal code or based on user interactions.
Users can close modals with the provided close buttons or by pressing the 'Escape' key.
* Saved Zipcode Information
A saved zipcode (for demonstration purposes) is displayed in a history list.
Users can click on a saved zipcode to populate the zipcode input field.
Feel free to expand upon this README with more details, explanations, and customization specific to your project's requirements. Additionally, you may want to add information about setting up the required HTML and CSS components, as well as any dependencies or API keys that need to be configured.

## Credit
* Background Image: https://www.vecteezy.com/members/101749449578448120165 
main
