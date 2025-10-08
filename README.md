# About Consistent

This is a collection of shaders that I made to introduce and familarise myself with GLSL. Mainly just trial and error, searching stuff up and trying to do some physics experiments :)

# Images

**Simple Subpixels:**<br>
Does a few distortion effects like seperating the pixels into red green and blue subpixels. Was inspired by the penumbra home page with the brightness of each pixel changing so I added that to the shader. There is a row of pixels that get offset which scroll down the screen. The uv is warped at the edges to simualte a 3d screen. Look better at lower resolutions ngl. Also there's a little animation at the start which gradually increases the number of pixels to the resolution of the shader display. 
<p align="center"><img width="458" alt="image" src="https://github.com/user-attachments/assets/76e4dacb-5fcd-4725-8c50-ee6b872f86a3" /></p>

**Drifty Dreams:**<br>
Sphere combined with a flat torus using a soft mix to make a black hole shape. A fresnel effect is then added to light bending around the edge. The background is a 3d noise texture that is mirrored fromt he x and y axis. A slight tilt animation is also added.
<p align="center"><img width="458" alt="image" src="https://github.com/user-attachments/assets/f0cc2718-8d2b-4be7-a75d-e26578d9ca3d" /></p>

**Voronoi spaces:**<br>
Does some voronoi stuff by plotting points and create cells. Then the uv is scaled to 10 different lengths to offset. Finally they are all added together. An animation which just scrolls the screens and moves up and down is added. 
<p align="center"><img width="458" alt="image" src="https://github.com/user-attachments/assets/762ae881-7976-4274-98f1-83893c5d66e6" /></p>

**Two Body Gravity Basins:**<br>
It uses a RK4 integrator to simualte the motion of pixel particles towards to slightly unbalanced masses. Red is the mass on the left and Blue is the mass on the right. Black areas are where pixels never reach either mass. I added a little bit of damping to make the more realistic 
<p align="center"><img width="458" alt="image" src="https://github.com/user-attachments/assets/00f9e729-da4c-4c26-9f76-2602a9892381" /></p>

**Three Body Gravity Basins:**<br>
Basically the same as the two body gravity basin but there's three masses with green mass on top. 
<p align="center"><img width="458" alt="image" src="https://github.com/user-attachments/assets/e2cd50a1-8e9d-45e4-ab2c-e423e9f1ebf1" /></p>
