function changeRegions() {
    $("#country").click(function(){
        worldMap.reset();
        $("#view_code")[0].innerHTML = "EmbeddedData-Country";
        $(".region").hide();
        $(".subregion").hide();
        $(".country").show();
        $("#piecesSVG").hide('slow');
    });

    $("#sub-region").click(function(){
        worldMap.reset();
        $("#view_code")[0].innerHTML = "EmbeddedData-Region_Sub";
        $(".region").hide();
        $(".country").hide();
        $(".subregion").show();
        $("#piecesSVG").show('slow');
    });

    $("#region").click(function(){
        worldMap.reset();
        $("#view_code")[0].innerHTML = "EmbeddedData-Region_Cont";
        $(".country").hide();
        $(".subregion").hide();
        $(".region").show();
        $("#piecesSVG").show('slow');
    });
}