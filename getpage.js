const urllib=require('urllib');
const fs=require('fs')
const xpath = require('xpath')
const dom = require('xmldom').DOMParser;







GetChapterContent("https://www.dstiejuan.com/book/157/3179070.html")





async function GetChapterContent(ChapterUrl){
    let FullPath = __dirname + "/public/engine/config.json";
    ConfigJson=await JSON.parse(fs.readFileSync(FullPath));
    GetParam={
        method: "get"
    }
    console.log(ChapterUrl)
    let ChapterDetailPage= await urllib.request(ChapterUrl,GetParam)
    let ChapterDetail=await ParseChapterContent(ChapterDetailPage)
    console.log(ChapterDetail)
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
        FullContent=FullContent+ContentParagraphs[paragraph].nodeValue+'\n'
    }
    ChapterDetail.Content=FullContent
    ChapterDetail.LastPage=ConfigJson.ChapterDetail.constructor.LastPageFront+xpath.select(ConfigJson.ChapterDetail.parser.LastPage, doc)[0].nodeValue
    ChapterDetail.NextPage=ConfigJson.ChapterDetail.constructor.NextPageFront+xpath.select(ConfigJson.ChapterDetail.parser.NextPage, doc)[0].nodeValue
    return ChapterDetail
}



