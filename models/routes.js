// app/routes.js
module.exports = function(app,sfconn) {
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
            sfconn.sobject("Lead").create({
                email : data_array[i][14],
                firstname : data_array[i][9],
                lastname : data_array[i][10],
                title : data_array[i][11],
                company : data_array[i][12],
                leadsource: 'P2C Helper',
                ProductInterest__c: data_array[i][0],
                Description: 'Product Manager: '+ data_array[i][6] + ' Mobile: '+ data_array[i][17]
            }, function(err, ret) {
            if (err || !ret.success) { 
                return console.error(err, ret); 
            }
            });
        };   

        let  arry =  data_array[req.body.customers.split(',#,').length-1];
        let popped = arry.pop();

        data_array[req.body.customers.split(',#,').length-1] = arry;
        //data_array[req.body.customers.split(',#,').length][0] = Date.now().toString();

        console.log(data_array);

        require('dotenv').config();
        var { google } = require('googleapis');
        const sheetsApi = google.sheets('v4');
        const googleAuth = require('./auth');

        const SPREADSHEET_ID = '1Xre2ZMPKmsg65AtDOxGUHvGvs6UUuRaWGvVu6C-UAwE';

        googleAuth.authorize()
            .then((auth) => {
                sheetsApi.spreadsheets.values.append({
                    auth: auth,
                    spreadsheetId: SPREADSHEET_ID,
                    range: 'Sheet1!A2:B',
                    valueInputOption: "USER_ENTERED",
                    resource: {
                        values: data_array
                }
                }, function (err, response) {
                    if (err) {
                        console.log('The API returned an error: ' + err);
                        return console.log(err);
                    }
                });
            })
            .catch((err) => {
                console.log('auth error', err);
            });

        res.render('index.ejs', {
            smessage: JSON.stringify(req.body)
       });    
    });

}

