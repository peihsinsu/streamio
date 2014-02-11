var fs = require('fs')
	, log = require('nodeutil').logger.getInstance('streamio.js')
  , file_folder = process.env.FILE_FOLDER || __dirname + '/..';

var cache = {};
exports.status = cache;
var counter = {
	start: function(path) {
					 if(!cache[path]) cache[path] = 0;
					 cache[path] ++;
				 },
	end:   function(path) {
					 cache[path] --;
			   }
};

exports.setDefaultPath = function(p) {
	file_folder = p;
}

exports.getResponse = stream_response;
function stream_response( res, file_path, content_type ){
	var fullpath = file_folder + '/' + file_path;
	log.info('streaming of file:%s start', fullpath);
	var readStream = fs.createReadStream(fullpath);
  counter.start(fullpath);
	readStream.on('data', function(data) {
		var flushed = res.write(data);
		// Pause the read stream when the write stream gets saturated
		if(!flushed){
				readStream.pause();
		}
	});

	res.on('close', function() {
		log.info('%s close', fullpath);
  	counter.end(fullpath);
	});

	res.on('finish', function() {
		log.info('%s finish', fullpath);
  	counter.end(fullpath);
	});

	res.on('drain', function() {
		//log.info('%s drain....', fullpath);
		// Resume the read stream when the write stream gets hungry 
		readStream.resume();
	});

	readStream.on('end', function() {
		log.info('%s play end', fullpath);
  	counter.end(fullpath);
		res.end();
	});

	readStream.on('error', function(err) {
		log.error('Error while streaming %s, Exception: ', file_path, err);
		res.end();
	});

	res.writeHead(200, {'Content-Type': content_type});
}


