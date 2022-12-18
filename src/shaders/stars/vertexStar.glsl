varying float vDtc;

void main() {
    vec4 modelPosition = modelMatrix * vec4(position, 1.0);
    
    // Distance to center
    float dtc = distance(vec3(0.0), modelPosition.xyz);

    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectedPosition = projectionMatrix * viewPosition; 
    

    gl_Position = projectedPosition;

    gl_PointSize = 0.1 * exp(dtc - 0.3);

    vDtc = dtc;
}