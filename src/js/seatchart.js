(function umd(root, factory) {
    /* eslint-disable no-undef, no-param-reassign */
    if (typeof define === 'function' && define.amd) {
        define([], factory);
    } else if (typeof module === 'object' && module.exports) {
        module.exports = factory();
    } else {
        root.Seatchart = factory();
    }
    /* eslint-enable no-undef, no-param-reassign */
}(typeof self !== 'undefined' ? self : this, (function factory() {
    /**
     * Creates a seatchart.
     * @constructor
     *
     * @param {Object} options - Seatmap options.
     *
     *
     * @param {Object} options.map - Map options.
     * @param {number} options.map.id - Container id.
     * @param {number} options.map.rows - Number of rows.
     * @param {number} options.map.columns - Number of columns.
     * @param {seatNameCallback} [options.map.seatName] - Seat name generator.
     *
     * @param {Array.<number>} [options.map.reserved] - Array of reserved seats.
     * @param {Array.<number>} [options.map.reserved.seats] - Array of the reserved seats.
     *
     * @param {Object} [options.map.disabled] - Disabled seats options.
     * @param {Array.<number>} [options.map.disabled.seats] - Array of the disabled seats.
     * @param {Array.<number>} [options.map.disabled.rows] - Array of the disabled rows of seats.
     *
     * @param {Array.<number>} [options.map.disabled.columns] - Array of the disabled columns of seats.
     *
     * @param {Object} [options.map.indexes] - Indexes options.
     *
     * @param {Object} [options.map.indexes.rows] - Rows index options.
     * @param {boolean} [options.map.indexes.rows.visible = true] - Row index visibility.
     * @param {string} [options.map.indexes.rows.position = left] - Row index position.
     * @param {rowNameCallback} [options.map.indexes.rows.name] - Row name generator.
     *
     * @param {Object} [options.map.indexes.columns] - Columns index options.
     * @param {boolean} [options.map.indexes.columns.visible = true] - Column index visibility.
     * @param {string} [options.map.indexes.columns.position = top] - Column index position.
     * @param {columnNameCallback} [options.map.indexes.columns.name] - Column name generator.
     *
     * @param {Object} [options.map.front] - Front header options.
     * @param {boolean} [options.map.front.visible = true] - Front header visibility.
     *
     *
     * @param {Array.<Object>} options.types - Seat types options.
     * @param {string} options.types.type - Name of seat type.
     * @param {string} options.types.backgroundColor - Background color of the defined seat type.
     * @param {number} options.types.price - Price of the defined seat type.
     * @param {string} [options.types.textColor = white] - Text color of the defined seat type.
     * @param {Array.<number>} [options.types.selected] - Selected seats of the defined seat type.
     *
     *
     * @param {Array.<Object>} [options.cart] - Cart options.
     * @param {string} [options.cart.id] - Container id.
     * @param {string} [options.cart.height] - Cart height.
     * @param {string} [options.cart.width] - Cart width.
     * @param {string} [options.cart.currency] - Current currency.
     *
     *
     * @param {string} [options.legend] - Legend options.
     * @param {string} [options.legend.id] - Container id.
     *
     *
     * @param {Array.<Object>} [options.assets] - Assets options.
     * @param {string} [options.assets.path] - Path to assets.
     *
     * @alias Seatchart
     */
    function Seatchart(options) {
        /**
         * Callback to generate a seat name.
         *
         * @function seatNameCallback
         *
         * @param {object} row
         * @param {number} row.index - Row index (starts from 0).
         * @param {boolean} row.disabled - True if current row is disabled.
         * @param {number} row.disabledCount - Number of disabled rows till that one (including current one if disabled).
         *
         * @param {object} column
         * @param {number} column.index - Column index (starts from 0).
         * @param {boolean} column.disabled - True if current column is disabled.
         * @param {number} column.disabledCount - Number of disabled columns till that one (including current one if disabled).
         *
         * @returns {string} Seat name. Return null or undefined if empty.
         */

        /**
         * Callback to generate a row name.
         *
         * @function rowNameCallback
         *
         * @param {number} index - Row index (starts from 0).
         * @param {boolean} disabled - True if current row is disabled.
         * @param {number} disabledCount - Number of disabled rows till that one (including current one if disabled).
         *
         * @returns {string} Row name. Return null or undefined if empty.
         */

        /**
         * Callback to generate a column name.
         *
         * @function columnNameCallback
         *
         * @param {number} index - Column index (starts from 0).
         * @param {boolean} disabled - True if current column is disabled.
         * @param {number} disabledCount - Number of disabled columns till that one (including current one if disabled).
         *
         * @returns {string} Column name. Return null or undefined if empty.
         *
         */


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

        // check options.map parameter
        if (options.map === undefined) {
            throw new Error("Invalid parameter 'options.map' supplied to Seatchart. Cannot be undefined.");
        } else if (typeof options.map !== 'object') {
            throw new Error("Invalid parameter 'options.map' supplied to Seatchart. Must be an object.");
        } else if (!{}.hasOwnProperty.call(options.map, 'id')) {
            throw new Error("Invalid parameter 'options.map' supplied to Seatchart. " +
                "'id' property cannot be undefined.");
        } else if (!{}.hasOwnProperty.call(options.map, 'rows') || !{}.hasOwnProperty.call(options.map, 'columns')) {
            throw new Error("Invalid parameter 'options.map' supplied to Seatchart. " +
                "'row' and 'columns' properties cannot be undefined.");
        } else if (options.map.rows > 25 || options.map.columns > 25) {
            throw new Error("Invalid parameter 'options.map' supplied to Seatchart. " +
                "'row' and 'columns' properties cannot be integers greater than 25.");
        } else if (options.map.rows < 2 || options.map.columns < 2) {
            throw new Error("Invalid parameter 'options.map' supplied to Seatchart. " +
                "'row' and 'columns' properties cannot be integers smaller than 2.");
        }

        // check options.types parameter
        if (options.types === undefined) {
            throw new Error("Invalid parameter 'options.types' supplied to Seatchart. Cannot be undefined.");
            // check if options.types is an array and contains at least one element
        } else if (!Array.isArray(options.types) || options.types.length < 1 || typeof options.types[0] !== 'object') {
            throw new Error("Invalid parameter 'options.types' supplied to Seatchart. " +
                'Must be an array of objects containing at least one element.');
        } else {
            // check if all elements have the needed attribute and contain the right type of value
            for (var i = 0; i < options.types.length; i += 1) {
                if (!{}.hasOwnProperty.call(options.types[i], 'type') ||
                    !{}.hasOwnProperty.call(options.types[i], 'backgroundColor') ||
                    !{}.hasOwnProperty.call(options.types[i], 'price')) {
                    throw new Error(("Invalid parameter 'options.types' supplied to Seatchart. " +
                        "Element at index {0} must contain a 'type', " +
                        "a 'backgroundColor' and a 'price' property.").format(i));
                } else if (!(typeof options.types[i].type === 'string' || options.types[i].type instanceof String)) {
                    throw new Error(("Invalid parameter 'options.types' supplied to Seatchart. " +
                        "'type' property at index {0} must be a string.").format(i));
                } else if (!(typeof options.types[i].backgroundColor === 'string' ||
                    options.types[i].backgroundColor instanceof String)) {
                    throw new Error(("Invalid parameter 'options.types' supplied to Seatchart. " +
                        "'backgroundColor' property at index {0} must be a string.").format(i));
                } else if (typeof options.types[i].price !== 'number') {
                    throw new Error(("Invalid parameter 'options.types' supplied to Seatchart. " +
                        "'price' property at index {0} must be a number.").format(i));
                }
            }
        }

        // check the given input
        for (var x = 0; x < options.types.length; x += 1) {
            for (var y = x + 1; y < options.types.length; y += 1) {
                if (options.types[x].type.capitalizeFirstLetter() ===
                    options.types[y].type.capitalizeFirstLetter()) {
                    throw new Error(
                        (
                            "Invalid parameter 'options.types' supplied to Seatchart. " +
                            "'{0}' and '{1}' types are equal and must be different. " +
                            'Types are case insensitive.'
                        ).format(options.types[x].type, options.types[y].type)
                    );
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
         * This object.
         * @type {seatchartJS}
         * @private
         */
        var self = this;

        /**
         * An object containing all seats added to the shopping cart, mapped by seat type.
         * @type {Object<string, Array.<number>>}
         * @private
         */
        var cart = {};

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

            for (var i = 0; i < options.types.length; i += 1) {
                types.push(options.types[i].type);
                cartDict[options.types[i].type] = [];
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

            return (options.map.columns * values[0]) + values[1];
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
            for (var n = 0; n < options.types.length; n += 1) {
                var seatType = options.types[n];

                if ({}.hasOwnProperty.call(seatType, 'selected') && seatType.selected) {
                    var type = seatType.type;

                    for (var l = 0; l < seatType.selected.length; l += 1) {
                        var index = seatType.selected[l];
                        var id = '{0}_{1}'.format(Math.floor(index / options.map.columns), index % options.map.columns);
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
            binImg.src = '{0}/icons/bin.svg'.format(options.assets.path);

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

            return undefined;
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
                cartTotal.textContent = 'Total: {0}{1}'.format(options.cart.currency, self.getTotal().toFixed(2));
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
            var seatConfig = options.types.find(function findSeatType(x) {
                return x.type === seat.type;
            });

            var ticket = document.createElement('div');
            ticket.className = 'sc-ticket';
            ticket.style.color = seatConfig.textColor;
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
            seatPrice.textContent = '{0}{1}'.format(options.cart.currency, seat.price.toFixed(2));

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
         * @param {string} action - Action on the shopping cart ('remove' | 'add' | 'update').
         * @param {string} id - Id of the seat in the dom.
         * @param {string} type - New seat type.
         * @param {string} previousType - Previous seat type.
         * @param {boolean} emit - True to trigger onChange events.
         * @private
         */
        var updateCart = function updateCart(action, id, type, previousType, emit) {
            var seatName = getSeatName(id);
            var index = getIndexFromId(id);
            var price = type && ['available', 'disabled', 'reserved'].indexOf(type) < 0 ?
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
                price: previousType && ['available', 'disabled', 'reserved'].indexOf(previousType) < 0 ?
                    self.getPrice(previousType) :
                    null
            };

            var cartItem;

            updateCartObject();

            if (action === 'remove') {
                if (cartTable) {
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
                if (cartTable) {
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
                if (cartTable) {
                    cartItem = document.getElementById('item-{0}'.format(id));
                    var itemContent = cartItem.getElementsByTagName('td');

                    var seatConfig = options.types.find(function findSeatType(x) {
                        return x.type === current.type;
                    });

                    var ticket = itemContent[0].getElementsByClassName('sc-ticket')[0];
                    ticket.style.backgroundColor = seatConfig.backgroundColor;
                    ticket.style.color = seatConfig.textColor;

                    var ticketType = ticket.getElementsByClassName('sc-cart-seat-type')[0];
                    ticketType.textContent = current.type.capitalizeFirstLetter();

                    var ticketPrice = itemContent[1];
                    ticketPrice.textContent = '{0}{1}'.format(options.cart.currency, current.price.toFixed(2));
                }

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
                            // decrease it because there's one less element in options.types
                            // which is 'available', that already exists
                            index -= 1;
                            if (index < 0) {
                                index = options.types.length - 1;
                            }

                            this.classList.add('clicked');
                            this.style.backgroundColor = options.types[index].backgroundColor;
                            this.style.color = options.types[index].textColor;
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
         * Generates a row name.
         * @param {number} row - Row index (starts from 0).
         * @param {boolean} disabled - True if current row is disabled.
         * @param {number} disabledCount - Number of disabled rows till that one (including current one if disabled).
         * @returns {string} Row name. Return null or undefined if empty.
         * @private
         */
        var rowName = function rowName(index, disabled, disabledCount) {
            if (!disabled) {
                return alphabet[index - disabledCount];
            }

            return null;
        };

        /**
         * Generates a column name.
         * @param {number} column - Column index (starts from 0).
         * @param {boolean} disabled - True if current column is disabled.
         * @param {number} disabledCount - Number of disabled columns till that one (including current one if disabled).
         * @returns {string} Column name. Return null or undefined if empty.
         * @private
         */
        var columnName = function columnName(index, disabled, disabledCount) {
            if (!disabled) {
                return ((index - disabledCount) + 1).toString();
            }

            return null;
        };

        /**
         * Generates a seat name.
         * @param {object} row
         * @param {number} row.index - Row index (starts from 0).
         * @param {boolean} row.disabled - True if current row is disabled.
         * @param {number} row.disabledCount - Number of disabled rows till that one (including current one if disabled).
         *
         * @param {object} column
         * @param {number} column.index - Column index (starts from 0).
         * @param {boolean} column.disabled - True if current column is disabled.
         * @param {number} column.disabledCount - Number of disabled columns till that one (including current one if disabled).
         *
         * @returns {string} Seat name. Return null or undefined if empty.
         * @private
         */
        var seatName = function seatName(row, column) {
            if (!row.disabled && !column.disabled) {
                var rowIndex = rowName(row.index, row.disabled, row.disabledCount);
                var columnIndex = columnName(column.index, column.disabled, column.disabledCount);

                return '{0}{1}'.format(rowIndex, columnIndex);
            }

            return null;
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
         * Creates a seatmap blank spot.
         * @returns {HTMLDivElement} The seatmap blank spot.
         * @private
         */
        var createBlank = function createBlank() {
            var blank = document.createElement('div');
            blank.className = 'sc-seat blank';

            return blank;
        };

        /**
         * Creates a row containing all the row indexes.
         * @returns {HTMLDivElement} Row indexes.
         * @private
         */
        var createRowIndex = function createRowIndex() {
            var rowIndex = document.createElement('div');
            rowIndex.className = 'sc-row-index';

            var disabled = options.map.disabled;
            var disabledCount = 0;

            var generateName = rowName;
            if (options.map.indexes && options.map.indexes.rows && options.map.indexes.rows.name) {
                generateName = options.map.indexes.rows.name;
            }

            for (var i = 0; i < options.map.rows; i += 1) {
                var isRowDisabled = disabled && disabled.rows && disabled.rows.indexOf(i) >= 0;
                disabledCount = isRowDisabled ? disabledCount + 1 : disabledCount;

                var index = generateName(i, isRowDisabled, disabledCount);

                if (index !== undefined && index !== null) {
                    rowIndex.appendChild(createIndex(index));
                } else {
                    rowIndex.appendChild(createBlank());
                }
            }

            return rowIndex;
        };

        /**
         * Creates a row containing all the column indexes.
         * @returns {HTMLDivElement} Column indexes.
         * @private
         */
        var createColumnIndex = function createColumnIndex() {
            var columnIndex = document.createElement('div');
            columnIndex.className = 'sc-column-index';

            var disabled = options.map.disabled;
            var disabledCount = 0;

            var generateName = columnName;
            if (options.map.indexes && options.map.indexes.columns && options.map.indexes.columns.name) {
                generateName = options.map.indexes.columns.name;
            }

            for (var i = 0; i < options.map.columns; i += 1) {
                var isColumnDisabled = disabled && disabled.columns && disabled.columns.indexOf(i) >= 0;
                disabledCount = isColumnDisabled ? disabledCount + 1 : disabledCount;

                var index = generateName(i, isColumnDisabled, disabledCount);
                if (index !== undefined && index !== null) {
                    columnIndex.appendChild(createIndex(index));
                } else {
                    columnIndex.appendChild(createBlank());
                }
            }

            return columnIndex;
        };

        /**
         * Creates a container.
         * @returns {HTMLDivElement} - The container.
         * @param {string} - Container name
         * @param {string} direction - Flex direction ('column' or 'row').
         * @param {string} contentPosition - Content position ('left', 'right', 'top' or 'bottom').
         * @private
         */
        var createContainer = function createContainer(name, direction, contentPosition) {
            if (['column', 'row', 'column-reverse', 'row-reverse'].indexOf(direction) < 0) {
                throw new Error("'direction' must have one of the following values: " +
                    "'column', 'row', 'column-reverse', 'row-reverse'");
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
         * @param {string} type - The type of seats to set ('reserved' or 'disabled').
         * @private
         */
        var setSeat = function setSeat(type) {
            if (options.map[type] && options.map[type].seats) {
                var columns = options.map.columns;

                for (var i = 0; i < options.map[type].seats.length; i += 1) {
                    var index = options.map[type].seats[i];
                    var id = '{0}_{1}'.format(Math.floor(index / columns), index % columns);
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

            for (var i = 0; i < options.types.length; i += 1) {
                var seatType = options.types[i];

                if ({}.hasOwnProperty.call(seatType, 'selected') && seatType.selected) {
                    var type = seatType.type;
                    var price = seatType.price;

                    count += seatType.selected.length;

                    for (var j = 0; j < seatType.selected.length; j += 1) {
                        var index = seatType.selected[j];
                        var row = Math.floor(index / options.map.columns);
                        var column = index % options.map.columns;
                        var id = '{0}_{1}'.format(row, column);
                        var seatName = getSeatName(id);
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
            for (var n = 0; n < options.types.length; n += 1) {
                var seatType = options.types[n];

                if ({}.hasOwnProperty.call(seatType, 'selected') && seatType.selected) {
                    var type = seatType.type;
                    var backgroundColor = seatType.backgroundColor;
                    var color = seatType.textColor;

                    for (var l = 0; l < seatType.selected.length; l += 1) {
                        var index = seatType.selected[l];
                        var id = '{0}_{1}'.format(Math.floor(index / options.map.columns), index % options.map.columns);

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
            for (var i = 0; i < options.types.length; i += 1) {
                if (options.types[i].type === type) {
                    return options.types[i].price;
                }
            }

            return undefined;
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
            } else if (seatIndex >= options.map.rows * options.map.columns) {
                throw new Error("Invalid parameter 'seatIndex' supplied to Seatchart.isGap(). Index is out of range.");
            }

            var row = Math.floor(seatIndex / options.map.columns);
            var col = seatIndex % options.map.columns;

            var seatId = '{0}_{1}'.format(row, col);

            // if current seat is disabled or reserved do not continue
            if (options.map.disabled.seats.indexOf(seatIndex) >= 0 ||
                options.map.disabled.columns.indexOf(col) >= 0 ||
                options.map.disabled.rows.indexOf(row) >= 0 ||
                options.map.reserved.seats.indexOf(seatIndex) >= 0
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

            var isSeatBeforeDisabled = options.map.disabled.seats.indexOf(seatBefore) >= 0;
            var isSeatAfterDisabled = options.map.disabled.seats.indexOf(seatAfter) >= 0;

            var isSeatBeforeReserved = options.map.reserved.seats.indexOf(seatBefore) >= 0;
            var isSeatAfterReserved = options.map.reserved.seats.indexOf(seatAfter) >= 0;

            // if there's a disabled/reserved block before and after do not consider it a gap
            if ((isSeatBeforeDisabled && isSeatAfterDisabled) ||
                (isSeatBeforeReserved && isSeatAfterReserved) ||
                (isSeatBeforeReserved && isSeatAfterDisabled) ||
                (isSeatBeforeDisabled && isSeatAfterReserved)) {
                return false;
            }

            // if there's a disabled/reserved block before and no seats after because the seatchart ends or,
            // a disabled/reserved block after and no seats before, then do not consider it a gap
            if (((isSeatBeforeDisabled || isSeatBeforeReserved) && colAfter >= options.map.columns) ||
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
                options.map.reserved.seats.indexOf(seatBefore) >= 0 ||
                isSeatBeforeDisabled ||
                isSeatBeforeSelected;

            var isSeatAfterUnavailable = colAfter >= options.map.columns ||
                options.map.reserved.seats.indexOf(seatAfter) >= 0 ||
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
                throw new Error(
                    "Invalid parameter 'seatIndex' supplied to Seatchart.makesGap(). " +
                    'It must be an integer.'
                );
            } else if (seatIndex >= options.map.rows * options.map.columns) {
                throw new Error(
                    "Invalid parameter 'seatIndex' supplied to Seatchart.makesGap(). " +
                    'Index is out of range.'
                );
            }

            var col = seatIndex % options.map.columns;

            var isSeatBeforeGap = false;
            if (seatIndex - 1 >= 0 && col > 0) {
                isSeatBeforeGap = this.isGap(seatIndex - 1);
            }

            var isSeatAfterGap = false;
            if (seatIndex + 1 < options.map.columns * options.map.rows && col + 1 < options.map.columns) {
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
            var count = options.map.columns * options.map.rows;
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
            } else if (index >= options.map.rows * options.map.columns) {
                throw new Error("Invalid parameter 'index' supplied to Seatchart.get(). Index is out of range.");
            }

            if (index < options.map.rows * options.map.columns) {
                var row = Math.floor(index / options.map.columns);
                var col = index % options.map.columns;
                var seatId = '{0}_{1}'.format(row, col);
                var seatName = getSeatName(seatId);

                // check if seat is reserved
                if (options.map.reserved.seats.indexOf(index) >= 0) {
                    return {
                        type: 'reserved',
                        id: seatId,
                        index: index,
                        name: seatName,
                        price: null
                    };
                }

                // check if seat is reserved
                if (options.map.disabled.seats.indexOf(index) >= 0) {
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
            } else if (index >= options.map.rows * options.map.columns) {
                throw new Error("Invalid parameter 'index' supplied to Seatchart.set(). Index is out of range.");
            } else if (typeof type !== 'string') {
                throw new Error("Invalid parameter 'type' supplied to Seatchart.set(). It must be a string.");
            } else {
                var seatType = options.types.find(function findSeatType(x) {
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
                var arrayIndex = options.map[seat.type].indexOf(index);
                options.map[seat.type].splice(arrayIndex, 1);
            }

            if (type === 'reserved' || type === 'disabled') {
                options.map[type].push(index);
            }

            if (seat.type !== 'available' && seat.type !== 'disabled' && seat.type !== 'reserved') {
                if (type !== 'available' && type !== 'disabled' && type !== 'reserved') {
                    if (removeFromCartDict(seat.id, seat.type) && addToCartDict(seat.id, type)) {
                        element.classList.add('clicked');
                        element.style.setProperty('background-color', seatType.backgroundColor);
                        element.style.setProperty('color', seatType.textColor);
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
                    element.style.setProperty('color', seatType.textColor);
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
         * @typedef {Object} ChangeEvent
         * @property {string} action - Action on seat ('add', 'remove' or 'update').
         * @property {Seat} current - Current seat info.
         * @property {Seat} previous - Seat info previous to the event.
         */

        /**
        * Triggered when a seat is selected or unselected.
        *
        * @method
        * @param {ChangeEvent} e - A change event.
        * @listens ChangeEvent
        */
        this.onChange = null;

        /**
         * @typedef {Array.<Object>} ClearEvent
         * @property {Seat} current - Current seat info.
         * @property {Seat} previous - Seat info previous to the event.
         */

        /**
         * Triggered when all seats are removed with the 'delete all' button in the shopping cart.
         *
         * @method
         * @param {ClearEvent} e - A clear event.
         * @listens ClearEvent
         */
        this.onClear = null;

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

            cartTotal = createSmallTitle('Total: {0}{1}'.format(options.cart.currency, self.getTotal()));
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
         * Creates the legend of the seatmap.
         * @private
         */
        var createLegend = function createLegend() {
            // create legend container
            var legendContainer = createContainer('legend', 'column');
            var legendTitle = createTitle('Legend');

            var seatsList = createLegendList();

            for (var i = 0; i < options.types.length; i += 1) {
                var description = '{0} {1}{2}'.format(
                    options.types[i].type.capitalizeFirstLetter(),
                    options.cart.currency,
                    options.types[i].price.toFixed(2)
                );
                var item = createLegendItem(description, '', options.types[i].backgroundColor);
                seatsList.appendChild(item);
            }
            seatsList.appendChild(createLegendItem('Already booked', 'unavailable'));

            legendContainer.appendChild(legendTitle);
            legendContainer.appendChild(seatsList);
            legendContainer.appendChild(seatsList);

            document.getElementById(options.legend.id).appendChild(legendContainer);
        };

        /**
         * Creates the shopping cart.
         * @private
         */
        var createCart = function createCart() {
            var cartContainer = createContainer('cart', 'column');
            var cartTitle = createIconedTitle(
                'Your Cart',
                '{0}/icons/shoppingcart.svg'.format(options.assets.path),
                'Shopping cart icon.'
            );

            var cartTableContainer = document.createElement('div');
            cartTableContainer.classList.add('sc-cart');
            cartTableContainer.style.width = '{0}px'.format(options.cart.width);
            cartTableContainer.style.height = '{0}px'.format(options.cart.height);

            cartTable = createCartTable();
            cartTableContainer.appendChild(cartTable);

            var itemsCount = loadCartItems();
            var cartTotal = createCartTotal();

            cartItemsCounter = createCartItemsCounter(itemsCount);
            cartTitle.appendChild(cartItemsCounter);

            cartContainer.appendChild(cartTitle);
            cartContainer.appendChild(cartTableContainer);
            cartContainer.appendChild(cartTotal);

            document.getElementById(options.cart.id).appendChild(cartContainer);
        };

        /**
         * Creates the seatmap.
         * @private
         */
        var createMap = function createMap() {
            var map = document.createElement('div');
            map.classList.add('sc-map');

            var disabled = options.map.disabled;
            var disabledRowsCounter = 0;

            var generateName = options.map.seatName || seatName;

            // add rows containing seats
            for (var i = 0; i < options.map.rows; i += 1) {
                var row = createRow();

                var isRowDisabled = disabled && disabled.rows && disabled.rows.indexOf(i) >= 0;
                disabledRowsCounter = isRowDisabled ? disabledRowsCounter + 1 : disabledRowsCounter;

                var disabledColumnsCounter = 0;

                for (var j = 0; j < options.map.columns; j += 1) {
                    var isColumnDisabled = disabled && disabled.columns && disabled.columns.indexOf(j) >= 0;
                    disabledColumnsCounter = isColumnDisabled ? disabledColumnsCounter + 1 : disabledColumnsCounter;

                    var seatTextContent = generateName(
                        { index: i, disabled: isRowDisabled, disabledCount: disabledRowsCounter },
                        { index: j, disabled: isColumnDisabled, disabledCount: disabledColumnsCounter }
                    );

                    // draw empty row if row is disabled,
                    // while draw blank seat if column is disabled
                    if (!isRowDisabled) {
                        row.appendChild(createSeat('available', seatTextContent, '{0}_{1}'.format(i, j)));
                    }
                }

                map.appendChild(row);
            }

            var indexes = options.map.indexes;
            var front = options.map.front;

            var columnContainerDirection = 'column';
            if (indexes && indexes.columns && indexes.columns.position === 'bottom') {
                columnContainerDirection = 'column-reverse';
            }

            var itemsPosition = 'right';
            var rowContainerDirection = 'row';
            if (indexes && indexes.rows && indexes.rows.position === 'right') {
                rowContainerDirection = 'row-reverse';
                itemsPosition = 'left';
            }

            var rowIndexContainer = createContainer(null, rowContainerDirection);
            var columnIndexContainer = createContainer(null, columnContainerDirection, itemsPosition);
            columnIndexContainer.append(rowIndexContainer);

            // var mapContainerDirection = 'column';
            // var mapContainerMargin = 'sc-margin-bottom';
            // if (front && front.position === 'bottom') {
            //     mapContainerDirection = 'column-reverse';
            //     mapContainerMargin = 'sc-margin-top';
            // }

            // create map container which will contain everything
            var mapContainer = createContainer('map', 'column', itemsPosition);

            if (!front || front.visible === undefined || front.visible) {
                var frontHeader = createFrontHeader();
                frontHeader.classList.add('sc-margin-bottom');

                mapContainer.appendChild(frontHeader);
            }

            if (!indexes || !indexes.columns || indexes.columns.visible === undefined || indexes.columns.visible) {
                columnIndexContainer.appendChild(createColumnIndex());
            }

            if (!indexes || !indexes.rows || indexes.rows.visible === undefined || indexes.rows.visible) {
                rowIndexContainer.appendChild(createRowIndex());
            }

            rowIndexContainer.append(map);
            columnIndexContainer.append(rowIndexContainer);
            mapContainer.append(columnIndexContainer);

            document.getElementById(options.map.id).appendChild(mapContainer);

            var seat = document.getElementsByClassName('sc-seat')[0];
            var width = seat.offsetWidth;

            var computedStyle = getStyle(seat);
            var margins = parseInt(computedStyle.marginLeft, 10) +
                parseInt(computedStyle.marginRight, 10);

            // set front header and map width
            map.style.width = '{0}px'.format((width + margins) * options.map.columns);

            if (!front || front.visible === undefined || options.map.front.visible) {
                frontHeader.style.width = '{0}px'.format((width + margins) * options.map.columns);
            }

            // add disabled columns to disabled array
            if (options.map.disabled.columns) {
                for (var k = 0; k < options.map.disabled.columns.length; k += 1) {
                    var disabledColumn = options.map.disabled.columns[k];
                    for (var r = 0; r < options.map.rows; r += 1) {
                        options.map.disabled.seats.push((options.map.columns * r) + disabledColumn);
                    }
                }
            }

            // add disabled rows to disabled array
            if (options.map.disabled.rows) {
                for (var m = 0; m < options.map.disabled.rows.length; m += 1) {
                    var disabledRow = options.map.disabled.rows[m];
                    for (var c = 0; c < options.map.columns; c += 1) {
                        options.map.disabled.seats.push((options.map.columns * disabledRow) + c);
                    }
                }
            }

            setSeat('reserved');
            setSeat('disabled');
            selectSeats();
        };

        createMap();

        if (options.cart && options.cart.id) {
            createCart();
        }

        if (options.legend && options.legend.id) {
            createLegend();
        }
    }

    return Seatchart;
})));
