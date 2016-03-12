// --------------------------------------------
eng=new Array(97,98,99,100,101,102,103,104,105,106,107,108,109,110,111,112,113,114,115,116,117,118,119,120,121,122,87,82,84,83,67,74,90);
geo=new Array(4304,4305,4330,4307,4308,4324,4306,4336,4312,4335,4313,4314,4315,4316,4317,4318,4325,4320,4321,4322,4323,4309,4332,4334,4327,4310,4333,4326,4311,4328,4329,4319,4331,91,93,59,39,44,46,96);
// --------------------------------------------

function Is ()
{
    var agt=navigator.userAgent.toLowerCase();
    this.major = parseInt(navigator.appVersion);
    this.minor = parseFloat(navigator.appVersion);
    this.nav  = (
		(agt.indexOf('mozilla')!=-1)      
		&& (agt.indexOf('spoofer')==-1)
                && (agt.indexOf('compatible') == -1) 
		&& (agt.indexOf('opera')==-1)   
		&& (agt.indexOf('konqueror')==-1)
		&& (agt.indexOf('safari')==-1)
                && (agt.indexOf('webtv')==-1) 
		&& (agt.indexOf('hotjava')==-1)
		);
if  ((agt.indexOf('mozilla')!=-1) && ((agt.indexOf('konqueror')>=0) || (agt.indexOf('safari')>=0))) {this.nav=true;}

    this.nav2 = (this.nav && (this.major == 2));
    this.nav3 = (this.nav && (this.major == 3));
    this.nav4 = (this.nav && (this.major == 4));
    this.nav4up = (this.nav && (this.major >= 4));
    this.navonly      = (this.nav && ((agt.indexOf(";nav") != -1) ||
                          (agt.indexOf("; nav") != -1)) );
    this.nav6 = (this.nav && (this.major == 5));
    this.nav6up = (this.nav && (this.major >= 5));
    this.gecko = (agt.indexOf('gecko') != -1);
    this.ie     = ((agt.indexOf("msie") != -1) && (agt.indexOf("opera") == -1));
    this.ie3    = (this.ie && (this.major < 4));
    this.ie4    = (this.ie && (this.major == 4) && (agt.indexOf("msie 4")!=-1) );
    this.ie4up  = (this.ie && (this.major >= 4));
    this.ie5    = (this.ie && (this.major == 4) && (agt.indexOf("msie 5.0")!=-1) );
    this.ie5_5  = (this.ie && (this.major == 4) && (agt.indexOf("msie 5.5") !=-1));
    this.ie5up  = (this.ie && !this.ie3 && !this.ie4);
    this.ie5_5up =(this.ie && !this.ie3 && !this.ie4 && !this.ie5);
    this.ie6    = (this.ie && (this.major == 4) && (agt.indexOf("msie 6.")!=-1) );
    this.ie6up  = (this.ie && !this.ie3 && !this.ie4 && !this.ie5 && !this.ie5_5);
    this.aol   = (agt.indexOf("aol") != -1);
    this.aol3  = (this.aol && this.ie3);
    this.aol4  = (this.aol && this.ie4);
    this.aol5  = (agt.indexOf("aol 5") != -1);
    this.aol6  = (agt.indexOf("aol 6") != -1);
    this.opera = (agt.indexOf("opera") != -1);
    this.opera2 = (agt.indexOf("opera 2") != -1 || agt.indexOf("opera/2") != -1);
    this.opera3 = (agt.indexOf("opera 3") != -1 || agt.indexOf("opera/3") != -1);
    this.opera4 = (agt.indexOf("opera 4") != -1 || agt.indexOf("opera/4") != -1);
    this.opera5 = (agt.indexOf("opera 5") != -1 || agt.indexOf("opera/5") != -1);
    this.opera6 = (agt.indexOf("opera 6") != -1 || agt.indexOf("opera/6") != -1);
    this.opera7 = (agt.indexOf("opera 7") != -1 || agt.indexOf("opera/7") != -1);
    this.opera7up = (this.opera && !this.opera2 && !this.opera3 && !this.opera4 && !this.opera5 && !this.opera6 && !this.opera7 );
    this.webtv = (agt.indexOf("webtv") != -1); 
    this.TVNavigator = ((agt.indexOf("navio") != -1) || (agt.indexOf("navio_aoltv") != -1)); 
    this.AOLTV = this.TVNavigator;
    this.hotjava = (agt.indexOf("hotjava") != -1);
    this.hotjava3 = (this.hotjava && (this.major == 3));
    this.hotjava3up = (this.hotjava && (this.major >= 3));
    this.konqueror=   (agt.indexOf("konqueror") != -1);
    this.safari=   (agt.indexOf("safari") != -1);
}
// --------------------------------------------
function handleKeys(e)
{

var key=(window.event)?event : e;
if(key.altKey || key.ctrlKey) return true;

var theKey
theKey = e.which
//if (e.which==96) geoobj.checked = !geoobj.checked;
//var i=formobj.value.length - 1;
//if (e.which==96) { var f=e.target; var g=f.selectionStart; f.value=f.value.substring(0, f.selectionStart)+""+ f.value.substring(f.selectionStart); f.setSelectionRange(g,g); return false;}


//if (geoobj.checked )
//if (e.target.name.indexOf("geo")==-1)
  //  return;

if(lgeo==0)
{
// --------------------------------------------
	for (i=0; i<=geo.length; i++){
		if (eng[i]==e.which){
// --------------------------------------------
			var f=e.target; 
			var g=f.selectionStart;  // --------------------------------------------
			f.value=f.value.substring(0, f.selectionStart) // --------------------------------------------
				+String.fromCharCode(geo[i])	// --------------------------------------------
				+f.value.substring(f.selectionEnd);  // --------------------------------------------

			//f.value+=String.fromCharCode(geo[i]);
			g++; 
			f.setSelectionRange(g,g); 
			return false;
		}
	}
// --------------------------------------------
status=theKey;
}
return true;
}
//----------------------------------------------------
function changeVal()
{
   // formobj2=document.INPUT_TEXT.Post;
   // geoobj2=document.INPUT_TEXT.geo;
   
   // formobj2=document.form1.keyword;
   // geoobj2=document.aspnetForm.geo;

//formobj=formobj2;
//geoobj=geoobj2;
lgeo = 0;

var is=new Is();
//|| (is.opera && !is.opera7up)
if (is.konqueror && formobj.value=='') {formobj.value=" ";} // --------------------------------------------

//if (is.ie4up)  
//{
//    if (event.keyCode==96)
//           geoobj.checked = geoobj.checked ? false : true;
//    if (event.keyCode==96) event.keyCode=''; 
//} 
//else 
//if (is.nav6up || is.konqueror || is.safari) {	// --------------------------------------------
//	// alert("Unfortunately your browser is not supported");
//	document.onkeypress = handleKeys;
//}
if (true)
{
if (is.ie4up || (is.opera && !is.opera7up))  {	// --------------------------------------------
var theKey
theKey=event.keyCode
	// --------------------------------------------
	for (i=0; i<=geo.length; i++){
		if (eng[i]==event.keyCode) {
			event.keyCode=geo[i];
		}
	}
	// --------------------------------------------
status = theKey;
}
else if (is.nav6up  || is.opera ) {  // --------------------------------------------
//       document.captureEvents(Event.KEYPRESS) ;
        document.onkeypress = handleKeys;
} else {
    alert("We doesn't currently support your browser");
   // geoobj.checked=false;
  }
 }
}
//----------------------------------------------------