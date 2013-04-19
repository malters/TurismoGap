$("#frmLogin").validate({
    submitHandler: function( form ) {
		var selec=$("#tiposEventoSelect").val();
		var fechaInicio=$("#fechaInicio").val();
		var fechaFin=$("#fechaFin").val();
		alert("HOLA");
		getEventos(selec,fechaInicio,fechaFin);
    }
});
function getTiposEventos(){
	$.ajax({
	type: "POST",
	contentType: "application/json; charset=utf-8",
	dataType: "json",
	url:"http://localhost:8080/WSTurismoDigital/rest/turismoDigital/getTipoEventos?idioma=es",
	data: '{}',
	success: function(msg) {	
		
		$.each(msg, function (i, theItem) {
			$('#tiposEventoSelect').append('<option value='+parseInt(theItem.id)+'>'+theItem.nombre.toString()	+'</option>');
	});
	$('#tiposEventoSelect').listview("refresh");
  	},
  	error: function(msg) {
    	alert("FAILED : " + msg.status + ' ' + msg.statusText);
  }
});
}
function getEventos(tipoEvento,fechaInicio,fechaFin){
$.ajax({
type: "POST",
contentType: "application/json; charset=utf-8",
dataType: "json",
  url: "http://localhost:8080/WSTurismoDigital/rest/turismoDigital/getEventos?idioma=es",
  data: '{}',
  success: function(msg) {	
  var listview;
  var parent = document.getElementById('listview');	
  $('#listview').empty();
	$.each(msg, function (i, theItem) {


		var startDateString = theItem.fechaInicio.toString();
		var endDateString = theItem.fechaFin.toString();
		var location = theItem.localizacion.toString();
        var nombre = encodeURIComponent(theItem.nombre.toString());
		var descripcion = encodeURIComponent(theItem.descripcion.toString());
		var horario = encodeURIComponent(theItem.horarios.toString());
		var precio = encodeURIComponent(theItem.precios.toString());
		var infoExtra = encodeURIComponent(theItem.infoExtra.toString());
		var coordenadas = theItem.puntoInteresCoordenadas.toString().split(',');
		coordenadasX = coordenadas[0];
		coordenadasY = coordenadas[1];

        var listdiv = document.createElement('li');
        listdiv.setAttribute('id','listdiv');
        listdiv.setAttribute('data-role','list-divider');
        listdiv.innerHTML = startDateString;	
		parent.appendChild(listdiv);
		var listItem = document.createElement('li');
        listItem.innerHTML = '<a data-index="' + i + '" onClick=viewDetails('+i+',"'+startDateString+'","'+endDateString+'","'+nombre+'","'+descripcion+'","'+horario+'","'+precio+'","'+infoExtra+'","'+coordenadasX+'","'+coordenadasY+'") > <h2>'+theItem.nombre.toString()+'</h2><p><strong>'+location+'</strong></p><a data-role="button" data-mini="true" href="#" onClick=calendarCall("'+startDateString+'","'+endDateString+'","'+nombre+'","'+location+'") data-icon="plus">Añadir a calendario</a></a>';
		parent.appendChild(listItem);
	 });
  var list = document.getElementById('listview');
  $(list).listview("refresh");
  var  $toPage = $('#eventos');
    $.mobile.changePage($toPage);
  },
  error: function(msg) {
    alert("FAILED : " + msg.status + ' ' + msg.statusText);
  }
});
}
function calendarCall(start,end,title,location){
	var notes="";
	var dateParts = start.split("/");
    var startDate = new Date(dateParts[2], (dateParts[1] - 1), dateParts[0]);
    dateParts = end.split("/");
    var endDate = new Date(dateParts[2], (dateParts[1] - 1), dateParts[0]);   
    var titleString=decodeURIComponent(title);
    
	var success = function() { alert("Evento a�adido correctamente"); };
	var error = function(message) { alert("Error:No se ha a�adido el evento"); };
	window.plugins.calendarPlugin.createEvent(titleString,location,notes,startDate,endDate, success, error);
}
function viewDetails(index,fechaInicio,fechaFin,titulo,descripcion,horario,precio,infoExtra,coordenadasX,coordenadasY){
	    var  $toPage = $('#details_' + index);
		    //stop the browser from scrolling to the top of the page due to the hash mark (#) in the link's href attribute
    event.preventDefault();

    //check to see if the page for the link clicked already exists, if so then don't re-add it to the DOM
    if ($toPage.length === 0) {
        //no page was found so create one, we can access the photos object to insert data related to the link clicked
        $('body').append('<div data-role="page" id="details_' + index + '"><div data-role="content"><ul data-role="listview" data-inset="true"><li data-role="list-divider">' + fechaInicio + '&nbsp;al &nbsp;'+ fechaFin +'</li><li><h2>' + decodeURIComponent(titulo) + '</h2><p style="white-space:normal;"><strong>' + decodeURIComponent(descripcion) + '</strong><br><br></p><p>Horario: ' + decodeURIComponent(horario) + '</p><p class="ui-li-aside"><strong> Precio: ' + decodeURIComponent(precio) + '</strong></p><p>' + decodeURIComponent(infoExtra) + '<br><br></p><p align="center"><img src="http://maps.googleapis.com/maps/api/staticmap?center=' + coordenadasY + ',' + coordenadasX + '&zoom=15&size=300x300&markers=color:red%7Clabel:A%7C' + coordenadasY + ',' + coordenadasX +'&maptype=roadmap18&sensor=false"></p><p><a data-role="button" href="#eventos">Volver</a></p></li></ul></div></div>');
        
        //set the $toPage variable to the newly added page so jQuery Mobile can navigate to it
        $toPage = $('#details_' + index);
    }
    
    //change to the desired page
    $.mobile.changePage($toPage);
}