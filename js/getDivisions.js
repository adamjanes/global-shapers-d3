function getRegions(countries) {
    return [
        {
            type: "FeatureCollection",
            name: "Africa",
            color: "#ffbb78",
            id: 2,
            features: countries.features.filter(function (d) {
                return d.properties["REGION"] == "Africa";
            })
        },
        {
            type: "FeatureCollection",
            name: "Americas",
            color: "#2ca02c",
            id: 19,
            features: countries.features.filter(function (d) {
                return d.properties["REGION"] == "Americas";
            })
        },
        {
            type: "FeatureCollection",
            name: "Asia",
            color: "#ff7f0e",
            id: 142,
            features: countries.features.filter(function (d) {
                return d.properties["REGION"] == "Asia";
            })
        },
        {
            type: "FeatureCollection",
            name: "Europe",
            color: "#1f77b4",
            id: 150,
            features: countries.features.filter(function (d) {
                return d.properties["REGION"] == "Europe";
            })
        },
        {
            type: "FeatureCollection",
            name: "Oceania",
            color: "#aec7e8",
            id: 9,
            features: countries.features.filter(function (d) {
                return d.properties["REGION"] == "Oceania";
            })
        }
    ];
}

function getSubregions(countries) {
    return [
        {
            type: "FeatureCollection",
            name: "East Asia & Pacific",
            color: "#ffbb78",
            id: 53,
            features: countries.features.filter(function (d) {
                return d.properties["SUBREGION"] == "East Asia & Pacific";
            })
        },
        {
            type: "FeatureCollection",
            name: "Latin America & Caribbean",
            color: "#2ca02c",
            id: 29,
            features: countries.features.filter(function (d) {
                return d.properties["SUBREGION"] == "Latin America & Caribbean";
            })
        },
        {
            type: "FeatureCollection",
            name: "Eurasia",
            color: "#ff7f0e",
            id: 143,
            features: countries.features.filter(function (d) {
                return d.properties["SUBREGION"] == "Eurasia";
            })
        },
        {
            type: "FeatureCollection",
            name: "Sub-Saharan Africa",
            color: "#aec7e8",
            id: 14,
            features: countries.features.filter(function (d) {
                return d.properties["SUBREGION"] == "Sub-Saharan Africa";
            })
        },
        {
            type: "FeatureCollection",
            name: "Europe",
            color: "#2ca02c",
            id: 151,
            features: countries.features.filter(function (d) {
                return d.properties["SUBREGION"] == "Europe";
            })
        },
        {
            type: "FeatureCollection",
            name: "Middle East & North Africa",
            color: "#2ca02c",
            id: 15,
            features: countries.features.filter(function (d) {
                return d.properties["SUBREGION"] == "Middle East & North Africa";
            })
        },
        {
            type: "FeatureCollection",
            name: "North America",
            color: "#ff7f0e",
            id: 21,
            features: countries.features.filter(function (d) {
                return d.properties["SUBREGION"] == "North America";
            })
        },
        {
            type: "FeatureCollection",
            name: "South Asia",
            color: "#ffbb78",
            id: 34,
            features: countries.features.filter(function (d) {
                return d.properties["SUBREGION"] == "South Asia";
            })
        },
        {
            type: "FeatureCollection",
            name: "N/A",
            color: "#ffbb78",
            id: 34,
            features: countries.features.filter(function (d) {
                return d.properties["SUBREGION"] == "#N/A";
            })
        }
    ];
}

function getDevRegions(countries) {
    return [
        {
            type: "FeatureCollection",
            name: "Very High Human Development",
            color: "#ffbb78",
            id: 2,
            features: countries.features.filter(function (d) {
                return d.properties["DEVELOPMENT"] == "VERY HIGH HUMAN DEVELOPMENT";
            })
        },
        {
            type: "FeatureCollection",
            name: "High Human Development",
            color: "#2ca02c",
            id: 19,
            features: countries.features.filter(function (d) {
                return d.properties["DEVELOPMENT"] == "HIGH HUMAN DEVELOPMENT";
            })
        },
        {
            type: "FeatureCollection",
            name: "Medium Human Development",
            color: "#2ca02c",
            id: 19,
            features: countries.features.filter(function (d) {
                return d.properties["DEVELOPMENT"] == "MEDIUM HUMAN DEVELOPMENT";
            })
        },        {
            type: "FeatureCollection",
            name: "Low Human Development",
            color: "#2ca02c",
            id: 19,
            features: countries.features.filter(function (d) {
                return d.properties["DEVELOPMENT"] == "LOW HUMAN DEVELOPMENT";
            })
        },
        {
            type: "FeatureCollection",
            name: "Very Low Human Development",
            color: "#2ca02c",
            id: 19,
            features: countries.features.filter(function (d) {
                return d.properties["DEVELOPMENT"] == "VERY LOW HUMAN DEVELOPMENT";
            })
        },
        {
            type: "FeatureCollection",
            name: "N/A",
            color: "#ffbb78",
            id: 34,
            features: countries.features.filter(function (d) {
                return d.properties["DEVELOPMENT"] == "#N/A";
            })
        }
    ];
}

function getIncomeRegions(countries) {
    return [
        {
            type: "FeatureCollection",
            name: "High Income",
            color: "#ffbb78",
            id: 2,
            features: countries.features.filter(function (d) {
                return d.properties["INCOME"] == "High income";
            })
        },
        {
            type: "FeatureCollection",
            name: "Upper Middle Income",
            color: "#ffbb78",
            id: 2,
            features: countries.features.filter(function (d) {
                return d.properties["INCOME"] == "Upper middle income";
            })
        },
        {
            type: "FeatureCollection",
            name: "Lower Middle Income",
            color: "#ffbb78",
            id: 2,
            features: countries.features.filter(function (d) {
                return d.properties["INCOME"] == "Lower middle income";
            })
        },
        {
            type: "FeatureCollection",
            name: "Low Income",
            color: "#ffbb78",
            id: 2,
            features: countries.features.filter(function (d) {
                return d.properties["INCOME"] == "Low income";
            })
        },
        {
            type: "FeatureCollection",
            name: "N/A",
            color: "#ffbb78",
            id: 34,
            features: countries.features.filter(function (d) {
                return d.properties["INCOME"] == "#N/A";
            })
        }
    ];
}