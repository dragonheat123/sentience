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
        console.log(req.body.customers.split(',#,').length);
        var data_array = new Array(req.body.customers.split(',#,').length).fill(null).map(()=>new Array(17).fill(null));
        for (i=0;i<req.body.customers.split(',#,').length;i++){
            data_array[i]=req.body.customers.split(',#,')[i].split(',')
        };

        let  arry =  data_array[req.body.customers.split(',#,').length-1]
        let popped = arry.pop();

        data_array[req.body.customers.split(',#,').length-1] = arry

        console.log(data_array)
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
              values: data_array
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

