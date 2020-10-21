// import mapboxgl from 'mapbox-gl';
import { layers_array, level_uuids, load_geojsons, load_vectortiles, load_vectortiles_esri } from './src/app.js'

mapboxgl.accessToken = 'pk.eyJ1Ijoic2FuZGVybWVpamVyIiwiYSI6ImNrNjIwdDFpMjA2eTYza3Q2bGRibXlxNHIifQ.wiN3LYeCSfVswOH--fmrkA';
var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/dark-v10',
    center: [4.7627, 52.3097],
    zoom: 16
});

var preSerurityActive = true;
var hoveredStateId = null;
var highLightedStateId = null;
const level_el = document.querySelector('#levels')
const format_el = document.querySelector('#format')
const popup_el = document.querySelector('#popup')
const dataset_el = document.querySelector('#dataset')
window.map = map

const addLevelsToSelect = (f) => {
    if (f == 'geojson') {

        var start_level = 0

        level_uuids.map((e) => {
            var opt = document.createElement('option');
            if (start_level == e.text.short_name.en) start_level = e.value // get UUID of floor if start_level matches a floor
            opt.value = e.value;
            opt.innerHTML = e.text.short_name.en;
            level_el.appendChild(opt);
        })
        console.log('level_el',level_el)
        updateLevel(start_level)
    } else {
        var start_level = 0
        level_uuids.forEach((e) => level_uuids.pop(e))
        level_uuids.push({ 'value': "a94a5b0f-c2e3-4752-b614-f0883a51be03", 'text': -10 })
        level_uuids.push({ 'value': "4970e968-62a1-4303-994f-574363554935", 'text': 0 })
        level_uuids.push({ 'value': "429fc537-126f-4efe-950e-b2d844c7768b", 'text': 10 })
        level_uuids.push({ 'value': "02d40cff-3e1e-42ff-946b-773cd50d4d5a", 'text': 20 })
        level_uuids.push({ 'value': "90d277a4-41f8-4458-88e1-11c2c134d488", 'text': 30 })


        level_uuids.map((e) => {
            var opt = document.createElement('option');
            if (start_level == e.text) start_level = e.value // get UUID of floor if start_level matches a floor
            opt.value = e.value;
            opt.innerHTML = e.text;
            level_el.appendChild(opt);
        })
        updateLevel(start_level)
    }
}
const pickformat = () => {
    const f = format_el.value

    console.log('Format Demo:', f == 'geojson')
    layers_array.forEach((layer) => {
        if (typeof map.getLayer(layer) !== 'undefined') {
            console.log('removeing', layer)
            map.removeLayer(layer)
            if (!layer.includes('text_')) map.removeSource(layer)
        }
    })
    var prom
    if (f == 'geojson') {
        const dataset = dataset_el.value

        prom = load_geojsons('http://localhost:3002/'+dataset+'/', map)
    }
    else if (f == 'esrimvt') {
        prom = load_vectortiles_esri('https://arcgis.schiphol.nl/arcgishosted/rest/services/Hosted/Public_Indoor_Basemap_Derde_verdieping_VTP/VectorTileServer/tile/{z}/{x}/{y}.pbf', map)
    }
    else {
        prom = load_vectortiles('http://localhost:3002/esri/{z}/{x}/{y}.mvt', map)
    }
    prom.then(e => {
        addLevelsToSelect(f)
        followPrePostSecurity()
    })
}
const updateLevel = (value) => {
    if (value) level_el.value = value;
    level_el.dispatchEvent(new Event('change'))
}
const followPrePostSecurity = () => {
    const preAndPost = map.queryRenderedFeatures(null, { layers: layers_array.filter(e => ['geofence'].includes(e)) })
    const pre = preAndPost.filter(f => f.properties.category === "presecurity")
    const post = preAndPost.filter(f => f.properties.category === "postsecurity")
    pre.forEach(f => { map.setFeatureState({ source: 'geofence', id: f.id }, { hover: preSerurityActive ? true : false }); })
    post.forEach(f => { map.setFeatureState({ source: 'geofence', id: f.id }, { hover: preSerurityActive ? false : true }); })
}
// window.zoomTo = () => {
//     var coordinates = map.querySourceFeatures('amenity')[0].geometry.coordinates
//     console.log(map.querySourceFeatures('amenity')[0].properties.level_id == level_el.value, map.querySourceFeatures('amenity')[0].properties, map.querySourceFeatures('amenity')[0].geometry)
//     map.flyTo({ center: coordinates });
// }


map.on('load', function () {
    // For styling only, remove all other labels and train tunnel
    map.getStyle().layers.forEach(lyr => { if (lyr.type === 'symbol' || lyr.id.includes('pedestrian')) map.removeLayer(lyr.id) })

    // For demo only: pick a format
    format_el.onchange = () => pickformat()
    format_el.dispatchEvent(new Event('change'))

    dataset_el.onchange = () => pickformat()
    dataset_el.dispatchEvent(new Event('change'))

    console.log('loaded!')

    // Extra demo, filtering on Vector tiles based on floor (extra attribute...)
    level_el.onchange = (e) => {
        if (e.srcElement.value != 'all') {
            layers_array.filter((e) => e != 'level' && e != 'anchor').forEach((layer) => map.setFilter(layer, ["==", "level_id", e.srcElement.value]))
        } else {
            layers_array.filter((e) => e != 'level' && e != 'anchor').forEach((layer) => map.setFilter(layer, null))
        }
    }

});

map.on('click', function (e) {

    var features = map.queryRenderedFeatures([e.point.x, e.point.y], {
        layers: layers_array.filter(e => !
            ['geofence', 'level', 'anchor', 'text_occupant'].includes(e))
    });
    if (features.length == 0) return
    const types = features.map(f => f.layer.id)
    if (types.includes("unit")) {
        var unit_feature = features.filter(f => f.layer.id == "unit")[0]
        var related = map.queryRenderedFeatures(null, {
            layers: layers_array.filter(e => !['level', 'anchor', 'text_occupant'].includes(e)),
            filter: ['==', ['get', 'unit_id'], unit_feature.properties.id] // Select also what is in the unit
        })
        if (related.length > 0) {
            features.push(...related)

            new mapboxgl.Popup()
                .setLngLat(e.lngLat)
                .setHTML(related.map(f => {
                    map.setFeatureState({ source: 'unit', id: f.properties.id }, { hover: true });
                    var name = JSON.parse(f.properties.name)
                    var name_str
                    try {
                        name_str = name.en
                    } catch (e) {
                        name_str = f.properties.category
                    }
                    return `<h4>${name_str}</h4><table>
                    <tr><td>Layer</td><td>${f.layer.id}</td></tr>
                    <tr><td>ID</td><td>${f.properties.id}</td></tr>
                    <tr><td>Category</td><td>${f.properties.category} </td></tr>
                    <tr><td>Unit</td><td>${unit_feature.properties.category} (${unit_feature.properties.name})</td></tr>
        </table>`}).join("<HR />"))
                .addTo(map);
            return
        }
    }
    new mapboxgl.Popup()
        .setLngLat(e.lngLat)
        .setHTML(features.map(f => `<table>
        <tr><td>Layer</td><td>${f.layer.id}</td></tr>
        <tr><td>ID</td><td>${f.properties.id}</td></tr>
        <tr><td>Category</td><td>${f.properties.category}</td></tr>
        <tr><td>Name</td><td>${f.properties.name} (${f.properties.alt_name})</td></tr>
        <tr><td>Related</td><td>${f.properties.unit_id}</td></tr>
        </table>`).join("<HR />"))
        .addTo(map);


});
map.on('mousemove', 'geofence', function (e) {
    if (e.features.length > 0) {

        // Determinte what to do
        preSerurityActive = (e.features[0].properties.category == "presecurity") ? true : false;
        // But return if this already done
        if (e.features[0].properties.category == "presecurity" && !preSerurityActive
            ||
            e.features[0].properties.category == "postsecurity" && preSerurityActive
        ) { return }
        followPrePostSecurity()
    }
});


map.on('mousemove', 'unit', function (e) {
    if (e.features.length > 0) {
        if (hoveredStateId) { map.setFeatureState({ source: 'unit', id: hoveredStateId }, { hover: false }); }
        hoveredStateId = e.features[0].id;
        map.setFeatureState({ source: 'unit', id: hoveredStateId }, { hover: true });
    }
});

map.on('mouseleave', 'unit', function () {
    if (hoveredStateId) { map.setFeatureState({ source: 'unit', id: hoveredStateId }, { hover: false }); }
    hoveredStateId = null;
});