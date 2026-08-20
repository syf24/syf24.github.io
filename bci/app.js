const $=id=>document.getElementById(id);
const hz=[10,12,14], robotTargets=['Banana','Cabbage','Apple'], videoActions=['Pause / Play','Next episode','Previous episode'];
const colors=['#00a98f','#3978f6','#8e6df2','#e8a33c','#ef5d68','#63b84c'];
let cursor=0,timer=null,busy=false,meta=null;

function stamp(){return new Date().toLocaleTimeString('zh-CN',{hour12:false})}
function log(id,message,tone=''){
  const box=$(id),p=document.createElement('p');p.innerHTML=`<time>${stamp()}</time><span class="${tone}">${message}</span>`;box.appendChild(p);box.scrollTop=box.scrollHeight;
  while(box.children.length>18)box.firstElementChild.remove();
}
function setUnityState(view,state){const el=$(view+'State');el.textContent=state;el.classList.toggle('ready',state==='READY')}
function setStage(name){let reached=false;document.querySelectorAll('.flow-node').forEach(node=>{const hit=node.dataset.stage===name;if(hit)reached=true;node.classList.toggle('active',hit);node.classList.toggle('done',!hit&&!reached)})}
const wait=ms=>new Promise(resolve=>setTimeout(resolve,ms));

async function init(){
  meta=await fetch('/api/meta').then(r=>r.json());const s=meta.summary;
  $('model').textContent=meta.model;$('totalTrials').textContent=s.n;$('accuracy').textContent=(s.accuracy*100).toFixed(1);$('latency').textContent=s.mean_latency_ms.toFixed(1);$('acceptedRate').textContent=(s.accepted_rate*100).toFixed(1);
  $('subject').innerHTML='<option value="all">全部8名被试</option>'+meta.subjects.map(x=>`<option value="${x}">${x}</option>`).join('');
  $('subject').value='S6(zy)';drawIdle();setInterval(()=>$('clock').textContent=new Date().toLocaleString('zh-CN',{hour12:false}),1000);
}

async function step(){
  if(busy)return;busy=true;$('step').disabled=true;
  try{
    setStage('eeg');log('robotLog','读取固定测试集中的1秒EEG窗口','muted');log('videoLog','同步接收同一EEG回放窗口','muted');
    const subject=$('subject').value;const data=await fetch(`/api/next?cursor=${cursor}&subject=${encodeURIComponent(subject)}`).then(r=>r.json());cursor=data.next_cursor;
    $('signalSubject').textContent=`${data.subject} · trial ${data.source_trial}`;$('signalInfo').textContent=`P3 · PZ · P4 · O1 · OZ · O2 · ${data.sample_rate} Hz`;drawWave(data.waveform);
    await wait(260);setStage('quality');log('robotLog',`输入校验通过：6 ch × 1000 samples`,'ok');log('videoLog',`窗口同步：subject=${data.subject}`,'ok');
    await wait(300);setStage('decode');log('robotLog',`FBAR-Net：${data.predicted_frequency_hz} Hz，confidence=${data.confidence.toFixed(3)}`,'ok');log('videoLog',`FBAR-Net：class ${data.predicted_index+1}，latency=${data.latency_ms.toFixed(1)} ms`,'ok');
    await wait(300);setStage('gate');const accepted=!!data.accepted;log('robotLog',accepted?'置信度门控：ACCEPTED':'置信度门控：REJECTED',accepted?'ok':'warn');log('videoLog',accepted?'指令允许分发':'低置信度，不发送Unity命令',accepted?'ok':'warn');
    renderDecision(data);
    await wait(300);setStage('dispatch');
    if(accepted){
      const cls=data.predicted_index+1;$('robotFrame').contentWindow.selectTarget(cls,data.confidence);$('videoFrame').contentWindow.selectTarget(cls,data.confidence);
      log('robotLog',`UDP/Web replay → ${data.robot_target}（index ${data.predicted_index}）`,'ok');log('videoLog',`${data.predicted_frequency_hz} Hz → ${data.video_command}`,'ok');
    }else{log('robotLog','机械臂保持空闲','warn');log('videoLog','播放器状态保持不变','warn')}
  }catch(error){log('robotLog',`回放错误：${error.message}`,'error');log('videoLog',`回放错误：${error.message}`,'error')}
  finally{busy=false;$('step').disabled=false}
}

function renderDecision(d){$('frequency').textContent=d.predicted_frequency_hz;$('confidence').textContent=(d.confidence*100).toFixed(1)+'%';$('confidenceBar').style.width=(d.confidence*100)+'%';$('target').textContent=d.robot_target;$('videoCommand').textContent=d.video_command;$('decision').textContent=d.accepted?(d.correct?'通过 · 正确':'通过 · 误分类'):'拒绝';$('decision').style.color=d.accepted?(d.correct?'#20d2b3':'#e8a33c'):'#ef5d68';$('trialLatency').textContent=d.latency_ms.toFixed(1)+' ms'}

function drawWave(series){const c=$('wave'),x=c.getContext('2d'),w=c.width,h=c.height;x.clearRect(0,0,w,h);x.strokeStyle='#dbe4e1';x.lineWidth=1;for(let i=1;i<6;i++){x.beginPath();x.moveTo(0,i*h/6);x.lineTo(w,i*h/6);x.stroke()}series.forEach((arr,ch)=>{const base=(ch+.5)*h/6;x.strokeStyle=colors[ch];x.lineWidth=1.45;x.beginPath();arr.forEach((v,i)=>{const px=i/(arr.length-1)*w,py=base-v*h/27;i?x.lineTo(px,py):x.moveTo(px,py)});x.stroke()})}
function drawIdle(){const data=Array.from({length:6},(_,ch)=>Array.from({length:180},(_,i)=>Math.sin(i*.12+ch)*.05));drawWave(data)}
function stop(){if(timer)clearInterval(timer);timer=null;$('play').classList.remove('running');$('play').innerHTML='<i></i>开始伪在线'}
function play(){stop();step();timer=setInterval(step,+$('speed').value);$('play').classList.add('running');$('play').innerHTML='<i></i>暂停回放'}
function reset(){stop();cursor=0;setStage('eeg');['robotLog','videoLog'].forEach(id=>$(id).innerHTML='');log('robotLog','系统复位，等待EEG回放','muted');log('videoLog','系统复位，等待EEG回放','muted');$('frequency').textContent='—';$('confidence').textContent='—';$('confidenceBar').style.width='0';$('target').textContent='等待回放';$('videoCommand').textContent='—';$('decision').textContent='—';$('trialLatency').textContent='—';drawIdle()}

$('step').onclick=step;$('play').onclick=()=>timer?stop():play();$('reset').onclick=reset;$('subject').onchange=()=>{cursor=0;reset()};$('speed').onchange=()=>{if(timer)play()};
window.addEventListener('message',event=>{if(event.data?.type==='unity-ready'){setUnityState(event.data.view,'READY');log(event.data.view==='robot'?'robotLog':'videoLog',`Unity ${event.data.view} WebGL 已连接`,'ok')}if(event.data?.type==='unity-robot-event'){const e=event.data.payload;log('robotLog',e.event==='grasp_complete'?'抓取与放置完成':'机械臂事件：'+e.event,e.event==='grasp_complete'?'ok':'warn')}});
init().catch(error=>{log('robotLog','初始化失败：'+error.message,'error');log('videoLog','初始化失败：'+error.message,'error')});
