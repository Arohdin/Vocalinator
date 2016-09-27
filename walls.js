//HTML5 Canvas Image Loader Tutorial
//http://www.html5canvastutorials.com/tutorials/html5-canvas-image-loader/

function walls()
{
	//ref to this
	const w = this;

	function loadImages(sources, callback)
	{


    w.images = {};
    w.loadedImages = 0;
    w.numImages = 0;



   // get num of sources
        for(var src in w.sources) {
          w.numImages++;
        }
        for(var src in w.sources) {
          w.images[src] = new Image();
          w.images[src].onload = function() {
            if(++w.loadedImages >= w.numImages) {
              callback(w.images);
            }
          };
          w.images[src].src = w.sources[src];
        }

	}

	w.sources = {
        battlefield: 'Images/highResBattlefield.png'
     };


	//THIS DOES NOT WORK?
	//This is the function that is called from the draw-loop in main
	w.drawImages = function()
	{
		loadImages(w.sources, function(images) {
		ctx.drawImage(w.images.battlefield, c.width * 0.1, c.height*0.05, c.width - c.width * 0.2, c.height - c.height*0.1);
		});
		ctx.drawImage(w.images.battlefield, c.width * 0.1, c.height*0.05, c.width - c.width * 0.2, c.height - c.height*0.1);
	}


}
