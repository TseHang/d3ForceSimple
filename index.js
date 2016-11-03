'use strict' ;

var svg = d3.select('#main').append('svg');
var width = $('#main').width();
var height = $('#main').height();

var forcePosition = {
  two : [ {x : -100 , y : 0 } , {x: 600 , y : 0} ],
  three : [ {x : 200 , y : -300 } , {x : -100 , y : 0 } , { x : 500 , y : 0 }],
  four : [ {x : width/2 , y : 50 } , {x : width/2 , y : 200 } , { x : width/2 , y : 350 } , { x : width/2 , y : 500 }]
}

var F ={
  k :.1,
  toggle : 0,
  strength : 100,
  random: false
}

var nodes = [];
var node = svg.append("g").attr("class" , "nodes");

var simulation = d3.forceSimulation();
var forceManyBody = d3.forceManyBody().strength(F.strength);
var color = d3.scaleQuantize()
    .domain([0, 3])
    // .range(["#D33948", "#FFDB91", "#95BF95", "#96E5FF"]);
    .range(["#D33948", "#F6F5AE", "#2E86AB", "#74A57F"]);

// firbase ref
var ref = DB.database().ref('/');
var questionNum = 5;
var i = 0;
initial();

// Listen child
ref.on('child_added', function(snapshot) {
  var person = snapshot.val();
  i++ ;
  //Add nodes
  nodes.push({
    question:[
      person.q1,
      person.q2,
      person.q3,
      person.q4,
      person.q5
    ],
    r:~~d3.randomUniform(4, 20)()
  });

  console.log(i);

  insertBall(nodes) ;
});

$('body').keypress(function(e) {
  // keycode = `/` ;
  console.log(e.keyCode);

  if (e.keyCode === 47 || e.keyCode === 12581) {
    if (F.toggle++ >= questionNum) {
      F.toggle = 0;
    }
    console.log(F.toggle);
  }else if (e.keyCode === 46 || e.keyCode === 12577) {
    // on / off random --> 暴動
    F.random = !F.random ;
  } 
});

function initial() {

  var end = function(){
    console.log('end');
  }

  var ticked = function() {

    if ( F.toggle === 0 ){
      _nodesPosition(0);
    }else if( F.toggle === 1 ){
      _nodesPosition(3);
    }else{   // F.toggle = 2 . 3. 4. 5
      _nodesPosition(4);
    }

    node.selectAll('circle')
      .attr("cx", function(d) { return d.x; })
      .attr("cy", function(d) { return d.y; });
  } 

  var update = function() {
    console.log("update ING");
    
    _contract.apply(this) ;

    function _contract() {
      this
      .restart()
    }
  } 

  // set svg's size
  svg.attr('width',width).attr('height',height);
  simulation
    .force("collide",d3.forceCollide( function(d){return d.r + 8 }).iterations(16) )
    .force("charge", forceManyBody)
    .force("center", d3.forceCenter(width / 2, height / 2))
    .force("y", d3.forceY(0))
    .force("x", d3.forceX(0)) 
    .on("tick", ticked)
    .on("end", update)

  function _nodesPosition(optionNum){

    // Push nodes toward their designated focus.
    var index = F.toggle - 1;    

    if ( optionNum === 0 ){
      nodes.forEach(function(o, i) {
        var random = setRandom(); 
        o.y += (250 - o.y) * F.k + random;
        o.x += (450 - o.x) * F.k + random;
      });
    }else if ( optionNum === 2 ){
      nodes.forEach(function(o, i) {
        var random = setRandom(); 
        o.y += (forcePosition.two[o.question[index]].y - o.y) * F.k + random;
        o.x += (forcePosition.two[o.question[index]].x - o.x) * F.k + random;
      });
    }else if ( optionNum === 3 ){
      nodes.forEach(function(o, i) {
        var random = setRandom(); 
        o.y += (forcePosition.three[o.question[index]].y - o.y) * F.k + 100 + random;
        o.x += (forcePosition.three[o.question[index]].x - o.x) * F.k + 200 + random;
      });
    }else if ( optionNum === 4 ){
      nodes.forEach(function(o, i) {
        // 後面的參數是為了把數學式轉化過後平移掉的為移轉回來。
        var random = setRandom(); 
        o.y = forcePosition.four[o.question[index]].y + random;
        o.x += (forcePosition.four[o.question[index]].x - o.x) * F.k + random;
      });
    }

    setColor(F.toggle - 1) ;
  };
}

function setColor(questionNo){
  d3.selectAll(".circle").style("fill", function(d) {
    return color(d.question[questionNo]);
  }) 
}

function setRandom(){
  if (F.random){
    return Math.random() * 20 - 10 ;
  }
  else{
    return 0 ;
  }
}

function insertBall(dataNodes) {

  node.selectAll('circle')
    .data(nodes).enter()
    .append("circle")
    .attr("class", "circle")
    .attr("r", function(d){return d.r })
    .call(
      d3.drag()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended)
    );  

  function dragstarted(d) {
    if (!d3.event.active) 
      simulation.alphaTarget(0.3).restart();

    d.fx = d.x;
    d.fy = d.y;
  }
  
  function dragged(d) {
    d.fx = d3.event.x;
    d.fy = d3.event.y;
  }
  
  function dragended(d) {
    if (!d3.event.active)
      simulation.alphaTarget(0);

    d.fx = null;
    d.fy = null;
  } 

  // reset data nodes
  simulation
    .nodes(nodes)
    .alpha(1)
    // .alphaMin(0.05)
    .restart();
}




// //爆炸 => 還未用到
// function explosion() {
//     nodes.forEach(function(o, i) {
//         o.x += (Math.random() - .5) * 80;
//         o.y += (Math.random() - .5) * 100;
//     });
//     force.resume();
// }


// remove
// a.database().ref('1').remove();

// // update
// a.database().ref('1').update({
// 	email:"123459999"
// });

// // write
// function writeUserData(userId, name, email, imageUrl) {
//   a.database().ref('users').set({
//     username: name,
//     email: email,
//     profile_picture : imageUrl
//   });
// }