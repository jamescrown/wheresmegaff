import { loadAds } from './ad.js';

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
