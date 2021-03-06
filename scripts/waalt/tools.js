'use strict';

var Tools = {

  convenientDate: function (stamp) {
    var day = this.day(stamp);
    var today = this.day(this.localize(this.stamp()));
    var dayString = 
      day.toString() == today.toString()
      ?
        _('Today')
      :
        _('DateFormat', {day: day[2], month: day[1]})
    ;
    return [
      dayString,
      this.hour(stamp)
    ];
  },

  hour: function (stamp) {
    var hour = stamp.split('T');
    hour = hour[1].split(':');
    return hour[0]+':'+hour[1];
  },
  
  day: function (stamp) {
    var day = stamp.split('T');
    day = day[0].split('-');
    return day;
  },
  
  stamp: function (date) {
    var date = date ? new Date(parseInt(date)*1000) : new Date();
    return date.getUTCFullYear()+"-"
  	  +("0"+(date.getUTCMonth()+1)).slice(-2)+"-"
  	  +("0"+(date.getUTCDate())).slice(-2)+"T"
  	  +("0"+(date.getUTCHours())).slice(-2)+":"
  	  +("0"+(date.getUTCMinutes())).slice(-2)+":"
  	  +("0"+(date.getUTCSeconds())).slice(-2)+"Z";
  },
  
  localize: function (utc) {
    var offset = new Date().getTimezoneOffset();
    var ymdhms = utc.split('T');
    var ymd = ymdhms[0].split('-');
    var hms = ymdhms[1].substr(0, ymdhms[1].length-1).split(':');
    var date = new Date(ymd[0], ymd[1]-1, ymd[2], hms[0], hms[1], hms[2]);
    date.setTime(date.getTime()-60000*offset);
    return date.getFullYear()+'-'
      +('0'+(date.getMonth()+1)).slice(-2)+'-'
      +('0'+(date.getDate())).slice(-2)+'T'
      +('0'+(date.getHours())).slice(-2)+':'
      +('0'+(date.getMinutes())).slice(-2)+':'
      +('0'+(date.getSeconds())).slice(-2)+'Z';
  },
  
  urlHL: function (text) {
    var exp = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig;
    return text.replace(exp,'<a href=\'$1\' target=\'_blank\'>$1</a>');
  },
  
  // By BMintern https://gist.github.com/BMintern/1795519
  HTMLescape: function (str) {
    var div = document.createElement('div');
    div.appendChild(document.createTextNode(str));
    return div.innerHTML;
  },

  /**
   *
   * @param num
   * @param cc country code
   * @returns {string|void}
   */
  numSanitize: function (num, cc) {
    var region =  PHONE_NUMBER_META_DATA[cc] instanceof Array
                  ? (
                    PHONE_NUMBER_META_DATA[cc][0] instanceof Object
                    ? 
                      PHONE_NUMBER_META_DATA[cc][0].region
                    :
                      PHONE_NUMBER_META_DATA[cc][0].slice(2, 4)
                    )
                  : (
                    PHONE_NUMBER_META_DATA[cc] instanceof Object
                    ?
                      PHONE_NUMBER_META_DATA[cc].region
                    :
                      PHONE_NUMBER_META_DATA[cc].slice(2, 4)
                    );
                      
    var parsed = PhoneNumber.Parse(num.replace(/[\s\-\+]/g, ''), region);
    console.log(num.replace(/[\s\-\+]/g, ''), cc, region, parsed);
    return parsed ? parsed.internationalFormat.replace(/[\ \+]/g, '') : null;
  },
  
  countries: function () {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', 'scripts/goles/countries.json', false);
    xhr.send();
    var countries = JSON.parse(xhr.responseText) || {};
    return countries;
  },
  
  textBlob: function (text) {
    return new Blob([text], {type: 'text/plain'});
  },
  
  textUnblob: function (blob, cb) {
    var fr = new FileReader;
    fr.addEventListener('loadend', function () {
      var text = fr.result;
      cb(text);
    });
    fr.readAsText(blob);
  },
  
  picUnblob: function (blob, width, height, callback) {
    var reader = new FileReader();
    reader.onload = function (event) {
      var img = new Image();
      img.onload = function () {
        var canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        canvas.getContext('2d').drawImage(img, 0, 0, 96, 96);
        var url = canvas.toDataURL();
        callback(url);
      }
      img.src = event.target.result;
    }
    reader.readAsDataURL(blob);
  }

}
