StreamIO for your Video
----

!Install and create a project

!! Create a web using express
```
$ express -s -e demo
$ cd demo && npm install
```

!! Install streamio dependency
```
$ npm install streamio --save
```

!Edit your app.js

!!Step1: Require the module

```
var stream = require('./lib/streamio')
```

!!Step2: Set the default path

```
stream.setDefaultPath(__dirname);
```

!!Step3: Serve a steam media

```
app.get('/video/:type/:file', function(req, res) {
  console.log('Play stream file:%s with type:%s', req.params.file, req.params.type);
  stream.getResponse(res, req.params.file, 'video/' + req.params.type);
});
```
