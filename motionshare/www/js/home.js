function homeInitilize(){
  $(function(){
    //ホーム画面でのスケジュール自動削除　スケジュール画面にも適用できる
    setInterval(function(){
      if(autoScheduleDelete()=="1"){
        //削除状態のJSONをローカルストレージに保存する
        localStorage.schedule=JSON.stringify(scheduleJson);
        sessionStorage.scheduleIndex='0';
        scheduleFanc.readySchedule();
        homeScheIni();
      }
    },60*1000);
    homeScheIni();
  });
}


//画像をlocalに保存する
function savePhoto(){
  var data = localStorage.getItem('imageData');
  saveBase64PhotoData(data);
}



function homeScheIni(){
  $(function(){

    var date="--/-- --:--";
    var note="You don't have schedule"
    if(!(localStorage.schedule===void 0)){
      var json=JSON.parse(localStorage.schedule);
      var index='0';
      if(!(sessionStorage.scheduleIndex===void 0)){
        index=sessionStorage.scheduleIndex;
      }
      if((Object.keys(json)!="")&&!(json[index]===void 0)){
        var date=json[index].date;
        var dateMatch = date.match(/(\d+)-(\d+)-(\d+)T(\d+):(\d+)/);
        //日付オブジェクトに変換
        var dateObj = new Date(
          +dateMatch[1],     //年
          +dateMatch[2],     //月
          +dateMatch[3],     //日
          +dateMatch[4],     //時
          +dateMatch[5],     //分
          +0                 //秒
        );
        date=(dateMatch[2])+"/"+dateMatch[3]+" "+dateMatch[4]+":"+dateMatch[5];
        note=json[index].note;
      }
    }
    $("#recentScheduleDate").html(date);
    $("#recentScheduleNote").html(note);
  });
}
