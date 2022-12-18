varying float vDtc;

void main() {

    float d = distance(gl_PointCoord, vec2(0.5));
    float opacity = 1.0 / (1.0 + exp(16.0 * (d - 0.25)));

    float strength = 0.15 / (distance(vec2(gl_PointCoord.x, (gl_PointCoord.y - 0.5) * 5.0 + 0.5), vec2(0.5)));
    strength *= 0.15 / (distance(vec2(gl_PointCoord.y, (gl_PointCoord.x - 0.5) * 5.0 + 0.5), vec2(0.5)));

    
    gl_FragColor = vec4(vec3(0.5), opacity);
}