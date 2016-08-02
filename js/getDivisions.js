function getRegions(countries) {
    return [
        {
            type: "FeatureCollection",
            name: "Africa",
            color: "#ffbb78",
            id: 2,
            features: countries.features.filter(function (d) {
                return d.properties["REGION"] == 2;
            })
        },
        {
            type: "FeatureCollection",
            name: "Americas",
            color: "#2ca02c",
            id: 19,
            features: countries.features.filter(function (d) {
                return d.properties["REGION"] == 19;
            })
        },
        {
            type: "FeatureCollection",
            name: "Asia",
            color: "#ff7f0e",
            id: 142,
            features: countries.features.filter(function (d) {
                return d.properties["REGION"] == 142;
            })
        },
        {
            type: "FeatureCollection",
            name: "Europe",
            color: "#1f77b4",
            id: 150,
            features: countries.features.filter(function (d) {
                return d.properties["REGION"] == 150;
            })
        },
        {
            type: "FeatureCollection",
            name: "Oceania",
            color: "#aec7e8",
            id: 9,
            features: countries.features.filter(function (d) {
                return d.properties["REGION"] == 9;
            })
        }
    ];
}

function getSubregions(countries) {
    return [
        {
            type: "FeatureCollection",
            name: "Australia and New Zealand",
            color: "#ffbb78",
            id: 53,
            features: countries.features.filter(function (d) {
                return d.properties["SUBREGION"] == 53;
            })
        },
        {
            type: "FeatureCollection",
            name: "Caribbean",
            color: "#2ca02c",
            id: 29,
            features: countries.features.filter(function (d) {
                return d.properties["SUBREGION"] == 29;
            })
        },
        {
            type: "FeatureCollection",
            name: "Central America",
            color: "#ff7f0e",
            id: 13,
            features: countries.features.filter(function (d) {
                return d.properties["SUBREGION"] == 13;
            })
        },
        {
            type: "FeatureCollection",
            name: "Central Asia",
            color: "#ff7f0e",
            id: 143,
            features: countries.features.filter(function (d) {
                return d.properties["SUBREGION"] == 143;
            })
        },
        {
            type: "FeatureCollection",
            name: "Eastern Africa",
            color: "#aec7e8",
            id: 14,
            features: countries.features.filter(function (d) {
                return d.properties["SUBREGION"] == 14;
            })
        },
        {
            type: "FeatureCollection",
            name: "Eastern Asia",
            color: "#ffbb78",
            id: 30,
            features: countries.features.filter(function (d) {
                return d.properties["SUBREGION"] == 30;
            })
        },
        {
            type: "FeatureCollection",
            name: "Eastern Europe",
            color: "#2ca02c",
            id: 151,
            features: countries.features.filter(function (d) {
                return d.properties["SUBREGION"] == 151;
            })
        },
        {
            type: "FeatureCollection",
            name: "Melanesia",
            color: "#ff7f0e",
            id: 54,
            features: countries.features.filter(function (d) {
                return d.properties["SUBREGION"] == 54;
            })
        },
        {
            type: "FeatureCollection",
            name: "Micronesia",
            color: "#1f77b4",
            id: 57,
            features: countries.features.filter(function (d) {
                return d.properties["SUBREGION"] == 57;
            })
        },
        {
            type: "FeatureCollection",
            name: "Middle Africa",
            color: "#ffbb78",
            id: 17,
            features: countries.features.filter(function (d) {
                return d.properties["SUBREGION"] == 17;
            })
        },
        {
            type: "FeatureCollection",
            name: "Northern Africa",
            color: "#2ca02c",
            id: 15,
            features: countries.features.filter(function (d) {
                return d.properties["SUBREGION"] == 15;
            })
        },
        {
            type: "FeatureCollection",
            name: "Northern America",
            color: "#ff7f0e",
            id: 21,
            features: countries.features.filter(function (d) {
                return d.properties["SUBREGION"] == 21;
            })
        },
        {
            type: "FeatureCollection",
            name: "Northern Europe",
            color: "#1f77b4",
            id: 154,
            features: countries.features.filter(function (d) {
                return d.properties["SUBREGION"] == 154;
            })
        },
        {
            type: "FeatureCollection",
            name: "Polynesia",
            color: "#ffbb78",
            id: 61,
            features: countries.features.filter(function (d) {
                return d.properties["SUBREGION"] == 61;
            })
        },
        {
            type: "FeatureCollection",
            name: "Southern America",
            color: "#2ca02c",
            id: 5,
            features: countries.features.filter(function (d) {
                return d.properties["SUBREGION"] == 5;
            })
        },
        {
            type: "FeatureCollection",
            name: "South-Eastern Asia",
            color: "#ff7f0e",
            id: 35,
            features: countries.features.filter(function (d) {
                return d.properties["SUBREGION"] == 35;
            })
        },
        {
            type: "FeatureCollection",
            name: "Southern Africa",
            color: "#1f77b4",
            id: 18,
            features: countries.features.filter(function (d) {
                return d.properties["SUBREGION"] == 18;
            })
        },
        {
            type: "FeatureCollection",
            name: "Southern Asia",
            color: "#ffbb78",
            id: 34,
            features: countries.features.filter(function (d) {
                return d.properties["SUBREGION"] == 34;
            })
        },
        {
            type: "FeatureCollection",
            name: "Southern Europe",
            color: "#2ca02c",
            id: 39,
            features: countries.features.filter(function (d) {
                return d.properties["SUBREGION"] == 39;
            })
        },
        {
            type: "FeatureCollection",
            name: "Western Africa",
            color: "#ff7f0e",
            id: 11,
            features: countries.features.filter(function (d) {
                return d.properties["SUBREGION"] == 11;
            })
        },
        {
            type: "FeatureCollection",
            name: "Western Asia",
            color: "#1f77b4",
            id: 145,
            features: countries.features.filter(function (d) {
                return d.properties["SUBREGION"] == 145;
            })
        },
        {
            type: "FeatureCollection",
            name: "Western Europe",
            color: "#1f77b4",
            id: 155,
            features: countries.features.filter(function (d) {
                return d.properties["SUBREGION"] == 155;
            })
        }
    ];
}