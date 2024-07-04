document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('calculateButton').addEventListener('click', async () => {
        const originAddress = document.getElementById('originInput').value.trim();
        const destinationAddress = document.getElementById('destinationInput').value.trim();

        if (!originAddress || !destinationAddress) {
            displayResult('Please enter both origin and destination addresses.', 'danger');
            return;
        }

        try {
            const originCoords = await geocode(originAddress);
            const destinationCoords = await geocode(destinationAddress);

            calculateRoute(originCoords, destinationCoords);
        } catch (error) {
            displayResult(`Error geocoding address: ${error.message}`, 'danger');
        }
    });

    document.getElementById('darkModeToggle').addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
        const icon = document.getElementById('darkModeToggle').querySelector('i');
        icon.classList.toggle('fa-moon');
        icon.classList.toggle('fa-sun');
    });
});

function displayResult(message, type) {
    const resultDiv = document.getElementById('result');
    resultDiv.className = `alert alert-${type}`;
    resultDiv.innerHTML = message;
    resultDiv.style.display = 'block';
}

function calculateRoute(origin, destination) {
    const url = `https://router.project-osrm.org/route/v1/driving/${origin.longitude},${origin.latitude};${destination.longitude},${destination.latitude}?overview=full&geometries=geojson`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            if (data.routes && data.routes.length > 0) {
                const routeCoordinates = data.routes[0].geometry.coordinates;

                routeLayer.clearLayers();

                const polyline = L.polyline(routeCoordinates.map(coord => [coord[1], coord[0]]), {
                    color: 'blue'
                }).addTo(routeLayer);

                map.fitBounds(polyline.getBounds());

                const distanceMeters = data.routes[0].distance;
                const distanceMiles = distanceMeters * 0.000621371;
                const durationSeconds = data.routes[0].duration;

                const formattedDistance = distanceMiles.toFixed(2) + ' miles';
                const formattedDuration = formatDuration(durationSeconds);

                displayResult(`Distance: ${formattedDistance}<br>Duration: ${formattedDuration}`, 'success');
            } else {
                displayResult('No route found.', 'danger');
            }
        })
        .catch(error => {
            displayResult(`Error fetching route data: ${error.message}`, 'danger');
        });
}

function formatDuration(seconds) {
    const days = Math.floor(seconds / (3600 * 24));
    seconds -= days * 3600 * 24;
    const hours = Math.floor(seconds / 3600);
    seconds -= hours * 3600;
    const minutes = Math.floor(seconds / 60);

    return `${days}d ${hours}h ${minutes}m`;
}

const map = L.map('map').setView([0, 0], 2);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
}).addTo(map);

const routeLayer = L.layerGroup().addTo(map);
