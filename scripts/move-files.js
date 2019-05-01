var fs = require('fs-extra');

function printError(err) {
    if (err) {
        console.log(err);
    }
}

fs.copy('scripts/docs.js', 'docs/scripts/docs.js', printError);
fs.copy('scripts/docs.css', 'docs/styles/docs.css', printError);
fs.copy('src/js/seatchart.js', 'docs/scripts/seatchart.js', printError);
fs.copy('src/css/seatchart.css', 'docs/styles/seatchart.css', printError);
fs.copy('src/assets', 'docs/assets', printError);
