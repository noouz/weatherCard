// CWA-3BCDA165-2FE0-4255-8D78-DA64B7039C22 
let cities = [
    ['基隆市', '新北市', '臺北市', '桃園市', '新竹市', '新竹縣', '苗栗縣', '臺中市', '南投縣', '彰化縣', '雲林縣', '嘉義市', '嘉義縣', '臺南市', '高雄市', '屏東縣', '宜蘭縣', '花蓮縣', '臺東縣', '澎湖縣', '金門縣', '連江縣'],
    ['基隆市', '新北市', '臺北市', '桃園市', '新竹市', '新竹縣', '苗栗縣'], ['臺中市', '南投縣', '彰化縣', '雲林縣', '嘉義市', '嘉義縣'],
    ['臺南市', '高雄市', '屏東縣'], ['宜蘭縣', '花蓮縣', '臺東縣'], ['澎湖縣', '金門縣', '連江縣'],
]
let url = 'https://opendata.cwa.gov.tw/api/v1/rest/datastore/F-C0032-001?Authorization=CWA-3BCDA165-2FE0-4255-8D78-DA64B7039C22';

let orgData = {};

const weatherTypes = {
    isClear: [1],
    isCloudy: [2, 3, 4, 5, 6, 7],
    isThunderstorm: [15, 16, 17, 18, 21, 22, 33, 34, 35, 36, 41],
    isFog: [24],
    isCloudyFog: [25, 26, 27, 28],
    isPartiallyClearWithRain: [
        8, 9, 10, 11, 12,
        13, 14, 19, 20, 29, 30,
        31, 32, 38, 39,
    ],
    isSnowing: [23, 37, 42],
};

const weatherIcons = {
    day: [
        'DayClear',
        'DayCloudy',
        'DayThunderstorm',
        'DayFog',
        'DayCloudyFog',
        'DayPartiallyClearWithRain',
        'Snowing',
    ],
    night: [
        'NightClear',
        'NightCloudy',
        'NightThunderstorm',
        'NightFog',
        'NightCloudyFog',
        'NightPartiallyClearWithRain',
        'Snowing',
    ]
};

fetch(url)
    .then(function (response) {
        return response.json();
    })
    .then(function (datas) {
        organizationData(datas);
        arrangeCites(cities[0]);
        locNav();
    });

//按鈕
let toTop = document.querySelector('#toTop');
window.onscroll = function () { scrollFunction() };

let locMenu = document.querySelector('.nav a.loc-menu');
let locMenuIcon = document.querySelector('.nav a.loc-menu span');
let locMenuList1 = document.querySelector('.nav ul.origin');
let locMenuList = document.querySelector('.nav ul.loc-list-hide');
let main = document.querySelector('.main');
let footer = document.querySelector('.footer');
locMenu.addEventListener('click', () => {
    if (locMenuList.classList.contains('show')) {
        locMenuIcon.innerHTML = "menu";
        locMenuList.className = "loc-list loc-list-hide";
        main.className = "main";
        footer.className = "footer";
    } else {
        locMenuIcon.innerHTML = "close";
        locMenuList.className = "loc-list loc-list-hide show";
        main.className = "main of-y";
        footer.className = "footer of-y";
    }
});

//調整視窗時開啟/關閉一些按鈕&清單
function update() {
    if (window.innerWidth >= 700) {
        locMenuIcon.innerHTML = "menu";
        locMenuList1.style.display = 'none';
        locMenuList.className = "loc-list loc-list-hide show";
        main.className = "main";
        footer.className = "footer";
    } else {
        locMenuList.className = "loc-list loc-list-hide";
        main.className = "main";
        footer.className = "footer";
    }
}
window.addEventListener('resize', () => { update() });


function organizationData(data) {
    let locationAll = data.records.location;

    locationAll.forEach(location => {
        let locationName = location.locationName;
        let loc_t0_time = location.weatherElement[0].time[0];
        let startTime = loc_t0_time.startTime;
        let endTime = loc_t0_time.endTime;
        //天氣狀態ex晴時多雲...
        let wxCondition = loc_t0_time.parameter.parameterName;
        let wxConditionValue = loc_t0_time.parameter.parameterValue;
        //溫度
        let minT = location.weatherElement[2].time[0].parameter.parameterName;
        let maxT = location.weatherElement[4].time[0].parameter.parameterName;
        //降雨機率
        let pop = location.weatherElement[1].time[0].parameter.parameterName;
        //舒適度
        let ci = location.weatherElement[3].time[0].parameter.parameterName;

        orgData[locationName] = {
            'wxCondition': wxCondition,
            'minT': minT,
            'maxT': maxT,
            'pop': pop,
            'ci': ci,
            'startTime': startTime,
            'endTime': endTime,
            'wxConditionValue': wxConditionValue,
        }
    })
}

//取得日期
const date = new Date();
const today = date.getDate(); // 日1-31
const month = date.getMonth() + 1; //月0-11 要+1
const day = date.getDay();//星期0-6
const dayName = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
let todayname = dayName[day];

function arrangeCites(nowCities) {
    let cardRegion = document.querySelector('.card-region');
    let startTime = document.querySelector('ul.time .start-time');
    let endTime = document.querySelector('ul.time .end-time');
    cardRegion.innerHTML = '';


    nowCities.forEach((city) => {
        let cityData = orgData[city];
        startTime.innerHTML = cityData.startTime;
        endTime.innerHTML = cityData.endTime;
        let now = Number(startTime.innerHTML[11] + startTime.innerHTML[12]);

        //ICON
        let types = Object.values(weatherTypes);
        let day = Object.values(weatherIcons.day);
        let night = Object.values(weatherIcons.night);

        function findIcon(now) {
            let findIndex = types.findIndex(arr => arr.includes(Number(cityData.wxConditionValue)));
            let result = now[findIndex];
            return result;
        }

        let needIndex;
        if (now > 5 && now < 18) {
            needIndex = findIcon(day);
        } else {
            needIndex = findIcon(night);
        }

        // if(cardRegion.innerHTML === ''){
        //     cardRegion.innerHTML += `<div>目前尚無資料</div>`;
        // }

        cardRegion.innerHTML += `
        <li class="card">
                <div class="title">
                    <h2 class="location">${city}</h2>
                    <span class="condition">${cityData.ci}</span>
                    <div class="day">
                        <span>${month}/${today}</span>
                        <span>${todayname}</span>
                    </div>
                </div>
                <div class="ci">
                    <img src="./img/${needIndex}.png" alt="">
                    <span>${cityData.wxCondition}</span>
                </div>
                <div class="temperature">
                    <span class="material-symbols-outlined">thermostat</span>
                    <span class="tmax">${cityData.maxT}&deg;C</span>
                    <span>/</span>
                    <span class="tmin">${cityData.minT}&deg;C</span>
                </div>
                <div class="pop">
                    <i class="fa-solid fa-cloud-showers-heavy"></i>
                    <span>${cityData.pop}%</span>
                </div>
            </li>
        `;
        let cards = document.querySelectorAll('.card');
        cards.forEach((card) => {
            card.classList.remove('pre-animation');
        });
        
        setTimeout(function () {
            cards.forEach((card) => {
                card.classList.add('pre-animation');
            })
        }, 100)

        
    })

}

function locNav() {
    let locBtn = document.querySelectorAll('ul.loc-list > li ')
    let locList = [];

    locBtn.forEach((item) => {
        item.addEventListener(('click'), () => {
            locBtn.forEach(item => item.classList.remove('now'));
            main.className = "main";
            footer.className = "footer";
            item.classList.add('now');
            locList.splice(0, 1, item);
            if(window.innerWidth <= 700){
                locMenuList.className = "loc-list loc-list-hide";
                locMenuIcon.innerHTML = "menu";
            }

            switch (locList[0].innerText) {
                case '全國地區':
                    arrangeCites(cities[0]);
                    break;
                case '北部地區':
                    arrangeCites(cities[1]);
                    break;
                case '中部地區':
                    arrangeCites(cities[2]);
                    break;
                case '南部地區':
                    arrangeCites(cities[3]);
                    break;
                case '東部地區':
                    arrangeCites(cities[4]);
                    break;
                case '外島地區':
                    arrangeCites(cities[5]);
                    break;
                default:
                    arrangeCites(cities[0]);
                    break;
            }

        })
    })
}



function scrollFunction() {
    if (document.body.scrollTop > 80 || document.documentElement.scrollTop > 80) {
        toTop.style.opacity = "1";
        toTop.style.pointerEvents = "visible";
        toTop.blur();
    } else {
        toTop.style.opacity = "0";
        toTop.style.pointerEvents = "none";
    }
}





