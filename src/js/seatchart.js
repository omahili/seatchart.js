// .NET equivalent of string.Format() method
String.prototype.format = function () {
    var args = arguments;
    return this.replace(/{(\d+)}/g, function (match, number) {
        return typeof args[number] !== undefined ? args[number] : match;
    });
};

String.prototype.capitalizeFirstLetter = function() {
    var result = this.charAt(0).toUpperCase();
    for (var i = 1; i < this.length; i++)
        result += this.charAt(i).toLowerCase();
    
    return result;
};

function seatchartJS(seatMap, seatTypes) {
    var alphabet = 'ABCDEFGHIJLMNOPQRSTUVWXYZ';
    // this array contains all the seat types
    var types = [];
    
    var seatClick = function () {
        // switch seat type
        
        // clone array because it's modified by adding and removing classes
        var currentClassList = [];
        for (var j = 0; j < this.classList.length; j++)
            currentClassList.push(this.classList[j]);
        
        for (var i = 0; i < currentClassList.length; i++) {
            var currentClass = currentClassList[i];
            
            if(currentClass != "seatChart-seat" && currentClass != "clicked"){
                // find index of current
                var index = types.indexOf(currentClass);

                // if the current class matches a type
                // then select the new one
                if (index != -1) {
                    this.classList.remove(types[index]);
                    index++;

                    if (index == types.length) {
                        index = 0;
                    }

                    this.style.backgroundColor = "";
                    this.classList.add(types[index]);

                    // if the class isn't available then apply the background-color in the json
                    if (types[index] != "available") {
                        // decrease it because there's one less element 
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
    }
    
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
        
        if (typeof rowIndex === undefined) {
            row.appendChild(createSeat("blank", ""));
        } else {
            row.appendChild(createSeat("index", rowIndex));
        }
        
        return row;
    };
    
    // creates the header of the seat map 
    // containing the front indicator
    var createFrontHeader = function () {
        var header = createRow(),
            front = document.createElement("div"),
            // compute the seat style to get its width
            cssSeat = window.getComputedStyle(createSeat("available", "A1")),
            margins = parseInt(cssSeat.marginLeft, 10) + parseInt(cssSeat.marginRight, 10);
        
        // set the perfect width of the front indicator
        front.style.width = (parseInt(cssSeat.width, 10) + margins) * seatMap.cols - margins;
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
    
    var initializeSeatTypes = function () {
        // update types of seat
        // because this.typesJson doens't work in seatClick function
        typesJson = this.typesJson;
        types = ["available"];
        
        for (var i = 0; i < seatTypes.length; i++){
            types.push(seatTypes[i].type);
        }   
    };
    
    // updates the seat map data
    this.update = function () {
        initializeSeatTypes();
        setReservedSeat();
    };
    
    // removes all classes regarding the type applied to the seat
    var removeAllTypesApplied = function (seat) {
        for (var i = 0; i < types.length; i++)
            seat.classList.remove(types[i]);
    }
    
    // set all reserved seats as unavailable
    var setReservedSeat = function () {
        var cols = seatMap.cols;
        var reserved = seatMap.reserved;
        
        for(var i = 0; i < reserved.length; i++){
            var reservedIndex = reserved[i];
            var id = "{0}_{1}".format(Math.floor(reservedIndex/cols), reservedIndex%cols);
            var reservedSeat = document.getElementById(id);
            removeAllTypesApplied(reservedSeat);
            reservedSeat.classList.add("unavailable");
        }
    };
    
    // set all disabled seats ad blank
    var setDisabledSeat = function () {
        var cols = seatMap.cols;
        var disabled = seatMap.disabled;
        
        for(var i = 0; i < disabled.length; i++){
            var disabledIndex = disabled[i];
            var id = "{0}_{1}".format(Math.floor(disabledIndex/cols), disabledIndex%cols);
            var disabledSeat = document.getElementById(id);
            removeAllTypesApplied(disabledSeat);
            disabledSeat.classList.add("blank");
        }
    };
    
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
    
    // creates a legend list title
    var createLegendListTitle = function(title) {
        var listTitle = document.createElement("h5");
        listTitle.textContent = title;
        
        return listTitle;
    };
    
    // creates the seat map legend
    this.createLegend = function (containerId) {
        // create legend container
        var seatLegendContainer = createContainer();
        
        var seatsListTitle = createLegendListTitle("Seats:");
        var seatsList = createLegendList();
        seatsList.appendChild(createLegendItem("Available", "available"));
        seatsList.appendChild(createLegendItem("Already booked", "unavailable"));
        
        var yourSeatsListTitle = createLegendListTitle("Your seat(s):");
        var yourSeatsList = createLegendList();
        for (var i = 0; i < seatTypes.length; i++) {
            var description = "{0} {1}€".format(seatTypes[i].type.capitalizeFirstLetter(), seatTypes[i].price);
            var item = createLegendItem(description, "", seatTypes[i].color);
            yourSeatsList.appendChild(item);
        }      
        
        seatLegendContainer.appendChild(seatsListTitle);
        seatLegendContainer.appendChild(seatsList);
        seatLegendContainer.appendChild(yourSeatsListTitle);
        seatLegendContainer.appendChild(yourSeatsList);
        
        var container = document.getElementById(containerId);
        container.appendChild(seatLegendContainer);
    };
}