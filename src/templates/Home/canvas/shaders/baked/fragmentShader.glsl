
uniform sampler2D uBakedNightTexture;
uniform sampler2D uLightMapTexture;
uniform sampler2D uBakedTextureLight;

uniform bool uChangeBaked;
uniform bool uLampHover;

uniform vec3 uLightColor;



varying vec2 vUv;

#pragma glslify: blend = require(glsl-blend/add);
// #pragma glslify: blend = require(glsl-blend/lighten);
// #pragma glslify: blend = require(glsl-blend/normal);
// #pragma glslify: blend = require(glsl-blend/screen);

void main()
{
    vec3 bakedLightColor = texture2D(uBakedTextureLight, vUv).rgb;
    vec3 bakedNightColor = texture2D(uBakedNightTexture, vUv).rgb;
    vec3 lightMapColor = texture2D(uLightMapTexture, vUv).rgb;
    vec3 bakedColor;
    vec3 uLightColor = uLightColor;
 

    if(uChangeBaked) {
        bakedColor = blend(bakedLightColor, uLightColor, lightMapColor.g * 1.2);
        
    }
    else {
        bakedColor = blend(bakedNightColor, uLightColor, lightMapColor.g * 1.2);
    }
    
    // lamp code 

    gl_FragColor = vec4(bakedColor, 1.0);
}