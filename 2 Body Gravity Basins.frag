//Inspired by https://www.youtube.com/watch?v=LavXSS5Xtbg

// Gravity centers
float mass1 = 0.13;
float mass2 = 0.18;

// Acceration calculation
vec2 acceleration(vec2 p, vec2 center1, vec2 center2) {
    vec2 toC1 = center1 - p;
    float r1 = max(length(toC1), 0.05);
    vec2 a1 = (mass1 / (r1 * r1)) * normalize(toC1);

    vec2 toC2 = center2 - p;
    float r2 = max(length(toC2), 0.05);
    vec2 a2 = (mass2 / (r2 * r2)) * normalize(toC2);

    return a1 + a2;
}

// RK4
void rk4(inout vec2 pos, inout vec2 vel, float dt, vec2 center1, vec2 center2) {
    vec2 k1v = acceleration(pos, center1, center2) * dt;
    vec2 k1p = vel * dt;

    vec2 k2v = acceleration(pos + 0.5 * k1p, center1, center2) * dt;
    vec2 k2p = (vel + 0.5 * k1v) * dt;

    vec2 k3v = acceleration(pos + 0.5 * k2p, center1, center2) * dt;
    vec2 k3p = (vel + 0.5 * k2v) * dt;

    vec2 k4v = acceleration(pos + k3p, center1, center2) * dt;
    vec2 k4p = (vel + k3v) * dt;

    vel *= 0.9999;  // a little damping
    vel += (k1v + 2.0 * k2v + 2.0 * k3v + k4v) / 6.0;
    pos += (k1p + 2.0 * k2p + 2.0 * k3p + k4p) / 6.0;
}

void mainImage(out vec4 fragColor, in vec2 fragCoord) {

    vec2 center1 = vec2(0.4, 0.5);
    vec2 center2 = vec2(0.6, 0.5);
    vec2 uv = fragCoord.xy / iResolution.xy;

    vec2 pos = uv;
    vec2 vel = vec2(0.0);

    float dt = 0.01;
    int maxSteps = 500;

    vec3 color = vec3(0.0);

    for (int i = 0; i < maxSteps; i++) {
        rk4(pos, vel, dt, center1, center2);

        if (length(pos - center1) < 0.02) {
            color = vec3(1.0, 0.2, 0.2);  // red
            break;
        }

        if (length(pos - center2) < 0.02) {
            color = vec3(0.2, 0.2, 1.0);  // blue
            break;
        }
    }

    float d1 = length(uv - center1);
    float d2 = length(uv - center2);
    color += smoothstep(0.02, 0.0, d1) * vec3(1.0, 0.2, 0.2);
    color += smoothstep(0.02, 0.0, d2) * vec3(0.2, 0.2, 1.0);

    fragColor = vec4(color, 1.0);
}
