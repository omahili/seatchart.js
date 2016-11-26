var fs = require('fs');

fs.readFile('docs/styles/jsdoc.css', 'utf8', function (err,data) {
    if (err) {
        return console.log(err);
    }

    var result = data.replace(/#606|#6d426d/g, '#008080')
                     .replace(/#fc83ff/g, '#00FFFF');

    fs.writeFile('docs/styles/jsdoc.css', result, 'utf8', function error(err) {
        if (err) {
            return console.log(err);
        }
    });
});
