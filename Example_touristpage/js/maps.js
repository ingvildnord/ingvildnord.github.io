
document.addEventListener('DOMContentLoaded', function() { //Kjører når dokumentet åpnes
  lastData();
}, false);

/**************************OPPGAVE 2*******************************************/
//Laster ned ressursen URL-en refererer til
function getURL(url) {
  var promise = new Promise(function(resolve, reject) {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", url);
    xhr.onreadystatechange = function() {
      if (xhr.readyState == 4)
      {
        if(xhr.status == 200){
          if(xhr.getResponseHeader("Content-Type").includes("application/json")) //sjekker om JSON
          {
            resolve(JSON.parse(xhr.responseText)); //Lager JSON objekter
          } else {
            reject(null); //Svarer med null hvis ikke JSON
          }
        }
      }
    };
    xhr.send();
  });

  return promise;
}

/****************************OPPGAVE 3*****************************************/

//Globale variabler
var liste;
var fullListe;
var navn;

//Laster ned og tolker datasettet
function lastData() {
  var url;
  var window_location = window.location.href;
  var pathname = new RegExp(/toilets/);
  var otherpathname = new RegExp(/playgrounds/);

  //Laster ned datasettet som korrelerer med nettsiden du er på
  if ( pathname.test(window_location)){
    url = "https://hotell.difi.no/api/json/bergen/dokart";
    navn = "plassering";
  }
  else if (otherpathname.test(window_location))  {
    url = "https://hotell.difi.no/api/json/bergen/lekeplasser";
    navn = "navn";
  }
  promise = getURL(url);
  promise.then(
    function(response) {
      liste = response;
      fullListe = liste;
      brukData(liste); //Lager ol liste
    })
    .catch(
      function(reason) {
        alert("FEIL: " + reason);
      }
    );
}


  /****************************OPPGAVE 4 OG 6************************************/
  //Legger inn verdier til ol list
  function brukData(liste)
  {
    var i;
    for ( i = 0; i <liste.entries.length; i++){
      var navnt = (liste.entries[i][navn]);
      var a = document.createElement("LI");
      var t = document.createTextNode(navnt);
      a.appendChild(t);
      document.getElementById("arrayListen").appendChild(a);
    }
  }

  //Initialiserer Google Maps
  function initMap() {
    var bergen1 = {lat: 60.390918, lng: 5.319520};
    var bergen2 = {lat: 60.391, lng: 5.32};

    var map = new google.maps.Map(document.getElementById('map'), {
      zoom: 14,
      center: bergen1
    });

    var myLtLg = new google.maps.LatLng(0,0);

    var i;

    setTimeout( function() {
      for (i = 0; i < liste.entries.length; i++) {
        num = i;
        addMarker(liste.entries[num], map);
      }
    }, 200);

  }

  var num;

  //Legger til markører i kartet
  function addMarker(props, map) {
    var marker = new google.maps.Marker({
      position:{lat: parseFloat(props.latitude),lng:parseFloat(props.longitude)},
      label:num.toString(),
      map: map
    });
  }

  /****************************OPPGAVE 5*****************************************/

  //Hurtigsøk - genererer et searchObject etter regex treff
  function simpleSearchObject() {
    var felt = document.getElementById("feltInput").value;

    var parseGlobal = liste;
    var searchObject = {};

    var addresseMatch = new RegExp(/addresse:\s*(Lungegårdskaien|Østre\s* Strømkai|Strømgaten\s*(4|8)|Strandkaien\s*[3]?|Kaigaten\*s 4|Torgallmenningen\*s (8|14)|Småstrandgaten\s* 3|Strandgaten\s* 13 -15|Jacobsfjorden, bryggen|(C\.\s* Sundts gt))/i);
    var toalettMatch = new RegExp(/navn:\s*(NONNESETER TERMINAL,\s* SØR|NONNESETER TERMINAL,\s* NORD|SKYSS\s* KUNDESENTER|JERNBANESTASJONEN|MATHALLEN|STRANDKAITERMINALEN|BERGEN\s*KOMMUNE|BERGEN\s*\*STORSENTER|SUNDT \s*MOTEHUS|XHIBITION|GALLERIET|KLØVERHUSET|BRYGGEN\s*BESØKSSENTER|C\.\s*SUNDTSGT)/i);
    var tidMatch = new RegExp(/tid:\s*([0-9]{3}-[0-9]{3})/i);
    var openMatch = new RegExp(/åpent nå:\s*(ja)/i);
    var kjonnMatch = new RegExp(/kjønn:\s*(herre|dame)/i);
    var prisMatch = new RegExp(/pris:\s*[0-9]{1,5}/i);
    var gratisMatch = new RegExp(/gratis:\s*(ja)/i);
    var stelleMatch = new RegExp(/stellerom:\s*(ja)/i);
    var rulleMatch = new RegExp(/rullestol:\s*(ja)/i);
    var regNummer = new RegExp(/[0-9]{1,5}/);
    var regHerre = new RegExp(/herre/i);
    var regDame = new RegExp(/dame/i);

    if ( addresseMatch.test(felt) == true) {
      var extract = felt.match(addresseMatch)[1];
      var res = extract.replace(/\s/g, "");
      searchObject.addresse = res;
    }
    if ( toalettMatch.test(felt) == true) {
      var extract = felt.match(toalettMatch)[1];
      var res = extract.toUpperCase();
      searchObject.plassering = res;
    }
    if ( tidMatch.test(felt) == true) { searchObject.pris = 0; }

    if ( openMatch.test(felt) == true) { searchObject.aapent = 0; }

    if ( kjonnMatch.test(felt) == true && regHerre.test(felt)) {
      searchObject.herre = 1;;
    } else if (regDame.test(felt)) {
      searchObject.dame = 1;
    }
    if ( prisMatch.test(felt) == true) {
      var extract = felt.match(prisMatch)
      var price = (felt.match(regNummer));
      searchObject.pris = price;
    }
    if ( gratisMatch.test(felt) == true) { searchObject.pris = 0; }
    if ( stelleMatch.test(felt) == true) { searchObject.stellerom = 1; }
    if ( rulleMatch.test(felt) == true) { searchObject.rullestol = 1; }
    return searchObject;
  }

  //Avansert søk - lager searchObject etter treff fra sjekkboksene
  function createSearchObject() {
    var searchObject = {};

    var herre = document.getElementById("herre").checked;
    var dame = document.getElementById("dame").checked;
    var rullestol = document.getElementById("rullestol").checked;
    var stellerom = document.getElementById("stellerom").checked;
    var gratis = document.getElementById("gratis").checked
    var aapentA = document.getElementById("aapent").checked;
    var aapentKlokkeslett = document.getElementById("aapentKlokkeslett").value;
    var maxPris = document.getElementById("maxPris").value;


    if (herre) {
      searchObject.herre = 1};
    if (dame) {
      searchObject.dame = 1};
    if (rullestol) {
      searchObject.rullestol = 1};
    if (stellerom) {
      searchObject.stellerom = 1};
    if (gratis) {
      searchObject.pris = 0};
    if (aapentA) {
      var currentTime = new Date();
      searchObject.aapent = "tid_ " + currentTime.getHours() + " " + currentTime.getMinutes()};
    if (maxPris){
      searchObject.pris = maxPris};
    if (aapentKlokkeslett){
      searchObject.aapentKlokkeslett = aapentKlokkeslett};
    return searchObject
};

/*Endrer verdien på pris i listen til å være lik maxPris
hvis maxPris er større eller lik prisen i listen*/
function endreListe() {
  var searchObject = createSearchObject();
  for(i=0; i <fullListe.entries.length; i++) {
    if (parseInt(searchObject.pris) >= (parseInt(fullListe.entries[i].pris))) {
      fullListe.entries[i].pris = searchObject.pris;
    }
  }
}

/************************SØK IMPLEMENTASJON NY*********************************/

//AVANSERT SØK MED IMPLEMENTASJON FOR SIMPLESEARCHOBJECT
function searchToilets(key) {
  var checkTime;

  //Sjekker hvilken knapp som kalte og hvilken objekt som skal brukes
  var searchObject;
  if (key == "advanced") {
    searchObject = createSearchObject();
  } else if (key == "simple") {
    searchObject = simpleSearchObject();
  }

  var time = parseInt(searchObject.aapentKlokkeslett);
  if (searchObject.aapentKlokkeslett){
    checkTime = true;
  }

  if (searchObject.pris){ //Kjører endreListe() hvis maxPris eksisterer
    endreListe();
  };
  var searchResults  = [];
  var searchParams = Object.keys(searchObject);

  var i, y;

  for(i=0; i <fullListe.entries.length; i++) {
    var truthChecker = []; //Vil inneholde boolean verdien "true" for hvert param som er sjekket
    for(y=0; y < searchParams.length; y++) {
      if(searchParams[y].includes("aapentA")) {
        if(openNow(maketimeInts(fullListe)[0][i],maketimeInts(fullListe)[1][i],maketimeInts(fullListe)[2][i],maketimeInts(fullListe)[3][i])){
          truthChecker.push(true);
        }
        if (fullListe.entries[i].tid_hverdag == "ALL"){
          truthChecker.push(true);
        }
      }
      if(checkTime){

      if (open(maketimeInts(fullListe)[0][i],maketimeInts(fullListe)[2][i], time)){
        truthChecker.push(true);
      }
      if (fullListe.entries[i].tid_hverdag == "ALL"){
        truthChecker.push(true);
      }
    }
      if(fullListe.entries[i][searchParams[y]] == searchObject[searchParams[y]]) {
        truthChecker.push(true);
      }
      if(truthChecker.length == searchParams.length) { //Hvis alle params er sanne legges toalettet til listen
        searchResults.push(fullListe.entries[i]);
      }
    }
  }
    liste = {};
    var ol = document.getElementById("arrayListen");
    while (ol.firstChild) { //Fjerner alle elementene i listen på toilets.html
      ol.removeChild(ol.firstChild)
    };

      liste['entries'] = searchResults.slice(); //Legger søkeresultatet inn i listen
      brukData(liste); //Oppdaterer listen på toilets.html til å vise søkeresultatet
      initMap(); //Oppdaterer kartmarkørene
  }


    //Lager fire lister ut av klokkeslettene
    function maketimeInts(liste) {
      var timeList = [];
      var timeList1 = [];
      var openingList = [];
      var openingList1 = [];
      var closingList = [];
      var closingList1 = [];
      var hourOpen = [];
      var minuteOpen = [];
      var hourClose = [];
      var minuteClose = [];

      for (var i = 0; i <liste.entries.length; i++){
        timeList.push(liste.entries[i].tid_hverdag);
        if (timeList[i] != "ALL"){
          timeList1.push(timeList[i].split(" - "));
        }
      }
      for(var y = 0; y < timeList1.length; y++){
        openingList.push(timeList1[y][0]);
        openingList1.push(openingList[y].split("."));
        closingList.push(timeList1[y][1]);
        closingList1.push(closingList[y].split("."));
        hourOpen.push(parseInt(openingList1[y][0]));
        minuteOpen.push(parseInt(openingList1[y][1]));
        hourClose.push(parseInt(closingList1[y][0]));
        minuteClose.push(parseInt(closingList1[y][1]));
      }
      return[hourOpen, minuteOpen, hourClose,minuteClose];

    }

    //Sjekker om toalett er åpent nå
    function openNow(openHour,openMin,closeHour,closeMin) {
      var currentTime = new Date();
      var openMinuteCheck = false, openHourCheck = false, closeMinuteCheck = false, closeHourCheck = false;

      if (currentTime.getHours() > openHour){
        openHourCheck = true;
        openMinuteCheck = true;
      }
      else if (currentTime.getHours() == openHour){
        openHourCheck = true;
        if (currentTime.getMinutes() >= openMin){
          openMinuteCheck = true;
        }
      }
      if (currentTime.getHours() < closeHour){
        closeHourCheck = true;
        closeMinuteCheck = true;
      }
      else if (currentTime.getHours() == closeHour){
        closeHourCheck = true;
        if (currentTime.getMinutes() <= openMin){
          closeMinuteCheck = true;
        }
      }
      if (openMinuteCheck && openHourCheck && closeMinuteCheck && closeHourCheck){
        return true;
      }
      return false;
    }

    //Søker om en gitt time er innenfor åpningstid
    function open(openHour,closeHour, inputHour){
      var openHourCheck = false, closeHourCheck = false;
      //console.log(currentTime.getMinutes())

      if (inputHour >= openHour){
        openHourCheck = true;
      }

      if (inputHour <= closeHour){
        closeHourCheck = true;
      }
      //console.log(openMinuteCheck +" "+ openHourCheck);
      if (openHourCheck == true && closeHourCheck == true){
        return true;
      }
      return false;
    }
