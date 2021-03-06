function initPromos($context, module_context, version, platform) {
    if (!$context) {
        $context = $(document.body);
    }
    var $promos = $('#promos[data-promo-url]', $context);
    if (!$promos.length) {
        return;
    }
    var promo_url = $promos.attr('data-promo-url');
    if (!version) {
        version = z.browserVersion;
    }
    if (!platform) {
        platform = z.platform;
    }
    if (z.badBrowser && !version && !platform) {
        version = '5.0';
        platform = 'mac';
    }
    var data = {};
    if (module_context != 'discovery') {
        // The version + platform are passed in the `promo_url` for the
        // discopane promos because when we serve static assets the
        // `?build=<BUILD_ID>` cachebustage kills our querystring.
        data = {version: version, platform: platform};
    }
    $.get(promo_url, data, function(resp) {
        $('.slider', $promos).append($(resp));
        if ($('.panel', $promos).length) {
            // Show promo module only if we have at least panel.
            $promos.trigger('promos_shown', [$promos]);
            $('.persona-preview', $promos).previewPersona(true);
        }
    });
}

$.fn.promoPager = function() {
    $.each(this, function(index, pager) {
        var $dots = $('.dot', pager);
        $dots.click(_pd(function(ev) {
            $('.selected', pager).removeClass('selected');
            setPage(pager, $dots, $dots.index(ev.target));
        }));
    });

    function setPage(pager, dots, pageNum) {
        var offset = -271 * pageNum + 'px';
        dots.eq(pageNum).addClass('selected');
        $(pager).siblings('.pages').css('top', offset);
    }
};

(function() {
    $('#caroline').click(function() {
        dcsMultiTrack('DCS.dcssip', 'addons.mozilla.org',
                      'DCS.dcsuri', '/en-US/firefox/',
                      'WT.ti', 'Link: Firebug',
                      'WT.dl', 99,
                      'WT.z_convert', 'FavoriteAdd-ons'
        );
    });
    $('#jason').click(function() {
        dcsMultiTrack('DCS.dcssip', 'addons.mozilla.org',
                      'DCS.dcsuri', '/en-US/firefox/',
                      'WT.ti', 'Link: DownThemAll!',
                      'WT.dl', 99,
                      'WT.z_convert', 'FavoriteAdd-ons'
        );
    });
    $('#josh').click(function() {
        dcsMultiTrack('DCS.dcssip', 'addons.mozilla.org',
                      'DCS.dcsuri', '/en-US/firefox/',
                      'WT.ti', 'Link: LastPass',
                      'WT.dl', 99,
                      'WT.z_convert', 'FavoriteAdd-ons'
        );
    });

    $('#olympics .view-button a').click(function() {
        dcsMultiTrack('DCS.dcssip', 'addons.mozilla.org',
                      'DCS.dcsuri', '/en-US/firefox/',
                      'WT.ti', 'Link: Flags 2012 Collection',
                      'WT.dl', 99,
                      'WT.z_convert', 'Olympics'
        );
    });
})();
