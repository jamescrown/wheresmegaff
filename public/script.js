import { loadAds, changeImage } from './ad.js';

// Show the modal
const placeAdButton = document.getElementById('placeAdButton');
const adModal = document.getElementById('adModal');
const submitAdButton = document.getElementById('submitAdButton');
const cancelAdButton = document.getElementById('cancelAdButton');

document.querySelector('.btn-buy').addEventListener('click', () => {
    loadAds('Buy').then(() => {
        initializeCarousels();
    });
});

document.querySelector('.btn-rent').addEventListener('click', () => {
    loadAds('Rent').then(() => {
        initializeCarousels();
    });
});
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

// Initialize carousels and apply functionality
function initializeCarousels() {
    const carousels = document.querySelectorAll('.image-carousel');

    carousels.forEach((carousel, index) => {
        const track = carousel.querySelector('.carousel-track');
        const images = track.querySelectorAll('.ad-image');
        if (images.length > 1) {
            const imageWidth = images[0].clientWidth;
            track.style.width = `${imageWidth * images.length}px`;

            // Add event listeners for arrows
            const leftArrow = carousel.querySelector('.arrow.left');
            const rightArrow = carousel.querySelector('.arrow.right');

            leftArrow.addEventListener('click', () => changeImage(index, -1));
            rightArrow.addEventListener('click', () => changeImage(index, 1));
        }
    });
}

// Modify the existing DOMContentLoaded event listener
document.addEventListener('DOMContentLoaded', () => {
    // Load initial ads (e.g., 'Buy' ads)
    loadAds('Buy').then(() => {
        initializeCarousels();
    });
});
