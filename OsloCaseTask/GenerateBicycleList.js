
//Simple check that js runs
console.log("hello world");


document.addEventListener('DOMContentLoaded', function() { //Kjører når dokumentet åpnes
    expu2();
  }, false);
  
//Variant 1
function expu1() {

    var url = "https://oslobysykkel.no/api/v1";
    var key = "fdd3b469a2ef1e7c79883d068865ddb2";

    var promise = new Promise(function(resolve, reject) {
      var xhr = new XMLHttpRequest();
      xhr.open("GET", url, true);
      xhr.onreadystatechange = function() {
        if (xhr.readyState == 4 && xhr.status == 200) {

            if(xhr.getResponseHeader("Content-Type").includes("application/json")) {
                  resolve(JSON.parse(xhr.responseText));
                } else {
                  reject(null); 
                }
        }
      };
      xhr.setRequestHeader("Client-Identifier", key);
      xhr.send();
    });

    return promise;
  }

//Variant 2
function expu2() {
    var key = "fdd3b469a2ef1e7c79883d068865ddb2";

    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            //experiment check if json is pasted
            document.getElementById("content").innerHTML = this.responseText;
        }
    };
    xhr.open("GET", "https://oslobysykkel.no/api/v1", true);
    xhr.setRequestHeader("Client-Identifier", key);
    xhr.send();
}
  