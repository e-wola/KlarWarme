const fs=require('fs'),vm=require('vm'),assert=require('assert'),path=require('path');
const base=path.resolve(__dirname,'../assets/js');
class Elem{
 constructor(){this.attrs={};this.listeners={};this.className='';this.textContent='';this.children=[];this.hidden=false;this.disabled=false;this.style={};this.value='';this.dataset={};this.classSet=new Set();this.classList={add:(n)=>this.classSet.add(n),remove:(n)=>this.classSet.delete(n),contains:(n)=>this.classSet.has(n),toggle:(n,on)=>{if(on===undefined)on=!this.classSet.has(n);on?this.classSet.add(n):this.classSet.delete(n);return on;}}}
 setAttribute(k,v){this.attrs[k]=v;}getAttribute(k){return this.attrs[k];}
 addEventListener(type,fn){this.listeners[type]=fn;}fire(type,e={}){return this.listeners[type]?.({...e,preventDefault:()=>{}});}
 append(...v){this.children.push(...v);}replaceChildren(...v){this.children=[...v];}
 focus(){this.focused=true;}click(){this.clicked=true;}remove(){this.removed=true;}
}
function testCheck(){
 const steps=Array.from({length:5},(_,i)=>{
   const el=new Elem();el.dataset.step=String(i+1);el.h3=new Elem();el.input={name:['building','year','system','emitters','insulation'][i],value:['Einfamilienhaus','Ab 2010','Gasheizung','Fußbodenheizung','Gut saniert'][i],focus(){}};
   el.querySelector=q=>q==='input:checked'||q==='input'?el.input:q==='h3'?el.h3:null;return el;
 });
 const next=new Elem(),back=new Elem(),label=new Elem(),bar=new Elem(),err=new Elem(),controls=new Elem(),result=new Elem(),restart=new Elem(),title=new Elem(),copy=new Elem(),summary=new Elem();
 const map={'[data-next]':next,'[data-back]':back,'[data-progress-label]':label,'[data-progress-bar]':bar,'[data-error]':err,'.tool-controls':controls,'[data-result]':result,'[data-restart]':restart,'[data-result-title]':title,'[data-result-copy]':copy,'[data-result-summary]':summary};
 const app=new Elem();app.querySelector=q=>map[q];app.querySelectorAll=q=>q==='[data-step]'?steps:steps.map(s=>s.input);
 let domLoad;const document={addEventListener:(t,f)=>domLoad=f,querySelector:q=>q==='[data-check]'?app:null,querySelectorAll:()=>[],createElement:()=>new Elem()};
 vm.runInNewContext(fs.readFileSync(base+'/tools.js','utf8'),{document,window:{},console,FormData:class{},URL,Blob,setTimeout});domLoad();
 assert.equal(label.textContent,'FRAGE 01 / 05');assert.equal(back.disabled,true);
 for(let i=0;i<5;i++){next.fire('click');if(i<4)assert.equal(label.textContent,`FRAGE 0${i+2} / 05`)}
 assert.equal(result.hidden,false);assert.equal(controls.hidden,true);assert.equal(title.textContent,'Mehrere günstige Ausgangspunkte erkennbar.');assert(summary.textContent.includes('Fußbodenheizung'));assert(result.focused);
 restart.fire('click');assert.equal(label.textContent,'FRAGE 01 / 05');assert.equal(result.hidden,true);
 return 'heat-check steps, result, focus and restart';
}
async function testForm(){
 const feedback=new Elem(),submit=new Elem(),form=new Elem(),name=new Elem();name.files=[];
 const fieldData=[['service','Wärmepumpe'],['name','Testperson'],['email','test@example.com'],['message','Frage'],['consent','on']];
 form.reportValidity=()=>true;form.querySelector=q=>({'[data-feedback]':feedback,'[data-files]':name,'[type="submit"]':submit,'[data-file-list]':null})[q]||null;
 const document={addEventListener:(t,fn)=>document.start=fn,querySelector:q=>null,querySelectorAll:q=>q==='[data-enquiry-form]'?[form]:q==='[data-enquiry-form] [type="submit"]'?[submit]:[],createElement:()=>new Elem(),body:new Elem()};
 class FormDataMock{constructor(){}entries(){return fieldData[Symbol.iterator]();}}
 vm.runInNewContext(fs.readFileSync(base+'/tools.js','utf8'),{document,window:{KLARWAERME_CONFIG:{formEndpoint:''}},console,FormData:FormDataMock,URL,Blob,setTimeout,navigator:{clipboard:{writeText:async()=>{}}}});
 document.start();await form.fire('submit');
 assert.equal(feedback.className,'form-feedback demo-feedback');
 assert(feedback.children.some(x=>String(x.textContent).includes('nichts gesendet')));
 assert(feedback.children.some(x=>String(x.textContent).includes('Testperson')));
 assert(!submit.disabled);
 return 'demo enquiry form: validated local summary, no false server success';
}
function testFilterNav(){
 const nav=new Elem(),toggle=new Elem(),services=new Elem(),item=new Elem(),header=new Elem(),year=new Elem();
 let link=new Elem();nav.querySelector=q=>q==='a'?link:null;nav.querySelectorAll=()=>[link];nav.contains=()=>false;
 services.closest=()=>item;item.contains=()=>false;
 const filterAll=new Elem(),filterHeat=new Elem(),tile1=new Elem(),tile2=new Elem();filterAll.dataset.filter='all';filterHeat.dataset.filter='heat';tile1.dataset.category='heat';tile2.dataset.category='bath';
 let domLoad,keyboard,pointer;
 const document={addEventListener:(name,fn)=>{if(name==='DOMContentLoaded')domLoad=fn;if(name==='keydown')keyboard=fn;if(name==='pointerdown')pointer=fn;},querySelector:q=>({'[data-header]':header,'[data-nav]':nav,'[data-menu-toggle]':toggle,'[data-service-toggle]':services,'[data-year]':year})[q]||null,querySelectorAll:q=>q==='[data-filter]'?[filterAll,filterHeat]:q==='[data-projects] [data-category]'?[tile1,tile2]:[]};
 let mql={matches:true,addEventListener:()=>{}};
 const win={IntersectionObserver:undefined};
 vm.runInNewContext(fs.readFileSync(base+'/main.js','utf8'),{document,window:win,matchMedia:()=>mql,addEventListener:()=>{},scrollY:0,URLSearchParams,location:{search:''},Date,console});domLoad();
 toggle.fire('click');assert(nav.classList.contains('open'));assert.equal(toggle.getAttribute('aria-expanded'),'true');
 services.fire('click');assert(item.classList.contains('open'));
 keyboard({key:'Escape'});assert(!nav.classList.contains('open'));assert.equal(toggle.getAttribute('aria-expanded'),'false');assert(toggle.focused);
 filterHeat.fire('click');assert.equal(tile1.hidden,false);assert.equal(tile2.hidden,true);assert.equal(filterHeat.getAttribute('aria-pressed'),'true');
 return 'menu, dropdown, escape/focus and gallery filters';
}

async function testReminderAndFunding(){
 const feedback=new Elem(),date=new Elem(),form=new Elem(),title=new Elem();
 date.value='2099-01-01';title.value='Heizung prüfen';
 form.querySelector=q=>({'[name="reminderDate"]':date,'[name="reminderTitle"]':title,'[data-reminder-feedback]':feedback})[q]||null;
 const fundResult=new Elem(),fund=new Elem();fund.reportValidity=()=>true;fund.querySelector=q=>q==='[data-funding-result]'?fundResult:null;
 const document={addEventListener:(t,fn)=>document.start=fn,querySelector:()=>null,querySelectorAll:q=>q==='[data-reminder-form]'?[form]:q==='[data-funding-check]'?[fund]:[],createElement:()=>new Elem(),body:new Elem()};
 class FormDataMock{get(key){return {owner:'Ja',existing:'Ja',contracted:'Nein'}[key]}}
 let blob;
 const U={createObjectURL:b=>{blob=b;return 'blob:test';},revokeObjectURL:()=>{}};
 vm.runInNewContext(fs.readFileSync(base+'/tools.js','utf8'),{document,window:{},console,FormData:FormDataMock,URL:U,Blob,setTimeout:()=>{}});document.start();
 form.fire('submit');assert.equal(feedback.className,'form-feedback success');assert(blob);
 const txt=await blob.text();assert(txt.includes('DTSTART:20990101T090000'));assert(txt.includes('DTSTAMP:'));assert(txt.includes('Keine Terminbuchung'));
 fund.fire('submit');assert.equal(fundResult.hidden,false);assert(fundResult.children.some(x=>x.tagName!=='a'));assert(fundResult.focused);
 return 'ICS date output and funding checklist creation';
}
function testFileValidation(){
 const target=new Elem(),input=new Elem();input.files=[{type:'image/jpeg',size:2*1024*1024,name:'a.jpg'}];input.closest=()=>({querySelector:q=>q==='[data-file-list]'?target:null});
 const document={addEventListener:(t,fn)=>document.start=fn,querySelector:()=>null,querySelectorAll:q=>q==='[data-files]'?[input]:[],createElement:()=>new Elem()};
 vm.runInNewContext(fs.readFileSync(base+'/tools.js','utf8'),{document,window:{},console,FormData:class{},URL,Blob,setTimeout});document.start();
 input.fire('change');assert(target.textContent.includes('a.jpg'));assert(!target.classList.contains('file-error'));
 input.files=[{type:'application/x-msdownload',size:800,name:'unsafe.exe'}];input.fire('change');assert(target.classList.contains('file-error'));assert.equal(input.value,'');
 return 'file accept, size/type validation state';
}
(async()=>{for(const t of [testCheck,testFilterNav,testForm,testReminderAndFunding,testFileValidation]){const r=await t();console.log('PASS',r)} console.log('BEHAVIOR_TESTS',5,'passed');})().catch(e=>{console.error('FAIL',e);process.exit(1)});
