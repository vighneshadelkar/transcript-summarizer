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


