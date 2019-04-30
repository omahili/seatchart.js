# SeatchartJS

- [Docs and Usage](http://omarmahili.github.io/SeatchartJS)

----

## Develop the framework

Install packages:

```$ npm install```

Run the linter:

```$ npm run lint```

Generate docs:

```$ npm run generate-docs```

----

## TODO LIST

- [x] Gap detection
- [x] Get/set of a seat after creation (key feature for websockets support)
- [ ] Update jsdoc and docdash
- [ ] Add search bar to documentation
- [ ] Improve documentation home page
- [ ] Remove long press feature on a seat
- [ ] Hide/show sound button
- [ ] Decrease access to the DOM (e.g. getSeatName function)
- [ ] Replace current seat indexing with a simple one: an object { row: 10, col: 10 }
- [ ] Add 'static' mode where seat types are defined by default
- [ ] Add themes
- [ ] Add description and examples to README
- [ ] Add choice for different seat names
- [ ] Show a dropdown menu, on click, to select seat type
- [ ] Add multi-language support
- [ ] Remove onAddedSeat/onRemovedSeat and add onChange event
- [ ] Add onClear event and trigger it when all seats are removed
- [ ] Improve shopping cart design
- [ ] Improve legend: remove 'Available' seat from legend, remove 'Your seats' and 'Seats' subtitles
- [ ] Rename SeatchartJS into seatchart.js
- [ ] Rename SeatchartJS class into Seatchart: ```var sc = new Seatchart()```
- [ ] Move docs to seatchart.js.org