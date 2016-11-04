# d3ForceSimple

### Prerequisites
- [d3.js ( v4.0 )](https://d3js.org)
	- make chart、gravity ball simulation
- [Firebase](https://firebase.google.com)
	- realtime data storage

### Description
It's a demo to use d3.js making a gravity simulation .

**The interesting thing** is we combined width firebase's database . When a user submit a form / data , we'll insert a gravity ball and then analysis data, realtimely.

### File
- index.html : show gravity ball ( the data analysis )
- form.html : write your own form 

### Usage
- Create a [Firebase](https://firebase.google.com) project 
- Get your project's config code ( Remember setting your firebase's project rule `public` or `user`, that can make you get data successly )
```html
<script>
  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyBcRARBJVtNYCqc5Y9hgd97ds580GohgD8",
    authDomain: "ccs-ai-night.firebaseapp.com",
    databaseURL: "https://ccs-ai-night.firebaseio.com",
    storageBucket: "project-name.appspot.com",
    messagingSenderId: "000000000000"
  };
	
  firebase.initializeApp(config);
</script>
```

- Set config code in `firebase_config.js` 
- Happy start !


Control input data:
- `form.js`
```htmlmixed
DB.database()
  .ref('/')
  .push()
  .set(result)
  .then( function(){ console.log('success') })
  .catch( function(){ console.log('error') } )

```

Cintrol output data:
- index.js
```htmlmixed
var nodes = [];
var ref = DB.database().ref('/');

ref.on('child_added', function(snapshot) {
  var person = snapshot.val();
  
  //Add nodes
  nodes.push( ... );
});

```

### Keypress
- ` / ` : change state ( analysis ) 
- ` . ` : on / off shaking !!


### License
MIT © [Tsehang](https://github.com/TseHang)