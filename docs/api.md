<h3 id="Seatchart">
  Seatchart</h3><h3 id="Seatchart">
  new Seatchart(options)</h3>Creates a seatchart.


| Param | Type | Default | Description |
| --- | --- | --- | --- |
| options | <code>Object</code> |  | Seatmap options. |
| options.map | <code>Object</code> |  | Map options. |
| options.map.id | <code>number</code> |  | Container id. |
| options.map.rows | <code>number</code> |  | Number of rows. |
| options.map.columns | <code>number</code> |  | Number of columns. |
| [options.map.seatName] | [<code>seatNameCallback</code>](#seatNameCallback) |  | Seat name generator. |
| [options.map.reserved] | <code>Array.&lt;number&gt;</code> |  | Array of reserved seats. |
| [options.map.reserved.seats] | <code>Array.&lt;number&gt;</code> |  | Array of the reserved seats. |
| [options.map.disabled] | <code>Object</code> |  | Disabled seats options. |
| [options.map.disabled.seats] | <code>Array.&lt;number&gt;</code> |  | Array of the disabled seats. |
| [options.map.disabled.rows] | <code>Array.&lt;number&gt;</code> |  | Array of the disabled rows of seats. |
| [options.map.disabled.columns] | <code>Array.&lt;number&gt;</code> |  | Array of the disabled columns of seats. |
| [options.map.indexes] | <code>Object</code> |  | Indexes options. |
| [options.map.indexes.rows] | <code>Object</code> |  | Rows index options. |
| [options.map.indexes.rows.visible] | <code>boolean</code> | <code>true</code> | Row index visibility. |
| [options.map.indexes.rows.position] | <code>string</code> | <code>&quot;left&quot;</code> | Row index position. |
| [options.map.indexes.rows.name] | [<code>rowNameCallback</code>](#rowNameCallback) |  | Row name generator. |
| [options.map.indexes.columns] | <code>Object</code> |  | Columns index options. |
| [options.map.indexes.columns.visible] | <code>boolean</code> | <code>true</code> | Column index visibility. |
| [options.map.indexes.columns.position] | <code>string</code> | <code>&quot;top&quot;</code> | Column index position. |
| [options.map.indexes.columns.name] | [<code>columnNameCallback</code>](#columnNameCallback) |  | Column name generator. |
| [options.map.front] | <code>Object</code> |  | Front header options. |
| [options.map.front.visible] | <code>boolean</code> | <code>true</code> | Front header visibility. |
| options.types | <code>Array.&lt;Object&gt;</code> |  | Seat types options. |
| options.types.type | <code>string</code> |  | Name of seat type. |
| options.types.backgroundColor | <code>string</code> |  | Background color of the defined seat type. |
| options.types.price | <code>number</code> |  | Price of the defined seat type. |
| [options.types.textColor] | <code>string</code> | <code>&quot;white&quot;</code> | Text color of the defined seat type. |
| [options.types.selected] | <code>Array.&lt;number&gt;</code> |  | Selected seats of the defined seat type. |
| [options.cart] | <code>Array.&lt;Object&gt;</code> |  | Cart options. |
| [options.cart.id] | <code>string</code> |  | Container id. |
| [options.cart.height] | <code>string</code> |  | Cart height. |
| [options.cart.width] | <code>string</code> |  | Cart width. |
| [options.cart.currency] | <code>string</code> |  | Current currency. |
| [options.legend] | <code>string</code> |  | Legend options. |
| [options.legend.id] | <code>string</code> |  | Container id. |
| [options.assets] | <code>Array.&lt;Object&gt;</code> |  | Assets options. |
| [options.assets.path] | <code>string</code> |  | Path to assets. |

<h3 id="SeatchartgetCart">
  seatchart.getCart() ⇒ <code>Object.&lt;string, Array.&lt;number&gt;&gt;</code></h3>Gets a reference to the shopping cart object.

**Returns**: <code>Object.&lt;string, Array.&lt;number&gt;&gt;</code> - An object containing all seats added to the shopping cart, mapped by seat type.  
<h3 id="SeatchartgetPrice">
  seatchart.getPrice(type) ⇒ <code>number</code></h3>Gets the price for a specific type of seat.

**Returns**: <code>number</code> - Price.  

| Param | Type | Description |
| --- | --- | --- |
| type | <code>string</code> | The type of the seat. |

<h3 id="SeatchartgetTotal">
  seatchart.getTotal() ⇒ <code>number</code></h3>Gets the total price of the selected seats.

**Returns**: <code>number</code> - - The total price.  
<h3 id="SeatchartisGap">
  seatchart.isGap(seatIndex) ⇒ <code>boolean</code></h3>Checks whether a seat is a gap or not.

**Returns**: <code>boolean</code> - True if it is, false otherwise.  

| Param | Type | Description |
| --- | --- | --- |
| seatIndex | <code>number</code> | Seat index. |

<h3 id="SeatchartmakesGap">
  seatchart.makesGap(seatIndex) ⇒ <code>boolean</code></h3>Checks whether a seat creates a gap or not.

**Returns**: <code>boolean</code> - True if it does, false otherwise.  

| Param | Type | Description |
| --- | --- | --- |
| seatIndex | <code>number</code> | Seat index. |

<h3 id="SeatchartgetGaps">
  seatchart.getGaps() ⇒ <code>Array.&lt;number&gt;</code></h3>Gets all seats which represent a gap of the seat map.

**Returns**: <code>Array.&lt;number&gt;</code> - Array of indexes.  
<h3 id="Seatchartget">
  seatchart.get(index) ⇒ [<code>Seat</code>](#Seat)</h3>Gets seat info.

**Returns**: [<code>Seat</code>](#Seat) - Seat info.  

| Param | Type | Description |
| --- | --- | --- |
| index | <code>number</code> | Seat index. |

<h3 id="Seatchartset">
  seatchart.set(index, type, [emit])</h3>Set seat type.


| Param | Type | Default | Description |
| --- | --- | --- | --- |
| index | <code>number</code> |  | Index of the seat to update. |
| type | <code>string</code> |  | New seat type ('disabled', 'reserved' and 'available' are supported too). |
| [emit] | <code>boolean</code> | <code>false</code> | True to trigger onChange event. |

<h3 id="SeatchartonChange">
  seatchart.onChange(e)</h3>Triggered when a seat is selected or unselected.


| Param | Type | Description |
| --- | --- | --- |
| e | [<code>ChangeEvent</code>](#ChangeEvent) | A change event. |

<h3 id="SeatchartonClear">
  seatchart.onClear(e)</h3>Triggered when all seats are removed with the 'delete all' button in the shopping cart.


| Param | Type | Description |
| --- | --- | --- |
| e | [<code>ClearEvent</code>](#ClearEvent) | A clear event. |

<h3 id="seatNameCallback">
  seatNameCallback(row, column) ⇒ <code>string</code></h3>Callback to generate a seat name.

**Returns**: <code>string</code> - Seat name. Return null or undefined if empty.  

| Param | Type | Description |
| --- | --- | --- |
| row | <code>object</code> |  |
| row.index | <code>number</code> | Row index (starts from 0). |
| row.disabled | <code>boolean</code> | True if current row is disabled. |
| row.disabledCount | <code>number</code> | Number of disabled rows till that one (including current one if disabled). |
| column | <code>object</code> |  |
| column.index | <code>number</code> | Column index (starts from 0). |
| column.disabled | <code>boolean</code> | True if current column is disabled. |
| column.disabledCount | <code>number</code> | Number of disabled columns till that one (including current one if disabled). |

<h3 id="rowNameCallback">
  rowNameCallback(index, disabled, disabledCount) ⇒ <code>string</code></h3>Callback to generate a row name.

**Returns**: <code>string</code> - Row name. Return null or undefined if empty.  

| Param | Type | Description |
| --- | --- | --- |
| index | <code>number</code> | Row index (starts from 0). |
| disabled | <code>boolean</code> | True if current row is disabled. |
| disabledCount | <code>number</code> | Number of disabled rows till that one (including current one if disabled). |

<h3 id="columnNameCallback">
  columnNameCallback(index, disabled, disabledCount) ⇒ <code>string</code></h3>Callback to generate a column name.

**Returns**: <code>string</code> - Column name. Return null or undefined if empty.  

| Param | Type | Description |
| --- | --- | --- |
| index | <code>number</code> | Column index (starts from 0). |
| disabled | <code>boolean</code> | True if current column is disabled. |
| disabledCount | <code>number</code> | Number of disabled columns till that one (including current one if disabled). |

<h3 id="Seat">
  Seat : <code>Object</code></h3>**Properties**

| Name | Type | Description |
| --- | --- | --- |
| type | <code>string</code> | Seat type. |
| id | <code>number</code> | Seat id. |
| index | <code>number</code> | Seat index. |
| name | <code>string</code> | Seat name. |
| price | <code>number</code> | Seat price. |

<h3 id="ChangeEvent">
  ChangeEvent : <code>Object</code></h3>**Properties**

| Name | Type | Description |
| --- | --- | --- |
| action | <code>string</code> | Action on seat ('add', 'remove' or 'update'). |
| current | [<code>Seat</code>](#Seat) | Current seat info. |
| previous | [<code>Seat</code>](#Seat) | Seat info previous to the event. |

<h3 id="ClearEvent">
  ClearEvent : <code>Array.&lt;Object&gt;</code></h3>**Properties**

| Name | Type | Description |
| --- | --- | --- |
| current | [<code>Seat</code>](#Seat) | Current seat info. |
| previous | [<code>Seat</code>](#Seat) | Seat info previous to the event. |

