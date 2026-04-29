$(".left-nav-box div").click(function () {
    const target = $(this).data("target");

    $("html, body").animate(
        {
            scrollTop: $("#" + target).offset().top - 40
        },
        500
    );
});
