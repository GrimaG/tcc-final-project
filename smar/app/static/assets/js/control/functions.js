function isolateRGB(color) {
    document.getElementById("progress-bar-img").style.width = "25%";
}

function reduceNoise() {
    document.getElementById("progress-bar-img").style.width = "50%";
}

function otsu() {
    document.getElementById("progress-bar-img").style.width = "75%";
}

function morfology(type) {
    document.getElementById("progress-bar-img").style.width = "100%";
}

var img_set = 1;
function setImage(img_name, img) {
    document.getElementById("img-text-" + img_set).innerHTML = img_name;
    document.getElementById("img-" + img_set).src = img;
    if (img_set == 1) {
        img_set = 2;
    } else {
        img_set = 1;
    }
}

var img_1;
var img_2;
var main_img;
var not_main_img;
var main_width;
var original_width;
var main_height;
var original_height;
var multiply_factor;
var not_main_width;
var not_main_height;


function readURL(event, endpoint) {
    var getImagePath = URL.createObjectURL(event.target.files[0]);
    //console.log(event.target.files[0]); 
    getBase64(event.target.files[0], endpoint);
    $('#' + endpoint).css('background-image', 'url(' + getImagePath + ')');
}

function getBase64(file, endpoint) {
    var reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function () {
        // console.log(reader.result);
        if (endpoint == "img-1" || endpoint == "img-1_2") {
            img_1 = reader.result;
            $('#select-1').css('background-image', 'url(' + img_1 + ')');
        } else {
            img_2 = reader.result;
            $('#select-2').css('background-image', 'url(' + img_2 + ')');
        }
    };
    reader.onerror = function (error) {
        console.log('Error: ', error);
    };
}

function setMain(img, div_img) {
    if (img == 1) {
        main_img = img_1;
        not_main_img = img_2;
        //set atributo borda
        getDimentions('#select-1', '#select-2');
        initCanvas();
        $('#select-1').css('border', '5px solid #73AD21');
        $('#select-2').css('border', '1px solid #bbb');
    } else {
        main_img = img_2;
        not_main_img = img_1;
        getDimentions('#select-2', '#select-1');
        initCanvas();
        $('#select-2').css('border', '5px solid #73AD21');
        $('#select-1').css('border', '1px solid #bbb');
    }
    //setImageOnCanvas();
}

function setMainToSend(img, div_img) {
    if (img == 1) {
        main_img = img_1;
        $('#send-1').css('border', '5px solid #73AD21');
        $('#send-2').css('border', '1px solid #bbb');
    } else {
        main_img = img_2;
        $('#send-2').css('border', '5px solid #73AD21');
        $('#send-1').css('border', '1px solid #bbb');
    }
    //setImageOnCanvas();
}
function getDimentions(id_img, id_secondary_img) {
    var actualImage = new Image();
    actualImage.src = $(id_img).css('background-image').replace(/"/g, "").replace(/url\(|\)$/ig, "");

    var actualImage2 = new Image();
    actualImage2.src = $(id_secondary_img).css('background-image').replace(/"/g, "").replace(/url\(|\)$/ig, "");
   
    original_height = actualImage.height;
    original_width = actualImage.width;
    if (actualImage.width >= actualImage.height){
        main_width = 500;
        main_height = actualImage.height/(actualImage.width/500);
        multiply_factor = actualImage.width/500;
    }else {
        main_height = 500;
        main_width = actualImage.width/(actualImage.height/500);
        multiply_factor = actualImage.height/500;
    }
    if (actualImage2.width >= actualImage2.height){
        not_main_width = 500;
        not_main_height = actualImage2.height/(actualImage2.width/500);
       // multiply_factor = actualImage.width/500;
    }else {
        not_main_height = 500;
        not_main_width = actualImage2.width/(actualImage2.height/500);
       // multiply_factor = actualImage.height/500;
    }
}


function initCanvas() {
   // $('#edit-canvas').remove();
   buildCrop("maincanvas", "myCanvas", true, main_img);
}

var position_cut;
function savePosition(canvas, mousePos) {
    position_cut = mousePos;
    document.getElementById("x").innerHTML = 'X = ' + mousePos.x;
    document.getElementById("y").innerHTML = 'Y = ' + mousePos.y;
}
function getCursorPosition(canvas, event) {
    var rect = canvas.getBoundingClientRect();
    return {
        x: event.clientX - rect.left,
        y: event.clientY - rect.top
    };
}
var qtd_click = 0;
var allowedToDrow = true;
var old_codinates = {
    x: "",
    y: ""
};
function writeLine(canvas, mousePos) {
    if (allowedToDrow) {
        qtd_click += 1;
        if (qtd_click == 2) {

            var ctx = canvas.getContext("2d");

            //corrigindo primeiro problema
            var width_canvas = document.getElementById('edit-canvas').scrollWidth;
            var height_canvas = document.getElementById('edit-canvas').scrollHeight;
            var adapt_x = main_width / width_canvas;
            var adapt_y = main_height / height_canvas;
            /*
             var draw = {
                 x_inicial: old_codinates.x,
                 x_final: mousePos.x,
                 y_inicial: old_codinates.y,
                 y_final: mousePos.y
             }
             */
            var draw = equacaoReta(old_codinates.x * adapt_x, old_codinates.y * adapt_y, mousePos.x * adapt_x, mousePos.y * adapt_y, main_width, main_height);
            ctx.beginPath();
            //ctx.moveTo(draw.x_final, draw.y_final);
            //ctx.lineTo(draw.x_inicial, draw.y_inicial);
            ctx.moveTo(old_codinates.x * adapt_x, old_codinates.y * adapt_y);
            ctx.lineTo( mousePos.x * adapt_x, mousePos.y * adapt_y);
            ctx.lineWidth = 7;
            ctx.strokeStyle = '#ff0000';
            ctx.stroke();

            initCanvas2(draw);
            allowedToDrow = false;
        } else {
            old_codinates = mousePos;
        }
    }
}

function resetCanvas(){
    allowedToDrow = true;
    qtd_click = 0;
    initCanvas();
}


count_new ='';
count_old ='';


function setImageOnCanvas() {
    var canvas = document.getElementById('edit-canvas'),
        context = canvas.getContext('2d');
    make_base(context, canvas);
}

function make_base(context, canvas) {
    base_image = new Image();
    base_image.src = main_img;
    base_image.onload = function () {
        context.drawImage(base_image, 0, 0);

    }

}

function equacaoReta(xa, ya, xb, yb, x_max, y_max) {
    //coeficiente angular da reta
    var m = (yb - ya) / (xb - xa);
    // y - ya = m (x - xa) -> equaçao da reta
    // achar o valor de  y no ponto em que x = 0
    // y = (m*0-m*xa)+ya 
    var y_ini = (m * 0 - m * xa) + ya;
    if(y_ini<0){
        y_ini=0;
    }else {
        if(y_ini>y_max){
            y_ini = y_max;
        }
    }
    // achar y no ponto de extremidade de x
    var y_fim = (m * x_max - m * xa) + ya;

     if(y_fim<0){
        y_fim=0;
    }else {
        if(y_fim>y_max){
            y_fim = y_max;
        }
    }
    //achar o x para o ponto y=0 
    // x = (0-ya+m*xa)/m;
    var x_ini = (y_ini - ya + m * xa) / m;
    // achar o ponto x de extremidade de y
    var x_fim = (y_fim - ya + m * xa) / m;
    return {
        x_inicial: x_ini,
        y_inicial: y_ini,
        x_final: x_fim,
        y_final: y_fim
    };
}

var applyMorphology = [];
function insertMorphology(name){
    applyMorphology.push(name);
    var txt_val='';
    for (element in applyMorphology){
          txt_val += applyMorphology[element] + '<br>'
    }  
    document.getElementById('fillBox').innerHTML = txt_val;
}

function zeroMorphology(){
    applyMorphology = [];
    document.getElementById('fillBox').innerHTML = ""
}

class Transaction{
    constructor(radioValue, noiseLevel, otsuThreshold, applyMorphology , img){
        this.channel= radioValue;
        this.noise= noiseLevel;
        this.otsu = otsuThreshold;
        this.morphology = applyMorphology;
        this.img_old =  img;
    }
}

function send(){
    document.getElementById('jssor_1_div').innerHTML ="";
    document.getElementById('jssor_2_div').innerHTML ="";
    var radioValue = $("input[name='color']:checked").val();
    var noiseLevel = $("#ruido").val();
    img_1 = getBase64FromCanvas("firstCanvas");
    img_2 = getBase64FromCanvas("secondCanvas");
    var otsuThreshold = document.getElementById('otsu').checked;
    var transaction1 = new Transaction(radioValue, noiseLevel, otsuThreshold, applyMorphology , img_1);
    var send_object1 = JSON.stringify(transaction1); 
    var transaction2 = new Transaction(radioValue, noiseLevel, otsuThreshold, applyMorphology , img_2);
    var send_object2 = JSON.stringify(transaction2);
    total_request +=2;
    request("/channel/", send_object1, 2);
    request("/channel/", send_object2, 1);
}
var img_process_1;
var img_process_2;

var counter_data=0;
var total_request = 0;
function request(address, data, nro){
    var xhttp2 = new XMLHttpRequest();
    xhttp2.onreadystatechange = function() {
        if (xhttp2.readyState == XMLHttpRequest.DONE) {
            insertIntocarrousel(xhttp2.responseText, nro);
            if(nro==1){
                img_process_1 = xhttp2.responseText;
            }else{
                img_process_2 = xhttp2.responseText;
            }
            counter_data+=1;
            if(counter_data == total_request){
                loadNext(data);
            }
        }   
    }
    xhttp2.open("POST", address);
    xhttp2.setRequestHeader('Content-Type' , 'application/json');
    xhttp2.send(data);
}

function loadNext(data){
    var req="";
    if(counter_data == 2){
        total_request +=2;
        req = "/noise/";
        console.log("ruido");
        
    }
    if(counter_data==4){
        if(document.getElementById('otsu').checked){
         total_request +=2;
         req = "/otsu/";
         console.log("otsu");
        }
    }
    if(counter_data==6){
        if(applyMorphology.length>0){
            total_request +=2;
            req = "/morphologys/";
            console.log("morphology");
        }
         
    }
    if(req!=""){
        var tmp_data = JSON.parse(data);
        tmp_data.img_old = img_1;
        data = JSON.stringify(tmp_data);
        request(req, data, 2);
        tmp_data.img_old = img_2;
        data = JSON.stringify(tmp_data);
        request(req, data, 1);
    }else{
        counter_data = 0;
        total_request = 0;
        loadCarroussel();
        countpxl(count_old, count_new);
    }

}
function loadCarroussel(){
 var jssor_1_options = {
        $AutoPlay: true,
        $ArrowNavigatorOptions: {
            $Class: $JssorArrowNavigator$
        },
        $ThumbnailNavigatorOptions: {
            $Class: $JssorThumbnailNavigator$,
            $Cols: 9,
            $SpacingX: 3,
            $SpacingY: 3,
            $Align: 260
        }
    };

 var jssor_1_slider = new $JssorSlider$("jssor_1", jssor_1_options);

            /*responsive code begin*/
            /*remove responsive code if you don't want the slider scales while window resizing*/
    function ScaleSlider() {
        var refSize = jssor_1_slider.$Elmt.parentNode.clientWidth;
        if (refSize) {
            refSize = Math.min(refSize, 600);
            jssor_1_slider.$ScaleWidth(refSize);
        }
        else {
            window.setTimeout(ScaleSlider, 30);
        }
    }
    ScaleSlider();
    $(window).bind("load", ScaleSlider);
    $(window).bind("resize", ScaleSlider);
    $(window).bind("orientationchange", ScaleSlider);
            /*responsive code end*/
    var jssor_2_slider = new $JssorSlider$("jssor_2", jssor_1_options);

    /*responsive code begin*/
    /*remove responsive code if you don't want the slider scales while window resizing*/
    function ScaleSlider2() {
        var refSize = jssor_2_slider.$Elmt.parentNode.clientWidth;
        if (refSize) {
            refSize = Math.min(refSize, 600);
            jssor_2_slider.$ScaleWidth(refSize);
        }
        else {
            window.setTimeout(ScaleSlider2, 30);
        }
    }
    ScaleSlider2();
    $(window).bind("load", ScaleSlider2);
    $(window).bind("resize", ScaleSlider2);
    $(window).bind("orientationchange", ScaleSlider2);
    /*responsive code end*/
    /*Fechar modal */ 
    closeModal();

}

function insertIntocarrousel(img, nro){
    document.getElementById('jssor_'+nro +'_div').innerHTML += '<div><img data-u="image" src="'+ img + '" /><img data-u="thumb" src="'+ img + '" /></div>';
    if(nro==1){
        count_old =img;
    }else{
        count_new =img;
    }
}

function closeModal(){
    $("#second").show()
    window.location.href =  "#close";
}

function nextStep(actual,next){
    $('.' + actual).css('display', 'none');
    $('.' + next).css('display', 'block');
}

santarem = [
    {
        title : "26/05/2011",
        img : "../../static/assets/barragens/cr-alto/santarem/2011-05-26.jpg"
    },
    {
        title : "05/09/2011",
        img : "../../static/assets/barragens/cr-alto/santarem/2011-09-05.jpg"
    },
    {
        title : "02/10/2011",
        img : "../../static/assets/barragens/cr-alto/santarem/2011-10-02.jpg"
    },
    {
        title : "08/05/2013",
        img : "../../static/assets/barragens/cr-alto/santarem/2013-05-08.jpg"
    },
    {
        title : "11/08/2015",
        img : "../../static/assets/barragens/cr-alto/santarem/2014-08-11.jpg"
    },
    {
        title : "21/07/2015",
        img : "../../static/assets/barragens/cr-alto/santarem/2015-07-21.jpg"
    },
    {
        title : "10/11/2015",
        img : "../../static/assets/barragens/cr-alto/santarem/2015-11-10.jpg"
    },
    {
        title : "26/04/2016",
        img : "../../static/assets/barragens/cr-alto/santarem/2016-04-26.jpg"
    },
    {
        title : "19/06/2016",
        img : "../../static/assets/barragens/cr-alto/santarem/2016-06-19.jpg"
    }
];

fundao = [
    {
        title : "26/05/2011",
        img : "../../static/assets/barragens/cr-alto/fundao/2011-05-26.jpg"
    },
    {
        title : "08/05/2013",
        img : "../../static/assets/barragens/cr-alto/fundao/2013-05-08.jpg"
    },
    {
        title : "11/08/2014",
        img : "../../static/assets/barragens/cr-alto/fundao/2014-08-11.jpg"
    },
    {
        title : "21/07/2015",
        img : "../../static/assets/barragens/cr-alto/fundao/2015-07-21.jpg"
    },
    {
        title : "10/11/2015",
        img : "../../static/assets/barragens/cr-alto/fundao/2015-11-10.jpg"
    }
];
function selectImg(option) {
    var listOfImg = [];
    if(option == "select-img") {
        nextStep("choose-option","select-img");
    }else{
        //monta a tela
        if (option == "santarem"){
            listOfImg = santarem;
        }else if (option == "fundao"){
            listOfImg = fundao;
        }else if (option =="germano"){
            listOfImg = fundao;
        }
        count = 0;
        nextStep("choose-option","list-imgs");
        listOfImg.forEach(element => {
            count ++;
            $('#list').append(
                '<div  class="item-div" ><img id="' + count +'" onclick="selectImgOnClick(this);" class="item-img" src="'+ element.img + '" /> <div class="title-img">' + element.title +'</div></div>'
            );
        });

        //vai pra tela
        nextStep("choose-option","list-imgs");
    }
}

twoImgSelected = [];
lastImgSelected = {};
function selectImgOnClick(element){
    if(twoImgSelected.length<1){
        img_1 = $(element).attr('src');
        $(element).css('border', '5px solid #73AD21');
        $('#img-1').css('background-image', 'url(' + $(element).attr('src') + ')');
        $('#select-1').css('background-image', 'url(' + $(element).attr('src') + ')');

    }else{
        img_2 = $(element).attr('src');
        $(element).css('border', '5px solid #73AD21');
        $('#img-2').css('background-image', 'url(' + $(element).attr('src') + ')');
        $('#select-2').css('background-image', 'url(' + $(element).attr('src') + ')');


        nextStep("list-imgs","choose-recent");
       // $(element).css('border', '5px solid #73AD21');
       // $('#' + twoImgSelected[0].img).css('border', '1px solid #bbb');
       // twoImgSelected = [];
       // twoImgSelected.push(lastImgSelected);
    }
    twoImgSelected.push({
        img: $(element).attr('id'),
        title: $(element).attr('src')
    });
    lastImgSelected = {
        img: $(element).attr('id'),
        title: $(element).attr('src')
    };
}



function buildCrop(location, id, isPrimary, image) {

    var condition = 1;
    var points = [];//holds the mousedown points

    var canvas = document.createElement('canvas');
    canvas.id = "myCanvas";
    canvas.width = main_width;
    canvas.height = main_height;
    canvas.style.position = "relative";
    var body = document.getElementById('maincanvas');
    body.appendChild(canvas);

    var canvas = document.getElementById('myCanvas');
    this.isOldIE = (window.G_vmlCanvasManager);
    $(function() {
      //  if (document.domain == 'localhost') {

            if (this.isOldIE) {
                G_vmlCanvasManager.initElement(myCanvas);
            }
            var ctx = canvas.getContext('2d');
            var imageObj = new Image();



            function init() {
                canvas.addEventListener('mousedown', mouseDown, false);
                canvas.addEventListener('mouseup', mouseUp, false);
                canvas.addEventListener('mousemove', mouseMove, false);
            }

            // Draw  image onto the canvas
            imageObj.onload = function() {
                ctx.drawImage(imageObj, 0, 0,main_width, main_height);

            };
            imageObj.src = main_img;



            // Switch the blending mode
            ctx.globalCompositeOperation = 'destination-over';

            //mousemove event
            $('#myCanvas').mousemove(function(e) {
                if (condition == 1) {

                    ctx.beginPath();

                    $('#posx').html(e.offsetX);
                    $('#posy').html(e.offsetY);
                }
            });
            //mousedown event
            $('#myCanvas').mousedown(function(e) {
                if (condition == 1) {

                    var width_canvas = document.getElementById('myCanvas').scrollWidth;
                    var height_canvas = document.getElementById('myCanvas').scrollHeight;
                    var adapt_x = original_width / width_canvas;
                    var adapt_y = original_height / height_canvas;
                    console.log("posit x = " + e.offsetX + " e y = " + e.offsetY);
                    if (e.which == 1) {
                        var pointer = $('<span class="spot">').css({
                            'position': 'absolute',
                            'background-color': '#000000',
                            'width': '5px',
                            'height': '5px',
                            'top': e.pageY,
                            'left': e.pageX


                        });
                        //store the points on mousedown
                        points.push(e.pageX, e.pageY);

                        //console.log(points);

                        ctx.globalCompositeOperation = 'destination-out';
                        var oldposx = $('#oldposx').html();
                        var oldposy = $('#oldposy').html();
                        var posx = $('#posx').html();
                        var posy = $('#posy').html();
                        ctx.beginPath();
                        ctx.moveTo(oldposx, oldposy);
                        if (oldposx != '') {
                            ctx.lineTo(posx, posy );

                            ctx.stroke();
                        }
                        $('#oldposx').html(e.offsetX);
                        $('#oldposy').html(e.offsetY);
                    }
                    $(document.body).append(pointer);
                    $('#posx').html(e.offsetX);
                    $('#posy').html(e.offsetY);
                }//condition
            });

            $('#crop').click(function() {
                condition = 0;

                //  var pattern = ctx.createPattern(imageObj, "repeat");
                //ctx.fillStyle = pattern;
                $('.spot').each(function() {
                    $(this).remove();

                })
                //clear canvas

                //var context = canvas.getContext("2d");

                ctx.clearRect(0, 0, main_width, main_height);
                ctx.beginPath();
                ctx.width = main_width;
                ctx.height = main_height;
                ctx.globalCompositeOperation = 'destination-over';
                //draw the polygon
                setTimeout(function() {


                    //console.log(points);
                    var offset = $('#myCanvas').offset();
                    //console.log(offset.left,offset.top);


                    for (var i = 0; i < points.length; i += 2) {
                        var x = parseInt(jQuery.trim(points[i]));
                        var y = parseInt(jQuery.trim(points[i + 1]));


                        if (i == 0) {
                            ctx.moveTo(x - offset.left, y - offset.top);
                        } else {
                            ctx.lineTo(x - offset.left, y - offset.top);
                        }
                        //console.log(points[i],points[i+1])
                    }

                    if (this.isOldIE) {

                        ctx.fillStyle = '';
                        ctx.fill();
                        var fill = $('fill', myCanvas).get(0);
                        fill.color = '';
                        fill.src = element.src;
                        fill.type = 'tile';
                        fill.alignShape = false;
                    }
                    else {
                        var pattern = ctx.createPattern(imageObj, "repeat");
                        ctx.fillStyle = pattern;
                        ctx.fill();

                        var dataurl = canvas.toDataURL("image/png");


                        //upload to server (if needed)
                        var xhr = new XMLHttpRequest();
                        // // 
                        xhr.open('POST', 'upload.php', false);
                        xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
                        var files = dataurl;
                        var data = new FormData();
                        var myprod = $("#pid").val();
                        data = 'image=' + files;
                        xhr.send(data);
                        if (xhr.status === 200) {
                            console.log(xhr.responseText);
                            $('#myimg').html('<img src="upload/' + xhr.responseText + '.png"/>');
                        }

                    }
                }, 20);

            });

       // }
    });

    var primarycanvas = document.createElement('canvas');
    primarycanvas.id = "firstCanvas";
    primarycanvas.width = not_main_width;
    primarycanvas.height = not_main_height;
    primarycanvas.style.position = "relative";
    var body = document.getElementById("secondarycanvas");
    body.appendChild(primarycanvas);


    var secondarycanvas = document.createElement('canvas');
    secondarycanvas.id = "secondCanvas";
    secondarycanvas.width = not_main_width;
    secondarycanvas.height = not_main_height;
    secondarycanvas.style.position = "relative";
    var body = document.getElementById("secondarycanvas");
    body.appendChild(secondarycanvas);
    var secondarycanvas = document.getElementById("secondCanvas");
    var primarycanvas = document.getElementById("firstCanvas");
    var ctx1 = primarycanvas.getContext('2d');
    var ctx2 = secondarycanvas.getContext('2d');
    var imageObj1 = new Image();
    var imageObj2 = new Image();
      // Draw  image onto the canvas
      imageObj1.onload = function() {
        ctx1.drawImage(imageObj1, 0, 0,main_width, main_height);

    };
    imageObj1.src = main_img;

    // Draw  image onto the canvas
    imageObj2.onload = function() {
        ctx2.drawImage(imageObj2, 0, 0,not_main_width, not_main_height);

    };
    imageObj2.src = not_main_img;
};

function removeSpot(){
    $('.spot').remove();
}

function getBase64FromCanvas(canvas){
    return document.getElementById(canvas).toDataURL("image/jpeg");
}

function countpxl(old_img, new_img){
    data = {
        img_old: old_img,
        img_new: new_img
    }
    var xhttp2 = new XMLHttpRequest();
    xhttp2.onreadystatechange = function() {
        if (xhttp2.readyState == XMLHttpRequest.DONE) {
            $("#img-grow").html( "Diferença de " + (parseFloat(xhttp2.responseText*100)).toFixed(2) + "%" );
        }   
    }
    xhttp2.open("POST", "/countPixels/");
    xhttp2.setRequestHeader('Content-Type' , 'application/json');
    var json = JSON.stringify(data);
    xhttp2.send(json);
}