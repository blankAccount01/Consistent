vec2 hash(vec2 p) { 
    p = vec2(dot(p, vec2(927.3, 354.7)), dot(p, vec2(947.6, 104.7))); return fract(sin(p) * 9927.3658); 
}

void mainImage(out vec4 fragColor, in vec2 fragCoord)
{
    vec2 uv = fragCoord.xy / iResolution.xy;
    uv *= 6.0;
    uv.y+=.8*sin(iTime)+0.1*sin(2.*iTime+3.14)+0.1*sin(4.*iTime+3.14)+0.001*sin(10.*iTime);
    uv.x+=iTime;
    
    vec2 baseCell = floor(uv);
    vec2 local = fract(uv);

    const int NUM_CASES = 10;

    float thresholds[NUM_CASES - 1] = float[](0.9, 0.8, 0.7, 0.6,0.5,0.4,0.3,0.2,0.1);

    vec2 offsets[NUM_CASES] = vec2[](
        vec2(0.0),   // layer 0
        vec2(5.0),   // layer 1
        vec2(9.0),   // layer 2
        vec2(15.0),  // layer 3
        vec2(18.0),   // layer 4
        vec2(20.0),   // layer 5
        vec2(31.0),   // layer 6
        vec2(38.0),   // layer 7
        vec2(42.0),   // layer 8
        vec2(56.0)   // layer 9
    );

    vec3 finalColor = vec3(0.0);

    for (int layer = 0; layer < NUM_CASES; layer++) {
        vec2 cell = baseCell + offsets[layer];

        float minDist = 100.0;
        vec2 nearest;

        for (int j = -1; j <= 1; j++) {
            for (int i = -1; i <= 1; i++) {
                vec2 neighbor = cell + vec2(i, j);
                vec2 rand = hash(neighbor);
                vec2 featurePoint = vec2(i, j) + rand;

                float dist = distance(local, featurePoint);

                if (dist < minDist) {
                    minDist = dist;
                    nearest = rand;
                }
            }
        }

        vec3 color = vec3(nearest, 0.5);

        finalColor += color;
    }

    finalColor /= float(NUM_CASES);

    fragColor = vec4(finalColor, 1.0);
}
