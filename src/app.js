import * as THREE from 'three';

function ColorLuminance(hex, lum) {

	// validate hex string
	hex = String(hex).replace(/[^0-9a-f]/gi, '');
	if (hex.length < 6) {
		hex = hex[0]+hex[0]+hex[1]+hex[1]+hex[2]+hex[2];
	}
	lum = lum || 0;

	// convert to decimal and change luminosity
	var rgb = "#", c, i;
	for (i = 0; i < 3; i++) {
		c = parseInt(hex.substr(i*2,2), 16);
		c = Math.round(Math.min(Math.max(0, c + (c * lum)), 255)).toString(16);
		rgb += ("00"+c).substr(c.length);
	}

	return rgb;
}

export const createPlanet = (size, realScene) =>{
    const geometry = new THREE.DodecahedronGeometry(size, 1);
    geometry.vertices.forEach(function(v){
      v.x += (0-Math.random()*(size/4));
      v.y += (0-Math.random()*(size/4));
      v.z += (0-Math.random()*(size/4));
    })
    var color = '#111111';
    color = ColorLuminance(color,2+Math.random()*10);
    // console.log(color);
      const texture = new THREE.MeshStandardMaterial({color:color,
        flatShading: true,
                                       //   shininess: 0.5,
                                              roughness: 0.8,
                                              metalness: 1
                                          });
  
      const	cube = new THREE.Mesh(geometry, texture);
    cube.castShadow = true;
    // cube.receiveShadow = true;
    cube.scale.set(1+Math.random()*0.4,1+Math.random()*0.8,1+Math.random()*0.4);
      //cube.rotation.y = Math.PI/4;
      //cube.rotation.x = Math.PI/4;
    var x = 0;
    // var centeredness = 1-(Math.abs(x)/(maxWidth/2));
    var y = -1000
    var z = 200
    cube.position.set(x,y,z)
    cube.r = {};
    cube.r.x = Math.random() * 0.005;
    cube.r.y = Math.random() * 0.005;
    cube.r.z = Math.random() * 0.005;
    realScene.add(cube);
    return cube;
}

export const createAsteroids = (realScene) => {
    var maxWidth = 1000;
    // var maxHeight = 200;
    // var maxDepth = 200;
    var asteroids = [];
    for(var i=0;i<5;i++){
      asteroids.push(createRock(5+Math.random()*50,600,maxWidth,300,200, realScene));
    }
    for(var i=0;i<20;i++){
      asteroids.push(createRock(5+Math.random()*8,500,maxWidth- 200,200,600, realScene));
    }
    for(var i=0;i<40;i++){
      asteroids.push(createRock(2+Math.random()*4,1000,maxWidth- 500,150,800, realScene));
    }
    return asteroids;
  }
  
 export const createRock =(size,spreadX,maxWidth,maxHeight,maxDepth, realScene)=>{
      const geometry = new THREE.DodecahedronGeometry(size, 1);
    geometry.vertices.forEach(function(v){
      v.x += (0-Math.random()*(size/4));
      v.y += (0-Math.random()*(size/4));
      v.z += (0-Math.random()*(size/4));
    })
    var color = '#111111';
    color = ColorLuminance(color,2+Math.random()*10);
    // console.log(color);
      const texture = new THREE.MeshStandardMaterial({color:color,
        flatShading: true,
                                       //   shininess: 0.5,
                                              roughness: 0.8,
                                              metalness: 1
                                          });
  
      const	cube = new THREE.Mesh(geometry, texture);
    cube.castShadow = true;
    // cube.receiveShadow = true;
    cube.scale.set(1+Math.random()*0.4,1+Math.random()*0.8,1+Math.random()*0.4);
      //cube.rotation.y = Math.PI/4;
      //cube.rotation.x = Math.PI/4;
    var x = spreadX/2-Math.random()*spreadX;
    var centeredness = 1-(Math.abs(x)/(maxWidth/2));
    var y = (maxHeight/2-Math.random()*maxHeight)*centeredness
    var z = (maxDepth/2-Math.random()*maxDepth)*centeredness
    cube.position.set(x,y,z)
    cube.r = {};
    cube.r.x = Math.random() * 0.005;
    cube.r.y = Math.random() * 0.005;
    cube.r.z = Math.random() * 0.005;
    realScene.add(cube);
    return cube;
  };