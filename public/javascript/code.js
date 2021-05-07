document.getElementById("ContentTableCloseBut").onclick=function(){
    console.log("hello")
    document.getElementById("ContentTable").style.display="none";
};

document.getElementById("ContentTableDetail").onclick=function(e){
    if (e.target.className=="ChaperLink"){
        document.getElementById("ContentTable").style.display="none";
    }
};

document.getElementById("FloatMenu").onclick=function(){
    ContetHandler=document.getElementById("ContentTable");
    if (ContetHandler.style.display=="none"){
        ContetHandler.style.display="block";
    
    
    } else{
        ContetHandler.style.display="none";
    }
};

