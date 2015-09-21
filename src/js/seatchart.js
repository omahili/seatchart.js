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
        for (var i = 1; i < this.length; i++) {
            result += this.charAt(i).toLowerCase();
        }

        return result;
    };
    
    // returns the computed style of an element, it works even on ie :P
    var getStyle = function (el) {
        if (typeof window.getComputedStyle !== undefined) {
	      return window.getComputedStyle(el, null);
	    } else {
	      return el.currentStyle;
	    }   
    };
    
    // the currency used
    this.currency = "€";
    // path where assets are located
    this.assetsSrc = "assets";
    this.soundEnabled = true;
    
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
        if (self.soundEnabled) {
            soundIcon.src = "{0}/icons/soundon.svg".format(self.assetsSrc);
        }
        else {
            soundIcon.src = "{0}/icons/soundoff.svg".format(self.assetsSrc);  
        }
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
            if (scItemsContainer !== undefined) {
                document.getElementById("item-{0}".format(id)).outerHTML = "";
            }
            
            if (self.onRemovedSeat != null) {
                self.onRemovedSeat(seatName, capitalizedType, price);
            }
        }
        else if (action == "add") {
            if (scItemsContainer !== undefined) {
                scItem = createScItem(description, id);
                scItemsContainer.appendChild(scItem);
            }
            
            if (self.onAddedSeat != null) {
                self.onAddedSeat(seatName, capitalizedType, price);
            }
        }
        else if (action == "update"){
            scItem = document.getElementById("item-{0}".format(id));
            var p = scItem.getElementsByTagName("p")[0];
            p.textContent = description;
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
        if (shoppingCartTotal !== undefined) {
            shoppingCartTotal.textContent = "Total: {0}{1}".format(self.getTotal(), self.currency);
        }
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
                     if(removeFromScDict(id, key)) {
                         return true;
                     }
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
        // clone array because it's modified by adding and removing classes
        var currentClassList = [];
        for (var j = 0; j < this.classList.length; j++) {
            currentClassList.push(this.classList[j]);
        }
        
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

                    if (index == types.length) {
                        index = 0;
                    }
                    
                    newClass = types[index];
                    
                    if (currentClass == "available") {
                        if (addToScDict(this.id, newClass)) {
                            updateShoppingCart("add", this.id, newClass);
                        }        
                    }
                    else if(newClass == "available"){
                        if(removeFromScDict(this.id, currentClass)){
                            updateShoppingCart("remove", this.id, currentClass);
                        }
                    }
                    else { 
                        if (addToScDict(this.id, newClass) && removeFromScDict(this.id, currentClass)) {
                            updateShoppingCart("update", this.id, newClass);
                        }
                    }

                    this.style.backgroundColor = "";
                    this.classList.add(newClass);

                    // if the class isn't available then apply the background-color in the json
                    if (newClass != "available") {                    
                        // decrease it because there's one less element in seatTypes
                        // which is "available", that already exists
                        index--;
                        if (index < 0) {
                            index = seatTypes.length - 1;
                        }

                        this.classList.add("clicked");
                        this.style.backgroundColor = seatTypes[index].color;
                    }
                    // otherwise remove the class 'clicked' since available has it's own style
                    else
                        this.classList.remove("clicked");
                }
            }
        }
        
        updateTotal();
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
        }
        
        return seat;
    };
    
    // creates a seat map row
    var createRow = function (rowIndex) {
        var row = document.createElement("div");
        row.className = "seatChart-row";
        
        if (rowIndex === undefined) {
            row.appendChild(createSeat("blank", ""));
        } else {
            row.appendChild(createSeat("index", rowIndex));
        }
        
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
        for (var i = 0; i < types.length; i++) {
            seat.classList.remove(types[i]);
        }
    };
    
    // sets all reserved seats as unavailable
    var setReservedSeat = function () {
        var cols = seatMap.cols;
        var reserved = seatMap.reserved;
        
        for (var i = 0; i < reserved.length; i++) {
            var reservedIndex = reserved[i];
            var id = "{0}_{1}".format(Math.floor(reservedIndex/cols), reservedIndex%cols);
            var reservedSeat = document.getElementById(id);
            removeAllTypesApplied(reservedSeat);
            reservedSeat.classList.add("unavailable");
        }
    };
    
    // sets all disabled seats as blank
    var setDisabledSeat = function () {
        var cols = seatMap.cols;
        var disabled = seatMap.disabled;
        
        for (var i = 0; i < disabled.length; i++) {
            var disabledIndex = disabled[i];
            var id = "{0}_{1}".format(Math.floor(disabledIndex/cols), disabledIndex%cols);
            var disabledSeat = document.getElementById(id);
            removeAllTypesApplied(disabledSeat);
            disabledSeat.classList.add("blank");
        }
    };
    
    // returns the price for a specific seat
    this.getPrice = function (type) {
        for (var i = 0; i < seatTypes.length; i++) {
            if (seatTypes[i].type == type) {
                return seatTypes[i].price;
            }
        }       
    };
    
    // returns the total price of the selected seats
    this.getTotal = function () {
        var total = 0;
        for (var key in shoppingCartDict) {           
            total += self.getPrice(key) * shoppingCartDict[key].length;   
        }
        return total;
    }
    
    // these events work even when a shopping cart isn't created, 
    // because the virtual one work independently
    // an event which is triggered when a seat is added to the shopping cart
    this.onAddedSeat = null;
    // an event which is triggered when a seat is removed from the shopping cart
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

            for(var j = 0; j < seatMap.cols; j++) {
                row.appendChild(createSeat("available", rowIndex + (j + 1), i + "_" + j));
            }

            seatMapContainer.appendChild(row);
        }

        // inject the seat map into the container given as input
        var container = document.getElementById(containerId);
        container.appendChild(seatMapContainer);
                      
        // set front indicator width        
        var seat = document.getElementsByClassName("seatChart-seat")[0];
        var width = seat.offsetWidth;
        
        var computedStyle = getStyle(seat); 
        var margins = parseInt(computedStyle.marginLeft, 10) + parseInt(computedStyle.marginRight, 10);
        
        var front = seatMapContainer.getElementsByClassName("seatChart-front")[0];
        front.style.width = "{0}px".format((width + margins) * seatMap.cols - margins);

        setReservedSeat();
        setDisabledSeat();   
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
    
    var deleteClick = function () {
        var parentId = this.parentNode.getAttribute("id");
        document.getElementById(parentId).outerHTML = "";  
        
        var id = parentId.split("-")[1];
        
        removeFromScDict(id);
        updateTotal();
                    
        // deselect seat
        releaseSeat(id);
    };
    
    var createScItem = function (description, id) {
        var item = document.createElement("div");
        item.className = "seatChart-sc-item";
        item.setAttribute("id", "item-{0}".format(id));
        
        var desc = document.createElement("p");
        desc.className = "seatChart-sc-description";
        desc.textContent = description;
        
        var binImg = document.createElement("img");
        binImg.src = "{0}/icons/bin.svg".format(self.assetsSrc);
        
        var deleteBtn = document.createElement("div");
        deleteBtn.onclick = deleteClick;
        deleteBtn.className = "seatChart-sc-delete";  
        deleteBtn.appendChild(binImg);
        
        item.appendChild(desc);
        item.appendChild(deleteBtn);
        
        return item;
    };
    
    // creates a shopping cart
    this.createShoppingCart = function (containerId) {
        var shoppingCartContainer = createContainer();      
        var shoppingCartTitle = createIconedTitle("Shopping cart", "{0}/icons/shoppingcart.svg".format(self.assetsSrc), "Shopping cart icon.");  
        
        scItemsContainer = createScItemsContainer();
        shoppingCartTotal = createSmallTitle("Total: 0{0}".format(self.currency));
        
        shoppingCartContainer.appendChild(shoppingCartTitle);
        shoppingCartContainer.appendChild(scItemsContainer);
        shoppingCartContainer.appendChild(shoppingCartTotal);
        
        var container = document.getElementById(containerId);
        container.appendChild(shoppingCartContainer);
    };
}