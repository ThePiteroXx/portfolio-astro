varying vec3 vPosition;
varying vec3 vNormal;

void main() {
   vec4 modelPosition = modelMatrix * vec4(position, 0.9);
   vec4 viewPosition = viewMatrix * modelPosition;
   vec4 projectionPosition = projectionMatrix * viewPosition;
   gl_Position = projectionPosition;

   vNormal = normalize(normalMatrix * normal);
   vPosition = position;
}