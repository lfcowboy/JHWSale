!function(a){"function"==typeof define&&define.amd?define(["jquery","fuelux/loader"],a):"object"==typeof exports?module.exports=a(require("jquery")):a(jQuery)}(function(a){var b=a.fn.infinitescroll,c=function(b,c){this.$element=a(b),this.$element.addClass("infinitescroll"),this.options=a.extend({},a.fn.infinitescroll.defaults,c),this.curScrollTop=this.$element.scrollTop(),this.curPercentage=this.getPercentage(),this.fetchingData=!1,this.$element.on("scroll.fu.infinitescroll",a.proxy(this.onScroll,this)),this.onScroll()};c.prototype={constructor:c,destroy:function(){return this.$element.remove(),this.$element.empty(),this.$element[0].outerHTML},disable:function(){this.$element.off("scroll.fu.infinitescroll")},enable:function(){this.$element.on("scroll.fu.infinitescroll",a.proxy(this.onScroll,this))},end:function(b){var c=a('<div class="infinitescroll-end"></div>');c.append(b?b:"---------"),this.$element.append(c),this.disable()},getPercentage:function(){var a="border-box"===this.$element.css("box-sizing")?this.$element.outerHeight():this.$element.height(),b=this.$element.get(0).scrollHeight;return b>a?a/(b-this.curScrollTop)*100:0},fetchData:function(b){var c,d=a('<div class="infinitescroll-load"></div>'),e=this,f=function(){var b={percentage:e.curPercentage,scrollTop:e.curScrollTop},c=a('<div class="loader"></div>');d.append(c),c.loader(),e.options.dataSource&&e.options.dataSource(b,function(a){var b;d.remove(),a.content&&e.$element.append(a.content),a.end&&(b=a.end!==!0?a.end:void 0,e.end(b)),e.fetchingData=!1})};this.fetchingData=!0,this.$element.append(d),this.options.hybrid&&b!==!0?(c=a('<button type="button" class="btn btn-primary"></button>'),c.append("object"==typeof this.options.hybrid?this.options.hybrid.label:'<span class="glyphicon glyphicon-repeat"></span>'),c.on("click.fu.infinitescroll",function(){c.remove(),f()}),d.append(c)):f()},onScroll:function(a){this.curScrollTop=this.$element.scrollTop(),this.curPercentage=this.getPercentage(),!this.fetchingData&&this.curPercentage>=this.options.percentage&&this.fetchData()}},a.fn.infinitescroll=function(b){var d,e=Array.prototype.slice.call(arguments,1),f=this.each(function(){var f=a(this),g=f.data("fu.infinitescroll"),h="object"==typeof b&&b;g||f.data("fu.infinitescroll",g=new c(this,h)),"string"==typeof b&&(d=g[b].apply(g,e))});return void 0===d?f:d},a.fn.infinitescroll.defaults={dataSource:null,hybrid:!1,percentage:95},a.fn.infinitescroll.Constructor=c,a.fn.infinitescroll.noConflict=function(){return a.fn.infinitescroll=b,this}});