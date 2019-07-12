if (window.location.href.endsWith('index.html') || window.location.href.endsWith('#demo') || window.location.href.endsWith('seatchart.js.org/')) {
    var main = document.getElementById('main');

    var exampleContainer = document.createElement('div');
    exampleContainer.className = 'example';

    var mapContainer = document.createElement('div');
    mapContainer.id = 'mapContainer';
    mapContainer.className = 'right';

    var containers = document.createElement('div');
    containers.className = 'containers';

    var legendContainer = document.createElement('div');
    legendContainer.id = 'legendContainer';
    legendContainer.className = 'right';

    var shoppingCartContainer = document.createElement('div');
    shoppingCartContainer.id = 'shoppingCartContainer';
    shoppingCartContainer.className = 'right';

    containers.append(legendContainer, shoppingCartContainer);
    exampleContainer.append(mapContainer, containers);

    var demo = document.getElementById('demo');
    demo.appendChild(exampleContainer);

    // init seatchart

    var map = {
        rows: 9,
        cols: 9,
        reserved: [1, 2, 3, 5, 6, 7, 9, 10, 11, 12, 14, 15, 16, 17, 18, 19, 20, 21],
        disabled: [0, 8],
        disabledRows: [4],
        disabledCols: [4]
    };

    var types = [
        { type: 'regular', color: 'orange', price: 10, selected: [23, 24] },
        { type: 'reduced', color: '#af0000', price: 7.5, selected: [25, 26] },
        { type: 'military', color: 'red', price: 7 }
    ];

    var sc = new Seatchart(map, types);

    sc.setAssetsSrc('assets');
    sc.createMap('mapContainer');
    sc.createLegend('legendContainer');
    sc.createShoppingCart('shoppingCartContainer');
}
