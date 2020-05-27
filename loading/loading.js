let x=10;
function makeOrbit(angle){
    const path = document.createElement('div');
    const l="rotateX(-70deg) rotateY("+angle+"deg) rotateZ(-20deg);";
    
    path.style.display="flex";
    path.style.transform = l;
    path.setAttribute("style","transform: "+l);
    const electron = document.createElement('div');
    path.appendChild(electron);
    
    return path;
}

window.setInterval(() => {
    if(x<=0)return;
    x--;
    const path = makeOrbit(x*18);
    console.log(path);
    document.getElementById("body").append(path);
}, 1000);