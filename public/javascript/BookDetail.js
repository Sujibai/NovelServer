document.getElementById("FullDescriptionBut").onclick=function(){
    // document.getElementById("Main").setAttribute('style', 'padding-left: calc(100%-100vw)')

    document.getElementById("FullDescriptionBut").setAttribute('style', 'color: rgb(160, 7, 7);border-bottom: rgb(160, 7, 7) 1px solid')

    document.getElementById("ContentTableInfo").setAttribute('style', 'color: #a6a6a6;border-bottom: none')

    document.getElementById("FullDescription").style.display="block"
    document.getElementById("ContentTableDetail").style.display="none"
}
document.getElementById("ContentTableInfo").onclick=function(){
    // document.getElementById("Main").setAttribute('style', 'padding-left: calc(100%-100vw)')

    document.getElementById("ContentTableInfo").setAttribute('style', 'color: rgb(160, 7, 7);border-bottom: rgb(160, 7, 7) 1px solid')

    document.getElementById("FullDescriptionBut").setAttribute('style', 'color: #a6a6a6;border-bottom: none')

    document.getElementById("FullDescription").style.display="none"
    document.getElementById("ContentTableDetail").style.display="block"
}