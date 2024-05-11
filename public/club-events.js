document.addEventListener("DOMContentLoaded", function() {
    // Select the events dropdown button and content
    const eventsDropdownBtn = document.getElementById('eventsDropdown');
    const eventsDropdownContent = document.getElementById('eventsDropdownContent');

    // Function to toggle display of events dropdown content
    function toggleEventsDropdown() {
        eventsDropdownContent.classList.toggle('show');
    }

    // Event listener for events dropdown button
    eventsDropdownBtn.addEventListener('click', toggleEventsDropdown);

    // Event listener to close the dropdown when clicking outside of it
    window.addEventListener('click', function(event) {
        if (!event.target.closest('.events-dropdown')) {
            if (eventsDropdownContent.classList.contains('show')) {
                eventsDropdownContent.classList.remove('show');
            }
        }
    });

    // Event listener for dropdown options
    document.querySelectorAll('#eventsDropdownContent a').forEach(link => {
        link.addEventListener('click', function(event) {
            event.preventDefault(); // Prevent default behavior
            const href = this.getAttribute('href'); // Get href attribute
            window.location.href = href; // Navigate to the URL
        });
    });

    let currentIndex = 0;
    let itemsPerPage = 3; // Number of items to display per page
    let eventsData = []; // Array to store event data

    // Function to determine the number of items to display per page based on screen width
    function setItemsPerPage() {
        if (window.innerWidth >= 1300) {
            itemsPerPage = 3; // Display 3 items per page on screens wider than 1000px
        } else if (window.innerWidth < 1300 && window.innerWidth >= 875) {
            itemsPerPage = 2; // Display 2 item per page on screens between 700px and 1300px
        } else {
            itemsPerPage = 1; // Display 1 items per page on screens narrower than 700px
        }
    }

    // Function to fetch event data from JSON file
    async function fetchEventData() {
        try {
            const response = await fetch('../clubevents.json'); // Assuming the JSON file is named events.json
            if (!response.ok) {
                throw new Error('Failed to fetch event data');
            }
            eventsData = await response.json();
            renderEvents();
        } catch (error) {
            console.error(error);
        }
    }

    // Function to create event rectangles
    function createEventRectangle(event) {
        const eventRectangle = document.createElement('div');
        eventRectangle.classList.add('w3-col', 's12', 'm6', 'l4'); // Adjust classes for responsiveness
        eventRectangle.innerHTML = `
            <div class="custom-event-rectangle">
                <div class="custom-event-details">
                    <h3>${event.name}</h3>
                </div>
                <div class="custom-event-image" style="background-image: url('${event.image}');" alt="${event.alt}"></div>
                <div class="custom-event-info">
                    <p>${event.organization}</p>
                    <p>${event.when}</p>
                </div>
            </div>
        `;
        return eventRectangle;
    }

    // Function to render events based on currentIndex
    function renderEvents() {
        const eventsContainer = document.querySelector('.w3-row-padding');
        eventsContainer.innerHTML = ''; // Clear existing content
        const endIndex = Math.min(currentIndex + itemsPerPage, eventsData.length);
        for (let i = currentIndex; i < endIndex; i++) {
            eventsContainer.appendChild(createEventRectangle(eventsData[i]));
        }
    }

    // Function to handle click on next button
    function nextButtonHandler() {
        currentIndex += itemsPerPage;
        if (currentIndex >= eventsData.length) {
            currentIndex = 0;
        }
        renderEvents();
    }

    // Function to handle click on previous button
    function prevButtonHandler() {
        currentIndex -= itemsPerPage;
        if (currentIndex < 0) {
            currentIndex = Math.max(0, Math.floor((eventsData.length - 1) / itemsPerPage) * itemsPerPage);
        }
        renderEvents();
    }

    // Event listener for next button
    document.getElementById('nextButton').addEventListener('click', nextButtonHandler);

    // Event listener for previous button
    document.getElementById('prevButton').addEventListener('click', prevButtonHandler);

    // Fetch event data when DOM content is loaded
    fetchEventData();

    // Update itemsPerPage on window resize
    window.addEventListener('resize', function() {
        setItemsPerPage();
        renderEvents();
    });

    // Initialize itemsPerPage
    setItemsPerPage();
    renderEvents();

    // Change button color when window width is less than 390px
    window.addEventListener('resize', function() {
        if (window.innerWidth <= 415) {
            document.getElementById('nextButton').style.color = 'white';
            document.getElementById('prevButton').style.color = 'white';
        } else {
            document.getElementById('nextButton').style.color = '#333'; // Reset to default color
            document.getElementById('prevButton').style.color = '#333'; // Reset to default color
        }
    });

});
