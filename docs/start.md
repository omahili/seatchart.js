# Getting Started

First of all link the library along with the stylesheet and the script that generates the seatchart.

``` html
<link rel="stylesheet" href="/path/to/seatchart.css">
<script type="text/javascript" src="/path/to/seatchart.js"></script>

<script>
    var options = {
        // Reserved and disabled seats are indexed
        // from left to right by starting from 0.
        // Given the seatmap as a 2D array and an index [R, C]
        // the following values can obtained as follow:
        // I = columns * R + C
        map: {
            id: 'map-container',
            rows: 9,
            columns: 9,
            // e.g. Reserved Seat [Row: 1, Col: 2] = 7 * 1 + 2 = 9
            reserved: {
                seats: [1, 2, 3, 5, 6, 7, 9, 10, 11, 12, 14, 15, 16, 17, 18, 19, 20, 21],
            },
            disabled: {
                seats: [0, 8],
                rows: [4],
                columns: [4]
            }
        },
        types: [
            { type: "regular", backgroundColor: "#006c80", price: 10, selected: [23, 24] },
            { type: "reduced", backgroundColor: "#287233", price: 7.5, selected: [25, 26] }
        ],
        cart: {
            id: 'cart-container',
            width: 280,
            height: 250,
            currency: '£',
        },
        legend: {
            id: 'legend-container',
        },
        assets: {
            path: "./assets",
        }
    };

    var sc = new Seatchart(options);
</script>
```

Then in your web page body create three containers that are going to contain the three elements: seat map, legend and shopping cart. Their id needs to be the same passed to the create functions (1), in your script.

``` html
<div id="map-container"></div>
<div id="legend-container"></div>
<div id="shoppingCart-container"></div>
```

Enjoy the [result](https://seatchart.js.org/demo.html).
