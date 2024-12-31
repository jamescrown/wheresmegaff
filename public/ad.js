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
    ads.forEach((ad, adIndex) => {
        const adItem = document.createElement('li');
        adItem.classList.add('ad-item');

        const adTitle = document.createElement('h3');
        adTitle.textContent = ad.title;
        adItem.appendChild(adTitle);

        // Create image carousel container
        const carouselContainer = document.createElement('div');
        carouselContainer.classList.add('image-carousel');
        carouselContainer.id = `carousel-${adIndex}`;

        // Add left arrow
        const leftArrow = document.createElement('button');
        leftArrow.classList.add('arrow', 'left');
        leftArrow.innerHTML = '&#10094;';
        leftArrow.onclick = () => changeImage(adIndex, -1);
        carouselContainer.appendChild(leftArrow);

        // Add images
        ad.images.forEach((imageUrl, imageIndex) => {
            const imgElement = document.createElement('img');
            imgElement.src = imageUrl;
            imgElement.alt = `${ad.title} image`;
            imgElement.classList.add("ad-image");
            imgElement.style.display = imageIndex === 0 ? 'block' : 'none';
            carouselContainer.appendChild(imgElement);
        });

        // Add right arrow
        const rightArrow = document.createElement('button');
        rightArrow.classList.add('arrow', 'right');
        rightArrow.innerHTML = '&#10095;';
        rightArrow.onclick = () => changeImage(adIndex, 1);
        carouselContainer.appendChild(rightArrow);

        adItem.appendChild(carouselContainer);

        const adDescription = document.createElement('p');
        adDescription.textContent = ad.description;
        adItem.appendChild(adDescription);

        const adPrice = document.createElement('p');
        adPrice.textContent = `Price: ${ad.price}`;
        adItem.appendChild(adPrice);

        const dateString = new Date(ad.date).toLocaleDateString();
        const adDate = document.createElement('p');
        adDate.textContent = `Date Added: ${dateString}`;
        adItem.appendChild(adDate);

        adList.appendChild(adItem);
    });
}

// Function to change images in the carousel
export function changeImage(adIndex, direction) {
    const carousel = document.querySelector(`#carousel-${adIndex}`);
    const images = carousel.querySelectorAll('.ad-image');
    const totalImages = images.length;

    let currentImageIndex = Array.from(images).findIndex(img => img.style.display === 'block');
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