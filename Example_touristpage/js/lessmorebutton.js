
console.log("Denne teksten kom fram");
//Old code
// function myFunction() {
//     var x = document.getElementById("merMindre");
//     if (x.style.display == "none") {
//         x.style.display = "block";
//     } else {
//         x.style.display = "none";
//     }
// }

//Code by Phuong (+plus Ingvild)
function changeStyle() {
  var x = document.getElementById('merMindre');
  if (x.style.display === "block") {
      x.style.display = "none";
  } else {
      x.style.display = "block";
  }
}
