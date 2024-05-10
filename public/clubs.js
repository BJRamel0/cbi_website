// clubs.js

// Function to fetch and populate club information
async function populateClubs() {
    try {
        const response = await fetch('../clubInformation.json');
        const clubs = await response.json();

        // Target the div where club information will be inserted
        const clubInfoContainer = document.getElementById('clubInformation');

        // Loop through each club and populate the HTML
        clubs.forEach((club, index) => {
            const container = document.createElement('div');
            container.classList.add('organization-section');

            container.innerHTML = `
                <div class="container">
                    <div class="organization-info">
                        <div class="organization-image">
                            <img src="${club.image}" alt="${club.alt}">
                        </div>
                        <div class="organization-details">
                            <h2>${club.name}</h2>
                            <div class="social-media-buttons">
                                <a href="${club.website}" target="_blank">Website</a>
                                <a href="${club.instagram}" target="_blank">Instagram</a>
                            </div>
                            <p>${club.description}</p>
                        </div>
                    </div>
                </div>
            `;

            // Append each club's information to the container
            clubInfoContainer.appendChild(container);
        });
    } catch (error) {
        console.error('Error fetching club information:', error);
    }
}

async function populateClubs() {
    try {
        const response = await fetch('../clubInformation.json');
        const clubs = await response.json();
        const clubInfoContainer = document.getElementById('clubInformation');
        const searchInput = document.getElementById('clubSearch');

        // Function to filter clubs based on search query
        function filterClubs(query) {
            const filteredClubs = clubs.filter(club => {
                return club.name.toLowerCase().includes(query.toLowerCase());
            });
            // Clear previous content
            clubInfoContainer.innerHTML = '';
            // Populate HTML with filtered clubs
            filteredClubs.forEach((club, index) => {
                const container = document.createElement('div');
                container.classList.add('organization-section');
                container.innerHTML = `
                    <div class="container">
                        <div class="organization-info">
                            <div class="organization-image">
                                <img src="${club.image}" alt="${club.alt}">
                            </div>
                            <div class="organization-details">
                                <h2>${club.name}</h2>
                                <div class="social-media-buttons">
                                    <a href="${club.website}" target="_blank">Website</a>
                                    <a href="${club.instagram}" target="_blank">Instagram</a>
                                </div>
                                <p>${club.description}</p>
                            </div>
                        </div>
                    </div>
                `;
                clubInfoContainer.appendChild(container);
            });
        }

        // Call filterClubs() when user types in search input
        searchInput.addEventListener('input', () => {
            filterClubs(searchInput.value);
        });

        // Populate clubs initially
        filterClubs('');
    } catch (error) {
        console.error('Error fetching club information:', error);
    }
}

// Call the function to populate clubs when the page loads
window.onload = function () {
    populateClubs();
}
