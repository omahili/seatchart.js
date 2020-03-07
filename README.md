<p align="center">
    <img src="https://raw.githubusercontent.com/omarmahili/SeatchartJS/develop/logo.svg?sanitize=true" alt="SeatchartJS Logo" width="500" />
</p>

# Build project

Clone the repository:

> git clone https://github.com/omarmahili/seatchart.js.git

Install node modules:

> npm i

Build project:

> npm run build

Done! In the dist directory you will find all you need: style, assets, seatchart.min.js and seatchart.js.

# Usage

First of all link the library along with the stylesheet and the script that generates the seatchart.

``` html
<link rel="stylesheet" href="/path/to/dist/style/seatchart.css">
<script type="text/javascript" src="/path/to/dist/seatchart.min.js"></script>

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
            path: "path/to/dist/assets",
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

Enjoy the result.

## [View Demo](https://seatchart.js.org/demo.html)

## Development

This library is still in development. It can already be used with websockets and it has some nice features like gap detection. <br />
But things may change a little bit in the future, so give a look to the tasks here: [Road to v1](https://github.com/omarmahili/seatchart.js/projects/1). <br />
If you want to help in the development of this library please open a PR on github, while if you find any problem open an issue. <br />
