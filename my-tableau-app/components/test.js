import VegaLiteViz from './vegaliteviz';
//import { avoidLabelCollisions } from './spec';


//  sample data
const spec = {
    "view": {
        "stroke": null
    },
    "width": "container",
    "config": {
        "axis": {
            "labelFont": {
                "expr": "axisLabelFontFace"
            },
            "labelFontSize": {
                "expr": "axisLabelFontSize"
            },
            "ticks": false,
            "labelOffset": {
                "expr": "axisLabelOffset"
            },
            "title": null,
            "domain": false,
            "labelPadding": {
                "expr": "axisLabelPadding"
            },
            "labelLineHeight": {
                "expr": "axisLabelFontSize"
            },
            "labelAngle": {
                "expr": "axisLabelAngle"
            }
        },
        "customFormatTypes": true
    },
    "resolve": {
        "axis": {
            "y": "independent"
        }
    },
    "height": "container",
    "encoding": {
        "x": {
            "field": "truncDate",
            "type": "ordinal",
            "axis": {
                "format": {
                    "mapName": "xAxis",
                    "custom": true
                },
                "gridColor": {
                    "condition": [
                        {
                            "test": "mode === 'CurrentPartial' && datum.index === 0.5",
                            "expr": "xAxisGridColorActive"
                        },
                        {
                            "test": "mode === 'LastComplete' && datum.index === 1",
                            "expr": "xAxisGridColorActive"
                        }
                    ],
                    "expr": "xAxisGridColorDefault"
                },
                "gridOpacity": {
                    "expr": "datum.index === 0 ? 0 : 1"
                },
                "labelOverlap": true,
                "offset": {
                    "expr": "xAxisOffset"
                },
                "labelFontWeight": {
                    "expr": "xAxisLabelFontWeightDefault",
                    "condition": [
                        {
                            "test": "mode === 'CurrentPartial' && datum.index === 0.5",
                            "expr": "xAxisLabelFontWeightActive"
                        },
                        {
                            "test": "mode === 'LastComplete' && datum.index === 1",
                            "expr": "xAxisLabelFontWeightActive"
                        }
                    ]
                },
                "grid": true,
                "labelColor": {
                    "condition": [
                        {
                            "test": "mode === 'CurrentPartial' && datum.index === 0.5",
                            "expr": "axisLabelColorActive"
                        },
                        {
                            "test": "mode === 'LastComplete' && datum.index === 1",
                            "expr": "axisLabelColorActive"
                        }
                    ],
                    "expr": "axisLabelColorDefault"
                },
                "values": {
                    "expr": "xAxisLabelsDataValues"
                },
                "labelAlign": {
                    "condition": [
                        {
                            "test": "datum.index === 0",
                            "value": "left"
                        },
                        {
                            "test": "datum.index === 1",
                            "value": "right"
                        }
                    ],
                    "value": "center"
                }
            },
            "scale": {
                "padding": {
                    "expr": "xAxisScalePadding"
                },
                "type": "point"
            }
        }
    },
    "layer": [
        {
            "name": "normal-range",
            "description": "The normal range band around the line",
            "mark": {
                "type": "errorband",
                "color": {
                    "expr": "normalRangeColor"
                },
                "opacity": {
                    "expr": "normalRangeOpacity"
                }
            },
            "encoding": {
                "y": {
                    "type": "quantitative",
                    "scale": {
                        "zero": false
                    },
                    "title": "Normal range",
                    "axis": null,
                    "field": "ci1"
                },
                "y2": {
                    "field": "ci0"
                }
            }
        },
        {
            "name": "line",
            "description": "The line based of time series data",
            "mark": {
                "clip": true,
                "type": "line",
                "stroke": {
                    "expr": "lineColor"
                },
                "strokeWidth": {
                    "expr": "lineStrokeWidth"
                },
                "opacity": 1
            },
            "encoding": {
                "strokeDash": {
                    "field": "dashed",
                    "type": "nominal",
                    "legend": null,
                    "condition": {
                        "test": "datum.dashed",
                        "value": {
                            "expr": "lineStrokeDash"
                        }
                    }
                },
                "y": {
                    "type": "quantitative",
                    "axis": null,
                    "field": "rawValue"
                }
            }
        },
        {
            "mark": {
                "fill": {
                    "expr": "mode === 'CurrentPartial' ? currentValueCircleColor2 : currentValueCircleColor1"
                },
                "size": {
                    "expr": "datum.point*currentValueCircleSize"
                },
                "opacity": 1,
                "stroke": {
                    "expr": "mode === 'CurrentPartial' ? currentValueCircleColor1 : currentValueCircleColor2 "
                },
                "strokeWidth": {
                    "expr": "currentValueCircleStrokeWidth"
                },
                "type": "point",
                "filled": true
            },
            "encoding": {
                "y": {
                    "axis": {
                        "offset": {
                            "expr": "leftYAxisOffset"
                        },
                        "values": {
                            "expr": "yAxisLabelsDataValues"
                        },
                        "grid": false,
                        "format": {
                            "custom": true,
                            "mapName": "yAxis"
                        },
                        "labelAlign": "right",
                        "labelBaseline": {
                            "condition": {
                                "test": "datum.value === 0",
                                "value": "bottom"
                            },
                            "value": "middle"
                        },
                        "labelColor": {
                            "expr": "datum.index === 1 ? axisLabelColorActive : axisLabelColorDefault"
                        }
                    },
                    "field": "rawValue",
                    "type": "quantitative"
                }
            },
            "name": "current-value-circle",
            "description": "Circle at the end of the line on the current data point"
        },
        {
            "name": "isolated-point-value-circle",
            "description": "Circle for isolated points in data series",
            "mark": {
                "type": "point",
                "filled": true,
                "size": {
                    "expr": "datum.showIsolatedPoint*currentValueCircleSize"
                },
                "opacity": 1,
                "strokeWidth": {
                    "expr": "currentValueCircleStrokeWidth"
                }
            },
            "encoding": {
                "y": {
                    "field": "rawValue",
                    "type": "quantitative",
                    "axis": null
                }
            }
        },
        {
            "encoding": {
                "y": {
                    "field": "rawValue",
                    "type": "quantitative",
                    "axis": null
                }
            },
            "name": "current-value-text",
            "description": "The current value text after the end of the line",
            "mark": {
                "dx": {
                    "expr": "currentValuePadding"
                },
                "type": "text",
                "fontSize": {
                    "expr": "currentValueFontSize"
                },
                "font": {
                    "expr": "currentValueFontFace"
                },
                "fontWeight": {
                    "expr": "currentValueFontWeight"
                },
                "align": "left",
                "text": {
                    "expr": "datum.point === 1 ? datum.formattedRawValue : \"\""
                }
            }
        },
        {
            "description": "Manual left x-axis grid line to overlay the errorband that occludes the real axis grid line",
            "mark": {
                "type": "rule",
                "color": {
                    "expr": "xAxisGridColorDefault"
                },
                "opacity": {
                    "expr": "length(data('series')) > 0 && datum.truncDate === peek(data('series')).truncDate ? 1 : 0"
                }
            },
            "name": "left-x-axis-overlay"
        }
    ],
    "customFormatterMaps": {
        "xAxis": {
            "2023-10-15T00:00:00Z": "wk 10/15",
            "2023-07-30T00:00:00Z": "wk 7/30"
        },
        "yAxis": {
            "4501.0000": "4.5k",
            "4480.0000": "4.5k",
            "4110.0000": "4.1k",
            "4080.0000": "4.1k",
            "0.0000": "0",
            "4161.0000": "4.2k",
            "3937.0000": "3.9k",
            "4050.0000": "4.0k",
            "3573.0000": "3.6k",
            "3814.0000": "3.8k",
            "3894.0000": "3.9k",
            "4316.0000": "4.3k",
            "3844.0000": "3.8k"
        }
    },
    "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
    "data": {
        "values": [
            {
                "point": 1,
                "showIsolatedPoint": 0,
                "rawValue": "4501.0000",
                "ci1": "5964.9088",
                "formattedRawValue": "4.5k",
                "truncDate": "2023-10-15T00:00:00Z",
                "dashed": false,
                "ci0": "2626.5853",
                "formattedTruncDate": "Week of Oct 15"
            },
            {
                "showIsolatedPoint": 0,
                "formattedRawValue": "4.5k",
                "ci1": "5875.7310",
                "truncDate": "2023-10-08T00:00:00Z",
                "point": 0,
                "rawValue": "4480.0000",
                "formattedTruncDate": "Week of Oct 8",
                "dashed": false,
                "ci0": "2537.4075"
            },
            {
                "ci1": "5786.7224",
                "formattedRawValue": "4.0k",
                "truncDate": "2023-10-01T00:00:00Z",
                "dashed": false,
                "showIsolatedPoint": 0,
                "rawValue": "4050.0000",
                "formattedTruncDate": "Week of Oct 1",
                "ci0": "2448.3988",
                "point": 0
            },
            {
                "rawValue": "3894.0000",
                "formattedTruncDate": "Week of Sep 24",
                "point": 0,
                "ci0": "2359.5877",
                "formattedRawValue": "3.9k",
                "truncDate": "2023-09-24T00:00:00Z",
                "showIsolatedPoint": 0,
                "ci1": "5697.9112",
                "dashed": false
            },
            {
                "showIsolatedPoint": 0,
                "point": 0,
                "ci0": "2271.0049",
                "rawValue": "4161.0000",
                "formattedRawValue": "4.2k",
                "ci1": "5609.3284",
                "dashed": false,
                "truncDate": "2023-09-17T00:00:00Z",
                "formattedTruncDate": "Week of Sep 17"
            },
            {
                "ci1": "5521.0074",
                "dashed": false,
                "showIsolatedPoint": 0,
                "rawValue": "4316.0000",
                "ci0": "2182.6839",
                "truncDate": "2023-09-10T00:00:00Z",
                "formattedTruncDate": "Week of Sep 10",
                "formattedRawValue": "4.3k",
                "point": 0
            },
            {
                "dashed": false,
                "rawValue": "3937.0000",
                "showIsolatedPoint": 0,
                "ci1": "5432.9846",
                "formattedTruncDate": "Week of Sep 3",
                "ci0": "2094.6611",
                "formattedRawValue": "3.9k",
                "point": 0,
                "truncDate": "2023-09-03T00:00:00Z"
            },
            {
                "truncDate": "2023-08-27T00:00:00Z",
                "formattedTruncDate": "Week of Aug 27",
                "showIsolatedPoint": 0,
                "point": 0,
                "ci0": "2006.9760",
                "dashed": false,
                "ci1": "5345.2995",
                "rawValue": "4110.0000",
                "formattedRawValue": "4.1k"
            },
            {
                "rawValue": "3573.0000",
                "dashed": false,
                "truncDate": "2023-08-20T00:00:00Z",
                "ci1": "5257.9948",
                "ci0": "1919.6713",
                "point": 0,
                "showIsolatedPoint": 0,
                "formattedRawValue": "3.6k",
                "formattedTruncDate": "Week of Aug 20"
            },
            {
                "showIsolatedPoint": 0,
                "rawValue": "3844.0000",
                "ci1": "5171.1169",
                "formattedRawValue": "3.8k",
                "dashed": false,
                "point": 0,
                "ci0": "1832.7934",
                "truncDate": "2023-08-13T00:00:00Z",
                "formattedTruncDate": "Week of Aug 13"
            },
            {
                "formattedTruncDate": "Week of Aug 6",
                "showIsolatedPoint": 0,
                "ci0": "1746.3926",
                "formattedRawValue": "4.1k",
                "truncDate": "2023-08-06T00:00:00Z",
                "ci1": "5084.7161",
                "rawValue": "4080.0000",
                "point": 0,
                "dashed": false
            },
            {
                "rawValue": "3814.0000",
                "point": 0,
                "ci1": "4998.8466",
                "showIsolatedPoint": 0,
                "dashed": false,
                "formattedRawValue": "3.8k",
                "truncDate": "2023-07-30T00:00:00Z",
                "formattedTruncDate": "Week of Jul 30",
                "ci0": "1660.5231"
            }
        ],
        "name": "series"
    },
    "params": [
        {
            "name": "axisLabelFontFace",
            "value": "'SF Pro Text', 'SF Pro Display', system-ui, -apple-system, blinkmacsystemfont, 'Segoe UI', roboto, ubuntu, 'Fire Sans', 'Helvetica Neue', sans-serif"
        },
        {
            "name": "axisLabelFontSize",
            "value": 13
        },
        {
            "name": "axisLabelAngle",
            "value": 0
        },
        {
            "name": "axisLabelPadding",
            "value": 0
        },
        {
            "value": 0,
            "name": "axisLabelOffset"
        },
        {
            "value": "#343A3F",
            "name": "axisLabelColorDefault"
        },
        {
            "name": "axisLabelColorActive",
            "value": "#040507"
        },
        {
            "name": "currentValueCircleColor1",
            "value": "#1B96FF"
        },
        {
            "name": "currentValueCircleColor2",
            "value": "#fff"
        },
        {
            "value": 120,
            "name": "currentValueCircleSize"
        },
        {
            "name": "currentValueCircleStrokeWidth",
            "value": 3
        },
        {
            "value": "'SF Pro Text', 'SF Pro Display', system-ui, -apple-system, blinkmacsystemfont, 'Segoe UI', roboto, ubuntu, 'Fire Sans', 'Helvetica Neue', sans-serif",
            "name": "currentValueFontFace"
        },
        {
            "value": 13,
            "name": "currentValueFontSize"
        },
        {
            "name": "currentValueFontWeight",
            "value": 600
        },
        {
            "name": "currentValuePadding",
            "value": 12
        },
        {
            "name": "leftYAxisOffset",
            "value": 12
        },
        {
            "name": "lineColor",
            "value": "#1B96FF"
        },
        {
            "value": 3,
            "name": "lineStrokeWidth"
        },
        {
            "name": "lineStrokeDash",
            "value": [
                6,
                3
            ]
        },
        {
            "value": "#E3F2FF",
            "name": "normalRangeColor"
        },
        {
            "name": "normalRangeOpacity",
            "value": 1
        },
        {
            "name": "xAxisScalePadding",
            "value": -20
        },
        {
            "name": "xAxisOffset",
            "value": 20
        },
        {
            "name": "xAxisGridColorDefault",
            "value": "#6B7280"
        },
        {
            "name": "xAxisGridColorActive",
            "value": "#040507"
        },
        {
            "value": "normal",
            "name": "xAxisLabelFontWeightDefault"
        },
        {
            "name": "xAxisLabelFontWeightActive",
            "value": 600
        },
        {
            "value": "LastComplete",
            "name": "mode"
        },
        {
            "name": "xAxisLabelsDataValues",
            "value": [
                "2023-10-15T00:00:00Z",
                "2023-07-30T00:00:00Z"
            ]
        },
        {
            "name": "yAxisLabelsDataValues",
            "value": [
                "3814.0000"
            ]
        }
    ]
}


const Chart = () => {
    const data = {
        table: spec.data.values
    }
    return (
        <VegaLiteViz height={300} width={600} spec={spec}></VegaLiteViz>
    )
}

export default Chart;