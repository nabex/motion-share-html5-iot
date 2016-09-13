(function () {

  var cnt =0;
  var flag =5;
  var handshakeBool = false;

  var deviceName="";

  $(function () {
    deviceName=localStorage.name;
    // DeviceMotion Event
    window.addEventListener("devicemotion", devicemotionHandler);
    window.addEventListener("deviceorientation", deviceorientationHandler);
  });


  // 加速度が変化
  function devicemotionHandler(event) {
alert("deviceName");
    if(deviceName==""){
      // 加速度
      // X軸
      var x = event.acceleration.x;
      // Y軸
      var y = event.acceleration.y;
      // Z軸
      var z = event.acceleration.z;
    }else{
       var x=0;
       var y=0;
       var z=0;
    }

    document.getElementById('accelerationX').innerHTML = x;
    document.getElementById('accelerationY').innerHTML = y;
    document.getElementById('accelerationZ').innerHTML = z;


    document.getElementById('count').innerHTML = cnt;

    var l =27;
    if(x > l || x < -l){
      if(handshakeBool == true){
        cnt++;
      }
    }


    if(cnt > flag){
      alert('握手');
      cnt = 0;
      handshakeBool = false;
    }
  }

  //角速度変化
  function deviceorientationHandler(event) {

    if(deviceName==""){
      // X軸
      var beta = event.beta;
      // Y軸
      var gamma = event.gamma;
      // Z軸
      var alpha = event.alpha;
    }else{
      var beta=0;
      var gamma=0;
      var alpha=0;
    }

    document.getElementById('beta').innerHTML = beta;
    document.getElementById('gamma').innerHTML = gamma;
    document.getElementById('alpha').innerHTML = alpha;


    if((gamma >= -90) && (gamma <= -70)){
      handshakeBool = true;
    }else{
      handshakeBool = false;
    }

  }
})();
