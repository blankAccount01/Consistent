//References: https://www.shadertoy.com/view/tflBDM
#define MAX_DIST 100.
#define EPS 0.001
#define STEPS 50

float noise2D(vec2 p, float t) {
    float s = 0.0;
    float a = 1.;
    for(; a < 32.0; a *= 2.0) {
        p += cos(0.7 * t + p.yx) * 0.2;
        s += abs(dot(sin(0.1 * t + p * a), vec2(0.6, 0.6))) / a;
    }
    return clamp(s / 1., 0.5, 1.0);
}



// Sphere SDF
float sphere(vec3 p){
    return length(p)*1.-1.;
}

mat2 rot(float a) {
    float c = cos(a), s = sin(a);
    return mat2(c, -s, s, c);
}

float torus(vec3 p, vec2 t, float flatten){
    p.y /= flatten;
    p.yz = rot(.05*sin(iTime)) * p.yz; 
    p.yx = rot(.15*cos(iTime+.1)) * p.yx; 
    vec2 q = vec2(length(p.xz) - t.x, p.y);
    return length(q) - t.y; 
}

// Soft minimum
float smin(float a, float b, float k){
        float h = clamp(0.5 + 0.5*(b-a)/k, 0.0, 1.0);
    return mix(b, a, h) - k*h*(1.0-h);
}

float map(vec3 p){
    float s1 = sphere(vec3(p.x, p.y, p.z-1.));
    float s2 = torus(vec3(p.x+0., p.y, p.z-1.),vec2(1.4,.3),.2);
    return smin(s1, s2, 0.8); 
}

void mainImage(out vec4 o, vec2 fragCoord){
    // normalize
    vec2 u = (fragCoord - 0.5*iResolution.xy)/iResolution.y;

    // camera
    vec3 ro = vec3(0,0,-3);
    float fov = 1.0;
    vec3 rd = normalize(vec3(u*fov, 1.0));

    // raymarch
    float d=0., s=1.;
    int i;
    for(i=0; i<int(STEPS); i++){
        s = map(ro + rd*d);
        if(s < EPS) break;
        d += s;
        if(d > MAX_DIST) break;
    }

    if(d > MAX_DIST){ //2d stuff
        vec2 mirroredUV = vec2(abs(u.x), abs(u.y));
        float mask = 1.0 - smoothstep(0.35, 0.35 * 1.5, distance(u, vec2(0.)));
        vec2 warp = vec2(noise2D(mirroredUV * 10.0 , iTime),noise2D(mirroredUV * 10.0 ,iTime));
        vec2 warpedUV = mix(mirroredUV, mirroredUV + 0.1 * warp, mask);
        float n = noise2D(warpedUV * 10., iTime);
        n=smoothstep(0.0,n,0.4);
        o = vec4(vec3(n), 1.0);
        
    } else {
        // Hit point
        vec3 p = ro + rd * d;

        // Estimate normal
        float e = 0.0001;
        vec2 h = vec2(e, 0.0);
        vec3 normal = normalize(vec3(
            map(p + h.xyy) - map(p - h.xyy),
            map(p + h.yxy) - map(p - h.yxy),
            map(p + h.yyx) - map(p - h.yyx)
        ));

        // View direction
        vec3 viewDir = normalize(ro - p);

        // Fresnel effect
        float fresnel = pow(1.0 - dot(viewDir, normal), 9.0);
        fresnel = mix(0.1, 100.0, fresnel);

        // Base shading
        float shade = (1.0 - float(i)/float(STEPS)) * (1.0 - d/MAX_DIST);
        shade *= exp(-5.0 * s);
        shade *= 1.0 - d / MAX_DIST;
        vec3 base = vec3(1.0) - vec3(shade);
        vec3 color = base + vec3(fresnel);
        o = vec4(color, 1.0);
    }
    
}
