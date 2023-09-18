uniform float time;
uniform float progress;
uniform sampler2D tDiffuse;
uniform vec2 resolution;
varying vec2 vUv;
uniform vec2 uMouse;
uniform float uVelo;


	float circle(vec2 uv, vec2 disc_center, float disc_radius, float border_size) {
		uv -= disc_center;
		uv*=resolution;
		float dist = sqrt(dot(uv, uv));
		return smoothstep(disc_radius+border_size, disc_radius-border_size, dist);
	}

	float map(float value, float min1, float max1, float min2, float max2) {
		return min2 + (value - min1) * (max2 - min2) / (max1 - min1);
	}

	float remap(float value, float inMin, float inMax, float outMin, float outMax) {
		return outMin + (outMax - outMin) * (value - inMin) / (inMax - inMin);
	}

	float hash12(vec2 p) {
		float h = dot(p,vec2(127.1,311.7));	
		return fract(sin(h)*43758.5453123);
	}

	// #define HASHSCALE3 vec3(.1031, .1030, .0973)
	vec2 hash2d(vec2 p)
	{
		vec3 p3 = fract(vec3(p.xyx) * vec3(.1031, .1030, .0973));
	    p3 += dot(p3, p3.yzx+19.19);
	    return fract((p3.xx+p3.yz)*p3.zy);
	}




void main()	{
	vec2 newUV = vUv;
	vec4 color = vec4(1.,0.,0.,1.);
	

	// zoom
	
	float c = circle(newUV, uMouse, 0.0, 0.1+uVelo*2.)*40. * clamp(uVelo* 10., 0., 0.02);
	vec2 offsetVector = -normalize(uMouse - vUv);
	vec2 warpedUV = mix(vUv, uMouse, c * 0.7); //power
	vec2 warpedUV1 = mix(vUv, uMouse, c * 0.4); //power
	vec2 warpedUV2 = mix(vUv, uMouse, c * 0.5); //power
	color = vec4(
		texture2D(tDiffuse,warpedUV ).r,
		texture2D(tDiffuse,warpedUV1 ).g,
		texture2D(tDiffuse,warpedUV2 ).b,
		1.);



	gl_FragColor = color;
}