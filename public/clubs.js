// Function to fetch and populate club information
async function populateClubs() {
    try {
        const response = await fetch('../clubInformation.json');
        const clubs = await response.json();
        const clubInfoContainer = document.getElementById('clubInformation');
        const searchInput = document.getElementById('clubSearch');
        const filterOptions = document.getElementById('filterOptions');
        const filterDropdown = document.getElementById('filterDropdown');
        const majorOptions = document.querySelectorAll('#majorCategory input[type="checkbox"]');
        const sizeOptions = document.querySelectorAll('#sizeCategory input[type="checkbox"]');
        const exclusiveOptions = document.querySelectorAll('#exclusiveCategory input[type="checkbox"]');
        const eventsDropdownBtn = document.getElementById('eventsDropdown');
        const eventsDropdownContent = document.getElementById('eventsDropdownContent');

        let activeFilters = []; // Array to store active filters

        // Function to clear club information from the container
        function clearClubInfo() {
            clubInfoContainer.innerHTML = '';
        }

        // Function to populate HTML with clubs
        function populateClubInfo(club, container) {
            const clubContainer = document.createElement('div');
            clubContainer.classList.add('organization-section');
            clubContainer.innerHTML = `
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
                        </div>
                    </div>
                </div>
            `;
            container.appendChild(clubContainer);

            const descriptionContainer = clubContainer.querySelector('.organization-details');

            if (window.innerWidth < 800) {
                createDescriptionDropdown(club.description, descriptionContainer);
            } else {
                const descriptionParagraph = document.createElement('p');
                descriptionParagraph.textContent = club.description;
                descriptionContainer.appendChild(descriptionParagraph);
            }
        }

        // Function to populate filtered clubs
        function populateFilteredClubs(filteredClubs, container) {
            container.innerHTML = ''; // Clear existing club information
            filteredClubs.forEach(club => {
                populateClubInfo(club, container);
            });
        }

        // Function to filter clubs based on search query, size, exclusivity, and majors
        function filterClubs(query) {
            try {
                const filteredClubs = clubs.filter(club => {
                    const nameMatch = club.name.toLowerCase().includes((query || '').toLowerCase());
                    const exclusiveMatch = !exclusiveOptions[0].checked || club.exclusive.toLowerCase() === 'yes';
                    const anyMajorSelected = Array.from(majorOptions).some(option => option.checked);

                    // Apply major filter if any major option is selected
                    const majorMatch = !anyMajorSelected || Array.from(majorOptions).some(option => {
                        if (option.checked) {
                            const selectedMajor = option.value.toLowerCase();
                            const clubMajors = club.majors.toLowerCase().split(', ');
                            return clubMajors.includes(selectedMajor);
                        }
                        return false; // If option is not checked, it's not a filter criterion
                    });

                    const anySizeSelected = Array.from(sizeOptions).some(option => option.checked);
                    const sizeMatch = !anySizeSelected || Array.from(sizeOptions).some(option => option.checked && club.size.toLowerCase() === option.value);

                    return nameMatch && exclusiveMatch && majorMatch && sizeMatch;
                });

                // Populate HTML with filtered clubs
                populateFilteredClubs(filteredClubs, clubInfoContainer);
            } catch (error) {
                console.error('Error filtering clubs:', error);
            }
        }

        // Attach event listener to search input for live filtering
        searchInput.addEventListener('input', () => {
            filterClubs(searchInput.value);
        });

        // Attach event listeners to checkboxes to trigger filtering
        document.querySelectorAll('.size-checkbox, .exclusive-checkbox, .major-checkbox').forEach(checkbox => {
            checkbox.addEventListener('change', function() {
                // Update active filters array
                const filterType = this.getAttribute('data-filter-type');
                if (this.checked && !activeFilters.includes(filterType)) {
                    activeFilters.push(filterType);
                } else if (!this.checked && activeFilters.includes(filterType)) {
                    const index = activeFilters.indexOf(filterType);
                    activeFilters.splice(index, 1);
                }
                filterClubs(searchInput.value); // Apply filters
            });
        });

        // Populate clubs initially
        filterClubs('');

    } catch (error) {
        console.error('Error fetching club information:', error);
    }
}

// Call the function to populate clubs when the page loads
window.onload = populateClubs;
