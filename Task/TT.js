/*
 * @Author: Xin https://github.com/Xin-code 
 * @Date: 2021-02-27 16:17:32 
 * @Last Modified by: Xin 
 * @Last Modified time: 2021-02-27 18:31:00
 * 
 * 原作者地址：https://raw.githubusercontent.com/ZhiYi-N/Private-Script/master/Scripts/TT.js
 * 由于手机LOON为获取Refer和Body 自己手动填入脚本 
 * 使用AC进行打卡
 */

const $ = Env('TT语音')
const notify = $.isNode() ?require('./sendNotify') : '';
let status;
status = (status = ($.getval("TTstatus") || "1") ) > 1 ? `${status}` : ""; // 账号扩展字符
const TTreferArr = [
  // xin
  `http://appcdn.52tt.com/web/frontend-web-activity-new-user-clock-in-thirty-day/index.html?device_id=20210226221319898660839bf2f4cc562ffacb74ab9f03011b5fcfffe3a4d4&ip=112.10.236.51&uid=216827676&version=84213766&appid=0&os_type=2&platform=1&app=0&market_id=0`,
  // bao
  `http://appcdn.52tt.com/web/frontend-web-activity-new-user-clock-in-thirty-day/index.html?padding=83&uid=216569814&version=84213761&os_type=1&platform=1&app=0&game_block=1&apk_channel=B59771501.tt_no_game&market_id=0&ip=112.10.236.51&device_id=202008281804025a11d74918e9604f5b79b4ba8eb896e1018d2f4f8af4e0dd&status_height=96`,
  // hw
  `http://appcdn.52tt.com/web/frontend-web-activity-new-user-clock-in-thirty-day/index.html?device_id=20210221123810c45e2061aaeb24f4ea3f3f7da5cda0c4018062a193dfac88&ip=123.149.120.20&uid=216918254&version=84213766&appid=0&os_type=2&platform=1&app=0&market_id=0`,
  // ksy
  `http://appcdn.52tt.com/web/frontend-web-activity-new-user-clock-in-thirty-day/index.html?device_id=20210227162337f2c6d5b9d38ee34b65f9f221681cca630186ed252c9314bd&ip=123.149.19.79&uid=217037897&version=84213766&appid=0&os_type=2&platform=1&app=0&market_id=0`,
]

const TTbodyArr = [
  // xin
  `{"bizType":"340000020002","uid":216827676,"appId":"ttvoice","pageId":"activity_page","pageExt":"http://appcdn.52tt.com/web/frontend-web-activity-new-user-clock-in-thirty-day/index.html","event":"exposure","eventId":"","eventExt":"","platform":"1","generalParam":"","source":""}`,
  // bao
  `{"bizType":"340000020002","uid":216569814,"appId":"ttvoice","pageId":"activity_page","pageExt":"http://appcdn.52tt.com/web/frontend-web-activity-new-user-clock-in-thirty-day/index.html","event":"exposure","eventId":"","eventExt":"","platform":"2","generalParam":"","source":""}`,
  // hw
  `{"bizType":"340000020002","uid":216918254,"appId":"ttvoice","pageId":"activity_page","pageExt":"http://appcdn.52tt.com/web/frontend-web-activity-new-user-clock-in-thirty-day/index.html","event":"exposure","eventId":"","eventExt":"","platform":"1","generalParam":"","source":""}`,
  // ksy
  `{"bizType":"340000020002","uid":217037897,"appId":"ttvoice","pageId":"activity_page","pageExt":"http://appcdn.52tt.com/web/frontend-web-activity-new-user-clock-in-thirty-day/index.html","event":"exposure","eventId":"","eventExt":"","platform":"1","generalParam":"","source":""}`,
]
let TTrefer = $.getdata('TTrefer')
let TTbody= $.getdata('TTbody')
let tz = ($.getval('tz') || '1');//0关闭通知，1默认开启
var hour=''
var minute=''
if ($.isNode()) {
   hour = new Date( new Date().getTime() + 8 * 60 * 60 * 1000 ).getHours();
   minute = new Date( new Date().getTime() + 8 * 60 * 60 * 1000 ).getMinutes();
}else{
   hour = (new Date()).getHours();
   minute = (new Date()).getMinutes();
}

!(async () => {
if (!TTreferArr[0] && !TTbodyArr[0] ) {
    $.msg($.name, '【提示】请先获取TT语音一cookie')
    return;
  }
   console.log(`------------- 共${TTbodyArr.length}个账号----------------\n`)
  for (let i = 0; i < TTbodyArr.length; i++) {
    if (TTbodyArr[i]) {
      message = ''
      TTrefer= TTreferArr[i];
      TTbody = TTbodyArr[i];
      $.index = i + 1;
      console.log(`\n开始【TT语音${$.index}】`)
      await checkin() 
  }
 }
})()
    .catch((e) => $.logErr(e))
    .finally(() => $.done())
    
    
//checkin
async function checkin(){
 return new Promise((resolve) => {
    let checkin_url = {
   	url: `https://node.52tt.com/activity-production/new-user-month-checkin/activity.Checkin/checkin`,
    	headers: {
       'Accept': '*/*',
       'Accept-Encoding': 'gzip,deflate,br',
       'Accept-Language': 'zh-cn',
       'Connection': 'keep-alive',
       'Content-Type': 'application/json',
       'Host': 'node.52tt.com',
       'Origin': 'http://appcdn.52tt.com',
        Refer: TTrefer,
       'User-Agent': `Mozilla/5.0 (iPhone; CPU iPhone OS 13_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 TT/5.5.6 NetType/Wifi`
       },
    	body: TTbody
    	}
   $.post(checkin_url,async(error, response, data) =>{
    try{
        const result = JSON.parse(data)
        console.log(`反馈数据：`+data)
        if(result.code == 0){
         for(let i = 0; i < 29; i++){
         let day = result.data.record.i == 0 ? (i -1) : i
         }
	        console.log(`打卡成功：累计获得${result.data.curMoney}元\n`)
          message += `打卡成功：累计获得${result.data.curMoney}元`
        }else if(result.code == 2){
        console.log(result.msg+`\n`)
        message += result.msg
        }
        }catch(e) {
          $.logErr(e, response);
      } finally {
        resolve();
      } 
    })
   })
}
function Env(t,e){class s{constructor(t){this.env=t}send(t,e="GET"){t="string"==typeof t?{url:t}:t;let s=this.get;return"POST"===e&&(s=this.post),new Promise((e,i)=>{s.call(this,t,(t,s,r)=>{t?i(t):e(s)})})}get(t){return this.send.call(this.env,t)}post(t){return this.send.call(this.env,t,"POST")}}return new class{constructor(t,e){this.name=t,this.http=new s(this),this.data=null,this.dataFile="box.dat",this.logs=[],this.isMute=!1,this.isNeedRewrite=!1,this.logSeparator="\n",this.startTime=(new Date).getTime(),Object.assign(this,e),this.log("",`\ud83d\udd14${this.name}, \u5f00\u59cb!`)}isNode(){return"undefined"!=typeof module&&!!module.exports}isQuanX(){return"undefined"!=typeof $task}isSurge(){return"undefined"!=typeof $httpClient&&"undefined"==typeof $loon}isLoon(){return"undefined"!=typeof $loon}toObj(t,e=null){try{return JSON.parse(t)}catch{return e}}toStr(t,e=null){try{return JSON.stringify(t)}catch{return e}}getjson(t,e){let s=e;const i=this.getdata(t);if(i)try{s=JSON.parse(this.getdata(t))}catch{}return s}setjson(t,e){try{return this.setdata(JSON.stringify(t),e)}catch{return!1}}getScript(t){return new Promise(e=>{this.get({url:t},(t,s,i)=>e(i))})}runScript(t,e){return new Promise(s=>{let i=this.getdata("@chavy_boxjs_userCfgs.httpapi");i=i?i.replace(/\n/g,"").trim():i;let r=this.getdata("@chavy_boxjs_userCfgs.httpapi_timeout");r=r?1*r:20,r=e&&e.timeout?e.timeout:r;const[o,h]=i.split("@"),a={url:`http://${h}/v1/scripting/evaluate`,body:{script_text:t,mock_type:"cron",timeout:r},headers:{"X-Key":o,Accept:"*/*"}};this.post(a,(t,e,i)=>s(i))}).catch(t=>this.logErr(t))}loaddata(){if(!this.isNode())return{};{this.fs=this.fs?this.fs:require("fs"),this.path=this.path?this.path:require("path");const t=this.path.resolve(this.dataFile),e=this.path.resolve(process.cwd(),this.dataFile),s=this.fs.existsSync(t),i=!s&&this.fs.existsSync(e);if(!s&&!i)return{};{const i=s?t:e;try{return JSON.parse(this.fs.readFileSync(i))}catch(t){return{}}}}}writedata(){if(this.isNode()){this.fs=this.fs?this.fs:require("fs"),this.path=this.path?this.path:require("path");const t=this.path.resolve(this.dataFile),e=this.path.resolve(process.cwd(),this.dataFile),s=this.fs.existsSync(t),i=!s&&this.fs.existsSync(e),r=JSON.stringify(this.data);s?this.fs.writeFileSync(t,r):i?this.fs.writeFileSync(e,r):this.fs.writeFileSync(t,r)}}lodash_get(t,e,s){const i=e.replace(/\[(\d+)\]/g,".$1").split(".");let r=t;for(const t of i)if(r=Object(r)[t],void 0===r)return s;return r}lodash_set(t,e,s){return Object(t)!==t?t:(Array.isArray(e)||(e=e.toString().match(/[^.[\]]+/g)||[]),e.slice(0,-1).reduce((t,s,i)=>Object(t[s])===t[s]?t[s]:t[s]=Math.abs(e[i+1])>>0==+e[i+1]?[]:{},t)[e[e.length-1]]=s,t)}getdata(t){let e=this.getval(t);if(/^@/.test(t)){const[,s,i]=/^@(.*?)\.(.*?)$/.exec(t),r=s?this.getval(s):"";if(r)try{const t=JSON.parse(r);e=t?this.lodash_get(t,i,""):e}catch(t){e=""}}return e}setdata(t,e){let s=!1;if(/^@/.test(e)){const[,i,r]=/^@(.*?)\.(.*?)$/.exec(e),o=this.getval(i),h=i?"null"===o?null:o||"{}":"{}";try{const e=JSON.parse(h);this.lodash_set(e,r,t),s=this.setval(JSON.stringify(e),i)}catch(e){const o={};this.lodash_set(o,r,t),s=this.setval(JSON.stringify(o),i)}}else s=this.setval(t,e);return s}getval(t){return this.isSurge()||this.isLoon()?$persistentStore.read(t):this.isQuanX()?$prefs.valueForKey(t):this.isNode()?(this.data=this.loaddata(),this.data[t]):this.data&&this.data[t]||null}setval(t,e){return this.isSurge()||this.isLoon()?$persistentStore.write(t,e):this.isQuanX()?$prefs.setValueForKey(t,e):this.isNode()?(this.data=this.loaddata(),this.data[e]=t,this.writedata(),!0):this.data&&this.data[e]||null}initGotEnv(t){this.got=this.got?this.got:require("got"),this.cktough=this.cktough?this.cktough:require("tough-cookie"),this.ckjar=this.ckjar?this.ckjar:new this.cktough.CookieJar,t&&(t.headers=t.headers?t.headers:{},void 0===t.headers.Cookie&&void 0===t.cookieJar&&(t.cookieJar=this.ckjar))}get(t,e=(()=>{})){t.headers&&(delete t.headers["Content-Type"],delete t.headers["Content-Length"]),this.isSurge()||this.isLoon()?(this.isSurge()&&this.isNeedRewrite&&(t.headers=t.headers||{},Object.assign(t.headers,{"X-Surge-Skip-Scripting":!1})),$httpClient.get(t,(t,s,i)=>{!t&&s&&(s.body=i,s.statusCode=s.status),e(t,s,i)})):this.isQuanX()?(this.isNeedRewrite&&(t.opts=t.opts||{},Object.assign(t.opts,{hints:!1})),$task.fetch(t).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>e(t))):this.isNode()&&(this.initGotEnv(t),this.got(t).on("redirect",(t,e)=>{try{if(t.headers["set-cookie"]){const s=t.headers["set-cookie"].map(this.cktough.Cookie.parse).toString();s&&this.ckjar.setCookieSync(s,null),e.cookieJar=this.ckjar}}catch(t){this.logErr(t)}}).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>{const{message:s,response:i}=t;e(s,i,i&&i.body)}))}post(t,e=(()=>{})){if(t.body&&t.headers&&!t.headers["Content-Type"]&&(t.headers["Content-Type"]="application/x-www-form-urlencoded"),t.headers&&delete t.headers["Content-Length"],this.isSurge()||this.isLoon())this.isSurge()&&this.isNeedRewrite&&(t.headers=t.headers||{},Object.assign(t.headers,{"X-Surge-Skip-Scripting":!1})),$httpClient.post(t,(t,s,i)=>{!t&&s&&(s.body=i,s.statusCode=s.status),e(t,s,i)});else if(this.isQuanX())t.method="POST",this.isNeedRewrite&&(t.opts=t.opts||{},Object.assign(t.opts,{hints:!1})),$task.fetch(t).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>e(t));else if(this.isNode()){this.initGotEnv(t);const{url:s,...i}=t;this.got.post(s,i).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>{const{message:s,response:i}=t;e(s,i,i&&i.body)})}}time(t){let e={"M+":(new Date).getMonth()+1,"d+":(new Date).getDate(),"H+":(new Date).getHours(),"m+":(new Date).getMinutes(),"s+":(new Date).getSeconds(),"q+":Math.floor(((new Date).getMonth()+3)/3),S:(new Date).getMilliseconds()};/(y+)/.test(t)&&(t=t.replace(RegExp.$1,((new Date).getFullYear()+"").substr(4-RegExp.$1.length)));for(let s in e)new RegExp("("+s+")").test(t)&&(t=t.replace(RegExp.$1,1==RegExp.$1.length?e[s]:("00"+e[s]).substr((""+e[s]).length)));return t}msg(e=t,s="",i="",r){const o=t=>{if(!t)return t;if("string"==typeof t)return this.isLoon()?t:this.isQuanX()?{"open-url":t}:this.isSurge()?{url:t}:void 0;if("object"==typeof t){if(this.isLoon()){let e=t.openUrl||t.url||t["open-url"],s=t.mediaUrl||t["media-url"];return{openUrl:e,mediaUrl:s}}if(this.isQuanX()){let e=t["open-url"]||t.url||t.openUrl,s=t["media-url"]||t.mediaUrl;return{"open-url":e,"media-url":s}}if(this.isSurge()){let e=t.url||t.openUrl||t["open-url"];return{url:e}}}};if(this.isMute||(this.isSurge()||this.isLoon()?$notification.post(e,s,i,o(r)):this.isQuanX()&&$notify(e,s,i,o(r))),!this.isMuteLog){let t=["","==============\ud83d\udce3\u7cfb\u7edf\u901a\u77e5\ud83d\udce3=============="];t.push(e),s&&t.push(s),i&&t.push(i),console.log(t.join("\n")),this.logs=this.logs.concat(t)}}log(...t){t.length>0&&(this.logs=[...this.logs,...t]),console.log(t.join(this.logSeparator))}logErr(t,e){const s=!this.isSurge()&&!this.isQuanX()&&!this.isLoon();s?this.log("",`\u2757\ufe0f${this.name}, \u9519\u8bef!`,t.stack):this.log("",`\u2757\ufe0f${this.name}, \u9519\u8bef!`,t)}wait(t){return new Promise(e=>setTimeout(e,t))}done(t={}){const e=(new Date).getTime(),s=(e-this.startTime)/1e3;this.log("",`\ud83d\udd14${this.name}, \u7ed3\u675f! \ud83d\udd5b ${s} \u79d2`),this.log(),(this.isSurge()||this.isQuanX()||this.isLoon())&&$done(t)}}(t,e)}