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
  var result = {};
  $('input:checked').each(function() {
    result[this.name] = this.value;
  });

  console.log(result);
	var ref = DB.database()
    .ref('/')
    .push()
    .set(result)
    .then(function() {
      console.log('sucuess');
    })
    .catch(function() {
      console.log('error');
    });

	//重新整理
  // window.location.reload();
}
