console.clear();  //debug用  console內容清除


//模板資料儲存陣列宣告
let data = [];
let dataUrl = 'https://raw.githubusercontent.com/hexschool/js-training/main/travelAPI-lv1.json';

//透過axios，取得指定連結裡的json資料，並逐個填入模板資料陣列
axios.get(dataUrl)
    .then(response => {
        response.data.forEach(dataItem => {
            data.push(dataItem);
        });

        //須等axios取到資料後，再做基礎畫面渲染
        changeTicket(data);    //執行套票內容替換
        c3DonuteGraph();       //20241117追加，篩選區域c3 Donut圖表更新

    }).catch(error => {      //若取得資料失敗，後續處理方式
        console.log('取得資料失敗');
        console.log(error);
    });


//替換套票內容開始
const ticketCardArea = document.querySelector('.ticketCard-area');  //套票卡片顯示ul
const searchResultCount = document.querySelector('#searchResult-text');  //篩選結果套票數量

//替換套票內容函式
function changeTicket(data){
    let str = "";

    data.forEach(function(item){
        //套票HTML結構建立
        let content = `<li class="ticketCard">
                <div class="ticketCard-img">
                    <a href="#">
                    <img src=${item.imgUrl} alt="">
                    </a>
                    <div class="ticketCard-region">${item.area}</div>
                    <div class="ticketCard-rank">${item.rate}</div>
                </div>
                <div class="ticketCard-content">
                    <div>
                    <h3>
                        <a href="#" class="ticketCard-name">${item.name}</a>
                    </h3>
                    <p class="ticketCard-description">
                        ${item.description}
                    </p>
                    </div>
                    <div class="ticketCard-info">
                    <p class="ticketCard-num">
                        <span><i class="fas fa-exclamation-circle"></i></span>
                        剩下最後 <span id="ticketCard-num"> ${item.group} </span> 組
                    </p>
                    <p class="ticketCard-price">
                        TWD <span id="ticketCard-price">$${item.price}</span>
                    </p>
                    </div>
                </div>
                </li>`;
        str += content;

    });

    //20241030助教建議修正，新增查無資料畫面
    //20241105，將查無資料判斷式移至此處判斷

    if(data.length > 0){
        cantFindAarea.style.display = "none";  //若篩選結果有資料，則隱藏查無資料畫面
        c3Chart.style.display = "block";       //20241117追加，篩選有資料才顯示圖表
    }else{
        cantFindAarea.style.display = "block";  //若篩選結果無資料，則顯示查無資料畫面
        c3Chart.style.display = "none";         //20241117追加，篩選無資料隱藏圖表
    }
    
    ticketCardArea.innerHTML = str;

    
    //20241030助教建議修正，篩選數量改成統一在此渲染
    searchResultCount.textContent = `本次搜尋共 ${data.length} 筆資料`;  //修改搜尋結果筆數
    
}

//20241117新增c3.js圖表，數據格式調整
function c3DonutData(data){
    let dataObj = {};
    data.forEach(item => {
        if(dataObj[item.area] === undefined){
            dataObj[item.area] = 1;
        }else{
            dataObj[item.area] += 1;
        }
    });

    //物件轉陣列方法
    let newDonutData = Object.entries(dataObj);
    //解構賦值(讓後面c3.js圖表底下順序為台北 台中 高雄)
    newDonutData = [newDonutData[1], newDonutData[2], newDonutData[0]];
    return newDonutData
}

//20241117新增c3.js圖表，圖表生成
function c3DonuteGraph(){
    //c3.js Donut圖新增

    let newData = c3DonutData(data); 
    let chart = c3.generate({
        bindto: '#chart',
        data:{
            columns: newData,
            type: 'donut',
            colors: {
                '台北': '#26C0C7',
                '台中': '#5151D3',
                '高雄': '#E68618'
            }
        },
        donut: {
            title: '套票地區比重',
            width: 10,
            label: {
                show: false
            },
        
        },
        size: {
            width: 156,
            height: 180,
        },
        // colors: {
        //     '台北': '#26C0C7',
        //     '台中': '#5151D3',
        //     '高雄': '#E68618'
        // }
    });
}


//changeTicket(data);    //執行套票內容替換 (須等axios取到資料後，再執行)


//替換套票內容結束



//新增套票開始

//上方新增套票各個DOM元素選取宣告
const tripName = document.querySelector('#ticketName');
const imgUrl = document.querySelector('#ticketImgUrl');
const area = document.querySelector('#ticketRegion');
const price = document.querySelector('#ticketPrice');
const group = document.querySelector('#ticketNum');
const rate = document.querySelector('#ticketRate');
const description = document.querySelector('#ticketDescription');
const addBtn = document.querySelector('.addTicket-btn');


//新增套票函式
function addTicket(data){
    let obj = {};   //模板資料物件建立
    obj.id = data.length;
    obj.name = tripName.value;
    obj.imgUrl = imgUrl.value;
    obj.area = area.value;
    obj.price = price.value;
    obj.group = group.value;
    obj.rate = rate.value;
    obj.description = description.value;
    data.push(obj);
}

//20241030助教建議修正
const addTicketForm = document.querySelector('.addTicket-form');
const keyToWordTransform = {
    //套票物件屬性對應欄位名稱
    id: "",
    name: "套票名稱",
    imgUrl: "圖片網址",
    area: "景點地區",
    price: "套票金額",
    group: "套票組數",
    rate: "套票星級",
    description: "套票描述"
}

//表單欄位是否為空值檢查
function checkFormEntry(){
    let lastTicketInfo = data[data.length - 1];  //模板資料最後一筆物件
    let checkFormArray = [];  //屬性轉換名稱暫存陣列
    let checkFormResultStr = "";  //檢查後提醒訊息暫存字串

    //模板資料最後一筆物件，檢查是否有屬性的值為空值
    for(key in lastTicketInfo){
        if(lastTicketInfo[key] === ""){
            checkFormArray.push(keyToWordTransform[key]);
        }
    }

    //如果檢查出有欄位為空值，則將空值欄位資訊加入提醒訊息字串
    //未針對格式做檢查
    if(checkFormArray.length !== 0){
        checkFormArray.forEach(function(key){
            checkFormResultStr += `${key}不可空白\n`
        });
        checkFormResultStr += "請問是否修正？";
        let confirmWindow = confirm(checkFormResultStr);  //彈跳確認視窗訊息提示
        //confirmWindow ? "yes" : "no";
        if(confirmWindow){
            return "yes"
        }else{
            return "no"
        }
    }
}

addBtn.addEventListener('click', function(){
    addTicket(data);       //新增套票函式

    //20241030助教建議修正，新增表單欄位空值確認
    /*
        1.如果表單欄位有空值，則刪除模板資料最新一筆的套票資料，並且不執行後續替換套票
        2.提醒視窗彈出，若選擇確定，則繼續填入表單未填欄位
        3.提醒視窗，若選擇取消，則直接清空表單內容
        4.篩選地區的下拉選單，設定為套票有成功新增才恢復為“全部區域”
    */
    let checkForm = checkFormEntry();
    if(checkForm === "yes" || checkForm == "no"){
        data.pop();
        if(checkForm === "no"){
            addTicketForm.reset();  //20241030助教建議修正，表單欄位清空語法
        }
        return
    }

    
    changeTicket(data);    //替換套票內容函式
    c3DonuteGraph();       //20241117追加，篩選區域c3 Donut圖表更新
    
    regionSearch.value = ""; //若套票新增成功，地區篩選恢復為“全部地區”
    addTicketForm.reset();  //20241030助教建議修正，表單欄位清空語法
});

//新增套票結束



//篩選地區功能開始

const regionSearch = document.querySelector('.regionSearch');
const cantFindAarea = document.querySelector('.cantFind-area');
//20241117追加c3.js圖表放置處元素獲取
const c3Chart =document.querySelector('#chart');

//addEventListener中，change事件代表內容改變時才會觸發後續流程
regionSearch.addEventListener('change', function(){
    let areaFilter = [];   //存放篩選區域的物件資料

    data.forEach(function(item){
        if(regionSearch.value === ""){
            changeTicket(data);
        }else if(regionSearch.value === item.area){
            areaFilter.push(item);
            changeTicket(areaFilter);
        }else if(areaFilter.length === 0 && regionSearch.value !== ""){
            changeTicket(areaFilter);  //若篩選結果為空字串且不是選擇全部區域，則套票資料不顯示
        }
    });
    

    // //20241030助教建議修正，新增查無資料畫面

    // if(areaFilter.length > 0){
    //     cantFindAarea.style.display = "none";  //若篩選結果有資料，則隱藏查無資料畫面
    // }else{
    //     cantFindAarea.style.display = "block";  //若篩選結果無資料，則顯示查無資料畫面
    // }
});

//篩選地區功能結束



//額外功能
const addInfo = document.querySelector('.addInfo');
const infoArray = [tripName, imgUrl, area, price, group, rate, description];
const dataPropertyArray = ['套票名稱', "圖片網址", "景點地區", "套票金額", "套票組數", "套票星級", "套票描述"];
let dataAddCount = 0;

addInfo.addEventListener('click', function(){
    if(dataAddCount === 3){
        dataAddCount = 0;
    }
    
    for(let i = 0; i < 7; i++){
        infoArray[i].value = testData[dataAddCount][dataPropertyArray[i]];
    }
    dataAddCount++;
})

//測試資料簡易懶人包開始
let testData = [
    {
        "套票名稱": 1,
        "圖片網址": "https://images.unsplash.com/photo-1522383225653-ed111181a951?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1655&q=80",
        "景點地區": "台中",
        "套票金額": 5000,
        "套票組數": 10,
        "套票星級": 6,
        "套票描述": "testContent1",
    },
    {
        "套票名稱": 2,
        "圖片網址": "https://images.unsplash.com/photo-1501393152198-34b240415948?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1650&q=80",
        "景點地區": "高雄",
        "套票金額": 6000,
        "套票組數": 20,
        "套票星級": 7,
        "套票描述": "testContent2",
    },
    {
        "套票名稱": 3,
        "圖片網址": "https://images.unsplash.com/photo-1535530992830-e25d07cfa780?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1650&q=80",
        "景點地區": "台北",
        "套票金額": 7000,
        "套票組數": 30,
        "套票星級": 9,
        "套票描述": "testContent3",
    }
];
//測試資料簡易懶人包結束

