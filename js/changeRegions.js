function changeRegions() {
    $("#country").click(function(){
        $(".region").hide();
        $(".subregion").hide();
        $(".country").show();
        $("#piecesSVG").hide('slow');
    });

    $("#sub-region").click(function(){
        $(".region").hide();
        $(".country").hide();
        $(".subregion").show();
        $("#piecesSVG").show('slow');
    });

    $("#region").click(function(){
        $(".country").hide();
        $(".subregion").hide();
        $(".region").show();
        $("#piecesSVG").show('slow');
    });
}