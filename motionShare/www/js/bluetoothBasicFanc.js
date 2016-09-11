

var bluetoothFanc = {
  //初期化
  initialize: function() {
    //alert("a");
    this.bindEvents();
    showPages.showMainPage();
  },

  //イベントの管理
  bindEvents: function() {
    var TOUCH_START = 'touchstart';
    document.addEventListener('deviceready', this.onDeviceReady, false);
    deviceButton.addEventListener(TOUCH_START,this.searchDevice,false);
    deviceList.addEventListener(TOUCH_START, this.connect, false);
    disconnectButton.addEventListener(TOUCH_START, this.disconnect, false);
  },

  onDeviceReady: function() {
    //cordovaがOnになった時に行いたい処理を記述

    //this.autoConnect();
  },

  //起動時に自動ペアリングする
  autoConnect: function(){
    var deviceId=getDeviceInfo.getDeviceId();
    if(deviceId!=""){
      bluetoothSerial.connect(deviceId,function(){
        alert("success:"+localStorage.name);
        //this.receiveData();
      },this.onError);
      updateTag.changeButtonName();
    }
  },

  //デバイスに接続した時の処理
  connect: function(e) {
    //接続したデバイスの情報を取得
    var deviceName = e.target.dataset.deviceName;
    var deviceId = e.target.dataset.deviceId;

    updateTag.changeButtonName(deviceName);
    bluetoothSerial.connect(deviceId, function(){
      alert("success:"+deviceId);}, bluetoothFanc.onError);
    },

    disconnect: function(event) {
      bluetoothSerial.disconnect(
        showPages.showMainPage, bluetoothFanc.onError);
      },

      searchDevice: function(){
        showPages.showSelectDevicePage();
        //デバイスを検索する
        bluetoothSerial.list(updateTag.searchResult, bluetoothFanc.onError);
      },

      receiveData: function(){
        bluetoothSerial.subscribe("\n",bluetoothFanc.splitString,bluetoothFanc.onError);
      },

      //受信した文字列を整数に変換する
      splitString: function(data){
        var acc=[];
        var gyr=[];
        var strings=data.split(",");
        for(var i=0;i<strings.length/2;i++){
          acc[i]=Number(strings[i]);    //accX,accY,accZ
          gyr[i+3]=Number(string[i+3]);  //gyrX,gryY,gryZ
        }
      },

      onError: function(reason) {
        alert("ERROR: " + reason);
      }
    };



    //page1.htmlの画面内の遷移
    var showPages={
      showMainPage: function() {
        mainPage.style.display = "";
        selectDevicePage.style.display = "none";
      },

      showSelectDevicePage: function() {
        mainPage.style.display = "none";
        selectDevicePage.style.display = "";
      },
    };


    //HTML内のタグに関わる操作
    var updateTag={
      //検索したデバイスをドロップダウンに反映
      searchResult: function(devices){
        //listによる実装
        //ドロップダウンを一度初期化し再度追加していく
        deviceList.innerHTML = "";
        devices.forEach(function(device) {
          var listItem = document.createElement('li'),
          html = '<b>' + device.name + '</b>';

          listItem.innerHTML = html;
          listItem.dataset.deviceName=device.name;
          listItem.dataset.deviceId = device.id;

          deviceList.appendChild(listItem);
        });
      },

      //デバイス選択画面のタグ表示名を変更
      changeButtonName:function(name){
        //ドロップダウンのDevicesの表示名を変更
        devices.innerHTML=name;
        //専用デバイスボタンの表示名を変更
        deviceButton.innerHTML="<p>専用デバイス<br>"+name+"</p>";
      },
    };