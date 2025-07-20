 // --- MODAL AND MENU FUNCTIONS ---
        // Mobile menu toggle functionality
        document.getElementById('mobile-menu-btn').addEventListener('click', function() {
            const menu = document.querySelector('.mobile-menu');
            menu.classList.toggle('open');
            const icon = this.querySelector('i');
            icon.classList.toggle('fa-bars');
            icon.classList.toggle('fa-times');
        });

        // Generic modal functionality
        const serviceModal = document.getElementById('service-modal');
        const profileModal = document.getElementById('profile-modal');
        document.getElementById('list-service-btn').addEventListener('click', () => serviceModal.style.display = 'flex');
        document.getElementById('list-service-now-btn').addEventListener('click', () => serviceModal.style.display = 'flex');
        document.getElementById('close-service-modal').addEventListener('click', () => serviceModal.style.display = 'none');
        document.getElementById('close-profile-modal').addEventListener('click', () => profileModal.style.display = 'none');

        window.addEventListener('click', (e) => {
            if (e.target === serviceModal) serviceModal.style.display = 'none';
            if (e.target === profileModal) profileModal.style.display = 'none';
        });

        // --- DATA HANDLING AND DYNAMIC CONTENT ---
        document.addEventListener('DOMContentLoaded', async function() {
            try {
                // Use standard fetch to get the services.json content
                const response = await fetch('services.json');
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                window.allServices = await response.json(); // Parse the JSON response
                populateServiceListings(window.allServices);
            } catch (error) {
                console.error('Error fetching or parsing services.json:', error);
            }
        });

        function populateServiceListings(services) {
            const listingsContainer = document.getElementById('service-listings');
            listingsContainer.innerHTML = ''; // Clear existing listings
            services.forEach((service, index) => {
                const card = document.createElement('div');
                card.className = 'service-card bg-card relative';
                card.style.opacity = '0';
                card.style.transform = 'translateY(20px)';
                card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
                
                // Set data attributes for search and modals
                card.dataset.serviceName = service.name;
                card.dataset.serviceType = service.serviceType;
                card.dataset.serviceDescription = service.description;
                card.dataset.servicePrice = service.price;
                card.dataset.serviceRating = service.rating;
                card.dataset.serviceReviews = service.reviews;
                card.dataset.serviceAvailability = service.availability;
                card.dataset.serviceAvailabilityClass = service.availabilityClass;
                card.dataset.serviceAvatar = service.avatar;
                card.dataset.serviceAvatarBg = service.avatarBg;
                card.dataset.serviceWhatsapp = service.whatsapp;
                card.dataset.serviceWorks = JSON.stringify(service.works || []); // Store works data

                const ratingStars = generateRatingStars(service.rating);

                card.innerHTML = `
                    ${service.featured ? '<div class="featured-badge">FEATURED</div>' : ''}
                    <div class="p-6">
                        <div class="flex gap-6 items-start">
                            <div class="flex-shrink-0">
                                <div class="avatar-placeholder w-24 h-24 rounded-xl" style="background:${service.avatarBg};">
                                    ${service.avatar}
                                </div>
                            </div>
                            <div class="flex-grow">
                                <div class="flex justify-between items-start">
                                    <div>
                                        <h3 class="font-bold text-xl">${service.name}</h3>
                                        <p class="text-gray-600">${service.serviceType}</p>
                                    </div>
                                    <div class="bg-blue-50 text-primary px-3 py-1 rounded-full text-sm font-medium">
                                        ${service.price}
                                    </div>
                                </div>
                                <p class="mt-4 text-gray-600">${service.description}</p>
                                <div class="flex flex-wrap items-center mt-6 gap-4">
                                    <div class="rating-stars">
                                        ${ratingStars}
                                        <span class="text-gray-500 text-sm ml-1">${service.rating.toFixed(1)} (${service.reviews})</span>
                                    </div>
                                    <div class="text-sm ${service.availabilityClass} font-medium">
                                        <i class="fas fa-check-circle"></i> ${service.availability}
                                    </div>
                                </div>
                                <div class="flex gap-3 mt-8">
                                    <button class="whatsapp-service-btn bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-6 rounded-lg flex items-center gap-2 w-full justify-center shadow-lg" data-service-provider="${service.name}" data-whatsapp-number="${service.whatsapp}">
                                        <i class="fab fa-whatsapp"></i> WhatsApp
                                    </button>
                                    <button class="profile-service-btn bg-gray-100 hover:bg-gray-200 font-medium py-3 px-4 rounded-lg">
                                        <i class="fas fa-user"></i>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                `;
                listingsContainer.appendChild(card);
                
                // Animate card appearance
                setTimeout(() => {
                    card.style.opacity = '1';
                    card.style.transform = 'translateY(0)';
                }, 100 * index);
            });
            
            // Re-attach event listeners after creating cards
            attachCardEventListeners();
        }
        
        function generateRatingStars(rating) {
            let stars = '';
            for (let i = 1; i <= 5; i++) {
                if (i <= rating) {
                    stars += '<i class="fas fa-star"></i>';
                } else if (i - 0.5 <= rating) {
                    stars += '<i class="fas fa-star-half-alt"></i>';
                } else {
                    stars += '<i class="far fa-star"></i>';
                }
            }
            return stars;
        }

        // --- EVENT LISTENERS ---
        function attachCardEventListeners() {
            // WhatsApp buttons on service cards
            document.querySelectorAll('.whatsapp-service-btn').forEach(button => {
                button.addEventListener('click', function() {
                    const provider = this.getAttribute('data-service-provider');
                    const whatsAppNumber = this.getAttribute('data-whatsapp-number') || '233201234567'; // Fallback number
                    const message = `Hello, I'm interested in the service offered by ${provider}.`;
                    const whatsappUrl = `https://wa.me/${whatsAppNumber}?text=${encodeURIComponent(message)}`;
                    window.open(whatsappUrl, '_blank');
                });
            });
            
            // Profile buttons on service cards
            document.querySelectorAll('.profile-service-btn').forEach(button => {
                button.addEventListener('click', function() {
                    const card = this.closest('.service-card');
                    if (!card) return;

                    const name = card.dataset.serviceName;
                    const serviceType = card.dataset.serviceType;
                    const description = card.dataset.serviceDescription;
                    const avatar = card.dataset.serviceAvatar;
                    const avatarBg = card.dataset.serviceAvatarBg;
                    const rating = parseFloat(card.dataset.serviceRating);
                    const reviews = parseInt(card.dataset.serviceReviews);
                    const availability = card.dataset.serviceAvailability;
                    const availabilityClass = card.dataset.serviceAvailabilityClass;
                    const works = JSON.parse(card.dataset.serviceWorks || '[]');

                    const profileModalContent = document.getElementById('profile-modal-content');
                    let worksHtml = '';
                    if (works.length > 0) {
                        worksHtml = `
                            <h4 class="font-bold text-xl mt-8 mb-4 text-left">My Works</h4>
                            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        `;
                        works.forEach(work => {
                            if (work.type === 'image') {
                                worksHtml += `
                                    <div class="bg-gray-100 rounded-lg overflow-hidden shadow-sm">
                                        <img src="${work.src}" alt="${work.alt}" class="w-full h-40 object-cover">
                                        <p class="p-3 text-sm text-gray-700">${work.description}</p>
                                    </div>
                                `;
                            } else if (work.type === 'text') {
                                worksHtml += `
                                    <div class="bg-gray-100 rounded-lg p-4 shadow-sm flex items-center">
                                        <i class="fas fa-check-circle text-success mr-3"></i>
                                        <p class="text-sm text-gray-700">${work.description}</p>
                                    </div>
                                `;
                            }
                        });
                        worksHtml += `</div>`;
                    }

                    profileModalContent.innerHTML = `
                        <div class="flex flex-col items-center text-center pb-4 border-b border-gray-200 mb-6">
                            <div class="avatar-placeholder w-32 h-32 rounded-full mb-4" style="background: ${avatarBg}; font-size: 48px;">
                                ${avatar}
                            </div>
                            <h3 class="font-bold text-2xl">${name}</h3>
                            <p class="text-gray-600 text-lg">${serviceType}</p>
                            <div class="my-3 text-warning">
                                ${generateRatingStars(rating)}
                                <span class="text-gray-500 text-base ml-1">${rating.toFixed(1)} (${reviews} reviews)</span>
                            </div>
                            <div class="text-base ${availabilityClass} font-medium">
                                <i class="fas fa-check-circle"></i> ${availability}
                            </div>
                        </div>
                        <div class="text-left mb-6">
                            <h4 class="font-bold text-xl mb-2">About Me</h4>
                            <p class="text-gray-700">${description}</p>
                        </div>
                        ${worksHtml}
                        <button class="whatsapp-service-btn bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-6 rounded-lg flex items-center gap-2 w-full justify-center shadow-lg mt-8" data-service-provider="${name}" data-whatsapp-number="${card.dataset.serviceWhatsapp}">
                            <i class="fab fa-whatsapp"></i> Contact via WhatsApp
                        </button>
                    `;
                    profileModal.style.display = 'flex';
                    // Re-attach WhatsApp button listener for the modal's button
                    profileModal.querySelector('.whatsapp-service-btn').addEventListener('click', function() {
                        const provider = this.getAttribute('data-service-provider');
                        const whatsAppNumber = this.getAttribute('data-whatsapp-number') || '233201234567';
                        const message = `Hello, I'm interested in the service offered by ${provider}.`;
                        const whatsappUrl = `https://wa.me/${whatsAppNumber}?text=${encodeURIComponent(message)}`;
                        window.open(whatsappUrl, '_blank');
                    });
                });
            });
        }

        // Service form submission to WhatsApp
        document.getElementById('service-form').addEventListener('submit', (e) => {
            e.preventDefault();
            const whatsAppNumber = '233201234567'; // Replace with your admin WhatsApp number
            const title = document.getElementById('service-title').value;
            const description = document.getElementById('service-description').value;
            const price = document.getElementById('service-price').value;
            const category = document.getElementById('service-category').value;
            const message = `New Service Listing:\n\n*Title:* ${title}\n*Description:* ${description}\n*Price:* ${price}\n*Category:* ${category}`;
            const whatsappUrl = `https://wa.me/${whatsAppNumber}?text=${encodeURIComponent(message)}`;
            window.open(whatsappUrl, '_blank');
            serviceModal.style.display = 'none';
            // Clear form fields after submission
            document.getElementById('service-title').value = '';
            document.getElementById('service-description').value = '';
            document.getElementById('service-price').value = '';
            document.getElementById('service-category').value = '';
        });

        // Search functionality
        const searchFunction = () => {
            const searchTerm = document.getElementById('header-search-input').value.toLowerCase();
            const heroSearchTerm = document.getElementById('hero-search-input').value.toLowerCase();
            const finalSearchTerm = searchTerm || heroSearchTerm;

            const filteredServices = window.allServices.filter(service => {
                return (service.name.toLowerCase().includes(finalSearchTerm) ||
                        service.serviceType.toLowerCase().includes(finalSearchTerm) ||
                        service.description.toLowerCase().includes(finalSearchTerm));
            });
            populateServiceListings(filteredServices);
        };

        document.getElementById('header-search-input').addEventListener('input', searchFunction);
        document.getElementById('hero-search-input').addEventListener('input', searchFunction);
        document.getElementById('hero-search-btn').addEventListener('click', searchFunction);

        // Filter services by category when "View Services" button is clicked
        document.querySelectorAll('.view-services-btn').forEach(button => {
            button.addEventListener('click', function() {
                const category = this.getAttribute('data-category');
                const filteredServices = window.allServices.filter(service => service.serviceType === category);
                populateServiceListings(filteredServices);
                // Optionally scroll to service listings section
                document.getElementById('service-listings').scrollIntoView({ behavior: 'smooth' });
            });
        });

        // View All Services button
        document.getElementById('view-all-services-btn').addEventListener('click', () => {
            populateServiceListings(window.allServices);
            document.getElementById('service-listings').scrollIntoView({ behavior: 'smooth' });
        });

        // Browse All Categories button (currently just scrolls to categories, could be expanded)
        document.getElementById('browse-all-categories-btn').addEventListener('click', () => {
            document.querySelector('.py-16.px-4.bg-gray-50').scrollIntoView({ behavior: 'smooth' });
        });

        // How It Works button in CTA section
        document.getElementById('how-it-works-btn').addEventListener('click', () => {
            document.querySelector('.py-16.px-4.bg-gradient-to-br').scrollIntoView({ behavior: 'smooth' });
        });

