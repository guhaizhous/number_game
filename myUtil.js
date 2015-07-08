var myUtil =function(){

}

myUtil.getDay = function (str){
    var dates= new Date();
    var years =new Date().getFullYear();
    var month =new Date().getMonth()+1+"";
    var dates =new Date().getDate()+"";
    var hh = new Date().getHours();
    var mm = new  Date().getMinutes();
    var ss = new Date().getSeconds();

    if(month.length<2){
      month="0"+month;
    }

    if(dates.length<2){
      dates="0"+dates;
    }

    if(hh.length<2){
      hh="0"+hh;
    }

    if(mm.length<2){
      mm="0"+mm;
    }

    if(ss.length<2){
      ss="0"+ss;
    }

    switch (str.toUpperCase()){
      case "YYYY-MM-DD":
        return years+"-"+month+"-"+dates;
        break;
      case "YYYY-MM-DD HH:MM:SS":
        return years+"-"+month+"-"+dates+" "+hh+":"+mm+":"+ss;
        break;
      case "YYYY/MM/DD":
        return years+"/"+month+"/"+dates;
        break;
      case "YYYY/MM/DD HH:MM:SS":
        return years+"/"+month+"/"+dates+" "+hh+":"+mm+":"+ss;
        break;
      case "YYYYMMDD":
        return years+month+dates;
        break;
      case "YYYYMMDDHHMMSS":
        return years+month+dates+hh+mm+ss;
        break;
      case "HH:MM:SS":
        return  hh+":"+mm+":"+ss;
        break;
      case "HHMMSS":
        return  hh+mm+ss;
      break;
    }   
}

module.exports=myUtil;