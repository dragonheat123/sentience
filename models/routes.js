// app/routes.js
module.exports = function(app) {
    // =====================================
    // HOME PAGE
    // =====================================
    app.get('/', function(req, res) {
        res.render('index.ejs', {smessage: "hello!"}); // load the index.ejs file
    });

    app.get('/index', function(req, res) {
        res.render('index.ejs', {smessage: "hello!"}); // load the index.ejs file
    });

    app.post('/index', async (req, res) => {
        console.log(req.body.product);
        var info = req.body;
        var { google } = require("googleapis");
        let authentication = require("./authentication");
        console.log((process.env.HOME || process.env.HOMEPATH || process.env.USERPROFILE) + '/.credentials/'); 
        function appendData(auth) {
          var sheets = google.sheets('v4');
          sheets.spreadsheets.values.append({
            auth: auth,
            spreadsheetId: '1dCRGqg73PXAVZxWoJEq0b09U0fD1d6EuZNFFVmWucA8',
            range: 'Sheet1!A2:B', //Change Sheet1 if your worksheet's name is something else
            valueInputOption: "USER_ENTERED",
            resource: {
              values: [ ["Void", "Canvas", "Website"], ["Paul", "Shan", "Human"] ]
            }
          }, (err, response) => {
            if (err) {
              console.log('The API returned an error: ' + err);
              return;
            } else {
                console.log("Appended");
            }
          });
        }

        authentication.authenticate().then((auth)=>{
            appendData(auth);
        });  

        res.render('index.ejs', {
            smessage: JSON.stringify(req.body)
       });    
    });

}

