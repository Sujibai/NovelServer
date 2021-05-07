document.getElementById("SearchForm").addEventListener("submit",async function(event){
    let location=document.getElementById("text").value
    // let obj = {JsonLocation:location};
    event.preventDefault();



    let template = await GetTemplate("template.html")
    let jsondata = await GetJson("ccccc.json")
    console.log(template)
    // console.log(jsondata)

    // rendereddat=nunjucks.renderString(template, jsondata);
    // console.log(rendereddat)
    document.write(template)
})

async function GetTemplate(location){
    let obj = {TemplateLoacation:location};
    let response = await fetch('/TemplatePass',{
        method: 'POST',
        body: JSON.stringify(obj),
        headers: new Headers({'Content-Type': 'application/json'})
    })
    let text= await response.text()
    console.log("get template donw")
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
    return text
}