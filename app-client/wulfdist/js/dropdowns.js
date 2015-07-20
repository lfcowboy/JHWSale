$.fn.extend({
    adaptiveSelectlist: function () {
        var $select = $(this);
        $select.selectlist();
        var $dropDownMecu = $select.find('> .dropdown-menu');
        var DROP_DOWN_MIN_WIDTH_IN_PX = $dropDownMecu.css('min-width').replace(/[^-\d\.]/g, '');
        $select.on('changed.fu.selectlist', function () {
            var adaptedWidth = $select.width();
            if ( adaptedWidth > DROP_DOWN_MIN_WIDTH_IN_PX){
                $dropDownMecu.css('width', adaptedWidth );
            }else{
                $dropDownMecu.css('width', 'auto' );
            }
        });
    }
});