document.addEventListener('DOMContentLoaded', (event) => {
    var map = L.map('map').setView([20.0, 0.0], 2);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    var locations = [
        {lat: 40.7128, lng: -74.0060, name: 'New York', article: 'https://en.wikipedia.org/wiki/New_York_City'},
        {lat: 51.5074, lng: -0.1278, name: 'London', article: 'https://en.wikipedia.org/wiki/London'},
        {lat: 41.726931, lng: -49.948253, name: 'Titanic Wreck', article: 'https://en.wikipedia.org/wiki/Wreck_of_the_RMS_Titanic'},
        {lat: 46.8182, lng: 8.2275, name: 'Switzerland', article: 'https://en.wikipedia.org/wiki/Switzerland'}  // Example point for Switzerland
    ];

    var markers = [];
    var latlngs = [];

    locations.forEach(function(location) {
        var marker = L.marker([location.lat, location.lng], {
            title: location.name
        }).addTo(map)
            .bindPopup(`<div><h2>${location.name}</h2><p><a href="${location.article}" target="_blank">${location.name} Wikipedia Article</a></p></div>`)
            .openPopup();

        marker.bindTooltip(location.name, {
            permanent: true,
            direction: 'top',
            className: 'label'
        });

        markers.push(marker);
        latlngs.push([location.lat, location.lng]);
    });

    var polyline = L.polyline(latlngs, {color: 'red'}).addTo(map);

    fetch('https://datahub.io/core/geo-countries/r/countries.geojson')
        .then(response => response.json())
        .then(data => {
            L.geoJSON(data, {
                style: {
                    color: 'green',
                    weight: 1,
                    fillColor: 'green',
                    fillOpacity: 0.2
                },
                onEachFeature: function(feature, layer) {
                    layer.bindTooltip(feature.properties.ADMIN, {
                        permanent: false,
                        direction: 'auto',
                        className: 'label'
                    });
                }
            }).addTo(map);
        });

    // Function to hide markers on small countries until zoomed in
    map.on('zoomend', function() {
        var currentZoom = map.getZoom();
        markers.forEach(function(marker, index) {
            if (locations[index].name === 'Switzerland') {
                if (currentZoom < 5) {
                    map.removeLayer(marker);
                } else {
                    map.addLayer(marker);
                }
            }
        });
    });

    // Initial check to hide Switzerland marker if zoom level is too low
    if (map.getZoom() < 5) {
        markers.forEach(function(marker, index) {
            if (locations[index].name === 'Switzerland') {
                map.removeLayer(marker);
            }
        });
    }
});
