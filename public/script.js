// Show the modal
const placeAdButton = document.getElementById('placeAdButton');
const adModal = document.getElementById('adModal');
const submitAdButton = document.getElementById('submitAdButton');
const cancelAdButton = document.getElementById('cancelAdButton');

placeAdButton.addEventListener('click', () => {
    adModal.style.display = 'block';
});

// Hide the modal
cancelAdButton.addEventListener('click', () => {
    adModal.style.display = 'none';
});

// Submit the ad
submitAdButton.addEventListener('click', async () => {
    const formData = new FormData();
    formData.append('title', document.getElementById('adTitle').value);
    formData.append('description', document.getElementById('adDescription').value);
    formData.append('price', document.getElementById('adPrice').value);
    formData.append('type', document.getElementById('adType').value);

    const images = document.getElementById('adImages').files;
    for (let i = 0; i < images.length; i++) {
        formData.append('images', images[i]);
    }

    try {
        const response = await fetch('/place-ad', {
            method: 'POST',
            body: formData
        });

        if (response.ok) {
            alert("Ad placed successfully!");
            document.getElementById('adModal').style.display = 'none';
        } else {
            alert("Failed to place ad.");
        }
    } catch (error) {
        console.error("Error placing ad:", error);
    }
});

document.querySelector('.btn-buy').addEventListener('click', () => loadAds('Buy'));
document.querySelector('.btn-rent').addEventListener('click', () => loadAds('Rent'));

async function loadAds(type) {
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

function displayAds(ads, type) {
    const main = document.querySelector('main');
    main.innerHTML = `<h2>${type} Listings</h2>`;

    if (ads.length === 0) {
        main.innerHTML += `<p>No ${type.toLowerCase()} listings available.</p>`;
    } else {
        const adList = document.createElement('ul');
        adList.className = 'ad-list';
        ads.forEach(ad => {
            const adItem = document.createElement('li');
            adItem.innerHTML = `
                <h3>${ad.title}</h3>
                ${ad.images.map(image => `<img src="${image}" alt="${ad.title}" class="ad-image">`).join('')}
                <p>${ad.description}</p>
                <p>Price: $${ad.price}</p>
                <p>Date: ${new Date(ad.date).toLocaleDateString()}</p>
            `;
            adList.appendChild(adItem);
        });
        main.appendChild(adList);
    }

    // Add a back button
    const backButton = document.createElement('button');
    backButton.textContent = 'Back';
    backButton.addEventListener('click', () => location.reload());
    main.appendChild(backButton);
}

// Assuming ad.images is an array like ['image1.jpg', 'image2.jpg', 'image3.jpg']
let currentImageIndex = 0;

function changeImage(direction) {
    const images = document.querySelectorAll('.ad-image');
    const totalImages = images.length;

    // Update the current image index based on direction
    currentImageIndex += direction;

    // Loop the image index if it goes out of bounds
    if (currentImageIndex < 0) {
        currentImageIndex = totalImages - 1;  // Go to the last image if we're at the first one
    } else if (currentImageIndex >= totalImages) {
        currentImageIndex = 0;  // Go back to the first image if we're at the last one
    }

    // Hide all images
    images.forEach(image => image.style.display = 'none');

    // Show the selected image
    images[currentImageIndex].style.display = 'block';
}

// Loop through all ad items and apply carousel functionality
document.addEventListener('DOMContentLoaded', () => {
    const adItems = document.querySelectorAll('.ad-item');

    adItems.forEach((adItem, index) => {
        const images = adItem.querySelectorAll('.ad-image');
        if (images.length > 1) {
            // Show the first image initially
            images.forEach((image, idx) => {
                image.style.display = (idx === 0) ? 'block' : 'none';
            });
        }
    });
});