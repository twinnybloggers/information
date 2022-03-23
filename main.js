window.onload = function() {
        jquery();
}

function jquery() {
    if($_GET('aff')) {
        var aff_id = $_GET('aff');
        $.getJSON('https://member.kangrian.net/api/aff-click?id='+aff_id, function(data) {
            console.log(data); 
        });
    }

    $(document).on('submit', '.widget-faq-chat', function(e) {
        e.preventDefault();
        $form = $(this);
        if (confirm('Kirim via WhatsApp?')) {
            window.location.href = 'https://api.whatsapp.com/send?phone=' + $_config['admin']['whatsapp'] + '&text=' + $('[name=text]', $form).val() + '%0A%0Avia. ' + location.href;
        }
    });

    var scroll_top = $(window).scrollTop();

    if (scroll_top > 0) {
        $('header').addClass('toggle');
    } else {
        $('header').removeClass('toggle');
    }

    $(document).on('click', '[href*="#"]', function(e) {
        e.preventDefault();

        var $this = $(this);

        var target_id = $this.prop('hash');
        var header_height = $('header').height();
        var target_offset = $(target_id).offset().top - header_height;

        var body = $("html, body");
        body.stop();
        setTimeout(function() {
            body.animate({ scrollTop: target_offset }, 500, 'swing');
        }, 1);
    });

    $(window).on('scroll', function() {
        var window_height = $(window).height();
        var scroll_top = $(window).scrollTop();
        if (scroll_top > 0) {
            $('header').addClass('toggle');
        } else {
            $('header').removeClass('toggle');
        }
        if (scroll_top > window_height) {
            $('[data-backtotop]').addClass('toggle');
        } else {
            $('[data-backtotop]').removeClass('toggle');
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

function pop() {
    $('[id*="pop-"]').each(function() {
        var $this = $(this),
            $id = $this.attr('id'),
            $pop_title = $this.attr('data-pop-title'),
            $pop_width = $this.attr('data-pop-width'),
            $pop_height = $this.attr('data-pop-height');
        $this.wrap('<div class="pop"></div>');
        $this.wrap('<div class="pop-wrap"></div>');
        $this.addClass('pop-content');
        var header = '\
            <header class="pop-header">\
                <div class="pop-title">\
                    <h3>\
                        ' + $pop_title + '\
                    </h3>\
                </div>\
                <div class="pop-close">\
                    <div>×</div>\
                </div>\
            </header>\
        ';
        $this.closest('.pop-wrap').prepend(header);
        if ($pop_width) {
            $this.closest('.pop-wrap').css('width', $pop_width);
        }
    });
    $('.pop-close').on('click', function() {
        $(this).closest('.pop').removeClass('open');
        $('body').removeClass('pop-open');
    });
    $(document).on('click', '[target*="pop-"]', function(e) {
        e.preventDefault();
        var $this = $(this),
            pop_id = $this.attr('target'),
            pop_title = $this.attr('data-pop-title'),
            pop_width = $this.attr('data-pop-width'),
            pop_height = $this.attr('data-pop-height');


        $this.closest('.pop').removeClass('open');
        $('body').removeClass('pop-open');

        if ($('#' + pop_id).length) {

            $('body').addClass('pop-open');
            $('#' + pop_id).closest('.pop').addClass('open');

            $('[data-src]').each(function() {
                var data_src = $(this).attr('data-src');
                $(this).attr('src', data_src).removeAttr('data-src');
            });
        }

    });
    $(document).on('click', '.pop.open', function() {
        $(this).find('.pop-close').trigger('click');
    });
    $(document).on('click', '.pop-wrap', function(e) {
        e.stopPropagation();
    });
}

function lightbox() {
    var format = '\
        <div id="lightbox">\
            <div class="lb-wrap">\
                <figure>\
                    <div class="lb-img">\
                        <div class="lb-count"></div>\
                    </div>\
                    <nav class="lb-nav">\
                        <div class="lb-np lb-prev"></div>\
                        <div class="lb-close"></div>\
                        <div class="lb-np lb-next"></div>\
                    </nav>\
                </figure>\
            </div>\
        </div>\
    ';
    $(format).appendTo('body');

    $('[data-lightbox]').each(function() {
        var id = $(this).attr('data-lightbox');
        var id_length = $('[data-lightbox=' + id + ']').length;
        if (id_length > 1) {
            $('[data-lightbox=' + id + ']').each(function(i) {
                $(this).attr('data-lightbox-index', (i + 1) + ' / ' + id_length);
            });
        }
    });
    $(document).on('click', '[data-lightbox]', function(e) {
        e.preventDefault();
        var $this = $(this);
        var id = $this.attr('data-lightbox');
        var index = $this.attr('data-lightbox-index');
        var title = $this.attr('data-lightbox-title');
        var desc = $this.attr('data-lightbox-desc');
        var url = $this.attr('href');

        $('#lightbox').scrollTop(0);
        $('#lightbox .lb-close').hide();
        $('#lightbox .lb-wrap figure .lb-img img').remove();
        $('#lightbox .lb-count').hide();
        $('#lightbox .lb-wrap figure figcaption').remove();
        $('#lightbox .lb-np').hide();

        if (url) {
            $('#lightbox .lb-wrap figure').addClass('loading');
            $('#lightbox .lb-wrap figure .lb-img').prepend('<img data-src="' + url + '"/>');
            $('#lightbox .lb-wrap figure .lb-img img').attr('src', url).on('load', function() {

                $(this).removeAttr('data-src');

                $('#lightbox .lb-wrap figure').removeClass('loading');

                if (title || desc) {
                    $('#lightbox .lb-wrap figure').append('<figcaption></figcaption>');
                }
                if (title) {
                    $('#lightbox .lb-wrap figure figcaption').append('<h4>' + title + '</h4>');
                }
                if (desc) {
                    $('#lightbox .lb-wrap figure figcaption').append('<p>' + desc + '</p>');
                }

                if (index) {
                    $('#lightbox .lb-count').html(index).show();
                }

                $('#lightbox .lb-np').show();

                if ($this.prev('[data-lightbox="' + id + '"]').length) {
                    var click_url = $this.prev('[data-lightbox="' + id + '"]').attr('href');
                    $('#lightbox .lb-np.lb-prev').attr('data-id', id).attr('data-url', click_url).show();
                } else {
                    $('#lightbox .lb-np.lb-prev').hide();
                }
                if ($this.next('[data-lightbox="' + id + '"]').length) {
                    var click_url = $this.next('[data-lightbox="' + id + '"]').attr('href');
                    $('#lightbox .lb-np.lb-next').attr('data-id', id).attr('data-url', click_url).show();
                } else {
                    $('#lightbox .lb-np.lb-next').hide();
                }

                $('#lightbox .lb-close').show();

            });
        }
        $('#lightbox').addClass('open');
        $('body').addClass('lightbox_open');
    });
    $('#lightbox .lb-np.lb-prev, #lightbox .lb-np.lb-next').on('click', function(e) {
        e.stopPropagation();
        var url = $(this).attr('data-url');
        var id = $(this).attr('data-id');
        $('[href="' + url + '"][data-lightbox="' + id + '"]').trigger('click');
    });
    $('#lightbox').click(function() {
        $('#lightbox').removeClass('open');
        $('body').removeClass('lightbox_open');
    });
    $('#lightbox .lb-wrap').on('click', function(e) {
        e.stopPropagation();
    });
    $('#lightbox .lb-close').on('click', function(e) {
        e.stopPropagation();
        $('#lightbox').removeClass('open');
        $('body').removeClass('lightbox_open');
    });
    $(document).on('keydown', function(e) {

        var code = (e.keyCode || e.which);
        var left = 37;
        var up = 38;
        var right = 39;
        var down = 40;
        var enter = 13;

        if (e.key === 'Escape') {
            $('#lightbox').removeClass('open');
            $('body').removeClass('lightbox_open');
        }
        if (code === left) {
            $('#lightbox .lb-np.lb-prev:visible').trigger('click');
        }
        if (code === right) {
            $('#lightbox .lb-np.lb-next:visible').trigger('click');
        }
        if (code === up) {
            $('#lightbox').scrollTop(0);
        }
        if (code === down) {
            var lb_height = $('#lightbox').height();
            $('#lightbox').scrollTop(lb_height);
        }
    });
}

function live_review() {

    var review = 'https://member.kangrian.net/api/review';

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

    var live_sales = 'https://member.kangrian.net/api/sales';

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

function rupiah(angka) {
    var rupiah = '';
    var angkarev = angka.toString().split('').reverse().join('');
    for (var i = 0; i < angkarev.length; i++)
        if (i % 3 == 0) rupiah += angkarev.substr(i, 3) + '.';
    return 'Rp ' + rupiah.split('', rupiah.length - 1).reverse().join('');
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
