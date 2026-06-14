
var S={
  foods:[],cal:0,prot:0,carbs:0,fat:0,
  goal:2000,gP:150,gC:250,gF:67,
  water:0,
  profile:null,
  streak:[true,true,true,true,true,false,false]
};

var QUICK=[
  {n:'White rice (1 cup)',cal:206,p:4,c:45,f:0,fi:1},
  {n:'Grilled chicken (100g)',cal:165,p:31,c:0,f:4,fi:0},
  {n:'Banana',cal:89,p:1,c:23,f:0,fi:3},
  {n:'Egg (boiled)',cal:78,p:6,c:1,f:5,fi:0},
  {n:'Bread (1 slice)',cal:79,p:3,c:15,f:1,fi:1},
  {n:'Peanuts (30g)',cal:170,p:7,c:5,f:15,fi:2},
  {n:'Whole milk (250ml)',cal:149,p:8,c:12,f:8,fi:0},
  {n:'Orange',cal:62,p:1,c:15,f:0,fi:3},
  {n:'Avocado (half)',cal:120,p:2,c:6,f:11,fi:5},
  {n:'Sweet potato',cal:103,p:2,c:24,f:0,fi:4}
];

function goPage(p){
  document.querySelectorAll('.page').forEach(function(el){el.classList.remove('active')});
  document.querySelectorAll('.nav-btn').forEach(function(el){el.classList.remove('active')});
  document.getElementById('page-'+p).classList.add('active');
  document.getElementById('nav-'+p).classList.add('active');
}

function addFood(){
  var name=document.getElementById('f-name').value.trim();
  var cal=parseFloat(document.getElementById('f-cal').value)||0;
  var p=parseFloat(document.getElementById('f-p').value)||0;
  var c=parseFloat(document.getElementById('f-c').value)||0;
  var f=parseFloat(document.getElementById('f-f').value)||0;
  var fi=parseFloat(document.getElementById('f-fi').value)||0;
  var meal=document.getElementById('f-meal').value;
  if(!name||!cal){document.getElementById('log-msg').textContent='Name and calories required.';return}
  S.foods.push({name:name,cal:cal,p:p,c:c,f:f,fi:fi,meal:meal});
  S.cal+=cal;S.prot+=p;S.carbs+=c;S.fat+=f;
  ['f-name','f-cal','f-p','f-c','f-f','f-fi'].forEach(function(id){document.getElementById(id).value=''});
  document.getElementById('log-msg').textContent='\u2713 '+name+' added ('+cal+' kcal)';
  setTimeout(function(){document.getElementById('log-msg').textContent=''},2000);
  renderAll();
}

function quickAdd(i){
  var q=QUICK[i];
  S.foods.push({name:q.n,cal:q.cal,p:q.p,c:q.c,f:q.f,fi:q.fi,meal:'Snack'});
  S.cal+=q.cal;S.prot+=q.p;S.carbs+=q.c;S.fat+=q.f;
  renderAll();
}

function removeFood(i){
  var it=S.foods[i];
  S.cal-=it.cal;S.prot-=it.p;S.carbs-=it.c;S.fat-=it.f;
  S.foods.splice(i,1);
  renderAll();
}

function renderAll(){
  renderRing();renderMacros();renderStats();renderFoodLists();
}

function renderRing(){
  var pct=Math.min(S.cal/S.goal,1);
  var circ=490;
  document.getElementById('ring-dash').setAttribute('stroke-dashoffset',Math.round(circ-(pct*circ)));
  document.getElementById('ring-eaten').textContent=Math.round(S.cal);
  var rem=S.goal-Math.round(S.cal);
  document.getElementById('ring-remaining').textContent=rem>0?rem+' kcal left':'Goal reached!';
  if(rem<0){document.getElementById('ring-dash').setAttribute('stroke','#F87171');}
  else{document.getElementById('ring-dash').setAttribute('stroke','#4ADE80');}
}

function renderMacros(){
  document.getElementById('mp-p').textContent=Math.round(S.prot)+'g';
  document.getElementById('mp-c').textContent=Math.round(S.carbs)+'g';
  document.getElementById('mp-f').textContent=Math.round(S.fat)+'g';
  document.getElementById('mg-p').textContent='/ '+S.gP+'g';
  document.getElementById('mg-c').textContent='/ '+S.gC+'g';
  document.getElementById('mg-f').textContent='/ '+S.gF+'g';
  document.getElementById('mb-p').style.width=Math.min(S.prot/S.gP*100,100)+'%';
  document.getElementById('mb-c').style.width=Math.min(S.carbs/S.gC*100,100)+'%';
  document.getElementById('mb-f').style.width=Math.min(S.fat/S.gF*100,100)+'%';
}

function renderStats(){
  document.getElementById('s-goal').innerHTML=S.goal+'<span class="stat-unit"> kcal</span>';
  document.getElementById('s-meals').innerHTML=S.foods.length+'<span class="stat-unit"> logged</span>';
  document.getElementById('s-water').innerHTML=(S.water*250)+'<span class="stat-unit"> ml</span>';
}

function renderFoodLists(){
  var groups={Breakfast:[],Lunch:[],Dinner:[],Snack:[]};
  S.foods.forEach(function(f,i){(groups[f.meal]||(groups['Snack'])).push({...f,idx:i})});
  function makeList(containerId){
    var html='';
    var total=0;
    Object.keys(groups).forEach(function(meal){
      var items=groups[meal];
      if(!items.length)return;
      var mCal=items.reduce(function(a,b){return a+b.cal},0);
      total+=mCal;
      html+='<div class="meal-group"><div class="meal-group-hdr"><span>'+meal+'</span><span style="color:var(--text3)">'+Math.round(mCal)+' kcal</span></div>';
      items.forEach(function(f){
        html+='<div class="meal-item"><div><div class="meal-item-name">'+f.name+'</div><div class="meal-item-macro">P:'+f.p+'g C:'+f.c+'g F:'+f.f+'g</div></div><div class="meal-item-right"><div class="meal-item-cal">'+f.cal+'</div><button class="del-btn" onclick="removeFood('+f.idx+')" aria-label="Remove '+f.name+'"><i class="ti ti-x" aria-hidden="true"></i></button></div></div>';
      });
      html+='</div>';
    });
    if(!html)html='<div class="empty-state">Nothing logged yet. Tap + Add to get started.</div>';
    document.getElementById(containerId).innerHTML=html;
  }
  makeList('home-food-list');
  makeList('log-food-list');
}

function initWater(){
  var html='';
  for(var i=0;i<8;i++){html+='<div class="wcup" id="wc'+i+'" onclick="setWater('+(i+1)+')" aria-label="Cup '+(i+1)+'"><i class="ti ti-droplet" aria-hidden="true"></i></div>';}
  document.getElementById('water-cups').innerHTML=html;
}

function setWater(n){
  S.water=S.water===n?n-1:n;
  for(var i=0;i<8;i++){document.getElementById('wc'+i).classList.toggle('on',i<S.water);}
  document.getElementById('water-label').textContent=(S.water*250)+' / 2000 ml';
  document.getElementById('s-water').innerHTML=(S.water*250)+'<span class="stat-unit"> ml</span>';
}

function initStreak(){
  var days=['M','T','W','T','F','S','S'];
  var html='';
  S.streak.forEach(function(done,i){
    var isTodayDay=(i===4);
    html+='<div class="sday"><div class="sday-label">'+days[i]+'</div><div class="sday-dot'+(done?' on':'')+(isTodayDay&&!done?' today':'')+'">'+( done?'<i class="ti ti-check" aria-hidden="true" style="font-size:11px"></i>':'')+'</div></div>';
  });
  document.getElementById('streak-row').innerHTML=html;
}

function initQuick(){
  var html=QUICK.map(function(q,i){
    return '<button class="qbtn" onclick="quickAdd('+i+')"><span class="qbtn-name">'+q.n+'</span><span class="qbtn-cal">'+q.cal+' kcal</span></button>';
  }).join('');
  document.getElementById('quick-grid').innerHTML=html;
}

function initDate(){
  var d=new Date();
  var days=['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
  var months=['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  document.getElementById('hdr-date').textContent=days[d.getDay()]+', '+months[d.getMonth()]+' '+d.getDate();
}

function calcProfile(){
  var age=parseFloat(document.getElementById('p-age').value);
  var sex=document.getElementById('p-sex').value;
  var h=parseFloat(document.getElementById('p-h').value);
  var w=parseFloat(document.getElementById('p-w').value);
  var act=parseFloat(document.getElementById('p-act').value);
  var goal=document.getElementById('p-goal').value;
  if(!age||!h||!w){alert('Fill in all fields first.');return}
  var bmr=sex==='male'?(10*w)+(6.25*h)-(5*age)+5:(10*w)+(6.25*h)-(5*age)-161;
  var tdee=Math.round(bmr*act);
  var bmi=parseFloat((w/((h/100)*(h/100))).toFixed(1));
  var bmiCat=bmi<18.5?'Underweight':bmi<25?'Normal weight':bmi<30?'Overweight':'Obese';
  var bmiColor=bmi<18.5?'#60A5FA':bmi<25?'#4ADE80':bmi<30?'#FBBF24':'#F87171';
  var ideal=Math.round(22*((h/100)*(h/100)));
  var tCal=goal==='lose'?tdee-500:goal==='gain'?tdee+300:tdee;
  var gP=Math.round(w*2);
  var gF=Math.round(tCal*0.25/9);
  var gC=Math.round((tCal-gP*4-gF*9)/4);
  S.goal=tCal;S.gP=gP;S.gC=gC;S.gF=gF;
  S.profile={age:age,sex:sex,h:h,w:w,act:act,goal:goal,bmr:Math.round(bmr),tdee:tdee,bmi:bmi,bmiCat:bmiCat,bmiColor:bmiColor,ideal:ideal,tCal:tCal,gP:gP,gC:gC,gF:gF};
  document.getElementById('ps-bmr').innerHTML=Math.round(bmr)+'<span class="stat-unit"> kcal</span>';
  document.getElementById('ps-tdee').innerHTML=tdee+'<span class="stat-unit"> kcal</span>';
  document.getElementById('ps-bmi').textContent=bmi;
  document.getElementById('ps-bmi-cat').innerHTML='<span style="color:'+bmiColor+'">'+bmiCat+'</span>';
  document.getElementById('ps-ideal').innerHTML=ideal+'<span class="stat-unit"> kg</span>';
  var bmiPct=Math.min(Math.max((bmi-14)/22,0),1)*100;
  var segColor=bmi<18.5?'linear-gradient(90deg,#60A5FA 33%,#1E293B 33%)':bmi<25?'linear-gradient(90deg,#60A5FA 25%,#4ADE80 25%,#4ADE80 55%,#1E293B 55%)':bmi<30?'linear-gradient(90deg,#60A5FA 25%,#4ADE80 25%,#4ADE80 55%,#FBBF24 55%,#FBBF24 75%,#1E293B 75%)':'linear-gradient(90deg,#60A5FA 25%,#4ADE80 25%,#4ADE80 55%,#FBBF24 55%,#FBBF24 75%,#F87171 75%)';
  document.getElementById('bmi-fill').style.cssText='width:100%;height:100%;background:'+segColor;
  document.getElementById('bmi-ptr').style.left='calc('+bmiPct+'% - 1px)';
  document.getElementById('profile-stats').style.display='';
  document.getElementById('s-bmi').innerHTML=bmi+'<span class="stat-unit"></span>';
  document.getElementById('s-bmi-cat').innerHTML='<span style="color:'+bmiColor+'">'+bmiCat+'</span>';
  renderPlan();renderAll();
}

function renderPlan(){
  var p=S.profile;
  if(!p){return}
  document.getElementById('plan-empty').style.display='none';
  document.getElementById('plan-body').style.display='';
  document.getElementById('pl-cal').textContent=p.tCal+' kcal';
  var gDesc=p.goal==='lose'?'Fat loss: TDEE − 500 kcal (~0.5 kg/week)':p.goal==='gain'?'Muscle gain: TDEE + 300 kcal':'Maintenance: matches your TDEE';
  document.getElementById('pl-goal-desc').textContent=gDesc;
  document.getElementById('pl-p').textContent=p.gP;
  document.getElementById('pl-c').textContent=p.gC;
  document.getElementById('pl-f').textContent=p.gF;
  var bmiTip=p.bmi<18.5?'<strong>Underweight:</strong> Focus on calorie-dense whole foods — nut butters, avocado, whole milk, legumes. Aim to gain 0.25–0.5 kg per week.':p.bmi<25?'<strong>Healthy BMI:</strong> Maintain your balance with consistent meals and regular activity. Your current approach is working.':p.bmi<30?'<strong>Overweight:</strong> A 500 kcal daily deficit is safe and sustainable. Prioritize protein and fiber to stay full longer.':'<strong>Obese range:</strong> A moderate deficit paired with increased movement is the safest path. Consider speaking with a doctor or dietitian.';
  var ageTip=p.age<18?'<strong>Growing body:</strong> As a teenager, never drop below 1,500 kcal. Prioritize calcium-rich foods and protein to support bone and muscle development.':p.age>50?'<strong>50+ nutrition:</strong> Protein needs increase after 50 to prevent muscle loss. Aim for '+p.gP+'g minimum and include strength training.':'<strong>Protein target:</strong> Aim for '+p.gP+'g of protein per day — roughly '+Math.round(p.gP/3)+'g per meal across 3 meals.';
  var mealTip=p.goal==='lose'?'<strong>Meal timing:</strong> Breakfast 25% · Lunch 35% · Dinner 25% · Snack 15%. Eat most calories earlier in the day to control evening cravings.':p.goal==='gain'?'<strong>Meal timing:</strong> Breakfast 20% · Lunch 25% · Pre-workout 15% · Dinner 30% · Post-workout 10%. Carbs and protein within 30 min after training matter most.':'<strong>Meal timing:</strong> Breakfast 25% · Lunch 35% · Dinner 30% · Snack 10%. Consistent meal times improve satiety and metabolism.';
  document.getElementById('pl-tip1').innerHTML=bmiTip;
  document.getElementById('pl-tip2').innerHTML=ageTip;
  document.getElementById('pl-tip3').innerHTML=mealTip;
}

function askAI(){
  var p=S.profile;
  if(!p){sendPrompt('Create a personalized 7-day meal plan for someone trying to track calories and eat healthily. Include affordable local foods.');return}
  sendPrompt('Create a detailed 7-day meal plan for a '+p.age+'-year-old '+p.sex+', '+p.h+'cm, '+p.w+'kg, goal: '+p.goal+' weight. Daily target: '+p.tCal+' kcal | Protein: '+p.gP+'g | Carbs: '+p.gC+'g | Fat: '+p.gF+'g. Include affordable foods available in Mozambique like rice, beans, vegetables, chicken, fish, and fruit.');
}

initWater();initStreak();initDate();initQuick();renderAll();
