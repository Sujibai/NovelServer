// function httpGet(Loc)
// {
//     let xhr = new XMLHttpRequest();
//     xhr.open('POST', '/JsonPass', true); 
//     xhr.setRequestHeader("Content-type","application/json");
//     let obj = {JsonLocation: Loc};
//     console.log(obj)
//     xhr.send(JSON.stringify(obj));

//     xhr.onload = function () {
//         if (xhr.readyState === xhr.DONE) {
//             if (xhr.status === 200) {
//                 console.log(xhr)
//                 console.log(xhr.response);
//                 // render(xhr.response)
//                 // return xhr.response
//             }
//         }
//     };
// }

// function RenderPage(JsonData){
//     nunjucks.render("./public/templates/template.html",JsonData)
// }


// let obj = {JsonLocation:"/public/json/test.json"};
let obj = {wd:"apple",mode: 'no-cors'};
fetch('https://www.baidu.com/',{
    method: 'POST',
    body: JSON.stringify(obj),
    // headers: new Headers({'Content-Type': 'application/json'})
}).then(function(response) {
    return response.json();
}).then(function(myJson) {
    console.log(JSON.stringify(myJson));
    // console.log(JSON.parse(myJson));
    // nunjucks.render("/templates/template.html",myJson)
});