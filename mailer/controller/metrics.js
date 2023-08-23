const {db} = require('./firebaseController');
var admin = require('firebase-admin');
var cron = require('node-cron');


var currentIndex = Date().toString();









const DeleteData = async (collection, doc) => {
    try {
        await db.collection(collection).doc(doc).delete();
        console.log("Document successfully deleted!");
        db.collection(collection).doc(doc).set({"timeseries": [
        ]});
    } catch (error) {

        console.error("Error removing document: ", error);
    }
    db.collection(collection).doc(doc).create;
    if(doc!='realtime-update'){
        //currentIndex = 0;
        console.log("currentindex: "+currentIndex)
    }
}

const AddData = async (collection, doc, data, timestamp) => {
    try {
        console.log("function started")
                        const timedata = Date().toString();

        await db.collection(collection).doc(doc).get().then(async (res) => {
            if (res.exists) {
                console.log("function processing")
                //const washingtonRef =await  db.collection(collection).doc(doc).collection('timeseries').doc(timedata).get();
            db.collection(collection).doc(doc).collection('timeseries').doc(timedata).set({
                totalOpens: 0,
                time: timedata,
            });
            console.log('temp')
            currentIndex = timedata;
            } else {
                console.log("No such document!");
                db.collection(collection).doc(doc).collection('timeseries').doc(timedata).set({
                    totalOpens: 0,
                    time: timedata,
                }).then(async () => {
                    currentIndex = timedata;
                    console.log("Document successfully updated! 1 ");
                    const ref = db.collection(collection).doc(doc).collection('timeseries');
                    const snapshot = await ref.count().get();
                    //console.log("currentindex: "+ref.orderBy("createdAt", "desc").limit(1))
                    
                })
            }
        })
        console.log("Document successfully updated! 2 ");
    } catch (error) {
        console.error("Error writing document: ", error);
    }
}

const UpdateData = async (collection, doc, isDesktop, isMobile, isTablet) => {
    try {
        console.log("function started")
                        const timedata = Date().toString();
        await db.collection(collection).doc(doc).collection('timeseries').get().then(async (res) => {
            if (!res.empty) {
                console.log("function processing")
                const lastdoc = await db.collection(collection).doc(doc).collection('timeseries').orderBy("time", "desc").limit(0).get();
                console.log("Document data:", lastdoc.docs[0].data().time);
                console.log("Document data:", lastdoc.docs[0].data().totalOpens);
                db.collection(collection).doc(doc).collection('timeseries').doc(lastdoc.docs[0].data().time).set({
                    time: lastdoc.docs[0].data().time,
                    totalOpens: lastdoc.docs[0].data().totalOpens+1,
                });

                //const washingtonRef =await  db.collection(collection).doc(doc).collection('timeseries').doc(timedata).get();
                // db.collection(collection).doc(doc).collection('timeseries').doc(currentIndex).set({
                //     totalOpens: admin.firestore.FieldValue.increment(1),
                // })

            




            } else {
                


            }
        })
        //console.log("Document successfully updated!");
    } catch (error) {
        console.error("Error writing document: ", error);
    }
}



const AggregateData = async (collection, doc, data, timestamp) => {
    try {
        await db.collection(collection).doc(doc).get().then((doc) => {
            if (doc.exists) {
                console.log("Document data:", doc.data());
                // var oldData = doc.data();
                // var newData = oldData+data;
                db.collection(collection).doc(doc).set(newData);
            } else {
                console.log("No such document!");
                db.collection(collection).doc(doc).set(newData);
            }
        }).catch((error) => {
            console.log("Error getting document:", error);
        });
        console.log("Document successfully written!");
    } catch (error) {
        console.error("Error writing document: ", error);
    }


}



module.exports = {
    DeleteData, AddData, AggregateData, UpdateData
}