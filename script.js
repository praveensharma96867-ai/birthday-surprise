// ===================== PERSONALIZE HERE =====================
const CONFIG = {
  password: "love123",        // Change the secret password
  name: "My Love",            // Birthday person's name
  senderName: "Mayank",    // Your name
  note: "Happy birthday to the person who makes ordinary days feel special. I hope this year brings you more laughter, peace, adventures, and everything your heart has been quietly wishing for."
};
// Add a file named music.mp3 to this folder for background music.
// To use real photos, replace each .photo-placeholder div in index.html
// with: <img src="photos/photo1.jpg" alt="Our memory"> and create photos/.
// ============================================================

const $ = s => document.querySelector(s);
const lock = $("#lockScreen"), site = $("#site"), music = $("#bgMusic");
$("#heroName").textContent = CONFIG.name;
$("#noteName").textContent = CONFIG.name;
$("#footerName").textContent = CONFIG.name;
$("#personalNote").textContent = CONFIG.note;
$(".signature span").textContent = CONFIG.senderName;

$("#passwordForm").addEventListener("submit", e => {
  e.preventDefault();
  if ($("#passwordInput").value === CONFIG.password) {
    lock.classList.remove("active");
    site.classList.remove("hidden");
    flowerRain(26);
    music.play().catch(()=>{});
  } else {
    $("#passwordError").textContent = "That’s not our secret password ♥";
    $("#passwordInput").animate(
      [{transform:"translateX(0)"},{transform:"translateX(-8px)"},{transform:"translateX(8px)"},{transform:"translateX(0)"}],
      {duration:260}
    );
  }
});

$("#musicBtn").addEventListener("click", () => {
  if (music.paused) { music.play().catch(()=>{}); $("#musicBtn").innerHTML = "♫ <span>Music on</span>"; }
  else { music.pause(); $("#musicBtn").innerHTML = "♫ <span>Music off</span>"; }
});

let candleOut = false;
function blowOut() {
  if (candleOut) return;
  candleOut = true;
  $("#flame").classList.add("out");
  $("#wishText").textContent = "Wish made! Happy Birthday, " + CONFIG.name + "! 🎉";
  $("#blowBtn").textContent = "Wish made ❤️";
  confettiBurst();
  flowerRain(45);
}
$("#blowBtn").addEventListener("click", blowOut);

let audioCtx, analyser, micStream, listening = false;
$("#micBtn").addEventListener("click", async () => {
  if (listening) return;
  try {
    micStream = await navigator.mediaDevices.getUserMedia({audio:true});
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    analyser = audioCtx.createAnalyser();
    const source = audioCtx.createMediaStreamSource(micStream);
    source.connect(analyser);
    analyser.fftSize = 256;
    const data = new Uint8Array(analyser.frequencyBinCount);
    listening = true;
    $("#micBtn").textContent = "Blow toward the microphone…";
    let loudFrames = 0;
    function detect() {
      if (!listening || candleOut) return;
      analyser.getByteFrequencyData(data);
      const avg = data.reduce((a,b)=>a+b,0)/data.length;
      loudFrames = avg > 45 ? loudFrames + 1 : Math.max(0, loudFrames - 1);
      if (loudFrames > 5) {
        blowOut(); listening = false;
        micStream.getTracks().forEach(t=>t.stop());
        $("#micBtn").textContent = "You blew it out! ✨";
        return;
      }
      requestAnimationFrame(detect);
    }
    detect();
  } catch (err) {
    $("#micBtn").textContent = "Mic unavailable — use the button";
  }
});

const envelope = $("#envelope");
envelope.addEventListener("click", ()=> envelope.classList.toggle("open"));
envelope.addEventListener("keydown", e => { if(e.key==="Enter"||e.key===" ") envelope.click(); });

function flowerRain(count=20) {
  const box = $("#petals");
  for (let i=0;i<count;i++) {
    const p = document.createElement("i");
    p.className = "petal";
    p.style.left = Math.random()*100+"vw";
    p.style.setProperty("--drift", (Math.random()*180-90)+"px");
    p.style.animationDuration = (5+Math.random()*5)+"s";
    p.style.animationDelay = (Math.random()*2)+"s";
    p.style.transform = `scale(${.5+Math.random()}) rotate(${Math.random()*180}deg)`;
    box.appendChild(p);
    setTimeout(()=>p.remove(),12000);
  }
}

function confettiBurst(){
  const canvas=$("#confetti"),ctx=canvas.getContext("2d");
  canvas.width=innerWidth;canvas.height=innerHeight;
  const pieces=Array.from({length:130},()=>({
    x:innerWidth/2,y:innerHeight*.48,
    vx:(Math.random()-.5)*15,vy:-Math.random()*13-3,
    g:.28+Math.random()*.12,w:5+Math.random()*7,h:5+Math.random()*10,
    r:Math.random()*6.28,vr:(Math.random()-.5)*.3,
    hue:[345,15,42,320][Math.floor(Math.random()*4)]
  }));
  let frame=0;
  function draw(){
    ctx.clearRect(0,0,canvas.width,canvas.height);
    pieces.forEach(p=>{
      p.x+=p.vx;p.y+=p.vy;p.vy+=p.g;p.r+=p.vr;
      ctx.save();ctx.translate(p.x,p.y);ctx.rotate(p.r);
      ctx.fillStyle=`hsl(${p.hue} 70% 65%)`;ctx.fillRect(-p.w/2,-p.h/2,p.w,p.h);ctx.restore();
    });
    if(frame++<220) requestAnimationFrame(draw); else ctx.clearRect(0,0,canvas.width,canvas.height);
  } draw();
}
window.addEventListener("resize",()=>{const c=$("#confetti");c.width=innerWidth;c.height=innerHeight});

(function(){
 const layer=document.getElementById("floatingHearts"); if(!layer)return;
 function add(){const h=document.createElement("span");h.className="floating-heart";h.textContent=Math.random()>.25?"♥":"♡";h.style.left=Math.random()*100+"vw";h.style.fontSize=(12+Math.random()*18)+"px";h.style.setProperty("--drift",(Math.random()*120-60)+"px");h.style.animationDuration=(7+Math.random()*6)+"s";layer.appendChild(h);setTimeout(()=>h.remove(),14000)}
 setInterval(add,850);for(let i=0;i<6;i++)setTimeout(add,i*250);
})();
