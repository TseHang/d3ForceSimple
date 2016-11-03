$('#submit').click(function(){
	submit();
})

function submit(){
	/*
		choose a --> 1
		choose b --> 2
		choose c --> 3
		choose d --> 4
	*/
	var q1 = $('#q1').val();
	var q2 = $('#q2').val();
	var q3 = $('#q3').val();
	var q4 = $('#q4').val();
	var q5 = $('#q5').val();

	$('#text').text(q1 +" : "+ q2 + " : " +q3 +" : "+ q4 + " : "+ q5)

	var ref = DB.database().ref('/').push().set({
    q1: q1,
    q2: q2,
    q3: q3,
    q4: q4,
    q5: q5
  });
	console.log(ref);

	//重新整理
  // window.location.reload();
}