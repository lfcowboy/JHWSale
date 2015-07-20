/**
 * Created by junjchen on 02.07.2015.
 */
var banner_blue_detach_event = "n.banner.blue.block.detached";
var banner_blue_attach_event = "n.banner.blue.block.attached";

// responsive banner behavior when blue areas in 2 rows are detached
$(window).resize(triggerCollapseBanner);
$(document).ready(triggerCollapseBanner);

function triggerCollapseBanner() {
    //loop through every banner on the page
    var banners_in_page = $('.n-banner');
    banners_in_page.each(function () {
        var banner = $(this);
        //blue part offset on the top banner
        var offset_up_blue = banner.find('.n-banner-1st-blue-to-gray').position().left + banner.find('.n-banner-1st-blue-to-gray .blue-corner').width();
        //grey part width in the bottom
        var nav_tab_down = banner.find('.n-banner-2nd .n-banner-tabs');
        //grey part off set in the bottom banner
        var offset_down_gray = nav_tab_down.width();
        if (offset_up_blue < offset_down_gray) {
            banner.trigger(banner_blue_detach_event);
        } else {
            banner.trigger(banner_blue_attach_event);
        }
    })
}

$('.n-banner').on('n.banner.blue.block.detached', bannerBlueBlockDetached).on('n.banner.blue.block.attached', bannerBlueBlockAttached);

function bannerBlueBlockDetached() {
    //the last tab in the bottom banner tab bar that needs to transfer style
    var nav_tab_down_right_most_tab = $(this).find('.n-banner-2nd .rightmost-tab');
    //elements mark to be hidden on blue detached event in the banner
    var hidden_on_blue_detach = $(this).find('.hidden-on-blue-detached');
    var show_on_blue_detach = $(this).find('.show-on-blue-detached');
    //nav links
    var nav_links = $(this).find('.n-banner-2nd .n-banner-links');
    var overflow_cover=$(this).find('.overflow-toggle-area-cover');

    hidden_on_blue_detach.hide();
    show_on_blue_detach.show();
    nav_tab_down_right_most_tab.removeClass('rightmost-tab').addClass('rightmost-tab-disabled');
    nav_links.removeClass('nav n-banner-nav n-banner-links').addClass("dropdown-menu n-banner-links-collapse-dropdown-menu");
    overflow_cover.show();
}

function bannerBlueBlockAttached() {
    var nav_tab_down_right_most_tab = $(this).find('.n-banner-2nd .rightmost-tab-disabled').last();
    var hidden_on_blue_detach = $(this).find('.hidden-on-blue-detached');
    var show_on_blue_detach = $(this).find('.show-on-blue-detached');
    var nav_links = $(this).find('.n-banner-2nd .n-banner-links-collapse-dropdown-menu');
    var overflow_cover=$(this).find('.overflow-toggle-area-cover');

    hidden_on_blue_detach.show();
    show_on_blue_detach.hide();
    nav_tab_down_right_most_tab.removeClass('rightmost-tab-disabled').addClass('rightmost-tab');
    nav_links.removeClass("dropdown-menu n-banner-links-collapse-dropdown-menu").addClass('nav n-banner-nav n-banner-links');
    overflow_cover.hide();
}