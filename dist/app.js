"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.load_vectortiles = exports.load_geojsons = exports.layers_array = exports.level_uuids = void 0;

var _publicbasemap = require("./publicbasemap.js");

var addLayerToMap = function addLayerToMap(map, source, layer) {
  map.addLayer({
    'id': layer,
    'source': source,
    // 'source-layer': layer,
    'type': ['fixture', 'kiosk'].includes(layer) ? 'fill-extrusion' : ['amenity', 'anchor', 'occupant'].includes(layer) ? 'circle' : 'fill',
    'minzoom': ['amenity'].includes(layer) ? 19 : ['occupant'].includes(layer) ? 16 : 10,
    'paint': (0, _publicbasemap.imdf_styler)(layer)
  }); // Extra layers for text

  if (text_layers.includes(layer)) {
    layers_array.push("text_" + layer); // for filtering

    map.addLayer({
      'id': "text_" + layer,
      'source': source,
      //'source-layer': layer,
      'type': 'symbol',
      'minzoom': ['amenity'].includes(layer) ? 19 : ['occupant'].includes(layer) ? 16 : 18,
      'layout': (0, _publicbasemap.imdf_labeler)(layer)
    });
  }
};

var text_layers = ['amenity', 'anchor', 'fixture', 'occupant']; // const text_layers = ['amenity']

var level_uuids = [];
exports.level_uuids = level_uuids;
var layers_array = [// Top is on bottom...?
'level', 'unit', 'anchor', 'fixture', 'kiosk', 'amenity', 'occupant', 'section' // 'geofence',
];
exports.layers_array = layers_array;

var flattenRelationships = function flattenRelationships(geojsons) {
  var unit_geojson = geojsons.filter(function (d) {
    return d.name == 'unit';
  })[0];
  var anchor_geojson = geojsons.filter(function (d) {
    return d.name == 'anchor';
  })[0]; // UUIDs are NOT supported as feature.id (So moved it to properties and gave it an increasement)

  var i = 1;
  geojsons.map(function (geojson) {
    return geojson.features.map(function (f) {
      f.properties.id = f.id;
      f.id = i;
      i++;
      return f;
    });
  }); //https://www.schiphol.nl/api/maps/pois?channel=website

  geojsons.filter(function (d) {
    return d.name == 'level';
  }).forEach(function (d) {
    return d.features.forEach(function (f) {
      return level_uuids.push({
        'value': f.properties.id,
        'text': f.properties
      });
    });
  }); // Amenity > unit

  geojsons.filter(function (d) {
    return d.name == 'amenity';
  })[0].features.map(function (f) {
    return unit_geojson.features.filter(function (unit) {
      return f.properties.unit_ids.includes(unit.id);
    }).map(function (unit) {
      f.properties.level_id = unit.properties.level_id;
      return f;
    });
  }); // Occupant > Anchor > unit

  geojsons.filter(function (d) {
    return d.name == 'occupant';
  })[0].features.map(function (f) {
    var anchor = anchor_geojson.features.filter(function (a) {
      return f.properties.anchor_id == a.properties.id;
    })[0];
    var unit = unit_geojson.features.filter(function (unit) {
      return anchor.properties.unit_id == unit.properties.id;
    })[0];
    f.geometry = anchor.geometry;
    f.properties.level_id = unit.properties.level_id;
    return f;
  }); // Select only security areas

  geojsons.filter(function (d) {
    return d.name == 'section';
  }).map(function (f) {
    f.features = f.features.filter(function (f) {
      return ['security', 'immigration'].includes(f.properties.category);
    });
    return f;
  }); // LEVELS = 
  // geojsons.filter(d => d.name == 'geofence').map(fs=> fs.features.map(f => {f.properties.level_id = f.properties.level_ids[0]; return f } ) )
  // Return without anchor

  return geojsons.filter(function (d) {
    return d.name !== 'anchor';
  });
};

var load_geojsons = function load_geojsons(url, map) {
  return new Promise(function (resolve, reject) {
    Promise.all(layers_array.map(function (layer) {
      return fetch(url + layer + '.geojson').then(function (r) {
        return r.json();
      });
    })).then(function (geojsons) {
      flattenRelationships(geojsons).forEach(function (geojson) {
        map.addSource(geojson.name, {
          'type': 'geojson',
          'data': geojson
        });
        addLayerToMap(map, geojson.name, geojson.name);
      });
      return resolve();
    });
  });
};

exports.load_geojsons = load_geojsons;

var load_vectortiles = function load_vectortiles(url, map) {
  var sourceName = 'imdf_mvt';
  map.addSource(sourceName, {
    'type': 'vector',
    'tiles': [url]
  });
  return new Promise(function (resolve, reject) {
    console.log("mvt_>layers", map.querySourceFeatures('imdf_mvt', {
      sourceLayer: 'level'
    }));
    return resolve(layers_array.forEach(function (layer) {
      addLayerToMap(map, sourceName, layer);
    }));
  });
};

exports.load_vectortiles = load_vectortiles;