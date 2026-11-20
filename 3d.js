import * as THREE from 'three';

const canvas=document.querySelector('#battlefield');
const renderer=new THREE.WebGLRenderer({canvas,antialias:true,powerPreference:'high-performance'});
renderer.setPixelRatio(Math.min(devicePixelRatio,1.5));
renderer.shadowMap.enabled=false;
renderer.outputColorSpace=THREE.SRGBColorSpace;
renderer.toneMapping=THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure=1.15;
const scene=new THREE.Scene();
scene.background=new THREE.Color(0x9aa99a);
scene.fog=new THREE.Fog(0x9aa99a,42,145);
const camera=new THREE.PerspectiveCamera(72,innerWidth/innerHeight,.1,240);
const clock=new THREE.Clock();
const hemi=new THREE.HemisphereLight(0xcbd8d0,0x4a4938,2.0);scene.add(hemi);
const sun=new THREE.DirectionalLight(0xffe2bd,3.2);sun.position.set(-25,42,18);scene.add(sun);
const world=new THREE.Group();scene.add(world);
const mats={ground:new THREE.MeshStandardMaterial({color:0x77765e,roughness:1}),sand:new THREE.MeshStandardMaterial({color:0x9a8c6c,roughness:1}),concrete:new THREE.MeshStandardMaterial({color:0x62665c,roughness:.95}),dark:new THREE.MeshStandardMaterial({color:0x242d28,roughness:.75}),metal:new THREE.MeshStandardMaterial({color:0x414b46,metalness:.65,roughness:.55}),olive:new THREE.MeshStandardMaterial({color:0x4a583b,roughness:.9}),glass:new THREE.MeshStandardMaterial({color:0x8b9d91,metalness:.4,roughness:.3})};
function box(parent,x,y,z,w,h,d,mat){const m=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),mat);m.position.set(x,y,z);m.castShadow=true;m.receiveShadow=true;parent.add(m);return m}
const floor=new THREE.Mesh(new THREE.PlaneGeometry(220,220),mats.ground);floor.rotation.x=-Math.PI/2;floor.position.y=-.08;world.add(floor);
for(let i=0;i<150;i++){const x=(Math.random()-.5)*180,z=(Math.random()-.5)*180;const peb=new THREE.Mesh(new THREE.DodecahedronGeometry(.08+Math.random()*.18,0),Math.random()>.5?mats.sand:mats.concrete);peb.position.set(x,.02,z);peb.scale.y=.25;world.add(peb)}
// Perimeter berms, military buildings, containers and cover.
for(const [x,z,w,d] of [[0,-38,90,2],[0,38,90,2],[-45,0,2,78],[45,0,2,78]])box(world,x,1.4,z,w,2.8,d,mats.sand);
function building(x,z,w,h,d){box(world,x,h/2,z,w,h,d,mats.concrete);box(world,x,h+.12,z,w+.5,.24,d+.5,mats.dark);box(world,x,h*.55,z-d/2-.03,w*.28,h*.42,.08,mats.glass)}
building(-20,-18,13,5,9);building(21,-19,15,6,10);building(-23,18,12,4.5,9);building(23,18,13,5,9);
for(let i=0;i<16;i++){const x=(Math.random()-.5)*62,z=(Math.random()-.5)*58;if(Math.abs(x)>10||Math.abs(z)>10){box(world,x,.8,z,2+Math.random()*2,1.6,2,mats.olive);if(i%3===0)box(world,x,.45,z+1.15,2.3,.9,.28,mats.sand)}}
for(let i=0;i<7;i++){const x=-30+i*10;box(world,x,1.3,-5,5,2.6,1.1,mats.metal);box(world,x,2.7,-5,5,.12,1.1,mats.dark)}
// Low-poly operator built from detailed tactical primitives.
function makeSoldier(color=0x56634a){const g=new THREE.Group();const cloth=new THREE.MeshStandardMaterial({color,roughness:.95});const armor=new THREE.MeshStandardMaterial({color:0x303a32,roughness:.85});const skin=new THREE.MeshStandardMaterial({color:0x9a765a,roughness:1});const boot=new THREE.MeshStandardMaterial({color:0x1b211d,roughness:1});
 const torso=new THREE.Mesh(new THREE.BoxGeometry(.72,.92,.38),cloth);torso.position.y=1.48;g.add(torso);
 const vest=new THREE.Mesh(new THREE.BoxGeometry(.76,.58,.42),armor);vest.position.set(0,1.48,-.015);g.add(vest);
 const head=new THREE.Mesh(new THREE.SphereGeometry(.22,12,10),skin);head.position.y=2.13;g.add(head);
 const helmet=new THREE.Mesh(new THREE.SphereGeometry(.25,12,8,0,Math.PI*2,0,Math.PI/2),armor);helmet.position.y=2.22;g.add(helmet);
 for(const s of [-1,1]){const leg=new THREE.Mesh(new THREE.BoxGeometry(.25,.72,.3),cloth);leg.position.set(s*.2,.55,0);g.add(leg);const foot=new THREE.Mesh(new THREE.BoxGeometry(.28,.18,.42),boot);foot.position.set(s*.2,.16,-.06);g.add(foot);const arm=new THREE.Mesh(new THREE.BoxGeometry(.22,.72,.24),cloth);arm.position.set(s*.48,1.47,-.02);arm.rotation.z=s*-.12;g.add(arm)}
 const pack=new THREE.Mesh(new THREE.BoxGeometry(.48,.62,.24),armor);pack.position.set(0,1.48,.28);g.add(pack);
 const rifle=box(g,.22,1.28,-.58,.14,.16,.95,mats.dark);rifle.rotation.x=.03;
 g.userData.rifle=rifle;g.userData.legs=g.children.filter((_,i)=>i===5||i===8);return g}
const player=makeSoldier();scene.add(player);player.position.set(0,0,12);
const bots=[];const botMat=[0x5b6245,0x6b5140,0x46535a,0x4c5944];
for(let i=0;i<5;i++){const bot=makeSoldier(botMat[i%botMat.length]);bot.position.set((Math.random()-.5)*48,0,-12-Math.random()*22);bot.userData.hp=100;bot.userData.phase=Math.random()*6.28;scene.add(bot);bots.push(bot)}
// FPS weapon is a compact first-person rifle assembly attached to the camera.
const fpWeapon=new THREE.Group();const gunBody=box(fpWeapon,.32,-.25,-.72,.18,.18,.82,mats.dark);gunBody.rotation.x=-.03;box(fpWeapon,.32,-.36,-.55,.13,.18,.32,mats.olive);box(fpWeapon,.32,-.16,-.45,.06,.07,.24,mats.metal);camera.add(fpWeapon);fpWeapon.visible=false;
const raycaster=new THREE.Raycaster();const aim=new THREE.Vector2(0,0);const targets=[];bots.forEach(b=>b.traverse(o=>{if(o.isMesh)targets.push(o)}));
let mode='menu',cameraMode='third',health=100,kills=0,elapsed=0,frameCount=0,fpsTime=0,moveX=0,moveZ=0,fireHeld=false,keys={},yaw=0,pitch=0,velocityY=0,lastShot=0;
const $=s=>document.querySelector(s);
function toast(t){const el=$('#toast');el.textContent=t;el.style.opacity=1;clearTimeout(toast.timer);toast.timer=setTimeout(()=>el.style.opacity=0,1600)}
function setCamera(m){cameraMode=m;$('#cameraLabel').textContent=m.toUpperCase()+' PERSON';$('#cameraToggle').textContent='CAMERA: '+m.toUpperCase();player.visible=m==='third';fpWeapon.visible=m==='first';$('#crosshair').classList.toggle('hidden',false);if(m==='first')camera.position.set(0,1.65,0)}
function applyQuality(q){const dpr=q==='low'?1:q==='medium'?Math.min(devicePixelRatio,1.25):Math.min(devicePixelRatio,1.7);renderer.setPixelRatio(dpr);renderer.shadowMap.enabled=q==='high';sun.castShadow=q==='high';sun.shadow.mapSize.set(1024,1024);scene.fog.far=q==='low'?105:145;toast('GRAPHICS: '+q.toUpperCase())}
function deploy(){mode='playing';cameraMode=$('#cameraChoice').value;applyQuality($('#quality').value);setCamera(cameraMode);$('#menu').classList.add('hidden');$('#mission').classList.remove('hidden');$('#cameraToggle').classList.remove('hidden');$('#crosshair').classList.remove('hidden');if(innerWidth<651)$('#mobilePad').classList.remove('hidden');toast('DEPLOYED — TRAINING ZONE');if(innerWidth>700)canvas.requestPointerLock?.()}
$('#deploy').addEventListener('click',deploy);
$('#cameraToggle').addEventListener('click',()=>setCamera(cameraMode==='third'?'first':'third'));
$('#resume').addEventListener('click',()=>{mode='playing';$('#pause').classList.add('hidden');if(innerWidth>700)canvas.requestPointerLock?.()});
$('#returnMenu').addEventListener('click',()=>{mode='menu';document.exitPointerLock?.();$('#pause').classList.add('hidden');$('#menu').classList.remove('hidden');$('#mission').classList.add('hidden');$('#cameraToggle').classList.add('hidden');$('#mobilePad').classList.add('hidden')});
document.addEventListener('pointerlockchange',()=>{if(mode==='playing'&&innerWidth>700&&!document.pointerLockElement){mode='paused';$('#pause').classList.remove('hidden')}});
document.addEventListener('mousemove',e=>{if(mode==='playing'&&document.pointerLockElement){yaw-=e.movementX*.0022;pitch=Math.max(-.8,Math.min(.8,pitch-e.movementY*.0018))}});
document.addEventListener('keydown',e=>{keys[e.code]=true;if(e.code==='Escape'&&mode==='playing'){mode='paused';$('#pause').classList.remove('hidden')}if(e.code==='Space'&&mode==='playing'&&player.position.y<.05)velocityY=7});
document.addEventListener('keyup',e=>keys[e.code]=false);
canvas.addEventListener('click',()=>{if(mode==='playing'&&innerWidth>700&&!document.pointerLockElement)canvas.requestPointerLock?.();else shoot()});
function shoot(){if(mode!=='playing'||performance.now()-lastShot<180)return;lastShot=performance.now();raycaster.setFromCamera(aim,camera);const hits=raycaster.intersectObjects(targets,false);if(hits.length&&hits[0].distance<65){let obj=hits[0].object;while(obj.parent&&!bots.includes(obj))obj=obj.parent;if(bots.includes(obj)){obj.userData.hp-=34;$('#hitMarker').style.opacity=1;setTimeout(()=>$('#hitMarker').style.opacity=0,90);if(obj.userData.hp<=0){scene.remove(obj);obj.traverse(child=>{const ti=targets.indexOf(child);if(ti>=0)targets.splice(ti,1)});bots.splice(bots.indexOf(obj),1);kills++;$('#score').innerHTML='ELIMS <b>'+kills+'</b>';toast('TARGET ELIMINATED')} }}}
function resize(){camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();renderer.setSize(innerWidth,innerHeight,false)}addEventListener('resize',resize);resize();
const movePad=$('#movePad');let touchId=null;movePad?.addEventListener('pointerdown',e=>{touchId=e.pointerId;movePad.setPointerCapture(touchId);updatePad(e)});movePad?.addEventListener('pointermove',e=>{if(e.pointerId===touchId)updatePad(e)});movePad?.addEventListener('pointerup',()=>{touchId=null;moveX=moveZ=0;movePad.querySelector('i').style.transform='translate(0,0)'});function updatePad(e){const r=movePad.getBoundingClientRect(),dx=(e.clientX-r.left-r.width/2)/(r.width*.34),dy=(e.clientY-r.top-r.height/2)/(r.height*.34);moveX=Math.max(-1,Math.min(1,dx));moveZ=Math.max(-1,Math.min(1,dy));movePad.querySelector('i').style.transform='translate('+moveX*25+'px,'+moveZ*25+'px)'}
$('#mobileFire').addEventListener('pointerdown',e=>{e.preventDefault();fireHeld=true;shoot()});$('#mobileFire').addEventListener('pointerup',()=>fireHeld=false);$('#mobileJump').addEventListener('click',()=>{if(player.position.y<.05)velocityY=7});
function update(dt){if(mode!=='playing')return;elapsed+=dt;const forward=(keys.KeyW?1:0)-(keys.KeyS?1:0)-moveZ,right=(keys.KeyD?1:0)-(keys.KeyA?1:0)+moveX;const dir=new THREE.Vector3(right,0,-forward);if(dir.lengthSq()>1)dir.normalize();dir.applyAxisAngle(new THREE.Vector3(0,1,0),yaw);player.position.addScaledVector(dir,dt*7);player.position.x=THREE.MathUtils.clamp(player.position.x,-39,39);player.position.z=THREE.MathUtils.clamp(player.position.z,-34,34);velocityY-=18*dt;player.position.y=Math.max(0,player.position.y+velocityY*dt);if(player.position.y===0)velocityY=0;player.rotation.y=yaw;
 bots.forEach((b,i)=>{if(!b.parent)return;b.userData.phase+=dt*.35;b.position.x+=Math.sin(b.userData.phase)*dt*.7;b.position.z+=Math.cos(b.userData.phase*.8)*dt*.45;b.rotation.y=Math.atan2(player.position.x-b.position.x,player.position.z-b.position.z)});
 if(cameraMode==='third'){const offset=new THREE.Vector3(0,3.2,7.2).applyAxisAngle(new THREE.Vector3(0,1,0),yaw);const desired=player.position.clone().add(offset);desired.y+=Math.sin(pitch)*3.2;camera.position.lerp(desired,1-Math.pow(.001,dt));const look=player.position.clone().add(new THREE.Vector3(0,1.35,0));look.x-=Math.sin(yaw)*1.8;look.z-=Math.cos(yaw)*1.8;look.y+=Math.sin(pitch)*9;camera.lookAt(look)}else{camera.position.copy(player.position).add(new THREE.Vector3(0,1.65,0));camera.rotation.order='YXZ';camera.rotation.y=yaw;camera.rotation.x=pitch;fpWeapon.position.x=.0+Math.sin(elapsed*7)*.008;fpWeapon.position.y=Math.cos(elapsed*7)*.006}
 if(fireHeld)shoot();
}
function loop(){requestAnimationFrame(loop);const dt=Math.min(clock.getDelta(),.04);update(dt);renderer.render(scene,camera);frameCount++;fpsTime+=dt;if(fpsTime>=1){$('#fps').textContent='FPS '+Math.round(frameCount/fpsTime);frameCount=0;fpsTime=0}}
loop();
window.addEventListener('contextmenu',e=>e.preventDefault());
