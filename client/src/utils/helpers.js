export function pluralize(name, count) {
  if (count === 1) {
    return name
  }
  return name + 's'
}


export function idbPromise(storeName, method, object){
  return new Promise((resolve, reject)  => {
    // open connection to the database
    const request = window.indexedDB.open('redux-store', 1)
    // create variables to hold reference to the database
    let db
    let tx
    let store

    // if version has changed (or if this is the first time using the database), run this method and create the three object stores 
    //on upgrade needed looks for a version change otherwise will not run 
    request.onupgradeneeded = function(e) {
      const db = request.result;
      // create object store for each type of data and set "primary" key index to be the `_id` of the data
      db.createObjectStore('products', { keyPath: '_id' });
      db.createObjectStore('categories', { keyPath: '_id' });
      db.createObjectStore('cart', { keyPath: '_id' });
    };

    //handle errors
    request.onerror = function(e) {
      console.log('Uhhh... there seems to be a problem.')
    }

    //on database open success
    request.onsuccess = function(e) {
      // save a reference of the db to the db variable
      db = request.result
      //open a transation to do whatever we pass into storeName --> must match one of the object store names
      tx = db.transaction(storeName, 'readwrite')
      //save a reference to that object store
      store = tx.objectStore(storeName)

      //if errors
      db.onerror = function(e){
        console.log('error:' + e)
      }

      switch(method){
        case 'put':
          store.put(object)
          resolve(object)
          break;
        case 'get':
          const all = store.getAll()
          all.onsuccess = function () {
            resolve(all.result)
          }
          break;
        case 'delete':
          store.delete(object._id)
          break;
        default:
          console.log('Not a valid method.')
          break;
      }

      //when the tx is complete, close db
      tx.oncomplete = function() {
        db.close();
      }
    }

  })
}