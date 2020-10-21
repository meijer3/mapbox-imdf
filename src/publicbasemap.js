export function imdf_styler (layer) {
    if (layer == 'unit') {
        return {
            'fill-color':
                ['match',
                    ['get', 'category'],
                    ['room'], ['case', ['boolean', ['feature-state', 'hover'], false], '#ffd9a4', '#FEEED8'],
                    ['walkway'], '#FEFEFE',
                    ['nonpublic'], '#C4BFB3',
                    ['escalator', 'stairs', 'elevator', 'ramp', 'restroom.unisex', 'restroom.male', 'restroom.female', 'restroom', 'parking', 'checkin'],
                    ['case', ['boolean', ['feature-state', 'hover'], false], '#ffd9a4', '#C7DADC'],
                    ['immigration', 'postsecurity'], 'red',
                    ['presecurity'], 'green',
                    ['security'], '#EECECF',
                    ['opentobelow'], '#eee',
                    ['privatelounge'], '#FEFEFE',
                    'grey'
                ],
            'fill-opacity': 1,
            "fill-outline-color": ['case',
                ['all', ['==', ['get', 'category'], 'room'], ['boolean', ['feature-state', 'hover'], false]],
                "rgba(37,37,37,1)",
                "rgba(37,37,37,0.3)"
            ],
        }
    } else if (layer == 'fixture') {
        return {
            'fill-extrusion-color': '#aaa',
            'fill-extrusion-height': 2.0,
            'fill-extrusion-base': 0.0,
            'fill-extrusion-opacity': 0.4
        }
    } else if (layer == 'kiosk') {
        return {
            'fill-extrusion-color': '#aaa',
            'fill-extrusion-height': 2.0,
            'fill-extrusion-base': 0.0,
            'fill-extrusion-opacity': 0.4
        }
    } else if (layer == 'amenity') {
        return {
            'circle-color': '#11b4da',
            'circle-radius': {
                "stops": [
                    [17, 2],
                    [22, 1]
                ]
            }
        }
    } else if (layer == 'occupant') {
        return {
            'circle-color': '#11b4da',
            'circle-radius': {
                "stops": [
                    [16, 4],
                    [19, 0]
                ]
            }
        }
    } else if (layer == 'section') {
        //[ "checkin", "immigration", "information", "gatearea", "security", "baggageclaim" ]
        return {
            'fill-color': {
                type: "categorical",
                property: "category",
                default: 'red',
                stops: [
                    // ['checkin', '#C4BFB3'],
                    ['immigration', "rgba(255,37,37,0.3)",],
                    // ['information', '#C4BFB3'],
                    // ['gatearea', '#EECECF'],
                    ['security', "rgba(255,37,37,0.3)",],
                    // ['baggageclaim', '#EECECF'],
                ]
            },

            "fill-outline-color": "rgba(255,37,37,1)",
        }
    } else if (layer == 'level') {
        return {
            'fill-color': '#191a1a'
        }
    } else if (layer == 'geofence') {
        return {
            'fill-color': 'rgba(0,0,0,0.7)',
            'fill-opacity': [
                'case',
                ['boolean', ['feature-state', 'hover'], false],
                0,
                1
            ]
        }
    } else if (layer == 'anchor') {
        return {
            'circle-color': '#11b4da',
            'circle-radius': {
                "stops": [
                    [17, 4],
                    [18, 0]
                ]
            }
        }
    }
    // else {
    //     return {
    //         'fill-color': '#ddd'
    //     }
    // }
}

export function imdf_labeler (layer) {
    if (layer == 'fixture') {
        return {
            'text-field': ['get', 'en', ['get', 'name']],
            'text-font': ['Roboto Regular', 'Arial Unicode MS Regular'],
            'text-offset': [0, 0.6],
            'text-anchor': 'top',
        }
    } else if (layer == 'amenity') {
        return {
            'text-field': ['get', 'category'],
            'text-font': ['Roboto Regular', 'Arial Unicode MS Regular'],
            "text-size": {
                "stops": [
                    [19, 5],
                    [22, 20]
                ]
            }
        }
    } else if (layer == 'occupant') {
        return {
            'text-field': ['get', 'en', ['get', 'name']],
            'text-font': ['Roboto Regular', 'Arial Unicode MS Regular'],
            "text-size": {
                "stops": [
                    [16, 5],
                    [22, 20]
                ]
            }
        }
    } else {
        return {
            'text-field': ['get', 'category'],
            'text-font': ['Roboto Regular', 'Arial Unicode MS Regular'],
            'text-offset': [0, 0.6],
            'text-anchor': 'top'
        }
    }
}

