//MINE - JavaScript

var Level;
var MINE = 9;
var firstClick;
var ClickTimes;
var IsDead;
var IsWin;
var TX;
var TY;
var MineNum;
var MineArray;
var ZoneLength;
var Zone;
var State;
var MyTimer;
var TimeSum;
var PrimaryScore=0;
var MiddleScore=0;
var SeniorScore=0;
var ColorArray = new Array('#f7f7f5', '#0000ff', '#008000', '#ff0000', '#000080', '#800000', '#008080', '#000000', '#808080', '#000000');

function ReSize(x){
   var mainUI=Element("mianUI");
    PlaySound(4);
    TimerStop();

    mainUI.removeChild(Element("tableOfMine"));   
    DrawTable(x);
    DisplayInit();
}

function DisplayInit(){
    Element("state").src="img/smile.gif";
    DisplayInfo("MineNum","MineNum",MineNum);    
    DisplayInfo("Timer","TIME",TimeSum);
    DisplayInfo("ClickTimes","ClickTimes",ClickTimes);
    DisplayInfo("TheRest","TheRest",(TX*TY-MineNum-ClickTimes));  
    DisplayInfo("Primary","Primary",PrimaryScore);
    DisplayInfo("Middle","Middle",MiddleScore);
    DisplayInfo("Senior","Senior",SeniorScore);
}

function DrawTable(x) {
    SetLevel(x);
    var mainUI=Element("mianUI");
    var newTable=document.createElement('table');
    newTable.id="tableOfMine";
    for(var i=0;i<TY;i++){
        var newRow=newTable.insertRow(-1);
        for(var j=0;j<TX;j++){
            var cell=newRow.insertCell(-1);
            var index=i * TX + j + 1;
            cell.id='Cell_'+ index;
            cell.onclick=function(){Response(this.id)};   
        }
    }
    mainUI.appendChild(newTable);      
}

function Customize(){
}


function SetLevel(le){
    if(le<=3 && le>=0)
        Level=le;
    switch(Level){
        case 0:Customize();break;
        case 1:TX =  9; TY =  9; MineNum = 10; break;
        case 2:TX = 16; TY = 16; MineNum = 40; break;
        case 3:TX = 30; TY = 16; MineNum = 99; break;
        default:;
    }
    MineArray = new Array(TX * TY);
    ZoneLength = TX * TY - MineNum;
    Zone = new Array(ZoneLength);
    State = new Array(TX * TY);

    firstClick = 0;
    ClickTimes = 0;
    TimeSum = 0;
    IsDead = false;
    IsWin = false;
}

function Element(x) {
    return document.getElementById(x);
}

function Initial() {
    for (var i = 0; i < TX * TY; i++) {
        MineArray[i] = 0;
        State[i] = 0;
    }
}

function Response(x) {
    x=parseInt(x.substring(5));

    if (IsWin == true || IsDead == true || State[x-1]==1)
        return;

    if (firstClick == 0) {
        firstClick = x;
        SetMine();
        TimerStart();
    }
    Click(x);

    if (ClickTimes == TX * TY - MineNum) {//Succeed
        PlaySound(3);
        TimerStop();
        Element("state").src="img/cool.gif";
        IsWin = true;
        for (var i = 0; i < TX * TY; i++) {
            if (MineArray[i] == MINE) {
                ++i;
                Element("Cell_" + i--).style.backgroundColor = ColorArray[2];
            }
        }
        switch(Level){
            case 1:
                if(TimeSum<PrimaryScore || PrimaryScore==0)
                    PrimaryScore = TimeSum;
                DisplayInfo("Primary","Primary",PrimaryScore);
                break;
            case 2:
                if(TimeSum<MiddleScore || MiddleScore==0)
                    MiddleScore = TimeSum;
                DisplayInfo("Middle","Middle",MiddleScore);
                break;                      
            case 3:
                if(TimeSum<SeniorScore || SeniorScore==0)
                    SeniorScore = TimeSum;
                DisplayInfo("Senior","Senior",SeniorScore);
                break;                                
            default:
                break;
        }
    }

    if (MineArray[x - 1] == 0) {
        CleanZone(x);
        PlaySound(1);
    }
}

function PlaySound(x) {
    switch (x) {
        case 1:
            Element("backSound").data = "sound/click.wav";
            break;
        case 2:
            Element("backSound").data = "sound/boom2.wav";
            break;
        case 3:
            Element("backSound").data = "sound/succeed.wav";
            break;
        case 4:
            Element("backSound").data = "sound/fresh.wav";            
            break;
    }
}

function TimerStart() {
    TimeSum=0;
    DisplayInfo("Timer","TIME",++TimeSum);
    MyTimer = setInterval(function () { TimeOut(); }, 1000);
}

function TimeOut() {
    if(TimeSum<999)
        DisplayInfo("Timer","TIME",++TimeSum);
}

function TimerStop() {
    clearInterval(MyTimer);
}

function Click(x) {
    if (State[x - 1] == 1 || IsDead == true)
        return;

    var object = Element("Cell_" + x);
    object.style.color = ColorArray[MineArray[--x]];
    object.style.backgroundColor = ColorArray[0];

    if (MineArray[x] == MINE) {     //Clicked MINE
        for (var i = 0; i < TX * TY; i++) {
            if (MineArray[i] == MINE) {
                ++i;
                Element("Cell_" + i--).style.backgroundColor = ColorArray[3];
            }
        }
        IsDead = true;
        PlaySound(2);
        Element("state").src="img/cry.gif";
        TimerStop();        
    } 
    else if (MineArray[x] != 0) { //Clicked Number
        State[x] = 1;
        ClickTimes++;
        object.innerHTML = MineArray[x];
        DisplayInfo("ClickTimes","ClickTimes",ClickTimes);
        DisplayInfo("TheRest","TheRest",(TX*TY-MineNum-ClickTimes));     
        PlaySound(1);
    } 
    else {                        //Clicked Blank
        State[x] = 1;
        ClickTimes++;
        DisplayInfo("ClickTimes","ClickTimes",ClickTimes);
        DisplayInfo("TheRest","TheRest",(TX*TY-MineNum-ClickTimes));        
    }
}

function RecordInZone(position, i) {
    if (MineArray[position] == 0) {
        var exis = false;
        for (var k = 1; k <= Zone[0]; k++) {
            if (position == Zone[k]) {
                exis = true;
                break;
            }
        }
        if (exis == false) {
            Zone[i++] = position;
            Zone[0]++;
        }
    }
    Click(position + 1);
    return i;
}

function CleanZone(x) {
    var k;
    var i;
    var position;

    --x;
    Zone[0] = 0;
    for (i = 1, k = 1; k <= i; k++) {

        position = x - TX; //N
        if (position >= 0)
            i = RecordInZone(position, i);

        position = x - TX + 1; //NE
        if (position >= 0 && position % TX != 0)
            i = RecordInZone(position, i);

        position = x + 1; //E
        if (position % TX != 0)
            i = RecordInZone(position, i);

        position = x + TX + 1; //SE
        if (position < TX * TY && position % TX != 0)
            i = RecordInZone(position, i);

        position = x + TX; //S
        if (position < TX * TY)
            i = RecordInZone(position, i);

        position = x + TX - 1; //SW
        if (position < TX * TY && position % TX != TX - 1)
            i = RecordInZone(position, i);

        position = x - 1; //W
        if (position % TX != TX - 1 && position > 0)
            i = RecordInZone(position, i);

        position = x - TX - 1; //NW
        if (position >= 0 && position % TX != TX - 1)
            i = RecordInZone(position, i);

        if (i > k)
            x = Zone[k];
        else
            break;
    }
}

function DisplayInfo(obj,info,data) {
    Element(obj).innerHTML = (" "+info+" : " + data);
}

function SetMine() {
    Initial();
    if (MineNum < 0 || MineNum >= TX * TY){
         IsDead=true;
         alert("MineNum Error!");
         return;
    }
    for (var index, i = 0; i < MineNum; i++) {
        index = parseInt(Math.random() * TX * TY);
        if (index < TX * TY && MineArray[index] != MINE && index != firstClick - 1)
            MineArray[index] = MINE;
        else
            --i;
    }
    MarkMine();
}

function MarkMine() {
    var index = 0;
    var position = 0;

    //Mark Number
    for (index = 0; index < TX * TY; ++index) {
        if (MineArray[index] != MINE)
            continue;

        position = index - TX; //N
        if (position >= 0)
            MarkNum(position);

        position = index - TX + 1; //NE
        if (position >= 0 && position % TX != 0)
            MarkNum(position);

        position = index + 1; //E
        if (position % TX != 0)
            MarkNum(position);

        position = index + TX + 1; //SE
        if (position < TX * TY && position % TX != 0)
            MarkNum(position);

        position = index + TX; //S
        if (position < TX * TY)
            MarkNum(position);

        position = index + TX - 1; //SW
        if (position < TX * TY && position % TX != TX - 1)
            MarkNum(position);

        position = index - 1; //W
        if (position % TX != TX - 1 && position >= 0)
            MarkNum(position);

        position = index - TX - 1; //NW
        if (position >= 0 && position % TX != TX - 1)
            MarkNum(position);
    }
}

function MarkNum(position) {
    if (MineArray[position] != MINE)
        MineArray[position] += 1;
}