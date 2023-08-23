const {db} = require('./firebaseController');
var admin = require('firebase-admin');
var cron = require('node-cron');


var currentIndex = Date().toString();









const DeleteData = async (collection, doc,) => {
    try {
        console.log("deletion started")

        await db.collection(collection).doc(doc).collection('timeseries').get().then(async (res) => {res.forEach(element => {
            element.ref.delete();
          });
        });
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
                time: timedata,
                totalOpens: 0,
                    totalDesktop: 0,
                    totalDesktop: 0,
                    totalTablet: 0,
            });
            console.log('temp')
            currentIndex = timedata;
            } else {
                console.log("No such document!");
                db.collection(collection).doc(doc).collection('timeseries').doc(timedata).set({
                    time: timedata,
                    totalOpens: 0,
                    totalDesktop: 0,
                    totalDesktop: 0,
                    totalTablet: 0,
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
                    totalDesktop: lastdoc.docs[0].data().totalDesktop+isDesktop,
                    isMobile: lastdoc.docs[0].data().isMobile+isMobile,
                    isTablet: lastdoc.docs[0].data().isTablet+isTablet,
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



const AggregateData = async (collection, doc, collection2) => {
    try {
        var totalOpens = 0;
        var totalDesktop = 0;
        var totalMobile = 0;
        var totalTablet = 0;
        await db.collection('metrics').doc('minute-update').collection('timeseries').get().then((res) => {
            if (!res.empty) {
                console.log("function processing")
                db.collection(collection).doc(doc).collection('timeseries').get().then(function(querySnapshot) {
                    querySnapshot.forEach(function(doc) {
                        // doc.data() is never undefined for query doc snapshots
                        console.log(doc.id, " => ", doc.data());
                        totalOpens = totalOpens + doc.data().totalOpens;
                        if(doc.data().isDesktop){
                            totalDesktop++;
                        }
                        if(doc.data().isMobile){
                            totalMobile++;
                        }
                        if(doc.data().isTablet){
                            totalTablet++;
                        }
                    });
                    console.log("totalOpens: "+totalOpens)
                        console.log("totalDesktop: "+totalDesktop)
                        console.log("totalMobile: "+totalMobile)
                        console.log("totalTablet: "+totalTablet)
                    db.collection(collection).doc(collection2).collection('timeseries').doc(Date().toString()).set({
                        time: Date().toString(),
                        totalOpens: totalOpens,
                        totalDesktop: totalDesktop,
                        totalMobile: totalMobile,
                        totalTablet: totalTablet,
                    }).then(() => {
                        DeleteData('metrics','minute-update',)
                    })
                });
            } else {
                console.log("No such document!");
            }
        }).catch((error) => {
            console.log("Error getting document:", error);
        });
    } catch (error) {
        console.error("Error writing document: ", error);
    }


}



module.exports = {
    DeleteData, AddData, AggregateData, UpdateData
}