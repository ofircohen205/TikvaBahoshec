const functions = require('firebase-functions');
const emailjs = require('emailjs/email');
const pdfdocument = require('pdfkit');
const admin = require('firebase-admin');
admin.initializeApp();


exports.deleteUser = functions.firestore
    .document('SupportReps/{SupportRepID}')
    .onDelete((snap, context) => {
        return admin.auth().deleteUser(snap.data().SupportRepID)
            .then(() => console.log('Deleted user with ID:' + snap.data().SupportRepID))
            .catch((error) => console.error('There was an error while deleting user:', error));
    });

// var nameOfClient

// exports.getName =  functions.database.ref('/nameOfClient/{namekey}').onWrite(( change,context) =>{
//     nameOfClient =change.after.val().name
//     console.log(nameOfClient)
//     return change.after.val().name;
//    })


// exports.sendmailfn = functions.database.ref('/sendmail/{emailkey}').onWrite(event => {
exports.sendmailfn = functions.database.ref('/sendmail/{emailkey}').onWrite((change, context) => {
    var nameOfClient = functions.database.ref().val
    var doc = new pdfdocument();
    // var email = change.after.val().emailid;



    var server = emailjs.server.connect({
        user: 'tikva.bahoshec@gmail.com',
        password: 'tikvab173',
        host: 'smtp.gmail.com',
        ssl: true
    });

    server.send({
        text: "A new chat room has been created by the client: " + change.after.val().ClientName + "\nPlease enter to the site as soon as you can",

        from: 'myself@thisvideo.com',
        to: change.after.val().emailid,
        subject: 'Tikva.bahoshec: new chat room has been created by:\n' + change.after.val().ClientName,

    }, (err, message) => {
        if (err)
            console.log(err)
    })

})