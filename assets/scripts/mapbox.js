'use strict';

let mymap = L.map('mapid').setView([-0.0610732,109.3422024], 13);

L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href=\'https://www.openstreetmap.org/\'>OpenStreetMap</a> contributors, <a href=\'https://creativecommons.org/licenses/by-sa/2.0/\'>CC-BY-SA</a>, Imagery © <a href=\'https://www.mapbox.com/\'>Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox.streets',
    accessToken: 'pk.eyJ1IjoiaW5kcmFtYWhrb3RhIiwiYSI6ImNqbmV0ZXY1MDEzaHQzcXBsZW9qeGlwOG0ifQ.PMT988D2Cjhph1mY9e92wQ'
}).addTo(mymap);

let circle = L.circle([-0.032973, 109.322001], {
    color: '#2f3ba2',
    fillColor: '#8dfecd',
    fillOpacity: 0.25,
    weight: 1,
    radius: 2000
}).addTo(mymap);

(async () => {
    if(localStorage.getItem('places') == null){
        try {
            let resp = await(fetch('assets/jsons/peta.json'));
            let resp2 = await resp.json();
            localStorage.setItem('places', JSON.stringify(resp2.places));
        }
        catch(err){
            console.log(err);
        }
    }

    let places = JSON.parse(localStorage.getItem('places'));
    for (let str of places){
        let marker = L.marker(str.posisi).addTo(mymap);
        marker.gambar = str.gambar;
        marker.respon = str.respon;
        marker.bindPopup(`<center><b>${str.nama}</b><br>${str.keterangan}</center>`).openPopup()
            .on('click', () => {
                document.getElementById('respon').innerHTML = marker.respon;
                document.getElementById('gambar').src = marker.gambar;
            });
    }
})();
