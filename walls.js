//HTML5 Canvas Image Loader Tutorial
//http://www.html5canvastutorials.com/tutorials/html5-canvas-image-loader/

function walls()
{
	//ref to this
	const w = this;

	w.init = function()
	{

	w.ParallaxSPEED = 0.05;
    w.images = [];
    w.loadedImages = 0;
    w.numImages = 0;

	battlefieldStartX = c.width * 0;
	battlefieldStartY = c.height*0;
	battlefieldWidth  = c.width;
	battlefieldHeight = c.height;

	w.sources = {
		background: 'images/moon.jpg',
		battlefield: 'Images/highResBattlefield.png'
    };




   // get num of sources
        for(var src in w.sources) {
          w.numImages++;
        }


        for(var src in w.sources) {
          w.images[src] = new Image();
          w.images[src].onload = function() {
            if(++w.loadedImages >= w.numImages) {

            }
          };
          w.images[src].src = w.sources[src];
        }



		w.images.battlefield.style.filter = "alpha(opacity=50)";
		w.images.battlefield.style.opacity = 0.5;
	}





	w.drawImages = function()
	{
		//Normalize player position to battlefield. Far left -> x = 0. Far right -> x = 1.
		parX = (pl.pos[0] - battlefieldStartX) / ( battlefieldWidth);
		parY = (pl.pos[1] - battlefieldStartY) / ( battlefieldHeight);



		//Draw background bigger than the screen so we can create parallax effect
		ctx.drawImage(w.images.background, -c.width*w.ParallaxSPEED * parX, -c.height*w.ParallaxSPEED*parY, c.width+c.width*w.ParallaxSPEED, c.height+c.height*w.ParallaxSPEED);


		ctx.globalAlpha = 0.0;
		ctx.drawImage(w.images.battlefield, battlefieldStartX, battlefieldStartY, battlefieldWidth, battlefieldHeight);
		ctx.globalAlpha = 1.0;


	}


}
