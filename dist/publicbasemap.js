"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.imdf_styler = imdf_styler;
exports.imdf_labeler = imdf_labeler;

function imdf_styler(layer) {
  if (layer == 'unit') {
    return {
      'fill-color': {
        type: "categorical",
        property: "category",
        "default": 'red',
        stops: [['nonpublic', '#C4BFB3'], ['escalator', '#C7DADC'], ['stairs', '#C7DADC'], ['elevator', '#C7DADC'], ['ramp', '#C7DADC'], ['restroom.unisex', '#C7DADC'], ['restroom.male', '#C7DADC'], ['restroom.female', '#C7DADC'], ['restroom', '#C7DADC'], ['parking', '#C7DADC'], ['checkin', '#C7DADC'], ['immigration', 'red'], ['postsecurity', 'red'], ['presecurity', 'green'], // ['unspecified', 'red'],
        ['walkway', '#FEFEFE'], ['walkway_seperately', '#FEFEFE'], ['room', '#FEEED8'], ['security', '#EECECF'], ['0-Vides', 'rgba(114,114,114,0.75)'], ['privatelounge', '#EECECF']]
      },
      'fill-opacity': 1,
      "fill-outline-color": "rgba(37,37,37,0.3)"
    };
  } else if (layer == 'fixture') {
    return {
      'fill-extrusion-color': '#aaa',
      'fill-extrusion-height': 2.0,
      'fill-extrusion-base': 0.0,
      'fill-extrusion-opacity': 0.4
    };
  } else if (layer == 'kiosk') {
    return {
      'fill-extrusion-color': '#aaa',
      'fill-extrusion-height': 2.0,
      'fill-extrusion-base': 0.0,
      'fill-extrusion-opacity': 0.4
    };
  } else if (layer == 'amenity') {
    return {
      'circle-color': '#11b4da',
      'circle-radius': {
        "stops": [[17, 2], [22, 1]]
      }
    };
  } else if (layer == 'occupant') {
    return {
      'circle-color': '#11b4da',
      'circle-radius': {
        "stops": [[17, 4], [18, 0]]
      }
    };
  } else if (layer == 'section') {
    //[ "checkin", "immigration", "information", "gatearea", "security", "baggageclaim" ]
    return {
      'fill-color': {
        type: "categorical",
        property: "category",
        "default": 'red',
        stops: [// ['checkin', '#C4BFB3'],
        ['immigration', "rgba(255,37,37,0.3)"], // ['information', '#C4BFB3'],
        // ['gatearea', '#EECECF'],
        ['security', "rgba(255,37,37,0.3)"] // ['baggageclaim', '#EECECF'],
        ]
      },
      "fill-outline-color": "rgba(255,37,37,1)"
    };
  } else if (layer == 'level') {
    return {
      'fill-color': '#aaa'
    };
  } else if (layer == 'geofence') {
    return {
      'fill-color': 'rgba(0,0,0,0.3)',
      'fill-opacity': ['case', ['boolean', ['feature-state', 'hover'], false], 0, 1]
    };
  } else {
    return {
      'fill-color': '#ddd'
    };
  }
}

function imdf_labeler(layer) {
  if (layer == 'fixture') {
    return {
      'text-field': ['get', 'en', ['get', 'name']],
      'text-font': ['Roboto Regular', 'Arial Unicode MS Regular'],
      'text-offset': [0, 0.6],
      'text-anchor': 'top'
    };
  } else if (layer == 'amenity') {
    return {
      'text-field': ['get', 'category'],
      'text-font': ['Roboto Regular', 'Arial Unicode MS Regular'],
      "text-size": {
        "stops": [[19, 5], [22, 20]]
      }
    };
  } else if (layer == 'occupant') {
    return {
      'text-field': ['get', 'en', ['get', 'name']],
      'text-font': ['Roboto Regular', 'Arial Unicode MS Regular'],
      "text-size": {
        "stops": [[16, 5], [22, 20]]
      }
    };
  } else {
    return {
      'text-field': ['get', 'category'],
      'text-font': ['Roboto Regular', 'Arial Unicode MS Regular'],
      'text-offset': [0, 0.6],
      'text-anchor': 'top'
    };
  }
}