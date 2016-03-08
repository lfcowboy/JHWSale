/*!
 * WULF v1.0.50 (http://networks.nokia.com/)
 * Copyright 2016 Nokia Solutions and Networks. All rights Reserved.
 */



( function( factory ) {
	if ( typeof define === 'function' && define.amd ) {
		define( [ 'jquery', 'bootstrap',
			'fuelux/datepicker',
			'fuelux/selectlist',
			'fuelux/tree',
			'jquery-mousewheel',
			'malihu-custom-scrollbar-plugin',
			'twitter-bootstrap-wizard',
			'jqwidgets/jqxcore',
			'jqwidgets/jqxdata',
			'jqwidgets/jqxbuttons',
			'jqwidgets/jqxscrollbar',
			'jqwidgets/jqxmenu',
			'jqwidgets/jqxcheckbox',
			'jqwidgets/jqxlistbox',
			'jqwidgets/jqxdropdownlist',
			'jqwidgets/jqxgrid',
			'jqwidgets/jqxgrid.filter',
			'jqwidgets/jqxgrid.pager',
			'jqwidgets/jqxgrid.sort',
			'jqwidgets/jqxgrid.edit',
			'jqwidgets/jqxgrid.selection',
			'jqwidgets/jqxpanel',
			'jqwidgets/jqxcombobox',
			'jqwidgets/jqxdatatable',
			'jqwidgets/jqxtreegrid'
		], factory );
	} else if ( typeof module === 'object' && module.exports ) {
		module.exports = function( root, jQuery ) {
			if ( jQuery === undefined ) {
				if ( typeof window !== 'undefined' ) {
					jQuery = require( 'jquery' );

				} else {
					jQuery = require( 'jquery' )( root );
				}
			}
			factory( jQuery, require( 'bootstrap' ), require( 'fuelux' ), require( 'jquery-mousewheel' ), require( 'malihu-custom-scrollbar-plugin' ), require( 'twitter-bootstrap-wizard' ), require( 'jqwidgets-framework/jqwidgets/jqx-all' ) );
			return jQuery;
		};
	} else {
		factory( jQuery );
	}
}( function( $ ) {
	'use strict';
	/* jshint ignore:start */
	if ( typeof $ === 'undefined' ) {
		throw new Error( 'WULF\'s JavaScript requires jQuery' )
	}

	var version = $.fn.jquery.split( ' ' )[ 0 ].split( '.' )
	if ( ( version[ 0 ] < 2 && version[ 1 ] < 9 ) || ( version[ 0 ] == 1 && version[ 1 ] == 9 && version[ 2 ] < 1 ) ) {
		throw new Error( 'WULF\'s JavaScript requires jQuery version 1.9.1 or higher' )
	}
	//balloon.js
	( function( $ ) {

		//toggle all opened popover except the one the click is triggered on.
		$( document ).on( 'click.wf.balloon', function( e ) {
			$( '[data-toggle^="popover"]' ).each( function( idx, el ) {
				if ( e.target !== el ) {
					var popover = $( this ).data( 'bs.popover' );
					var $tip = popover.tip();
					if ( $tip.hasClass( 'in' ) ) {
						$( this ).triggerHandler( 'click.popover' );
					}
				}
			} );
		} );

		//stop propagation if click is triggered on tips
		$( '[data-toggle^="popover"]' ).one( 'shown.bs.popover', function( e ) {
			$( this ).data( 'bs.popover' ).tip().on( 'click.wf.balloon', function( e ) {
				e.stopPropagation();
			} );
		} );

		// resize windown reposition the popover
		// TODO:Jonathan, the resize events should be throttled.
		$( window ).on( 'resize', function( e ) {
			$( '[data-toggle^="popover"]' ).each( function( idx, el ) {
				var popover = $( this ).data( 'bs.popover' );
				var $tip = popover.tip();
				if ( $tip.hasClass( 'in' ) ) {
					popover.show();
				}
			} );
		} );


	} )( $ );


	//banner-responsiveness.js
	( function( $ ) {

		var bannerBlueDetachEvent = "n.banner.blue.block.detached";
		var bannerBlueAttachEvent = "n.banner.blue.block.attached";
		var $bannersInPage = $( ".n-banner" );
		// responsive banner behavior when blue areas in 2 rows are detached
		$( document ).ready( triggerCollapseBanner );
		$( window ).resize( triggerCollapseBanner );

		function triggerCollapseBanner() {
			//loop through every banner on the page
			$bannersInPage.each( function() {
				var $banner = $( this );
				var compensation = 30;

				var bannerToggle = $banner.find( ".n-banner-toggle" );

				//blue part offset on the top banner
				var offsetUpBlue = $banner.find( '.n-banner-1st-blue-to-gray' ).position().left + $banner.find( '.n-banner-1st-blue-to-gray .blue-corner' ).width() - compensation;
				//grey part width in the bottom
				var $navTabDown = $banner.find( '.n-banner-2nd .n-banner-tabs' );
				//grey part off set in the bottom banner
				var offsetDownGray = $navTabDown.width();
				var breakPointState = $banner.attr( "data-visual-break" );
				if ( breakPointState === undefined ) {
					if ( offsetUpBlue < offsetDownGray ) {
						$banner.trigger( bannerBlueDetachEvent );
					} else {
						$banner.trigger( bannerBlueAttachEvent );
					}
				} else if ( breakPointState === "true" && offsetUpBlue > offsetDownGray && typeof bannerToggle !== "undefined" && $( bannerToggle ).css( "display" ) === "none" ) {
					$banner.trigger( bannerBlueAttachEvent );
				} else if ( breakPointState === "false" && offsetUpBlue < offsetDownGray ) {
					$banner.trigger( bannerBlueDetachEvent );
				}
			} );
		}

		$bannersInPage.on( bannerBlueDetachEvent, bannerBlueBlockDetached ).on( bannerBlueAttachEvent, bannerBlueBlockAttached );

		function toggleVisibleBlocksWhenBlueDetached( $banner, detach ) {
			//elements mark to be hidden on blue detached event in the banner
			var hiddenOnBlueDetach = $banner.find( '.hidden-on-blue-detached' );
			var showOnBlueDetach = $banner.find( '.show-on-blue-detached' );
			var overflowCover = $banner.find( '.overflow-toggle-area-cover' );
			if ( detach ) {
				hiddenOnBlueDetach.hide();
				showOnBlueDetach.show();
				overflowCover.show();
			} else {
				hiddenOnBlueDetach.show();
				showOnBlueDetach.hide();
				overflowCover.hide();
			}
		}

		function bannerBlueBlockDetached() {
			/*jshint validthis:true */
			var $banner = $( this );
			$banner.attr( "data-visual-break", true );
			toggleVisibleBlocksWhenBlueDetached( $banner, true );

			//rightmost tab need to hide
			var navTabDownRightmostTab = $banner.find( '.n-banner-2nd .rightmost-tab' );
			navTabDownRightmostTab.removeClass( 'rightmost-tab' ).addClass( 'rightmost-tab-disabled' );

			//transform style for nav links
			var navLinks = $banner.find( '.n-banner-2nd .n-banner-links' );
			var navDropdownLinks = $banner.find( '.n-banner-2nd .n-banner-dropdown-links' );
			navDropdownLinks.find( 'li.dropdown' ).each( function() {
				$banner.addClass( 'n-dropdown-menu-item-has-child' );
			} );
			navDropdownLinks.find( 'ul.dropdown-menu' ).each( function() {
				$banner.addClass( 'n-dropdown-sub-menu' );
			} );
			navLinks.removeClass( 'nav n-banner-nav n-banner-links' ).addClass( "dropdown-menu n-banner-links-collapse-dropdown-menu" );
			navDropdownLinks.removeClass( 'nav n-banner-nav n-banner-dropdown-links' ).addClass( "dropdown-menu n-banner-dropdown-links-collapse-dropdown-menu" );

			//add class for showing dropdown correctly
			var navLinksSubmenu = $banner.find( '.n-banner-2nd .n-banner-links-collapse .dropdown .dropdown-menu' );
			navLinksSubmenu.addClass( 'n-collapse-dropdown-sub-menu' );
		}

		function bannerBlueBlockAttached() {
			/*jshint validthis:true */
			var $banner = $( this );
			$banner.attr( "data-visual-break", false );
			toggleVisibleBlocksWhenBlueDetached( $banner, false );

			//rightmost tab need to show
			var navTabDownRightmosTab = $banner.find( '.n-banner-2nd .rightmost-tab-disabled' );
			navTabDownRightmosTab.removeClass( 'rightmost-tab-disabled' ).addClass( 'rightmost-tab' );

			//transform style for nav links
			var navLinks = $banner.find( '.n-banner-2nd .n-banner-links-collapse-dropdown-menu' );
			var navDropdownLinks = $banner.find( '.n-banner-2nd .n-banner-dropdown-links-collapse-dropdown-menu' );
			navDropdownLinks.find( 'li.dropdown' ).each( function() {
				$banner.removeClass( 'n-dropdown-menu-item-has-child' );
			} );
			navDropdownLinks.find( 'ul.dropdown-menu' ).each( function() {
				$banner.removeClass( 'n-dropdown-sub-menu' );
			} );
			navLinks.removeClass( "dropdown-menu n-banner-links-collapse-dropdown-menu" ).addClass( 'nav n-banner-nav n-banner-links' );
			navDropdownLinks.removeClass( "dropdown-menu n-banner-dropdown-links-collapse-dropdown-menu" ).addClass( 'nav n-banner-nav n-banner-dropdown-links' );

			//remove class
			var navLinksSubmenu = $banner.find( '.n-banner-2nd .n-banner-links-collapse .dropdown .dropdown-menu.n-collapse-dropdown-sub-menu' );
			navLinksSubmenu.removeClass( 'n-collapse-dropdown-sub-menu' );
		}

	} )( $ );


	//buttons.js
	( function( $ ) {

		$( document ).ready( function() {
			$( ".btn-group.n-tab-buttons" ).each( function() {
				var group = $( this );
				var buttons = group.find( ".btn" );

				buttons.each( function() {
					$( this ).click( function() {
						group.find( '.selected' ).removeClass( 'selected' );
						$( this ).addClass( 'selected' );
					} );
				} );
			} );
		} );

	} )( $ );


	//calendar.js
	( function( $ ) {

		var classNoRadiusLb = 'n-inputfield-nonradius-lb';

		$( document )
			.on( 'shown.bs.dropdown hidden.bs.dropdown', '.n-calendar', function() {
				$( this ).children( 'input' ).toggleClass( classNoRadiusLb );
			} )
			.on( 'blur.wf.calendar', '.n-calendar input', function() {
				var $input = $( this );
				$input.next().find( ".dropdown-toggle" ).attr( "aria-expanded", "false" );
				if ( $input.hasClass( classNoRadiusLb ) ) {
					$input.removeClass( classNoRadiusLb );
				}
			} )
			//down key will result the focus to the back button
			.on( 'keydown.wf.calendar', '.n-calendar .datepicker-wheels-year', focusToWheelsBack )
			.on( 'keydown.wf.calendar', '.n-calendar .datepicker-wheels-month', focusToWheelsBack )
			//the focus will be switched to the title after clicking on back or select button.
			.on( 'click.wf.calendar', '.datepicker-wheels-footer .datepicker-wheels-back', focusToHeaderTitle )
			.on( 'click.wf.calendar', '.datepicker-wheels-footer .datepicker-wheels-select', focusToHeaderTitle )
			.on( 'click.wf.calendar', '.n-calendar button.dropdown-toggle', relocateDatePicker )
			.on( 'scroll.wf.calendar', closeDatePickerOnScroll );

		$( window ).on( 'resize.wf.calendar', closeDatePickerOnScroll );

		function focusToWheelsBack( evt ) {
			if ( evt.which === 40 ) {
				/*jshint validthis:true */
				$( this ).nextAll( '.datepicker-wheels-footer' ).find( '.datepicker-wheels-back' ).focus();
				evt.preventDefault();
				evt.stopPropagation();
			}
		}

		function focusToHeaderTitle( evt ) {
			/*jshint validthis:true */
			$( this ).closest( '.datepicker-calendar-wrapper' ).find( 'button.title' ).focus();
			evt.preventDefault();
			evt.stopPropagation();
		}

		function relocateDatePicker( evt ) {
			/*jshint validthis:true */
			var dateInput = $( this ).closest( '.n-calendar' ).find( 'input' );
			if ( dateInput.data( 'position' ) === 'fixed' ) {
				var wrap = $( this ).parent().find( '.datepicker-calendar-wrapper' );
				if ( wrap.length !== 0 ) {
					wrap.css( 'position', 'fixed' );
					wrap.css( 'top', $( this ).offset().top + $( this ).parent().height() - $( document ).scrollTop() );
					wrap.css( 'left', $( this ).offset().left - wrap.width() + $( this ).parent().width() );
					wrap.css( 'right', 'auto' );
				}
			}
		}

		function closeDatePickerOnScroll( evt ) {
			$( '.datepicker-calendar-wrapper' ).each( function() {
				if ( $( this ).css( 'display' ) === 'block' ) {
					var input = $( this ).closest( '.n-calendar' ).find( 'input' );
					if ( input.data( 'position' ) === 'fixed' ) {
						$( this ).parent().find( 'button.dropdown-toggle' ).trigger( 'click' );
					}
				}
			} );
		}

		//Data-API for data-markup=calendar, HTML markup will be generated automatically
		$( function() {
			$( '[data-markup^="calendar"]' ).each( function() {
				if ( $( this ).parent().find( '.datepicker-calendar-wrapper' ).length === 0 ) {
					$( this ).after( '<div class=\"input-group-btn\"><button type=\"button\" class=\"btn btn-default dropdown-toggle\" data-toggle=\"dropdown\">  <span class=\"glyphicon glyphicon-calendar\"></span>  <span class=\"sr-only\">Toggle Calendar</span></button><div class=\"dropdown-menu dropdown-menu-right datepicker-calendar-wrapper\" role=\"menu\">  <div class=\"datepicker-calendar\"><div class=\"datepicker-calendar-header\"><button type=\"button\" class=\"prev\"><span class=\"glyphicon glyphicon-chevron-left\"></span><span class=\"sr-only\">Previous Month</span></button><button type=\"button\" class=\"next\"><span class=\"glyphicon glyphicon-chevron-right\"></span><span class=\"sr-only\">Next Month</span></button><button type=\"button\" class=\"title\"><span class=\"month\">  <span data-month=\"0\">January</span>  <span data-month=\"1\">February</span>  <span data-month=\"2\">March</span>  <span data-month=\"3\">April</span>  <span data-month=\"4\">May</span>  <span data-month=\"5\">June</span>  <span data-month=\"6\">July</span>  <span data-month=\"7\">August</span>  <span data-month=\"8\">September</span>  <span data-month=\"9\">October</span>  <span data-month=\"10\">November</span>  <span data-month=\"11\">December</span></span> <span class=\"year\"></span></button></div><table class=\"datepicker-calendar-days\"><thead><tr><th>SUN</th><th>MON</th><th>TUE</th><th>WED</th><th>THU</th><th>FRI</th><th>SAT</th></tr></thead><tbody></tbody></table></div><div class=\"datepicker-wheels\" aria-hidden=\"true\"><div class=\"datepicker-wheels-month\"><h2 class=\"header\">Month</h2><ul><li data-month=\"0\"><button type=\"button\">Jan</button></li><li data-month=\"1\"><button type=\"button\">Feb</button></li><li data-month=\"2\"><button type=\"button\">Mar</button></li><li data-month=\"3\"><button type=\"button\">Apr</button></li><li data-month=\"4\"><button type=\"button\">May</button></li><li data-month=\"5\"><button type=\"button\">Jun</button></li><li data-month=\"6\"><button type=\"button\">Jul</button></li><li data-month=\"7\"><button type=\"button\">Aug</button></li><li data-month=\"8\"><button type=\"button\">Sep</button></li><li data-month=\"9\"><button type=\"button\">Oct</button></li><li data-month=\"10\"><button type=\"button\">Nov</button></li><li data-month=\"11\"><button type=\"button\">Dec</button></li></ul></div><div class=\"datepicker-wheels-year\"><h2 class=\"header\">Year</h2><ul></ul></div><div class=\"datepicker-wheels-footer clearfix\"><button type=\"button\" class=\"btn datepicker-wheels-back\"><span class=\"icon icon-left\"></span><span class=\"sr-only\">Return to Calendar</span></button><button type=\"button\" class=\"btn datepicker-wheels-select\">Select <span class=\"sr-only\">Month and Year</span></button></div></div></div></div> </div></div>' );
				}
			} );

			$( '[data-markup^="disabled_calendar"]' ).each( function() {
				if ( $( this ).parent().find( '.datepicker-calendar-wrapper' ).length === 0 ) {
					$( this ).after( '<div class=\"input-group-btn\"><button type=\"button\" class=\"btn btn-default dropdown-toggle\" data-toggle=\"dropdown\" disabled>  <span class=\"glyphicon glyphicon-calendar\"></span>  <span class=\"sr-only\">Toggle Calendar</span></button><div class=\"dropdown-menu dropdown-menu-right datepicker-calendar-wrapper\" role=\"menu\">  <div class=\"datepicker-calendar\"><div class=\"datepicker-calendar-header\"><button type=\"button\" class=\"prev\"><span class=\"glyphicon glyphicon-chevron-left\"></span><span class=\"sr-only\">Previous Month</span></button><button type=\"button\" class=\"next\"><span class=\"glyphicon glyphicon-chevron-right\"></span><span class=\"sr-only\">Next Month</span></button><button type=\"button\" class=\"title\"><span class=\"month\">  <span data-month=\"0\">January</span>  <span data-month=\"1\">February</span>  <span data-month=\"2\">March</span>  <span data-month=\"3\">April</span>  <span data-month=\"4\">May</span>  <span data-month=\"5\">June</span>  <span data-month=\"6\">July</span>  <span data-month=\"7\">August</span>  <span data-month=\"8\">September</span>  <span data-month=\"9\">October</span>  <span data-month=\"10\">November</span>  <span data-month=\"11\">December</span></span> <span class=\"year\"></span></button></div><table class=\"datepicker-calendar-days\"><thead><tr><th>SUN</th><th>MON</th><th>TUE</th><th>WED</th><th>THU</th><th>FRI</th><th>SAT</th></tr></thead><tbody></tbody></table></div><div class=\"datepicker-wheels\" aria-hidden=\"true\"><div class=\"datepicker-wheels-month\"><h2 class=\"header\">Month</h2><ul><li data-month=\"0\"><button type=\"button\">Jan</button></li><li data-month=\"1\"><button type=\"button\">Feb</button></li><li data-month=\"2\"><button type=\"button\">Mar</button></li><li data-month=\"3\"><button type=\"button\">Apr</button></li><li data-month=\"4\"><button type=\"button\">May</button></li><li data-month=\"5\"><button type=\"button\">Jun</button></li><li data-month=\"6\"><button type=\"button\">Jul</button></li><li data-month=\"7\"><button type=\"button\">Aug</button></li><li data-month=\"8\"><button type=\"button\">Sep</button></li><li data-month=\"9\"><button type=\"button\">Oct</button></li><li data-month=\"10\"><button type=\"button\">Nov</button></li><li data-month=\"11\"><button type=\"button\">Dec</button></li></ul></div><div class=\"datepicker-wheels-year\"><h2 class=\"header\">Year</h2><ul></ul></div><div class=\"datepicker-wheels-footer clearfix\"><button type=\"button\" class=\"btn datepicker-wheels-back\"><span class=\"icon icon-left\"></span><span class=\"sr-only\">Return to Calendar</span></button><button type=\"button\" class=\"btn datepicker-wheels-select\">Select <span class=\"sr-only\">Month and Year</span></button></div></div></div></div> </div></div>' );
				}
			} );

			//This is just a workaround method to off the focus event for input field
			//fuelux should provide an option to not to listen it.
			setTimeout( function() {
				$( '.datepicker .n-calendar .form-control' ).off( 'focus.fu.datepicker' );
			}, 25 );

		} );


	} )( $ );


	//combobox.js
	( function( $ ) {

		$( document ).on( 'click.bs.dropdown.data-api', '[data-toggle="dropdown"]', function() {
			if ( !$( this ).parents( ".combobox" ).hasClass( "n-page-combox" ) ) {
				$( ".n-page-combox" ).removeClass( "combobox-open" );
			}

			var cbOpen = $( ".combobox-open" );
			if ( cbOpen.length !== 0 ) {
				if ( cbOpen.find( "button" ).get( 0 ) !== $( this ).get( 0 ) ) {
					cbOpen.toggleClass( 'combobox-open' );
				}
			}

			if ( $( this ).parents( ".combobox" ).length !== 0 ) {
				$( this ).parents( ".combobox" ).toggleClass( 'combobox-open' );
			}

			var comboBox = $( this ).parents( ".combobox" );
			if ( $( comboBox ).hasClass( "combobox-filter" ) ) {
				var inputFiled = comboBox.find( "input" );
				inputFiled.focus();
				if ( $( comboBox ).hasClass( "combobox-open" ) ) {
					$( inputFiled ).on( "input", function() {
						doFilter( comboBox );
					} );

					var allItems = comboBox.find( "ul li" );
					var size = allItems.size();
					for ( var i = 0; i < size; i++ ) {
						$( allItems[ i ] ).removeClass( "combobox-item-hidden" );
					}
				} else {
					inputFiled.unbind( "input" );
				}

				comboBox.find( "ul" ).addClass( "combobox-filter-dropdown-menu" );
			}
		} );

		$( document ).on( 'keydown', '.combobox input', function( e ) {
			if ( e.which === 38 || e.which === 40 ) {
				e.preventDefault();
				var a = jQuery.Event( "keydown" );
				a.which = e.which;
				$( this ).parent( ".combobox" ).find( "button.dropdown-toggle" ).trigger( a );
				$( this ).parent( ".combobox" ).find( "button.dropdown-toggle" ).focus();
			}
		} );

		$( document ).on( 'click.bs.dropdown.data-api', function() {
			var cbOpen = $( ".combobox-open" );
			if ( cbOpen.length !== 0 ) {
				if ( cbOpen.hasClass( "combobox-filter" ) ) {

					if ( !cbOpen.find( "input" ).is( ":focus" ) ) {
						cbOpen.find( "input" ).unbind( "input" );
						cbOpen.removeClass( 'combobox-open' );
					} else {
						cbOpen.find( ".input-group-btn" ).addClass( "open" );
						cbOpen.find( "button" ).attr( "aria-expanded", "true" );
					}
				} else {
					cbOpen.removeClass( 'combobox-open' );
				}
			}
		} );

		function doFilter( comboBox ) {
			if ( comboBox.find( "ul" ).length !== 0 ) {
				var allItems = comboBox.find( "ul li" );
				var size = allItems.size();
				if ( comboBox.find( "input" ).val() !== "" ) {
					var inputText = comboBox.find( "input" ).val();
					var reg = "/" + inputText.replace( /\*/g, ".*" ) + "/gi";
					for ( var i = 0; i < size; i++ ) {
						if ( eval( reg ).test( allItems[ i ].textContent ) ) {
							$( allItems[ i ] ).removeClass( "combobox-item-hidden" );
						} else {
							$( allItems[ i ] ).addClass( "combobox-item-hidden" );
						}
					}
				} else {
					for ( var j = 0; j < size; j++ ) {
						$( allItems[ j ] ).removeClass( "combobox-item-hidden" );
					}
				}
			}
		}


	} )( $ );


	//dlg-wizard.js
	( function( $ ) {

		$.fn.extend( {
			initWizard: function() {
				$( this ).bootstrapWizard( {
					nextSelector: '.button-next',
					previousSelector: '.button-previous',
					firstSelector: '.button-first',
					lastSelector: '.button-last'
				} );

				// init steps width
				var $steps = $( this ).find( ".navbar-inner>ul>li" );
				var distance = Math.floor( 100 / ( $steps.length - 1 ) );
				var remainder = Math.ceil( 40 / ( $steps.length - 1 ) );
				$steps.not( ":last-child" ).css( "width", "calc(" + distance + "% - " + remainder + "px)" );
			}
		} );

		$( ".n-dlg-wizard" ).on( "click", ".modal-footer>input[type=button]", function() {
			var activeTab = $( this ).closest( ".modal-footer" ).prev( ".modal-body" ).find( "li.active" );
			addPassStyle( activeTab );
		} );

		$( document ).on( 'click.bs.modal.data-api', '[data-toggle="modal"]', function() {
			var $wizard = $( ".n-dlg-wizard.in" );
			if ( $wizard.length > 0 ) {
				// set next button as focus and reset to the first step
				$wizard.find( "input[type=button][name=next]" ).focus();
				$wizard.find( "input[type=button][name=first]" ).trigger( "click" );
			}
		} );

		function addPassStyle( activeTab ) {
			activeTab.removeClass( "passed" ).siblings( "li" ).removeClass( "passed" );
			var $passedSteps = activeTab.prevAll( "li" );
			if ( $passedSteps.length > 0 ) {
				$passedSteps.addClass( "passed" );
			}
		}

	} )( $ );


	//drag.js
	( function( $ ) {

		var Drag = function( el, opt ) {
			opt = $.extend( {
				handle: "",
				cursor: "move"
			}, opt );
			var dragObject = this;
			el = $( el );
			dragObject.init = function() {
				el.css( 'cursor', opt.cursor );
				var $drag = el.parent().addClass( 'draggable' );
				var zIdx, drgH, drgW, posY, posX;
				el.get( 0 ).addEventListener( 'mousedown', initDrag, false );

				function initDrag( e ) {
					zIdx = $drag.css( 'z-index' );
					drgH = $drag.outerHeight();
					drgW = $drag.outerWidth();
					posY = $drag.offset().top + drgH - e.pageY;
					posX = $drag.offset().left + drgW - e.pageX;
					$drag.css( 'z-index', 1000 );
					document.documentElement.addEventListener( 'mousemove', doDrag, false );
					document.documentElement.addEventListener( 'mouseup', stopDrag, false );
				}

				function doDrag( e ) {
					var top = e.pageY + posY - drgH;
					var left = e.pageX + posX - drgW;


					// check if target is outside fo window
					if ( top < -20 ) {
						top = -20;
					}
					if ( top > window.innerHeight - drgH / 2 ) {
						top = window.innerHeight - drgH / 2;
					}
					if ( left < -drgH * 0.8 ) {
						left = -drgH * 0.8;
					}
					if ( left > window.innerWidth - drgH / 2 ) {
						left = window.innerWidth - drgH / 2;
					}

					$drag.offset( {
						top: top,
						left: left
					} );
					e.preventDefault();
				}

				function stopDrag( e ) {
					$drag.removeClass( 'draggable' ).css( 'z-index', zIdx );
					document.documentElement.removeEventListener( 'mousemove', doDrag, false );
					document.documentElement.removeEventListener( 'mouseup', stopDrag, false );
				}
			};

			dragObject.init();
		};

		var HTMLAttributes = function() {
			var input = $( this ),
				options = {},
				drag = ( input.attr( 'data-drag' ) === 'true' || input.attr( 'data-drag' ) === 'True' );

			if ( drag ) {
				return input.data( 'wf.dragable', new Drag( this, options ) );
			}
		};

		var globalsDrag = {
			dragElements: 'div',
			dataDragAttr: '*[data-drag]'
		};

		var applyDataDrag = function( selector ) {
			selector = selector || globalsDrag.dragElements;
			var $selector = ( selector instanceof $ ) ? selector : $( selector );
			$selector.filter( globalsDrag.dataDragAttr ).each( HTMLAttributes );
		};

		var old = $.fn.dragable;

		$.fn.dragable = function( options ) {
			options = options || {};
			var dragFunction = function() {
				return $( this ).data( 'wf.dragable', new Drag( this, options ) );

			};
			$( this ).each( dragFunction );
			return this;
		};

		$.fn.dragable.noConflict = function() {
			$.fn.dragable = old;
			return this;
		};

		$( document ).ready( function() {
			applyDataDrag( 'div' );
		} );

	} )( $ );


	//drilldown-without-arrow.js
	( function( $ ) {

		var objDrilldownNoArrow;
		$( ".n-drillDown-row" ).each( function() {
			$( this ).bind( 'click', function( e ) {
				$( this ).closest( 'table' ).find( "tr:last-child" ).find( ".n-drillDown-inner" ).css( "border-bottom-left-radius", "7px" );
				$( this ).closest( 'table' ).find( "tr:last-child" ).find( ".n-drillDown-inner" ).css( "border-bottom-right-radius", "7px" );
				$( this ).closest( 'table' ).find( "tr:last-child" ).find( ".n-drillDown-content-row" ).css( "border-bottom-left-radius", "7px" );
				$( this ).closest( 'table' ).find( "tr:last-child" ).find( ".n-drillDown-content-row" ).css( "border-bottom-right-radius", "7px" );
				var ctrlKeyPressed = ( window.event && window.event.ctrlKey ) || e.ctrlKey;
				var shiftKeyPressed = ( window.event && window.event.shiftKey ) || e.shiftKey;
				if ( ctrlKeyPressed || shiftKeyPressed ) {
					return;
				}
				if ( objDrilldownNoArrow === this ) {
					$( $( this ).attr( "row-target-selector" ) ).slideUp( function() {
						$( this ).closest( 'table' ).find( "tr:nth-last-child(2)" ).find( "td:first-child" ).css( "border-bottom-left-radius", "7px" );
						$( this ).closest( 'table' ).find( "tr:nth-last-child(2)" ).find( "td:last-child" ).css( "border-bottom-right-radius", "7px" );

					} );
					objDrilldownNoArrow = '';
				} else {
					//if (obj && $(obj).attr("class").indexOf("n-drillDown-border-row") > 0) {
					//    $(obj).removeClass("n-drillDown-border-row");
					//}
					$( ".n-drillDown-collapsed-row" ).hide();
					$( $( this ).attr( "row-target-selector" ) ).slideDown();
					var lastRowHeight = $( this ).closest( 'table' ).find( "tr:last" ).height();
					if ( lastRowHeight > 0 ) {
						$( this ).closest( 'table' ).find( "tr:nth-last-child(2)" ).find( "td:first-child" ).css( "border-bottom-left-radius", "0px" );
						$( this ).closest( 'table' ).find( "tr:nth-last-child(2)" ).find( "td:last-child" ).css( "border-bottom-right-radius", "0px" );
					} else {
						$( this ).closest( 'table' ).find( "tr:nth-last-child(2)" ).find( "td:first-child" ).css( "border-bottom-left-radius", "7px" );
						$( this ).closest( 'table' ).find( "tr:nth-last-child(2)" ).find( "td:last-child" ).css( "border-bottom-right-radius", "7px" );
					}
					objDrilldownNoArrow = this;
				}
			} );
		} );

		$( ".n-drillDown-collapsed-row .icon-close-rounded" ).click( function() {
			$( ".n-drillDown-collapsed-row" ).slideUp( function() {
				$( this ).closest( 'table' ).find( "tr:nth-last-child(2)" ).find( "td:first-child" ).css( "border-bottom-left-radius", "7px" );
				$( this ).closest( 'table' ).find( "tr:nth-last-child(2)" ).find( "td:last-child" ).css( "border-bottom-right-radius", "7px" );

			} );
			objDrilldownNoArrow = '';
		} );

		$( document ).keyup( function( event ) {
			if ( $( objDrilldownNoArrow ).length === 0 ) {
				return;
			}
			if ( event.keyCode === 27 ) {
				$( ".n-drillDown-collapsed-row" ).slideUp( function() {
					$( this ).closest( 'table' ).find( "tr:nth-last-child(2)" ).find( "td:first-child" ).css( "border-bottom-left-radius", "7px" );
					$( this ).closest( 'table' ).find( "tr:nth-last-child(2)" ).find( "td:last-child" ).css( "border-bottom-right-radius", "7px" );

				} );
				objDrilldownNoArrow = '';
			}
		} );

	} )( $ );


	//drilldown.js
	( function( $ ) {

		var isShowDrilldown = 0;
		var objDrilldown;
		$( ".n-drillDown-item" ).each( function() {

			$( this ).bind( 'click', function( e ) {
				$( this ).closest( 'table' ).find( "tr:last-child" ).find( ".n-drillDown-inner" ).css( "border-bottom-left-radius", "7px" );
				$( this ).closest( 'table' ).find( "tr:last-child" ).find( ".n-drillDown-inner" ).css( "border-bottom-right-radius", "7px" );
				$( this ).closest( 'table' ).find( "tr:last-child" ).find( ".n-drillDown-content" ).css( "border-bottom-left-radius", "7px" );
				$( this ).closest( 'table' ).find( "tr:last-child" ).find( ".n-drillDown-content" ).css( "border-bottom-right-radius", "7px" );
				var ctrlKeyPressed = ( window.event && window.event.ctrlKey ) || e.ctrlKey;
				var shiftKeyPressed = ( window.event && window.event.shiftKey ) || e.shiftKey;
				if ( ctrlKeyPressed || shiftKeyPressed ) {
					return;
				}
				if ( objDrilldown === this ) {
					$( $( this ).attr( "data-target-selector" ) ).slideUp( function() {
						$( this ).closest( 'table' ).find( "tr:nth-last-child(2)" ).find( "td:first-child" ).css( "border-bottom-left-radius", "7px" );
						$( this ).closest( 'table' ).find( "tr:nth-last-child(2)" ).find( "td:last-child" ).css( "border-bottom-right-radius", "7px" );

					} );
					//$(this).removeClass('n-drillDown-border');
					objDrilldown = '';
					isShowDrilldown = 0;
				} else {
					var arrowDistance = $( this ).position().left + $( this ).width() / 2;
					var arrowDistancePxValue = arrowDistance + "px";

					if ( isShowDrilldown && $( this ).offset().top === $( objDrilldown ).offset().top ) { //
						//$(this).addClass('n-drillDown-border').siblings().removeClass('n-drillDown-border');
						$( ".n-drillDown-arrow" ).animate( {
							left: arrowDistancePxValue
						} );
						$( $( this ).attr( "data-target-selector" ) ).show().siblings().stop( true, true ).hide();
						objDrilldown = this;
					} else {
						$( ".n-drillDown-collapsed" ).hide();
						//$(".n-drillDown-item").removeClass("n-drillDown-border");
						//$(this).addClass('n-drillDown-border');
						$( ".n-drillDown-arrow" ).css( "left", arrowDistancePxValue );

						$( $( this ).attr( "data-target-selector" ) ).slideDown();
						var lastRowHeight = $( this ).closest( 'table' ).find( "tr:last" ).height();
						if ( lastRowHeight > 0 ) {
							$( this ).closest( 'table' ).find( "tr:nth-last-child(2)" ).find( "td:first-child" ).css( "border-bottom-left-radius", "0px" );
							$( this ).closest( 'table' ).find( "tr:nth-last-child(2)" ).find( "td:last-child" ).css( "border-bottom-right-radius", "0px" );
						} else {
							$( this ).closest( 'table' ).find( "tr:nth-last-child(2)" ).find( "td:first-child" ).css( "border-bottom-left-radius", "7px" );
							$( this ).closest( 'table' ).find( "tr:nth-last-child(2)" ).find( "td:last-child" ).css( "border-bottom-right-radius", "7px" );
						}
						isShowDrilldown = 1;
						objDrilldown = this;
					}
				}
			} );
		} );

		$( ".icon-close-rounded" ).click( function() {
			$( ".n-drillDown-collapsed" ).slideUp( function() {
				$( this ).closest( 'table' ).find( "tr:nth-last-child(2)" ).find( "td:first-child" ).css( "border-bottom-left-radius", "7px" );
				$( this ).closest( 'table' ).find( "tr:nth-last-child(2)" ).find( "td:last-child" ).css( "border-bottom-right-radius", "7px" );

			} );
			//$(".n-drillDown-item").removeClass('n-drillDown-border');
			objDrilldown = '';
			isShowDrilldown = 0;
		} );

		$( window ).resize( function() {
			if ( $( objDrilldown ).length === 0 ) {
				return;
			}
			var arrowDistance = $( objDrilldown ).position().left + $( objDrilldown ).width() / 2;
			var arrowDistancePxValue = arrowDistance + "px";
			$( ".n-drillDown-arrow" ).css( "left", arrowDistancePxValue );
		} );

		$( document ).keyup( function( event ) {
			if ( $( objDrilldown ).length === 0 ) {
				return;
			}
			if ( event.keyCode === 27 ) {
				$( ".n-drillDown-collapsed" ).slideUp( function() {
					$( this ).closest( 'table' ).find( "tr:nth-last-child(2)" ).find( "td:first-child" ).css( "border-bottom-left-radius", "7px" );
					$( this ).closest( 'table' ).find( "tr:nth-last-child(2)" ).find( "td:last-child" ).css( "border-bottom-right-radius", "7px" );
				} );
				objDrilldown = '';
				isShowDrilldown = 0;
			}
		} );

	} )( $ );


	//dropdowns.js
	( function( $ ) {

		$.fn.extend( {
			adaptiveSelectlist: function() {
				var $select = $( this );
				$select.selectlist();
				var $dropDownMecu = $select.find( '> .dropdown-menu' );
				var DROP_DOWN_MIN_WIDTH_IN_PX = $dropDownMecu.css( 'min-width' ).replace( /[^-\d\.]/g, '' );
				$select.on( 'changed.fu.selectlist', function() {
					var adaptedWidth = $select.width();
					if ( adaptedWidth > DROP_DOWN_MIN_WIDTH_IN_PX ) {
						$dropDownMecu.css( 'width', adaptedWidth );
					} else {
						$dropDownMecu.css( 'width', 'auto' );
					}
				} );
			}
		} );

		$( document ).ready( function() {
			$( ".n-dropdown-menu-scroll" ).on( "click", ".mCSB_dragger_bar", function( e ) {
				e.stopPropagation();
			} );
			var nPulldownMultiple = '<p class="prompt">Please select items</p>';
			$( '.selectlist-multiple' ).find( '.selected-label' ).empty().append( nPulldownMultiple );
			$( '.selectlist-multiple ul' ).on( 'click', function( e ) {
				e.stopPropagation();
			} );
			$( '.selectlist-multiple input[type="checkbox"]' ).on( 'click', function() {
				var title = $( this ).next().children().text() + ', ';
				if ( $( this ).is( ':checked' ) ) {
					var html = '<span title="' + title + '">' + title + '</span>';
					$( this ).closest( '.selectlist-multiple' ).find( '.prompt' ).hide();
					$( this ).closest( '.selectlist-multiple' ).find( '.selected-label' ).append( html );
				} else {
					$( this ).closest( '.selectlist-multiple' ).find( 'span[title="' + title + '"]' ).remove();
					if ( $( this ).closest( '.selectlist-multiple' ).find( '.selected-label' ).children().length === 1 ) {
						$( this ).closest( '.selectlist-multiple' ).find( '.prompt' ).show();
					}
				}
			} );
		} );

		$( document )
			.on( 'click.wf.dropdown', '.n-table .selectlist .dropdown-toggle', relocateDropdown )
			.on( 'scroll.wf.dropdown', closeDropdownOnScroll );

		$( window ).on( 'resize.wf.dropdown', closeDropdownOnScroll );

		function relocateDropdown() {
			/*jshint validthis:true */
			var ul = $( this ).parent().find( 'ul' );
			if ( $( this ).closest( '.selectlist' ).data( 'position' ) === 'fixed' ) {
				ul.css( 'position', 'fixed' );
				ul.css( 'top', $( this ).offset().top + $( this ).parent().height() - $( document ).scrollTop() );
				ul.css( 'left', 'auto' );
				ul.width( $( this ).parent().width() );
			}
		}

		function closeDropdownOnScroll() {
			$( '.dropdown-menu' ).each( function() {
				if ( $( this ).css( 'display' ) === 'block' ) {
					if ( $( this ).closest( '.selectlist' ).data( 'position' ) === 'fixed' ) {
						$( this ).parent().find( 'button.dropdown-toggle' ).trigger( 'click' );
					}
				}
			} );
		}

	} )( $ );


	//flyoutmenu.js
	( function( $ ) {

		$.fn.extend( {
			initFlyout: function() {
				var $flyout = $( this );
				// set flyout container left position
				var $menuContainer = $flyout.find( ".n-flyout-container" );
				var menuWidth = $menuContainer.outerWidth();
				var menuHeight = $menuContainer.outerHeight();
				$flyout.css( "left", ( -menuWidth ) + "px" );
				// set flyout open top position
				var $openAnchor = $flyout.find( ".n-flyout-open" );
				var openHeight = $openAnchor.outerHeight();
				var menuLenght = $flyout.find( ".n-flyout-container > ul" ).children( "li" ).length;
				$openAnchor.css( "left", ( menuWidth + 1 ) + "px" );
				$openAnchor.css( "top", Math.ceil( ( menuHeight - openHeight ) / 2 ) + "px" );
				// hide container
				$menuContainer.hide();
			}
		} );

		$( ".n-flyout" ).on( "click", ".n-flyout-open", function() {
			var $flyoutContainer = $( this ).prev( ".n-flyout-container" );
			if ( $flyoutContainer.is( ":visible" ) ) {
				hideFlyout( $flyoutContainer );
			} else {
				showFlyout( $flyoutContainer );
			}
		} );

		$( document ).keydown( function( e ) {
			// click esc to hide flyout menu if it is open
			var $flyoutContainer = $( ".n-flyout>.n-flyout-container" );
			if ( e.keyCode === 27 && $flyoutContainer.is( ":visible" ) && ( $( ".n-flyout" ).find( ":focus" ).length > 0 ) ) {
				hideFlyout( $flyoutContainer );
			}
			if ( e.keyCode === 32 && $flyoutContainer.is( ":visible" ) && $( ".n-flyout-open" ).is( ":focus" ) ) {
				hideFlyout( $flyoutContainer );
				return false;
			}

			if ( e.keyCode === 32 && !$flyoutContainer.is( ":visible" ) && $( ".n-flyout-open" ).is( ":focus" ) ) {
				showFlyout( $flyoutContainer );
				return false;
			}

		} );

		function hideFlyout( $flyoutContainer ) {
			var menuWidth = $flyoutContainer.outerWidth();
			$flyoutContainer.parent( ".n-flyout" ).animate( {
				left: -menuWidth
			}, 400, function() {
				$flyoutContainer.hide();
			} );
		}

		function showFlyout( $flyoutContainer ) {
			$flyoutContainer.show();
			$flyoutContainer.parent( ".n-flyout" ).animate( {
				left: 0
			}, 400 );
			$flyoutContainer.find( "a:first" ).focus();
		}

	} )( $ );


	//grid.js
	( function( $ ) {

		$.grid = {
			/*---------------- nokia TextField render/editor ----------------*/
			nTextFieldCellRenderer: function( row, column, value ) {
				return '<input class="n-inputfield n-inputfield-small" value="' + value + '" />';
			},

			nCreateTextFieldEditor: function( row, cellValue, editor, cellText, width, height ) {
				// construct the editor.
				var element = $( '<input class="n-inputfield n-inputfield-small" />' );
				editor.append( element );
			},

			nInitTextFieldEditor: function( row, cellValue, editor, cellText, width, height ) {
				// set the editor's current value. The callback is called each time the editor is displayed.
				var inputHTMLElement = editor.find( "input" );
				inputHTMLElement.val( cellValue );
				inputHTMLElement.focus();
			},

			nGetTextFieldEditorValue: function( row, cellValue, editor ) {
				return editor.find( "input" ).val();
			},

			/*---------------- nokia Indicator textField render/editor ----------------*/
			nIndicatorTextFieldCellRenderer: function( gridId ) {
				return function( row, columnfield, value, defaulthtml, columnproperties ) {
					var edited = '';
					$( gridId + " .n-grid-inputfield-indicated" ).each( function() {
						var idMatched = false;
						var id = $( this ).parent().attr( 'id' );
						if ( id !== undefined ) {
							if ( id.indexOf( columnfield + "_" + row ) >= 0 ) {
								idMatched = true;
							}
						}

						if ( $( this ).find( "input" ).val() === value && idMatched ) {
							if ( $( this ).find( ".icon" ).hasClass( "icon-edited-small" ) ) {
								edited = 'icon-edited-small';
							}
						}
					} );

					var element = '<div class="n-grid-inputfield-indicated">' +
						'<input class="n-inputfield n-inputfield-small" value="' + value + '">' +
						'<a class="form-control-feedback"><span class="icon ' + edited + '"></span></a>' +
						'</div>';
					return element;
				};
			},

			nCreateIndicatorTextFieldEditor: function( row, cellValue, editor, cellText, width, height ) {
				// construct the editor.
				var gridId = editor.parent().attr( "id" ).replace( "contenttable", "" );
				var isIndicatedByCell = checkIndicatedByCell( editor );
				var element = '<div class="n-grid-inputfield-indicated">' +
					'<input class="n-inputfield n-inputfield-small"/>' +
					'<a class="form-control-feedback"><span class="icon"></span></a>' +
					'</div>';
				editor.append( element );
				var editorId = editor.attr( "id" );
				var inputHTMLElement = editor.find( "input" );
				inputHTMLElement.bind( 'input', function() {
					if ( inputHTMLElement.val() !== cellValue ) {
						if ( isIndicatedByCell ) {
							editor.find( ".icon" ).addClass( "icon-edited-small" );
						}
						$( "#" + gridId + " #n-row-indicated-" + row + " > span" ).addClass( "icon-edited-white" );
						addChangedCol( row, editorId, gridId );
					} else {
						editor.find( ".icon" ).removeClass( "icon-edited-small" );
						removeChangedCol( row, editorId, gridId );
					}
				} );
			},

			nInitIndicatorTextFieldEditor: function( row, cellValue, editor, cellText, width, height ) {
				// set the editor's current value. The callback is called each time the editor is displayed.
				var inputHTMLElement = editor.find( "input" );
				inputHTMLElement.val( cellValue );
				inputHTMLElement.focus();
			},

			nGetIndicatorTextFieldEditorValue: function( row, cellValue, editor ) {
				return editor.find( "input" ).val();
			},

			/*---------------- nokia String Field render/editor ----------------*/
			nStringCellRenderer: function( row, columnfield, value, defaulthtml ) {
				var html = defaulthtml;
				if ( value.indexOf( '#errordata#' ) !== -1 ) {
					html = html.replace( 'class="', 'class="n-cell-error ' );
					html = html.replace( '#errordata#', '' );
				}
				return html;
			},

			/*---------------- nokia Number Field render/editor ----------------*/
			nNumberCellRenderer: function( row, columnfield, value, defaulthtml ) {
				var cellValue = value.toString();
				var html = defaulthtml;
				if ( cellValue.indexOf( '((' ) === 0 && cellValue.indexOf( '))' ) === cellValue.length - 2 ) {
					html = html.replace( 'class="', 'class="n-cell-error ' );
					html = html.replace( '((', '' );
					html = html.replace( '))', '' );
				}
				return html;
			},

			/*---------------- nokia Checkbox render/editor ----------------*/
			nCheckboxCellsrenderer: function( checkLabel ) {
				var _checkLabel = checkLabel;
				return function( row, column, value, editor ) {
					return '<div class="checkbox checkbox-small">' +
						'<input id="cb' + row + Date.now() + '" type="checkbox" ' + ( value ? ' checked="true"' : '' ) + '/>' +
						'<label for="cb' + row + Date.now() + '">' + _checkLabel + '</label>' +
						'</div>';
				};
			},
			nCreateCheckboxEditor: function( checkLabel ) {
				var _checkLabel = checkLabel;
				return function( row, value, editor, cellText, width, height ) {
					// construct the editor.
					var target = ( value ) ? ' checked="true"' : '';
					var element = '<div class="checkbox checkbox-small margin-add-one">' +
						'<input id="cb' + row + Date.now() + '" type="checkbox" ' + ( target ) + '/>' +
						'<label for="cb' + row + Date.now() + '">' + _checkLabel + '</label>' + '</div>';
					editor.append( element );
				};
			},

			nInitCheckboxEditor: function( row, cellValue, editor, cellText, width, height ) {
				// set the editor's current value. The callback is called each time the editor is displayed.
				var inputHTMLElement = editor.find( "input" );
				var current = inputHTMLElement.prop( "checked" );
				inputHTMLElement.prop( {
					checked: !current
				} );
				inputHTMLElement.prop( "checked" );
				inputHTMLElement.focus();
			},
			nGetCheckboxEditorValue: function( row, cellValue, editor ) {
				var inputHTMLElement = editor.find( "input" );
				return inputHTMLElement.prop( "checked" );
			},
			/*---------------- nokia Indicator Checkbox render/editor ----------------*/
			nIndicatorCheckboxCellsrenderer: function( gridId, checkLabel ) {
				var _checkLabel = checkLabel;
				return function( row, column, value, editor ) {
					var edited = '';
					var orignalValue = '';
					$( gridId + " .grid-checkbox-indicated" ).each( function() {
						var idMatched = false;
						var id = $( this ).parent().attr( 'id' );
						if ( id !== undefined ) {
							if ( id.indexOf( column + "_" + row ) >= 0 ) {
								idMatched = true;
							}
						}

						if ( idMatched ) {
							if ( $( this ).find( ".icon" ).hasClass( "icon-edited-small" ) ) {
								edited = 'icon-edited-small';
							}
							if ( $( this ).find( ".icon" ).hasClass( "icon-edited-small-white" ) ) {
								edited = 'icon-edited-small-white';
							}
							orignalValue = $( this ).find( "input" ).attr( "orignal-value" );
						}
					} );

					return '<div id="indicator-checkbox-' + row + '" class="checkbox checkbox-small grid-checkbox-indicated">' +
						'<input id="cb' + row + Date.now() + '" type="checkbox" ' + ( value ? ' checked="true"' : '' ) + ' orignal-value="' + orignalValue + '"/>' +
						'<label for="cb' + row + Date.now() + '">' + _checkLabel + '</label>' +
						'<span class="icon align-right ' + edited + '"></span>' +
						'</div>';
				};
			},
			nCreateIndicatorCheckboxEditor: function( checkLabel ) {
				var _checkLabel = checkLabel;
				return function( row, value, editor, cellText, width, height ) {
					// construct the editor.
					var target = ( value ) ? ' checked="true"' : '';
					var element = '<div id="indicator-checkbox-' + row + '" class="checkbox checkbox-small margin-add-one grid-checkbox-indicated">' +
						'<input id="cb' + row + Date.now() + '" type="checkbox" ' + ( target ) + ' orignal-value="' + value + '"/>' +
						'<label for="cb' + row + Date.now() + '">' + _checkLabel + '</label>' +
						'<span class="icon align-right editor"></span>' + '</div>';
					editor.append( element );
				};
			},

			nInitIndicatorCheckboxEditor: function( row, cellValue, editor, cellText, width, height ) {
				// set the editor's current value. The callback is called each time the editor is displayed.
				var gridId = editor.parent().attr( "id" ).replace( "contenttable", "" );
				var isIndicatedByCell = checkIndicatedByCell( editor );
				var inputHTMLElement = editor.find( "input" );
				var current = inputHTMLElement.prop( "checked" );
				inputHTMLElement.prop( {
					checked: !current
				} );
				inputHTMLElement.prop( "checked" );
				inputHTMLElement.focus();
				var editorId = editor.attr( "id" );
				if ( current.toString() === inputHTMLElement.attr( "orignal-value" ) ) {
					if ( isIndicatedByCell ) {
						editor.find( ".icon" ).addClass( "icon-edited-small-white" );
					}
					$( "#" + gridId + " #n-row-indicated-" + row + " > span" ).addClass( "icon-edited-white" );
					addChangedCol( row, editorId, gridId );
				} else {
					editor.find( ".icon" ).removeClass( "icon-edited-small-white" );
					removeChangedCol( row, editorId, gridId );
				}
				inputHTMLElement.change( function() {
					if ( inputHTMLElement.prop( "checked" ).toString() === inputHTMLElement.attr( "orignal-value" ) ) {
						editor.find( ".icon" ).removeClass( "icon-edited-small-white" );
						removeChangedCol( row, editorId, gridId );
					} else {
						if ( isIndicatedByCell ) {
							editor.find( ".icon" ).addClass( "icon-edited-small-white" );
						}
						$( "#" + gridId + " #n-row-indicated-" + row + " > span" ).addClass( "icon-edited-white" );
						addChangedCol( row, editorId, gridId );
					}
				} );
			},
			nGetIndicatorCheckboxEditorValue: function( row, cellValue, editor ) {
				var inputHTMLElement = editor.find( "input" );
				return inputHTMLElement.prop( "checked" );
			},
			/*---------------- nokia dropdownlist render/editor ----------------*/
			dropdownlistCellsrenderer: function( row, columnfield, value ) {
				return '<div class="btn-group selectlist selectlist-small selectlist-resize" data-resize="none" data-initialize="selectlist" id="mySelectlist7">' +
					'<button class="btn btn-default dropdown-toggle" data-toggle="dropdown" type="button">' +
					'<span class="selected-label">' + value + '</span>' +
					'<span class="selected-caret" ><span class="caret"></span></span>' +
					'</button>' +
					'<ul class="dropdown-menu" role="menu">' +
					'<li data-value="1">' + '<a href="#">' + '<span>' + value + '</span>' + '</a>' + '</li>' +
					'</ul>' + '</div>';
			},

			dropdownlistEditor: function( dropdownlists ) {
				var _dropdownlists = dropdownlists;
				return function( row, cellValue, editor, cellText, width, height ) {
					editor.jqxDropDownList( {
						autoDropDownHeight: false,
						itemHeight: 27,
						dropDownHeight: '150px',
						scrollBarSize: 8,
						width: width - 4,
						height: 24,
						source: _dropdownlists.map( function( name ) {
							return "<span>" + name + "</span>";
						} )
					} );
				};
			},

			dropdownlistInitEditor: function( row, cellValue, editor, cellText, width, height ) {
				editor.jqxDropDownList( 'selectItem', '<span>' + cellValue + '</span>' );
				editor.jqxDropDownList( 'focus' );
				editor.jqxDropDownList( 'open' );
			},

			dropdownlistEditorValue: function( row, cellValue, editor ) {
				return editor.val();
			},
			/*---------------- nokia dropdownlist render/editor ----------------*/
			indicatorDropdownlistCellsrenderer: function( gridId ) {
				return function( row, columnfield, value ) {
					var edited = '';
					$( gridId + " .grid-selectlist-indicated" ).each( function() {
						var idMatched = false;
						var id = $( this ).parent().attr( 'id' );
						if ( id !== undefined ) {
							if ( id.indexOf( columnfield + "_" + row ) >= 0 ) {
								idMatched = true;
							}
						}
						if ( idMatched ) {
							if ( $( this ).find( ".icon" ).hasClass( "icon-edited-small" ) ) {
								edited = 'icon-edited-small';
							}
						}
					} );

					return '<div class="btn-group selectlist selectlist-small selectlist-resize selectlist-indicated" data-resize="none" data-initialize="selectlist" id="mySelectlist' + row + '">' +
						'<button class="btn btn-default dropdown-toggle" data-toggle="dropdown" type="button">' +
						'<span class="selected-label">' + value + '</span>' +
						'<span class="selected-caret" ><span class="caret"></span></span>' +
						'</button>' +
						'<ul class="dropdown-menu" role="menu">' +
						'<li data-value="1">' + '<a href="#">' + '<span>' + value + '</span>' + '</a>' + '</li>' +
						'</ul>' +
						'<a class="form-control-feedback">' +
						'<span class="icon ' + edited + '"></span>' +
						'</a>' +
						'</div>';
				};
			},

			indicatorDropdownlistEditor: function( dropdownlists ) {
				var _dropdownlists = dropdownlists;
				return function( row, cellValue, editor, cellText, width, height ) {
					var gridId = editor.parent().attr( "id" ).replace( "contenttable", "" );
					var isIndicatedByCell = checkIndicatedByCell( editor );
					var editorId = editor.attr( "id" );
					editor.jqxDropDownList( {
						autoDropDownHeight: false,
						itemHeight: 27,
						dropDownHeight: '150px',
						scrollBarSize: 8,
						width: width - 4,
						height: 24,
						source: _dropdownlists.map( function( name ) {
							return "<span>" + name + "</span>";
						} ),
						selectionRenderer: function() {
							var item = editor.jqxDropDownList( 'getSelectedItem' );
							if ( item !== null ) {
								if ( item.value.indexOf( cellText ) >= 0 ) {
									removeChangedCol( row, editorId, gridId );
									return item.value;
								} else {
									addChangedCol( row, editorId, gridId );
									$( "#" + gridId + " #n-row-indicated-" + row + " > span" ).addClass( "icon-edited-white" );
									if ( isIndicatedByCell ) {
										return item.value + '<div class="grid-selectlist-indicated"><a class="form-control-feedback"><span class="icon icon-edited-small"></span></a></div>';
									} else {
										return item.value;
									}
								}
							}
						}
					} );
				};
			},

			indicatorDropdownlistInitEditor: function( row, cellValue, editor, cellText, width, height ) {
				editor.jqxDropDownList( 'selectItem', '<span>' + cellValue + '</span>' );
				editor.jqxDropDownList( 'focus' );
				editor.jqxDropDownList( 'open' );
			},

			indicatorDropdownlistEditorValue: function( row, cellValue, editor ) {
				return editor.val();
			},

			/*---------------- nokia indicator ----------------*/
			indicatorRenderer: function( gridId ) {
				return function( row, datafield, value, defaulthtml, columnproperties ) {
					var edited = '';
					var changedCol = '';
					if ( $( gridId + " #n-row-indicated-" + row + " > span" ).hasClass( "icon-edited" ) ) {
						edited = "icon-edited";
					}
					if ( $( gridId + " #n-row-indicated-" + row + " > span" ).hasClass( "icon-edited-white" ) ) {
						edited = "icon-edited-white";
					}
					changedCol = $( gridId + " #n-row-indicated-" + row ).attr( "changed-col" );
					if ( changedCol === undefined ) {
						changedCol = '';
					}
					return '<div id="n-row-indicated-' + row + '" class="n-row-indicated text-center" changed-col="' + changedCol + '"><span class="icon ' + edited + '"></span></div>';
				};

			},

			indicatorRowSelectRenderer: function( gridId ) {
				var $grid = $( gridId );
				$grid.bind( 'rowselect', function( event ) {
					var row = event.args.rowindex;
					$( gridId + " .n-row-indicated" ).each( function() {
						var icon = $( this ).find( "span" );
						if ( icon.hasClass( "icon-edited-white" ) ) {
							icon.removeClass( "icon-edited-white" );
							icon.addClass( "icon-edited" );
						}
					} );
					if ( $( gridId + " #n-row-indicated-" + row + " > span" ).hasClass( "icon-edited" ) ) {
						$( gridId + " #n-row-indicated-" + row + " > span" ).removeClass( "icon-edited" );
						$( gridId + " #n-row-indicated-" + row + " > span" ).addClass( "icon-edited-white" );
					}

					$( gridId + " .grid-checkbox-indicated" ).each( function() {
						var cbId = $( this ).attr( "id" );
						var icon = $( this ).find( "span" );
						if ( cbId.indexOf( row, cbId.length - row.length ) === -1 ) {
							if ( icon.hasClass( "icon-edited-small-white" ) ) {
								icon.removeClass( "icon-edited-small-white" );
								icon.addClass( "icon-edited-small" );
							}
						} else {
							if ( icon.hasClass( "icon-edited-small" ) ) {
								icon.removeClass( "icon-edited-small" );
								icon.addClass( "icon-edited-small-white" );
							}
						}
					} );
				} );
			},

			/*---------------- nokia dropdownlist filter ----------------*/
			dropdownFilterRender: function( column, columnElement, widget ) {
				widget.jqxDropDownList( {
					scrollBarSize: 8,
					placeHolder: "Filter...",
					renderer: function( index, label, value ) {
						return "<span>" + label + "</span>";
					}
				} );
			},

			dropdownFilterString: {
				filterchoosestring: "Filter..."
			},

			/*---------------- nokia paging render ----------------*/
			pagerrenderer: function( gridId, showPageAndFilter ) {
				var $grid = $( gridId );
				var element = $( "<div class=\"page-container\"></div>" );
				var datainfo = $grid.jqxGrid( 'getdatainformation' );
				var paginginfo = datainfo.paginginformation;
				var pagescount = paginginfo.pagescount;

				if ( showPageAndFilter ) {
					appendFilterPageLeft();
					addFilterEvent();
					appendMiddle();
					appendRight();
				} else {
					var filterable = $grid.jqxGrid( 'filterable' );
					if ( filterable ) {
						appendFilterPageLeft();
						addFilterEvent();
					} else {
						appendLeft();
						appendMiddle();
						appendRight();
					}
				}

				function addFilterEvent() {
					$grid.on( "filter", function( event ) {
						var filterRows = $grid.jqxGrid( 'getrows' );
						var dataRows = $grid.jqxGrid( 'getboundrows' );
						var filterPageLeft = $grid.find( ".n-table-paging-left" );

						if ( dataRows.length === filterRows.length ) {
							filterPageLeft.removeClass( "has-filter" );
							filterPageLeft.addClass( "no-filter" );
						} else {
							filterPageLeft.removeClass( "no-filter" );
							filterPageLeft.addClass( "has-filter" );
							$( filterPageLeft ).find( ".n-table-filter-result span" ).html( filterRows.length );
						}
					} );
				}

				function appendFilterPageLeft() {
					var totalItem = $( "<span class=\"n-table-paging-left no-filter\"><span class=\"icon icon-filter\"></span><span class=\"n-table-filter-result\">Results: <span></span></span><span>Total: " + datainfo.rowscount + "</span></span>" );
					totalItem.appendTo( element );
				}

				function appendLeft() {
					var totalItem = $( "<span class=\"n-table-paging-left\"><span>Total:" + datainfo.rowscount + "</span></span>" );
					totalItem.appendTo( element );
				}

				function appendMiddle() {
					var centerField = $( "<div class=\"n-table-paging-middle\"></div>" );

					var firstButton = $( "<button class=\"btn btn-icon page-first\"><span class=\"icon icon-first\"></span></button>" );
					var prevButton = $( "<button class=\"btn btn-icon page-prev\"><span class=\"icon icon-back\"></span></button>" );

					var pageField = $( "<div class='pageField'></div>" );
					var pageInput = $( "<input type=\"text\" class=\"n-inputfield n-inputfield-small\" />" );
					$( "<span>Page</span>" ).appendTo( pageField );
					pageInput.appendTo( pageField );
					$( "<span>\/ " + pagescount + "</span>" ).appendTo( pageField );


					var nextButton = $( "<button class=\"btn btn-icon page-next\"><span class=\"icon icon-next\"></span></button>" );
					var lastButton = $( "<button class=\"btn btn-icon page-last\"><span class=\"icon icon-last\"></span></button>" );

					firstButton.appendTo( centerField );
					prevButton.appendTo( centerField );
					pageField.appendTo( centerField );
					nextButton.appendTo( centerField );
					lastButton.appendTo( centerField );
					centerField.appendTo( element );

					pageInput.val( parseInt( paginginfo.pagenum ) + 1 );

					firstButton.on( 'click', function() {
						$grid.jqxGrid( 'gotopage', 0 );
						setTimeout( function() {
							firstButton.focus();
						}, 50 );
					} );

					prevButton.off( 'click' ).on( 'click', function() {
						$grid.jqxGrid( 'gotoprevpage' );
						setTimeout( function() {
							prevButton.focus();
						}, 50 );
					} );

					nextButton.off( 'click' ).on( 'click', function() {
						$grid.jqxGrid( 'gotonextpage' );
						setTimeout( function() {
							nextButton.focus();
						}, 50 );
					} );

					lastButton.off( 'click' ).on( 'click', function() {
						$grid.jqxGrid( 'gotopage', pagescount );
						setTimeout( function() {
							lastButton.focus();
						}, 50 );
					} );

					pageInput.off( 'change' ).on( 'change', function() {
						goToPage( $( this ).val() );
					} );

					pageInput.off( 'keydown' ).on( 'keydown', function( event ) {
						if ( event.keyCode === 13 ) {
							goToPage( pageInput.val() );
						}
					} );

					$grid.off( 'pagechanged' ).on( 'pagechanged', function() {
						var datainfo = $grid.jqxGrid( 'getdatainformation' );
						var paginginfo = datainfo.paginginformation;
						pageInput.val( parseInt( paginginfo.pagenum ) + 1 );
					} );

					function goToPage( inputVal ) {
						var pageIndex = parseInt( inputVal ) - 1;
						$grid.jqxGrid( 'gotopage', pageIndex );
					}
				}

				function appendRight() {
					var perPageField = $( "<div class='n-table-paging-right'></div>" );
					var perPageCombo = $( "<div id=\"" + gridId + "jqxPerPageCombo" + "\"></div>" );
					var index = $grid.jqxGrid( 'pagesize' );
					var selectedIndex = [ 10, 20, 30 ].indexOf( index );
					perPageCombo.jqxComboBox( {
						source: [ 10, 20, 30 ],
						width: 60,
						height: 24,
						selectedIndex: selectedIndex,
						renderer: function( index, label, value ) {
							return "<span>" + label + "</span>";
						}
					} );

					perPageCombo.appendTo( perPageField );
					$( "<span>Items per page</span>" ).appendTo( perPageField );

					perPageField.appendTo( element );

					perPageCombo.on( 'open', function( event ) {
						$( "div[id^='dropdownlistContent'] > input" ).attr( "readonly", "readonly" );
					} );
					perPageCombo.off( 'change' ).on( 'change', function( event ) {
						var args = event.args;
						if ( args ) {
							$grid.jqxGrid( 'pagesize', args.item.originalItem );
						}
					} );
				}

				return element;
			},

			enableErrorHeaderRow: function( gridId ) {
				setTimeout( function() {
					var $gridId = '#' + gridId;
					var errorNum = 0;
					var rows = $( $gridId ).jqxGrid( 'getrows' );
					var cols = $( $gridId ).jqxGrid( 'columns' ).records;
					for ( var i = 0; i < rows.length; i++ ) {
						for ( var j = 0; j < cols.length; j++ ) {
							var datafield = cols[ j ].datafield;
							var cellValue = rows[ i ][ datafield ].toString();
							if ( ( cellValue.indexOf( '#errordata#' ) !== -1 && cols[ j ].columntype === 'textbox' ) || ( cols[ j ].columntype === 'NumberInput' && ( cellValue.indexOf( '((' ) === 0 && cellValue.indexOf( '))' ) === cellValue.length - 2 ) ) ) {
								errorNum += 1;
							}
						}
					}
					var gridHeader = $( $gridId ).find( '.jqx-grid-header' );
					gridHeader.children().after( '<div class="grid-error-header">' +
						'<span><span class="icon icon-error"></span>There are ' + errorNum + ' errors in this table.</span>' +
						'</div>' );
					gridHeader.css( 'height', '50px' );
					gridHeader.children().css( 'height', '50%' );
					gridHeader.after( '<div class="grid-error-header-icon"><span class="icon icon-close-rounded"></span></div>' );
					$( '.icon-close-rounded' ).on( 'click', function() {
						var gridHeader = $( $gridId ).find( '.jqx-grid-header' );
						gridHeader.css( 'height', '25px' );
						gridHeader.children().css( 'height', '100%' );
						$( $gridId ).find( '.grid-error-header' ).css( 'display', 'none' );
						$( $gridId ).jqxGrid( 'render' );
					} );
				}, 50 );
			},

			enableHeadErrorIndicator: function( gridId ) {
				setTimeout( function() {
					var $gridId = '#' + gridId;
					var rows = $( $gridId ).jqxGrid( 'getrows' );
					var cols = $( $gridId ).jqxGrid( 'columns' ).records;

					var errorsCount = [];
					for ( var x = 0; x < cols.length; x++ ) {
						errorsCount[ x ] = 0;
					}

					for ( var i = 0; i < rows.length; i++ ) {
						for ( var j = 0; j < cols.length; j++ ) {
							var datafield = cols[ j ].datafield;
							var cellValue = rows[ i ][ datafield ].toString();
							if ( ( cellValue.indexOf( '#errordata#' ) !== -1 && cols[ j ].columntype === 'textbox' ) || ( cols[ j ].columntype === 'NumberInput' && ( cellValue.indexOf( '((' ) === 0 && cellValue.indexOf( '))' ) === cellValue.length - 2 ) ) ) {
								errorsCount[ j ] = errorsCount[ j ] + 1;
							}
						}
					}

					var headCount = $( $gridId ).find( '.jqx-grid-column-header' ).length;
					for ( var n = 0; n < headCount; n++ ) {
						var errors = errorsCount[ n ];
						if ( errors > 0 ) {
							$( $gridId ).find( '.jqx-grid-column-header' ).eq( n ).find( 'span' )
								.after( '<span class="icon text-center n-error-indicator">' + errors + '</span>' );
						}
					}
				}, 50 );
			}
		};

		$( document ).ready( function() {
			var headerColumns = $( ".jqx-grid-column-header" );
			for ( var i = 0; i < headerColumns.length; i++ ) {
				headerColumns[ i ].onclick = handleColumnHeadSort;
			}

		} );

		function handleColumnHeadSort() {
			/*jshint validthis:true */
			var columnSortType = $( this ).attr( "aria-sort" );
			if ( columnSortType === "" || columnSortType === undefined ) {
				return;
			}

			var columnHeadTextDiv = $( this ).children( "div" ).children( "div" )[ 0 ];
			var columnAlignType = $( columnHeadTextDiv ).css( "text-align" );

			//add right padding if it is right alignment and is sorting.
			if ( columnAlignType === "right" && ( columnSortType === "ascending" || columnSortType === "descending" ) ) {
				$( columnHeadTextDiv ).css( "padding-right", "18px" );
			} else {
				$( columnHeadTextDiv ).css( "padding-right", "8px" );
			}
		}

		function addChangedCol( row, editorId, gridId ) {
			var changedCol = $( "#" + gridId + " #n-row-indicated-" + row ).attr( "changed-col" );
			if ( changedCol === undefined ) {
				changedCol = '';
			}
			if ( changedCol.indexOf( editorId ) === -1 ) {
				changedCol = changedCol + editorId;
				$( "#" + gridId + " #n-row-indicated-" + row ).attr( "changed-col", changedCol );
			}
		}

		function removeChangedCol( row, editorId, gridId ) {
			var changedCol = $( "#" + gridId + " #n-row-indicated-" + row ).attr( "changed-col" );
			if ( changedCol === undefined ) {
				changedCol = '';
			}
			changedCol = changedCol.replace( editorId, '' );
			$( "#" + gridId + " #n-row-indicated-" + row ).attr( "changed-col", changedCol );
			var currentChangedCol = $( "#" + gridId + " #n-row-indicated-" + row ).attr( "changed-col" );
			if ( currentChangedCol !== undefined ) {
				if ( currentChangedCol.replace( 'editorId', '' ) === '' ) {
					$( "#" + gridId + " #n-row-indicated-" + row + " > span" ).removeClass( "icon-edited-white" );
				}
			}
		}

		function checkIndicatedByCell( editor ) {
			var gridId = editor.parent().attr( "id" ).replace( "contenttable", "" );
			var tmpColumnName = editor.attr( "id" ).replace( "customeditor" + gridId, "" );
			var columnName = tmpColumnName.substring( 0, tmpColumnName.indexOf( "_" ) );
			var isIndicatedByCell = $( "#" + gridId ).jqxGrid( 'getcolumnproperty', columnName, 'indicator' );
			if ( isIndicatedByCell === undefined ) {
				isIndicatedByCell = false;
			}
			return isIndicatedByCell;
		}

		//Hide the up and down button in scroll bar for jqx table
		if ( $.jqx !== undefined ) {
			$.jqx.init( {
				scrollBarButtonsVisibility: "hidden"
			} );
		}

	} )( $ );


	//inputfield.js
	( function( $ ) {

		$( document ).ready( function() {
			$( ".input-required input" ).on( "keyup", function( event ) {
				var inputValue = event.target.value;
				var mandatoryElement = $( event.target ).next( ".form-control-feedback" ).find( ".icon" );

				if ( inputValue.length > 0 ) {
					mandatoryElement.removeClass( "icon-mandatory" );
				} else {
					mandatoryElement.addClass( "icon-mandatory" );
				}
			} );

			$( ".n-inputfield-control-icon" ).on( "click", function( event ) {
				var prev = $( this ).prev();
				if ( prev.hasClass( "n-inputfield" ) ) {
					prev.attr( "placeholder", "" );
					prev.val( "" );
				}
			} );
		} );

	} )( $ );


	//jquery.mask.js
	( function( $ ) {
		var Mask = function( el, mask, options ) {
			el = $( el );

			var jMask = this,
				oldValue = el.val(),
				regexMask;

			mask = typeof mask === 'function' ? mask( el.val(), undefined, el, options ) : mask;

			var p = {
				invalid: [],
				getCaret: function() {
					try {
						var sel,
							pos = 0,
							ctrl = el.get( 0 ),
							dSel = document.selection,
							cSelStart = ctrl.selectionStart;

						// IE Support
						if ( dSel && navigator.appVersion.indexOf( 'MSIE 10' ) === -1 ) {
							sel = dSel.createRange();
							sel.moveStart( 'character', el.is( 'input' ) ? -el.val().length : -el.text().length );
							pos = sel.text.length;
						}
						// Firefox support
						else if ( cSelStart || cSelStart === '0' ) {
							pos = cSelStart;
						}

						return pos;
					} catch ( e ) {}
				},
				setCaret: function( pos ) {
					try {
						if ( el.is( ':focus' ) ) {
							var range, ctrl = el.get( 0 );

							if ( ctrl.setSelectionRange ) {
								ctrl.setSelectionRange( pos, pos );
							} else if ( ctrl.createTextRange ) {
								range = ctrl.createTextRange();
								range.collapse( true );
								range.moveEnd( 'character', pos );
								range.moveStart( 'character', pos );
								range.select();
							}
						}
					} catch ( e ) {}
				},
				events: function() {
					el
					// SPEC added keydown mask to prevent a lot of illegal characters to show up when key kept down
					// Still it shows the pressed key and erases it in key up if char is illegal - that could be
					// also blocked to get the user experience better - also some message/tooltip should be
					// shown what is the correct input format.
						.on( 'keydown.mask', p.behaviour )
						.on( 'keyup.mask', p.behaviour )
						.on( 'paste.mask drop.mask', function() {
							setTimeout( function() {
								el.keydown().keyup();
							}, 100 );
						} )
						.on( 'change.mask', function() {
							el.data( 'changed', true );
						} )
						.on( 'blur.mask', function() {
							if ( oldValue !== el.val() && !el.data( 'changed' ) ) {
								el.triggerHandler( 'change' );
							}
							el.data( 'changed', false );
						} )
						// it's very important that this callback remains in this position
						// otherwhise oldValue it's going to work buggy
						.on( 'keydown.mask, blur.mask', function() {
							oldValue = el.val();
						} )
						// select all text on focus
						.on( 'focus.mask', function( e ) {
							if ( options.selectOnFocus === true ) {
								$( e.target ).select();
							}
						} )
						// clear the value if it not complete the mask
						.on( 'focusout.mask', function() {
							if ( options.clearIfNotMatch && !regexMask.test( p.val() ) ) {
								p.val( '' );
							}
						} );
				},
				getRegexMask: function() {
					var maskChunks = [],
						translation, pattern, optional, recursive, oRecursive, r;

					for ( var i = 0; i < mask.length; i++ ) {
						translation = jMask.translation[ mask.charAt( i ) ];

						if ( translation ) {

							pattern = translation.pattern.toString().replace( /.{1}$|^.{1}/g, '' );
							optional = translation.optional;
							recursive = translation.recursive;

							if ( recursive ) {
								maskChunks.push( mask.charAt( i ) );
								oRecursive = {
									digit: mask.charAt( i ),
									pattern: pattern
								};
							} else {
								maskChunks.push( !optional && !recursive ? pattern : ( pattern + '?' ) );
							}

						} else {
							maskChunks.push( mask.charAt( i ).replace( /[-\/\\^$*+?.()|[\]{}]/g, '\\$&' ) );
						}
					}

					r = maskChunks.join( '' );

					if ( oRecursive ) {
						r = r.replace( new RegExp( '(' + oRecursive.digit + '(.*' + oRecursive.digit + ')?)' ), '($1)?' )
							.replace( new RegExp( oRecursive.digit, 'g' ), oRecursive.pattern );
					}

					return new RegExp( r );
				},
				destroyEvents: function() {
					el.off( [ 'keydown', 'keyup', 'paste', 'drop', 'blur', 'focusout', '' ].join( '.mask ' ) );
				},
				val: function( v ) {
					var isInput = el.is( 'input' ),
						method = isInput ? 'val' : 'text',
						r;

					if ( arguments.length > 0 ) {
						if ( el[ method ]() !== v ) {
							el[ method ]( v );
						}
						r = el;
					} else {
						r = el[ method ]();
					}

					return r;
				},
				getMCharsBeforeCount: function( index, onCleanVal ) {
					for ( var count = 0, i = 0, maskL = mask.length; i < maskL && i < index; i++ ) {
						if ( !jMask.translation[ mask.charAt( i ) ] ) {
							index = onCleanVal ? index + 1 : index;
							count++;
						}
					}
					return count;
				},
				caretPos: function( originalCaretPos, oldLength, newLength, maskDif ) {
					var translation = jMask.translation[ mask.charAt( Math.min( originalCaretPos - 1, mask.length - 1 ) ) ];

					return !translation ? p.caretPos( originalCaretPos + 1, oldLength, newLength, maskDif ) : Math.min( originalCaretPos + newLength - oldLength - maskDif, newLength );
				},
				behaviour: function( e ) {
					e = e || window.event;
					p.invalid = [];
					var keyCode = e.keyCode || e.which;
					if ( $.inArray( keyCode, jMask.byPassKeys ) === -1 ) {

						var caretPos = p.getCaret(),
							currVal = p.val(),
							currValL = currVal.length,
							changeCaret = caretPos < currValL,
							newVal = p.getMasked(),
							newValL = newVal.length,
							maskDif = p.getMCharsBeforeCount( newValL - 1 ) - p.getMCharsBeforeCount( currValL - 1 );

						p.val( newVal );

						// change caret but avoid CTRL+A
						if ( changeCaret && !( keyCode === 65 && e.ctrlKey ) ) {
							// Avoid adjusting caret on backspace or delete
							if ( !( keyCode === 8 || keyCode === 46 ) ) {
								caretPos = p.caretPos( caretPos, currValL, newValL, maskDif );
							}
							p.setCaret( caretPos );
						}

						return p.callbacks( e );
					}
				},
				getMasked: function( skipMaskChars ) {
					var buf = [],
						value = p.val(),
						m = 0,
						maskLen = mask.length,
						v = 0,
						valLen = value.length,
						offset = 1,
						addMethod = 'push',
						resetPos = -1,
						lastMaskChar,
						check;

					if ( options.reverse ) {
						addMethod = 'unshift';
						offset = -1;
						lastMaskChar = 0;
						m = maskLen - 1;
						v = valLen - 1;
						check = function() {
							return m > -1 && v > -1;
						};
					} else {
						lastMaskChar = maskLen - 1;
						check = function() {
							return m < maskLen && v < valLen;
						};
					}

					while ( check() ) {
						var maskDigit = mask.charAt( m ),
							valDigit = value.charAt( v ),
							translation = jMask.translation[ maskDigit ];

						if ( translation ) {
							if ( valDigit.match( translation.pattern ) ) {
								buf[ addMethod ]( valDigit );
								if ( translation.recursive ) {
									if ( resetPos === -1 ) {
										resetPos = m;
									} else if ( m === lastMaskChar ) {
										m = resetPos - offset;
									}

									if ( lastMaskChar === resetPos ) {
										m -= offset;
									}
								}
								m += offset;
							} else if ( translation.optional ) {
								m += offset;
								v -= offset;
							} else if ( translation.fallback ) {
								buf[ addMethod ]( translation.fallback );
								m += offset;
								v -= offset;
							} else {
								p.invalid.push( {
									p: v,
									v: valDigit,
									e: translation.pattern
								} );
							}
							v += offset;
						} else {
							if ( !skipMaskChars ) {
								buf[ addMethod ]( maskDigit );
							}

							if ( valDigit === maskDigit ) {
								v += offset;
							}

							m += offset;
						}
					}

					var lastMaskCharDigit = mask.charAt( lastMaskChar );
					if ( maskLen === valLen + 1 && !jMask.translation[ lastMaskCharDigit ] ) {
						buf.push( lastMaskCharDigit );
					}

					return buf.join( '' );
				},
				callbacks: function( e ) {
					var val = p.val(),
						changed = val !== oldValue,
						defaultArgs = [ val, e, el, options ],
						callback = function( name, criteria, args ) {
							if ( typeof options[ name ] === 'function' && criteria ) {
								options[ name ].apply( this, args );
							}
						};

					callback( 'onChange', changed === true, defaultArgs );
					callback( 'onKeyPress', changed === true, defaultArgs );
					callback( 'onComplete', val.length === mask.length, defaultArgs );
					callback( 'onInvalid', p.invalid.length > 0, [ val, e, el, p.invalid, options ] );
				}
			};


			// public methods
			jMask.mask = mask;
			jMask.options = options;
			jMask.remove = function() {
				var caret = p.getCaret();
				p.destroyEvents();
				p.val( jMask.getCleanVal() );
				p.setCaret( caret - p.getMCharsBeforeCount( caret ) );
				return el;
			};

			// get value without mask
			jMask.getCleanVal = function() {
				return p.getMasked( true );
			};

			jMask.init = function( onlyMask ) {
				onlyMask = onlyMask || false;
				options = options || {};

				jMask.byPassKeys = $.jMaskGlobals.byPassKeys;
				jMask.translation = $.jMaskGlobals.translation;

				jMask.translation = $.extend( {}, jMask.translation, options.translation );
				jMask = $.extend( true, {}, jMask, options );

				regexMask = p.getRegexMask();

				if ( onlyMask === false ) {

					if ( options.placeholder ) {
						el.attr( 'placeholder', options.placeholder );
					}

					// autocomplete needs to be off. we can't intercept events
					// the browser doesn't  fire any kind of event when something is
					// selected in a autocomplete list so we can't sanitize it.
					el.attr( 'autocomplete', 'off' );
					p.destroyEvents();
					p.events();

					var caret = p.getCaret();
					p.val( p.getMasked() );
					p.setCaret( caret + p.getMCharsBeforeCount( caret, true ) );

				} else {
					p.events();
					p.val( p.getMasked() );
				}
			};

			jMask.init( !el.is( 'input' ) );
		};

		$.maskWatchers = {};
		var HTMLAttributes = function() {
				var input = $( this ),
					options = {},
					prefix = 'data-mask-',
					mask = input.attr( 'data-mask' );

				if ( input.attr( prefix + 'reverse' ) ) {
					options.reverse = true;
				}

				if ( input.attr( prefix + 'clearifnotmatch' ) ) {
					options.clearIfNotMatch = true;
				}

				if ( input.attr( prefix + 'selectonfocus' ) === 'true' ) {
					options.selectOnFocus = true;
				}

				if ( notSameMaskObject( input, mask, options ) ) {
					return input.data( 'mask', new Mask( this, mask, options ) );
				}
			},
			notSameMaskObject = function( field, mask, options ) {
				options = options || {};
				var maskObject = $( field ).data( 'mask' ),
					stringify = JSON.stringify,
					value = $( field ).val() || $( field ).text();
				try {
					if ( typeof mask === 'function' ) {
						mask = mask( value );
					}
					return typeof maskObject !== 'object' || stringify( maskObject.options ) !== stringify( options ) || maskObject.mask !== mask;
				} catch ( e ) {}
			};


		$.fn.mask = function( mask, options ) {
			options = options || {};
			var selector = this.selector,
				globals = $.jMaskGlobals,
				interval = $.jMaskGlobals.watchInterval,
				maskFunction = function() {
					if ( notSameMaskObject( this, mask, options ) ) {
						return $( this ).data( 'mask', new Mask( this, mask, options ) );
					}
				};

			$( this ).each( maskFunction );

			if ( selector && selector !== '' && globals.watchInputs ) {
				clearInterval( $.maskWatchers[ selector ] );
				$.maskWatchers[ selector ] = setInterval( function() {
					$( document ).find( selector ).each( maskFunction );
				}, interval );
			}
			return this;
		};

		$.fn.unmask = function() {
			clearInterval( $.maskWatchers[ this.selector ] );
			delete $.maskWatchers[ this.selector ];
			return this.each( function() {
				var dataMask = $( this ).data( 'mask' );
				if ( dataMask ) {
					dataMask.remove().removeData( 'mask' );
				}
			} );
		};

		$.fn.cleanVal = function() {
			return this.data( 'mask' ).getCleanVal();
		};

		$.applyDataMask = function( selector ) {
			selector = selector || $.jMaskGlobals.maskElements;
			var $selector = ( selector instanceof $ ) ? selector : $( selector );
			$selector.filter( $.jMaskGlobals.dataMaskAttr ).each( HTMLAttributes );
		};

		var globals = {
			maskElements: 'input,td,span,div',
			dataMaskAttr: '*[data-mask]',
			dataMask: true,
			watchInterval: 300,
			watchInputs: true,
			watchDataMask: false,
			byPassKeys: [ 9, 16, 17, 18, 36, 37, 38, 39, 40, 91 ],
			translation: {
				0: {
					pattern: /\d/
				},
				9: {
					pattern: /\d/,
					optional: true
				},
				'#': {
					pattern: /\d/,
					recursive: true
				},
				A: {
					pattern: /[a-zA-Z0-9]/
				},
				S: {
					pattern: /[a-zA-Z]/
				}
			}
		};

		$.jMaskGlobals = $.jMaskGlobals || {};
		globals = $.jMaskGlobals = $.extend( true, {}, globals, $.jMaskGlobals );

		// looking for inputs with data-mask attribute
		if ( globals.dataMask ) {
			$.applyDataMask();
		}


		//remove this for unit test delay issue
		//setInterval(function(){
		//    if ($.jMaskGlobals.watchDataMask) { $.applyDataMask(); }
		//}, globals.watchInterval);


	} )( $ );


	//keyboard-support.js
	( function( $ ) {

		var ENTER_KEY = 13;
		var SPACE_BAR_KEY = 32;
		var LEFT_KEY = 37;
		var RIGHT_KEY = 39;
		var UP_KEY = 38;
		var DOWN_KEY = 40;
		var ESC_KEY = 27;
		var TAB_KEY = 9;

		/** add keyboard event for pull down && combo box*/
		$( document ).on( 'keydown', '.dropdown-menu', keyboardHandler );

		$( document ).on( 'keydown', '.selectlist', keyboardHandler );

		/** add keyboard event for panel unfloder/floder */
		$( document ).on( 'keydown', '.panel-heading', {
				notSupport: [ UP_KEY, DOWN_KEY ]
			}, keyboardHandler )
			.on( 'keydown', '.panel-arrow', {
				notSupport: [ UP_KEY, DOWN_KEY ]
			}, keyboardHandler )
			.on( 'keydown', '.icon-close', {
				notSupport: [ UP_KEY, DOWN_KEY ]
			}, keyboardHandler )
			.on( 'keydown', '.n-close', {
				notSupport: [ UP_KEY, DOWN_KEY ]
			}, keyboardHandler );

		/** add keyboard event for tree*/
		$( document ).on( 'keydown', '.tree', treeKeyboardHandler );

		/** add keyboard event for list*/
		$( document ).on( 'keydown', '.n-list-group', keyboardHandler );

		/** add keyboard event for flyout menu */
		$( document ).on( 'keydown', '.n-flyout-menu', keyboardHandler );

		/** add keyboard event for balloon and dialog */
		$( document ).on( 'keydown', 'a[data-toggle=popover]', {
				notSupport: [ UP_KEY, DOWN_KEY ]
			}, balloonKeyboardHandler )
			.on( 'keydown', 'a[data-toggle=modal]', {
				notSupport: [ UP_KEY, DOWN_KEY ]
			}, balloonKeyboardHandler );

		/** add keyboard event for tabbed pane */
		$( document ).on( 'keydown', '.nav-tabs li', tabPaneKeyboardHandler );

		/** add keyboard event for table **/
		$( document ).on( 'keydown.wf.keyboard', '.n-table tbody', tableKeyboardHandler );

		/** add keyboard event for calendar **/
		$( document ).on( 'keydown.wf.keyboard', '.datepicker-calendar-days', calendarDatePickerKeyboardHandler )
			.on( 'focusin.wf.keyboard', '.datepicker-calendar-days', calendarDatePickerFocusinHandler );

		$( document ).on( 'keydown.wf.keyboard', '.spinbox .spinbox-up', spinnerKeyboardHandler );
		$( document ).on( 'keydown.wf.keyboard', '.spinbox .spinbox-down', spinnerKeyboardHandler );

		$( document ).on( 'focusin.wf.keyboard', '.jqx-widget-content', jqTableFocusinHandler );

		/** keyboard support for combobox with filter **/
		$( document ).on( 'keydown.wf.keyboard', '.combobox', comboboxKeyboardHandler );

		function spinnerKeyboardHandler( e ) {
			var supportKeys = [ SPACE_BAR_KEY, UP_KEY, DOWN_KEY ];

			if ( supportKeys.indexOf( e.which ) === -1 ) {
				return;
			}

			if ( e.which === SPACE_BAR_KEY ) {
				$( e.target ).trigger( 'mousedown' );
				$( e.target ).trigger( 'mouseup' );
			} else {
				e.preventDefault();
				e.stopPropagation();
			}
		}

		function balloonKeyboardHandler( e ) {
			if ( e.which === ENTER_KEY ) {
				$( e.target ).trigger( 'click' );
			}
			keyboardHandler( e );
		}

		function tabPaneKeyboardHandler( e ) {
			var supportKeys = [ TAB_KEY, LEFT_KEY, SPACE_BAR_KEY, RIGHT_KEY, ENTER_KEY ];

			if ( supportKeys.indexOf( e.which ) === -1 ) {
				return;
			}

			if ( e.which !== TAB_KEY ) {
				e.preventDefault();
			}

			switch ( e.which ) {
				case ENTER_KEY:
				case SPACE_BAR_KEY:
					if ( !$( e.target ).closest( 'li' ).hasClass( 'disabled' ) ) {
						$( e.target ).tab( 'show' );
					}
					break;
				case LEFT_KEY: //focus on previous tab
				case RIGHT_KEY: //foucs on next tab
					var parent = getRootNode( $( e.target ) );
					var nextItem = getNextItem( parent, e );
					nextItem.trigger( 'focus' );
					break;
			}
		}

		function treeKeyboardHandler( e ) {
			var supportKeys = [ TAB_KEY, LEFT_KEY, SPACE_BAR_KEY, RIGHT_KEY, UP_KEY, DOWN_KEY ];

			if ( supportKeys.indexOf( e.which ) === -1 ) {
				return;
			}
			var iconFolder;
			switch ( e.which ) {
				case SPACE_BAR_KEY:
					var href = $( e.target ).attr( "href" );
					if ( href !== "" && href !== "#" ) {
						var target = $( e.target ).attr( "target" );
						var targetParent = window.parent.document.getElementById( target );
						var targetSelf = document.getElementById( target );
						if ( targetParent !== null ) {
							targetParent.src = href;
						} else if ( targetSelf !== null ) {
							targetSelf.src = href;
						} else {
							location.href = href;
						}
					}

					var currentStatus = $( e.target ).find( "input" ).prop( "checked" );
					var targetStatus = !currentStatus;
					$( e.target ).find( "input" ).prop( "checked", targetStatus );
					updateTree();

					break;
				case LEFT_KEY:
					var iconCaret = $( e.target ).find( ".icon-caret" );
					if ( iconCaret.length > 0 ) {
						if ( $( e.target ).find( '.glyphicon-folder-open' ).length ) {
							$( iconCaret ).trigger( "click" );
						}
					}
					// This is for table item that does not have the caret icon
					iconFolder = $( e.target ).find( ".icon-folder" );
					if ( iconFolder.length > 0 ) {
						if ( iconFolder.hasClass( 'glyphicon-folder-open' ) ) {
							$( e.target ).trigger( "click" );
						}
					}
					break;
				case RIGHT_KEY:
					iconCaret = $( e.target ).find( ".icon-caret" );
					if ( iconCaret.length > 0 ) {
						if ( $( e.target ).find( '.glyphicon-folder-close' ).length ) {
							$( iconCaret ).trigger( "click" );
						}
					}
					// This is for table item that does not have the caret icon
					iconFolder = $( e.target ).find( ".icon-folder" );
					if ( iconFolder.length > 0 ) {
						if ( iconFolder.hasClass( 'glyphicon-folder-close' ) ) {
							$( e.target ).trigger( "click" );
						}
					}
					break;
			}

			keyboardHandler( e );
		}

		function comboboxKeyboardHandler( e ) {
			var current = $( e.target );
			if ( e.which === ENTER_KEY ) {
				if ( current.hasClass( 'n-filter-clear-control' ) ) {
					e.preventDefault();
					current.find( 'span' ).trigger( 'click' );
				}
			}
		}

		function jqTableFocusinHandler( e ) {
			var current = $( e.target );
			// For tree table grid
			if ( current.hasClass( 'jqx-widget-content' ) ) {
				treeJQTableFocusinHandler( current );
			}
			// For standard grid
			//if (current.attr('id') !== undefined && current.attr('id').indexOf('wrapper') >= 0) {
			//    standardJqTableFocusinHandler(current);
			//}
		}

		function treeJQTableFocusinHandler( current ) {
			var keyIndex = current.find( 'tr:first' ).data( 'key' );
			var isFocused = false;
			var isTreeGrid = false;
			current.find( 'td' ).each( function() {
				if ( $( this ).hasClass( 'jqx-grid-cell-selected' ) && $( this ).hasClass( 'jqx-fill-state-pressed' ) ) {
					isFocused = true;
				}
				if ( $( this ).find( 'span:first' ).hasClass( 'jqx-tree-grid-collapse-button' ) ) {
					isTreeGrid = true;
				}
			} );
			if ( !isFocused && isTreeGrid ) {
				current.jqxTreeGrid( 'selectRow', keyIndex );
			}
		}

		function standardJqTableFocusinHandler( current ) {
			var isFocused = false;
			current.find( '.jqx-grid-cell' ).each( function() {
				if ( $( this ).hasClass( 'jqx-grid-cell-selected' ) && $( this ).hasClass( 'jqx-fill-state-pressed' ) ) {
					isFocused = true;
					return false;
				}
			} );
			if ( !isFocused ) {
				var p = current.parent();
				var pp = p.parent();
				pp.jqxGrid( 'selectcell', 0, pp.jqxGrid( 'columns' ).records[ 0 ].datafield );
			}
		}

		function tableKeyboardHandler( e ) {
			var supportKeys = [ TAB_KEY, SPACE_BAR_KEY, ENTER_KEY, LEFT_KEY, RIGHT_KEY, UP_KEY, DOWN_KEY ];
			var selectedClassName = 'n-cell-selected';

			if ( supportKeys.indexOf( e.which ) === -1 ) {
				return;
			}

			initTableSelected( e, selectedClassName );

			switch ( e.which ) {
				case SPACE_BAR_KEY:
				case ENTER_KEY:
					handleTableSpaceAndEntryKeyboardAction( e );
					break;
				case LEFT_KEY:
				case RIGHT_KEY:
				case UP_KEY:
				case DOWN_KEY:
					handleTableDirectionKeyAction( e, selectedClassName );
					break;
				case TAB_KEY:
					handleTableTabKeyboardAction( e, selectedClassName );
					break;
			}
		}

		function initTableSelected( e, className ) {
			var current = $( e.target );

			// Remove the selected class for all items in table
			current.closest( 'table' ).find( 'td' ).each( function() {
				$( this ).removeClass( className );
			} );

			// Only keep the selected class for current item
			if ( current.is( 'td' ) ) {
				if ( current.closest( 'table' ).hasClass( 'n-table-hover' ) ) {
					current.closest( 'tr' ).find( 'td' ).each( function() {
						$( this ).addClass( className );
					} );
				} else {
					current.addClass( className );
				}
			}
		}

		function handleTableSpaceAndEntryKeyboardAction( e ) {
			var current = $( e.target );
			if ( current.is( 'td' ) ) {
				// If the current focus is on table element, prevent the default key action.
				e.preventDefault();
				$( e.target ).trigger( 'click' );
				if ( current.find( 'input' ).length > 0 ) {
					// If the focused element is input filed or checkbox.
					current.find( 'input' ).focus();

					// If the focused element is dropdown list.
					if ( current.find( '.selectlist' ).length > 0 ) {
						current.find( 'button' ).trigger( "click" );
					}

					//WULF-867 calendar keyboard support in table
					if ( current.find( '.n-calendar' ).length > 0 ) {
						current.find( 'button' ).focus();
					}
				}
			}
		}

		function handleTableDirectionKeyAction( e, className ) {
			var current = $( e.target );

			// If the current focus is on table element, prevent the default key action.
			if ( ( current.attr( 'type' ) !== 'text' ) && ( !current.is( 'td' ) ) && current.find( '.n-calendar' ).length <= 0 ) {
				// dropup the possible list element.
				dropupListInTable( current );
				current = current.closest( 'td' );
			}

			var target = getNextTableItem( current, e );

			// Remove the selected class on current element and add selected class to target element.
			if ( target.length > 0 && !( current.hasClass( 'n-inputfield' ) && current.parent().hasClass( 'n-calendar' ) ) ) {
				e.preventDefault();
				if ( !current.closest( 'table' ).hasClass( 'n-table-hover' ) ) {

					//WULF-867 calendar keyboard support in table
					if ( !current.closest( 'table' ).hasClass( 'datepicker-calendar-days' ) &&
						( e.which === LEFT_KEY || e.which === RIGHT_KEY || e.which === UP_KEY || e.which === DOWN_KEY ) &&
						current.find( '.datepicker' ).find( '.dropdown-toggle' ).attr( 'aria-expanded' ) === 'true' ) {
						current.find( '.datepicker' ).find( '.dropdown-toggle' ).trigger( 'click' ).blur();
					}
					current.removeClass( className );
					target.addClass( className );
				} else {
					current.closest( 'tr' ).find( 'td' ).each( function() {
						$( this ).removeClass( className );
					} );
					target.closest( 'tr' ).find( 'td' ).each( function() {
						$( this ).addClass( className );
					} );
				}
				current.removeAttr( 'tabindex' );
				target.attr( 'tabindex', 0 );
				target.trigger( 'focus' );
			}

			//Handle scrollbar status
			var parent = target.closest( '.n-table-scrollbar' );
			if ( isScrollNeeded( parent, target ) ) {
				$( parent ).mCustomScrollbar( 'scrollTo', target, {
					scrollInertia: 0
				} );
			}
		}

		function handleTableTabKeyboardAction( e, className ) {
			var current = $( e.target );
			current.removeAttr( 'tabindex' );
			if ( current.hasClass( 'datepicker-date' ) ) {
				current.closest( '.datepicker-calendar-days' ).find( 'td' ).each( function() {
					$( this ).removeClass( className );
				} );
			} else {
				current.closest( '.n-table' ).find( 'td' ).each( function() {
					$( this ).removeClass( className );
				} );
			}
		}

		function getNextTableItem( current, e ) {
			if ( current.hasClass( "n-inputfield" ) && !current.parent().hasClass( 'n-calendar' ) ) {
				current = current.closest( 'td' );
			}

			var items = getAllVisibleSubItems( current.parent() );

			//if(current.children().hasClass("datepicker")){
			//    items= current.parent().children();
			//}
			//if(current.prev().children().hasClass("datepicker")){
			//    items= current.parent().children();
			//}

			var index = items.index( current );
			var prev, next;
			switch ( e.which ) {
				case TAB_KEY:
					if ( e.shiftKey ) {
						if ( index > 0 ) {
							index--;
						} else {
							index = items.length - 1;
							prev = current.parent().prev();
							while ( isHiddenTableElement( prev ) ) {
								prev = prev.prev();
							}
							items = getAllVisibleSubItems( prev );
						}
					} else {
						if ( index < items.length - 1 ) {
							index++;
						} else {
							index = 0;
							next = current.parent().next();
							while ( isHiddenTableElement( next ) ) {
								next = next.next();
							}
							items = getAllVisibleSubItems( next );
						}
					}
					break;
				case LEFT_KEY:
					index = index > 0 ? index - 1 : 0;
					break;
				case RIGHT_KEY:
					index = index < items.length - 1 ? index + 1 : items.length - 1;
					break;
				case UP_KEY:
					prev = current.parent().prev();
					while ( isHiddenTableElement( prev ) ) {
						prev = prev.prev();
					}
					items = prev.length > 0 ? getAllVisibleSubItems( prev ) : items;
					break;
				case DOWN_KEY:
					next = current.parent().next();
					while ( isHiddenTableElement( next ) ) {
						next = next.next();
					}
					items = next.length > 0 ? getAllVisibleSubItems( next ) : items;
					break;
				default:
					break;
			}
			return items.eq( index );
		}

		function isHiddenTableElement( current ) {
			return current.css( 'height' ) === '0px' || current.css( 'height' ) === '0' || current.css( 'display' ) === 'none';
		}

		/**
		 * Dropup the list if the element is a dropdown list.
		 *
		 * @param current - the current focused element.
		 */
		function dropupListInTable( current ) {
			if ( current.closest( 'div' ).hasClass( 'selectlist' ) ) {
				if ( current.closest( 'div' ).find( 'button' ).attr( 'aria-expanded' ) === 'true' ) {
					current.closest( 'div' ).find( 'button' ).trigger( 'click' );
				}
			}
		}

		function calendarDatePickerFocusinHandler( e ) {
			var td = $( e.target ).closest( 'td' );
			if ( !td.hasClass( 'selected' ) ) {
				initDatePickerSelected( e, 'selected' );
			}
		}

		function calendarDatePickerKeyboardHandler( e ) {
			var supportKeys = [ TAB_KEY, SPACE_BAR_KEY, ENTER_KEY, LEFT_KEY, RIGHT_KEY, UP_KEY, DOWN_KEY ];
			var selectedClassName = 'selected';

			if ( supportKeys.indexOf( e.which ) === -1 ) {
				return;
			}
			initDatePickerSelected( e, selectedClassName );

			switch ( e.which ) {
				case LEFT_KEY:
				case RIGHT_KEY:
				case UP_KEY:
				case DOWN_KEY:
					handleTableDirectionKeyAction( e, selectedClassName );
					break;
				case TAB_KEY:
					handleTableTabKeyboardAction( e, selectedClassName );
					break;
				case SPACE_BAR_KEY:
				case ENTER_KEY:
					$( e.target ).find( 'button' ).trigger( 'click' );
					break;
			}
		}

		function initDatePickerSelected( e, className ) {
			var current = $( e.target );
			current.closest( 'table' ).find( 'td' ).each( function() {
				$( this ).removeClass( className );
			} );
			//current.closest('td').addClass(className);
		}

		function keyboardHandler( e ) {
			var supportKeys = [ TAB_KEY, SPACE_BAR_KEY, UP_KEY, DOWN_KEY ];

			if ( supportKeys.indexOf( e.which ) === -1 ) {
				return;
			}

			if ( e.which !== TAB_KEY ) {
				e.preventDefault();
			}

			if ( e.data && e.data.notSupport ) {
				if ( e.data.notSupport.indexOf( e.which ) !== -1 ) {
					return;
				}
			}

			if ( e.which === SPACE_BAR_KEY ) {
				$( e.target ).trigger( 'click' );
				return;
			}

			var parent = getRootNode( $( e.target ) );
			var nextItem = getNextItem( parent, e );

			//Handle focus status
			switch ( e.which ) {
				case UP_KEY:
				case DOWN_KEY:
					nextItem.trigger( 'focus' );
					break;
				default:
					break;
			}

			//Handle scrollbar status
			if ( isScrollNeeded( parent, nextItem ) ) {
				$( parent ).mCustomScrollbar( 'scrollTo', nextItem, {
					scrollInertia: 0
				} );
			}
		}

		function getNextItem( parent, e ) {
			var items = getAllVisibleSubItems( parent );
			var indx = items.index( e.target );
			switch ( e.which ) {
				case TAB_KEY: // Tab or Shift+tab
					indx = ( e.shiftKey ? ( indx > 0 ? indx - 1 : 0 ) : ( indx < items.length - 1 ? indx + 1 : items.length - 1 ) );
					break;
				case LEFT_KEY:
				case UP_KEY:
					indx = indx > 0 ? indx - 1 : 0;
					break;
				case RIGHT_KEY:
				case DOWN_KEY:
					indx = indx < items.length - 1 ? indx + 1 : items.length - 1;
					break;
				default:
					break;
			}
			return items.eq( indx );
		}

		function isScrollNeeded( parent, item ) {
			if ( $( parent ).find( '.mCSB_container' ).length === 0 ) {
				return;
			}
			if ( $( item ).closest( 'table' ).hasClass( 'datepicker-calendar-days' ) ) {
				return;
			}

			var parentTop = $( parent ).offset().top;
			var itemTop = $( item ).offset().top;
			var parentHeight = $( parent ).get( 0 ).clientHeight;
			var itemHeight = item.get( 0 ).offsetHeight;
			var topDiff = itemTop - parentTop;
			var bottomDiff = topDiff + itemHeight;
			return ( topDiff < 10 || bottomDiff > parentHeight - 10 );
		}

		function getAllVisibleSubItems( target ) {
			if ( target.children().children().hasClass( "datepicker" ) ) {
				return target.children();
			}
			if ( target.children().hasClass( "datepicker" ) ) {
				return target.parent().children();
			}
			if ( target.prev().children().hasClass( "datepicker" ) ) {
				return target.parent().children();
			}

			if ( $( target ).hasClass( 'n-list-group' ) ) {
				if ( $( target ).is( 'dl' ) ) {
					return target.find( 'dd' );
				}
				return target.find( 'li' );
			}

			if ( $( target ).hasClass( 'n-flyout-menu' ) ) {
				return target.find( 'li a' );
			}

			if ( $( target ).hasClass( 'nav-tabs' ) ) {
				return target.find( 'li a' );
			}

			if ( $( target ).hasClass( 'dropdown-menu' ) ) {
				return target.find( 'li a' );
			}
			if ( $( target ).hasClass( 'tree' ) ) {
				var itemArr = [];
				var items = target.find( 'li:not(.hide) a' );
				for ( var i = 0; i <= items.length - 1; i++ ) {
					if ( !isTreeItemHidden( $( items[ i ] ) ) ) {
						itemArr.push( items[ i ] );
					}
				}
				return $( itemArr );
			}
			if ( $( target ).is( 'tr' ) && !isTableRowHidden( target ) ) {
				return target.find( 'td' );
			}
			return target.find( 'li' );
		}

		function isTableRowHidden( target ) {
			var display = target.css( 'display' ) === 'none';
			var visibility = target.css( 'visibility' ) === 'hidden';
			var height = target.height() === 0;
			return display || visibility || height;
		}

		function getRootNode( target ) {
			if ( target.hasClass( 'n-list-group-item' ) ) {
				if ( target.is( 'dd' ) ) {
					return target.closest( 'dl' );
				}
				return target.closest( 'ul' );
			}

			if ( target.hasClass( 'tree-branch-name' ) || target.hasClass( 'tree-item-name' ) ) {
				return target.closest( 'ul.tree' );
			}

			return target.closest( 'ul' );
		}

		function isTreeItemHidden( target ) {
			var isHidden = false;
			var parent = target.parent();
			while ( !parent.hasClass( 'tree' ) && !parent.is( 'html' ) ) {
				if ( parent.closest( 'ul' ).hasClass( 'hidden' ) ) {
					isHidden = true;
					break;
				}
				parent = parent.parent();
			}
			return isHidden;
		}

		function updateTree() {
			$( ".tree-branch-name > .checkbox > input[name='folder']" ).each( function() {
				var statuses = [];
				$( this ).closest( ".tree-branch" ).find( "input[name='file']" ).each(
					function() {
						statuses.push( $( this ).prop( "checked" ) );
					}
				);
				if ( statuses.length !== 0 ) {
					var allfileschecked = statuses.reduce( function( a, b ) {
						return a && b;
					} );
					var partfilechecked = statuses.reduce( function( a, b ) {
						return a || b;
					} );
					$( this ).prop( "checked", allfileschecked );
					if ( allfileschecked ) {
						$( this ).prop( {
							checked: true,
							indeterminate: false
						} );
					} else if ( partfilechecked ) {
						$( this ).prop( {
							checked: false,
							indeterminate: true
						} );
					} else {
						$( this ).prop( {
							checked: false,
							indeterminate: false
						} );
					}
				}
			} );
		}

	} )( $ );


	//list-group.js
	( function( $ ) {

		$( document ).on( "click", ".n-list-group-item", function() {
			$( this ).parents( ".n-list-group" ).find( ".n-list-group-item" ).removeClass( "selected" );
			$( this ).addClass( "selected" );
		} );

		$( document ).ready( function() {
			var listGroup = $( "ul.n-list-group" );
			$.each( listGroup, function() {
				if ( !$( this ).hasClass( "disabled" ) ) {
					$( this ).find( ".n-list-group-item" ).attr( "tabindex", 0 );
					//$(this).find(".n-list-group-item").bind("click", function () {
					//    $(this).parents(".n-list-group").find(".n-list-group-item").removeClass("selected");
					//    $(this).addClass("selected");
					//});
				}
			} );

			var descriptionListGroup = $( "dl.n-list-group" );
			$.each( descriptionListGroup, function() {
				if ( !$( this ).hasClass( "disabled" ) ) {
					$( this ).find( "dd" ).attr( "tabindex", 0 );
					$( this ).find( "dd" ).bind( "click", function() {
						$( this ).parents( ".n-list-group" ).find( "dd" ).removeClass( "selected" );
						$( this ).addClass( "selected" );
					} );
				}
			} );

			var listScrollGroup = $( "ul.n-list-group-scroll" );
			$.each( listScrollGroup, function() {

				if ( $( this ).hasClass( "disabled" ) ) {

					$( this ).nScrollbar( {
						alwaysShowScrollbar: 2,
						theme: "disabled",
						mouseWheel: {
							enable: false
						}
					} );

					$( this ).nScrollbar( "disable" );
				} else {
					$( this ).nScrollbar();
				}
			} );

			var descriptionListScrollGroup = $( "dl.n-list-group-scroll" );
			$.each( descriptionListScrollGroup, function() {

				if ( $( this ).hasClass( "disabled" ) ) {

					$( this ).nScrollbar( {
						alwaysShowScrollbar: 2,
						theme: "disabled",
						mouseWheel: {
							enable: false
						}
					} );

					$( this ).nScrollbar( "disable" );
				} else {
					$( this ).nScrollbar();
				}
			} );
		} );

	} )( $ );


	//login.js
	( function( $ ) {

		var $username = $( '#applicationLoginUsername' ),
			$password = $( '#applicationLoginPassword' ),
			$login = $( '#applicationLoginButton' );

		$( '#applicationLoginUsername,#applicationLoginPassword' ).on( 'keyup change', function( e ) {
			if ( $username.val() && $password.val() ) {
				$login.prop( 'disabled', false );
			} else {
				$login.prop( 'disabled', true );
			}
		} );
		$username.on( 'keyup change', function( e ) {
			if ( $username.val() ) {
				$username.next().children( 'span' ).removeClass( 'icon-mandatory' );
			} else {
				$username.next().children( 'span' ).addClass( 'icon-mandatory' );
			}
		} );
		$password.on( 'keyup change', function( e ) {
			if ( $password.val() ) {
				$password.next().children( 'span' ).removeClass( 'icon-mandatory' );
			} else {
				$password.next().children( 'span' ).addClass( 'icon-mandatory' );
			}
		} );

		$( '.n-login-forget-password' ).on( 'click', ">a", function() {
			$( this ).removeClass( "n-link-visited" ).addClass( "n-link-visited" );
		} );

	} )( $ );


	//navbar.js
	( function( $ ) {

		var nBannerLinksCollapse = $( ".n-banner-links-collapse" );
		var nBannerTabs = $( ".n-banner-tabs" );
		var KEY = {
			up: 38,
			down: 40,
			right: 39,
			left: 37,
			space: 32,
			enter: 13
		};

		/*---------------------- bind actions ----------------------*/
		nBannerTabs.on( "mouseover", ".n-dropdown-menu-item-has-child", function() {
			showSubMenu( $( this ) );
		} );

		nBannerTabs.on( "mouseleave", ".n-dropdown-menu-item-has-child", function() {
			hideSubMenu( $( this ).children( ".n-dropdown-sub-menu" ) );
		} );

		// add key event to show or close sub menu
		nBannerTabs.on( "keydown", ".n-dropdown-menu-item-has-child", function( event ) {
			// click right arrow, open sub menu;
			if ( event.keyCode === KEY.right ) {
				var $subMenu = $( this ).children( ".n-dropdown-sub-menu" );
				if ( !$subMenu.hasClass( "open" ) ) {
					showSubMenu( $( this ) );
					$( this ).blur();
					$subMenu.children( "li" ).first().children( "a" ).focus();
				}
			}
		} );

		nBannerTabs.on( "click", ".n-banner-dropdown-toggle", function() {
			var nDropdownSubmenuOpen = nDropdownSubmenuOpen || $( ".n-dropdown-sub-menu.open" );
			if ( nDropdownSubmenuOpen.length !== 0 ) {
				nDropdownSubmenuOpen.removeClass( "open" );
				nDropdownSubmenuOpen.siblings( 'a' ).removeClass( "n-dropdown-sub-menu-parent-active" );
			}
		} );

		nBannerTabs.on( "click", ".dropdown-menu>li", function() {
			if ( !$( this ).parent().hasClass( "open" ) ) {
				$( this ).closest( ".dropdown" ).find( "a" ).first().focus();
			}
		} );

		// add key event to move focus of sub menu item
		nBannerTabs.on( "keydown", ".n-dropdown-sub-menu>li", function( event ) {
			event.stopPropagation();
			// click up arrow
			if ( event.keyCode === KEY.up ) {
				setSubMenuItemFocus( $( this ), true );
			}
			// click down arrow
			else if ( event.keyCode === KEY.down ) {
				setSubMenuItemFocus( $( this ), false );
			}
			// click left arrow, close sub menu;
			else if ( event.keyCode === KEY.left ) {
				var $subMenu = $( this ).parent( ".n-dropdown-sub-menu" );
				hideSubMenu( $subMenu );
				$subMenu.prev( "a" ).focus();
			}
		} );

		nBannerTabs.on( "focus", ">li>a", function() {
			var $this = $( this );
			var parentLi = $this.closest( "li" );
			parentLi.siblings( "li" ).removeClass( "active" );
			parentLi.addClass( "active" );
			var barGrayToBlue = parentLi.closest( ".n-banner-tabs" ).siblings( ".n-banner-2nd-gray-to-blue" );
			if ( barGrayToBlue.length > 0 ) {
				if ( parentLi.hasClass( "rightmost-tab" ) ) {
					barGrayToBlue.addClass( "active" );
				} else {
					barGrayToBlue.removeClass( "active" );
				}
			}
		} );

		// hide all sub menu
		$( document ).on( 'click.bs.dropdown.data-api', function() {
			var nDropdownSubmenuOpen = nDropdownSubmenuOpen || $( ".n-dropdown-sub-menu.open" );
			if ( nDropdownSubmenuOpen.length !== 0 ) {
				nDropdownSubmenuOpen.removeClass( "open" );
				nDropdownSubmenuOpen.siblings( 'a' ).removeClass( "n-dropdown-sub-menu-parent-active" );
			}
		} );

		/*---------------------- functions ----------------------*/

		var showSubMenu = function( $parent ) {
			var parentMenuWidth = $parent.parent( "ul" ).innerWidth();
			var $subMenu = $parent.children( ".n-dropdown-sub-menu" );
			if ( parentMenuWidth < ( $parent.closest( ".n-banner" ).width() - $parent.offset().left ) ) {
				$subMenu.css( "left", parentMenuWidth + "px" );
			} else {
				$subMenu.css( "left", "-" + $subMenu.innerWidth() + "px" );
			}
			hideSubMenu( $parent.siblings( "li.n-dropdown-menu-item-has-child" ).children( ".n-dropdown-sub-menu.open" ) );
			$subMenu.addClass( "open" );
			$parent.children( 'a' ).addClass( "n-dropdown-sub-menu-parent-active" );
		};

		var hideSubMenu = function( $subMenu ) {
			$subMenu.css( "left", "auto" );
			$subMenu.removeClass( "open" );
			$subMenu.siblings( 'a' ).removeClass( "n-dropdown-sub-menu-parent-active" );
		};

		var setSubMenuItemFocus = function( $item, isUpMove ) {
			$item.siblings( "li" ).children( "a" ).blur();
			var prevItem = isUpMove ? $item.prev( "li" ) : $item.next( "li" );
			if ( prevItem.length === 0 ) {
				prevItem = isUpMove ? $item.parent().children( "li" ).last() : $item.parent().children( "li" ).first();
			}
			prevItem.children( "a" ).focus();
		};

		/*------------------update the info of 3rd nav-----------------*/
		nBannerTabs.on( 'keydown', "li", function( e ) {
			if ( e.keyCode === KEY.space || e.keyCode === KEY.enter ) {
				e.preventDefault();
				e.stopPropagation();
				$( e.target ).trigger( 'click' );
				bannerThirdLevelControl.call( this );
			}
		} );

		nBannerTabs.on( 'click', "li", function() {
			bannerThirdLevelControl.call( this );
		} );

		$( ".n_banner_3rd_subItem" ).on( "focus", ">li>a", function() {
			var $this = $( this );
			var parentLi = $this.closest( "li" );
			parentLi.siblings( "li" ).removeClass( "active" );
			parentLi.addClass( "active" );
		} );

		//collapsed banner toggle
		nBannerLinksCollapse.on( "mouseover", ".n-banner-links-collapse-dropdown-menu > .dropdown", function() {
			showCollapsedSubMenu( $( this ) );
		} );

		nBannerLinksCollapse.on( "mouseleave", ".n-banner-links-collapse-dropdown-menu > .dropdown", function() {
			hideCollapsedSubMenu( $( this ) );
		} );

		var showCollapsedSubMenu = function( $parent ) {
			var parentMenuWidth = $parent.parent( "ul" ).innerWidth();
			var $subMenu = $parent.children( ".n-collapse-dropdown-sub-menu" );
			if ( parentMenuWidth < ( $parent.closest( ".n-banner" ).width() - $parent.offset().left ) ) {
				$subMenu.css( "left", parentMenuWidth + "px" );
			} else {
				var subMenuPos = $subMenu.innerWidth() + 2;
				$subMenu.css( "left", "-" + subMenuPos + "px" );
			}

			$parent.addClass( "open" );
			$parent.children( 'a' ).eq( 0 ).addClass( "n-dropdown-sub-menu-parent-active" );
		};

		var hideCollapsedSubMenu = function( $parent ) {
			$parent.children( ".n-collapse-dropdown-sub-menu" ).css( "left", "auto" );
			$parent.removeClass( "open" );
			$parent.children( 'a' ).eq( 0 ).removeClass( "n-dropdown-sub-menu-parent-active" );

		};

		var bannerThirdLevelControl = function() {
			var div = $( this ).find( "div" );
			if ( !div.hasClass( "n-banner-overflow-control" ) ) {
				$( ".n-banner-3rd-filler-gray" ).hide();
				$( ".n-banner-3rd" ).find( ".n_banner_3rd_subItem" ).hide();
			}

			if ( $( this ).hasClass( "n-banner-3Link" ) ) {
				var id = $( this ).find( "a" ).data( "item" );
				$( ".n-banner-3rd-filler-gray" ).show();
				$( ".n-banner-3rd" ).show();
				$( "#" + id ).show();
			}
		};

	} )( $ );


	//panels.js
	( function( $ ) {

		$.fn.extend( {
			slideToggleVertical: function( options ) {
				var $slideBar = $( this );
				var currentImg = $slideBar.find( ".icon" );
				var speed = 500;
				var isOpen = true;
				var panelBody = $slideBar.parent().find( ".panel-body" );
				speed = options && options.speed;
				isOpen = options && options.isOpen;
				if ( isOpen ) {
					$( panelBody ).css( "display", "block" );
					currentImg.removeClass( 'icon-right' ).addClass( "icon-down" );
				} else {
					$( panelBody ).css( "display", "none" );
					currentImg.removeClass( 'icon-down' ).addClass( "icon-right" );
				}
				$slideBar.click( function() {
					panelBody.slideToggle( speed, function() {
						if ( panelBody.is( ":visible" ) ) {
							currentImg.removeClass( 'icon-right' ).addClass( "icon-down" );
						} else {
							currentImg.removeClass( 'icon-down' ).addClass( "icon-right" );
						}
					} );
				} );
			},
			slideToggleHorizontal: function( options ) {
				var isLeftOpen = options && options.isLeftOpen;
				var leftWidth = options && options.leftWidth;
				var $span = $( this );
				var parentLeft = $span.parent();
				var parentRight = parentLeft.parent().find( ".panel-right" );
				var panelBody = parentLeft.find( ".panel .panel-body" );
				var parent = $span.parent().find( ".panel" );
				var currentImg = $span.find( "span" );
				var myLeftWidth = typeof( leftWidth ) === "undefined" ? 30 : leftWidth;
				var myLeftOpen = typeof( isLeftOpen ) === "undefined" ? true : isLeftOpen;
				if ( myLeftOpen ) {
					parentLeft.css( {
						width: myLeftWidth + "%"
					} );
					parentRight.css( {
						width: "calc(" + ( 100 - myLeftWidth ) + "% - " + "20px)",
						"margin-left": "20px"
					} );
					parentLeft.addClass( "panel-shadow" );
					parentLeft.find( "div" ).each( function() {
						$( this ).show();
					} );
					$span.css( {
						'border-top-left-radius': '0px',
						'border-bottom-left-radius': '0px'
					} );
					parentRight.addClass( "open" );
					currentImg.removeClass( 'icon-right' ).addClass( 'icon-left' );
				} else {
					parentLeft.css( {
						width: "0"
					} );
					parentRight.css( {
						width: "calc(100% - 40px)",
						'margin-left': '40px'
					} );
					$( parent ).find( "div" ).each( function() {
						$( this ).hide();
					} );
					parentLeft.removeClass( "panel-shadow" );
					$span.css( {
						'border-top-left-radius': '7px',
						'border-bottom-left-radius': '7px'
					} );
					currentImg.removeClass( 'icon-left' ).addClass( 'icon-right' );
				}
				$span.click( function() {
					var currentArrow = $( this );
					if ( panelBody.is( ":visible" ) ) {

						var leftWidth = parentLeft.width();
						var rightWidth = parentRight.width();
						parentLeft.removeClass( "panel-shadow" );
						parentLeft.animate( {
							width: 0
						}, "show", function() {
							$( parent ).find( "div" ).each( function() {
								$( this ).hide();
							} );
							currentArrow.css( {
								'border-top-left-radius': '7px',
								'border-bottom-left-radius': '7px'
							} );
							currentImg.removeClass( 'icon-left' ).addClass( 'icon-right' );
						} );
						var current = leftWidth + rightWidth - 20;
						parentRight.animate( {
							width: current + "px",
							'margin-left': '40px'
						} );

					} else {
						parentLeft.find( "div" ).each( function() {
							$( this ).show();
						} );
						parentRight.css( {
							width: "calc(" + ( 100 - myLeftWidth ) + "% - " + "20px)",
							"margin-left": "20px"
						} );
						parentLeft.animate( {
							width: myLeftWidth + "%"
						}, "show", function() {
							parentLeft.addClass( "panel-shadow" );
							currentArrow.css( {
								'border-top-left-radius': '0px',
								'border-bottom-left-radius': '0px'
							} );
						} );
						currentImg.removeClass( 'icon-right' ).addClass( 'icon-left' );
					}
				} );
			}
		} );

	} )( $ );


	//radiogroup.js
	( function( $ ) {

		$.fn.radioButtonFocus = function() {
			var groups = [];

			// group the inputs by name
			$( this ).each( function() {
				var el = this;
				var thisGroup = groups[ el.name ] = ( groups[ el.name ] || [] );
				thisGroup.push( el );
			} );

			$( this ).on( 'keydown', function( e ) {
				setTimeout( function() {
					var el = e.target;
					var thisGroup = groups[ el.name ] = ( groups[ el.name ] || [] );
					var indexOfTarget = thisGroup.indexOf( e.target );
					var isShiftKey = ( window.event && window.event.shiftKey ) || e.shiftKey;

					if ( e.keyCode === 9 ) {
						if ( indexOfTarget < ( thisGroup.length - 1 ) && !isShiftKey ) {
							thisGroup[ indexOfTarget + 1 ].focus();
						} else if ( indexOfTarget > 0 && isShiftKey ) {
							thisGroup[ indexOfTarget - 1 ].focus();
						}
					}
					if ( e.keyCode === 13 ) {
						el.checked = true;
					}
				} );
			} );
		};

		$( document ).ready( function() {
			$( '.n-radio-btn' ).radioButtonFocus();
		} );


	} )( $ );


	//resize.js
	( function( $ ) {

		var Resizable = function( el ) {
			el = $( el );
			var resizeObject = this;

			resizeObject.init = function() {
				var p = $( el ).get( 0 );
				var resizer = document.createElement( 'div' );
				resizer.style.width = '10px';
				resizer.style.height = '10px';
				resizer.style.position = 'absolute';
				resizer.style.right = 0;
				resizer.style.bottom = 0;
				resizer.style.cursor = 'se-resize';
				resizer.className = 'resizer';
				p.className = p.className + ' resizable';
				p.appendChild( resizer );
				resizer.addEventListener( 'mousedown', initResize, false );

				var startX, startY, startWidth, startHeight;

				function initResize( e ) {
					startX = e.clientX;
					startY = e.clientY;
					startWidth = parseInt( document.defaultView.getComputedStyle( p ).width, 10 );
					startHeight = parseInt( document.defaultView.getComputedStyle( p ).height, 10 );
					document.documentElement.addEventListener( 'mousemove', doResize, false );
					document.documentElement.addEventListener( 'mouseup', stopResize, false );
				}

				function doResize( e ) {
					p.style.width = ( startWidth + e.clientX - startX ) + 'px';
					p.style.height = ( startHeight + e.clientY - startY ) + 'px';
					e.preventDefault();
				}

				function stopResize( e ) {
					document.documentElement.removeEventListener( 'mousemove', doResize, false );
					document.documentElement.removeEventListener( 'mouseup', stopResize, false );
				}
			};
			resizeObject.init();
		};

		var HTMLAttributes = function() {
			var input = $( this ),
				options = {},
				resize = ( input.attr( 'data-resize' ) === 'true' || input.attr( 'data-resize' ) === 'True' );
			if ( resize ) {
				return input.data( 'wf.resizable', new Resizable( this, options ) );
			}
		};

		var globalsResize = {
			resizeElements: 'div',
			dataResizeAttr: '*[data-resize]'
		};

		var applyDataResize = function( selector ) {
			selector = selector || globalsResize.resizeElements;
			var $selector = ( selector instanceof $ ) ? selector : $( selector );
			$selector.filter( globalsResize.dataResizeAttr ).each( HTMLAttributes );
		};

		var old = $.fn.resizeable;

		$.fn.resizeable = function( options ) {
			options = options || {};
			var resizeFunction = function() {
				return $( this ).data( 'wf.resizable', new Resizable( this ) );

			};
			$( this ).each( resizeFunction );
			return this;
		};

		$.fn.resizeable.noConflict = function() {
			$.fn.resizeable = old;
			return this;
		};

		$( document ).ready( function() {
			applyDataResize( 'div' );
		} );


	} )( $ );


	//scroll.js
	( function( $ ) {

		$.fn.extend( {
			nScrollbar: function( options ) {
				var $select = $( this );
				if ( $select.hasClass( "n-dropdown-menu-scroll" ) || $select.hasClass( "tree-scroll" ) || $select.hasClass( "n-table-scrollbar" ) ||
					( $select.hasClass( "n-list-group-scroll" ) && ( $select.find( "li.n-list-group-item" ).length > 0 || $select.find( "dd.n-list-group-item" ).length > 0 ) ) ) {
					options = $.extend( {}, options, {
						keyboard: {
							enable: false
						}
					} );
				}
				if ( $select.hasClass( "n-table-scrollbar" ) && $select.find( ".datepicker-calendar" ).length > 0 ) {
					options = $.extend( {}, options, {
						advanced: {
							autoScrollOnFocus: false
						}
					} );
				}
				options = $.extend( {}, options, {
					callbacks: {
						whileScrolling: function() {
							setTimeout( function() {
								$( '.datepicker-calendar-wrapper' ).each( function() {
									if ( $( this ).css( 'display' ) === 'block' ) {
										var input = $( this ).closest( '.n-calendar' ).find( 'input' );
										if ( input.data( 'position' ) === 'fixed' ) {
											$( this ).parent().find( 'button.dropdown-toggle' ).trigger( 'click' );
										}
									}
								} );
								$( '.dropdown-menu' ).each( function() {
									if ( $( this ).css( 'display' ) === 'block' ) {
										if ( $( this ).closest( '.selectlist' ).data( 'position' ) === 'fixed' ) {
											$( this ).parent().find( 'button.dropdown-toggle' ).trigger( 'click' );
										}
									}
								} );
							}, 100 );
						}
					}
				} );
				$select.mCustomScrollbar( options );
			}
		} );

	} )( $ );


	//search.js
	( function( $ ) {

		//handling the click event of clear icon
		$( document ).on( 'click.wf.search', '.n-search-control-icon', function( event ) {
			event.preventDefault();
			$( this ).prev( '.n-search-input' ).val( '' );
		} );


	} )( $ );


	//tables.js
	( function( $ ) {

		$( document ).ready( function() {
			$( ".n-table-hover, .n-table-cell-hover" ).mousedown( function( e ) {
				if ( e.shiftKey ) {
					// For non-IE browsers
					e.preventDefault();
					// For IE
					if ( typeof $.browser !== "undefined" && $.browser.msie ) {
						this.onselectstart = function() {
							return false;
						};
						var selectionEvent = this;
						window.setTimeout( function() {
							selectionEvent.onselectstart = null;
						}, 0 );
					}
				}
			} );

			initTableScrollbar();

			//Cell selection
			$( '.n-table-cell-hover' ).on( 'click', 'td', function( e ) {
				$( this ).closest( 'table' ).find( 'td' ).removeClass( 'n-cell-selected' );
				$( this ).closest( 'table' ).find( 'td' ).removeAttr( 'tabindex' );
				// Do not add selected class to td in tfoot.
				if ( $( this ).closest( 'tfoot' ).length <= 0 ) {
					$( this ).addClass( 'n-cell-selected' );
					$( this ).attr( 'tabindex', 0 );
					$( this ).trigger( 'focus' );
				}
			} );

			//Row selection
			var selectionPivot;
			$( '.n-table-hover' ).on( 'click', 'td', function( e ) {
				var trElements = $( this ).closest( 'table' ).find( 'tr' );
				var ctrlKeyPressed = ( window.event && window.event.ctrlKey ) || e.ctrlKey;
				var shiftKeyPressed = ( window.event && window.event.shiftKey ) || e.shiftKey;

				var isHighLighted = $( this ).closest( "tr" ).children( "td" ).hasClass( "n-cell-selected" );


				$( this ).closest( "tr" ).children( "td" ).removeClass( "n-cell-selected" );

				if ( !ctrlKeyPressed && !shiftKeyPressed ) {
					selectionPivot = $( this ).closest( "tr" );
					$( this ).closest( 'table' ).find( 'td' ).removeClass( 'n-cell-selected' );
					$( this ).closest( "tr" ).children( "td" ).addClass( "n-cell-selected" );
				} else if ( ctrlKeyPressed && !shiftKeyPressed ) {
					selectionPivot = $( this ).closest( "tr" );
					if ( isHighLighted ) {
						return;
					} else {
						$( this ).closest( "tr" ).children( "td" ).addClass( "n-cell-selected" );
					}
				} else {
					if ( !ctrlKeyPressed ) {
						$( this ).closest( 'table' ).find( 'td' ).removeClass( 'n-cell-selected' );
					}
					if ( typeof selectionPivot === "undefined" || ( $( selectionPivot ).closest( "table" ).get( 0 ) !== $( this ).closest( "table" ).get( 0 ) ) ) {
						selectionPivot = $( this ).closest( "tr" );
						$( this ).closest( "tr" ).children( "td" ).addClass( "n-cell-selected" );
						return;
					}
					var bot = Math.min( selectionPivot[ 0 ].rowIndex, $( this ).closest( "tr" )[ 0 ].rowIndex );
					var top = Math.max( selectionPivot[ 0 ].rowIndex, $( this ).closest( "tr" )[ 0 ].rowIndex );
					for ( var i = bot; i <= top; i++ ) {
						$( trElements[ i ] ).children( "td" ).addClass( "n-cell-selected" );
					}
				}
			} );

			$( '.n-sortable' ).on( 'click', function( e ) {
				var arrow = $( this ).find( '> span' );
				if ( arrow.is( '.icon-arrow' ) ) {
					arrow.removeClass( 'icon-arrow' );
					arrow.addClass( "icon-arrow-up" );

				} else if ( arrow.is( '.icon-arrow-up' ) ) {
					arrow.removeClass( 'icon-arrow-up' );
					arrow.addClass( "icon-arrow" );
				}
			} );
		} );

		$( window ).resize( function() {
			updateScrollTableWidth();
			synchronizeTableColumnWidth();
		} );

		function initTableScrollbar() {
			adjustScrollTable();
			setTimeout( synchronizeTableColumnWidth, 50 );
		}

		//insert and update some html code for every scroll table
		function adjustScrollTable() {
			$( ".n-table-scrollbar" ).each( function() {
				var colspanTotal = $( this ).closest( "table.n-table" ).find( "thead" ).eq( 0 ).find( "th" ).length;
				var theader = $( this ).closest( "table.n-table" ).find( "thead" ).eq( 0 ).html();
				var scrollTablePrefx = "<tr><th colspan='" + colspanTotal + "' style='padding: 0; border:none; border-bottom-left-radius: 7px; border-bottom-right-radius: 7px;'><table class='n-table-scrollbar'>" + theader;
				var scrollTableSuffix = "</table></th></tr>";
				var scrollTableHtml = $( this ).html();

				$( this ).html( scrollTablePrefx + scrollTableHtml + scrollTableSuffix );
				$( this ).removeClass( "n-table-scrollbar" );
			} );

			$( ".n-table-scrollbar" ).nScrollbar();

			$( ".n-table-scrollbar" ).each( function() {
				var tableWidth = $( this ).closest( "table.n-table" ).width();
				var container = $( this ).find( ".mCSB_container" );
				var containerPrefix = "<table style='width: " + tableWidth + "px;'>";
				var containerSuffix = "</table>";
				container.html( containerPrefix + container.html() + containerSuffix );
			} );
		}

		function updateScrollTableWidth() {
			$( ".n-table-scrollbar" ).each( function() {
				var tableWidth = $( this ).closest( "table.n-table" ).width();
				var table = $( this ).find( ".mCSB_container table" );
				table.width( tableWidth );
			} );
		}

		function synchronizeTableColumnWidth() {
			$( ".n-table-scrollbar" ).each( function() {
				var theadRowCount = $( this ).closest( "table.n-table" ).find( "thead" ).children().length;
				// Hide the thead in scroll content
				for ( var j = 0; j < theadRowCount; j++ ) {
					/*jshint loopfunc: true */
					$( this ).closest( "table.n-table" ).find( ".mCSB_container" ).find( 'tr' ).eq( j ).find( 'th' ).each( function() {
						$( this ).css( 'visibility', 'hidden' ).css( 'height', '0' ).css( 'line-height', '0' ).css( 'border-bottom', '0' );
						$( this ).find( 'span' ).css( 'display', 'none' );
						$( this ).find( 'div' ).css( 'visibility', 'hidden' ).css( 'height', '0' )
							.css( 'padding-top', '0' ).css( 'padding-bottom', '0' ).css( 'margin-top', '0' ).css( 'margin-bottom', '0' )
							.css( 'border-top', '0' ).css( 'border-bottom', '0' );
						$( this ).find( 'input' ).css( 'visibility', 'hidden' ).css( 'height', '0' )
							.css( 'padding-top', '0' ).css( 'padding-bottom', '0' ).css( 'margin', '0' ).css( 'margin-bottom', '0' )
							.css( 'border-top', '0' ).css( 'border-bottom', '0' );
						$( this ).find( 'button' ).css( 'visibility', 'hidden' ).css( 'height', '0' )
							.css( 'padding-top', '0' ).css( 'padding-bottom', '0' ).css( 'margin', '0' ).css( 'margin-bottom', '0' )
							.css( 'border-top', '0' ).css( 'border-bottom', '0' );
					} );
				}

				// reset the widht of thead to fit tbody
				var theadCols = $( this ).closest( "table.n-table" ).find( "thead" ).eq( 0 ).find( "th" );
				var tbodyCols = $( this ).find( "tr" ).eq( 0 ).children();
				for ( var i = 0; i < tbodyCols.length; i++ ) {
					var paddLeftDiff = parseFloat( $( tbodyCols[ i ] ).css( "padding-left" ) ) - parseFloat( $( theadCols[ i ] ).css( "padding-left" ) );
					var paddRightDiff = parseFloat( $( tbodyCols[ i ] ).css( "padding-right" ) ) - parseFloat( $( theadCols[ i ] ).css( "padding-right" ) );
					$( theadCols[ i ] ).width( parseFloat( $( tbodyCols[ i ] ).width() ) + paddLeftDiff + paddRightDiff + 0.5 );
				}
			} );
		}

	} )( $ );


	//textarea.js
	( function( $ ) {

		$( document ).ready( function() {
			var textArea = $( ".content-scroll .n-textarea" );
			var textAreaHeight = parseInt( $( ".content-scroll" ).css( "height" ) ) - 17;
			textArea.css( "height", textAreaHeight );
			textArea.wrap( "<div class='textarea-wrapper' />" );

			var textAreaWrapper = textArea.parent( ".textarea-wrapper" );
			textAreaWrapper.css( "height", $( ".content-scroll" ).css( "height" ) );
			textAreaWrapper.addClass( "textarea-wrapper-normal" );
			textAreaWrapper.mCustomScrollbar( {
				scrollInertia: 0,
				advanced: {
					autoScrollOnFocus: false
				}
			} );

			var hiddenDiv = $( document.createElement( "div" ) ),
				content = null;
			hiddenDiv.addClass( "textareaHiddenDiv" );
			hiddenDiv.css( "width", parseInt( textArea.css( "width" ) ) - 12 );
			hiddenDiv.css( "min-height", textAreaHeight );

			$( "body" ).prepend( hiddenDiv );

			$.fn.getCursorPosition = function() {
				var el = $( this ).get( 0 ),
					pos = 0;
				if ( "selectionStart" in el ) {
					pos = el.selectionStart;
				} else if ( "selection" in document ) {
					el.focus();
					var sel = document.selection.createRange(),
						selLength = document.selection.createRange().text.length;
					sel.moveStart( "character", -el.value.length );
					pos = sel.text.length - selLength;
				}
				return pos;
			};

			function updateScrollbar( localTextArea ) {
				var localContainer = localTextArea.parents( ".mCSB_container" );
				var localWrapper = localTextArea.parents( ".textarea-wrapper" );

				content = localTextArea.val();
				var cursorPosition = localTextArea.getCursorPosition();
				content = "<span>" + content.substr( 0, cursorPosition ) + "</span>" + content.substr( cursorPosition, content.length );
				content = content.replace( /\n/g, "<br />" );
				hiddenDiv.html( content + "<br />" );

				localTextArea.css( "height", hiddenDiv.height() );
				localWrapper.nScrollbar( "update" );

				var hiddenDivSpan = hiddenDiv.children( "span" ),
					hiddenDivSpanOffset = 0,
					viewLimitBottom = ( parseInt( hiddenDiv.css( "min-height" ) ) ) - hiddenDivSpanOffset,
					viewLimitTop = hiddenDivSpanOffset,
					viewRatio = Math.round( hiddenDivSpan.height() + localContainer.position().top );
				if ( viewRatio > viewLimitBottom || viewRatio < viewLimitTop ) {
					if ( ( hiddenDivSpan.height() - hiddenDivSpanOffset ) > 0 ) {
						localWrapper.mCustomScrollbar( "scrollTo", hiddenDivSpan.height() - hiddenDivSpanOffset );
					} else {
						localWrapper.mCustomScrollbar( "scrollTo", "top" );
					}
				}
			}

			if ( textArea.length > 0 ) {
				updateScrollbar( textArea );
				textArea.bind( "keyup keydown", function( e ) {
					updateScrollbar( $( this ) );
				} );
				textArea.bind( "focus", function() {
					var localWrapper = $( this ).parents( ".textarea-wrapper" );
					localWrapper.removeClass( "textarea-wrapper-normal" );
					localWrapper.addClass( "textarea-wrapper-focus" );
				} );
				textArea.bind( "blur", function() {
					var localWrapper = $( this ).parents( ".textarea-wrapper" );
					localWrapper.removeClass( "textarea-wrapper-focus" );
					localWrapper.addClass( "textarea-wrapper-normal" );
				} );
			}
		} );

	} )( $ );


	//tree-checkbox.js
	( function( $ ) {

		setTimeout( function() {
			var trees = $( '.tree' );
			for ( var i = 0; i < trees.length; i++ ) {
				updateLinkInTree( trees[ i ] );
				$( trees[ i ] ).on( "click", clickTree );
			}
		}, 500 );

		function clickTree( ev ) {
			updateLinkInTree( ev.currentTarget );
		}

		function updateLinkInTree( e ) {
			var allBranchMenu = $( e ).find( ".tree-branch" );
			for ( var j = 0; j < allBranchMenu.length; j++ ) {
				var branch = allBranchMenu[ j ];
				if ( $( branch ).attr( "src" ) !== "" ) {
					var header = $( branch ).children( ".tree-branch-header" );
					var a = $( header ).children( ".tree-branch-name" );
					$( a ).attr( "href", $( branch ).attr( "src" ) );
				}
			}

			var allItemMenu = $( e ).find( ".tree-item" );
			for ( var k = 0; k < allItemMenu.length; k++ ) {
				var item = allItemMenu[ k ];
				if ( $( item ).attr( "src" ) !== "" ) {
					var b = $( item ).children( ".tree-item-name" );
					$( b ).attr( "href", $( item ).attr( "src" ) );
				}
			}
		}

		/** For tree with checkbox */
		// process the leaf check box click events
		$( '.tree-has-checkbox' ).on( "keydown", "li.tree-item .checkbox[name='file']", trigerTreeItem );
		$( '.tree-has-checkbox' ).on( "click", "li.tree-item .checkbox[name='file']", trigerTreeItem );

		function trigerTreeItem( ev ) {
			if ( ev.which !== 32 && ev.which !== 1 ) {
				return;
			}

			ev.preventDefault();
			ev.stopPropagation();

			/*jshint validthis:true */
			var currentStatus = $( this ).find( "input" ).prop( "checked" );
			var targetStatus = !currentStatus;
			/*jshint validthis:true */
			$( this ).find( "input" ).prop( "checked", targetStatus );
			updateTree();
		}

		// process the folder check box click events
		$( '.tree-has-checkbox' ).on( "keydown", "li.tree-branch .checkbox[name='folder']", trigerTreeFolder );
		$( '.tree-has-checkbox' ).on( "click", "li.tree-branch .checkbox[name='folder']", trigerTreeFolder );

		function trigerTreeFolder( ev ) {
			if ( ev.which !== 32 && ev.which !== 1 ) {
				return;
			}

			ev.preventDefault();
			ev.stopPropagation();

			/*jshint validthis:true */
			var currentStatus = $( this ).find( "input" ).prop( "checked" );
			var targetStatus = !currentStatus;
			$( this ).find( "input" ).prop( {
				checked: targetStatus,
				indeterminate: false
			} );
			var arrChk = $( this ).closest( ".tree-branch" ).find( "input" );
			arrChk.each( function() {
				$( this ).prop( {
					checked: targetStatus,
					indeterminate: false
				} );
			} );
			updateTree();
		}

		$( '.tree' ).on( 'click.fu.tree', '.icon-caret', function( e ) {
			scrollTree( e );
		} );

		$( '.tree' ).on( 'click.fu.tree', '.tree-label', function( e ) {
			scrollTree( e );
		} );

		function scrollTree( e ) {
			var currentTarget = e.currentTarget;
			var parentNode = $( currentTarget ).parent();
			if ( $( parentNode ).hasClass( 'tree-branch-name' ) || $( parentNode ).hasClass( 'tree-branch-header' ) ) {
				var closetLiNode = parentNode.closest( 'li' );
				if ( !$( closetLiNode ).hasClass( 'tree-open' ) ) {
					var rootNode = parentNode.closest( 'ul.tree' );
					var treeClientHeight = rootNode.get( 0 ).clientHeight;
					var childNodesNum = closetLiNode.find( 'ul li' ).size();
					var lineHeight = $( parentNode ).get( 0 ).offsetHeight;
					var currentOffsetHeight = $( currentTarget ).offset().top - rootNode.offset().top;
					var initScroll = ( childNodesNum === 0 && currentOffsetHeight > treeClientHeight * 3 / 4 );
					if ( ( treeClientHeight < ( currentOffsetHeight + ( childNodesNum + 1 ) * lineHeight ) ) || initScroll ) {
						rootNode.mCustomScrollbar( 'scrollTo', currentTarget, {
							scrollInertia: 0
						} );
					}
				}
			}
		}

		function updateTree() {
			$( ".tree-branch-name > .checkbox > input[name='folder']" ).each( function() {
				var statuses = [];
				$( this ).closest( ".tree-branch" ).find( "input[name='file']" ).each(
					function() {
						statuses.push( $( this ).prop( "checked" ) );
					}
				);
				if ( statuses.length !== 0 ) {
					var allfileschecked = statuses.reduce( function( a, b ) {
						return a && b;
					} );
					var partfilechecked = statuses.reduce( function( a, b ) {
						return a || b;
					} );
					$( this ).prop( "checked", allfileschecked );
					if ( allfileschecked ) {
						$( this ).prop( {
							checked: true,
							indeterminate: false
						} );
					} else if ( partfilechecked ) {
						$( this ).prop( {
							checked: false,
							indeterminate: true
						} );
					} else {
						$( this ).prop( {
							checked: false,
							indeterminate: false
						} );
					}
				}
			} );
		}

	} )( $ );


	//tree-table.js
	( function( $ ) {

		$( document ).ready( function() {
			if ( $.jqx !== undefined ) {
				if ( $.jqx._jqxTreeGrid !== undefined ) {
					$.extend( $.jqx._jqxTreeGrid.prototype, {
						expandRow: function( h, j ) {
							// Original code -- Get from jqxtreegrid.js
							var d = this.base;
							if ( d._loading ) {
								return;
							}
							var e = d._names();
							var f = this;
							var b = d.rowinfo[ h ];
							if ( !b ) {
								var k = this.getRow( h );
								if ( k ) {
									d.rowinfo[ h ] = {
										row: k
									};
									if ( k.originalRecord ) {
										d.rowinfo[ h ].originalRecord = k.originalRecord;
									}
									b = d.rowinfo[ h ];
								}
							}
							if ( b ) {
								if ( b.expanded ) {
									b.row[ e.expanded ] = true;
									return;
								}
								b.expanded = true;
								b.row[ e.expanded ] = true;
								if ( b.originalRecord ) {
									b.originalRecord[ e.expanded ] = true;
								}
								if ( this.virtualModeCreateRecords && !b.row._loadedOnDemand ) {
									var c = function( m ) {
										b.row._loadedOnDemand = true;
										if ( m === false ) {
											d._loading = false;
											f._hideLoadElement();
											b.leaf = true;
											b.row[ e.leaf ] = true;
											d._renderrows();
											if ( j ) {
												j();
											}
											return;
										}
										for ( var n = 0; n < m.length; n++ ) {
											m[ n ][ e.level ] = b.row[ e.level ] + 1;
											m[ n ][ e.parent ] = b.row;
											if ( d.rowsByKey[ m[ n ].uid ] ) {
												d._loading = false;
												f._hideLoadElement();
												b.leaf = true;
												b.row[ e.leaf ] = true;
												d._renderrows();
												if ( j ) {
													j();
												}
												throw new Error( "Please, check whether you Add Records with unique ID/Key. " );
											}
											d.rowsByKey[ m[ n ].uid ] = m[ n ];
											f.virtualModeRecordCreating( m[ n ] );
										}
										if ( !b.row.records ) {
											b.row.records = m;
										} else {
											b.row.records = b.row.records.concat( m );
										}
										if ( ( !m ) || ( m && m.length === 0 ) ) {
											b.leaf = true;
											b.row[ e.leaf ] = true;
										}
										if ( b.originalRecord ) {
											b.originalRecord.records = m;
											b.originalRecord[ e.expanded ] = true;

											if ( m.length === 0 ) {
												b.originalRecord[ e.leaf ] = true;
											}
										}
										d._loading = false;
										f._hideLoadElement();
										var l = d.vScrollBar.css( "visibility" );
										d._renderrows();
										d._updateScrollbars();
										var o = l !== d.vScrollBar.css( "visibility" );
										if ( d.height === "auto" || d.height === null || d.autoheight || o ) {
											d._arrange();
										}
										d._renderhorizontalscroll();
										if ( j ) {
											j();
										}
									};
									if ( !b.row[ e.leaf ] ) {
										d._loading = true;
										this._showLoadElement();
										this.virtualModeCreateRecords( b.row, c );
										return;
									}
								}
								if ( !d.updating() ) {
									var g = d.vScrollBar.css( "visibility" );
									d._renderrows();
									d._updateScrollbars();
									var i = g !== d.vScrollBar.css( "visibility" );
									if ( d.height === "auto" || d.height === null || d.autoheight || i ) {
										d._arrange();
									}
									d._renderhorizontalscroll();
									d._raiseEvent( "rowExpand", {
										row: b.row,
										key: h
									} );
								}
							}

							// Extended code -- trigger scroll bar to right position
							var hostHeight = d.host.height();
							var tableHeight = d.table.height();
							var currentRow = this.getRow( h );
							var rows = d.getRows();
							var count = 0;
							while ( currentRow.parent !== null ) {
								count = count + getItemsBeforeInTable( currentRow, rows );
								currentRow = this.getRow( currentRow.parent );
							}
							var height = d.columnsHeight * count;
							var max = d.vScrollBar.jqxScrollBar( "max" );
							if ( tableHeight > hostHeight ) {
								if ( height > max ) {
									height = max;
								}
								d.vScrollBar.jqxScrollBar( "setPosition", height );
							}
						}
					} );
				}
			}
		} );

		/**
		 * Return the visible row count before the current row
		 *
		 * @param currentRow
		 * @param rows
		 * @returns {number}
		 */
		function getItemsBeforeInTable( currentRow, rows ) {
			var count = 0;
			for ( var i = 0; i < rows.length; i++ ) {
				if ( rows[ i ].uid === currentRow.uid ) {
					break;
				}
				if ( rows[ i ].parent === currentRow.parent ) {
					count++;
				}
			}
			return count;
		}

	} )( $ );


	//tree.js
	( function( $ ) {

		$( document ).ready(
			function() {
				if ( $.fn.tree !== undefined ) {
					$.fn.tree.Constructor.prototype.disable = function() {
						var self = this;
						self.$element.addClass( 'disabled-tree' );
						self.$element.find( 'a' ).each( function() {
							$( this ).attr( 'disabled', 'disabled' );
						} );
						// Disable scroll bar if exists
						if ( self.$element.find( ".mCSB_scrollTools" ).length > 0 ) {
							self.$element.mCustomScrollbar( 'destroy' );
							self.$element.mCustomScrollbar( {
								advanced: {
									autoExpandHorizontalScroll: true
								},
								alwaysShowScrollbar: 2,
								theme: 'disabled',
								mouseWheel: {
									enable: false,
									axis: 'x'
								}

							} );
							self.$element.mCustomScrollbar( "disable" );
						}
					};

					$.fn.tree.Constructor.prototype.enableScrollbar = function( width, height ) {
						var self = this;
						self.$element.nScrollbar();
						self.$element.css( 'width', width + 'px' );
						self.$element.css( 'height', height + 'px' );
					};

					$.fn.tree.Constructor.prototype.populate = function( $el ) {
						var self = this;
						var $parent = ( $el.hasClass( 'tree' ) ) ? $el : $el.parent();
						var loader = $parent.find( '.tree-loader:eq(0)' );
						var treeData = $parent.data();

						loader.removeClass( 'hide hidden' ); // hide is deprecated
						this.options.dataSource( treeData ? treeData : {}, function( items ) {
							loader.addClass( 'hidden' );

							$.each( items.data, function( index, value ) {
								var $entity;

								if ( value.type === 'folder' ) {
									$entity = self.$element.find( '[data-template=treebranch]:eq(0)' ).clone().removeClass( 'hide hidden' ).removeData( 'template' ); // hide is deprecated
									$entity.data( value );
									$entity.find( '.tree-branch-name > .tree-label' ).html( value.text || value.name );
								} else if ( value.type === 'item' ) {
									$entity = self.$element.find( '[data-template=treeitem]:eq(0)' ).clone().removeClass( 'hide hidden' ).removeData( 'template' ); // hide is deprecated
									$entity.find( '.tree-item-name > .tree-label' ).html( value.text || value.name );
									$entity.data( value );
								}

								// Added support for description and icon
								if ( value.desc ) {
									$entity.find( '.tree-label' ).append( "<span class='tree-description'> &ndash; " + value.desc + "</span>" );
								}
								if ( value.icon ) {
									$entity.find( '.tree-label' ).append( "<span class='icon " + value.icon + "'></span>" );
								}

								// add attributes to tree-branch or tree-item
								var attr = value.attr || value.dataAttributes || [];
								$.each( attr, function( key, value ) {
									switch ( key ) {
										case 'cssClass':
										case 'class':
										case 'className':
											$entity.addClass( value );
											break;

											// allow custom icons
										case 'data-icon':
											$entity.find( '.icon-item' ).removeClass().addClass( 'icon-item ' + value );
											$entity.attr( key, value );
											break;

											// ARIA support
										case 'id':
											$entity.attr( key, value );
											$entity.attr( 'aria-labelledby', value + '-label' );
											$entity.find( '.tree-branch-name > .tree-label' ).attr( 'id', value + '-label' );
											break;

											// style, data-*
										default:
											$entity.attr( key, value );
											break;
									}
								} );

								// add child nodes
								if ( $el.hasClass( 'tree-branch-header' ) ) {
									$parent.find( '.tree-branch-children:eq(0)' ).append( $entity );
								} else {
									$el.append( $entity );
								}
							} );
							// return newly populated folder
							self.$element.trigger( 'loaded.fu.tree', $parent );
						} );
					};
				}
			} );

	} )( $ );

	/* jshint ignore:end */
} ) );
