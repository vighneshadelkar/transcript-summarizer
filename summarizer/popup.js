
const btn = document.getElementById("summary");
const txt=document.getElementById("txt");
let loadParent=document.getElementById("loading");

const slider = document.getElementById("mySlider");
const output = document.getElementById("sliderValue");

var v_id;

// Display the default slider value
output.innerHTML = slider.value;

// Update the current slider value (each time you drag the slider handle)
slider.oninput = function() {
    output.innerHTML = this.value;
    //sendSliderValueToFlask(this.value);
  }

btn.addEventListener("click", function() {
    const q = document.getElementById("summedtxt");
    q.innerHTML = "";
    btn.disabled = true;

    //JS to add loader to screen
    let loader=document.createElement("div");
    loader.setAttribute("id","lds-spinner");
    loader.innerHTML=`<div></div>
    <div></div>
    <div></div>
    <div></div>
    <div></div>
    <div></div>
    <div></div>
    <div></div>
    <div></div>
    <div></div>
    <div></div>
    <div></div>`;
    btn.style.width="120px";

    btn.innerHTML = "Summarising...";
    txt.innerHTML="Your summary is getting ready..";
    loadParent.appendChild(loader);
    console.log("I was here");
    chrome.tabs.query({currentWindow: true, active: true}, function(tabs){
        console.log(tabs);
        var url = tabs[0].url;
        v_id = url;
        console.log(url);

        var noturl = "http://127.0.0.1:5000/summary?url=" + url + "$" + output.innerHTML;
        console.log(noturl);
        fetch(noturl) 
        .then((response) => response.text())
        .then((data) => {
            loadParent.removeChild(loader);
            txt.innerHTML="Your summary ready..";
            console.log("I was def here");
            console.log(data);
            const p = document.getElementById("summedtxt");
            p.innerHTML = data;
            btn.disabled = false;
            txt.innerHTML="Press Summarise to get the Summary.";
            btn.innerHTML = "Summarise";
        });
    });
});





// to add copy functionality
const btncopy = document.getElementById("copytext");
const btnicon = document.getElementById("copyicon");

btncopy.onclick = function () {
    navigator.clipboard.writeText(document.getElementById("summedtxt").innerHTML);
    btncopy.innerHTML="Copied!";
    btncopy.style.left="22.14rem";
    setTimeout(() => {
        btncopy.innerHTML="Copy";
        btncopy.style.left="22.5rem";
    }, 1000);
};

btnicon.onclick = function () {
    navigator.clipboard.writeText(document.getElementById("summedtxt").innerHTML);
    btncopy.innerHTML="Copied!";
    btncopy.style.left="22.14rem";
    setTimeout(() => {
        btncopy.innerHTML="Copy";
        btncopy.style.left="22.5rem";
    }, 1000);
};

const shrdown=document.getElementById("shrdown");
const shrup=document.getElementById("shrup");
const email=document.getElementById("email");

shrdown.onclick=function () {
  shrdown.style.display="none";
  shrup.style.display="inline"
  email.style.display="block"
}
shrup.onclick=function () {
  shrdown.style.display="inline";
  shrup.style.display="none"
  email.style.display="none"
}
const btnmic=document.getElementById("speechtxt");
btnmic.onclick=function () {
    btnmic.innerHTML="Listening..";
    btnmic.style.left="21.9rem";
    btncopy.style.left="20.9rem";
    btnicon.style.left="23.36rem";
    setTimeout(() => {
        btncopy.style.left="22.5rem";
        btnicon.style.left="24.96rem";
        btnmic.innerHTML="Listen";
        btnmic.style.left="22.5rem";
    }, 3000);
}


const btnshr=document.getElementById("btnshr");
const summedtxt=document.getElementById("summedtxt");
const alert=document.getElementById("alert");

var t1=0;
btnshr.onclick=function () {
  // btnshr.style.display="none";
  t1=0;
  if (summedtxt.innerHTML=="") {
      alert.style.display="block";
      alert.innerHTML='Summary not generated yet!';
      t1++;
  }
  else if (document.getElementById("mailbox").value=='') {
      alert.style.display="block";
      alert.innerHTML='Please enter your email id!';
      t1++;
  }
  else {
    var email_id=document.getElementById("mailbox").value; 
    console.log(email_id);
    fetch("http://127.0.0.1:5000/mail", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            id: v_id,
            mail_id: email_id,
            body: summedtxt.innerHTML
        })            
    })
    .then(data => console.log(data))
    document.getElementById("mailbox").value='';
    alert.style.display="block";
    alert.innerHTML='Mail sent!';
    t1++;
  }
  if (t1>0) {
    setTimeout(() => {
      alert.style.display="none";
    }, 5000);
  }
}
/*
function sendSliderValueToFlask(value) {
  fetch('/slider', {
    method: 'POST',
    body: JSON.stringify({ value: value }),
    headers: {
      'Content-Type': 'application/json'
    }
  })
  .then(response => {
    console.log(response);
  })
  .catch(error => {
    console.error(error);
  });
}
*/

const btn = document.getElementById("summary");
const txt=document.getElementById("txt");
let loadParent=document.getElementById("loading");

btn.addEventListener("click", function() {
    btn.disabled = true;

    //JS to add loader to screen
    let loader=document.createElement("div");
    loader.setAttribute("id","lds-spinner");
    loader.innerHTML=`<div></div>
    <div></div>
    <div></div>
    <div></div>
    <div></div>
    <div></div>
    <div></div>
    <div></div>
    <div></div>
    <div></div>
    <div></div>
    <div></div>`;
    btn.style.width="100px";

    btn.innerHTML = "Summarising...";
    txt.innerHTML="Your summary is getting ready..";
    loadParent.appendChild(loader);
    console.log("I was here");
    chrome.tabs.query({currentWindow: true, active: true}, function(tabs){
        console.log(tabs);
        var url = tabs[0].url;
        console.log(url);

        var noturl = "http://127.0.0.1:5000/summary?url=" + url;
        console.log(noturl);
        fetch(noturl) 
        .then((response) => response.text())
        .then((data) => {
            loadParent.removeChild(loader);
            txt.innerHTML="Your summary ready..";
            console.log("I was def here");
            console.log(data);
            const p = document.getElementById("summedtxt");
            p.innerHTML = data;
            btn.disabled = false;
            txt.innerHTML="Press Summarise to get the Summary.";
            btn.innerHTML = "Summarise";
        });
    });
});

// to add copy functionality

const content = document.getElementById("summedtxt").innerHTML;
const btncopy = document.getElementById("copytext");
const btnicon=document.getElementById("copyicon");

btncopy.onclick = function () {
    navigator.clipboard.writeText(content);
    btncopy.innerHTML="Copied!";
    btncopy.style.left="26.8rem";
    setTimeout(() => {
        btncopy.innerHTML="Copy";
        btncopy.style.left="27.16rem";
    }, 3000);
};

btnicon.onclick = function () {
    navigator.clipboard.writeText(content);
    btncopy.innerHTML="Copied!";
    btncopy.style.left="26.8rem";
    setTimeout(() => {
        btncopy.innerHTML="Copy";
        btncopy.style.left="27.16rem";
    }, 3000);
};


