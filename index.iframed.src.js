(function () {
    var intervalNotifyId = setInterval(notifyParentLoading, 500);
    var isMessageGot = false;

    var doc = document;
    var win = window;
    var host = location.host;

    win.addEventListener('message', function (msg) {
        clearInterval(intervalNotifyId);
        if (!isMessageGot) {
            setTimeout(notifyParentLoading, 100)
        }
        isMessageGot = true;

    }, false);


    document.addEventListener("DOMContentLoaded", function (event) {

        var parent = window.parent;
        if (!parent) return;

        win.addEventListener('message', function (msg) {
            if (msg.type === 'wechat_unblocker') {
                setTimeout(function () {
                    updateParent();
                }, 2000);
            }

        }, false);

        setTimeout(function () {
            updateParent();
        }, 2000);

        $('body').on('click', 'a', function (e) {
            var $a = $(this);
            var href = $a.attr('href');
            if (/\/\//.test(href) && !href.match(host)) {
                updateParent(true, href);
            }
        })

        function updateParent(isReplaceHref, href) {

            var parent = window.parent;
            if (!parent) {
                return;
            }

            var $featuredImg = $('.wp-post-image:first');

            if (!$featuredImg.length) {
                $featuredImg = $('.size-large:first')
            }

            if (!$featuredImg.length) {
                $featuredImg = $('.size-full:first')
            }

            if (!$featuredImg.length) {
                var area = 0;
                $('img').each(function () {
                    var w = parseInt($(this).attr('width')) || 1;
                    var h = parseInt($(this).attr('height')) || 1;
                    var _area = w * h;
                    if (_area > area) {
                        area = _area;
                        $featuredImg = $(this)
                    }
                });
            }

            parent.postMessage({
                msgTitle: 'updateParent',
                title: doc.title,
                description: $('.entry-content').clone().find('#toc_container').remove().end().find('p').text(),
                url: href || location.href,
                path: location.path,
                search: location.search,
                hash: location.hash,
                isReplaceHref: isReplaceHref,
                imgSrc: $featuredImg.attr('src')
            }, '*');
        }

    });

    function notifyParentLoading() {

        var parent = window.parent;
        if (!parent) {
            clearInterval(intervalNotifyId);
            return;
        }
        ;

        parent.postMessage({
            msgTitle: 'connected'
        }, '*');
    }


})();
