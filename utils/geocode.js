async function geocode(address) {
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`;

    try {
        const response = await fetch(url, {
            headers: {
                'User-Agent': 'route-distance-calculator',
                'Accept-Language': 'en-US,en;q=0.5'
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        if (data.length === 0) {
            throw new Error('No results found');
        }

        const { lat, lon } = data[0];
        return {
            latitude: parseFloat(lat),
            longitude: parseFloat(lon)
        };
    } catch (error) {
        console.error('Geocoding error:', error);
        throw error;
    }
}
