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
    "Start of Spring: This marks the end of winter and the arrival of spring, when temperatures rise and all things come back to life.",

    "Rain Water: As temperatures warm, ice and snow melt, and rainfall increases, this solar term is named “Rain Water.”",

    "Start of Insects Awakening: The character “zhe” originally means “to hide,” and animals hibernating are said to “enter hibernation.” The ancients believed that hibernating insects were awakened by spring thunder, hence the name “Start of Insects Awakening.”",

    "Spring Equinox: This day falls exactly halfway through the 90 days of spring, hence the name “Spring Equinox.” Day and night are of equal length, and the balance between cold and warmth is restored; some overwintering crops begin their spring growth phase.",

    "Qingming: This term conveys the meaning of clear weather and the sprouting of plants. As temperatures gradually rise, plants begin to sprout, the earth turns green again, and it is an ideal time for spring plowing and planting.",

    "Guyu: As rainfall increases, it nourishes the fields and promotes the growth of crops, giving rise to the saying, “Rain gives birth to a hundred grains.”",

    "Start of Summer: This marks the beginning of summer and is seen as the start of rising temperatures. At this time, all things grow vigorously and flourish.",

    "Grain Buds: This term refers to the stage when the seeds of summer crops have begun to fill out but are not yet fully mature, hence the name “Grain Buds.”",

    "Grain in Ear: “Mang” refers to the needle-like projections on the husks of certain grass family plants. Grain in Ear signifies that crops with awns, such as wheat, are nearing maturity and can be harvested for seed, also heralding the start of farmers’ busy fieldwork.",

    "Summer Solstice: This is the day with the longest daylight and shortest night of the year, marking the imminent arrival of the hot summer.",

    "Minor Heat: This marks the beginning of the “Three Fervent Periods” (Sanfu), characterized by hot and muggy weather. Although temperatures are high, this is not yet the hottest time of the year, hence the name “Minor Heat.”",

    "Major Heat: This occurs around the middle of the “Three Fervent Periods” and is the hottest time of the year in most parts of China, with the highest temperatures.",

    "Start of Autumn: This heralds the beginning of autumn, with the weather gradually turning cooler. However, the summer heat has not yet fully dissipated, giving rise to the saying of the “autumn tiger”—a period of lingering heat.",

    "End of Summer: This signifies the end of the hot summer days, as the weather transitions from sweltering heat to coolness.",

    "White Dew: As the temperature difference between day and night widens, moisture condenses into white dewdrops on plants and trees, hence the name “White Dew.”",

    "Autumnal Equinox: Similar to the Vernal Equinox, day and night are nearly equal in length, marking the midpoint of autumn.",

    "Cold Dew: As cold air grows stronger and the rainy season ends, temperatures shift from cool to cold, and dew begins to form. In the mornings and at night, the ground cools and dew condenses.",

    "Frost’s Descent: This solar term marks the transition from autumn to winter, with the first frosts beginning to appear.",

    "Start of Winter: This marks the beginning of winter. Fieldwork comes to an end, and crops are harvested and stored.",

    "Minor Snow: The landscape takes on an early winter appearance, though heavy snowfall has not yet begun.",

    "Major Snow: The weather is quite cold at this time; not only does the amount of snowfall increase, but the area covered by snow also expands.",

    "Winter Solstice: In contrast to the Summer Solstice, this is the day with the shortest daylight and the longest night. It marks the start of the “Nine-Nine Countdown”; after the Winter Solstice, daylight begins to lengthen day by day.",

    "Minor Cold: This period falls around the “Third Nine” of the countdown. Most regions experience freezing temperatures, though the cold has not yet reached its peak.",

    "Major Cold: This is the coldest period of the year, signifying an intensification of the severe cold compared to Minor Cold."
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
