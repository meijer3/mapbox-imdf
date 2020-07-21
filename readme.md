# Load a standard layout in for a mapbox project
This module has 3 components
- `layers` which is a array of strings with names of the layers in IMDF
- `load_vectortiles(url, map)` adds IMDF to mapbox map with standard styling
- `load_geojson(url,map)` adds IMDF to mapbox map with standard styling

Styling can be overruled later
`map.setPaintProperty('fixture',' opacity', 0.4);`
## Get started 
Run this in a terminal (cmd): `npm install mapbox-imdf`

A small full example is here:
```
<!DOCTYPE html>
<html>
    <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="initial-scale=1,maximum-scale=1,user-scalable=no" />
        <script src="https://api.mapbox.com/mapbox-gl-js/v1.11.1/mapbox-gl.js"></script>
        <link href="https://api.mapbox.com/mapbox-gl-js/v1.11.1/mapbox-gl.css" rel="stylesheet" />
        <style>
            body { margin: 0; padding: 0; }
            #map { position: absolute; top: 0; bottom: 0; width: 100%; }
        </style>
    </head>
    <body>
        <div id="map"></div>
        <script type="module">
    import {layers, load_vectortiles} from './src/app.js'

    mapboxgl.accessToken = < PLACE YOUR TOKEN HERE! >;
    var map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/mapbox/streets-v11', // This is a basemap
        center: [4.7627, 52.3097],
        zoom: 16
    });
    map.on('load', function() {
        load_geojsons('http://localhost:3001/geojson/', map).then((e)=>console.log('Loaded!'))
    });
        </script>
    </body>
</html>
```