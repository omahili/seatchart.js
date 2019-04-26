/**
 * Creates a seatchart.
 * @constructor
 * @param {Object.<{rows: number, cols: number, reserved: Array.<number>, disabled: Array.<number>, disabledRows: Array.<number>, disabledCols: Array.<number>}>} seatMap - Info to generate the seatmap.
 * @param {Array.<Object.<{type: string, color: string, price: number, selected: Array.<number>}>>} seatTypes - Seat types and their colors to be represented.
 */
function SeatchartJS(seatMap, seatTypes) { // eslint-disable-line no-unused-vars
    /**
     * @private
     * .NET equivalent of string.Format() method
     * @returns {string} The formatted string.
     */
    String.prototype.format = function format() {
        var args = arguments;
        return this.replace(/{(\d+)}/g, function replace(match, number) {
            return typeof args[number] !== 'undefined' ? args[number] : match;
        });
    };

    /**
     * @private
     * Capitalizes the first letter and lowers all the others.
     * @returns {string} The formatted string.
     */
    String.prototype.capitalizeFirstLetter = function capitalizeFirstLetter() {
        var result = this.charAt(0).toUpperCase();
        for (var i = 1; i < this.length; i += 1) {
            result += this.charAt(i).toLowerCase();
        }

        return result;
    };

    /**
     * @private
     * Computes the style of an element, it works even on ie :P.
     * @params {Element} el - The element for which we're getting the computed style.
     * @returns {CSSStyleDeclaration} The css of the element.
     */
    var getStyle = function getStyle(el) {
        if (typeof window.getComputedStyle !== 'undefined') {
            return window.getComputedStyle(el, null);
        }

        return el.currentStyle;
    };

    /**
     * @private
     * Computes the scroll bar width of the browser.
     * Many thanks to Alexander Gomes (http://www.alexandre-gomes.com/?p=115).
     * @returns {number} The scrollbar width.
     */
    function getScrollBarWidth() {
        var inner = document.createElement('p');
        inner.style.width = '100%';
        inner.style.height = '200px';

        var outer = document.createElement('div');
        outer.style.position = 'absolute';
        outer.style.top = '0px';
        outer.style.left = '0px';
        outer.style.visibility = 'hidden';
        outer.style.width = '200px';
        outer.style.height = '150px';
        outer.style.overflow = 'hidden';
        outer.appendChild(inner);

        document.body.appendChild(outer);
        var w1 = inner.offsetWidth;
        outer.style.overflow = 'scroll';
        var w2 = inner.offsetWidth;
        if (w1 === w2) w2 = outer.clientWidth;

        document.body.removeChild(outer);

        return (w1 - w2);
    }

    /**
     * @private
     * Converts a color to its equivalent in hexadecimal.
     * @param {string} color - A color (e.g. "#00ffff", "blue").
     * @returns {string} Hexadeciaml representation of the color.
     */
    function colorToHex(color) {
        /* eslint-disable */
        var colors = {'aliceblue':'#f0f8ff','antiquewhite':'#faebd7','aqua':'#00ffff','aquamarine':'#7fffd4','azure':'#f0ffff','beige':'#f5f5dc','bisque':'#ffe4c4','black':'#000000','blanchedalmond':'#ffebcd','blue':'#0000ff','blueviolet':'#8a2be2','brown':'#a52a2a','burlywood':'#deb887','cadetblue':'#5f9ea0','chartreuse':'#7fff00','chocolate':'#d2691e','coral':'#ff7f50','cornflowerblue':'#6495ed','cornsilk':'#fff8dc','crimson':'#dc143c','cyan':'#00ffff','darkblue':'#00008b','darkcyan':'#008b8b','darkgoldenrod':'#b8860b','darkgray':'#a9a9a9','darkgreen':'#006400','darkkhaki':'#bdb76b','darkmagenta':'#8b008b','darkolivegreen':'#556b2f','darkorange':'#ff8c00','darkorchid':'#9932cc','darkred':'#8b0000','darksalmon':'#e9967a','darkseagreen':'#8fbc8f','darkslateblue':'#483d8b','darkslategray':'#2f4f4f','darkturquoise':'#00ced1','darkviolet':'#9400d3','deeppink':'#ff1493','deepskyblue':'#00bfff','dimgray':'#696969','dodgerblue':'#1e90ff','firebrick':'#b22222','floralwhite':'#fffaf0','forestgreen':'#228b22','fuchsia':'#ff00ff','gainsboro':'#dcdcdc','ghostwhite':'#f8f8ff','gold':'#ffd700','goldenrod':'#daa520','gray':'#808080','green':'#008000','greenyellow':'#adff2f','honeydew':'#f0fff0','hotpink':'#ff69b4','indianred ':'#cd5c5c','indigo':'#4b0082','ivory':'#fffff0','khaki':'#f0e68c','lavender':'#e6e6fa','lavenderblush':'#fff0f5','lawngreen':'#7cfc00','lemonchiffon':'#fffacd','lightblue':'#add8e6','lightcoral':'#f08080','lightcyan':'#e0ffff','lightgoldenrodyellow':'#fafad2','lightgrey':'#d3d3d3','lightgreen':'#90ee90','lightpink':'#ffb6c1','lightsalmon':'#ffa07a','lightseagreen':'#20b2aa','lightskyblue':'#87cefa','lightslategray':'#778899','lightsteelblue':'#b0c4de','lightyellow':'#ffffe0','lime':'#00ff00','limegreen':'#32cd32','linen':'#faf0e6','magenta':'#ff00ff','maroon':'#800000','mediumaquamarine':'#66cdaa','mediumblue':'#0000cd','mediumorchid':'#ba55d3','mediumpurple':'#9370d8','mediumseagreen':'#3cb371','mediumslateblue':'#7b68ee','mediumspringgreen':'#00fa9a','mediumturquoise':'#48d1cc','mediumvioletred':'#c71585','midnightblue':'#191970','mintcream':'#f5fffa','mistyrose':'#ffe4e1','moccasin':'#ffe4b5','navajowhite':'#ffdead','navy':'#000080','oldlace':'#fdf5e6','olive':'#808000','olivedrab':'#6b8e23','orange':'#ffa500','orangered':'#ff4500','orchid':'#da70d6','palegoldenrod':'#eee8aa','palegreen':'#98fb98','paleturquoise':'#afeeee','palevioletred':'#d87093','papayawhip':'#ffefd5','peachpuff':'#ffdab9','peru':'#cd853f','pink':'#ffc0cb','plum':'#dda0dd','powderblue':'#b0e0e6','purple':'#800080','red':'#ff0000','rosybrown':'#bc8f8f','royalblue':'#4169e1','saddlebrown':'#8b4513','salmon':'#fa8072','sandybrown':'#f4a460','seagreen':'#2e8b57','seashell':'#fff5ee','sienna':'#a0522d','silver':'#c0c0c0','skyblue':'#87ceeb','slateblue':'#6a5acd','slategray':'#708090','snow':'#fffafa','springgreen':'#00ff7f','steelblue':'#4682b4','tan':'#d2b48c','teal':'#008080','thistle':'#d8bfd8','tomato':'#ff6347','turquoise':'#40e0d0','violet':'#ee82ee','wheat':'#f5deb3','white':'#ffffff','whitesmoke':'#f5f5f5','yellow':'#ffff00','yellowgreen':'#9acd32'};
        /* eslint-enable */

        var hex = colors[color.toLowerCase()];

        return typeof hex !== 'undefined' ? hex : color;
    }

    // check seatMap parameter
    if (seatMap === undefined) {
        throw new Error("Invalid parameter 'seatMap' supplied to SeatchartJS. Cannot be undefined.");
    } else if (typeof seatMap !== 'object') {
        throw new Error("Invalid parameter 'seatMap' supplied to SeatchartJS. Must be an object.");
    } else if (!{}.hasOwnProperty.call(seatMap, 'rows') || !{}.hasOwnProperty.call(seatMap, 'cols')) {
        throw new Error("Invalid parameter 'seatMap' supplied to SeatchartJS. " +
                        "'row' and 'cols' properties cannot be undefined.");
    } else if (seatMap.rows > 25 || seatMap.cols > 25) {
        throw new Error("Invalid parameter 'seatMap' supplied to SeatchartJS. " +
                        "'row' and 'cols' properties cannot be integers greater than 25.");
    } else if (seatMap.rows < 2 || seatMap.cols < 2) {
        throw new Error("Invalid parameter 'seatMap' supplied to SeatchartJS. " +
                        "'row' and 'cols' properties cannot be integers smaller than 2.");
    }

    // check seatTypes parameter
    if (seatTypes === undefined) {
        throw new Error("Invalid parameter 'seatTypes' supplied to SeatchartJS. Cannot be undefined.");
      // check if seatTypes is an array and contains at least one element
    } else if (!Array.isArray(seatTypes) || seatTypes.length < 1 || typeof seatTypes[0] !== 'object') {
        throw new Error("Invalid parameter 'seatTypes' supplied to SeatchartJS. " +
                        'Must be an array of objects containing at least one element.');
    } else {
        // check if all elements have the needed attribute and contain the right type of value
        for (var i = 0; i < seatTypes.length; i += 1) {
            if (!{}.hasOwnProperty.call(seatTypes[i], 'type') ||
                !{}.hasOwnProperty.call(seatTypes[i], 'color') ||
                !{}.hasOwnProperty.call(seatTypes[i], 'price')) {
                throw new Error(("Invalid parameter 'seatTypes' supplied to SeatchartJS. " +
                                "Element at index {0} must contain a 'type', " +
                                "a 'color' and a 'price' property.").format(i));
            } else if (!(typeof seatTypes[i].type === 'string' || seatTypes[i].type instanceof String)) {
                throw new Error(("Invalid parameter 'seatTypes' supplied to SeatchartJS. " +
                                "'type' property at index {0} must be a string.").format(i));
            } else if (!(typeof seatTypes[i].color === 'string' ||
                        seatTypes[i].color instanceof String)) {
                throw new Error(("Invalid parameter 'seatTypes' supplied to SeatchartJS. " +
                                "'color' property at index {0} must be a string.").format(i));
            } else if (typeof seatTypes[i].price !== 'number') {
                throw new Error(("Invalid parameter 'seatTypes' supplied to SeatchartJS. " +
                                "'price' property at index {0} must be a number.").format(i));
            }
        }
    }

    /**
     * @private
     * Checks if a color is valid and if it's not hexadecimal it's converted.
     * @param {string} color - A color (a word or a hexadecimal representation).
     * @returns {string} The hexadecimal representation of the color.
     */
    var checkColor = function checkColor(index) {
        var color = colorToHex(seatTypes[index].color);

        if (color.indexOf('#') !== 0) {
            throw new Error(("Invalid parameter 'seatTypes' supplied to SeatchartJS. " +
                            "'color' property at index {0} must be a valid color. " +
                            "(e.g. 'red' or '#ff0000', rgb() colors are not accepted)").format(index));
        }

        return color;
    };

    // check the given input
    for (var x = 0; x < seatTypes.length; x += 1) {
        // check color value
        var colorX = checkColor(x);

        for (var y = x + 1; y < seatTypes.length; y += 1) {
            if (seatTypes[x].type.capitalizeFirstLetter() ===
                seatTypes[y].type.capitalizeFirstLetter()) {
                throw new Error(("Invalid parameter 'seatTypes' supplied to SeatchartJS. " +
                                "'{0}' and '{1}' are equals and types must be different. " +
                                'Types are case insensitive.').format(seatTypes[x].type, seatTypes[y].type));
            }

            // check color value
            var colorY = checkColor(y);

            if (colorX === colorY) {
                throw new Error(("Invalid parameter 'seatTypes' supplied to SeatchartJS. " +
                                "'{0}' and '{1}' are equals and colors must be different.")
                                .format(seatTypes[x].color, seatTypes[y].color));
            }
        }
    }

    /**
     * @private
     * This object.
     * @type {seatchartJS}
     */
    var self = this;

    /**
     * @private
     * Gets the current currency.
     * @type {string}
     */
    self.currency = '€';

    /**
     * @private
     * The path where the assets are located.
     * @type {string}
     */
    self.assetsSrc = 'assets';

    /**
     * @private
     * Stores whether the sound is enbled or not.
     * @type {boolean}
     */
    self.soundEnabled = true;

    /**
     * @private
     * The shopping cart width.
     * @type {number}
     */
    self.shoppingCartWidth = 200;

    /**
     * @private
     * The shopping cart height.
     * @type {number}
     */
    self.shoppingCartHeight = 200;

    /**
     * @private
     * The mouse down interval at which the seat type changes.
     * @type {number}
     */
    var mouseDownInterval = 500;

    /**
     * @private
     * The ID value of the timer that is set.
     * @type {number}
     */
    var mouseDown;

    /**
     * @private
     * Stores whether the seat has to change on a mouse down interval or not.
     * @type {boolean}
     */
    var changedOnMouseDown = false;

    /**
     * @private
     * An object containing all seats added to the shopping cart, mapped by seat type.
     * Given the seatmap as a 2D array and an index [R, C] all integer values are obtained
     * as follow: I = cols * R + C.
     * @type {Object.<string, Array.<int>>}
     */
    var shoppingCart = {};

    /**
     * Sets the current currency.
     * @param {string} value - A character that represents the currency (e.g. "$", "€").
     */
    this.setCurrency = function setCurrency(value) {
        if (typeof value === 'string' || value instanceof String) {
            self.currency = value;
        } else {
            throw new Error("Invalid parameter 'value' supplied to SeatchartJS.setCurrency(). Must be a string.");
        }
    };

    /**
     * Gets the current currency.
     * @returns {string} A character that represents the currency (e.g. "$", "€"...).
     */
    this.getCurrency = function getCurrency() {
        return self.currency;
    };

    /**
     * Sets the path where the assets are located.
     * @param {string} value - The path where the assets are located (e.g. "../src/assets").
     */
    this.setAssetsSrc = function setAssetsSrc(value) {
        if (typeof value === 'string' || value instanceof String) {
            self.assetsSrc = value;
        } else {
            throw new Error("Invalid parameter 'value' supplied to SeatchartJS.setAssetsSrc(). Must be a string.");
        }
    };

    /**
     * Gets the path where the assets are located.
     * @returns {string} The path where the assets are located.
     */
    this.getAssetsSrc = function getAssetsSrc() {
        return self.assetsSrc;
    };

    /**
     * Sets whether the sound has to be enbled or not.
     * @param {boolean} value - True if it has to be enabled otherwise false.
     */
    this.setSoundEnabled = function setSoundEnabled(value) {
        if (typeof value === 'boolean') {
            self.soundEnabled = value;
        } else {
            throw new Error("Invalid parameter 'value' supplied to SeatchartJS.setSoundEnabled(). Must be a boolean.");
        }
    };

    /**
     * Gets whether the sound is enbled or not.
     * @returns {boolean} True if it is enabled otherwise false.
     */
    this.getSoundEnabled = function getSoundEnabled() {
        return self.soundEnabled;
    };

    /**
     * Sets the shopping cart width.
     * @param {number} value - The shopping cart width.
     */
    this.setShoppingCartWidth = function setShoppingCartWidth(value) {
        if (typeof value === 'number' && value >= 0) {
            self.shoppingCartWidth = value;
        } else {
            throw new Error("Invalid parameter 'value' supplied to SeatchartJS.setShoppingCartWidth(). " +
                            'Must be positive number.');
        }
    };

    /**
     * Gets the shopping cart width.
     * @returns {number} The shopping cart width.
     */
    this.getShoppingCartWidth = function getShoppingCartWidth() {
        return self.shoppingCartWidth;
    };

    /**
     * Sets the shopping cart height.
     * @param {number} value - The shopping cart height.
     */
    this.setShoppingCartHeight = function setShoppingCartHeight(value) {
        if (typeof value === 'number' && value >= 0) {
            self.shoppingCartHeight = value;
        } else {
            throw new Error("Invalid parameter 'value' supplied to SeatchartJS.setShoppingCartHeight(). " +
                            'Must be positive number.');
        }
    };

    /**
     * Gets the shopping cart height.
     * @returns {number} The shopping cart height.
     */
    this.getShoppingCartHeight = function getShoppingCartHeight() {
        return self.shoppingCartHeight;
    };

    /**
     * Sets the mouse down interval at which the seat type changes.
     * @param {number} value - The mouse down interval at which the seat type changes.
     */
    this.setMouseDownInterval = function setMouseDownInterval(value) {
        if (typeof value === 'number' && value >= 100) {
            // doesn't need self.
            mouseDownInterval = value;
        } else {
            throw new Error("Invalid parameter 'value' supplied to SeatchartJS.setMouseDownInterval(). " +
                            'Must be a positive number and greater than 99 milliseconds.');
        }
    };

    /**
     * Gets the mouse down interval at which the seat type changes.
     * @returns {number} The mouse down interval at which the seat type changes.
     */
    this.getMouseDownInterval = function getMouseDownInterval() {
        // doesn't need self...
        return mouseDownInterval;
    };

    /**
    * Gets a reference to the shopping cart object.
    * @returns {Object.<string, Array.<int>>} An object containing all seats added to the shopping cart, mapped by seat type.
    */
    this.getShoppingCart = function getShoppingCart() {
        return shoppingCart;
    };

    /**
     * @private
     * A string containing all the letters of the english alphabet.
     * @type {string}
     */
    var alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

    /**
     * @private
     * An array of strings containing all the pickable seat types, "available" included.
     * @type {Array.<string>}
     */
    var types = [];

    /**
     * @private
     * The main div container containing all the shopping cart elements.
     * @type {HTMLDivElement}
     */
    var scItemsContainer;

    /**
     * @private
     * The text that shows the total cost of the items in the shopping cart.
     * @type {HTMLHeadingElement}
     */
    var shoppingCartTotal;

    /**
     * @private
     * A dictionary containing all seats added to the shopping cart, mapped by seat type.
     * Each string is composed by row (r) and column (c) indexed in the following format: "r_c",
     * which is the id of the seat in the document.
     * @type {Object.<string, Array.<string>>}
     */
    var shoppingCartDict = {};

    /**
     * @private
     * The icon that shows whether the sound is enabled or not.
     * @type {HTMLImageElement}
     */
    var soundIcon;

    /**
     * @private
     * Adds a seat to the shopping cart dictionary.
     * @param {string} id - The html id of the seat in the seatmap.
     * @param {string} type - The type of the seat.
     * @returns {boolean} True if the seat is added correctly otherwise false.
     */
    var addToScDict = function addToScDict(id, type) {
        if (type in shoppingCartDict) {
            if ({}.hasOwnProperty.call(shoppingCartDict, type)) {
                shoppingCartDict[type].push(id);
                return true;
            }
        }

        return false;
    };

    /**
     * @private
     * Initializes the type of seats that can be clicked and
     * the types of seat that can be added to the shopping cart
     * by using the json, containing the types, given in input.
     */
    var initializeSeatTypes = function initializeSeatTypes() {
        // update types of seat
        types = ['available'];
        shoppingCartDict = [];

        for (var i = 0; i < seatTypes.length; i += 1) {
            types.push(seatTypes[i].type);
            shoppingCartDict[seatTypes[i].type] = [];
        }
    };

    /**
     * @private
     * Maps a shoppingCartDict value to a shoppingCart value.
     * (See private variables shoppingCartDict and shoppingCart.)
     */
    var mapShoppingCartValue = function mapValues(x) {
        var values = x.split('_').map(function parseValues(x) {
            return parseInt(x, 10);
        });

        return (seatMap.cols * values[0]) + values[1];
    };

    /**
     * @private
     * Updates shopping cart object: values stored into shoppingCartDict are mapped to fit shoppingCart
     * type and format. (See private variables shoppingCartDict and shoppingCart.)
     */
    var updateShoppingCartObject = function updateShoppingCartObject() {
        for (var s in shoppingCartDict) {
            if ({}.hasOwnProperty.call(shoppingCartDict, s)) {
                shoppingCart[s] = shoppingCartDict[s].map(mapShoppingCartValue);
            }
        }
    };

    /**
     * @private
     * Loads seats into shoppingCartDict.
     */
    var preloadShoppingCart = function preloadShoppingCart() {
        // create array of seat types
        initializeSeatTypes();

        // Add selected seats to shopping cart
        for (var n = 0; n < seatTypes.length; n += 1) {
            var seatType = seatTypes[n];

            if ({}.hasOwnProperty.call(seatType, 'selected') && seatType.selected) {
                var type = seatType.type;

                for (var l = 0; l < seatType.selected.length; l += 1) {
                    var index = seatType.selected[l];
                    var id = '{0}_{1}'.format(Math.floor(index / seatMap.cols), index % seatMap.cols);
                    // add to shopping cart
                    addToScDict(id, type);
                }
            }
        }

        updateShoppingCartObject();
    };

    preloadShoppingCart();

    /**
     * @private
     * Plays an asyncrounous click sound.
     */
    var playAsyncClick = function playAsyncClick() {
        if (self.soundEnabled) {
            var clickSound = new Audio('{0}/sounds/seatclick.mp3'.format(self.assetsSrc));
            clickSound.volume = 0.2;
            clickSound.load();
            clickSound.play();
        }
    };

    /**
     * @private
     * Sets the sound icon by using the given path of the resources.
     */
    var setSoundIconSrc = function setSoundIconSrc() {
        if (self.soundEnabled) {
            soundIcon.src = '{0}/icons/soundon.svg'.format(self.assetsSrc);
        } else {
            soundIcon.src = '{0}/icons/soundoff.svg'.format(self.assetsSrc);
        }
    };

    /**
     * @private
     * Enables or disables the sound when the volume icon is clicked and plays a sound click when it's enabled to notice it.
     */
    var soundIconClick = function soundIconClick() {
        self.soundEnabled = !self.soundEnabled;
        setSoundIconSrc();
        playAsyncClick();
    };

    /**
     * @private
     * Create a delete button for a shopping cart item.
     * @returns {HTMLDivElement} The delete button.
     */
    var createScDeleteButton = function createScDeleteButton() {
        var binImg = document.createElement('img');
        binImg.src = '{0}/icons/bin.svg'.format(self.assetsSrc);

        var deleteBtn = document.createElement('div');
        deleteBtn.className = 'seatChart-sc-delete';
        deleteBtn.appendChild(binImg);

        return deleteBtn;
    };

    /**
     * @private
     * Gets the name of a seat.
     * @param {string} id - The html id of the seat in the seatmap.
     * @returns {string} The name.
     */
    var getSeatName = function getSeatName(id) {
        return document.getElementById(id).textContent;
    };

    /**
     * @private
     * Gets the type of a seat.
     * @param {string} id - The html id of the seat in the seatmap.
     * @returns {string} The type.
     */
    var getSeatType = function getSeatType(id) {
        for (var key in shoppingCartDict) {
            if ({}.hasOwnProperty.call(shoppingCartDict, key)) {
                if (shoppingCartDict[key].indexOf(id) > -1) {
                    return key;
                }
            }
        }

        throw new Error("Invalid parameter 'id' supplied to SeatchartJS.getSeatType(). " +
                        "'id' is not defined in shoppingCartDict.");
    };

    /**
     * @private
     * Makes a seat available,
     * @param {string} id - The html id of the seat in the seatmap.
     */
    var releaseSeat = function releaseSeat(id) {
        var seat = document.getElementById(id);
        seat.style.cssText = '';
        seat.className = 'seatChart-seat available';
    };

    /**
     * @private
     * Removes a seat from the shopping cart dictionary containing it.
     * @param {string} id - The html id of the seat in the seatmap.
     * @param {string} type - The type of the seat.
     * @returns {boolean} True if the seat is removed correctly otherwise false.
     */
    var removeFromScDict = function removeFromScDict(id, type) {
        if (type !== undefined) {
            if (type in shoppingCartDict) {
                var index = shoppingCartDict[type].indexOf(id);
                if (index > -1) {
                    shoppingCartDict[type].splice(index, 1);
                    return true;
                }
            }
        } else {
            for (var key in shoppingCartDict) {
                if ({}.hasOwnProperty.call(shoppingCartDict, key)) {
                    if (removeFromScDict(id, key)) {
                        return true;
                    }
                }
            }
        }

        return false;
    };

    /**
     * @private
     * Updates the total price of the shopping cart.
     */
    var updateTotal = function updateTotal() {
        if (shoppingCartTotal !== undefined) {
            shoppingCartTotal.textContent = 'Total: {0}{1}'.format(self.getTotal(), self.currency);
        }
    };

    /**
     * @private
     * This function is fired when a delete button is clicked in the shopping cart.
     */
    var deleteClick = function deleteClick() {
        var parentId = this.parentNode.getAttribute('id');
        document.getElementById(parentId).outerHTML = '';

        var id = parentId.split('-')[1];

        var seat = mapShoppingCartValue(id);
        var seatName = getSeatName(id);
        var type = getSeatType(id);

        // get price before capitalizing since indexing is case sensitive
        var price = self.getPrice(type);

        // deselect seat
        releaseSeat(id);

        removeFromScDict(id);
        updateTotal();

        // fire event
        if (self.onRemovedSeat != null) {
            self.onRemovedSeat(seatName, type.capitalizeFirstLetter(), price, seat);
        }
    };

    /**
     * @private
     * Creates a shopping cart item.
     * @param {string} description - The description of the item in the shopping cart.
     * @param {string} id - The html id of the seat in the seatmap.
     * @returns {HTMLDivElement} The shopping cart item.
     */
    var createScItem = function createScItem(description, id) {
        var item = document.createElement('div');
        item.className = 'seatChart-sc-item';
        // -2 because of the item left padding
        item.style.width = '{0}px'.format(self.shoppingCartWidth - getScrollBarWidth() - 2);
        item.setAttribute('id', 'item-{0}'.format(id));

        var desc = document.createElement('p');
        desc.className = 'seatChart-sc-description';
        desc.textContent = description;

        var deleteBtn = createScDeleteButton();
        deleteBtn.onclick = deleteClick;

        item.appendChild(desc);
        item.appendChild(deleteBtn);

        return item;
    };

    /**
     * @private
     * Updates the shopping cart by adding, removing or updating a seat.
     * @param {string} action - Action on the shopping cart ("remove", "add" or "update").
     * @param {string} id - Id of the seat in the dom.
     * @param {string} type - New seat type when it is updated or added. Current seat type when it is removed.
     * @param {string} previousType - Previous type of the seat (when the seat is updated or null).
     * @param {boolean} emit - True to trigger onAddedSeat or onRemovedSeat events.
     */
    var updateShoppingCart = function updateShoppingCart(action, id, type, previousType, emit) {
        var seatName = document.getElementById(id).textContent;
        var seat = mapShoppingCartValue(id);
        var scItem;
        var capitalizedType = type.capitalizeFirstLetter();
        var price = self.getPrice(type);
        var description = '{0} - {1} {2}{3}\n'.format(seatName, capitalizedType, price, self.currency);

        updateShoppingCartObject();

        if (action === 'remove') {
            if (scItemsContainer !== undefined) {
                document.getElementById('item-{0}'.format(id)).outerHTML = '';
            }

            if (emit && self.onRemovedSeat !== null) {
                self.onRemovedSeat(seatName, capitalizedType, price, seat);
            }
        } else if (action === 'add') {
            if (scItemsContainer !== undefined) {
                scItem = createScItem(description, id);
                scItemsContainer.appendChild(scItem);
            }

            if (emit && self.onAddedSeat !== null) {
                self.onAddedSeat(seatName, capitalizedType, price, seat);
            }
        } else if (action === 'update') {
            if (emit && self.onRemovedSeat !== null) {
                self.onRemovedSeat(
                    seatName,
                    previousType.capitalizeFirstLetter(),
                    self.getPrice(previousType),
                    seat
                );
            }

            scItem = document.getElementById('item-{0}'.format(id));
            var p = scItem.getElementsByTagName('p')[0];
            p.textContent = description;

            if (emit && self.onAddedSeat !== null) {
                self.onAddedSeat(seatName, capitalizedType, price, seat);
            }
        }
    };

    /**
     * @private
     * Creates a title.
     * @param {string} content - The content of the title.
     * @returns {HTMLHeadingElement} The title.
     */
    var createTitle = function createTitle(content) {
        var title = document.createElement('h3');
        title.textContent = content;
        title.className = 'seatChart-title';

        return title;
    };

    /**
     * @private
     * Creates a title with an icon.
     * @param {string} content - The title.
     * @param {string} src - The source path of the icon.
     * @param {string} alt - The text to be displed when the image isn't loaded properly.
     * @returns {HTMLDivElement} The iconed title.
     */
    var createIconedTitle = function createIconedTitle(content, src, alt) {
        var container = document.createElement('div');
        var icon = document.createElement('img');
        icon.src = src;
        icon.alt = alt;

        var title = createTitle(content);
        container.className = title.className;
        title.className = '';

        container.appendChild(icon);
        container.appendChild(title);

        return container;
    };

    /**
     * @private
     * This function is fired when a seat is clicked in the seatmap.
     */
    var seatClick = function seatClick() {
        if (!changedOnMouseDown) {
            // clone array because it's modified by adding and removing classes
            var currentClassList = [];
            for (var j = 0; j < this.classList.length; j += 1) {
                currentClassList.push(this.classList[j]);
            }

            for (var i = 0; i < currentClassList.length; i += 1) {
                var currentClass = currentClassList[i];
                var newClass;

                if (currentClass !== 'seatChart-seat' && currentClass !== 'clicked') {
                    // find index of current
                    var index = types.indexOf(currentClass);

                    // if the current class matches a type
                    // then select the new one
                    if (index !== -1) {
                        // a 'selectable' seat is clicked then play the click sound
                        playAsyncClick();

                        this.classList.remove(types[index]);
                        index += 1;

                        if (index === types.length) {
                            index = 0;
                        }

                        newClass = types[index];

                        this.style.backgroundColor = '';
                        this.classList.add(newClass);

                        // if the class isn't available then apply the background-color in the config
                        if (newClass !== 'available') {
                            // decrease it because there's one less element in seatTypes
                            // which is 'available', that already exists
                            index -= 1;
                            if (index < 0) {
                                index = seatTypes.length - 1;
                            }

                            this.classList.add('clicked');
                            this.style.backgroundColor = seatTypes[index].color;
                        } else {
                            // otherwise remove the class 'clicked'
                            // since available has it's own style
                            this.classList.remove('clicked');
                        }

                        // this has to be done after updating the shopping cart
                        // so the event is fired just once the seat style is really updated
                        if (currentClass === 'available') {
                            if (addToScDict(this.id, newClass)) {
                                updateShoppingCart('add', this.id, newClass, null, true);
                            }
                        } else if (newClass === 'available') {
                            if (removeFromScDict(this.id, currentClass)) {
                                updateShoppingCart('remove', this.id, currentClass, null, true);
                            }
                        } else if (addToScDict(this.id, newClass) &&
                                  removeFromScDict(this.id, currentClass)) {
                            updateShoppingCart('update', this.id, newClass, currentClass, true);
                        }
                    }
                }
            }

            updateTotal();
        }
    };

    /**
     * @private
     * This function is fired when a mouse button is pressed.
     */
    var mouseDownSeat = function mouseDownSeat(e) {
        // restrict mouse down to left button
        if (e.which === 1) {
            var id = this.id;
            // to allow a simple click
            changedOnMouseDown = false;

            mouseDown = setInterval(function intervalCallback() {
                // to allow the click simulation
                changedOnMouseDown = false;
                document.getElementById(id).click();

                // this prevents from change on mouse release
                changedOnMouseDown = true;
            }, mouseDownInterval);
        }
    };

    /**
     * @private
     * This function is fired when a mouse button is released.
     */
    var mouseUpSeat = function mouseUpSeat(e) {
        // restrict mouse up to left button
        if (e.which === 1 && mouseDown) {
            clearTimeout(mouseDown);
        }
    };

    /**
     * @private
     * This function is fired when a seat is right clicked to be released.
     */
    var rightClickDelete = function rightClickDelete(e) {
        e.preventDefault();

        var type = getSeatType(this.id);

        // it means it has no type and it's available, then there's nothing to delete
        if (type !== undefined) {
            releaseSeat(this.id);
            // remove from virtual sc
            removeFromScDict(this.id, type);

            // there's no need to fire onRemoveSeat event since this function fires it
            // fire event after removing seat from shopping cart
            updateShoppingCart('remove', this.id, type, null, true);
            updateTotal();
        }

        // so the default context menu isn't showed
        return false;
    };

    /**
     * @private
     * Creates a new seat.
     * @param {string} type - The type of the seat.
     * @param {string} content - The name representing the seat.
     * @param {string} seatId - The html id of the seat in the seatmap.
     * @returns {HTMLDivElement} The seat.
     */
    var createSeat = function createSeat(type, content, seatId) {
        var seat = document.createElement('div');
        seat.textContent = content;
        seat.className = 'seatChart-seat ' + type;

        // if seatId wasn't passed as argument then don't set it
        if (seatId !== undefined) {
            seat.setAttribute('id', seatId);

            // add click event just if it's a real seats (when it has and id)
            seat.addEventListener('click', seatClick);
            seat.addEventListener('mousedown', mouseDownSeat);
            seat.addEventListener('mouseup', mouseUpSeat);
            seat.addEventListener('contextmenu', rightClickDelete, false);
        }

        return seat;
    };

    /**
     * @private
     * Creates a seat map row.
     * @param {string} rowIndex - The index that represent the row.
     * @returns {HTMLDivElement} The row.
     */
    var createRow = function createRow(rowIndex) {
        var row = document.createElement('div');
        row.className = 'seatChart-row';

        if (rowIndex === undefined) {
            row.appendChild(createSeat('blank', ''));
        } else {
            row.appendChild(createSeat('index', rowIndex));
        }

        return row;
    };

    /**
     * @private
     * Creates the header of the seatmap containing the front indicator.
     * @returns {HTMLDivElement} The seatmap header.
     */
    var createFrontHeader = function createFrontHeader() {
        var header = createRow();

        // initialize sound image element
        soundIcon = document.createElement('img');
        soundIcon.onclick = soundIconClick;
        soundIcon.alt = 'Sound icon. Click to enable/disable the sound.';
        setSoundIconSrc();

        // get header blank 'index' (actually a seat)
        var blankIndex = header.childNodes[0];
        blankIndex.appendChild(soundIcon);

        // set the perfect width of the front indicator
        var front = document.createElement('div');
        front.textContent = 'Front';
        front.className = 'seatChart-front';
        header.appendChild(front);

        return header;
    };

    /**
     * @private
     * Creates a row containing all the column indexes.
     * @returns {HTMLDivElement} The column indexes.
     */
    var createColumnsIndex = function createColumnsIndex() {
        var columnsIndex = createRow();

        for (var i = 1; i <= seatMap.cols; i += 1) {
            columnsIndex.appendChild(createSeat('index', i));
        }

        return columnsIndex;
    };

    /**
     * @private
     * Creates the container for the seat map and the legend.
     * @returns {HTMLDivElement} - The container.
     */
    var createContainer = function createContainer() {
        var container = document.createElement('div');
        container.className = 'seatChart-container';

        return container;
    };

    /**
     * @private
     * Removes all classes regarding the type applied to the seat.
     * @param {HTMLDivElement} seat - Seat element.
     */
    var removeAllTypesApplied = function removeAllTypesApplied(seat) {
        for (var i = 0; i < types.length; i += 1) {
            seat.classList.remove(types[i]);
        }
    };

    /**
     * @private
     * Sets all disabled seats as blank or reserved seats as unavailable.
     * params {string} type - The type of seats to set.
     */
    var setSeat = function setSeat(type) {
        if (seatMap[type] !== undefined) {
            var cols = seatMap.cols;

            for (var i = 0; i < seatMap[type].length; i += 1) {
                var index = seatMap[type][i];
                var id = '{0}_{1}'.format(Math.floor(index / cols), index % cols);
                var seat = document.getElementById(id);

                // prevents from null reference exception when json goes out of range
                if (seat != null) {
                    removeAllTypesApplied(seat);

                    if (type === 'disabled') {
                        seat.classList.add('blank');
                    } else if (type === 'reserved') {
                        seat.classList.add('unavailable');
                    }
                }
            }
        }
    };

    /**
     * @private
     * Loads seats, given with seat types, into the shopping cart.
     */
    var preloadScItems = function preloadScItems() {
        for (var i = 0; i < seatTypes.length; i += 1) {
            var seatType = seatTypes[i];

            if ({}.hasOwnProperty.call(seatType, 'selected') && seatType.selected) {
                var type = seatType.type;
                var price = seatType.price;

                for (var j = 0; j < seatType.selected.length; j += 1) {
                    var index = seatType.selected[j];
                    var row = Math.floor(index / seatMap.cols);
                    var column = index % seatMap.cols;
                    var id = '{0}_{1}'.format(row, column);
                    var seatName = '{0}{1}'.format(alphabet[row], column + 1);
                    var capitalizedType = type.capitalizeFirstLetter();
                    var description = '{0} - {1} {2}{3}\n'.format(seatName, capitalizedType, price, self.currency);

                    var scItem = createScItem(description, id);
                    scItemsContainer.appendChild(scItem);
                }
            }
        }
    };

    /**
     * @private
     * Selects seats given with seat types.
     */
    var preselectSeats = function preselectSeats() {
        for (var n = 0; n < seatTypes.length; n += 1) {
            var seatType = seatTypes[n];

            if ({}.hasOwnProperty.call(seatType, 'selected') && seatType.selected) {
                var type = seatType.type;
                var color = seatType.color;

                for (var l = 0; l < seatType.selected.length; l += 1) {
                    var index = seatType.selected[l];
                    var id = '{0}_{1}'.format(Math.floor(index / seatMap.cols), index % seatMap.cols);

                    var element = document.getElementById(id);
                    if (element) {
                        // set background
                        element.classList.remove('available');
                        element.classList.add(type);
                        element.classList.add('clicked');
                        element.style.backgroundColor = color;
                    }
                }
            }
        }
    };

    /**
     * Gets the price for a specific type of seat.
     * @param {string} type - The type of the seat.
     * @returns {number} The price.
     */
    this.getPrice = function getPrice(type) {
        for (var i = 0; i < seatTypes.length; i += 1) {
            if (seatTypes[i].type === type) {
                return seatTypes[i].price;
            }
        }

        throw new Error("Invalid parameter 'type' supplied to SeatchartJS.getPrice(). " +
                        "'type' does not exist in seatTypes.");
    };

    /**
     * Gets the total price of the selected seats.
     * @returns {number} - The total price.
     */
    this.getTotal = function getTotal() {
        var total = 0;
        for (var key in shoppingCartDict) {
            if ({}.hasOwnProperty.call(shoppingCartDict, key)) {
                total += self.getPrice(key) * shoppingCartDict[key].length;
            }
        }

        return total;
    };

    /**
     * Checks whether a seat is a gap or not.
     * @param {number} seatIndex - Seat index.
     * @returns {boolean} True if it is, false otherwise.
     */
    this.isGap = function isGap(seatIndex) {
        var row = Math.floor(seatIndex / seatMap.cols);
        var col = seatIndex % seatMap.cols;

        var seatId = '{0}_{1}'.format(row, col);

        // if current seat is disabled or reserved do not continue
        if (seatMap.disabled.indexOf(seatIndex) >= 0 ||
            seatMap.disabledCols.indexOf(col) >= 0 ||
            seatMap.disabledRows.indexOf(row) >= 0 ||
            seatMap.reserved.indexOf(seatIndex) >= 0
        ) {
            return false;
        }

        // if current seat is selected do not continue
        for (var key in shoppingCartDict) {
            if ({}.hasOwnProperty.call(shoppingCartDict, key)) {
                if (shoppingCartDict[key].indexOf(seatId) >= 0) {
                    return false;
                }
            }
        }

        var colBefore = col - 1;
        var colAfter = col + 1;

        var seatBefore = seatIndex - 1;
        var seatAfter = seatIndex + 1;

        var isSeatBeforeDisabled = seatMap.disabled.indexOf(seatBefore) >= 0;
        var isSeatAfterDisabled = seatMap.disabled.indexOf(seatAfter) >= 0;

        var isSeatBeforeReserved = seatMap.reserved.indexOf(seatBefore) >= 0;
        var isSeatAfterReserved = seatMap.reserved.indexOf(seatAfter) >= 0;

        // if there's a disabled/disabled block before and after do not consider it a gap
        if ((isSeatBeforeDisabled && isSeatAfterDisabled) ||
            (isSeatBeforeReserved && isSeatAfterReserved) ||
            (isSeatBeforeReserved && isSeatAfterDisabled) ||
            (isSeatBeforeDisabled && isSeatAfterReserved)) {
            return false;
        }

        // if there's a disabled/reserved block before and no seats after because the seatchart ends or,
        // a disabled/reserved block after and no seats before, then do not consider it a gap
        if (((isSeatBeforeDisabled || isSeatBeforeReserved) && colAfter >= seatMap.cols) ||
            (colBefore < 0 && (isSeatAfterDisabled || isSeatAfterReserved))) {
            return false;
        }

        var seatBeforeId = '{0}_{1}'.format(row, colBefore);
        var seatAfterId = '{0}_{1}'.format(row, colAfter);

        var isSeatBeforeSelected = false;
        var isSeatAfterSelected = false;

        // check if seat before and after are selected
        for (var type in shoppingCartDict) {
            if ({}.hasOwnProperty.call(shoppingCartDict, type)) {
                if (!isSeatBeforeSelected) {
                    isSeatBeforeSelected = shoppingCartDict[type].indexOf(seatBeforeId) >= 0;
                }

                if (!isSeatAfterSelected) {
                    isSeatAfterSelected = shoppingCartDict[type].indexOf(seatAfterId) >= 0;
                }

                if (isSeatAfterSelected && isSeatBeforeSelected) {
                    break;
                }
            }
        }

        var isSeatBeforeUnavailable = colBefore < 0 ||
            seatMap.reserved.indexOf(seatBefore) >= 0 ||
            isSeatBeforeDisabled ||
            isSeatBeforeSelected;

        var isSeatAfterUnavailable = colAfter >= seatMap.cols ||
            seatMap.reserved.indexOf(seatAfter) >= 0 ||
            isSeatAfterDisabled ||
            isSeatAfterSelected;

        return isSeatBeforeUnavailable && isSeatAfterUnavailable;
    };

    /**
     * Checks whether a seat creates a gap or not.
     * @param {number} seatIndex - Seat index.
     * @returns {boolean} True if it does, false otherwise.
     */
    this.makesGap = function makesGap(seatIndex) {
        var col = seatIndex % seatMap.cols;

        var isSeatBeforeGap = false;
        if (seatIndex - 1 >= 0 && col > 0) {
            isSeatBeforeGap = this.isGap(seatIndex - 1);
        }

        var isSeatAfterGap = false;
        if (seatIndex + 1 < seatMap.cols * seatMap.rows && col < seatMap.cols) {
            isSeatAfterGap = this.isGap(seatIndex + 1);
        }

        return isSeatBeforeGap || isSeatAfterGap;
    };

    /**
     * Gets all gaps of the seat map.
     * @returns {Array.<number>} Array of indexes.
     */
    this.getGaps = function getGaps() {
        var gaps = [];
        var count = seatMap.cols * seatMap.rows;
        for (var i = 0; i < count; i += 1) {
            if (this.isGap(i)) {
                gaps.push(i);
            }
        }

        return gaps;
    };

    /**
     * Get seat info.
     * @param {number} index - Seat index.
     * @returns {Object.<{type: string, id: string, index: number, name: string, price: number}>} Seat info.
     */
    this.get = function get(index) {
        if (typeof index !== 'number' && Math.floor(index) === index) {
            throw new Error("Invalid parameter 'index' supplied to SeatchartJS.get(). It must be an integer.");
        }

        if (index < seatMap.rows * seatMap.cols) {
            var row = Math.floor(index / seatMap.cols);
            var col = index % seatMap.cols;
            var seatId = '{0}_{1}'.format(row, col);
            var seatName = getSeatName(seatId);

            // check if seat is reserved
            if (seatMap.reserved.indexOf(index) >= 0) {
                return {
                    type: 'reserved',
                    id: seatId,
                    index: index,
                    name: seatName,
                    price: null
                };
            }

            // check if seat is reserved
            if (seatMap.disabled.indexOf(index) >= 0) {
                return {
                    type: 'disabled',
                    id: seatId,
                    index: index,
                    name: seatName,
                    price: null
                };
            }

            // check if seat is already selected
            for (var type in shoppingCartDict) {
                if ({}.hasOwnProperty.call(shoppingCartDict, type)) {
                    var price = this.getPrice(type);
                    if (shoppingCartDict[type].indexOf(seatId) >= 0) {
                        return {
                            type: type,
                            id: seatId,
                            index: index,
                            name: seatName,
                            price: price
                        };
                    }
                }
            }

            return {
                type: 'available',
                id: seatId,
                index: index,
                name: seatName,
                price: null
            };
        }

        throw new Error("Invalid parameter 'index' supplied to SeatchartJS.get(). Index is out of range.");
    };

    /**
     * Set seat type.
     * @param {number} index - Index of the seat to update.
     * @param {string} type - New seat type.
     * @param {boolean} emit - True to trigger onAddedSeat or onRemovedSeat events (default is false).
     * @param {boolean} sound - True to play sound (default is false, it works only if sound is enabled).
     */
    this.set = function set(index, type, emit, sound) {
        if (typeof index !== 'number' && Math.floor(index) === index) {
            throw new Error("Invalid parameter 'index' supplied to SeatchartJS.set(). It must be an integer.");
        } else if (index >= seatMap.rows * seatMap.cols) {
            throw new Error("Invalid parameter 'index' supplied to SeatchartJS.set(). Index is out of range.");
        } else if (typeof type !== 'string') {
            throw new Error("Invalid parameter 'type' supplied to SeatchartJS.set(). It must be a string.");
        } else {
            var seatType = seatTypes.find(function findSeatType(x) {
                return x.type === type;
            });

            // check if type is valid
            if (['available', 'reserved', 'disabled'].indexOf(type) < 0 && !seatType) {
                throw new Error("Invalid parameter 'type' supplied to SeatchartJS.set().");
            } else if (emit && typeof emit !== 'boolean') {
                throw new Error("Invalid parameter 'emit' supplied to SeatchartJS.set(). It must be a boolean.");
            } else if (sound && typeof sound !== 'boolean') {
                throw new Error("Invalid parameter 'sound' supplied to SeatchartJS.set(). It must be a boolean.");
            }
        }

        var seat = self.get(index);
        if (!seat || seat.type === type) {
            return;
        }

        var classes = {
            disabled: 'blank',
            reserved: 'unavailable'
        };

        var element = document.getElementById(seat.id);

        if (seat.type === 'disabled' || seat.type === 'reserved') {
            var arrayIndex = seatMap[seat.type].indexOf(index);
            seatMap[seat.type].splice(arrayIndex, 1);
        }

        if (type === 'reserved' || type === 'disabled') {
            seatMap[type].push(index);
        }

        if (seat.type !== 'available' && seat.type !== 'disabled' && seat.type !== 'reserved') {
            if (type !== 'available' && type !== 'disabled' && type !== 'reserved') {
                if (removeFromScDict(seat.id, seat.type) && addToScDict(seat.id, type)) {
                    element.classList.add('clicked');
                    element.style.setProperty('background-color', seatType.color);
                    updateShoppingCart('update', seat.id, type, seat.type, emit);
                }
            } else if (removeFromScDict(seat.id, seat.type)) {
                element.classList.remove('clicked');
                element.style.removeProperty('background-color');
                updateShoppingCart('remove', seat.id, seat.type, null, emit);
            }
        } else if (type !== 'available' && type !== 'disabled' && type !== 'reserved') {
            if (addToScDict(seat.id, type)) {
                element.classList.add('clicked');
                element.style.setProperty('background-color', seatType.color);
                updateShoppingCart('add', seat.id, type, null, emit);
            }
        }

        types.forEach(function mapClassNames(x) {
            classes[x] = x;
        });

        element.classList.add(classes[type]);
        element.classList.remove(classes[seat.type]);

        if (sound) {
            playAsyncClick();
        }

        updateTotal();
    };

    /**
     * This event is triggered when a seat is added to the shopping cart.
     * (This event works even when a shopping cart isn't created,
     * because the virtual one works independently.)
     *
     * @event SeatchartJS#onAddedSeat
     */
    this.onAddedSeat = null;

    /**
     * This event is triggered when a seat is removed from the shopping cart.
     * (This event works even when a shopping cart isn't created,
     * because the virtual one works independently.)
     *
     *  @event SeatchartJS#onRemovedSeat
     */
    this.onRemovedSeat = null;

    /**
     * Creates the seatmap.
     * @param {string} containerId - The html id of the container that is going to contain the seatmap.
     */
    this.createMap = function createMap(containerId) {
        // create seat map container
        var seatMapContainer = createContainer();
        // add header to container
        seatMapContainer.appendChild(createFrontHeader());
        // add columns index to container
        seatMapContainer.appendChild(createColumnsIndex());

        // add rows containing seats
        for (var i = 0; i < seatMap.rows; i += 1) {
            var rowIndex = alphabet[i];
            var row = createRow(rowIndex);

            for (var j = 0; j < seatMap.cols; j += 1) {
                row.appendChild(createSeat('available', rowIndex + (j + 1), i + '_' + j));
            }

            seatMapContainer.appendChild(row);
        }

        // inject the seat map into the container given as input
        var container = document.getElementById(containerId);
        container.appendChild(seatMapContainer);

        // set front indicator
        var seat = document.getElementsByClassName('seatChart-seat')[0];
        var width = seat.offsetWidth;

        var computedStyle = getStyle(seat);
        var margins = parseInt(computedStyle.marginLeft, 10) +
                      parseInt(computedStyle.marginRight, 10);

        // set seatmap width
        // +1 because of the row indexer
        seatMapContainer.style.width = '{0}px'.format(((width + margins) * (seatMap.cols + 1)) +
                                       margins);

        var front = seatMapContainer.getElementsByClassName('seatChart-front')[0];
        front.style.width = '{0}px'.format(((width + margins) * seatMap.cols) - margins);

        // add disabled columns to disabled array
        if (seatMap.disabledCols) {
            for (var k = 0; k < seatMap.disabledCols.length; k += 1) {
                var disabledColumn = seatMap.disabledCols[k];
                for (var r = 0; r < seatMap.rows; r += 1) {
                    seatMap.disabled.push((seatMap.cols * r) + disabledColumn);
                }
            }
        }

        // add disabled rows to disabled array
        if (seatMap.disabledRows) {
            for (var m = 0; m < seatMap.disabledRows.length; m += 1) {
                var disabledRow = seatMap.disabledRows[m];
                for (var c = 0; c < seatMap.cols; c += 1) {
                    seatMap.disabled.push((seatMap.cols * disabledRow) + c);
                }
            }
        }

        setSeat('reserved');
        setSeat('disabled');
        preselectSeats();
    };

    /**
     * @private
     * Creates a legend item and applies a type and a color if needed.
     * @param {string} content - The text in the legend that explains the type of seat.
     * @param {string} type - The type of seat.
     * @param {string} color - The background color of the item in the legend.
     * @returns {HTMLListItemElement} The legend item.
     */
    var createLegendItem = function createLegendItem(content, type, color) {
        var item = document.createElement('li');
        item.className = 'seatChart-legend-item';
        var itemStyle = document.createElement('div');
        itemStyle.className = 'seatChart-seat legend-style {0}'.format(type);
        var description = document.createElement('p');
        description.className = 'seatChart-legend-description';
        description.textContent = content;

        if (color !== undefined) {
            itemStyle.className = '{0} clicked'.format(itemStyle.className);
            itemStyle.style.backgroundColor = color;
        }

        item.appendChild(itemStyle);
        item.appendChild(description);

        return item;
    };

    /**
     * @private
     * Creates a legend list.
     * @returns {HTMLUnorderedListElement} The legend list.
     */
    var createLegendList = function createLegendList() {
        var list = document.createElement('ul');
        list.className = 'seatChart-legend-list';

        return list;
    };

    /**
     * @private
     * Creates a small title.
     * @param {string} content - The content of the title.
     * @returns {HTMLHeadingElement} The small title.
     */
    var createSmallTitle = function createSmallTitle(content) {
        var smallTitle = document.createElement('h5');
        smallTitle.textContent = content;
        smallTitle.className = 'seatChart-small-title';

        return smallTitle;
    };

    /**
     * Creates the legend of the seatmap.
     * @param {string} containerId - The id of the container that is going to contain the legend.
     */
    this.createLegend = function createLegend(containerId) {
        // create legend container
        var seatLegendContainer = createContainer();

        var legendTitle = createTitle('Legend');

        var seatsListTitle = createSmallTitle('Seats:');
        var seatsList = createLegendList();
        seatsList.appendChild(createLegendItem('Available', 'available'));
        seatsList.appendChild(createLegendItem('Already booked', 'unavailable'));

        var yourSeatsListTitle = createSmallTitle('Your seat(s):');
        var yourSeatsList = createLegendList();
        for (var i = 0; i < seatTypes.length; i += 1) {
            var description = '{0} {1}{2}'.format(
                seatTypes[i].type.capitalizeFirstLetter(),
                seatTypes[i].price,
                self.currency
            );
            var item = createLegendItem(description, '', seatTypes[i].color);
            yourSeatsList.appendChild(item);
        }

        seatLegendContainer.appendChild(legendTitle);
        seatLegendContainer.appendChild(seatsListTitle);
        seatLegendContainer.appendChild(seatsList);
        seatLegendContainer.appendChild(yourSeatsListTitle);
        seatLegendContainer.appendChild(yourSeatsList);

        var container = document.getElementById(containerId);
        container.appendChild(seatLegendContainer);
    };

    /**
     * @private
     * Creates the container of the items in the shopping cart.
     * @returns {HTMLDivElement} The container of the items.
     */
    var createScItemsContainer = function createScItemsContainer() {
        var container = document.createElement('div');
        container.className = 'seatChart-sc-items-container';

        return container;
    };

    /**
     * @private
     * This function is fired when the "delete all" button is clicked in the shopping cart.
     */
    var deleteAllClick = function deleteAllClick() {
        // release all selected seats and remove them from dictionary
        for (var key in shoppingCartDict) {
            if ({}.hasOwnProperty.call(shoppingCartDict, key)) {
                for (var i = 0; i < shoppingCartDict[key].length; i += 1) {
                    var id = shoppingCartDict[key][i];

                    // deselect seat
                    releaseSeat(id);

                    var seat = mapShoppingCartValue(id);
                    var seatName = getSeatName(id);
                    var type = getSeatType(id);

                    // get price before capitalizing since indexing is case sensitive
                    var price = self.getPrice(type);

                    // fire event
                    if (self.onRemovedSeat != null) {
                        self.onRemovedSeat(seatName, type.capitalizeFirstLetter(), price, seat);
                    }
                }

                // empty array, fastest way instead of removing each seat
                shoppingCartDict[key] = [];
            }
        }

        // empty shopping cart, fastest way instead of removing each item
        scItemsContainer.innerHTML = '';

        updateTotal();
    };

    /**
     * @private
     * Creates the total of the shopping cart and a "delete all" button.
     * @returns {HTMLDivElement} The total and "delete all" button.
     */
    var createScTotal = function createScTotal() {
        var container = document.createElement('div');

        shoppingCartTotal = createSmallTitle('Total: {0}{1}'.format(self.getTotal(), self.currency));
        shoppingCartTotal.className += ' seatChart-sc-total';

        var deleteBtn = createScDeleteButton();
        deleteBtn.onclick = deleteAllClick;
        deleteBtn.className += ' all';

        var label = document.createElement('p');
        label.textContent = 'All';
        deleteBtn.appendChild(label);

        container.appendChild(shoppingCartTotal);
        container.appendChild(deleteBtn);

        return container;
    };

    /**
     * @private
     * Creates the shopping cart.
     */
    this.createShoppingCart = function createShoppingCart(containerId) {
        var shoppingCartContainer = createContainer();
        var shoppingCartTitle = createIconedTitle(
            'Shopping cart',
            '{0}/icons/shoppingcart.svg'.format(self.assetsSrc),
            'Shopping cart icon.'
        );

        scItemsContainer = createScItemsContainer();
        scItemsContainer.style.width = '{0}px'.format(self.shoppingCartWidth);
        scItemsContainer.style.height = '{0}px'.format(self.shoppingCartHeight);

        preloadScItems();
        var scTotal = createScTotal();

        shoppingCartContainer.appendChild(shoppingCartTitle);
        shoppingCartContainer.appendChild(scItemsContainer);
        shoppingCartContainer.appendChild(scTotal);

        var container = document.getElementById(containerId);
        container.appendChild(shoppingCartContainer);
    };
}
