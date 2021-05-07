document.getElementById("SearchForm").addEventListener("submit",async function(event){
    let location=document.getElementById("text").value
    // let obj = {JsonLocation:location};
    event.preventDefault();


    // let jsondata = await GetJson("ccccc.json")
    let template = await GetTemplate("SearchList.html")
    let jsondata= await GetSearchList("ggg")

    // console.log(List)

    // console.log(template)
    // console.log(jsondata)

    rendereddat=nunjucks.renderString(template, JSON.parse(jsondata));
    console.log(rendereddat)
    document.write(rendereddat)
})

async function GetTemplate(location){
    let obj = {TemplateLoacation:location};
    let response = await fetch('/TemplatePass',{
        method: 'POST',
        body: JSON.stringify(obj),
        headers: new Headers({'Content-Type': 'application/json'})
    })
    let text= await response.text()
    console.log("get template done")
    console.log(text)
    return text
}

async function GetJson(location){
    let obj = {JsonLocation:location};
    let response = await fetch('/JsonPass',{
        method: 'POST',
        body: JSON.stringify(obj),
        headers: new Headers({'Content-Type': 'application/json'})
    })
    let text= await response.text()
    console.log("get json done")
    console.log(text)
    return text
}

async function GetSearchList(location){
    let obj = {JsonLocation:location};
    let response = await fetch('/SearchListPass',{
        method: 'POST',
        body: JSON.stringify(obj),
        headers: new Headers({'Content-Type': 'application/json'})
    })
    let text= await response.text()
    console.log("get json done")
    console.log(text)
    return text
}