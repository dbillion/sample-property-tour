import { useEffect, useMemo, useRef, useState } from 'react'
import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { ArrowUpRight, BedDouble, Bath, ChefHat, Sofa, Maximize2, MapPin, ChevronRight, ChevronLeft, Move3D, LayoutGrid, Sun, ShieldCheck, Wifi, CarFront, Trees, X, Check, CalendarDays, Phone, Menu, Sparkles, Ruler, Home, Camera, Compass } from 'lucide-react'

const rooms = [
  { id:'living', name:'Living room', type:'Living space', size:'34.8 m²', dims:'6.0 × 5.8 m', area:34.8, icon:Sofa, description:'A generous open living space with floor-to-ceiling glazing, warm oak flooring and room for relaxed entertaining.', features:['Floor-to-ceiling windows','Oak engineered flooring','South-facing light'], image:'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=900&q=85', color:'#d9c4a2' },
  { id:'kitchen', name:'Kitchen & dining', type:'Open-plan kitchen', size:'22.4 m²', dims:'5.6 × 4.0 m', area:22.4, icon:ChefHat, description:'A considered kitchen with a central island, integrated appliances and an easy connection to the dining area.', features:['Stone island worktop','Integrated appliances','Dining for six'], image:'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=900&q=85', color:'#b7c2b1' },
  { id:'bedroom', name:'Primary bedroom', type:'Private suite', size:'18.6 m²', dims:'4.2 × 4.4 m', area:18.6, icon:BedDouble, description:'A calm, generous bedroom with built-in storage and soft morning light. Designed as a quiet retreat.', features:['Built-in wardrobes','Quiet courtyard aspect','Space for king bed'], image:'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=900&q=85', color:'#c8b6a6' },
  { id:'bath', name:'Bathroom', type:'Main bathroom', size:'8.2 m²', dims:'2.8 × 2.9 m', area:8.2, icon:Bath, description:'A spa-inspired bathroom with a walk-in shower, double vanity and understated natural finishes.', features:['Walk-in rainfall shower','Heated towel rail','Porcelain tile'], image:'https://images.unsplash.com/photo-1620626011761-996317b8d101?auto=format&fit=crop&w=900&q=85', color:'#aebdc1' },
]

function FloorPlan({ selected, onSelect }) {
  return <svg className="floor-svg" viewBox="0 0 620 410" role="img" aria-label="Interactive sample apartment floor plan">
    <defs><pattern id="grid" width="12" height="12" patternUnits="userSpaceOnUse"><path d="M 12 0 L 0 0 0 12" fill="none" stroke="#e9e5de" strokeWidth=".7"/></pattern></defs>
    <rect x="12" y="12" width="596" height="386" rx="8" fill="url(#grid)"/>
    <g transform="translate(70 42)">
      <rect x="0" y="0" width="470" height="300" fill="#f8f6f1" stroke="#303a37" strokeWidth="8"/>
      <g className="plan-room" onClick={()=>onSelect('living')} style={{cursor:'pointer'}}>
        <rect x="8" y="8" width="270" height="170" fill={selected==='living'?'#d9c4a2':'#e9e0d2'} stroke="#fff" strokeWidth="3"/>
        <text x="143" y="82" textAnchor="middle">LIVING ROOM</text><text className="plan-dim" x="143" y="102" textAnchor="middle">6.0 × 5.8 m</text>
      </g>
      <g className="plan-room" onClick={()=>onSelect('kitchen')} style={{cursor:'pointer'}}>
        <rect x="280" y="8" width="182" height="170" fill={selected==='kitchen'?'#b7c2b1':'#dfe5dc'} stroke="#fff" strokeWidth="3"/>
        <text x="371" y="82" textAnchor="middle">KITCHEN & DINING</text><text className="plan-dim" x="371" y="102" textAnchor="middle">5.6 × 4.0 m</text>
      </g>
      <g className="plan-room" onClick={()=>onSelect('bedroom')} style={{cursor:'pointer'}}>
        <rect x="8" y="180" width="250" height="112" fill={selected==='bedroom'?'#c8b6a6':'#e8dfd7'} stroke="#fff" strokeWidth="3"/>
        <text x="133" y="232" textAnchor="middle">PRIMARY BEDROOM</text><text className="plan-dim" x="133" y="251" textAnchor="middle">4.2 × 4.4 m</text>
      </g>
      <g className="plan-room" onClick={()=>onSelect('bath')} style={{cursor:'pointer'}}>
        <rect x="260" y="180" width="112" height="112" fill={selected==='bath'?'#aebdc1':'#dce4e5'} stroke="#fff" strokeWidth="3"/>
        <text x="316" y="229" textAnchor="middle">BATH</text><text className="plan-dim" x="316" y="247" textAnchor="middle">2.8 × 2.9</text>
      </g>
      <rect x="374" y="180" width="88" height="112" fill="#eeeae2" stroke="#fff" strokeWidth="3"/>
      <text x="418" y="230" textAnchor="middle" className="plan-dim">HALL</text>
      <path d="M278 8 V178 M8 178 H462 M258 180 V292 M372 180 V292" stroke="#fff" strokeWidth="7" fill="none"/>
      <path d="M0 90 H8 M470 85 H462 M130 300 V292" stroke="#b7a58d" strokeWidth="4"/>
      <g fill="none" stroke="#8e9c91" strokeWidth="3"><path d="M30 30 h90 v55 h-90z M42 42 h66 M42 55 h66"/><rect x="315" y="28" width="90" height="40" rx="4"/><rect x="42" y="205" width="65" height="55" rx="4"/><circle cx="315" cy="220" r="19"/></g>
      <path d="M12 315 H458" stroke="#9b8b76" strokeWidth="1"/><text x="235" y="334" className="plan-dim" textAnchor="middle">ILLUSTRATIVE LAYOUT · NOT TO SCALE</text>
    </g>
  </svg>
}

function ApartmentScene({ selected, onSelect, mode }) {
  const mountRef = useRef(null)
  const apiRef = useRef(null)
  useEffect(() => {
    const host = mountRef.current
    if (!host) return
    const scene = new THREE.Scene()
    scene.background = new THREE.Color('#e8e9e5')
    scene.fog = new THREE.Fog('#e8e9e5', 22, 42)
    const camera = new THREE.PerspectiveCamera(42, host.clientWidth / host.clientHeight, .1, 100)
    camera.position.set(13, 13, 17)
    const renderer = new THREE.WebGLRenderer({ antialias:true, alpha:false })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setSize(host.clientWidth, host.clientHeight)
    renderer.shadowMap.enabled = true
    renderer.shadowMap.type = THREE.PCFSoftShadowMap
    renderer.outputColorSpace = THREE.SRGBColorSpace
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.15
    host.appendChild(renderer.domElement)
    const controls = new OrbitControls(camera, renderer.domElement)
    controls.enableDamping = true
    controls.target.set(0,0,0)
    controls.maxPolarAngle = Math.PI * .48
    controls.minDistance = 10
    controls.maxDistance = 34
    scene.add(new THREE.HemisphereLight('#fffaf0','#89918b',2.1))
    const sun = new THREE.DirectionalLight('#fff1d7',3.1)
    sun.position.set(-7,15,9); sun.castShadow=true; sun.shadow.mapSize.set(2048,2048); scene.add(sun)
    const mat=(color,roughness=.8)=>new THREE.MeshStandardMaterial({color,roughness})
    const floorMat=mat('#d7c8b2'), wallMat=mat('#eeeae1'), darkMat=mat('#777d76')
    const floor = new THREE.Mesh(new THREE.BoxGeometry(16,.22,10),floorMat); floor.position.y=-.12; floor.receiveShadow=true; scene.add(floor)
    const addBox=(name,x,y,z,w,h,d,material,roomId=null)=>{const m=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),material);m.position.set(x,y,z);m.castShadow=true;m.receiveShadow=true;if(roomId)m.userData.roomId=roomId;scene.add(m);return m}
    // Open-front architectural shell
    addBox('north wall',0,1.5,-5,16,3,.18,wallMat)
    addBox('west wall',-8,1.5,0,.18,3,10,wallMat)
    addBox('east wall',8,1.5,0,.18,3,10,wallMat)
    addBox('living divider',-.3,1.45,-.1,.16,2.9,4.2,wallMat)
    addBox('bedroom divider',-1.4,1.45,2.1,3.4,2.9,.16,wallMat)
    addBox('bath divider',3.2,1.45,2.0,.16,2.9,3.9,wallMat)
    // Zone pads double as clickable room surfaces
    const zones=[['living',-4.15,-2.35,7.5,5.1,'#d9c4a2'],['kitchen',3.7,-2.35,7.1,5.1,'#b7c2b1'],['bedroom',-4.45,3.0,6.8,3.7,'#c8b6a6'],['bath',3.0,3.0,3.9,3.7,'#aebdc1']]
    zones.forEach(([id,x,z,w,d,c])=>{const mesh=new THREE.Mesh(new THREE.PlaneGeometry(w,d),new THREE.MeshBasicMaterial({color:c,transparent:true,opacity:.28,side:THREE.DoubleSide}));mesh.rotation.x=-Math.PI/2;mesh.position.set(x,.012,z);mesh.userData.roomId=id;scene.add(mesh)})
    // Living room furniture
    const sofa=mat('#9a9a86'), cushion=mat('#d7c9b5'), wood=mat('#8c6748'), black=mat('#383d39')
    addBox('sofa base',-5.3,.55,-1.4,3.4,.65,1.2,sofa,'living'); addBox('sofa back',-5.3,1.12,-2.0,3.4,1.0,.3,sofa,'living')
    addBox('coffee table',-3.6,.42,1.0,1.6,.12,.85,wood,'living')
    addBox('rug',-4.7,.03,1.0,4.2,.035,2.3,mat('#c6b7a1'),'living')
    addBox('media console',-1.1,.35,-3.4,2.0,.65,.45,wood,'living')
    // Kitchen island and dining table
    addBox('island',3.1,.65,-1.3,3.0,1.1,1.15,mat('#d4d1c8'),'kitchen')
    addBox('island top',3.1,1.23,-1.3,3.15,.12,1.25,mat('#f0eee8'),'kitchen')
    addBox('dining table',5.5,.7,-3.8,2.0,.12,1.2,wood,'kitchen')
    ;[[-.8,-4.2],[1.0,-4.2],[-.8,-3.2],[1.0,-3.2]].forEach(([x,z])=>addBox('chair',5.5+x,.45,z,.42,.8,.42,sofa,'kitchen'))
    // Bedroom
    addBox('bed frame',-5.0,.42,3.3,3.3,.55,2.6,wood,'bedroom')
    addBox('mattress',-5.0,.78,3.2,3.2,.3,2.5,mat('#f3eee6'),'bedroom')
    addBox('headboard',-5.0,1.25,4.45,3.3,1.0,.18,sofa,'bedroom')
    addBox('nightstand',-7.0,.4,2.4,.7,.8,.7,wood,'bedroom')
    // Bathroom fittings
    addBox('vanity',2.5,.5,3.0,1.8,.9,.65,mat('#c9c3b7'),'bath')
    addBox('shower tray',4.7,.12,3.2,1.5,.2,2.5,mat('#e8e8e3'),'bath')
    addBox('glass screen',4.0,1.2,3.2,.05,2.2,2.5,mat('#c7d5d5',.15),'bath')
    // Architectural windows and plants
    addBox('window living',-4.3,1.8,-4.88,4.5,1.7,.04,mat('#b8d1d0',.2),'living')
    addBox('window kitchen',3.8,1.8,-4.88,3.2,1.7,.04,mat('#b8d1d0',.2),'kitchen')
    const plantMat=mat('#657b62')
    ;[[-1.5,-3.8],[6.7,-.5]].forEach(([x,z])=>{addBox('planter',x,.25,z,.65,.5,.65,wood);const leaf=new THREE.Mesh(new THREE.SphereGeometry(.55,12,10),plantMat);leaf.position.set(x,.95,z);leaf.castShadow=true;scene.add(leaf)})
    const raycaster=new THREE.Raycaster(), pointer=new THREE.Vector2()
    const onClick=(e)=>{const r=renderer.domElement.getBoundingClientRect();pointer.x=((e.clientX-r.left)/r.width)*2-1;pointer.y=-((e.clientY-r.top)/r.height)*2+1;raycaster.setFromCamera(pointer,camera);const hit=raycaster.intersectObjects(scene.children,true).find(h=>h.object.userData.roomId);if(hit)onSelect(hit.object.userData.roomId)}
    renderer.domElement.addEventListener('click',onClick)
    const resize=()=>{if(!host.clientWidth)return;camera.aspect=host.clientWidth/host.clientHeight;camera.updateProjectionMatrix();renderer.setSize(host.clientWidth,host.clientHeight)}
    const ro=new ResizeObserver(resize);ro.observe(host)
    let frame;const animate=()=>{frame=requestAnimationFrame(animate);controls.update();renderer.render(scene,camera)};animate()
    apiRef.current={camera,controls}
    return()=>{cancelAnimationFrame(frame);ro.disconnect();renderer.domElement.removeEventListener('click',onClick);controls.dispose();renderer.dispose();host.removeChild(renderer.domElement);scene.traverse(o=>{o.geometry?.dispose();if(o.material){if(Array.isArray(o.material))o.material.forEach(m=>m.dispose());else o.material.dispose()}})}
  },[onSelect])
  useEffect(()=>{if(!apiRef.current)return;const {camera,controls}=apiRef.current;if(mode==='overview'){camera.position.set(13,13,17);controls.target.set(0,0,0)}else{const targets={living:[-4,9,9],kitchen:[7,9,7],bedroom:[-5,8,9],bath:[4,8,8]};const p=targets[selected]||targets.living;camera.position.set(...p);controls.target.set(selected==='living'?-3: selected==='kitchen'?4:selected==='bedroom'?-4:3,0,selected==='bedroom'?3:selected==='bath'?3:-2)}controls.update()},[selected,mode])
  return <div className="scene-host" ref={mountRef}><div className="scene-hint"><Move3D size={14}/> Drag to orbit · Scroll to zoom · Click a room</div></div>
}

function App(){
  const [selected,setSelected]=useState('living')
  const [view,setView]=useState('3d')
  const [mode,setMode]=useState('overview')
  const [modal,setModal]=useState(false)
  const [sent,setSent]=useState(false)
  const [mobileMenu,setMobileMenu]=useState(false)
  const room=rooms.find(r=>r.id===selected)||rooms[0]
  const Icon=room.icon
  const selectRoom=(id)=>{setSelected(id);setMode('room')}
  const total=rooms.reduce((n,r)=>n+r.area,0)
  return <div className="app-shell">
    <header className="topbar">
      <a className="brand" href="#"><span className="brand-mark">A</span><span>AUREL <small>RESIDENCES</small></span></a>
      <nav className={mobileMenu?'nav-links open':'nav-links'}><a href="#overview">The residence</a><a href="#details">Details</a><a href="#location">Location</a></nav>
      <div className="top-actions"><span className="availability"><i/> SAMPLE PROPERTY</span><button className="outline-btn" onClick={()=>setModal(true)}>Enquire <ArrowUpRight size={15}/></button><button className="mobile-menu" onClick={()=>setMobileMenu(!mobileMenu)}><Menu size={20}/></button></div>
    </header>
    <main>
      <section className="hero" id="overview">
        <div className="hero-copy"><div className="eyebrow"><span/> A MORE THOUGHTFUL WAY TO EXPLORE</div><h1>Space to live.<br/><em>Room to belong.</em></h1><p>Discover a considered sample residence through an interactive floor plan and an immersive 3D tour.</p><div className="hero-meta"><span><MapPin size={15}/> Tallinn, Estonia · Concept property</span><span><Ruler size={15}/> {total.toFixed(1)} m² interior</span></div></div>
        <div className="hero-stamp"><span>01</span><div><b>THE RESIDENCE</b><small>Explore every detail</small></div></div>
      </section>
      <section className="explorer-section" id="details">
        <div className="section-heading"><div><div className="eyebrow">THE INTERACTIVE TOUR</div><h2>Explore the residence</h2></div><div className="section-note">Select a room to discover its dimensions, finishes and character.</div></div>
        <div className="explorer-grid">
          <div className="visual-panel">
            <div className="visual-toolbar"><div className="view-switch"><button className={view==='3d'?'active':''} onClick={()=>setView('3d')}><Move3D size={15}/> 3D TOUR</button><button className={view==='plan'?'active':''} onClick={()=>setView('plan')}><LayoutGrid size={15}/> FLOOR PLAN</button></div><button className="icon-btn" title="Reset view" onClick={()=>{setMode('overview');setSelected('living')}}><Compass size={17}/></button></div>
            <div className="visual-stage">{view==='3d'?<ApartmentScene selected={selected} onSelect={selectRoom} mode={mode}/>:<div className="plan-wrap"><FloorPlan selected={selected} onSelect={selectRoom}/><div className="plan-legend"><span><i style={{background:'#d9c4a2'}}/> Living</span><span><i style={{background:'#b7c2b1'}}/> Kitchen</span><span><i style={{background:'#c8b6a6'}}/> Bedroom</span><span><i style={{background:'#aebdc1'}}/> Bathroom</span></div></div>}</div>
            <div className="visual-footer"><span><Sparkles size={14}/> INTERACTIVE PROPERTY EXPERIENCE</span><span>CONCEPT VISUALISATION · NOT A MEASURED SURVEY</span></div>
          </div>
          <aside className="room-panel">
            <div className="room-panel-top"><span>ROOM DETAILS</span><span className="room-index">0{rooms.findIndex(r=>r.id===selected)+1} / 04</span></div>
            <div className="room-photo" style={{backgroundImage:`linear-gradient(180deg,transparent 45%,rgba(20,28,25,.34)),url("${room.image}")`}}><span className="photo-tag"><Camera size={12}/> ROOM INSPIRATION</span></div>
            <div className="room-info"><div className="room-type">{room.type}</div><h3><Icon size={22} strokeWidth={1.5}/>{room.name}</h3><p>{room.description}</p><div className="room-stats"><div><span>AREA</span><b>{room.size}</b></div><div><span>DIMENSIONS</span><b>{room.dims}</b></div></div><div className="feature-list"><span className="feature-label">DESIGNED AROUND YOU</span>{room.features.map(f=><div key={f}><Check size={14}/>{f}</div>)}</div></div>
            <div className="room-nav"><button disabled={rooms.findIndex(r=>r.id===selected)===0} onClick={()=>selectRoom(rooms[Math.max(0,rooms.findIndex(r=>r.id===selected)-1)].id)}><ChevronLeft size={16}/> Previous</button><button disabled={rooms.findIndex(r=>r.id===selected)===rooms.length-1} onClick={()=>selectRoom(rooms[Math.min(rooms.length-1,rooms.findIndex(r=>r.id===selected)+1)].id)}>Next room <ChevronRight size={16}/></button></div>
          </aside>
        </div>
        <div className="room-quicklinks">{rooms.map((r,i)=>{const I=r.icon;return <button key={r.id} className={selected===r.id?'selected':''} onClick={()=>selectRoom(r.id)}><span className="quick-num">0{i+1}</span><I size={17}/><span>{r.name}</span><b>{r.size}</b><ChevronRight size={15}/></button>})}</div>
      </section>
      <section className="details-band" id="location"><div className="details-intro"><div className="eyebrow">THE LITTLE THINGS MATTER</div><h2>Considered in<br/><em>every detail.</em></h2><p>A sample of the thoughtful touches that make a home feel like yours. All property information on this demo is illustrative.</p><button className="dark-btn" onClick={()=>setModal(true)}>Request a viewing <ArrowUpRight size={16}/></button></div><div className="amenities-grid"><div><span className="amenity-icon"><Sun/></span><b>Natural light</b><p>Generous glazing and bright, open spaces.</p></div><div><span className="amenity-icon"><ShieldCheck/></span><b>Peace of mind</b><p>Secure entry and considered details.</p></div><div><span className="amenity-icon"><Trees/></span><b>Green outlook</b><p>A calm connection to the outdoors.</p></div><div><span className="amenity-icon"><Wifi/></span><b>Modern living</b><p>Designed for the way we live today.</p></div></div></section>
      <section className="closing-cta"><div><div className="eyebrow">YOUR NEXT CHAPTER STARTS HERE</div><h2>Could this be<br/><em>the one?</em></h2></div><button className="light-btn" onClick={()=>setModal(true)}>Start a conversation <ArrowUpRight size={16}/></button><span className="cta-orbit">AUREL<br/>01 — 04</span></section>
    </main>
    <footer><a className="brand footer-brand" href="#"><span className="brand-mark">A</span><span>AUREL <small>RESIDENCES</small></span></a><span>INTERACTIVE PROPERTY CONCEPT · 2026</span><span>All property details and dimensions are illustrative sample data.</span></footer>
    {modal&&<div className="modal-backdrop" onClick={()=>setModal(false)}><div className="enquiry-modal" onClick={e=>e.stopPropagation()}><button className="modal-close" onClick={()=>{setModal(false);setSent(false)}}><X size={19}/></button>{sent?<div className="success-state"><span><Check size={26}/></span><h3>Thanks for exploring.</h3><p>This is a front-end demo. No enquiry has been sent or stored.</p><button className="dark-btn" onClick={()=>{setModal(false);setSent(false)}}>Back to the tour</button></div>:<><div className="eyebrow">LET'S START A CONVERSATION</div><h3>Arrange a viewing</h3><p>Leave a few details and see how an enquiry flow could work on a real property website.</p><form onSubmit={e=>{e.preventDefault();setSent(true)}}><label>Your name<input required placeholder="Name"/></label><label>Email address<input type="email" required placeholder="you@example.com"/></label><label>What would you like to know?<select defaultValue="Arrange a viewing"><option>Arrange a viewing</option><option>Request floor plan</option><option>Ask a question</option></select></label><button className="dark-btn" type="submit">Send demo enquiry <ArrowUpRight size={16}/></button></form><small className="demo-disclaimer">Demo only — your details are not transmitted or saved.</small></>}</div></div>}
    <div className="demo-ribbon">SAMPLE PROPERTY · DEMO EXPERIENCE</div>
  </div>
}
export default App
