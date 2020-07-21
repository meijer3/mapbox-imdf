import {imdf_styler, imdf_labeler} from './publicbasemap.js'

const addLayerToMap = (map, source, layer) => {
    map.addLayer({
        'id': layer,
        'source': source,
        // 'source-layer': layer,
        'type': ['fixture', 'kiosk'].includes(layer) ? 'fill-extrusion' : ['amenity', 'anchor','occupant'].includes(layer) ? 'circle' : 'fill',
        'minzoom': ['amenity'].includes(layer) ? 19 : ['occupant'].includes(layer) ? 16 : 10,
        'paint': imdf_styler(layer),

    })

    // Extra layers for text
    if (text_layers.includes(layer)) {
        layers_array.push("text_" + layer) // for filtering
        map.addLayer({
            'id': "text_" + layer,
            'source': source,
            //'source-layer': layer,
            'type': 'symbol',
            'minzoom': ['amenity'].includes(layer) ? 19 : ['occupant'].includes(layer) ? 16 : 18,
            'layout': imdf_labeler(layer)
        })
    }
}
const text_layers = ['amenity', 'anchor', 'fixture','occupant']
// const text_layers = ['amenity']
export const level_uuids = []
export const layers_array = [ // Top is on bottom...?
    'level',
    'unit',
    'anchor',
    'fixture',
    'kiosk',
    'amenity',
    'occupant',
    'section',
    // 'geofence',
]
const flattenRelationships = (geojsons) => {

    var unit_geojson = geojsons.filter(d => d.name == 'unit')[0]
    var anchor_geojson = geojsons.filter(d => d.name == 'anchor')[0]

    // UUIDs are NOT supported as feature.id (So moved it to properties and gave it an increasement)
    var i = 1;
    geojsons.map(geojson=>geojson.features.map(f=>{f.properties.id=f.id;f.id=i;i++;return f}))
    //https://www.schiphol.nl/api/maps/pois?channel=website
    geojsons.filter(d => d.name == 'level').forEach(d => d.features.forEach(f => level_uuids.push({ 'value': f.properties.id, 'text': f.properties })))
    
    // Amenity > unit
    geojsons.filter(d => d.name == 'amenity')[0].features.map(f=>unit_geojson.features.filter(unit=>f.properties.unit_ids.includes( unit.id ) )
    .map(unit=>{ f.properties.level_id = unit.properties.level_id;return f }))

    // Occupant > Anchor > unit
    geojsons.filter(d => d.name == 'occupant')[0].features.map(f=>{
        var anchor = anchor_geojson.features.filter(a=>f.properties.anchor_id == a.properties.id )[0]
        var unit = unit_geojson.features.filter(unit=>anchor.properties.unit_id == unit.properties.id  )[0]
        f.geometry = anchor.geometry
        f.properties.level_id = unit.properties.level_id
        return f
    })

    // Select only security areas
    geojsons.filter(d => d.name == 'section')
    .map(f=>{ f.features = f.features.filter( f=>['security','immigration'].includes(f.properties.category)); return f } )


    // LEVELS = 
    // geojsons.filter(d => d.name == 'geofence').map(fs=> fs.features.map(f => {f.properties.level_id = f.properties.level_ids[0]; return f } ) )


    
    // Return without anchor
    return geojsons.filter(d => d.name !== 'anchor')
}
export const load_geojsons = (url, map) => {
    return new Promise((resolve, reject) => {
        Promise.all(layers_array.map(layer => fetch(url + layer + '.geojson').then((r) => r.json())))
            .then(geojsons => {
                flattenRelationships(geojsons).forEach(geojson => {
                    map.addSource(geojson.name, { 'type': 'geojson', 'data': geojson })
                    addLayerToMap(map, geojson.name, geojson.name)
                })
                return resolve()
            })

    })
}
export const load_vectortiles = (url, map) => {
    var sourceName = 'imdf_mvt'
    map.addSource(sourceName, { 'type': 'vector', 'tiles': [url], })
    return new Promise((resolve, reject) => {
        console.log("mvt_>layers", map.querySourceFeatures('imdf_mvt', { sourceLayer: 'level' }))
        return resolve(layers_array.forEach(layer => {
            addLayerToMap(map, sourceName, layer)
        }))
    })
}

