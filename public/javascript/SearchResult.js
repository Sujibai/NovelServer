// document.getElementsByClassName("BookName").addEventListener("click",async function(event){
//     let location=document.getElementById("text").value
//     // let obj = {JsonLocation:location};
//     event.preventDefault();

//     ShowReport_Click()
//     // let jsondata = await GetJson("ccccc.json")
//     // let template = await GetTemplate("SearchList.html")
//     // let jsondata= await GetSearchList("ggg")

//     // console.log(List)

//     // console.log(template)
//     // console.log(jsondata)

//     // rendereddat=nunjucks.renderString(template, JSON.parse(jsondata));
//     // console.log(rendereddat)
//     // document.write(rendereddat)
// })

BookNames=document.getElementsByClassName("BookName")
for (BookName in BookNames){
    BookNames[BookName].onclick=function(){
        console.log(this)
        data={JsonLocation:"ccccc.json"}
        // let AfterUrl=await EncodeUrl(data)
        EncodeUrl(data).then(
            window
        )
    }
}


async function EncodeUrl(data){
    let AfterUrl="?"
    for (let key in data){
        AfterUrl = AfterUrl+ key +"=" + data[key] + "&"
    }
    return AfterUrl
}


// function ShowReport_Click() {
//     var parames = new Array();
//     parames.push({ name: "JsonLocation", value: "ccccc.json"});
//     parames.push({ name: "bookkey", value: "ccccc.json"});
//     Post("/BookDetail", parames);
//     return false;
// }

// function Post(URL, PARAMTERS) {
//     //创建form表单
//     var temp_form = document.createElement("form");
//     temp_form.action = URL;
//     //如需打开新窗口，form的target属性要设置为'_blank'
//     temp_form.target = "_blank";
//     temp_form.method = "get";
//     // temp_form.enctype="multipart/form-data";
//     temp_form.style.display = "none";
//     //添加参数
//     for (var item in PARAMTERS) {
//         var opt = document.createElement("input");
//         opt.type="text"
//         opt.name = PARAMTERS[item].name;
//         opt.value = PARAMTERS[item].value;
//         temp_form.appendChild(opt);
//         console.log(opt.value)
//     }
//     document.body.appendChild(temp_form);
//     //提交数据
//     console.log(temp_form)
//     temp_form.submit();
// }

async function GetTemplate(location){
    let obj = {TemplateLoacation:location};
    let response = await fetch('/TemplatePass',{
        method: 'get',
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