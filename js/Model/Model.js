class Model{
    constructor(){
        this.connectDatabase()
    }
    setItem(key,obj){
        localStorage.setItem(key,JSON.stringify(obj))
    }
    getItem(key){
        return JSON.parse(localStorage.getItem(key))
    }
    updateFirebase(json,name){
        if(name){
         json.name=name
         this.getFireBaseRef().child(json.key).set(json)
        }
     }
    deleteFirebase(key){
        this.getFireBaseRef().child(key).remove()
        localStorage.removeItem(key)
    }
    deleteStorage(json){
        return new Promise((resolve,reject)=>{
            firebase.storage().ref("/files").child(json.nameFile).delete()
            .then(res=>{
            this.deleteFirebase(json.key)
                resolve(res)
            })
            .catch(erro=>{reject(erro)})
            })
    }
    getFireBaseRef(reff="files"){
        return firebase.database().ref(reff)
    }
    returnsPercent(value,total){
        return value*100/total
    }
    uploadTask(files){
        let promises=[];
        [...files].forEach(file => {
            promises.push(new Promise((resolve,reject)=>{
                let fileRef = firebase.storage().ref("/files").child(file.name)
                let task = fileRef.put(file)
                task.on("state_changed",snapshot=>{
                    document.querySelector("#progress").hidden=false
                    document.querySelector("#progress div").style.width=`${this.returnsPercent(snapshot._delegate.bytesTransferred,snapshot._delegate.totalBytes)}%`
                },erro=>{
                    reject(erro)
                },()=>{
                    task.snapshot.ref.getDownloadURL().then(downloadURL=>{
                        task.snapshot.ref.updateMetadata({ customMetadata: { downloadURL }}).then(metadata=>{
                         resolve(metadata)
                       }).catch( error => {
                         console.error( 'Error update metadata:', error)
                         reject( error ) 
                       })
                    })
                })
            }))
        });
        return Promise.all(promises)
    }
    connectDatabase(){
        // Your web app's Firebase configuration
         // For Firebase JS SDK v7.20.0 and later, measurementId is optional
         var firebaseConfig = {
            apiKey: "AIzaSyA8VatUsrBVfnGr39504PkK2V-b6Xbp6MY",
            authDomain: "videos-f9347.firebaseapp.com",
            projectId: "videos-f9347",
            storageBucket: "videos-f9347.appspot.com",
            messagingSenderId: "159927562164",
            appId: "1:159927562164:web:764745403e327de02f0ce1",
            measurementId: "G-1J4VH51376"
          };
             // Initialize Firebase
             firebase.initializeApp(firebaseConfig);
             firebase.analytics();
     }
}
