const terms = [
    "子zi",
    "丑chou",
    "寅yin",
    "卯mao",
    "辰chen",
    "巳si",
    "午wu",
    "未wei",
    "申shen",
    "酉you",
    "戌xu",
    "亥hai"
];

const contents = [
    "【Zi Hour】Midnight, also known as the dead of night or the middle of the night: the first of the twelve traditional Chinese hours. (11:00 PM to 1:00 AM).",

    "【Chou Hour】Cockcrow, also known as the first crow of the rooster: the second of the twelve traditional Chinese hours. (1:00 AM to 3:00 AM).",

    "【Yin Hour】Dawn, also known as Daybreak: The time when night gives way to day. (3:00 AM to 5:00 AM).",

    "【Mao Hour】Sunrise: The period when the sun first appears and begins to rise. (5:00 AM to 7:00 AM).",

    "【Chen Hour】Breakfast Hour: The time for eating breakfast (7:00 AM to 9:00 AM).",

    "【Si Hour】Mid-Morning: The time approaching noon (9:00 AM to 11:00 AM).",

    "【Wu Hour】Noon: Midday (11:00 AM to 1:00 PM).",

    "【Wei Hour】Sun Declining: The sun begins to move westward (1:00 PM to 3:00 PM).",

    "【Shen Hour】Afternoon: (3:00 PM to 5:00 PM).",

    "【You Hour】Sunset: The time when the sun sets (5:00 PM to 7:00 PM).",

    "【Xu Hour】Twilight: Evening when the sky grows dark (7:00 PM to 9:00 PM).",

    "【Hai Hour】Night Rest: People settle down to sleep (9:00 PM to 11:00 PM)."
];

const circle = $("#circle");

let rotation = 0;
const radius = 220;

terms.forEach((term, i) => {
    const angle = (360 / terms.length) * i;

    const item = $(`<div class="item">${term}</div>`);

    item.css("transform", `rotate(${angle}deg) translateX(${radius}px)`);

    circle.append(item);
});

$(window).on("wheel", function (e) {
    const delta = e.originalEvent.deltaY;
    rotation += delta * 0.2;

    $(".item").each(function (i) {
        const baseAngle = (360 / terms.length) * i;
        const total = baseAngle + rotation;

        $(this).css("transform", `rotate(${total}deg) translateX(${radius}px)`);
    });

    updateContent();
});

function updateContent() {
    let closestIndex = 0;
    let minDiff = Infinity;

    $(".item").each(function (i) {
        const baseAngle = (360 / terms.length) * i;
        const total = (baseAngle + rotation) % 360;

        const diff = Math.abs(total);

        if (diff < minDiff) {
            minDiff = diff;
            closestIndex = i;
        }
    });

    $("#content").text(contents[closestIndex]);
    $("#center-label").text(terms[closestIndex]);
}
