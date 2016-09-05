var subxfinder = require('./subxfinder'),
    _ = require('lodash'),
    fs = require('fs'),
    request = require('request');

subxfinder.search('seinfeld', function(err, results){
    if(err){
        console.log(err);
    }else if(results){
        getFile(results, 0);
    };
});

function getFile(results, i){
    try{
        var sub = results[i];

        if(i < results.length){
            var mime = require('mime-types');

            request.get(sub.link).on('response', function (response) {
                var responseType = (response.headers['content-type'] || '').split(';')[0].trim(),
                    ext = mime.extension(responseType);

                var filename = sub.title;

                if( fs.existsSync(__dirname + '/' +filename + '.' + ext) ){
                    filename = filename + ' - ' + i;
                }

                filename += '.' + ext;

                var fileStream = fs.createWriteStream(filename).on('finish', function() {
                    console.log('Download Complete: %s', filename);
                });

                this.pipe(fileStream);

                i = i + 1;
                getFile(results, i);
            });
        }
    }catch(e){
        console.log(e)
    }
}