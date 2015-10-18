function seatchartJS(seatMap, seatTypes) {
    // .NET equivalent of string.Format() method
    String.prototype.format = function () {
        var args = arguments;
        return this.replace(/{(\d+)}/g, function (match, number) {
            return typeof args[number] !== undefined ? args[number] : match;
        });
    };

    // capitalizes the first letter and lowers all the others
    String.prototype.capitalizeFirstLetter = function () {
        var result = this.charAt(0).toUpperCase();
        for (var i = 1; i < this.length; i++)
            result += this.charAt(i).toLowerCase();

        return result;
    };
    
    // returns the computed style of an element, it works even on ie :P
    var getStyle = function (el) {
        if (typeof window.getComputedStyle !== undefined)
	      return window.getComputedStyle(el, null);
	    else
	      return el.currentStyle;
    };
    
    // calculates the scrollbar width
    // thanks to Alexander Gomes (http://www.alexandre-gomes.com/?p=115)
    function getScrollBarWidth () { 
        var inner = document.createElement('p'); 
        inner.style.width = "100%"; 
        inner.style.height = "200px"; 

        var outer = document.createElement('div'); 
        outer.style.position = "absolute"; 
        outer.style.top = "0px"; 
        outer.style.left = "0px"; 
        outer.style.visibility = "hidden"; 
        outer.style.width = "200px"; 
        outer.style.height = "150px"; 
        outer.style.overflow = "hidden"; 
        outer.appendChild (inner); 

        document.body.appendChild (outer); 
        var w1 = inner.offsetWidth; 
        outer.style.overflow = 'scroll'; 
        var w2 = inner.offsetWidth; 
        if (w1 == w2) w2 = outer.clientWidth; 

        document.body.removeChild (outer); 

        return (w1 - w2); 
    }; 
    
    function colorToHex(color) {
        var colors = {"aliceblue":"#f0f8ff","antiquewhite":"#faebd7","aqua":"#00ffff","aquamarine":"#7fffd4","azure":"#f0ffff",
"beige":"#f5f5dc","bisque":"#ffe4c4","black":"#000000","blanchedalmond":"#ffebcd","blue":"#0000ff","blueviolet":"#8a2be2","brown":"#a52a2a","burlywood":"#deb887","cadetblue":"#5f9ea0","chartreuse":"#7fff00","chocolate":"#d2691e","coral":"#ff7f50","cornflowerblue":"#6495ed","cornsilk":"#fff8dc","crimson":"#dc143c","cyan":"#00ffff","darkblue":"#00008b","darkcyan":"#008b8b","darkgoldenrod":"#b8860b","darkgray":"#a9a9a9","darkgreen":"#006400","darkkhaki":"#bdb76b","darkmagenta":"#8b008b","darkolivegreen":"#556b2f","darkorange":"#ff8c00","darkorchid":"#9932cc","darkred":"#8b0000","darksalmon":"#e9967a","darkseagreen":"#8fbc8f","darkslateblue":"#483d8b","darkslategray":"#2f4f4f","darkturquoise":"#00ced1","darkviolet":"#9400d3","deeppink":"#ff1493","deepskyblue":"#00bfff","dimgray":"#696969","dodgerblue":"#1e90ff","firebrick":"#b22222","floralwhite":"#fffaf0","forestgreen":"#228b22","fuchsia":"#ff00ff","gainsboro":"#dcdcdc","ghostwhite":"#f8f8ff","gold":"#ffd700","goldenrod":"#daa520","gray":"#808080","green":"#008000","greenyellow":"#adff2f","honeydew":"#f0fff0","hotpink":"#ff69b4","indianred ":"#cd5c5c","indigo":"#4b0082","ivory":"#fffff0","khaki":"#f0e68c","lavender":"#e6e6fa","lavenderblush":"#fff0f5","lawngreen":"#7cfc00","lemonchiffon":"#fffacd","lightblue":"#add8e6","lightcoral":"#f08080","lightcyan":"#e0ffff","lightgoldenrodyellow":"#fafad2","lightgrey":"#d3d3d3","lightgreen":"#90ee90","lightpink":"#ffb6c1","lightsalmon":"#ffa07a","lightseagreen":"#20b2aa","lightskyblue":"#87cefa","lightslategray":"#778899","lightsteelblue":"#b0c4de","lightyellow":"#ffffe0","lime":"#00ff00","limegreen":"#32cd32","linen":"#faf0e6","magenta":"#ff00ff","maroon":"#800000","mediumaquamarine":"#66cdaa","mediumblue":"#0000cd","mediumorchid":"#ba55d3","mediumpurple":"#9370d8","mediumseagreen":"#3cb371","mediumslateblue":"#7b68ee","mediumspringgreen":"#00fa9a","mediumturquoise":"#48d1cc","mediumvioletred":"#c71585","midnightblue":"#191970","mintcream":"#f5fffa","mistyrose":"#ffe4e1","moccasin":"#ffe4b5","navajowhite":"#ffdead","navy":"#000080","oldlace":"#fdf5e6","olive":"#808000","olivedrab":"#6b8e23","orange":"#ffa500","orangered":"#ff4500","orchid":"#da70d6","palegoldenrod":"#eee8aa","palegreen":"#98fb98","paleturquoise":"#afeeee","palevioletred":"#d87093","papayawhip":"#ffefd5","peachpuff":"#ffdab9","peru":"#cd853f","pink":"#ffc0cb","plum":"#dda0dd","powderblue":"#b0e0e6","purple":"#800080","red":"#ff0000","rosybrown":"#bc8f8f","royalblue":"#4169e1","saddlebrown":"#8b4513","salmon":"#fa8072","sandybrown":"#f4a460","seagreen":"#2e8b57","seashell":"#fff5ee","sienna":"#a0522d","silver":"#c0c0c0","skyblue":"#87ceeb","slateblue":"#6a5acd","slategray":"#708090","snow":"#fffafa","springgreen":"#00ff7f","steelblue":"#4682b4","tan":"#d2b48c","teal":"#008080","thistle":"#d8bfd8","tomato":"#ff6347","turquoise":"#40e0d0","violet":"#ee82ee","wheat":"#f5deb3","white":"#ffffff","whitesmoke":"#f5f5f5","yellow":"#ffff00","yellowgreen":"#9acd32"};

        var hex = colors[color.toLowerCase()];
        
        return typeof hex !== 'undefined' ? hex : color;
    };
    
    // check if seatTypes is an array and contains at least one element
    if (Object.prototype.toString.call(seatTypes) !== '[object Array]' && seatTypes.length < 1)
        throw "seatTypes in seatChartJS, seatTypes has to be an array and contain at least one element.";
    else {
        // check if all elements have the needed attribute and contain the right type of value
        for (var i = 0; i < seatTypes.length; i++){
            if(!seatTypes[i].hasOwnProperty("type") || !seatTypes[i].hasOwnProperty("color") || !seatTypes[i].hasOwnProperty("price"))
                throw "seatTypes in seatChartJS, element at index {0} doesn't contain a 'type', a 'color' or a 'price' property.".format(i);
            else if (!(typeof seatTypes[i].type === 'string' || seatTypes[i].type instanceof String))
                throw "seatTypes in seatChartJS, 'type' property at index {0} has to be a string.".format(i);
            else if (!(typeof seatTypes[i].color === 'string' || seatTypes[i].color instanceof String))
                throw "seatTypes in seatChartJS, 'color' property at index {0} has to be a string.".format(i);
            else if (typeof seatTypes[i].price !== 'number')
                throw "seatTypes in seatChartJS, 'price' property at index {0} has to be a number.".format(i);
        }
    }
    
    var checkColor = function (index) {
        var color = colorToHex(seatTypes[index].color);
            
        if(color.indexOf("#") != 0)
            throw "seatTypes in seatChartJS, 'color' property at index {0} has to be a valid color (e.g. 'red' or '#ff0000') , rgb() colors aren't accepted.".format(index);
        
        return color;
    };
    
    // check the given input
    for (var i = 0; i < seatTypes.length; i++) {
        // check color value
        var color_i = checkColor(i);
        
        for (var j = i + 1; j < seatTypes.length; j++) {
            if (seatTypes[i].type == seatTypes[j].type || seatTypes[i].type.capitalizeFirstLetter() == seatTypes[j].type.capitalizeFirstLetter())
                throw "seatTypes in seatChartJs, '{0}' and '{1}' equals, types has to be different from each other. Types are case insensitive.".format(seatTypes[i].type, seatTypes[j].type);      
            
            // check color value
            var color_j = checkColor(j);
            
            if (color_i == color_j)
                throw "seatTypes in seatChartJs, '{0}' and '{1}' equals, colors has to be different from each other to be recognized, by the user.".format(seatTypes[i].color, seatTypes[j].color);
        }
    }
    
    // the currency used
    var currency = "€";
    // path where assets are located
    var assetsSrc = "assets";
    var soundEnabled = true;
    // shopping cart size
    var shoppingCartWidth = 200;
    var shoppingCartHeight = 200;
    // the interval in milliseconds that switches the seat type
    var mouseDownInterval = 500;
    // mouseDown interval
    var mouseDown;
    var changedOnMouseDown = false;
    
    this.setCurrency = function (value) {
        if (typeof value === 'string' || value instanceof String)
            self.currency = value;
        else
            throw "value in setCurrency, value has to be a string.";
    };
    
    this.getCurrency = function () {
        return self.currency;
    };
    
    this.setAssetsSrc = function (value) {
        if (typeof value === 'string' || value instanceof String)
            self.assetsSrc = value;
        else
            throw "value in setAssetsSrc, value has to be a string.";
    };
    
    this.getAssetsSrc = function () {
        return self.assetsSrc;
    };
    
    this.setSoundEnabled = function (value) {
        if (typeof value === "boolean")
            self.soundEnabled = value;
        else
            throw "value in setSoundEnabled, value has to be a boolean.";
    };
    
    this.getSoundEnabled = function () {
        return self.soundEnabled;
    };
    
    this.setShoppingCartWidth = function (value) {
        if (typeof value === "number" && value >= 0)
            self.shoppingCartWidth = value;
        else
            throw "value in setShoppingCartWidth, value has to be a positive number.";
    };
    
    this.getShoppingCartWidth = function () {
        return self.shoppingCartWidth;
    };
    
    this.setShoppingCartHeight = function (value) {
        if (typeof value === "number" && value >= 0)
            self.shoppingCartHeight = value;
        else
            throw "value in setShoppingCartHeight, value has to be a positive number.";
    };
    
    this.getShoppingCartHeight = function () {
        return self.shoppingCartHeight;
    };
    
    this.setMouseDownInterval = function (value) {
        if (typeof value === "number" && value >= 100)
            // doesn't need self.
            mouseDownInterval = value;
        else
            throw "value in setMouseDownInterval, value has to be a positive number and be grateare than 99 milliseconds.";
    };
    
    this.getMouseDownInterval = function () {
        // doesn't need self...
        return mouseDownInterval;
    };
    
    var self = this;
    var alphabet = 'ABCDEFGHIJLMNOPQRSTUVWXYZ';
    // this array contains all the seat types
    var types = [];
    var scItemsContainer, shoppingCartTotal;
    // this dictionary contains all the seats added to the shopping cart organized per type
    var shoppingCartDict = [];
    // the icon that shows if sound is enabled
    var soundIcon;
    
    // plays asyncrounously a click sound
    var playAsyncClick = function () {
        if (self.soundEnabled) {
            var clickSound = new Audio("{0}/sounds/seatclick.mp3".format(self.assetsSrc));
            clickSound.volume = 0.2; 
            clickSound.load();
            clickSound.play();
        }
    };
    
    var setSoundIconSrc = function () {
        if (self.soundEnabled)
            soundIcon.src = "{0}/icons/soundon.svg".format(self.assetsSrc);
        else
            soundIcon.src = "{0}/icons/soundoff.svg".format(self.assetsSrc);
    };
    
    var soundIconClick = function () {
        self.soundEnabled = !self.soundEnabled;     
        setSoundIconSrc();
        playAsyncClick();
    };
    
    var updateShoppingCart = function (action, id, type) {
        var seatName = document.getElementById(id).textContent;    
        var scItem;
        var capitalizedType = type.capitalizeFirstLetter();
        var price = self.getPrice(type);
        var description = "{0} - {1} {2}{3}\n".format(seatName, capitalizedType, price, self.currency);                
        
        if (action == "remove") {
            if (scItemsContainer !== undefined)
                document.getElementById("item-{0}".format(id)).outerHTML = "";
            
            if (self.onRemovedSeat != null)
                self.onRemovedSeat(seatName, capitalizedType, price);
        }
        else if (action == "add") {
            if (scItemsContainer !== undefined) {
                scItem = createScItem(description, id);
                scItemsContainer.appendChild(scItem);
            }
            
            if (self.onAddedSeat != null)
                self.onAddedSeat(seatName, capitalizedType, price);
        }
        else if (action == "update"){
            scItem = document.getElementById("item-{0}".format(id));
            var p = scItem.getElementsByTagName("p")[0];
            p.textContent = description;
            
            if (self.onAddedSeat != null)
                self.onAddedSeat(seatName, capitalizedType, price);
        }
    };
    
    var createIconedTitle = function (content, src, alt){
        var container = document.createElement("div");
        var icon = document.createElement("img");
        icon.src = src;
        icon.alt = alt;
        
        var title = createTitle(content);        
        container.className = title.className;
        title.className = "";
        
        container.appendChild(icon);
        container.appendChild(title);
        
        return container;   
    };
    
    var updateTotal = function () {
        if (shoppingCartTotal !== undefined)
            shoppingCartTotal.textContent = "Total: {0}{1}".format(self.getTotal(), self.currency);
    };
    
    var releaseSeat = function (id) {
        var seat = document.getElementById(id);
        seat.style.cssText = "";
        seat.className = "seatChart-seat available";
    };
    
    var removeFromScDict = function(id, type){
        if(type !== undefined) {
            if(type in shoppingCartDict){
                var index = shoppingCartDict[type].indexOf(id);
                if(index > -1) {
                    shoppingCartDict[type].splice(index, 1);
                    return true;
                }
            }
        }
        else {
             for (var key in shoppingCartDict) {
                 if (shoppingCartDict.hasOwnProperty(key)) {
                     if(removeFromScDict(id, key))
                         return true;
                 }           
            }   
        }

        return false;
    };
    
    var addToScDict = function(id, type){
        if (type in shoppingCartDict) {
            if (shoppingCartDict.hasOwnProperty(type)) {
                shoppingCartDict[type].push(id);
                return true;
            }
        }
        
        return false;
    };
    
    var seatClick = function () {
        if (!changedOnMouseDown) {
            // clone array because it's modified by adding and removing classes
            var currentClassList = [];
            for (var j = 0; j < this.classList.length; j++)
                currentClassList.push(this.classList[j]);

            for (var i = 0; i < currentClassList.length; i++) {
                var currentClass = currentClassList[i];
                var newClass;

                if (currentClass != "seatChart-seat" && currentClass != "clicked") {                            
                    // find index of current
                    var index = types.indexOf(currentClass);

                    // if the current class matches a type
                    // then select the new one
                    if (index != -1) {
                        // a 'selectable' seat is clicked then play the click sound
                        playAsyncClick();

                        this.classList.remove(types[index]);
                        index++;

                        if (index == types.length)
                            index = 0;

                        newClass = types[index];

                        this.style.backgroundColor = "";
                        this.classList.add(newClass);

                        // if the class isn't available then apply the background-color in the json
                        if (newClass != "available") {                    
                            // decrease it because there's one less element in seatTypes
                            // which is "available", that already exists
                            index--;
                            if (index < 0)
                                index = seatTypes.length - 1;

                            this.classList.add("clicked");
                            this.style.backgroundColor = seatTypes[index].color;
                        }
                        // otherwise remove the class 'clicked' since available has it's own style
                        else
                            this.classList.remove("clicked");

                        // this has to be done after updating the shopping cart
                        // so the event is fired just once the seat style is really updated              
                        if (currentClass == "available") {
                            if (addToScDict(this.id, newClass))
                                updateShoppingCart("add", this.id, newClass); 
                        }
                        else if(newClass == "available"){
                            if (removeFromScDict(this.id, currentClass))
                                updateShoppingCart("remove", this.id, currentClass);
                        }
                        else if (addToScDict(this.id, newClass) && removeFromScDict(this.id, currentClass))
                                updateShoppingCart("update", this.id, newClass);
                    }
                }
            }

            updateTotal();
        }
    };
    
    // creates a seat
    var createSeat = function (type, content, seatId) {
        var seat = document.createElement("div");
        seat.textContent = content;
        seat.className = "seatChart-seat " + type;
        
        // if seat if wasn't passed as argument then don't set it
        if (seatId !== undefined) {
            seat.setAttribute("id", seatId);
            
            // add click event just if it's a real seats (when it has and id)
            seat.addEventListener("click", seatClick);
            seat.addEventListener("mousedown", mouseDownSeat);
            seat.addEventListener("mouseup", mouseUpSeat);
            seat.addEventListener("contextmenu", rightClickDelete, false);
        }
        
        return seat;
    };
                
    var mouseDownSeat = function (e) {
        // restrict mouse down to left button
        if (e.which == 1) {
            var id = this.id;    
            // to allow a simple click
            changedOnMouseDown = false;

            mouseDown = setInterval(function() {
                // to allow the click simulation
                changedOnMouseDown = false;
                document.getElementById(id).click();

                // this prevents from change on mouse release
                changedOnMouseDown = true;
            }, mouseDownInterval);
        }
    };        
            
    var mouseUpSeat = function (e) {
        // restrict mouse up to left button
        if (e.which == 1 && mouseDown)
            clearTimeout(mouseDown);
    };
    
    // this function is fired when a seat is right clicked to be released
    var rightClickDelete = function (e) {
        e.preventDefault();
        
        var type = getSeatType(this.id);
        
        // it means it has no type and it's available, then there's nothing to delete
        if (type != undefined) {
            // there's no need to fire onRemoveSeat event since this function fires it
            updateShoppingCart("remove", this.id, type);

            releaseSeat(this.id);
            // remove from virtual sc
            removeFromScDict(this.id, type);
            updateTotal();
        }
        
        // so the default context menu isn't showed
        return false;
    };
    
    // creates a seat map row
    var createRow = function (rowIndex) {
        var row = document.createElement("div");
        row.className = "seatChart-row";
        
        if (rowIndex === undefined)
            row.appendChild(createSeat("blank", ""));
        else
            row.appendChild(createSeat("index", rowIndex));
        
        return row;
    };
    
    // creates the header of the seat map 
    // containing the front indicator
    var createFrontHeader = function () {
        var header = createRow();
        
        // initialize sound image element
        soundIcon = document.createElement("img");
        soundIcon.onclick = soundIconClick;
        soundIcon.alt = "Sound icon. Click to enable/disable the sound.";
        setSoundIconSrc();
        
        // get header blank 'index' (actually a seat)
        var blankIndex = header.childNodes[0];
        blankIndex.appendChild(soundIcon);
        
        // set the perfect width of the front indicator
        var front = document.createElement("div");
        front.textContent = "Front";
        front.className = "seatChart-front";      
        header.appendChild(front);
        
        return header;
    };
    
    // creates a row containing the columns index
    var createColumnsIndex = function () {
        var columnsIndex = createRow();
        
        for (var i = 1; i <= seatMap.cols; i++)
            columnsIndex.appendChild(createSeat("index", i)); 
        
        return columnsIndex;
    };
    
    // creates the container for the seat map and legend
    var createContainer = function () {
        var container = document.createElement("div");
        container.className = "seatChart-container";
        
        return container;
    };
    
    // initializes the type of seats that can be clicked and
    // the types of seat that can be added to the shopping cart
    // by using the json, containing the types, given in input
    var initializeSeatTypes = function () {
        // update types of seat
        // because this.typesJson doens't work in seatClick function
        typesJson = this.typesJson;
        types = ["available"];
        shoppingCartDict = [];
        
        for (var i = 0; i < seatTypes.length; i++){
            types.push(seatTypes[i].type);
            shoppingCartDict[seatTypes[i].type] = [];
        }   
    };
    
    // removes all classes regarding the type applied to the seat
    var removeAllTypesApplied = function (seat) {
        for (var i = 0; i < types.length; i++)
            seat.classList.remove(types[i]);
    };
    
    // sets all disabled seats as blank or reserved seats as unavailable
    var setSeat = function (type) {
        var cols = seatMap.cols;
        
        for (var i = 0; i < seatMap[type].length; i++) {
            var index = seatMap[type][i];
            var id = "{0}_{1}".format(Math.floor(index/cols), index%cols);
            var seat = document.getElementById(id);
            
            // prevents from null reference exception when json goes out of range
            if (seat != null) {
                removeAllTypesApplied(seat);
                
                if (type === "disabled")
                    seat.classList.add("blank");
                else
                    seat.classList.add("unavailable");
            }
        }
    };
    
    // returns the price for a specific seat
    this.getPrice = function (type) {
        for (var i = 0; i < seatTypes.length; i++) {
            if (seatTypes[i].type == type)
                return seatTypes[i].price;
        }       
    };
    
    // returns the total price of the selected seats
    this.getTotal = function () {
        var total = 0;
        for (var key in shoppingCartDict)        
            total += self.getPrice(key) * shoppingCartDict[key].length; 
        
        return total;
    }
    
    // these events work even when a shopping cart isn't created, 
    // because the virtual one work independently
    // this event is triggered when a seat is added to the shopping cart
    this.onAddedSeat = null;
    // this event is triggered when a seat is removed from the shopping cart
    this.onRemovedSeat = null;
    
    // creates the seat map
    this.createMap = function (containerId) {
        // create array of seat types
        initializeSeatTypes();

        // create seat map container
        var seatMapContainer = createContainer();
        // add header to container
        seatMapContainer.appendChild(createFrontHeader());
        // add columns index to container
        seatMapContainer.appendChild(createColumnsIndex());

        // add rows containing seats
        for (var i = 0; i < seatMap.rows; i++) {
            var rowIndex = alphabet[i];
            var row = createRow(rowIndex);

            for(var j = 0; j < seatMap.cols; j++)
                row.appendChild(createSeat("available", rowIndex + (j + 1), i + "_" + j));

            seatMapContainer.appendChild(row);
        }

        // inject the seat map into the container given as input
        var container = document.getElementById(containerId);
        container.appendChild(seatMapContainer);
                      
        // set front indicator 
        var seat = document.getElementsByClassName("seatChart-seat")[0];
        var width = seat.offsetWidth;
        
        var computedStyle = getStyle(seat); 
        var margins = parseInt(computedStyle.marginLeft, 10) + parseInt(computedStyle.marginRight, 10);
        
        // set seatmap width   
        // +1 because of the row indexer
        seatMapContainer.style.width = "{0}px".format((width + margins) * (seatMap.cols + 1) + margins);
        
        var front = seatMapContainer.getElementsByClassName("seatChart-front")[0];
        front.style.width = "{0}px".format((width + margins) * seatMap.cols - margins);

        setSeat("reserved");
        setSeat("disabled");   
    };
    
    // creates a legend item applying a type and a color if needed
    var createLegendItem = function (content, type, color) {
        var item = document.createElement("li");
        item.className = "seatChart-legend-item";
        var itemStyle = document.createElement("div");
        itemStyle.className = "seatChart-seat legend-style {0}".format(type);
        var description = document.createElement("p");
        description.className = "seatChart-legend-description";
        description.textContent = content;
        
        if (color !== undefined) {
            itemStyle.className = "{0} clicked".format(itemStyle.className);
            itemStyle.style.backgroundColor = color;
        }       
        
        item.appendChild(itemStyle);
        item.appendChild(description);
        
        return item;
    };
    
    // creates a legend list
    var createLegendList = function () {
        var list = document.createElement("ul");
        list.className = "seatChart-legend-list";
        
        return list;
    };
    
    // creates a small title
    var createSmallTitle = function(content) {
        var smallTitle = document.createElement("h5");
        smallTitle.textContent = content;
        smallTitle.className = "seatChart-small-title";
        
        return smallTitle;
    };
    
    // creates a large title
    var createTitle = function (content) {
        var title = document.createElement("h3");
        title.textContent = content;
        title.className = "seatChart-title";
        
        return title;
    };
    
    // creates a seat map legend
    this.createLegend = function (containerId) {
        // create legend container
        var seatLegendContainer = createContainer();
        
        var legendTitle = createTitle("Legend");
        
        var seatsListTitle = createSmallTitle("Seats:");
        var seatsList = createLegendList();
        seatsList.appendChild(createLegendItem("Available", "available"));
        seatsList.appendChild(createLegendItem("Already booked", "unavailable"));
        
        var yourSeatsListTitle = createSmallTitle("Your seat(s):");
        var yourSeatsList = createLegendList();
        for (var i = 0; i < seatTypes.length; i++) {
            var description = "{0} {1}{2}".format(seatTypes[i].type.capitalizeFirstLetter(), seatTypes[i].price, self.currency);
            var item = createLegendItem(description, "", seatTypes[i].color);
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
    
    var createScItemsContainer = function () {
        var container = document.createElement("div");
        container.className = "seatChart-sc-items-container";
        
        return container;
    };
    
    var getSeatName = function (id) {
        return document.getElementById(id).textContent;
    };
    
    var getSeatType = function (id) {
        for (var key in shoppingCartDict) {
            if (shoppingCartDict.hasOwnProperty(key)) {
                if (shoppingCartDict[key].indexOf(id) > -1) {
                    return key;
                }
            }
        }
        
        return undefined;
    };
    
    var deleteClick = function () {
        var parentId = this.parentNode.getAttribute("id");
        document.getElementById(parentId).outerHTML = "";  
        
        var id = parentId.split("-")[1];
        
        var seatName = getSeatName(id);
        var type = getSeatType(id);
        
        // get price before capitalizing since indexing is case sensitive
        var price = self.getPrice(type);
            
        // deselect seat
        releaseSeat(id);
        
        removeFromScDict(id);
        updateTotal();
        
        // fire event
        if (self.onRemovedSeat != null)
            self.onRemovedSeat(seatName, type.capitalizeFirstLetter(), price);
    };
    
    var deleteAllClick = function () {
        // release all selected seats and remove them from dictionary
        for (var key in shoppingCartDict) {
            if (shoppingCartDict.hasOwnProperty(key)) {
                for (var i = 0; i < shoppingCartDict[key].length; i++) {
                    var id = shoppingCartDict[key][i];
                    
                    // deselect seat
                    releaseSeat(id);
                    
                    var seatName = getSeatName(id);
                    var type = getSeatType(id);
        
                    // get price before capitalizing since indexing is case sensitive
                    var price = self.getPrice(type);
                    
                    // fire event
                    if (self.onRemovedSeat != null)
                        self.onRemovedSeat(seatName, type.capitalizeFirstLetter(), price);
                }
                
                // empty array, fastest way instead of removing each seat
                shoppingCartDict[key] = [];
            }
        }
        
        // empty shopping cart, fastest way instead of removing each item
        scItemsContainer.innerHTML = "";
        
        updateTotal();
    };

    var createScItem = function (description, id) {
        var item = document.createElement("div");
        item.className = "seatChart-sc-item";
        //-2 because of the item left padding
        item.style.width = "{0}px".format(self.shoppingCartWidth - getScrollBarWidth() - 2);
        item.setAttribute("id", "item-{0}".format(id));
        
        var desc = document.createElement("p");
        desc.className = "seatChart-sc-description";
        desc.textContent = description;
        
        var deleteBtn = createScDeleteButton();
        deleteBtn.onclick = deleteClick;
        
        item.appendChild(desc);
        item.appendChild(deleteBtn);
        
        return item;
    };
    
    var createScDeleteButton = function () {
        var binImg = document.createElement("img");
        binImg.src = "{0}/icons/bin.svg".format(self.assetsSrc);
        
        var deleteBtn = document.createElement("div");
        deleteBtn.className = "seatChart-sc-delete";  
        deleteBtn.appendChild(binImg);
        
        return deleteBtn;
    };
    
    var createScTotal = function () {
        var container = document.createElement("div");
         
        shoppingCartTotal = createSmallTitle("Total: 0{0}".format(self.currency));
        shoppingCartTotal.className += " seatChart-sc-total";
        
        var deleteBtn = createScDeleteButton();
        deleteBtn.onclick = deleteAllClick;
        deleteBtn.className += " all";
        
        var label = document.createElement("p");
        label.textContent = "All";
        deleteBtn.appendChild(label);
        
        container.appendChild(shoppingCartTotal);
        container.appendChild(deleteBtn);
        
        return container;
    };
    
    // creates a shopping cart
    this.createShoppingCart = function (containerId) {
        var shoppingCartContainer = createContainer();      
        var shoppingCartTitle = createIconedTitle("Shopping cart", "{0}/icons/shoppingcart.svg".format(self.assetsSrc), "Shopping cart icon.");  
        
        scItemsContainer = createScItemsContainer();
        scItemsContainer.style.width = "{0}px".format(self.shoppingCartWidth);
        scItemsContainer.style.height = "{0}px".format(self.shoppingCartHeight);
        var scTotal = createScTotal();
        
        shoppingCartContainer.appendChild(shoppingCartTitle);
        shoppingCartContainer.appendChild(scItemsContainer);
        shoppingCartContainer.appendChild(scTotal);
        
        var container = document.getElementById(containerId);
        container.appendChild(shoppingCartContainer);
    };
}