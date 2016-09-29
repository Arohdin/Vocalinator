//HTML5 Canvas Image Loader Tutorial
//http://www.html5canvastutorials.com/tutorials/html5-canvas-image-loader/

function walls()
{
	//ref to this
	const w = this;

	//MAKE THIS A FUNCTION OF THIS OBJECT
	function loadImages(sources, callback)
	{


    w.images = [];
    w.loadedImages = 0;
    w.numImages = 0;



   // get num of sources
        for(var src in w.sources) {
          w.numImages++;
        }
        for(var src in w.sources) {
          w.images[src] = new Image();
          w.images[src].onload = function() { //ONLY RUNS FIRST TIME IMAGE IS LOADED
            if(++w.loadedImages >= w.numImages) {
              callback(w.images);
            }
          };
          w.images[src].src = w.sources[src];
        }

	}

	//MOVE THIS
	w.sources = {
        battlefield: 'Images/highResBattlefield.png'
     };


	//THIS DOES NOT WORK?
	//This is the function that is called from the draw-loop in main
	w.drawImages = function()
	{
		//THIS SHOULD ONLY RUN ONCE, CREATE A INIT FUNCTION
		loadImages(w.sources, function(images) { //REMOVE CALLBACK AND USE ONLY RENDER
		ctx.drawImage(w.images.battlefield, c.width * 0.1, c.height*0.05, c.width - c.width * 0.2, c.height - c.height*0.1);
		});
		//CREATE A LOOP THAT GOES THROUGH ALL THE ELEMENTS (IMAGES) STORED
		ctx.drawImage(w.images.battlefield, c.width * 0.1, c.height*0.05, c.width - c.width * 0.2, c.height - c.height*0.1);
	}


}
