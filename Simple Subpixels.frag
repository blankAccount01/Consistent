void mainImage(out vec4 fragColor, in vec2 fragCoord)
{
    float pixelSize = 3.0 * floor(clamp(mix(30.0, 3.0, mix(iTime/3.0, (exp(iTime/5.0*5.0)-1.0)/(exp(5.0)-1.0), 0.7)), 3.0, 30.0));

    vec2 uv = fragCoord.xy / iResolution.xy;
    vec2 normUV = uv * 2.0 - 1.0;
    normUV.x *= iResolution.x / iResolution.y;
    float warpAmount = 0.1;
    normUV *= 1.0 + warpAmount * pow(length(normUV), 2.0);
    normUV.x /= iResolution.x / iResolution.y;
        uv = (normUV + 1.1) / 2.2;
    vec2 warpedFragCoord = uv * iResolution.xy;
    float targetRow = mod(-iTime*10., iResolution.y/pixelSize);;
    float yIndex = floor(warpedFragCoord.y / pixelSize);
    vec2 pixelUV = floor(warpedFragCoord / pixelSize) * pixelSize;
    if (yIndex == floor(targetRow)&&iTime>5.) {
        pixelUV.y += 5.0;
    }
    vec2 centerUV = pixelUV / iResolution.xy;
    bool outside = (centerUV.x < 0.0) || (centerUV.x > 1.0) || (centerUV.y < 0.0) || (centerUV.y > 1.0);
    vec3 color = outside ? vec3(0.0) : texture(iChannel0, centerUV).rgb;
    float subpixelWidth = pixelSize / 3.0;
    float xMod = mod(warpedFragCoord.x, pixelSize);

    vec3 outputColor = vec3(0.0);
    
    if (xMod < subpixelWidth) {
        float pixelHash = fract(sin(dot(pixelUV.xy, vec2(527.1, 318.7))) * 43758.5453123);
        float rand = sin(5.0 * (iTime + 100000.0 * pixelHash));
        outputColor.r = (color.r*1.)+(color.r*rand*0.1);
    } else if (xMod < subpixelWidth * 2.0) {
        float pixelHash = fract(sin(dot(pixelUV.xy, vec2(127.1, 311.7))) * 46758.5953123);
        float rand = sin(5.0 * (iTime + 100000.0 * pixelHash));
        outputColor.g = (color.g*1.)+(color.g*rand*0.1);
    } else {
        outputColor.b = color.b;
    }

    fragColor = vec4(outputColor, 1.0);
}
