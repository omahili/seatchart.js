/**
 * Creates a seatchart.
 * @constructor
 *
 * @param {Object} seatMap - Seatmap options.
 * @param {number} seatMap.rows - Number of rows.
 * @param {number} seatMap.cols - Number of columns.
 * @param {Array.<number>} [seatMap.reserved] - Array of reserved seats.
 * @param {Array.<number>} [seatMap.disabled] - Array of disabled seats.
 * @param {Array.<number>} [seatMap.disabledRows] - Array of the disabled rows of seats.
 * @param {Array.<number>} [seatMap.disabledCols] - Array of the disabled columns of seats.
 *
 * @param {Array.<Object>} seatTypes - Seat type options.
 * @param {string} seatTypes.type - Name of seat type.
 * @param {string} seatTypes.backgroundColor - Background color of the defined seat type.
 * @param {number} seatTypes.price - Price of the defined seat type.
 * @param {string} [seatTypes.color = 'white'] - Text color of the defined seat type.
 * @param {Array.<number>} [seatTypes.selected] - Selected seats of the defined seat type.
 */
function Seatchart(seatMap, seatTypes) { // eslint-disable-line no-unused-vars
    /**
     * .NET equivalent of string.Format() method
     * @returns {string} The formatted string.
     * @private
     */
    String.prototype.format = function format() {
        var args = arguments;
        return this.replace(/{(\d+)}/g, function replace(match, number) {
            return typeof args[number] !== 'undefined' ? args[number] : match;
        });
    };

    /**
     * Capitalizes the first letter and lowers all the others.
     * @returns {string} The formatted string.
     * @private
     */
    String.prototype.capitalizeFirstLetter = function capitalizeFirstLetter() {
        var result = this.charAt(0).toUpperCase();
        for (var i = 1; i < this.length; i += 1) {
            result += this.charAt(i).toLowerCase();
        }

        return result;
    };

    /**
     * Computes the style of an element, it works even on ie :P.
     * @params {Element} el - The element for which we're getting the computed style.
     * @returns {CSSStyleDeclaration} The css of the element.
     * @private
     */
    var getStyle = function getStyle(el) {
        if (typeof window.getComputedStyle !== 'undefined') {
            return window.getComputedStyle(el, null);
        }

        return el.currentStyle;
    };

    // check seatMap parameter
    if (seatMap === undefined) {
        throw new Error("Invalid parameter 'seatMap' supplied to Seatchart. Cannot be undefined.");
    } else if (typeof seatMap !== 'object') {
        throw new Error("Invalid parameter 'seatMap' supplied to Seatchart. Must be an object.");
    } else if (!{}.hasOwnProperty.call(seatMap, 'rows') || !{}.hasOwnProperty.call(seatMap, 'cols')) {
        throw new Error("Invalid parameter 'seatMap' supplied to Seatchart. " +
                        "'row' and 'cols' properties cannot be undefined.");
    } else if (seatMap.rows > 25 || seatMap.cols > 25) {
        throw new Error("Invalid parameter 'seatMap' supplied to Seatchart. " +
                        "'row' and 'cols' properties cannot be integers greater than 25.");
    } else if (seatMap.rows < 2 || seatMap.cols < 2) {
        throw new Error("Invalid parameter 'seatMap' supplied to Seatchart. " +
                        "'row' and 'cols' properties cannot be integers smaller than 2.");
    }

    // check seatTypes parameter
    if (seatTypes === undefined) {
        throw new Error("Invalid parameter 'seatTypes' supplied to Seatchart. Cannot be undefined.");
      // check if seatTypes is an array and contains at least one element
    } else if (!Array.isArray(seatTypes) || seatTypes.length < 1 || typeof seatTypes[0] !== 'object') {
        throw new Error("Invalid parameter 'seatTypes' supplied to Seatchart. " +
                        'Must be an array of objects containing at least one element.');
    } else {
        // check if all elements have the needed attribute and contain the right type of value
        for (var i = 0; i < seatTypes.length; i += 1) {
            if (!{}.hasOwnProperty.call(seatTypes[i], 'type') ||
                !{}.hasOwnProperty.call(seatTypes[i], 'backgroundColor') ||
                !{}.hasOwnProperty.call(seatTypes[i], 'price')) {
                throw new Error(("Invalid parameter 'seatTypes' supplied to Seatchart. " +
                                "Element at index {0} must contain a 'type', " +
                                "a 'backgroundColor' and a 'price' property.").format(i));
            } else if (!(typeof seatTypes[i].type === 'string' || seatTypes[i].type instanceof String)) {
                throw new Error(("Invalid parameter 'seatTypes' supplied to Seatchart. " +
                                "'type' property at index {0} must be a string.").format(i));
            } else if (!(typeof seatTypes[i].backgroundColor === 'string' ||
                        seatTypes[i].backgroundColor instanceof String)) {
                throw new Error(("Invalid parameter 'seatTypes' supplied to Seatchart. " +
                                "'backgroundColor' property at index {0} must be a string.").format(i));
            } else if (typeof seatTypes[i].price !== 'number') {
                throw new Error(("Invalid parameter 'seatTypes' supplied to Seatchart. " +
                                "'price' property at index {0} must be a number.").format(i));
            }
        }
    }

    // check the given input
    for (var x = 0; x < seatTypes.length; x += 1) {
        for (var y = x + 1; y < seatTypes.length; y += 1) {
            if (seatTypes[x].type.capitalizeFirstLetter() ===
                seatTypes[y].type.capitalizeFirstLetter()) {
                throw new Error(("Invalid parameter 'seatTypes' supplied to Seatchart. " +
                                "'{0}' and '{1}' types are equal and must be different. " +
                                'Types are case insensitive.').format(seatTypes[x].type, seatTypes[y].type));
            }
        }
    }


    /*
     * TYPE DEFINITIONS
     */

    /**
     * @typedef {Object} Seat
     * @property {string} type - Seat type.
     * @property {number} id - Seat id.
     * @property {number} index - Seat index.
     * @property {string} name - Seat name.
     * @property {number} price - Seat price.
     */

    /**
     * @typedef {Object} ChangeEvent
     * @property {('add' | 'remove' | 'update')} action - Action on seat.
     * @property {Seat} current - Current seat info.
     * @property {Seat} previous - Seat info previous to the event.
     */

    /**
     * @typedef {Array.<Object>} ClearEvent
     * @property {Seat} current - Current seat info.
     * @property {Seat} previous - Seat info previous to the event.
     */


    /**
     * This object.
     * @type {seatchartJS}
     * @private
     */
    var self = this;

    /**
     * Gets the current currency.
     * @type {string}
     * @private
     */
    self.currency = '€';

    /**
     * The path where the assets are located.
     * @type {string}
     * @private
     */
    self.assetsSrc = 'assets';

    /**
     * The shopping cart width.
     * @type {number}
     * @private
     */
    self.cartWidth = 200;

    /**
     * The shopping cart height.
     * @type {number}
     * @private
     */
    self.cartHeight = 200;

    /**
     * An object containing all seats added to the shopping cart, mapped by seat type.
     * @type {Object<string, Array.<number>>}
     * @private
     */
    var cart = {};

    /**
     * Sets the current currency.
     * @example
     * sc.setCurrency('$');
     * @param {string} value - A string that represents the currency.
     */
    this.setCurrency = function setCurrency(value) {
        if (typeof value === 'string' || value instanceof String) {
            self.currency = value;
        } else {
            throw new Error("Invalid parameter 'value' supplied to Seatchart.setCurrency(). Must be a string.");
        }
    };

    /**
     * Gets the current currency.
     * @returns {string} A string that represents the currency.
     */
    this.getCurrency = function getCurrency() {
        return self.currency;
    };

    /**
     * Sets the path where the assets are located.
     * @param {string} value - The path where the assets are located.
     */
    this.setAssetsSrc = function setAssetsSrc(value) {
        if (typeof value === 'string' || value instanceof String) {
            self.assetsSrc = value;
        } else {
            throw new Error("Invalid parameter 'value' supplied to Seatchart.setAssetsSrc(). Must be a string.");
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
     * Sets the shopping cart width.
     * @param {number} value - The shopping cart width.
     */
    this.setCartWidth = function setCartWidth(value) {
        if (typeof value === 'number' && value >= 0) {
            self.cartWidth = value;
        } else {
            throw new Error("Invalid parameter 'value' supplied to Seatchart.setCartWidth(). " +
                            'Must be positive number.');
        }
    };

    /**
     * Gets the shopping cart width.
     * @returns {number} The shopping cart width.
     */
    this.getCartWidth = function getCartWidth() {
        return self.cartWidth;
    };

    /**
     * Sets the shopping cart height.
     * @param {number} value - The shopping cart height.
     */
    this.setCartHeight = function setCartHeight(value) {
        if (typeof value === 'number' && value >= 0) {
            self.cartHeight = value;
        } else {
            throw new Error("Invalid parameter 'value' supplied to Seatchart.setCartHeight(). " +
                            'Must be positive number.');
        }
    };

    /**
     * Gets the shopping cart height.
     * @returns {number} The shopping cart height.
     */
    this.getCartHeight = function getCartHeight() {
        return self.cartHeight;
    };

    /**
    * Gets a reference to the shopping cart object.
    * @returns {Object<string, Array.<number>>} An object containing all seats added to the shopping cart, mapped by seat type.
    */
    this.getCart = function getCart() {
        return cart;
    };

    /**
     * A string containing all the letters of the english alphabet.
     * @type {string}
     * @private
     */
    var alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

    /**
     * An array of strings containing all the pickable seat types, "available" included.
     * @type {Array.<string>}
     * @private
     */
    var types = [];

    /**
     * The main div container containing all the shopping cart elements.
     * @type {HTMLDivElement}
     * @private
     */
    var cartTable;

    /**
     * The text that shows the total cost of the items in the shopping cart.
     * @type {HTMLHeadingElement}
     * @private
     */
    var cartTotal;

    /**
     * Text that show total number of items in the shopping cart.
     * @type {HTMLHeadingElement}
     * @private
     */
    var cartItemsCounter;

    /**
     * A dictionary containing all seats added to the shopping cart, mapped by seat type.
     * Each string is composed by row (r) and column (c) indexed in the following format: "r_c",
     * which is the id of the seat in the document.
     * @type {Object<string, Array.<number>>}
     * @property {string} - Seat type.
     * @property {Array.<number>} - Ids of the seats added to the cart.
     * @private
     */
    var cartDict = {};

    /**
     * Adds a seat to the shopping cart dictionary.
     * @param {string} id - The dom id of the seat in the seatmap.
     * @param {string} type - The type of the seat.
     * @returns {boolean} True if the seat is added correctly otherwise false.
     * @private
     */
    var addToCartDict = function addToCartDict(id, type) {
        if (type in cartDict) {
            if ({}.hasOwnProperty.call(cartDict, type)) {
                cartDict[type].push(id);
                return true;
            }
        }

        return false;
    };

    /**
     * Initializes the type of seats that can be clicked and
     * the types of seat that can be added to the shopping cart
     * by using the json, containing the types, given in input.
     * @private
     */
    var initializeSeatTypes = function initializeSeatTypes() {
        // update types of seat
        types = ['available'];
        cartDict = [];

        for (var i = 0; i < seatTypes.length; i += 1) {
            types.push(seatTypes[i].type);
            cartDict[seatTypes[i].type] = [];
        }
    };

    /**
     * Converts a seat id to an index.
     * @private
     */
    var getIndexFromId = function mapValues(x) {
        var values = x.split('_').map(function parseValues(x) {
            return parseInt(x, 10);
        });

        return (seatMap.cols * values[0]) + values[1];
    };

    /**
     * Updates shopping cart object: values stored into cartDict are mapped to fit
     * cart type and format. (See private variables cartDict and cart.)
     * @private
     */
    var updateCartObject = function updateCartObject() {
        for (var s in cartDict) {
            if ({}.hasOwnProperty.call(cartDict, s)) {
                cart[s] = cartDict[s].map(getIndexFromId);
            }
        }
    };

    /**
     * Loads seats into cartDict.
     * @private
     */
    var loadCart = function loadCart() {
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
                    addToCartDict(id, type);
                }
            }
        }

        updateCartObject();
    };

    loadCart();

    /**
     * Create a delete button for a shopping cart item.
     * @returns {HTMLDivElement} The delete button.
     * @private
     */
    var createScDeleteButton = function createScDeleteButton() {
        var binImg = document.createElement('img');
        binImg.src = '{0}/icons/bin.svg'.format(self.assetsSrc);

        var deleteBtn = document.createElement('div');
        deleteBtn.className = 'sc-cart-delete';
        deleteBtn.appendChild(binImg);

        return deleteBtn;
    };

    /**
     * Gets the name of a seat.
     * @param {string} id - The dom id of the seat in the seatmap.
     * @returns {string} The name.
     * @private
     */
    var getSeatName = function getSeatName(id) {
        return document.getElementById(id).textContent;
    };

    /**
     * Gets the type of a seat.
     * @param {string} id - The dom id of the seat in the seatmap.
     * @returns {string} The type.
     * @private
     */
    var getSeatType = function getSeatType(id) {
        for (var key in cartDict) {
            if ({}.hasOwnProperty.call(cartDict, key)) {
                if (cartDict[key].indexOf(id) >= 0) {
                    return key;
                }
            }
        }

        throw new Error("Invalid parameter 'id' supplied to Seatchart.getSeatType(). " +
                        "'id' is not defined in cartDict.");
    };

    /**
     * Makes a seat available,
     * @param {string} id - The dom id of the seat in the seatmap.
     * @private
     */
    var releaseSeat = function releaseSeat(id) {
        var seat = document.getElementById(id);
        seat.style.cssText = '';
        seat.className = 'sc-seat available';
    };

    /**
     * Removes a seat from the shopping cart dictionary containing it.
     * @param {string} id - The dom id of the seat in the seatmap.
     * @param {string} type - The type of the seat.
     * @returns {boolean} True if the seat is removed correctly otherwise false.
     * @private
     */
    var removeFromCartDict = function removeFromCartDict(id, type) {
        if (type !== undefined) {
            if (type in cartDict) {
                var index = cartDict[type].indexOf(id);
                if (index > -1) {
                    cartDict[type].splice(index, 1);
                    return true;
                }
            }
        } else {
            for (var key in cartDict) {
                if ({}.hasOwnProperty.call(cartDict, key)) {
                    if (removeFromCartDict(id, key)) {
                        return true;
                    }
                }
            }
        }

        return false;
    };

    /**
     * Updates the total price and items counter in the shopping cart.
     * @private
     */
    var updateTotal = function updateTotal() {
        if (cartTotal !== undefined) {
            cartTotal.textContent = 'Total: {0}{1}'.format(self.currency, self.getTotal().toFixed(2));
        }

        if (cartItemsCounter !== undefined) {
            cartItemsCounter.textContent = '({0})'.format(cartTable.childNodes.length);
        }
    };

    /**
     * This function is fired when a delete button is clicked in the shopping cart.
     * @private
     */
    var deleteClick = function deleteClick() {
        var column = this.parentNode;
        var item = column.parentNode;
        var parentId = item.getAttribute('id');
        document.getElementById(parentId).outerHTML = '';

        var id = parentId.split('-')[1];
        var type = getSeatType(id);

        releaseSeat(id);
        removeFromCartDict(id);
        updateTotal();

        // fire event
        if (self.onChange != null) {
            var index = getIndexFromId(id);
            var seatName = getSeatName(id);

            var current = {
                type: 'available',
                id: id,
                index: index,
                name: seatName,
                price: null
            };
            var previous = {
                type: type,
                id: id,
                index: index,
                name: seatName,
                price: self.getPrice(type)
            };

            self.onChange({
                action: 'remove',
                current: current,
                previous: previous
            });
        }
    };

    /**
     * Creates a ticket to place into the shopping cart.
     * @param {Seat} seat - Seat info.
     * @returns {HTMLDivElement} The ticket.
     * @private
     */
    var createTicket = function createTicker(seat) {
        var seatConfig = seatTypes.find(function findSeatType(x) {
            return x.type === seat.type;
        });

        var ticket = document.createElement('div');
        ticket.className = 'sc-ticket';
        ticket.style.color = seatConfig.color;
        ticket.style.backgroundColor = seatConfig.backgroundColor;

        var stripes = document.createElement('div');
        stripes.className = 'sc-ticket-stripes';

        var seatName = document.createElement('div');
        seatName.textContent = seat.name;
        seatName.className = 'sc-cart-seat-name';

        var seatType = document.createElement('div');
        seatType.textContent = seat.type.capitalizeFirstLetter();
        seatType.className = 'sc-cart-seat-type';

        ticket.appendChild(stripes);
        ticket.appendChild(seatName);
        ticket.appendChild(seatType);
        ticket.appendChild(stripes.cloneNode(true));

        return ticket;
    };

    /**
     * Creates a shopping cart item.
     * @param {Seat} seat - Seat info.
     * @returns {HTMLDivElement} The shopping cart item.
     * @private
     */
    var createCartItem = function createCartItem(seat) {
        var item = document.createElement('tr');

        var ticketTd = document.createElement('td');
        ticketTd.className = 'sc-ticket-container';

        var ticket = createTicket(seat);
        ticketTd.appendChild(ticket);

        var seatPrice = document.createElement('td');
        seatPrice.textContent = '{0}{1}'.format(self.currency, seat.price.toFixed(2));

        var deleteTd = document.createElement('td');
        var deleteBtn = createScDeleteButton();
        deleteBtn.onclick = deleteClick;

        deleteTd.appendChild(deleteBtn);

        item.setAttribute('id', 'item-{0}'.format(seat.id));
        item.appendChild(ticketTd);
        item.appendChild(seatPrice);
        item.appendChild(deleteTd);

        return item;
    };

    /**
     * Updates the shopping cart by adding, removing or updating a seat.
     * @param {('remove' | 'add' | 'update')} action - Action on the shopping cart.
     * @param {string} id - Id of the seat in the dom.
     * @param {string} type - New seat type.
     * @param {string} previousType - Previous seat type.
     * @param {boolean} emit - True to trigger onChange events.
     * @private
     */
    var updateCart = function updateCart(action, id, type, previousType, emit) {
        var seatName = getSeatName(id);
        var index = getIndexFromId(id);
        var price = ['available', 'disabled', 'reserved'].indexOf(type) < 0 ?
            self.getPrice(type) :
            null;

        var current = {
            type: type,
            id: id,
            index: index,
            name: seatName,
            price: price
        };
        var previous = {
            type: previousType,
            id: id,
            index: index,
            name: seatName,
            price: ['available', 'disabled', 'reserved'].indexOf(previousType) < 0 ?
                self.getPrice(previousType) :
                null
        };

        var cartItem;

        updateCartObject();

        if (action === 'remove') {
            if (cartTable !== undefined) {
                document.getElementById('item-{0}'.format(id)).outerHTML = '';
            }

            if (emit && self.onChange !== null) {
                self.onChange({
                    action: action,
                    current: current,
                    previous: previous
                });
            }
        } else if (action === 'add') {
            if (cartTable !== undefined) {
                cartItem = createCartItem(current);
                cartTable.appendChild(cartItem);
            }

            if (emit && self.onChange !== null) {
                self.onChange({
                    action: action,
                    current: current,
                    previous: previous
                });
            }
        } else if (action === 'update') {
            cartItem = document.getElementById('item-{0}'.format(id));
            var itemContent = cartItem.getElementsByTagName('td');

            var seatConfig = seatTypes.find(function findSeatType(x) {
                return x.type === current.type;
            });

            var ticket = itemContent[0].getElementsByClassName('sc-ticket')[0];
            ticket.style.backgroundColor = seatConfig.backgroundColor;
            ticket.style.color = seatConfig.color;

            var ticketType = ticket.getElementsByClassName('sc-cart-seat-type')[0];
            ticketType.textContent = current.type.capitalizeFirstLetter();

            var ticketPrice = itemContent[1];
            ticketPrice.textContent = '{0}{1}'.format(self.currency, current.price.toFixed(2));

            if (emit && self.onChange !== null) {
                self.onChange({
                    action: action,
                    current: current,
                    previous: previous
                });
            }
        }
    };

    /**
     * Creates a title.
     * @param {string} content - The content of the title.
     * @returns {HTMLHeadingElement} The title.
     * @private
     */
    var createTitle = function createTitle(content) {
        var title = document.createElement('h3');
        title.textContent = content;
        title.className = 'sc-title';

        return title;
    };

    /**
     * Creates a title with an icon.
     * @param {string} content - The title.
     * @param {string} src - The source path of the icon.
     * @param {string} alt - The text to be displed when the image isn't loaded properly.
     * @returns {HTMLDivElement} The iconed title.
     * @private
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
     * This function is fired when a seat is clicked in the seatmap.
     * @private
     */
    var seatClick = function seatClick() {
        // clone array because it's modified by adding and removing classes
        var currentClassList = [];
        for (var j = 0; j < this.classList.length; j += 1) {
            currentClassList.push(this.classList[j]);
        }

        for (var i = 0; i < currentClassList.length; i += 1) {
            var currentClass = currentClassList[i];
            var newClass;

            if (currentClass !== 'sc-seat' && currentClass !== 'clicked') {
                // find index of current
                var index = types.indexOf(currentClass);

                // if the current class matches a type
                // then select the new one
                if (index !== -1) {
                    this.classList.remove(types[index]);
                    index += 1;

                    if (index === types.length) {
                        index = 0;
                    }

                    newClass = types[index];

                    this.style.backgroundColor = '';
                    this.style.color = '';
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
                        this.style.backgroundColor = seatTypes[index].backgroundColor;
                        this.style.color = seatTypes[index].color;
                    } else {
                        // otherwise remove the class 'clicked'
                        // since available has it's own style
                        this.classList.remove('clicked');
                    }

                    // this has to be done after updating the shopping cart
                    // so the event is fired just once the seat style is really updated
                    if (currentClass === 'available') {
                        if (addToCartDict(this.id, newClass)) {
                            updateCart('add', this.id, newClass, currentClass, true);
                        }
                    } else if (newClass === 'available') {
                        if (removeFromCartDict(this.id, currentClass)) {
                            updateCart('remove', this.id, newClass, currentClass, true);
                        }
                    } else if (addToCartDict(this.id, newClass) &&
                                removeFromCartDict(this.id, currentClass)) {
                        updateCart('update', this.id, newClass, currentClass, true);
                    }
                }
            }
        }

        updateTotal();
    };

    /**
     * This function is fired when a seat is right clicked to be released.
     * @private
     */
    var rightClickDelete = function rightClickDelete(e) {
        e.preventDefault();

        var type = getSeatType(this.id);

        // it means it has no type and it's available, then there's nothing to delete
        if (type !== undefined) {
            releaseSeat(this.id);
            // remove from virtual sc
            removeFromCartDict(this.id, type);

            // there's no need to fire onChange event since this function fires
            // the event after removing the seat from shopping cart
            updateCart('remove', this.id, 'available', type, true);
            updateTotal();
        }

        // so the default context menu isn't showed
        return false;
    };

    /**
     * Creates a new seat.
     * @param {string} type - The type of the seat.
     * @param {string} content - The name representing the seat.
     * @param {string} seatId - The dom id of the seat in the seatmap.
     * @returns {HTMLDivElement} The seat.
     * @private
     */
    var createSeat = function createSeat(type, content, seatId) {
        var seat = document.createElement('div');
        seat.textContent = content;
        seat.className = 'sc-seat ' + type;

        // if seatId wasn't passed as argument then don't set it
        if (seatId !== undefined) {
            seat.setAttribute('id', seatId);

            // add click event just if it's a real seats (when it has and id)
            seat.addEventListener('click', seatClick);
            seat.addEventListener('contextmenu', rightClickDelete, false);
        }

        return seat;
    };

    /**
     * Creates a seat map row.
     * @param {string} rowIndex - The index that represent the row.
     * @returns {HTMLDivElement} The row.
     * @private
     */
    var createRow = function createRow() {
        var row = document.createElement('div');
        row.className = 'sc-map-row';

        return row;
    };

    /**
     * Creates the header of the seatmap containing the front indicator.
     * @returns {HTMLDivElement} The seatmap header.
     * @private
     */
    var createFrontHeader = function createFrontHeader() {
        // set the perfect width of the front indicator
        var front = document.createElement('div');
        front.textContent = 'Front';
        front.className = 'sc-front';

        return front;
    };

    /**
     * Creates a seatmap index.
     * @returns {HTMLDivElement} The seatmap index.
     * @private
     */
    var createIndex = function createIndex(content) {
        var index = document.createElement('div');
        index.textContent = content;
        index.className = 'sc-index';

        return index;
    };

    /**
     * Creates a row containing all the vertical indexes.
     * @returns {HTMLDivElement} Vertical indexes.
     * @private
     */
    var createVerticalIndex = function createVerticalIndex() {
        var rowsIndex = document.createElement('div');
        rowsIndex.className = 'sc-vertical-index';

        for (var i = 0; i < seatMap.cols; i += 1) {
            rowsIndex.appendChild(createIndex(alphabet[i]));
        }

        return rowsIndex;
    };


    /**
     * Creates a row containing all the horizontal indexes.
     * @returns {HTMLDivElement} Horizontal indexes.
     * @private
     */
    var createHorizontalIndex = function createHorizontalIndex() {
        var columnsIndex = document.createElement('div');
        columnsIndex.className = 'sc-horizontal-index';

        for (var i = 1; i <= seatMap.cols; i += 1) {
            columnsIndex.appendChild(createIndex(i));
        }

        return columnsIndex;
    };

    /**
     * Creates a container.
     * @returns {HTMLDivElement} - The container.
     * @param {string} - Container name
     * @param {( 'column' | 'row' )} direction - Flex direction.
     * @param {( 'left' | 'right' | 'top' | 'bottom' )} contentPosition - Content position.
     * @private
     */
    var createContainer = function createContainer(name, direction, contentPosition) {
        if (['column', 'row'].indexOf(direction) < 0) {
            throw new Error("'direction' must have one of the following values: 'column', 'row'");
        }

        if (contentPosition && ['left', 'right', 'top', 'bottom'].indexOf(contentPosition) < 0) {
            throw new Error(
                "'contentPosition' must have one of the following values: " +
                "'left', 'right', 'top', 'bottom'"
            );
        }

        var container = document.createElement('div');

        if (name) {
            container.className = 'sc-{0}-container'.format(name);
        }

        container.classList.add('sc-container-{0}'.format(direction));

        if (contentPosition) {
            container.classList.add('sc-{0}'.format(contentPosition));
        }

        return container;
    };

    /**
     * Removes all classes regarding the type applied to the seat.
     * @param {HTMLDivElement} seat - Seat element.
     * @private
     */
    var removeAllTypesApplied = function removeAllTypesApplied(seat) {
        for (var i = 0; i < types.length; i += 1) {
            seat.classList.remove(types[i]);
        }
    };

    /**
     * Sets all disabled seats as blank or reserved seats as unavailable.
     * params {string} type - The type of seats to set.
     * @private
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
     * Loads seats, given with seat types, into the shopping cart.
     * @private
     */
    var loadCartItems = function loadCartItems() {
        var count = 0;

        for (var i = 0; i < seatTypes.length; i += 1) {
            var seatType = seatTypes[i];

            if ({}.hasOwnProperty.call(seatType, 'selected') && seatType.selected) {
                var type = seatType.type;
                var price = seatType.price;

                count += seatType.selected.length;

                for (var j = 0; j < seatType.selected.length; j += 1) {
                    var index = seatType.selected[j];
                    var row = Math.floor(index / seatMap.cols);
                    var column = index % seatMap.cols;
                    var id = '{0}_{1}'.format(row, column);
                    var seatName = '{0}{1}'.format(alphabet[row], column + 1);
                    var seat = {
                        id: id,
                        name: seatName,
                        type: type,
                        price: price
                    };
                    var cartItem = createCartItem(seat);
                    cartTable.appendChild(cartItem);
                }
            }
        }

        return count;
    };

    /**
     * Selects seats given with seat types.
     * @private
     */
    var selectSeats = function selectSeats() {
        for (var n = 0; n < seatTypes.length; n += 1) {
            var seatType = seatTypes[n];

            if ({}.hasOwnProperty.call(seatType, 'selected') && seatType.selected) {
                var type = seatType.type;
                var backgroundColor = seatType.backgroundColor;
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
                        element.style.backgroundColor = backgroundColor;
                        element.style.color = color;
                    }
                }
            }
        }
    };

    /**
     * Gets the price for a specific type of seat.
     * @param {string} type - The type of the seat.
     * @returns {number} Price.
     */
    this.getPrice = function getPrice(type) {
        for (var i = 0; i < seatTypes.length; i += 1) {
            if (seatTypes[i].type === type) {
                return seatTypes[i].price;
            }
        }

        throw new Error("Invalid parameter 'type' supplied to Seatchart.getPrice(). " +
                        "'type' does not exist in seatTypes.");
    };

    /**
     * Gets the total price of the selected seats.
     * @returns {number} - The total price.
     */
    this.getTotal = function getTotal() {
        var total = 0;
        for (var key in cartDict) {
            if ({}.hasOwnProperty.call(cartDict, key)) {
                total += self.getPrice(key) * cartDict[key].length;
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
        if (typeof seatIndex !== 'number' && Math.floor(seatIndex) === seatIndex) {
            throw new Error("Invalid parameter 'seatIndex' supplied to Seatchart.isGap(). It must be an integer.");
        } else if (seatIndex >= seatMap.rows * seatMap.cols) {
            throw new Error("Invalid parameter 'seatIndex' supplied to Seatchart.isGap(). Index is out of range.");
        }

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
        for (var key in cartDict) {
            if ({}.hasOwnProperty.call(cartDict, key)) {
                if (cartDict[key].indexOf(seatId) >= 0) {
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
        for (var type in cartDict) {
            if ({}.hasOwnProperty.call(cartDict, type)) {
                if (!isSeatBeforeSelected) {
                    isSeatBeforeSelected = cartDict[type].indexOf(seatBeforeId) >= 0;
                }

                if (!isSeatAfterSelected) {
                    isSeatAfterSelected = cartDict[type].indexOf(seatAfterId) >= 0;
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
        if (typeof seatIndex !== 'number' && Math.floor(seatIndex) === seatIndex) {
            throw new Error("Invalid parameter 'seatIndex' supplied to Seatchart.makesGap(). It must be an integer.");
        } else if (seatIndex >= seatMap.rows * seatMap.cols) {
            throw new Error("Invalid parameter 'seatIndex' supplied to Seatchart.makesGap(). Index is out of range.");
        }

        var col = seatIndex % seatMap.cols;

        var isSeatBeforeGap = false;
        if (seatIndex - 1 >= 0 && col > 0) {
            isSeatBeforeGap = this.isGap(seatIndex - 1);
        }

        var isSeatAfterGap = false;
        if (seatIndex + 1 < seatMap.cols * seatMap.rows && col + 1 < seatMap.cols) {
            isSeatAfterGap = this.isGap(seatIndex + 1);
        }

        return isSeatBeforeGap || isSeatAfterGap;
    };

    /**
     * Gets all seats which represent a gap of the seat map.
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
     * Gets seat info.
     * @param {number} index - Seat index.
     * @returns {Seat} Seat info.
     */
    this.get = function get(index) {
        if (typeof index !== 'number' && Math.floor(index) === index) {
            throw new Error("Invalid parameter 'index' supplied to Seatchart.get(). It must be an integer.");
        } else if (index >= seatMap.rows * seatMap.cols) {
            throw new Error("Invalid parameter 'index' supplied to Seatchart.get(). Index is out of range.");
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
            for (var type in cartDict) {
                if ({}.hasOwnProperty.call(cartDict, type)) {
                    var price = this.getPrice(type);
                    if (cartDict[type].indexOf(seatId) >= 0) {
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

        throw new Error("Invalid parameter 'index' supplied to Seatchart.get(). Index is out of range.");
    };

    /**
     * Set seat type.
     * @param {number} index - Index of the seat to update.
     * @param {string} type - New seat type ('disabled', 'reserved' and 'available' are supported too).
     * @param {boolean} [emit = false] - True to trigger onChange event.
     */
    this.set = function set(index, type, emit) {
        if (typeof index !== 'number' && Math.floor(index) === index) {
            throw new Error("Invalid parameter 'index' supplied to Seatchart.set(). It must be an integer.");
        } else if (index >= seatMap.rows * seatMap.cols) {
            throw new Error("Invalid parameter 'index' supplied to Seatchart.set(). Index is out of range.");
        } else if (typeof type !== 'string') {
            throw new Error("Invalid parameter 'type' supplied to Seatchart.set(). It must be a string.");
        } else {
            var seatType = seatTypes.find(function findSeatType(x) {
                return x.type === type;
            });

            // check if type is valid
            if (['available', 'reserved', 'disabled'].indexOf(type) < 0 && !seatType) {
                throw new Error("Invalid parameter 'type' supplied to Seatchart.set().");
            } else if (emit && typeof emit !== 'boolean') {
                throw new Error("Invalid parameter 'emit' supplied to Seatchart.set(). It must be a boolean.");
            }
        }

        var seat = self.get(index);
        if (!seat || seat.type === type) {
            return;
        }

        var classes = {
            disabled: 'sc-blank',
            reserved: 'sc-unavailable'
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
                if (removeFromCartDict(seat.id, seat.type) && addToCartDict(seat.id, type)) {
                    element.classList.add('clicked');
                    element.style.setProperty('background-color', seatType.backgroundColor);
                    element.style.setProperty('color', seatType.color);
                    updateCart('update', seat.id, type, seat.type, emit);
                }
            } else if (removeFromCartDict(seat.id, seat.type)) {
                element.classList.remove('clicked');
                element.style.removeProperty('background-color');
                updateCart('remove', seat.id, type, seat.type, emit);
            }
        } else if (type !== 'available' && type !== 'disabled' && type !== 'reserved') {
            if (addToCartDict(seat.id, type)) {
                element.classList.add('clicked');
                element.style.setProperty('background-color', seatType.backgroundColor);
                element.style.setProperty('color', seatType.color);
                updateCart('add', seat.id, type, seat.type, emit);
            }
        }

        types.forEach(function mapClassNames(x) {
            classes[x] = x;
        });

        element.classList.add(classes[type]);
        element.classList.remove(classes[seat.type]);

        updateTotal();
    };

    /**
     * Triggered when a seat is selected or unselected.
     * @event Seatchart#onChange
     * @type {ChangeEvent}
     */
    this.onChange = null;

    /**
     * Triggered when all seats are removed with the 'delete all' button in the shopping cart.
     * @event Seatchart#onClear
     * @type {ClearEvent}
     */
    this.onClear = null;

    /**
     * Creates the seatmap.
     * @param {string} containerId - Id of the container that is going to contain the seatmap.
     */
    this.createMap = function createMap(containerId) {
        var frontHeader = createFrontHeader();
        frontHeader.classList.add('sc-margin-bottom');

        var horizontalIndex = createHorizontalIndex();
        var verticalIndex = createVerticalIndex();

        var map = document.createElement('div');
        map.classList.add('sc-map');

        // add rows containing seats
        for (var i = 0; i < seatMap.rows; i += 1) {
            var rowIndex = alphabet[i];
            var row = createRow(rowIndex);

            for (var j = 0; j < seatMap.cols; j += 1) {
                row.appendChild(createSeat('available', rowIndex + (j + 1), i + '_' + j));
            }

            map.appendChild(row);
        }

        var verticalIndexContainer = createContainer(null, 'row');
        verticalIndexContainer.append(verticalIndex, map);

        var horizontalIndexContainer = createContainer(null, 'column', 'right');
        horizontalIndexContainer.append(horizontalIndex, verticalIndexContainer);

        // create map container which will contain everything
        var mapContainer = createContainer('map', 'column', 'right');
        mapContainer.append(frontHeader, horizontalIndexContainer);

        document.getElementById(containerId).appendChild(mapContainer);

        var seat = document.getElementsByClassName('sc-seat')[0];
        var width = seat.offsetWidth;

        var computedStyle = getStyle(seat);
        var margins = parseInt(computedStyle.marginLeft, 10) +
                      parseInt(computedStyle.marginRight, 10);

        // set front header and map width
        map.style.width = '{0}px'.format((width + margins) * seatMap.cols);
        frontHeader.style.width = '{0}px'.format((width + margins) * seatMap.cols);

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
        selectSeats();
    };

    /**
     * Creates a legend item and applies a type and a backgroundColor if needed.
     * @param {string} content - The text in the legend that explains the type of seat.
     * @param {string} type - The type of seat.
     * @param {string} backgroundColor - The background color of the item in the legend.
     * @returns {HTMLListItemElement} The legend item.
     * @private
     */
    var createLegendItem = function createLegendItem(content, type, backgroundColor) {
        var item = document.createElement('li');
        item.className = 'sc-legend-item';
        var itemStyle = document.createElement('div');
        itemStyle.className = 'sc-seat legend-style {0}'.format(type);
        var description = document.createElement('p');
        description.className = 'sc-legend-description';
        description.textContent = content;

        if (backgroundColor !== undefined) {
            itemStyle.className = '{0} clicked'.format(itemStyle.className);
            itemStyle.style.backgroundColor = backgroundColor;
        }

        item.appendChild(itemStyle);
        item.appendChild(description);

        return item;
    };

    /**
     * Creates a legend list.
     * @returns {HTMLUnorderedListElement} The legend list.
     * @private
     */
    var createLegendList = function createLegendList() {
        var list = document.createElement('ul');
        list.className = 'sc-legend';

        return list;
    };

    /**
     * Creates a small title.
     * @param {string} content - The content of the title.
     * @returns {HTMLHeadingElement} The small title.
     * @private
     */
    var createSmallTitle = function createSmallTitle(content) {
        var smallTitle = document.createElement('h5');
        smallTitle.textContent = content;
        smallTitle.className = 'sc-small-title';

        return smallTitle;
    };

    /**
     * Creates the legend of the seatmap.
     * @param {string} containerId - Id of the container that is going to contain the legend.
     */
    this.createLegend = function createLegend(containerId) {
        // create legend container
        var legendContainer = createContainer('legend', 'column');
        var legendTitle = createTitle('Legend');

        var seatsList = createLegendList();

        for (var i = 0; i < seatTypes.length; i += 1) {
            var description = '{0} {1}{2}'.format(
                seatTypes[i].type.capitalizeFirstLetter(),
                self.currency,
                seatTypes[i].price.toFixed(2)
            );
            var item = createLegendItem(description, '', seatTypes[i].backgroundColor);
            seatsList.appendChild(item);
        }
        seatsList.appendChild(createLegendItem('Already booked', 'unavailable'));

        legendContainer.appendChild(legendTitle);
        legendContainer.appendChild(seatsList);
        legendContainer.appendChild(seatsList);

        document.getElementById(containerId).appendChild(legendContainer);
    };

    /**
     * Creates the container of the items in the shopping cart.
     * @returns {HTMLDivElement} The container of the items.
     * @private
     */
    var createCartTable = function createCartTable() {
        var container = document.createElement('table');
        container.className = 'sc-cart-items';

        return container;
    };

    /**
     * This function is fired when the "delete all" button is clicked in the shopping cart.
     * @private
     */
    var deleteAllClick = function deleteAllClick() {
        var removedSeats = [];

        // release all selected seats and remove them from dictionary
        for (var key in cartDict) {
            if ({}.hasOwnProperty.call(cartDict, key)) {
                for (var i = 0; i < cartDict[key].length; i += 1) {
                    var id = cartDict[key][i];

                    releaseSeat(id);

                    // fire event
                    if (self.onChange != null) {
                        var index = getIndexFromId(id);
                        var seatName = getSeatName(id);
                        var type = getSeatType(id);

                        var current = {
                            type: 'available',
                            id: id,
                            index: index,
                            name: seatName,
                            price: null
                        };
                        var previous = {
                            type: type,
                            id: id,
                            index: index,
                            name: seatName,
                            price: self.getPrice(type)
                        };

                        removedSeats.push({ current: current, previous: previous });
                    }
                }

                // empty array, fastest way instead of removing each seat
                cartDict[key] = [];
            }
        }

        // empty shopping cart, fastest way instead of removing each item
        cartTable.innerHTML = '';

        updateTotal();

        if (self.onClear) {
            self.onClear(removedSeats);
        }
    };

    /**
     * Creates text that contains total number of items in the shopping cart.
     * @returns {HTMLDivElement} The total and "delete all" button.
     * @private
     */
    var createCartItemsCounter = function createCartItemsCounter(count) {
        var cartItemsCount = document.createElement('h3');
        cartItemsCount.textContent = '({0})'.format(count);

        return cartItemsCount;
    };

    /**
     * Creates the total of the shopping cart and a "delete all" button.
     * @returns {HTMLDivElement} The total and "delete all" button.
     * @private
     */
    var createCartTotal = function createCartTotal() {
        var container = document.createElement('div');

        cartTotal = createSmallTitle('Total: {0}{1}'.format(self.currency, self.getTotal()));
        cartTotal.className += ' sc-cart-total';

        var deleteBtn = createScDeleteButton();
        deleteBtn.onclick = deleteAllClick;
        deleteBtn.className += ' all';

        var label = document.createElement('p');
        label.textContent = 'All';
        deleteBtn.appendChild(label);

        container.appendChild(cartTotal);
        container.appendChild(deleteBtn);

        return container;
    };

    /**
     * Creates the shopping cart.
     * @param {string} containerId - Id of the container that is going to contain the shopping cart.
     */
    this.createCart = function createCart(containerId) {
        var cartContainer = createContainer('cart', 'column');
        var cartTitle = createIconedTitle(
            'Your Cart',
            '{0}/icons/shoppingcart.svg'.format(self.assetsSrc),
            'Shopping cart icon.'
        );

        var cartTableContainer = document.createElement('div');
        cartTableContainer.classList.add('sc-cart');
        cartTableContainer.style.width = '{0}px'.format(self.cartWidth);
        cartTableContainer.style.height = '{0}px'.format(self.cartHeight);

        cartTable = createCartTable();
        cartTableContainer.appendChild(cartTable);

        var itemsCount = loadCartItems();
        var cartTotal = createCartTotal();

        cartItemsCounter = createCartItemsCounter(itemsCount);
        cartTitle.appendChild(cartItemsCounter);

        cartContainer.appendChild(cartTitle);
        cartContainer.appendChild(cartTableContainer);
        cartContainer.appendChild(cartTotal);

        document.getElementById(containerId).appendChild(cartContainer);
    };
}
