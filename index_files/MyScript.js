$(document).ready(function () {
    
    $("#nav").menu();

    $("#PasGac").click(function () {
        $("#Panel3").dialog("open");
        return false;
    });

    $(function () {

        $("#dialog-confirm").dialog({

            resizable: false,

            height: 400,
            width:750,
            modal: true,

            buttons: {

                "დიახ": function () {

                    $(this).dialog("close");
                    KitxvariMag("1");

                },

                "არა": function () {

                    $(this).dialog("close");
                    KitxvariMag("0")
                }

            }

        });

    });


   
    $("#Panel3").dialog({

        title: "პასუხის გაცემა",
        dialogClass: 'DynamicDialogStyle',
        bgiframe: true,
        autoOpen: false,
        resizable: true,
        draggable: true,
        modal: true,

        open: function (type, data) {
            $(this).parent().appendTo("body");
        },
        captionButtons: {
            refresh: { visible: true }
        },

        width: 500,
        height: 400,

    });

    //alert("");

    //$(".dfg").click(function () {
    //    $("#CerDacera").dialog("close");
    //    return false;
    //});
    //jQuery("#CerDacera").parent().appendTo(jQuery("form:first"));
    $(".but").button();
    $(".dfg").button();
    
    $("#OpenMy").click(function () {
        $("#CerDacera").dialog("open");
        return false;
    });
   
    $("#" + $("#Hidden1").val()).change(function () {
        if ($("#" + $("#Hidden1").val()).val() == "20") {
            $("#divShow").show();
        }
        else {
            $("#divShow").hide();
        }
    });
    $("#SendButton").click(function () {
        
        var name = $("#" + $("#Hidden1").val()).val();
        if (name == "-1") {
            alert("აირჩიეთ კატეგორია");
        }
        var surname = $("#" + $("#Hidden2").val()).val();
        if (surname.length < 5) {
            alert("ანოტაციაში სიმბოლოების რაოდენობა უნდა აღემატებოდეს 4");
        }
    
        var age = $("#" + $("#Hidden3").val()).val();
        if (age.length < 6) {
            alert("ფაქტობრივ მისამართში სიმბოლოების რაოდენობა უნდა აღემატებოდეს 5");
        }
        var age1 = $("#" + $("#Hidden4").val()).val();
        if (age1.length < 6) {
            alert("ტელეფონის ნომერი უნდა შეიცავდეს მხოლოდ ციფრებს და სიმბოლოების რაოდენობა უნდა აღემატებოდეს 5");
        }
        var subject = "-1";
        if ($("#divShow").is(":visible")) {
            subject = $("#" + $("#Hidden5").val()).val();
            //alert("Object ok");
        }
        var appointment = { docSaxe: name, corepTex: surname, addres: age, tell: age1 ,Subj:subject}
        if (name != "-1" && surname.length > 4 && age.length > 5 && age1.length > 5) {
            $.ajax({
                type: 'POST',
                url: 'http://sms.tsu.ge/sms/Students/Helpers/SmsService.asmx/insertCorespond',
                data: JSON.stringify(appointment),
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function (msg) {
                    if (msg.d) {
                        alert("წერილი წარმატებით გაიგზავნა");
                        $("#CerDacera").dialog("close");
                        
                    }
                },
                error: function () {
                    $.ajax({
                        type: 'POST',
                        url: 'https://sms.tsu.ge/sms/Students/Helpers/SmsService.asmx/insertCorespond',
                        data: JSON.stringify(appointment),
                        contentType: "application/json; charset=utf-8",
                        dataType: "json",
                        success: function (msg) {
                            if (msg.d) {
                                alert("წერილი წარმატებით გაიგზავნა");
                                $("#CerDacera").dialog("close");

                            }
                        },
                        error: function () {
                            alert("Error! Try again...");
                        }
                    });
                }
            });
        }

    });
    
    //$("#Kitxv").click(function () {
    //    $("#SenDascreba").dialog("open");
    //   // alert("");
    //    //return false;
    //});
    $("#saveK").click(function () {
        var appointment = { kitxva1: $("#kitxva1").val(), kitxva2: $("#kitxva2").val(), kitxva3: $("#kitxva3").val() }
        $.ajax({
            type: 'POST',
            url: 'http://sms.tsu.ge/sms/Students/Helpers/SmsService.asmx/insertKitxvari',
            data: JSON.stringify(appointment),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (msg) {
                if (msg.d) {
                    alert("წერილი წარმატებით გაიგზავნა" + JSON.stringify(msg));
                    $("#kitxvar").dialog("close");

                }
            },
            error: function () {
                alert("Error! Try again...");
            }
        });
    });

    $("#CerDacera").dialog({

        title: "წერილის გაგზავნა",
        dialogClass: 'DynamicDialogStyle',
        bgiframe: true,
        autoOpen: false,
        resizable: true,
        draggable: true,
        modal: true,

        open: function (type, data) {
            $(this).parent().appendTo("body");
        },
        captionButtons: {
            refresh: { visible: true }
        },
        width: 900,
        height: 600,

    });

    $("#ShoKitxvar").dialog({

        title: "dialog",
        dialogClass: 'DynamicDialogStyle',
        bgiframe: true,
        autoOpen: false,
        resizable: true,
        draggable: true,
        modal: true,

        open: function (type, data) {
            $(this).parent().appendTo("body");
        },
        captionButtons: {
            refresh: { visible: true }
        },
        width: 900,
        height: 600

    });

    $("#Shepof").click(function () {
        $("#ShoKitxvar").dialog("close");
    });
    
    //$("#ShepOp").click(function () {
    //    window.open('http://sms.tsu.ge/sms/Students/Quiz/Quiz3.aspx', '_blank');
    //    $("#ShoKitxvar").dialog("close");
    //});

    if ($("#kv").val() == "1") {
       
        $("#ShoKitxvar").dialog("open");
    }

   



    $("#ShepOp2").click(function () {
        //window.location = "/sms/Students/Quiz/Quiz2.aspx"

        var appointment = { kitxva1: "0", kitxva2: "2", kitxva3: "3" }
        $.ajax({
            type: 'POST',
            url: 'http://sms.tsu.ge/sms/Students/Helpers/SmsService.asmx/insertKitxvari',
            data: JSON.stringify(appointment),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (msg) {
                if (msg.d) {
                   // alert("წერილი წარმატებით გაიგზავნა" + JSON.stringify(msg));
                    $("#ShoKitxvar").dialog("close");

                }
            },
            error: function () {
                alert("Error! Try again...");
            }
        });
        $("#ShoKitxvar").dialog("close");
    });

    function KitxvariMag(e)
    {
        var appointment = { kitxva1: e, kitxva2: "2", kitxva3: "3" }
        $.ajax({
            type: 'POST',
            url: 'http://sms.tsu.ge/sms/Students/Helpers/SmsService.asmx/insertKitxvari',
            data: JSON.stringify(appointment),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (msg) {
                if (msg.d) {
                    // alert("წერილი წარმატებით გაიგზავნა" + JSON.stringify(msg));
                    $("#ShoKitxvar").dialog("close");

                }
            },
            error: function () {
                $.ajax({
                    type: 'POST',
                    url: 'https://sms.tsu.ge/sms/Students/Helpers/SmsService.asmx/insertKitxvari',
                    data: JSON.stringify(appointment),
                    contentType: "application/json; charset=utf-8",
                    dataType: "json",
                    success: function (msg) {
                        if (msg.d) {
                            // alert("წერილი წარმატებით გაიგზავნა" + JSON.stringify(msg));
                            $("#ShoKitxvar").dialog("close");

                        }
                    },
                    error: function () {
                        alert("Error! Try again...");
                    }
                });
            }
        });
    }

});

//function ClikKitxv() {
//    alert("");
//    $("#SenDascreba").dialog("open");
//    return false;
//}