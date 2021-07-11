
$('.log-wechat-yey').on('mousemove', function (ev) {
    var left = ev.clientX - 85
    var top = ev.clientY - 170
    $('.log-wechat-yey-img').css({
        top: top + 'px',
        left: left + 'px',
        display: 'block'
    })
})
$('.log-wechat-yey').on('mouseout', function () {
    $('.log-wechat-yey-img').css('display', 'none')
})