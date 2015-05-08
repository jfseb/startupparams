var express = require('express');
var app = express();

var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended : true}));


app.set('port', (process.env.PORT || 5000));
app.use(express.static(__dirname + '/public'));

var pg = require('pg');

app.get('/db', function (request, response) {
  pg.connect(process.env.DATABASE_URL, function(err, client, done) {
    client.query('SELECT * FROM sdd', function(err, result) {
      done();
      if (err)
       { console.error(err); response.send("Error " + err); }
      else
       { response.send(result.rows); }
    });
  });
})
/*
app.post('/db_insert', function(req, response) {
    var name = req.body.name,
        email = req.body.email,
		userid = req.body.userid;
	pg.connect(process.env.DATABASE_URL, function(err, client, done) {
		var str = 'INSERT into test_table values (' + name + ', \'' + email + '\')';
		console.log(str);
    client.query(str, function(err, result) {		
      done();
      if (err)
       { console.error(err); response.send("Error " + err); }
      else
       { response.send(result.rows); }
    });
  });		
    // ...
});
*/

	/*		
				create table sdd (
		nr integer,
		name varchar(80),
		fieldcatname varchar(80), 
		tpara  varchar(32),
		description varchar(256),
		respname varchar(120),
		respemail varchar(50),
		respuserid varchar(10),
		respcompany varchar(60),
		ach varchar(16),
		creatorrecord varchar(300),
		tscreated timestamp,
		tsapproved timestamp,
		tschanged timestamp,
		approved  varchar(1)
		)*/
	

app.post('/db_insert', function(req, response) {
    var nr;

	var fieldnames = [ "name", "fieldcatname", "tpara", "description", "respname", "respemail",
	  "respuserid",
	  "respcompany",
	  "ach",
	  "creatorrecord"]; 
	  var approved = ' ';
	  if ( req.body.optionsRadios === "option2") {
		  approved = 'C'; // change request
	  }
	  var cr = req.body.cr;
	  if (!req.body.captcha || !req.body.cr || req.body.cr.length < 4 || ( req.body.cr.length !== req.body.captcha.length))  {
		  response.send("Error, bad captcha test");
	  }
	  for(var i = 0; i < cr.length; i = i + 1 ) {
		  console.log("cr" + cr + " captcha" + req.body.captcha);
		  if ( cr.charAt(i) !== req.body.captcha.charAt(cr.length - i - 1) ) {
			   response.send("Error, bad captcha test 2");
		  }
	  }
	  if (!req.body.cr )
	  response.redirect("/thanks.html"); 
	  
	  
	pg.connect(process.env.DATABASE_URL, function(err, client, done) {
		client.query('SELECT MAX(nr) FROM sdd', function(err, result) {
		  done();
		  if (err)
		   { console.error(err); response.send("Error " + err); }
		  else
		   { 
				nr = result.rows[0].max;
				nr = nr + 1;
				if ( nr >  10) {
					console.error("too many records");
					response.send("Error, too many (Pending)records, try again later ");
					return;
				}
				console.log(result.rows);
				console.log(JSON.stringify(req.body));
			    //response.send(result.rows); 
			   var str = 'INSERT into sdd values (' + nr ;
					fieldnames.forEach(function (fn) {
						str = str + ', \'' + (req.body[fn] || "" )+ '\'';
				});
				str = str + ', current_timestamp, null, current_timestamp,  \'' + approved + '\');';
					
					console.log(str);
				pg.connect(process.env.DATABASE_URL, function(err, client, done) {
					client.query(str, function(err, result) {
					  done();
					  if (err)
					   { console.error(err); response.send("Error " + err); }
					  else
					   { response.redirect("/thanks.html"); }
					});
				});
		   };
		});
	});		
});



app.get('/db_insertx', function (request, response) {
  pg.connect(process.env.DATABASE_URL, function(err, client, done) {
    client.query('SELECT * FROM test_table', function(err, result) {
      done();
      if (err)
       { console.error(err); response.send("Error " + err); }
      else
       { response.send(result.rows); }
    });
  });
})


app.use(express.static(__dirname + '/public'));


app.get('/', function(request, response) {
  response.send('Hello World!');
});

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});
