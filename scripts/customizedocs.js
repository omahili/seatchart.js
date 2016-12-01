var fs = require('fs-extra');

function printError(err) {
    if (err) console.log(err);
}

fs.readFile('docs/styles/jsdoc.css', 'utf8', function readFile(err, data) {
    if (err) {
        console.log(err);
        return;
    }

    var result = data.replace(/#606|#6d426d/g, '#008080')
                     .replace(/#fc83ff/g, '#00FFFF');

    fs.writeFile('docs/styles/jsdoc.css', result, 'utf8', printError);
});

fs.readFile('docs/index.html', 'utf8', function readFile(err, data) {
    if (err) {
        console.log(err);
        return;
    }

    var mainDivStyle = 'height: calc(100% - 56px); margin-right:-20px; width:calc(100% - 220px);';
    var iframe = "<iframe src='frame.html' width='100%' height='100%'></iframe>";
    var mainDiv = `<div id='main' style='${mainDivStyle}'>${iframe}</div>`;

    var result = data.replace(/<div id="main">[.\w\s]*<\/div>/, mainDiv);

    fs.writeFile('docs/index.html', result, 'utf8', printError);
    fs.copy('scripts/resources/frame.html', 'docs/frame.html', printError);
    fs.copy('scripts/resources/logo.svg', 'docs/static/assets/logo.svg', printError);
    fs.copy('src', 'docs/static', printError);
    fs.copy('scripts/resources/highlight', 'docs/static/highlight', printError);
});
