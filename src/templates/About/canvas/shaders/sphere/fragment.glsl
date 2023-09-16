varying vec2 vUv;

varying float vNoise;

void main() {
   
   float strength = pow(vNoise, 0.3);
   gl_FragColor = vec4(0.1, strength, 1.0, 1.0);
}