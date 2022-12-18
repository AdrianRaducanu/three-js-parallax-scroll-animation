#define PI 3.1416

uniform float uSize;
uniform float uTime;
uniform float uWindowSizeHeight;
uniform float uWindowSizeWidth;
uniform float uScrollScale;
uniform float uFinish;

attribute float aScale;

varying vec3 vPos;
varying vec3 vColor;

void main() {
    vec4 modelPosition = modelMatrix * vec4(position, 1.0);
    
    // Distance to center
    float dtc = distance(vec3(0.0), modelPosition.xyz);
    
    // Rotate
    float angle = atan(modelPosition.x, modelPosition.z);
    float distanceToCenter = length(modelPosition.xz);


    //Rotation
    modelPosition.x = cos(angle + uTime * 0.1) * distanceToCenter;
    modelPosition.z = sin(angle + uTime * 0.1) * distanceToCenter;

    //Scale
    //modelPosition.x *=(sin(PI * 0.5) + (1.0 - (abs(0.45 - uScrollScale)))) * dtc; 
    //modelPosition.y *=(sin(PI * 0.5) + (1.0 - (abs(0.45 - uScrollScale)))) * dtc; 
    modelPosition.x *=(sin(PI * 0.5) + (2.5 * (sin(uScrollScale * PI)))) * dtc * uFinish;
    modelPosition.y *=(sin(PI * 0.5) + (2.5 * (sin(uScrollScale * PI)))) * dtc * uFinish;
    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectedPosition = projectionMatrix * viewPosition; 

    gl_Position = projectedPosition;

    gl_PointSize = uSize * aScale * 2.5 * (uWindowSizeWidth/700.0 ) ;
    gl_PointSize *= (1.0 / - viewPosition.z);

    vPos = modelPosition.xyz;
    vColor = color;
}