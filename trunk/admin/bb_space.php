<?php
require_once('../initialise.php');
?>
<script type="text/javascript">
$(document).ready(function(){
	$.post('bb_space_view.php',{},function(res){eval(res)});
});
</script>
<div id="bb_space_view">
<image src="/themes/<?=$kfm->setting('theme');?>/large_loader.gif" alt="space view" />
</div>
