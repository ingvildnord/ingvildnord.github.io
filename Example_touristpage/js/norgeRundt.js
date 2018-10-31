
document.addEventListener('DOMContentLoaded', function() { //Kjører når dokumentet åpnes
  lastData();
}, false);

//Laster ned ressursen URL-en refererer til
function getURL(url) {
  var promise = new Promise(function(resolve, reject) {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", url);
    xhr.onreadystatechange = function() {
      if (xhr.readyState == 4)
      {
        if(xhr.status == 200){
          if(xhr.getResponseHeader("Content-Type").includes("application/json")) //Sjekker om JSON
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

//Globale variabler
var liste;
var fullListe;
var navn;

//Laster ned og tolker datasettet
function lastData() {
  var url;
  var window_location = window.location.href;
  var pathname = new RegExp(/toilets/);
  var otherpathname = new RegExp(/norgeRundt/);

  url = "https://hotell.difi.no/api/json/nrk/norge-rundt";
  navn = "tittel";

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


  //Oppretter et søkeobjekt med verdiene fra inputfeltene på norgeRundt.html
  function createSearchObject() {
    var searchObject = {};

    var tittel = capitalizeFirstLetter(document.getElementById("tittel").value);
    var aar = capitalizeFirstLetter(document.getElementById("aar").value);
    var kommune =capitalizeFirstLetter(document.getElementById("kommune").value);

    if (aar){
      searchObject.aar = aar};
      if (tittel){
        searchObject.tittel = tittel};
        if (kommune){
          searchObject.kommune = kommune};
          return searchObject
        };

//Transformer input String
function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}
/************************SØK IMPLEMENTASJON*********************************/

function searchEntries() {


  var searchObject = createSearchObject();
  var searchResults  = [];
  var searchParams = Object.keys(searchObject);


  var i, y;

  for(i=0; i <fullListe.entries.length; i++) {
    var truthChecker = []; //Vil inneholde boolean verdien "true" for hvert param som er sjekket
    for(y=0; y < searchParams.length; y++) {
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
    ol.removeChild(ol.firstChild)};
    liste['entries'] = searchResults.slice(); //Legger søkeresultatet inn i listen
    brukData(liste); //Oppdaterer listen på toilets.html til å vise søkeresultatet
  }
