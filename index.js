export default publicstyle = () => {
    return {"fill-color": {
        "type": "categorical",
        property: "category",
        stops:[
            ['nonpublic', '#C4BFB3'],
            ['escalator', '#C7DADC'],
            ['stairs', '#C7DADC'],
            ['elevator', '#C7DADC'],
            ['ramp', '#C7DADC'],
            ['restroom.unisex', '#C7DADC'],
            ['restroom.male', '#C7DADC'],
            ['restroom.female', '#C7DADC'],
            ['restroom', '#C7DADC'],
            ['parking', '#C7DADC'],
            ['checkin', '#C7DADC'],
            ['immigration', 'red'],
            ['postsecurity', 'red'],
            ['presecurity', 'green'],
            ['unspecified', 'red'],
            ['walkway', '#FEFEFE'],
            ['walkway_seperately', '#FEFEFE'],
            ['room', '#FEEED8'],
            ['security', '#EECECF'],
            ['0-Vides', 'rgba(114,114,114,0.75)'],
            

            ['privatelounge','#EECECF']

        ]                
    },
    'fill-opacity': 1,
    "fill-outline-color": "rgba(37,37,37,0.3)"};
}