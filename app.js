let express = require('express')
let bodyParser = require('body-parser');
let fs=require('fs')
const path = require('path')
let nunjucks=require('nunjucks')
const urllib=require('urllib');
const xpath = require('xpath')

const dom = require('xmldom').DOMParser
// const pug = require('pug');

let app=express();
// app.use(bodyParser.urlencoded(
//   {
//     extended: false
//   }
// )
// );

app.use(bodyParser.json());
app.use('/public', express.static('public'));
nunjucks.configure('public/templates', {
  autoescape: true,
  express: app
});

app.get('/', function (req, res) {
  console.log("主页 GET 请求");
  res.sendFile( __dirname + "/" + "index.html" );
})

app.post('/JsonPass', function (req, res) {
  console.log("Json post 请求");
  console.log(req.headers['content-type']);
  console.log(req.body)
  console.log(req.body.JsonLocation)
  res.sendFile( __dirname +"/public/json/"+ req.body.JsonLocation);
})

app.post('/TemplatePass', function (req, res) {
  console.log("TemplatePass post 请求");
  console.log(req.headers['content-type']);
  console.log(req.body)
  res.sendFile( __dirname +"/public/templates/"+ req.body.TemplateLoacation);
})

app.post('/SearchListPass', function (req, res) {
  console.log("SearchListPass post 请求");
  console.log(req.headers['content-type']);
  console.log(req.body)
  console.log(req.body.JsonLocation)
  // let SearchList= await GetSearchList("诡秘之主")
  GetSearchList("诡秘之主").then((SearchList)=>res.send(SearchList));
})

app.get('/search', async function (req, res) {
  console.log("search get 请求");
  console.log(req.query)
  console.log(req.query.key)
  let SearchList= await GetSearchList(req.query.key)
  let FullPath =path.normalize(__dirname + "/public/templates/SearchList.html");
  console.log(FullPath)
  res.render(FullPath,SearchList)
})

app.get('/BookDetail',async function (req, res) {
  console.log("BookDetail 请求");
  let Detail = await GetBookDetail(req.query.bookkey)
  Detail.BookKey=req.query.bookkey
  res.render('BookDetail.html',Detail);
  // GetBookDetail(req.query.bookkey).then((Detail)=>res.render('BookDetail.html',Detail))
})

app.get('/ChapterDetail',async function (req, res) {
  console.log("BookDetail 请求");
  console.log(req.query.bookkey)
  console.log(req.query.chapterurl)
  let ChapterDetail = await GetChapterContent(req.query.chapterurl)
  ChapterDetail.BookKey=req.query.bookkey
  res.render('ChapterDetail.html',ChapterDetail);
  // GetBookDetail(req.query.bookkey).then((Detail)=>res.render('BookDetail.html',Detail))
})






app.get('/GetBook', function (req, res) {
  console.log("GetBook 请求");
  let FullPath = path.normalize(__dirname + "/public/json/"+req.query.JsonLocation);
  let text=JSON.parse(fs.readFileSync(FullPath));
  res.render('FullBook.html',text);
})



app.get('/process_get', function (req, res) {
  // 输出 JSON 格式
  var response = {
    "datalocation":req.query.datalocation,
  };
  console.log(response);
  // let FullPath =path.normalize(__dirname + req.query.datalocation);
  let FullPath = __dirname + "/public/json/"+req.query.datalocation;
  let text=JSON.parse(fs.readFileSync(FullPath));
  res.render('FullBook.html',text);
})





let server=app.listen(7645,function(){
  let host=server.address().address
  let port=server.address().port
  console.log(host)
  console.log("app at http://127.0.0.1:%s",port)
})


async function GetSearchList(KeyWord){
  let SearchResult={}
  let FullPath = __dirname + "/public/engine/config.json";
  ConfigJson=await JSON.parse(fs.readFileSync(FullPath));
  SearchUrl=ConfigJson.SearchEngien.PostParam.PostUrl
  GetParam={
      method: ConfigJson.SearchEngien.GetMethod,
      data:{[ConfigJson.SearchEngien.PostParam.PostFormKey]:KeyWord}
  }
  let List=await urllib.request(SearchUrl,GetParam).then(ParseSearchPage)
  SearchResult.SearchList=List;
  SearchResult.KeyWord=KeyWord;
  return SearchResult
}

async function GetBookDetail(BookKey){
  let FullPath = __dirname + "/public/engine/config.json";
  ConfigJson=await JSON.parse(fs.readFileSync(FullPath));
  FullDetailUrl=ConfigJson.BookDetail.constructor.FrontString+BookKey+ConfigJson.BookDetail.constructor.BackString
  FullContentUrl=ConfigJson.FullContTable.constructor.FrontString+BookKey+ConfigJson.FullContTable.constructor.BackString
  GetParam={
      method: "get"
  }
  let BookDetailPage= await urllib.request(FullDetailUrl,GetParam)
  let BookDetail = await ParseBookDetail(BookDetailPage)
  let FullContentTable={}
  if (FullDetailUrl==FullContentUrl){
      FullContentTable = await ParseContentTable(BookDetailPage)
  }else{
      FullContentTable=await urllib.request(FullContentUrl,GetParam).then(ParseContentTable)
  }
  
  
  let Detail={}
  Detail.BookDetail=BookDetail
  Detail.ContTable=FullContentTable
  return Detail
}

async function GetChapterContent(ChapterUrl){
  let FullPath = __dirname + "/public/engine/config.json";
  ConfigJson=await JSON.parse(fs.readFileSync(FullPath));
  GetParam={
      method: "get"
  }
  console.log(ChapterUrl)
  let ChapterDetailPage= await urllib.request(ChapterUrl,GetParam)
  let ChapterDetail=await ParseChapterContent(ChapterDetailPage)
  return ChapterDetail
}

async function ParseSearchPage(Page) {
  let file=Page.data.toString();
  let doc = new dom().parseFromString(file);
  let nodes = xpath.select(ConfigJson.SearchEngien.parser.BookList, doc)
  let SearchList={}
  SearchList.list=[]
  for (ind in nodes){
      let book={}
      book.BookName=xpath.select(ConfigJson.SearchEngien.parser.BookName, nodes[ind])[0].nodeValue
      book.BookUrl=xpath.select(ConfigJson.SearchEngien.parser.BookUrl, nodes[ind])[0].nodeValue
      book.BookAuthor=xpath.select(ConfigJson.SearchEngien.parser.BookAuthor, nodes[ind])[0].nodeValue
      book.BookCoverUrl=xpath.select(ConfigJson.SearchEngien.parser.BookCoverUrl, nodes[ind])[0].nodeValue
      book.Description=xpath.select(ConfigJson.SearchEngien.parser.Description, nodes[ind])[0].nodeValue

      let matcher=new RegExp(ConfigJson.SearchEngien.parser.BookKey.FrontString+"(\\S*)"+ConfigJson.SearchEngien.parser.BookKey.BackString)
      book.BookKey = book.BookUrl.match(matcher)[1]
      SearchList.list.push(book)
  }
  return SearchList
}

async function ParseBookDetail(Page) {
  let file=Page.data.toString();
  let node = new dom().parseFromString(file);
  let BookDetail={}
  BookDetail.BookName=xpath.select(ConfigJson.BookDetail.parser.BookName, node)[0].nodeValue
  BookDetail.BookAuthor=xpath.select(ConfigJson.BookDetail.parser.BookAuthor, node)[0].nodeValue
  BookDetail.CoverUrl=xpath.select(ConfigJson.BookDetail.parser.CoverUrl, node)[0].nodeValue
  BookDetail.FullContenUrl=xpath.select(ConfigJson.BookDetail.parser.FullContenUrl, node)[0].nodeValue
  BookDetail.LastUpdateDate=xpath.select(ConfigJson.BookDetail.parser.LastUpdateDate, node)[0].nodeValue
  BookDetail.TypeText=xpath.select(ConfigJson.BookDetail.parser.TypeText, node)[0].nodeValue
  BookDetail.Description=new String()
  // let DescriptionLines=[]
  DescParas=xpath.select(ConfigJson.BookDetail.parser.Description, node)
  for (let par in DescParas){
    // DescriptionLines.push(DescParas[par].nodeValue)
    // Description+=DescParas[par].nodeValue
    // console.log(Description)
      BookDetail.Description=BookDetail.Description.concat("",DescParas[par].nodeValue)
  }
  // let Description=DescriptionLines.join('')
  // BookDetail.Description = Description
  return BookDetail
}

async function ParseContentTable(Page) {
  let file=Page.data.toString();
  let doc = new dom().parseFromString(file);
  let nodes = xpath.select(ConfigJson.FullContTable.parser.ChapterList, doc)
  let Chapters={}
  Chapters.ChapterList=[]
  for (ind in nodes){
      let chapter={}
      chapter.ChapterTitle=xpath.select(ConfigJson.FullContTable.parser.ChapterTitle, nodes[ind])[0].nodeValue
      chapter.ChapterUrl=xpath.select(ConfigJson.FullContTable.parser.ChapterUrl, nodes[ind])[0].nodeValue
      chapter.ChapterUrl=ConfigJson.FullContTable.parser.ChapterUrlFront+chapter.ChapterUrl
      Chapters.ChapterList.push(chapter)
  }
  return Chapters
}

async function ParseChapterContent(Page) {
  let file=Page.data.toString();
  let doc = new dom().parseFromString(file);
  // let nodes = xpath.select(ConfigJson.FullContTable.parser.ChapterList, doc)
  let ChapterDetail={}
  ChapterDetail.ChapterTitle=xpath.select(ConfigJson.ChapterDetail.parser.ChapterTitle, doc)[0].nodeValue

  let ContentParagraphs=xpath.select(ConfigJson.ChapterDetail.parser.Content, doc)
  let FullContent=""
  for (paragraph in ContentParagraphs){
      // console.log(ContentParagraphs[paragraph])
      FullContent=FullContent+"\u3000 \u3000"+ContentParagraphs[paragraph].nodeValue+'\n'
  }
  ChapterDetail.Content=FullContent
  ChapterDetail.LastPage=ConfigJson.ChapterDetail.constructor.LastPageFront+xpath.select(ConfigJson.ChapterDetail.parser.LastPage, doc)[0].nodeValue
  ChapterDetail.NextPage=ConfigJson.ChapterDetail.constructor.NextPageFront+xpath.select(ConfigJson.ChapterDetail.parser.NextPage, doc)[0].nodeValue
  return ChapterDetail
}