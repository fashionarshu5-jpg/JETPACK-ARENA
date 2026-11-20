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
function makeSoldier(color=0x56634a){const g=new THREE.Group();const cloth=new THREE.MeshStandardMaterial({color,roughness:.96});const armor=new THREE.MeshStandardMaterial({color:0x303a32,roughness:.88});const skin=new THREE.MeshStandardMaterial({color:0x9a765a,roughness:1});const boot=new THREE.MeshStandardMaterial({color:0x1b211d,roughness:1});const pouchMat=new THREE.MeshStandardMaterial({color:0x596044,roughness:1});
 const torso=new THREE.Mesh(new THREE.CapsuleGeometry(.31,.55,4,8),cloth);torso.position.y=1.48;g.add(torso);
 const vest=new THREE.Mesh(new THREE.BoxGeometry(.76,.62,.42),armor);vest.position.set(0,1.49,-.015);g.add(vest);
 for(let s of [-1,1]){const pouch=new THREE.Mesh(new THREE.BoxGeometry(.2,.22,.12),pouchMat);pouch.position.set(s*.23,1.35,-.25);g.add(pouch);const shoulder=new THREE.Mesh(new THREE.SphereGeometry(.17,8,6),armor);shoulder.position.set(s*.47,1.76,-.02);g.add(shoulder);const arm=new THREE.Mesh(new THREE.CapsuleGeometry(.105,.48,3,7),cloth);arm.position.set(s*.49,1.43,-.04);arm.rotation.z=s*-.12;g.add(arm);const elbow=new THREE.Mesh(new THREE.SphereGeometry(.12,8,6),armor);elbow.position.set(s*.5,1.2,-.04);g.add(elbow);const leg=new THREE.Mesh(new THREE.CapsuleGeometry(.13,.48,3,7),cloth);leg.position.set(s*.2,.56,0);g.add(leg);const knee=new THREE.Mesh(new THREE.BoxGeometry(.23,.2,.12),armor);knee.position.set(s*.2,.55,-.16);g.add(knee);const foot=new THREE.Mesh(new THREE.BoxGeometry(.28,.18,.42),boot);foot.position.set(s*.2,.16,-.06);g.add(foot)}
 const head=new THREE.Mesh(new THREE.SphereGeometry(.2,12,10),skin);head.position.y=2.12;g.add(head);const helmet=new THREE.Mesh(new THREE.SphereGeometry(.25,12,8,0,Math.PI*2,0,Math.PI/2),armor);helmet.position.y=2.22;g.add(helmet);const brim=new THREE.Mesh(new THREE.BoxGeometry(.48,.06,.32),armor);brim.position.set(0,2.18,-.04);g.add(brim);
 const pack=new THREE.Mesh(new THREE.BoxGeometry(.48,.62,.24),armor);pack.position.set(0,1.48,.28);g.add(pack);for(let y of [1.3,1.55,1.78]){const strap=new THREE.Mesh(new THREE.BoxGeometry(.5,.045,.27),pouchMat);strap.position.set(0,y,.29);g.add(strap)}
 const rifle=box(g,.22,1.28,-.58,.14,.16,.95,mats.dark);rifle.rotation.x=.03;const barrel=new THREE.Mesh(new THREE.CylinderGeometry(.035,.035,.5,8),mats.metal);barrel.rotation.x=Math.PI/2;barrel.position.set(.22,1.3,-1.25);g.add(barrel);const sight=box(g,.22,1.4,-.56,.07,.07,.16,mats.metal);g.add(sight);
 g.userData.rifle=rifle;return g}
const player=makeSoldier();scene.add(player);player.position.set(0,0,12);
const bots=[];const botMat=[0x5b6245,0x6b5140,0x46535a,0x4c5944];
for(let i=0;i<5;i++){const bot=makeSoldier(botMat[i%botMat.length]);bot.position.set((Math.random()-.5)*48,0,-12-Math.random()*22);bot.userData.hp=100;bot.userData.phase=Math.random()*6.28;scene.add(bot);bots.push(bot)}
// FPS weapon is a compact first-person rifle assembly attached to the camera.
const fpWeapon=new THREE.Group();const gunBody=box(fpWeapon,.32,-.25,-.72,.18,.18,.82,mats.dark);gunBody.rotation.x=-.03;box(fpWeapon,.32,-.36,-.55,.13,.18,.32,mats.olive);box(fpWeapon,.32,-.16,-.45,.06,.07,.24,mats.metal);const fpBarrel=new THREE.Mesh(new THREE.CylinderGeometry(.035,.035,.58,10),mats.metal);fpBarrel.rotation.x=Math.PI/2;fpBarrel.position.set(.32,-.23,-1.38);fpWeapon.add(fpBarrel);box(fpWeapon,.32,-.12,-.72,.07,.08,.22,mats.metal);box(fpWeapon,.32,-.43,-.75,.12,.22,.18,mats.olive);camera.add(fpWeapon);fpWeapon.visible=false;
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
const movePad=$('#movePad');let touchId=null,lookTouchId=null,lastLookX=0,lastLookY=0;const lookPad=$('#lookPad');lookPad?.addEventListener('pointerdown',e=>{if(mode!=='playing')return;lookTouchId=e.pointerId;lastLookX=e.clientX;lastLookY=e.clientY;lookPad.setPointerCapture(lookTouchId)});lookPad?.addEventListener('pointermove',e=>{if(e.pointerId!==lookTouchId||mode!=='playing')return;const dx=e.clientX-lastLookX,dy=e.clientY-lastLookY;lastLookX=e.clientX;lastLookY=e.clientY;yaw-=dx*.006;pitch=THREE.MathUtils.clamp(pitch-dy*.004,-.8,.8)});function endLook(e){if(e.pointerId===lookTouchId)lookTouchId=null}lookPad?.addEventListener('pointerup',endLook);lookPad?.addEventListener('pointercancel',endLook);movePad?.addEventListener('pointerdown',e=>{touchId=e.pointerId;movePad.setPointerCapture(touchId);updatePad(e)});movePad?.addEventListener('pointermove',e=>{if(e.pointerId===touchId)updatePad(e)});function endMove(e){if(e&&e.pointerId!==touchId)return;touchId=null;moveX=moveZ=0;const knob=movePad?.querySelector('i');if(knob)knob.style.transform='translate(0,0)'}movePad?.addEventListener('pointerup',endMove);movePad?.addEventListener('pointercancel',endMove);movePad?.addEventListener('lostpointercapture',endMove);function updatePad(e){const r=movePad.getBoundingClientRect(),dx=(e.clientX-r.left-r.width/2)/(r.width*.34),dy=(e.clientY-r.top-r.height/2)/(r.height*.34);moveX=Math.max(-1,Math.min(1,dx));moveZ=Math.max(-1,Math.min(1,dy));movePad.querySelector('i').style.transform='translate('+moveX*25+'px,'+moveZ*25+'px)'}
$('#mobileFire').addEventListener('pointerdown',e=>{e.preventDefault();fireHeld=true;shoot()});$('#mobileFire').addEventListener('pointerup',()=>fireHeld=false);$('#mobileFire').addEventListener('pointercancel',()=>fireHeld=false);$('#mobileJump').addEventListener('click',()=>{if(player.position.y<.05)velocityY=7});
function update(dt){if(mode!=='playing')return;elapsed+=dt;soldierMixers.forEach(mixer=>mixer.update(dt));const forward=(keys.KeyW?1:0)-(keys.KeyS?1:0)-moveZ,right=(keys.KeyD?1:0)-(keys.KeyA?1:0)+moveX;const dir=new THREE.Vector3(right,0,-forward);if(dir.lengthSq()>1)dir.normalize();dir.applyAxisAngle(new THREE.Vector3(0,1,0),yaw);player.position.addScaledVector(dir,dt*7);player.position.x=THREE.MathUtils.clamp(player.position.x,-39,39);player.position.z=THREE.MathUtils.clamp(player.position.z,-34,34);velocityY-=18*dt;player.position.y=Math.max(0,player.position.y+velocityY*dt);if(player.position.y===0)velocityY=0;player.rotation.y=yaw;if(player.userData.assetModel)setSoldierRole(player.userData.assetModel,dir.lengthSq()>.01?'Run':'Idle');
 bots.forEach((b,i)=>{if(!b.parent)return;b.userData.phase+=dt*.35;b.position.x+=Math.sin(b.userData.phase)*dt*.7;b.position.z+=Math.cos(b.userData.phase*.8)*dt*.45;b.rotation.y=Math.atan2(player.position.x-b.position.x,player.position.z-b.position.z);if(b.userData.assetModel)setSoldierRole(b.userData.assetModel,'Walk')});
 if(cameraMode==='third'){const offset=new THREE.Vector3(0,3.2,7.2).applyAxisAngle(new THREE.Vector3(0,1,0),yaw);const desired=player.position.clone().add(offset);desired.y+=Math.sin(pitch)*3.2;camera.position.lerp(desired,1-Math.pow(.001,dt));const look=player.position.clone().add(new THREE.Vector3(0,1.35,0));look.x-=Math.sin(yaw)*1.8;look.z-=Math.cos(yaw)*1.8;look.y+=Math.sin(pitch)*9;camera.lookAt(look)}else{camera.position.copy(player.position).add(new THREE.Vector3(0,1.65,0));camera.rotation.order='YXZ';camera.rotation.y=yaw;camera.rotation.x=pitch;fpWeapon.position.x=.0+Math.sin(elapsed*7)*.008;fpWeapon.position.y=Math.cos(elapsed*7)*.006}
 if(fireHeld)shoot();
}
function loop(){requestAnimationFrame(loop);const dt=Math.min(clock.getDelta(),.04);update(dt);renderer.render(scene,camera);frameCount++;fpsTime+=dt;if(fpsTime>=1){$('#fps').textContent='FPS '+Math.round(frameCount/fpsTime);frameCount=0;fpsTime=0}}
loop();
window.addEventListener('contextmenu',e=>e.preventDefault());


// Real rigged soldier assets (CC0) replace the temporary primitive operators when loaded.
// Gobkit provides separate Idle/Walk/Run/Death clips and documents these exact model URLs.
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { clone as cloneSkinned } from 'three/addons/utils/SkeletonUtils.js';
const soldierAssetUrls = [
  'https://gobkit.com/freebies/human022/BlackOpsOperator.glb',
  'https://gobkit.com/freebies/human022/FrontlineRifleman.glb',
  'https://gobkit.com/freebies/human022/NightReconScout.glb',
  'https://gobkit.com/freebies/human022/AssaultTeamLeader.glb',
  'https://gobkit.com/freebies/human022/GhillieSniper.glb'
];
const soldierLoader = new GLTFLoader();
const soldierCache = new Map();
const soldierMixers = [];
async function getSoldierAsset(url) {
  if (!soldierCache.has(url)) soldierCache.set(url, soldierLoader.loadAsync(url));
  return soldierCache.get(url);
}
function clearPlaceholder(group) {
  while (group.children.length) group.remove(group.children[0]);
}
function prepareSoldierModel(model, targetHeight=2.25) {
  const bounds = new THREE.Box3().setFromObject(model);
  const size = bounds.getSize(new THREE.Vector3());
  const scale = targetHeight / Math.max(size.y, 0.001);
  model.scale.setScalar(scale);
  const scaledBounds = new THREE.Box3().setFromObject(model);
  model.position.y -= scaledBounds.min.y;
  model.traverse(node => {
    if (node.isMesh) {
      node.castShadow = true;
      node.receiveShadow = true;
      if (node.material) {
        const materials = Array.isArray(node.material) ? node.material : [node.material];
        materials.forEach(material => {
          if ('roughness' in material) material.roughness = Math.max(material.roughness || 0.7, 0.72);
        });
      }
    }
  });
}
function playSoldierAnimation(model, clips, role='Idle') {
  if (!clips?.length) return null;
  const mixer = new THREE.AnimationMixer(model);
  model.userData.animationActions = {};
  clips.forEach(clip => { model.userData.animationActions[clip.name.toLowerCase()] = mixer.clipAction(clip); });
  const first = model.userData.animationActions[role.toLowerCase()] || model.userData.animationActions.idle;
  if (first) first.reset().play();
  model.userData.activeAnimation = first || null;
  soldierMixers.push(mixer);
  return mixer;
}
function setSoldierRole(model, role) {
  const next = model?.userData?.animationActions?.[role.toLowerCase()];
  if (!next || next === model.userData.activeAnimation) return;
  model.userData.activeAnimation?.fadeOut(0.18);
  next.reset().fadeIn(0.18).play();
  model.userData.activeAnimation = next;
}
async function installRealSoldiers() {
  const jobs = [getSoldierAsset(soldierAssetUrls[0]), ...bots.map((_,i)=>getSoldierAsset(soldierAssetUrls[(i+1)%soldierAssetUrls.length]))];
  const loaded = await Promise.allSettled(jobs);
  if (loaded[0].status === 'fulfilled') {
    const gltf = loaded[0].value;
    const model = cloneSkinned(gltf.scene);
    prepareSoldierModel(model);
    model.rotation.y = Math.PI; // source models face +Z; the player advances toward -Z.
    clearPlaceholder(player);
    player.add(model);
    player.userData.assetModel = model;
    player.userData.mixer = playSoldierAnimation(model, gltf.animations, 'Idle');
  }
  for (let i=0;i<bots.length;i++) {
    const result = loaded[i+1];
    if (result?.status !== 'fulfilled') continue;
    const gltf = result.value;
    const model = cloneSkinned(gltf.scene);
    prepareSoldierModel(model);
    clearPlaceholder(bots[i]);
    bots[i].add(model);
    bots[i].userData.assetModel = model;
    bots[i].userData.mixer = playSoldierAnimation(model, gltf.animations, 'Idle');
  }
  targets.length = 0;
  bots.forEach(bot => bot.traverse(node => { if (node.isMesh) targets.push(node); }));
  const failed = loaded.filter(item=>item.status==='rejected').length;
  if (failed) console.warn('Some external soldier models could not be loaded; procedural fallback remains active.', failed);
}
installRealSoldiers().catch(error=>console.warn('Soldier asset loading failed; using procedural fallback.', error));
