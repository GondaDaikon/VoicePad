var toRoman = (function( ) {

    var roman = {
  
      '１':'1', '２':'2', '３':'3', '４':'4', '５':'5', '６':'6', '７':'7', '８':'8', '９':'9', '０':'0',
      '！':'!', '”':'"', '＃':'#', '＄':'$', '％':'%', '＆':'&', '’':"'", '（':'(', '）':')', '＝':'=',
      '〜':'~', '｜':'|', '＠':'@', '‘':'`', '＋':'+', '＊':'*', '；':";", '：':':', '＜':'<', '＞':'>',
      '、':',', '。':'.', '／':'/', '？':'?', '＿':'_', '・':'･', '「':'[', '」':']', '｛':'{', '｝':'}',
      '￥':'\\', '＾':'^',
      
      'ふぁ':'fa', 'ふぃ':'fi', 'ふぇ':'fe', 'ふぉ':'fo',
  
      'きゃ':'kya', 'きゅ':'kyu', 'きょ':'kyo',
      'しゃ':'sha', 'しゅ':'shu', 'しょ':'sho',
      'ちゃ':'tya', 'ちゅ':'tyu', 'ちょ':'tyo',
      'にゃ':'nya', 'にゅ':'nyu', 'にょ':'nyo',
      'ひゃ':'hya', 'ひゅ':'hyu', 'ひょ':'hyo',
      'みゃ':'mya', 'みゅ':'myu', 'みょ':'myo',
      'りゃ':'rya', 'りゅ':'ryu', 'りょ':'ryo',
  
      'ふゃ':'fya', 'ふゅ':'fyu', 'ふょ':'fyo',
      'ぴゃ':'pya', 'ぴゅ':'pyu', 'ぴょ':'pyo',
      'びゃ':'bya', 'びゅ':'byu', 'びょ':'byo',
      'ぢゃ':'dya', 'ぢゅ':'dyu', 'ぢょ':'dyo',
      'じゃ':'ja',  'じゅ':'ju',  'じょ':'jo',
      'ぎゃ':'gya', 'ぎゅ':'gyu', 'ぎょ':'gyo',
  
      'ぱ':'pa', 'ぴ':'pi', 'ぷ':'pu', 'ぺ':'pe', 'ぽ':'po',
      'ば':'ba', 'び':'bi', 'ぶ':'bu', 'べ':'be', 'ぼ':'bo',
      'だ':'da', 'ぢ':'di', 'づ':'du', 'で':'de', 'ど':'do',
      'ざ':'za', 'じ':'zi', 'ず':'zu', 'ぜ':'ze', 'ぞ':'zo',
      'が':'ga', 'ぎ':'gi', 'ぐ':'gu', 'げ':'ge', 'ご':'go',
  
      'わ':'wa', 'ゐ':'wi', 'う':'wu', 'ゑ':'we', 'を':'wo',
      'ら':'ra', 'り':'ri', 'る':'ru', 'れ':'re', 'ろ':'ro',
      'や':'ya',            'ゆ':'yu',            'よ':'yo',
      'ま':'ma', 'み':'mi', 'む':'mu', 'め':'me', 'も':'mo',
      'は':'ha', 'ひ':'hi', 'ふ':'hu', 'へ':'he', 'ほ':'ho',
      'な':'na', 'に':'ni', 'ぬ':'nu', 'ね':'ne', 'の':'no',
      'た':'ta', 'ち':'ti', 'つ':'tu', 'て':'te', 'と':'to',
      'さ':'sa', 'し':'si', 'す':'su', 'せ':'se', 'そ':'so',
      'か':'ka', 'き':'ki', 'く':'ku', 'け':'ke', 'こ':'ko',
      'あ':'a', 'い':'i', 'う':'u', 'え':'e', 'お':'o',
      'ぁ':'la', 'ぃ':'li', 'ぅ':'lu', 'ぇ':'le', 'ぉ':'lo',
  
      'ヶ':'ke', 'ヵ':'ka',
      'ん':'n',  'ー':'-', '　':' '
  
    };
    var reg_tu  = /っ([bcdfghijklmnopqrstuvwyz])/gm;
    var reg_xtu = /っ/gm;
  
    return function ( str ) {
      var pnt = 0;
      var max = str.length;
      var s, r;
      var txt = '';
      
      while( pnt <= max ) {
        if( r = roman[ str.substring( pnt, pnt + 2 ) ] ) {
          txt += r;
          pnt += 2;
        } else {
          txt += ( r = roman[ s = str.substring( pnt, pnt + 1 ) ] ) ? r: s;
          pnt += 1;
        }
      }
      txt = txt.replace( reg_tu, '$1$1' );
      txt = txt.replace( reg_xtu, 'xtu' );
      return txt;
    };
  })();

var toTrail = (function(){
  var vowels = {
    "a" : [800 / 1000 * 300, 300 - 1200 / 3000 * 300],
    "i" : [300 / 1000 * 300, 300 - 2300 / 3000 * 300],
    "u" : [300 / 1000 * 300, 300 - 1200 / 3000 * 300],
    "e" : [500 / 1000 * 300, 300 - 1900 / 3000 * 300],
    "o" : [500 / 1000 * 300, 300 - 800 / 3000 * 300],
  }
  var vowels_excep = {
    "n" : [200 / 1000 * 300, 300 - 1500 / 3000 * 300]
  }
  var breakPhon1 = {
    "p" : [],
    "t" : [],
    "k" : [],
  }
  var breakPhon2 = {
    "ts" : [],
    "cy" : [],
  }

  return function(str){
    var pnt = 0;
    var max = str.length;
    var vec = [];
    var r, n, nr;

    while( pnt <= max ) {
      if( r = breakPhon2[ str.substring( pnt, pnt + 2 ) ]) { 
        vec.push(r);
        pnt += 2;
      }else if( r = breakPhon1[ str.substring( pnt, pnt + 1 ) ]){
        vec.push(r);
        pnt += 1;
      }else if( r = vowels[ str.substring( pnt, pnt + 1) ] || 
              ( n = vowels_excep[ str.substring( pnt, pnt +1) ])){
        if( n && ( nr = vowels[ str.substring( pnt + 1, pnt + 2) ]))
          {
            vec.push(nr);
            pnt += 2;
          }else{
            vec.push(r);
            pnt += 1;
          } 
      }else{
        pnt += 1;
      }
    }
    return vec;
  };
})();

var freq2Trail = (function(){
  return function(f1, f2){
    var pnt = 0;
    var vec = [];
    var max = Math.max(f1.length, f2.length);
    var tmpX,tmpY;
    while( pnt <= max){
      if(!(f1[pnt] == 0 || f2[pnt] == 0) ){
        tmpX = Math.round(f1[pnt] / 1000 * 300);
        tmpY = Math.round(300 - f2[pnt] / 3000 * 300);
        vec.push([tmpX, tmpY]);
      }else{
        vec.push([]);
      }
      pnt += 1;
    }
    return vec;
  };
})();

