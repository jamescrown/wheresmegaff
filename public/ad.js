export async function loadAds(type) {
    try {
        const response = await fetch(`/ads?type=${type}`);
        if (response.ok) {
            const ads = await response.json();
            displayAds(ads, type);
        } else {
            console.error('Failed to load ads:', response.status);
        }
    } catch (error) {
        console.error('Error loading ads:', error);
    }
}

export function displayAds(ads, type) {
    const main = document.querySelector('main');

    // Keep the button container outside of main's innerHTML
    if (!document.querySelector('.button-container')) {
        const buttonContainer = document.createElement('div');
        buttonContainer.className = 'button-container';
        buttonContainer.innerHTML = `
            <a href="#" class="btn-choice btn-buy">Buy</a>
            <a href="#" class="btn-choice btn-rent">Rent</a>
        `;
        main.insertBefore(buttonContainer, main.firstChild);

        // Add event listeners to the buttons
        document.querySelector('.btn-buy').addEventListener('click', () => loadAds('Buy'));
        document.querySelector('.btn-rent').addEventListener('click', () => loadAds('Rent'));
    }

    // Clear the main content except for the button container
    Array.from(main.children).forEach(child => {
        if (!child.classList.contains('button-container')) {
            child.remove();
        }
    });

    // Add the listings title
    const titleElement = document.createElement('h2');
    titleElement.textContent = `${type} Listings`;
    main.appendChild(titleElement);
    if (ads.length === 0) {
        const noListingsElement = document.createElement('p');
        noListingsElement.textContent = `No ${type.toLowerCase()} listings available.`;
        main.appendChild(noListingsElement);
    } else {
        const adList = document.createElement('ul');
        adList.className = 'ad-list';
        renderAds(adList, ads);
        main.appendChild(adList);
    }
}

export function renderAds(adList, ads) {
    ads.forEach((ad) => {
        const adItem = document.createElement('li');
        adItem.classList.add('ad-item');

        const adTitle = document.createElement('h3')
        adTitle.textContent = ad.title
        adItem.appendChild(adTitle)

        ad.images.forEach(imageUrl => {
            const imgElement = document.createElement('img');
            imgElement.src = imageUrl;
            imgElement.alt = `${ad.title} image`;
            imgElement.classList.add("ad-image");
            adItem.appendChild(imgElement);
        });

        const adDescription = document.createElement('h3')
        adDescription.textContent = ad.description
        adItem.appendChild(adDescription)

        const adPrice = document.createElement('h3')
        adPrice.textContent = `Price: ${ad.price}`
        adItem.appendChild(adPrice)

        const dateString = new Date(ad.date).toLocaleDateString()
        const adDate = document.createElement('h3')
        adDate.textContent = `Date Added: ${dateString}`
        adItem.appendChild(adDate)

        adList.appendChild(adItem);
    })
}

// Fix or delete this
// Function to render ads and their images
export function renderAdCarousel(ad) {
    const adItem = document.createElement('li');
    adItem.classList.add('ad-item');


    // move this down below teh carousel logic below?
    // point the carousel logic towards this object?
    // 
    // Create the title, description, price, and date
    // Create the title, description, price, and date
    adItem.innerHTML = `
        <h3>${ad.title}</h3>
        <div class="image-carousel" id="carousel-${ad.title.replace(/\s+/g, '-')}">
            <button class="arrow left" onclick="changeImage('${ad.title.replace(/\s+/g, '-')}', -1)">&#10094;</button>
            ${ad.images
            .map(
                (image, index) =>
                    `<img src="${image}" alt="${ad.title}" class="ad-image" style="display: ${index === 0 ? 'block' : 'none'
                    };">`
            )
            .join('')}
            <button class="arrow right" onclick="changeImage('${ad.title.replace(/\s+/g, '-')}', 1)">&#10095;</button>
        </div>
        <p>${ad.description}</p>
        <p>Price: $${ad.price}</p>
        <p>Date: ${new Date(ad.date).toLocaleDateString()}</p>
    `;

}

// Function to change images in the carousel
let currentImageIndex = 0;
export function changeImage(adTitle, direction) {
    const adItem = document.querySelector(`#carousel-${adTitle}`);
    const images = adItem.querySelectorAll('.ad-image');
    const totalImages = images.length;

    // Update current image index based on the direction
    currentImageIndex += direction;

    // Loop the image index if it goes out of bounds
    if (currentImageIndex < 0) {
        currentImageIndex = totalImages - 1;  // Go to the last image
    } else if (currentImageIndex >= totalImages) {
        currentImageIndex = 0;  // Go to the first image
    }

    // Hide all images
    images.forEach(image => image.style.display = 'none');

    // Show the selected image
    images[currentImageIndex].style.display = 'block';
}