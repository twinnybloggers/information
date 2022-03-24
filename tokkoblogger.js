window.onload = function() {
        jquery();
}

function jquery() {

    var svg_js = document.createElement('script');
    svg_js.src = 'https://blogger.toko-wa.com/static/js/svg.js';
    svg_js.type = 'text/javascript';
    document.head.appendChild(svg_js);
    svg_js.onload = function() {
        svg();
    };


    $(document).on('submit', '.widget-faq-chat', function(e) {
        e.preventDefault();
        $form = $(this);
        if (confirm('Kirim via WhatsApp?')) {
            window.location.href = 'https://api.whatsapp.com/send?phone=' + $_config['admin']['whatsapp'] + '&text=' + $('[name=text]', $form).val() + '%0A%0Avia. ' + location.href;
        }
    });


    $(document).on('click', '[data-backtotop]', function(e) {
        e.preventDefault();
        var $this = $(this);
        var body = $("html, body");
        body.stop().animate({ scrollTop: 0 }, 500, 'swing');
    });

    pop();
    live_review();
    setTimeout(function() {
        live_sales();
    }, 4000);
    lazy_load();
    lightbox();
    timeago();
}

function lazy_load() {
    $('[data-bg]').each(function() {
        var $this = $(this);
        var url = $this.attr('data-bg');
        $this.css('background-image', 'url(' + url + ')').removeAttr('data-bg');
    });
    $('[data-src]').each(function() {

        var $this = $(this);

        var window_height = $(window).height();
        var scroll_top = $(window).scrollTop();
        var window_bottom = scroll_top + window_height;

        var $this_top = $this.offset().top;

        $this.attr('data-offset-top', $this_top);

        var url = $this.attr('data-src');
        var tag_name = $this.prop('tagName').toLowerCase();
        if ($this_top <= window_bottom) {
            if (tag_name == 'img') {
                $this.attr('src', url).on('load', function() {
                    $this.removeAttr('data-src');
                });
            } else if (tag_name == 'iframe') {
                $this.attr('src', url).removeAttr('data-src');
            }
        }

    });

    $(window).on('scroll', function() {

        var window_height = $(window).height();
        var scroll_top = $(window).scrollTop();
        var window_bottom = scroll_top + window_height;

        $('[data-src]').each(function() {
            var $this = $(this);
            var window_height = $(window).height();
            var $this_top = $this.offset().top;

            var url = $this.attr('data-src');
            var tag_name = $this.prop('tagName').toLowerCase();
            if ($this_top <= window_bottom) {
                if (tag_name == 'img') {
                    $this.attr('src', url).on('load', function() {
                        $this.removeAttr('data-src');
                    });
                } else if (tag_name == 'iframe') {
                    $this.attr('src', url).removeAttr('data-src');
                }
            }
        });

    });
}
function live_review() {
    var review = 'https://twinnybloggers.github.io/information/review.js';
    $.getJSON(review, function(data) {
        if (data && data.status == 200) {
            var i = 0;
            $.each(data.result, function(key, value) {
                i++;
                if (i <= 3) {
                    var html5 = '<div class="item flex">\
                        <div class="wrap full">\
                            <div class="profile">\
                                <div class="flex">\
                                    <div class="wrap">\
                                        <img width="60" height="60" data-src="' + value.avatar + '&s=60" alt="' + value.user + '">\
                                    </div>\
                                </div>\
                                <div class="flex">\
                                    <div class="wrap left">\
                                        <h4>\
                                            <a href="' + value.website + '" target="_blank" rel="nofollow noopener noreferrer">\
                                                ' + value.user + '\
                                            </a>\
                                        </h4>\
                                        <div data-rating="' + value.rating + '"></div>\
                                        <small>\
                                            ' + get_timeago(value.timestamp) + '\
                                        </small>\
                                    </div>\
                                </div>\
                            </div>\
                            <br>\
                            <p>\
                                ' + nl2br(value.text) + '\
                            </p>\
                        </div>\
                    </div>';
                    $('.grid-ulasan').prepend(html5);
                }
            });
        }
    });
}

function live_sales() {
    var live_sales = 'https://twinnybloggers.github.io/information/sales.js';
    $.getJSON(live_sales, function(data) {
        if (data) {
            $('body').append('<div id="live_sales"></div>');
            $.each(data.result, function(key, value) {
                var live_sales = $('#live_sales');
                var html5 = '';
                html5 += '<div class="item" id="' + key + '">';
                html5 += '<a class="img" href="' + value.payment_file + '" data-lightbox="payment_file" data-lightbox-title="Bukti Pembayaran dari ' + value.buyer + '" data-lightbox-desc="' + get_timeago(value.timestamp) + '"><img src="' + value.payment_file + '"/></a>';
                html5 += '<div class="info">';
                html5 += '<span class="close">×</span>';
                html5 += '<b>' + value.buyer + '</b>';
                if(value.buyer_city) {
                    html5 += ' dari ' + value.buyer_city;
                }
                html5 += ' telah membeli ';
                html5 += '<a href="' + value.url_checkout + '" target="_blank">' + value.product + '</a>';
                html5 += '<br/><small><time datetime="' + value.timestamp + '"></time></small>';
                html5 += '</div>';
                html5 += '</div>';

                if (!sessionStorage['live_sales_' + key]) {
                    live_sales.append(html5);
                }

            });
            timeago();
            var result_length = data.result.length;
            var result_delay = 6000;
            var result_interval = result_delay * 2;
            var counter = 0;
            function show_result(result_delay) {
                setTimeout(function() {
                    $('#live_sales .item').last().addClass('open');
                    var id = $('#live_sales .item.open').attr('id');
                    sessionStorage['live_sales_' + id] = 1;
                    setTimeout(function() {
                        $('#live_sales .item.open').addClass('opened').removeClass('open');
                        setTimeout(function() {
                            $('#live_sales .item.opened').remove();
                        }, 500);
                    }, result_delay);
                }, 1);
            }
            show_result(result_delay);
            var i = setInterval(function() {
                show_result(result_delay);
                counter++;
                if (counter === result_length - 1) {
                    clearInterval(i);
                }
            }, result_interval);
            $('#live_sales .item .info .close').on('click', function() {
                var item = $(this).closest('.item');
                item.addClass('opened').removeClass('open');
                setTimeout(function() {
                    item.remove();
                }, 500);
            });
        }
    });
}

function get_timeago(t) {
    var e = new Date(t),
        a = 36e5,
        o = 24 * a,
        s = 30 * o,
        i = 365 * o,
        n = "yang lalu",
        l = new Date - e;
    return l < 6e4 ? Math.round(l / 1e3) + " detik " + n : l < a ? Math.round(l / 6e4) + " menit " + n : l < o ? Math.round(l / a) + " jam " + n : l < s ? Math.round(l / o) + " hari " + n : l < i ? Math.round(l / s) + " bulan " + n : Math.round(l / i) + " tahun " + n
}

function timeago() {
    $('[datetime]').each(function() {
        var $this = $(this);
        var data_timeago = $this.attr('datetime');
        $this.attr('title', data_timeago);
        $this.text(get_timeago(data_timeago));
        setInterval(function() {
            $this.text(get_timeago(data_timeago));
        }, 1000);
    });
}

function nl2br(str, is_xhtml) {
    if (typeof str === 'undefined' || str === null) {
        return '';
    }
    var breakTag = (is_xhtml || typeof is_xhtml === 'undefined') ? '<br />' : '<br>';
    return (str + '').replace(/([^>\r\n]?)(\r\n|\n\r|\r|\n)/g, '$1' + breakTag + '$2');
}
function $_GET(sParam) {
    var sPageURL = window.location.search.substring(1),
        sURLVariables = sPageURL.split('&'),
        sParameterName,
        i;
    for (i = 0; i < sURLVariables.length; i++) {
        sParameterName = sURLVariables[i].split('=');

        if (sParameterName[0] === sParam) {
            return sParameterName[1] === undefined ? true : decodeURIComponent(sParameterName[1]);
        }
    }
}
