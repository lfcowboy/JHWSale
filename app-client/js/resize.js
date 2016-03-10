        var Resizable = function (el) {
            el = $(el);
            var resizeObject = this;

            resizeObject.init = function () {
                var p = $(el).get(0);
                var resizer = document.createElement('div');
                resizer.style.width = '10px';
                resizer.style.height = '10px';
                resizer.style.position = 'absolute';
                resizer.style.right = 0;
                resizer.style.bottom = 0;
                resizer.style.cursor = 'se-resize';
                resizer.className = 'resizer';
                p.className = p.className + ' resizable';
                p.appendChild(resizer);
                resizer.addEventListener('mousedown', initResize, false);

                var startX, startY, startWidth, startHeight;

                function initResize(e) {
                    startX = e.clientX;
                    startY = e.clientY;
                    startWidth = parseInt(document.defaultView.getComputedStyle(p).width, 10);
                    startHeight = parseInt(document.defaultView.getComputedStyle(p).height, 10);
                    document.documentElement.addEventListener('mousemove', doResize, false);
                    document.documentElement.addEventListener('mouseup', stopResize, false);
                }

                function doResize(e) {
                    p.style.width = (startWidth + e.clientX - startX) + 'px';
                    p.style.height = (startHeight + e.clientY - startY) + 'px';
                    e.preventDefault();
                }

                function stopResize() {
                    document.documentElement.removeEventListener('mousemove', doResize, false);
                    document.documentElement.removeEventListener('mouseup', stopResize, false);
                }
            };
            resizeObject.init();
        };

        var HTMLAttributes = function () {
            var input = $(this),
                options = {},
                resize = (input.attr('data-resize') === 'true' || input.attr('data-resize') === 'True');
            if (resize) {
                return input.data('wf.resizable', new Resizable(this, options));
            }
        };

        var globalsResize = {
            resizeElements: 'div',
            dataResizeAttr: '*[data-resize]'
        };

        var applyDataResize = function (selector) {
            selector = selector || globalsResize.resizeElements;
            var $selector = (selector instanceof $) ? selector : $(selector);
            $selector.filter(globalsResize.dataResizeAttr).each(HTMLAttributes);
        };

        var old = $.fn.resizeable;

        $.fn.resizeable = function () {
            var resizeFunction = function () {
                return $(this).data('wf.resizable', new Resizable(this));

            };
            $(this).each(resizeFunction);
            return this;
        };

        $.fn.resizeable.noConflict = function () {
            $.fn.resizeable = old;
            return this;
        };

        applyDataResize('div');