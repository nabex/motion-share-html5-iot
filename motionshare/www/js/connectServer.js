/******************************************************************/
/********              socket 接続系処理                 ***********/
/******************************************************************/

var socket = { on: function(){} };
var url = "https://motion-share.herokuapp.com"; //websocketサーバのURL。
// 接続
var connect = function() {
  //alert("connect");
  if ( !socket.connected ) socket = io.connect(url);
  else socket.connect();
}

// 切断
var disconnect = function(){
  //alert("disconnect");
  socket.disconnect();
}



/******************************************************************/
/********              送信処理                          ***********/
/******************************************************************/


//  contentID:0 連絡先 送信処理
function sendContact(socketID){
  //localStorageにcontactがあるときに処理を行う
  if(!(localStorage.contact===void 0)){
    //簡単に扱うために一時的にJSONを入れる変数
    var befferContact=JSON.parse(localStorage.contact);
    //名前が空文字であれば，不明とする
    if(befferContact.Name=="") befferContact.Name="unknown";
    //保存されたユーザ情報にはパスワードも含まれるため，パスワードを除いた4項目のJSONを再構築
    //JSON形式
    /*
    var sendingContact={
    "Name":befferContact.Name,
    "Id":befferContact.Id,
    "Phone":befferContact.Phone,
    "Mail":befferContact.Mail
  };
  */
  //配列形式
  var sendingContact=[];
  sendingContact[0]=befferContact.Name;
  sendingContact[1]=localStorage.getItem("userId");
  sendingContact[2]=befferContact.Phone;
  sendingContact[3]=befferContact.Mail;

  if((shareSetting&01)==00){
    sendingContact[2]="0000000000";
  }
  if((shareSetting&10)==00){
    sendingContact[3]="unknown";
  }

  sendingContact=sendingContact.toString();

  //Base64エンコード
  sendingContact=btoa(unescape(encodeURIComponent(sendingContact)));
  socket.emit("send real data to server", [ 0 , socketID , sendingContact ]);
  disconnect();
  alert("CONTACT GO TO SERVER");
  modeChange();
}
}


//  contentID:1 スケジュール 送信処理
function sendSchedule(socketID){
  //localStorageにscheduleがあるときに処理を行う
  if(!(localStorage.schedule===void 0)){
    scheduleJson=JSON.parse(localStorage.schedule);
    var index='0';
    if(!(sessionStorage.scheduleIndex===void 0)){
      index=sessionStorage.scheduleIndex;
    }
    //選択したスケジュールを扱う
    //JSON形式
    /*
    var sendingSche=scheduleJson[index];
    sendingSche=JSON.stringify(sendingSche);
    */
    //配列形式
    var dates=scheduleJson[index].date.replace(/T|-|:/g,"/");
    var notes=scheduleJson[index].note;
    var sendingSche=[dates,notes];
    sendingSche=sendingSche.toString();

    if(sendingSche!=null){
      //Base64で送信するときは以下のbtoa関数のコメントアウトを解除する
      //Base64エンコード
      sendingSche=btoa(unescape(encodeURIComponent(sendingSche)));
      socket.emit("send real data to server", [ 1 , socketID , sendingSche ]);
      //socket.emit("html5_test", sendingSche);
      disconnect();
      alert("SCHEDULE GO TO SERVER");
      modeChange();
    }else{
      disconnect();
      alert("There are not sharable schedule");
      modeChange();
    }
  }
}


//  contentID:2 画像 送信処理
function sendPhotoData(socketID){
  var data = localStorage.getItem('imageData');
  socket.emit("send real data to server", [ 2 , socketID , data ]);
  disconnect();
  alert("PHOTO GO TO SERVER");
  modeChange();
}


/******************************************************************/
/********              受信処理                          ***********/
/******************************************************************/




//  contentID:0 連絡先 受信処理
function receiveContact(rcvCtt){
  //Base64デコード
  rcvCtt=decodeURIComponent(escape(atob(rcvCtt)));
  /*
  var contact=JSON.parse(rcvCtt);
  var name=contact["Name"];
  var phone=contact["Phone"];
  var mail=contact["Mail"];
  */
  var rcvCttString=rcvCtt.split(",");
  var name=rcvCttString[0];
  var phone=rcvCttString[2];
  var mail=rcvCttString[3];

  alert("Received contact of "+ name);
  //サーバに自分のuserIDと相手のuserIDを送信する
  socket.emit("create relation",[localStorage.getItem("userId"),rcvCttString[1]]);
  var newContact=navigator.contacts.create({"displayName":name});
  var phoneNumbers=[];
  phoneNumbers[0] = new ContactField('mobile', phone, true); // preferred number
  var emails=[];
  emails[0]=new ContactField('mobile',mail,true);
  newContact.phoneNumbers=phoneNumbers;
  newContact.emails=emails;
  newContact.save();
  disconnect();
  connect();
}






//  contentID:1 スケジュール 受信処理
function receiveSchedule(rcvMsg){
  alert("Received schedule");
  //Base64デコード
  rcvMsg=decodeURIComponent(escape(atob(rcvMsg)));
  //JSON形式
  /*
  var sche=JSON.parse(rcvMsg);
  var datetime=sche["date"];
  var note =sche["note"];
  */

  //配列形式
  var rcvMsgString=rcvMsg.split(",");
  var datetime=rcvMsgString[0];
  var note=rcvMsgString[1];
  var datetimes=datetime.split("/");
  datetime=datetimes[0]+"-"+datetimes[1]+"-"+datetimes[2]+"T"+datetimes[3]+":"+datetimes[4];

  //JSONのkeyをスケジュールリストの要素数にする
  for(var i=0;i<=Object.keys(scheduleJson).length;i++){
    if(!(i in scheduleJson)){
      scheIndex=i;
      break;
    }
  }
  //受け取ったスケジュールをJsonで保存し画面に反映
  scheduleToJson(datetime,note);
  scheduleAuto(scheIndex,datetime,note);
  scheduleShow();
  //ホーム画面のスケジュールは直近のスケジュールに変更
  sessionStorage.scheduleIndex='0';
  //スケジュール画面に自動で遷移 遷移しない方がいいのなら削除
  $("#view").load('scheduleList.html',function(){
    scheduleFanc.initialize();
  });
  disconnect();
  connect();
}


//  contentID:2 画像 受信処理
function receivePhotoData(imageData){
  localStorage.setItem('imageData', imageData);
  alert("Received photo");
  var data = localStorage.getItem('imageData');

  $('.card-image').removeClass('loadingWidth');
  $('#camera_pic').attr('src', 'data:image/jpeg;charset=utf-8;base64,' + data);
  //saveBase64PhotoData(data);
  savePhoto();
  disconnect();
  connect();
}
