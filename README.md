<p align="center">
    <img src="https://raw.githubusercontent.com/omarmahili/SeatchartJS/develop/logo.svg?sanitize=true" alt="SeatchartJS Logo" width="500" />
</p>

# Usage

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

Enjoy the result.

## [View Demo](https://seatchart.js.org/demo.html)

## Development

This library is still in development. It can already be used with websockets and it has some nice features like gap detection. <br />
But things may change a little bit in the future, so give a look to the TODO list below. <br />
If you want to help in the development of this library please open a PR on github, while if you find any problem open an issue. <br />

- [x] Gap detection
- [x] Get/set of a seat after creation (key feature for websockets support)
- [x] Update jsdoc and docdash
- [x] Add search bar to documentation
- [x] Improve documentation home page
- [x] Move docs to seatchart.js.org
- [x] Add description and examples to README
- [x] Create a development branch and follow [Git Flow](https://nvie.com/posts/a-successful-git-branching-model/)
- [x] Rename SeatchartJS class into Seatchart: ```var sc = new Seatchart()```
- [x] Remove long press feature on a seat
- [x] Remove sound
- [x] Remove onAddedSeat/onRemovedSeat and add onChange event
- [x] Add onClear event and trigger it when all seats are removed
- [x] Add a default font
- [x] Improve legend: remove 'Available' seat from legend, remove 'Your seats' and 'Seats' subtitles
- [x] Improve shopping cart design
- [x] Use flexbox where simpler
- [x] Remove useless getters/setters and configure seatchart throught a single object 'options'
- [x] Hide and skip seat indexes where a column or row is completely blank
- [x] Add visible and position options to indexes
- [x] Add visible and position options to front header
- [x] Add choice for different indexes
- [ ] Create svg icons
- [ ] Decrease access to the DOM (e.g. getSeatName() function)
- [ ] Replace current seat indexing with a simple one: an object { row: 10, col: 10 }
- [ ] Add 'static' mode where seat types are defined by default
- [ ] Add themes
- [ ] Show a dropdown menu, on click, to select seat type
- [ ] Add multi-language support
- [ ] Use [Semantic Versioning](https://semver.org/) and release an alpha
- [ ] Use Travis CI and deploy to npm
- [ ] Backend and frontend example with websockets
- [ ] Minified source
- [ ] Roadmap to v1.0.0
