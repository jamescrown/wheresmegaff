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

        // Create carousel track
        const carouselTrack = document.createElement('div');
        carouselTrack.classList.add('carousel-track');

        // Add images to the track
        const imagePromises = ad.images.map((imageUrl, imageIndex) => {
            return new Promise((resolve, reject) => {
                const imgElement = new Image();
                imgElement.onload = () => {
                    imgElement.classList.add("ad-image");
                    carouselTrack.appendChild(imgElement);
                    resolve();
                };
                imgElement.onerror = reject;
                imgElement.src = imageUrl;
                imgElement.alt = `${ad.title} image ${imageIndex + 1}`;
            });
        });

        Promise.all(imagePromises).then(() => {
            carouselContainer.appendChild(carouselTrack);

            // Add left arrow
            const leftArrow = document.createElement('button');
            leftArrow.classList.add('arrow', 'left');
            leftArrow.innerHTML = '&#10094;';
            leftArrow.onclick = () => changeImage(adIndex, -1);
            carouselContainer.appendChild(leftArrow);

            // Add right arrow
            const rightArrow = document.createElement('button');
            rightArrow.classList.add('arrow', 'right');
            rightArrow.innerHTML = '&#10095;';
            rightArrow.onclick = () => changeImage(adIndex, 1);
            carouselContainer.appendChild(rightArrow);

            adItem.appendChild(carouselContainer);

            // Adjust carousel size after images are loaded
            adjustCarouselSize(carouselContainer);
        });

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

function adjustCarouselSize(carouselContainer) {
    const images = carouselContainer.querySelectorAll('.ad-image');
    let maxHeight = 0;

    images.forEach(img => {
        const ratio = img.naturalWidth / img.naturalHeight;
        const height = carouselContainer.offsetWidth / ratio;
        maxHeight = Math.max(maxHeight, height);
    });

    carouselContainer.style.height = `${Math.min(maxHeight, 400)}px`; // Cap at 400px
}

// Function to change images in the carousel
export function changeImage(adIndex, direction) {
    const carousel = document.querySelector(`#carousel-${adIndex}`);
    const track = carousel.querySelector('.carousel-track');
    const images = track.querySelectorAll('.ad-image');
    const imageWidth = images[0].clientWidth;

    let currentPosition = parseInt(track.style.transform.replace('translateX(', '').replace('px)', '') || '0');
    // Reverse the direction of the slide
    let newPosition = currentPosition - direction * imageWidth;

    // Check boundaries
    if (newPosition < -(images.length - 1) * imageWidth) {
        newPosition = 0;
    } else if (newPosition > 0) {
        newPosition = -(images.length - 1) * imageWidth;
    }

    track.style.transform = `translateX(${newPosition}px)`;
}