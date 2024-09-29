mapboxgl.accessToken = mapToken;
// mapboxgl.coordinates = coordinates;

mapboxgl.accessToken = 'pk.eyJ1IjoiZ2FyZ2kyMDI1IiwiYSI6ImNtMWxrbmRlYjA4c2IyaXF0bnZ2MW83MTYifQ.9PiOUfSxfEs7JBQWEaCQFA';
const map = new mapboxgl.Map({
    container: 'map', // container ID
    style: 'mapbox://styles/mapbox/streets-v12',
    center: listing.geometry.coordinates, // starting position [lng, lat]. Note that lat must be set between -90 and 90
    zoom: 9 // starting zoom
});

const marker = new mapboxgl.Marker({color: "red"})
        .setLngLat(listing.geometry.coordinates) //Listing.geometry.coordinates
        .setPopup(new mapboxgl.Popup({offset: 25})
        .setHTML(`<h5> ${listing.location} </h5> <p> Exact Location will be provided after booking! </p>`))
        .addTo(map);