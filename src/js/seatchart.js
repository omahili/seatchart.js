function seatchartJS(containerId, json) {
    var alphabet = 'ABCDEFGHIJLMNOPQRSTUVWXYZ';
    
    this.containerId = containerId;
    this.json = json;
    
    // creates a seat
    this.createSeat = function (type, content) {
        var seat = document.createElement("div");
        seat.textContent = content;
        seat.className = "seatChart-seat " + type;
            
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
            margins = parseInt(cssSeat.marginLeft) + parseInt(cssSeat.marginRight);
        
        // set the perfect width of the front indicator
        front.style.width = (parseInt(cssSeat.width) + margins) * json.cols - margins;
        front.textContent = "Front";
        front.className = "seatChart-front";      
        header.appendChild(front);
        
        return header;
    };
    
    // creates a row containing the columns index
    this.createColumnsIndex = function () {
        var columnsIndex = this.createRow();
        
        for (var i = 1; i <= json.cols; i++)
            columnsIndex.appendChild(this.createSeat("index", i)); 
        
        return columnsIndex;
    };
    
    // creates the container for the seat map and legend
    this.createContainer = function () {
        var container = document.createElement("div");
        container.className = "seatChart-container";
        
        return container;
    }
    
    // create seat map container
    var seatMapContainer = this.createContainer();
    // add header to container
    seatMapContainer.appendChild(this.createFrontHeader());
    // add columns index to container
    seatMapContainer.appendChild(this.createColumnsIndex());
    
    // add rows containing seats
    for (var i = 1; i <= json.rows; i++) {
        var rowIndex = alphabet[i-1];
        var row = this.createRow(rowIndex);
        
        for(var j = 1; j <= json.cols; j++) {
            row.appendChild(this.createSeat("available", rowIndex + j));
        }
        seatMapContainer.appendChild(row);
    }
    
    // inject the seat map into the container given as input
    var container = document.getElementById(containerId);
    container.appendChild(seatMapContainer);
}