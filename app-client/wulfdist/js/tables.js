$( document ).ready(function() {

	//Cell selection
	$('.n-table-cell-hover').on('click', 'td', function(e) {
		$(this).closest('table').find('td').removeClass('n-cell-selected');
		$(this).addClass('n-cell-selected');
	});

	//Row selection
	$('.n-table-hover').on('click', 'td', function(e) {
		$(this).closest('table').find('td').removeClass('n-cell-selected');
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