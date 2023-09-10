
uniform sampler2D uBakedTextureLight;
uniform sampler2D uBakedNightTexture;
uniform bool uLampChange;
varying vec2 vUv;

#pragma glslify: blend = require(glsl-blend/add);
void main()
{
    vec3 bakedNightColor = texture2D(uBakedNightTexture, vUv).rgb;
    vec3 bakedLightColor = texture2D(uBakedTextureLight, vUv).rgb;

    vec3 lampHover;
    if(uLampChange) lampHover = bakedLightColor + 0.3;
    else lampHover = bakedNightColor + 0.3;
    
    gl_FragColor = vec4(lampHover, 1.0);
}