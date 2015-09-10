function seatchartJS(containerId, structureJson, typesJson) {
    var alphabet = 'ABCDEFGHIJLMNOPQRSTUVWXYZ';
    // this array contains all the types of seat
    var types = [];
    
    this.containerId = containerId;
    this.structureJson = structureJson;
    this.typesJson = typesJson;
    
    var seatClick = function () {
        // switch seat type
        
        // clone array because it's modified by adding and removing classes
        var currentClassList = [];
        for(var j = 0; j < this.classList.length; j++)
            currentClassList.push(this.classList[j]);
        
        for (var i = 0; i < currentClassList.length; i++) {
            var currentClass = currentClassList[i];
            
            if(currentClass != "seatChart-seat" && currentClass != "clicked"){
                // find index of current
                var index = types.indexOf(currentClass);

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
                            index = typesJson.length - 1;
                        }

                        this.classList.add("clicked");
                        this.style.backgroundColor = typesJson[index].color;
                    }
                    // otherwise remove the class 'clicked' since available has it's own style
                    else
                        this.classList.remove("clicked");
                }
            }
        }
    }
    
    // creates a seat
    this.createSeat = function (type, content, seatId) {
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
    this.createRow = function (rowIndex) {
        var row = document.createElement("div");
        row.className = "seatChart-row";
        
        if (typeof rowIndex === undefined) {
            row.appendChild(this.createSeat("blank", ""));
        } else {
            row.appendChild(this.createSeat("index", rowIndex));
        }
        
        return row;
    };
    
    // creates the header of the seat map 
    // containing the front indicator
    this.createFrontHeader = function () {
        var header = this.createRow(),
            front = document.createElement("div"),
            // compute the seat style to get its width
            cssSeat = window.getComputedStyle(this.createSeat("available", "A1")),
            margins = parseInt(cssSeat.marginLeft, 10) + parseInt(cssSeat.marginRight, 10);
        
        // set the perfect width of the front indicator
        front.style.width = (parseInt(cssSeat.width, 10) + margins) * this.structureJson.cols - margins;
        front.textContent = "Front";
        front.className = "seatChart-front";      
        header.appendChild(front);
        
        return header;
    };
    
    // creates a row containing the columns index
    this.createColumnsIndex = function () {
        var columnsIndex = this.createRow();
        
        for (var i = 1; i <= this.structureJson.cols; i++)
            columnsIndex.appendChild(this.createSeat("index", i)); 
        
        return columnsIndex;
    };
    
    // creates the container for the seat map and legend
    this.createContainer = function () {
        var container = document.createElement("div");
        container.className = "seatChart-container";
        
        return container;
    }
    
    this.update = function (){
        // update types of seat
        // because this.typesJson doens't work in seatClick function
        typesJson = this.typesJson;
        types = ["available"];
        
        for(var i = 0; i < this.typesJson.length; i++){
            types.push(this.typesJson[i].type);
        }
    }
    
    this.update();
    
    // create seat map container
    var seatMapContainer = this.createContainer();
    // add header to container
    seatMapContainer.appendChild(this.createFrontHeader());
    // add columns index to container
    seatMapContainer.appendChild(this.createColumnsIndex());
    
    // add rows containing seats
    for (var i = 1; i <= this.structureJson.rows; i++) {
        var rowIndex = alphabet[i-1];
        var row = this.createRow(rowIndex);
        
        for(var j = 1; j <= this.structureJson.cols; j++) {
            row.appendChild(this.createSeat("available", rowIndex + j, i + "_" + j));
        }
        
        seatMapContainer.appendChild(row);
    }
    
    // inject the seat map into the container given as input
    var container = document.getElementById(containerId);
    container.appendChild(seatMapContainer);
}