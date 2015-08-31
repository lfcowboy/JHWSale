$( document ).ready(function() {

	//Cell selection
	$('.n-table-cell-hover').on('click', 'td', function(e) {
		$(this).closest('table').find('td').removeClass('n-cell-selected');
		$(this).addClass('n-cell-selected');


	});

	//Row selection
	$('.n-table-hover').on('click', 'td', function(e) {
		var keyPressed = (window.event && (window.event.ctrlKey || window.event.shiftKey)) || e.ctrlKey || e.shiftKey;
		var isHighLighted=$(this).closest("tr").children("td").hasClass("n-cell-selected");

		$(this).closest("tr").children("td").removeClass("n-cell-selected");
		var otherIsHighLighted=$(this).closest('table').find('td').hasClass('n-cell-selected');

		if(!keyPressed){
			$(this).closest('table').find('td').removeClass('n-cell-selected');
		}
		else if(isHighLighted && otherIsHighLighted){
			return;
		}
		$(this).closest("tr").children("td").addClass("n-cell-selected");
	});


	$('.n-sortable').on('click',function(e) {
		var arrow = $(this).find('> span');
		if (arrow.is('.icon-arrow'))
		{
			arrow.removeClass('icon-arrow');
			arrow.addClass("icon-arrow-up");

		}else if(arrow.is('.icon-arrow-up')) {
			arrow.removeClass('icon-arrow-up');
			arrow.addClass("icon-arrow");
		}
	});
});