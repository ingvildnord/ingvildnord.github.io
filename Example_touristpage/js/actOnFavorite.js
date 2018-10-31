/*OPPGAVE 7, 8 og 9*/

document.addEventListener('DOMContentLoaded', function() {
    init();
}, false);

function init() {
  getToalettListe();
  lastSelectInnhold();
}

function getURL(url) {
  var promise = new Promise(function(resolve, reject) {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", url);
    xhr.onreadystatechange = function() {
      if (xhr.readyState == 4)
      {
        if(xhr.status == 200){
          if(xhr.getResponseHeader("Content-Type").includes("application/json"))
          {
            resolve(JSON.parse(xhr.responseText));
          } else {
            reject(null);
          }
        }
      }
    };
    xhr.send();
  });
  return promise;
}

var globalToalettListe;

function getToalettListe() {
  var doListe;
  var doPromise;
  var doNavn = "plassering";

  var doPromise = getURL("https://hotell.difi.no/api/json/bergen/dokart");
  doPromise.then(
    function(response) {
      globalToalettListe = response;
    })
    .catch(
      function(reason) {
        alert("FEIL: " + reason);
      }
    );
}

var globalLekeListe;

function lastSelectInnhold() {
  var plass = "navn";
  var lekePromise = getURL("https://hotell.difi.no/api/json/bergen/lekeplasser");
  lekePromise.then(
    function(response) {
      var lekeListe = response;
      globalLekeListe = response;

      lagSelectInnhold(lekeListe);
    })
    .catch(
      function(reason) {
        alert("FEIL: " + reason);
      }
    );
}


/****************************Oppgave 7*****************************************/
function calcDistance(c1, c2) {
  return (google.maps.geometry.spherical.computeDistanceBetween(c1, c2) / 1000).toFixed(2);
}

/****************************Oppgave 8*****************************************/

function lagSelectInnhold(listen) {
  var i;

  for (i = 0; i < listen.entries.length; i++){
    //Find verdi i array
    var navnPass = (listen.entries[i]["navn"]);

    //Generer option tag til dokument
    var option = document.createElement("option");
    option.setAttribute("value", navnPass);

    //Sett arrayverdi inn i option tag.
    var passes = document.createTextNode(navnPass);
    option.appendChild(passes);

    //Sett inn ny option til select-parent.
    document.getElementById("selectList").appendChild(option);
  }
}

function merkFavoritt() {
  var selection = document.getElementById("selectList");
  var x = selection.options[selection.selectedIndex].value;
  document.getElementById("favoritt").innerHTML = "Din favorittlekeplass er: " + x;
}


/*
Henter uthevet verdi fra select-felt fra html.
*/
function getFavoritt() {
  var selection = document.getElementById("selectList");

  //Hent navnet til valgt enhent.
  //var valgtOption = selection.options[selection.selectedIndex].text;
  //Kan ikke returnere tekstverdi - bruker attribute verdi
  var valgOptionIndex = selection.options[selection.selectedIndex].value;

  //Finner objekt-entry som samsvarer.
  var i;
  var listeParse = globalLekeListe;
  for(i = 0; i < listeParse.entries.length; i++) {

    if (listeParse.entries[i].navn === valgOptionIndex) {
      //Opprett posisjon.
      var lat = parseFloat(listeParse.entries[i].latitude);
      var lng = parseFloat( listeParse.entries[i].longitude);

      var googleVal = new google.maps.LatLng(lat, lng);
      return googleVal;
    }
  }
}
/*****************************Oppgave 9****************************************/
function findClosest() {
  merkFavoritt();

  var currClosest = 999.99;
  var currClosestElem = null;
  var favoritt = getFavoritt();

  var i;
  var listeParse = globalToalettListe;
  for(i = 0; i < listeParse.entries.length; i++) {

    var latDo = parseFloat(listeParse.entries[i].latitude);
    var lngDO = parseFloat(listeParse.entries[i].longitude);
    var googleVal = new google.maps.LatLng(latDo, lngDO);

    var distanse = parseFloat(calcDistance(favoritt, googleVal));

    if (distanse < currClosest ) {
      currClosest = distanse;
      currClosestElem = listeParse.entries[i];
    }
  }
  //return currClosestElem;
  insertResult(currClosestElem, currClosest);
}

function insertResult(currClosestElem, currClosest) {
  //var plass = currClosestElem.plassering;
  document.getElementById("closest").innerHTML =
  "Nærmeste toalett er: " + currClosestElem.plassering +
   " , med en distanse på: " + currClosest + " km.";
}
