const terms = [
    "立春 the Beginning of Spring",
    "雨水 Rain Water",
    "惊蛰 the Waking of Insects",
    "春分 the Spring Equinox",
    "清明 Pure Brightness",
    "谷雨 Grain Rain",
    "立夏 the Beginning of Summer",
    "小满 Lesser Fullness of Grain",
    "芒种 Grain in Beard",
    "夏至 the Summer Solstice",
    "小暑 Lesser Heat",
    "大暑 Greater Heat",
    "立秋 the Beginning of Autumn",
    "处暑 the End of Heat",
    "白露 White Dew",
    "秋分 the Autumn Equinox",
    "寒露 Cold Dew",
    "霜降 Frost's Descent",
    "立冬 the Beginning of Winter",
    "小雪 Lesser Snow",
    "大雪 Greater Snow",
    "冬至 the Winter Solstice",
    "小寒 Lesser Cold",
    "大寒 Greater Cold"
];

const contents = [
    "the Beginning of Spring: This marks the end of winter and the arrival of spring, when temperatures rise and all things come back to life.",

    "Rain Water: As temperatures warm, ice and snow melt, and rainfall increases, this solar term is named “Rain Water.”",

    "the Waking of Insects: The character “zhe” originally means “to hide,” and animals hibernating are said to “enter hibernation.” The ancients believed that hibernating insects were awakened by spring thunder, hence the name.",

    "the Spring Equinox: This day falls exactly halfway through the 90 days of spring. Day and night are of equal length, and balance is restored.",

    "Pure Brightness: This term conveys clear weather and sprouting plants. It is ideal for spring plowing and planting.",

    "Grain Rain: Rainfall increases and nourishes crops, giving rise to the saying “Rain gives birth to a hundred grains.”",

    "the Beginning of Summer: This marks the start of summer, when all things grow vigorously.",

    "Lesser Fullness of Grain: Seeds begin to fill but are not fully mature.",

    "Grain in Beard: Crops like wheat near maturity and can be harvested.",

    "the Summer Solstice: The longest day and shortest night of the year.",

    "Lesser Heat: Marks the beginning of hot and humid weather, but not yet the hottest.",

    "Greater Heat: The hottest time of the year in most regions.",

    "the Beginning of Autumn: Weather begins to cool, though heat still lingers.",

    "the End of Heat: The transition from hot summer to cooler weather.",

    "White Dew: Moisture condenses into dew as temperature differences increase.",

    "the Autumn Equinox: Day and night are nearly equal, marking mid-autumn.",

    "Cold Dew: Temperatures drop and dew begins to form.",

    "Frost's Descent: Marks the transition to winter with first frosts.",

    "the Beginning of Winter: Fieldwork ends and harvests are stored.",

    "Lesser Snow: Early winter appearance without heavy snowfall.",

    "Greater Snow: Snowfall increases and spreads widely.",

    "the Winter Solstice: The shortest day and longest night; daylight begins increasing.",

    "Lesser Cold: Cold intensifies but is not yet at its peak.",

    "Greater Cold: The coldest period of the year."
];

const circle = $("#circle");

let rotation = 0;
const radius = 220;

// 创建圆
terms.forEach((term, i) => {
    const angle = (360 / terms.length) * i;

    const item = $(`<div class="item">${term}</div>`);

    item.css("transform", `rotate(${angle}deg) translateX(${radius}px)`);

    circle.append(item);
});

// 滚轮控制旋转
$(window).on("wheel", function (e) {
    const delta = e.originalEvent.deltaY;

    rotation += delta * 0.2; // 控制旋转速度

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
