import * as THREE from 'three';
import mapData from './json/layout.json' with {type: 'json'};

export const utils = {
  textureToMaterial: function(texture, color)
  {
    if(typeof color == "undefined") {
      return new THREE.MeshBasicMaterial({map: texture})
    } else {
      return new THREE.MeshBasicMaterial({color: color, map: texture})
    }
  },

  imageToMaterial: function(imgPath, color)
  {
    return utils.textureToMaterial(new THREE.TextureLoader().load(imgPath), color)
  },

  getCubesDataFromId: function(inputId)
  {
    for(let i = 0; i < mapData.objects.infoCubesData.length; i++)
    {
      if(mapData.objects.infoCubesData[i].id == inputId)
      {
        return mapData.objects.infoCubesData[i];
      }
    }
  },
  
  pageToMaterial: async function()
  {
    var imageURL;
    const canvas = await html2canvas(document.querySelector(("IndexDiv")));
    imageURL = canvas.toDataURL("png", 1);
    return this.imageToMaterial(imageURL);
  }
}

export class Vector3D
{
  constructor(x,y,z)
  {
    if(typeof(x) == "undefined"){this.x = 0}else{this.x = x;}
    if(typeof(y) == "undefined"){this.y = 0}else{this.y = y;}
    if(typeof(z) == "undefined"){this.z = 0}else{this.z = z;}
  }
  
  add(otherVector)
  {
    return new Vector3D(this.x + otherVector.x, this.y + otherVector.y, this.z + otherVector.z)
  }

  subtract(otherVector)
  {
    return new Vector3D(this.x - otherVector.x, this.y - otherVector.y, this.z - otherVector.z)
  }

  multiply(scalar)
  {
    return new Vector3D(this.x*scalar, this.y*scalar, this.z*scalar)
  }

  divide(scalar)
  {
    return new Vector3D(this.x/scalar, this.y/scalar, this.z/scalar)
  }

  magnitude()
  {
    return (Math.sqrt(this.x*this.x + this.y*this.y + this.z*this.z))
  }

  normalized()
  {
    return this.divide(this.magnitude)
  }
}

export default utils;