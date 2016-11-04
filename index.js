/*
 *@keypress:
 *  ` / ` : change F.toggle to change the state
 *  ` . ` : on/off ball shake!!
 */

'use strict' ;

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
  random: false,
  questionNum: 5,
  number: 0 
}

var count = [];
var nodes = [];
var svg = d3.select('#main').append('svg');
var node = svg.append("g").attr("class" , "nodes");
var simulation = d3.forceSimulation();
var forceManyBody = d3.forceManyBody().strength(F.strength);
var color = d3.scaleQuantize()
    .domain([0, 3])
    .range(["#D33948", "#4C5C68", "#E28413", "#74A57F"]);


// Firbase Ref
var ref = DB.database().ref('/');

initial();

ref.on('child_added', function(snapshot) {

  var person = snapshot.val();
  
  F.number ++ ;

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

  analysisCount(count , nodes[nodes.length-1].question);
  insertBall(nodes) ;
});

$('body').keypress(function(e) {
  // console.log(e.keyCode);
  if (e.keyCode === 47 || e.keyCode === 12581) {
    
    if ( F.toggle++ >= F.questionNum){
      F.toggle = 0;  // back to initial state
    }

    _setToggleText(F.toggle);
  }else if (e.keyCode === 46 || e.keyCode === 12577) {
    F.random = !F.random ;  // on / off shake!!
  } 

  function _setInfomationText(text1 , text2 , text3 ,text4){
    $('#item1').text(text1);
    $('#item2').text(text2);
    $('#item3').text(text3);
    $('#item4').text(text4);
  }

  function _setInfomationPercent(count){
    var allNumber = F.number ;
    var goodNum = [];

    $.each(count , function(index , value){
      if(value > 50)
        goodNum.push(index.substr(-1 , 1));
    })

    if (goodNum !== null ){
      goodNum.forEach(function(value , index){
        $('#item'+ value + "Percent").addClass('goodNum');
      })
    }

    $('#item1Percent').text(count.option1 + " / " + allNumber);
    $('#item2Percent').text(count.option2 + " / " + allNumber);
    $('#item3Percent').text(count.option3 + " / " + allNumber);
    $('#item4Percent').text(count.option4 + " / " + allNumber);
  }

  function _setToggleText(toggle){    
    $('.item > p').removeClass('goodNum');
    if ( toggle === 0 )
      _showTitle();
    else {
      var questionNo = toggle - 1;
      _setInfomationPercent(count[questionNo]);

      switch(toggle){
        case 1:
          _hiddenTitle();
          _setInfomationText('大一大二' , '大三大四' , '研究所以上' , '無');
          break ;
        case 2:
          _setInfomationText('沒聽過' , '有聽過' , '有用過' , '我靠他吃飯ㄉ哼')
          break ;
        case 3:
          _setInfomationText('Data Visulation' , 'AI(人工智慧)' , '海外公司經驗分享' , '雲端服務實作')
          break ;
        case 4:
          _setInfomationText('25% ↓' , '50%' , '75%' , '90% ↑')
          break ;
        case 5:
          _setInfomationText('25% ↓' , '50%' , '75%' , '90% ↑')
          break ;
        default:
          _setInfomationText('萬' , '聖' , '快' , '樂')
      }
    }
  }

});

function _hiddenTitle(){
  $('.title').addClass('disable');
  $('.informationBox').removeClass('disable');
}

function _showTitle(){
  $('.title').removeClass('disable');
  $('.informationBox').addClass('disable');
}

function initial(){

  var ticked = function() {
    if ( F.toggle === 0 ){
      _nodesPosition(0);
    }else if( F.toggle === 1 ){
      _nodesPosition(3);
    }else{
      // F.toggle = 2 . 3. 4. 5
      _nodesPosition(4);
    }

    node.selectAll('circle')
      .attr("cx", function(d) { return d.x; })
      .attr("cy", function(d) { return d.y; });
  } 

  var update = function() {
    this.restart();
  } 

  // initial svg
  svg.attr('width',width).attr('height',height);

  simulation
    .force("collide",d3.forceCollide( function(d){return d.r + 8 }).iterations(16) )
    .force("charge", forceManyBody)
    .force("center", d3.forceCenter(width / 2, height / 2))
    .force("y", d3.forceY(0))
    .force("x", d3.forceX(0)) 
    .on("tick", ticked)
    .on("end", update)

  // setCount Array , when child input , we can compute
  setCount(count);

  // Push nodes toward their designated focus.
  function _nodesPosition(optionNum){
    var random ;
    var index = F.toggle - 1;    

    if ( optionNum === 0 ){
      nodes.forEach(function(o, i) {
        random = setRandom(); 
        o.y += (250 - o.y) * F.k + random;
        o.x += (450 - o.x) * F.k + random;
      });
    }else if ( optionNum === 2 ){
      nodes.forEach(function(o, i) {
        random = setRandom(); 
        o.y += (forcePosition.two[o.question[index]].y - o.y) * F.k + random;
        o.x += (forcePosition.two[o.question[index]].x - o.x) * F.k + random;
      });
    }else if ( optionNum === 3 ){
      nodes.forEach(function(o, i) {
        random = setRandom(); 
        o.y += (forcePosition.three[o.question[index]].y - o.y) * F.k + 20 + random;
        o.x += (forcePosition.three[o.question[index]].x - o.x) * F.k - 50 + random;
      });
    }else if ( optionNum === 4 ){
      nodes.forEach(function(o, i) {
        random = setRandom(); 
        o.y = forcePosition.four[o.question[index]].y + random;
        o.x += (forcePosition.four[o.question[index]].x - o.x) * F.k + random;
      });
    }

    // setting color
    setColor(F.toggle - 1) ;
  };
}


function setColor(questionNo){
  d3.selectAll(".circle").style("fill", function(d) {
    return color(d.question[ questionNo ]);
  }) 
}

function setRandom(){
  // -10 ~ 10
  return F.random ? Math.random() * 20 - 10 : 0 ;
}

function setCount(array){
  for (var i = 0 ; i < F.questionNum ; i++){
    array.push({
      option1:0,
      option2:0,
      option3:0,
      option4:0
    })
  }
}

function analysisCount(countArray , analysisArray){
  analysisArray.forEach(function(value , index){
    switch(value){
      case "0" :
        countArray[index].option1++;
        break ;
      case "1" :
        countArray[index].option2++;
        break ;
      case "2" :
        countArray[index].option3++;
        break ;
      case "3" :
        countArray[index].option4++;
        break ;
      default:
        console.log("怎麼會！！ 沒算到！？");
    }
  })

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
    .restart();
}