<html>
<head>
<script type="text/javascript" src="lib/prototype.js" language="javascript"></script>
<script type="text/javascript" src="lib/scriptaculous.js?load=builder,dragdrop" language="javascript"></script>
<script type="text/javascript" src="cropper.js" language="javascript"></script>
</head>
<body style="padding:0;">
<button type="button" onclick="parent.kfm_cropToOriginal(imageid, coordinates, dimensions);">Crop</button>
<button type="button" onclick="parent.kfm_cropToNew(imageid, coordinates, dimensions);">Crop to new image</button>
<button type="button" onclick="parent.document.getElementById('cropperdiv').style.display='none';">cancel</button>
<img src="<?php echo preg_replace('#plugins/cropper.*#','',$_SERVER['REQUEST_URI']); ?>/get.php?id=<?php print $_GET['id'];?>" alt="Crop image" id="cropImage" width="<?php print $_GET['width'];?>" height="<?php print $_GET['height'];?>" />
<script type="text/javascript" language="javascript">
var imageid=<?php print $_GET['id'];?>;
var coordinates=null;
var dimensions=null;
Event.observe( window, 'load', function() {
	new Cropper.Img(
		'cropImage',
		{ onEndCrop: onEndCrop }
	);
} );
function onEndCrop( coords, dims ) {
	coordinates=coords;
	dimensions=dims;
}
</script>
</body>
</html>
