const btn = document.getElementById("summary");
btn.addEventListener("click", function() {
    btn.disabled = true;
    btn.innerHTML = "Summarising...";
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
            console.log("I was def here");
            console.log(data);
            const p = document.getElementById("summedtxt");
            p.innerHTML = data;
            btn.disabled = false;
            btn.innerHTML = "Summarise";
        });
    });
});

let loader=document.getElementById("lds-spinner");
let txt=document.getElementById("summedtxt");

let txtVal=txt.innerText;

console.log(txtVal);

if(txtVal!="")
{
    loader.style.display="none";
}

