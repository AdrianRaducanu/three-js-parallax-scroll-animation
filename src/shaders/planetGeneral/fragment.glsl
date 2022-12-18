varying vec3 vPos;
varying vec3 vColor;

uniform vec3 uInsideColor;
uniform vec3 uOutsideColor;

void main()
{
    float dToCenter = distance(vPos, vec3(0.0));

    float d = distance(gl_PointCoord, vec2(0.5));
    float opacity = 1.0 / (1.0 + exp(16.0 * (d - 0.25)));

    float strength = distance(gl_PointCoord, vec2(0.5));
    strength *= 2.0;
    strength = 1.0 - strength;

    vec3 color = mix(vec3(0.0), vColor, strength);
    gl_FragColor = vec4(color, opacity);
}