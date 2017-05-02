var _no = "";
var _name = "";
jQuery(function () {
    $('#AddPatientBtn').click(function () {
        if ($('#AddPatientFrm').valid()) {
            var formData = $('#AddPatientFrm').serializeArray();

            modal($('#info'), $('#infoMessage'), "正在通信。。。", "show");

            $.post("/patient/query", JSON.stringify({
                "Name": formData[0].value
            }), function (res) {
                modal($('#info'), $('#infoMessage'), "", "hide");
                if (res.success) {
                    if (res.data.length != 0) {
                        var html = "已有" + res.data.length + "位姓名重复</br>";
                        $.each(res.data, function (i, obj) {
                            html = html + "病患号：" + formatNo(res.data[i].PatientNo, 4) + "——姓名：" + res.data[i].Name + "</br>";
                        })
                    } else {
                        var html = "确认保存该病患？";
                    }
                    modal($('#confirmPatient'), $('#confirmPatientMessage'), html, "show");
                } else {
                    modal($('#notice'), $('#noticeMessage'), "与数据库通信失败", "show");
                }
            });
        }
    });

    $('#confirmPatientBtn').click(function () {
        var formData = $('#AddPatientFrm').serializeArray();
        var data = {};

        $.each(formData, function (index, object) {
            data[object.name] = object.value;
        });

        modal($('#info'), $('#infoMessage'), "正在通信。。。", "show");

        $.post("/patient/add", JSON.stringify(data), function (res) {
            console.log(res.data);
            modal($('#info'), $('#infoMessage'), "", "hide");
            if (res.success) {
                modal($('#notice'), $('#noticeMessage'), "添加成功，病患号：" + formatNo(res.data.ops[0].PatientNo, 4), "show");
            } else {
                modal($('#notice'), $('#noticeMessage'), "与数据库通信失败", "show");
            }
        });
    });

    $('#QueryPatientBtn').click(function () {
        var formData = $('#QueryPatientFrm').serializeArray();
        var data = {};

        $.each(formData, function (index, object) {
            if (object.value != "") {
                data[object.name] = object.value;
            }
        });

        modal($('#info'), $('#infoMessage'), "正在通信。。。", "show");

        $.post("/patient/query", JSON.stringify(data), function (res) {
            modal($('#info'), $('#infoMessage'), "", "hide");
            if (res.success) {
                if (res.data.length == 0) {
                    modal($('#notice'), $('#noticeMessage'), "查无此人", "show");
                } else {
                    $('#PatientData').html("");
                    $.each(res.data, function(i, p) {
                        var row = "<tr></tr>";
                        $('#PatientData').append(row);
                        var d = "<td>" + formatNo(p["PatientNo"], 4) + "</td>";
                        $('#PatientData tr:eq(' + i + ')').append(d);
                        var d = "<td>" + p["Name"] + "</td>";
                        $('#PatientData tr:eq(' + i + ')').append(d);
                        var d = "<td>" + p["Gender"] + "</td>";
                        $('#PatientData tr:eq(' + i + ')').append(d);
                        var d = "<td>" + ((new Date()).getFullYear() - parseInt(p["Year"])) + "</td>";
                        $('#PatientData tr:eq(' + i + ')').append(d);
                        var d = "<td>" + p["CardNo"] + "</td>";
                        $('#PatientData tr:eq(' + i + ')').append(d);
                        var d = "<td>" + p["Address"] + "</td>";
                        $('#PatientData tr:eq(' + i + ')').append(d);
                        var d = "<td>" + p["Postcode"] + "</td>";
                        $('#PatientData tr:eq(' + i + ')').append(d);
                        var d = "<td>" + p["Phone"] + "</td>";
                        $('#PatientData tr:eq(' + i + ')').append(d);
                        var d = "<td>" + p["BedNo"] + "</td>";
                        $('#PatientData tr:eq(' + i + ')').append(d);
                    });
                    $('#PatientData tr').click(function () {
                        _no = $(this).children("td:eq(0)").text();
                        _name = $(this).children("td:eq(1)").text();
                        $('.PatientSt').text("病患号：" + _no + " 姓名：" + _name);
                    });
                }
            } else {
                modal($('#notice'), $('#noticeMessage'), "与数据库通信失败", "show");
            }
        });
    });

    $('#AddPatientFrm').validate({
        rules: {
            Name: {
                required: true,
                rangelength: [2, 4],
                Chinese: true
            },
            CardNo: {
                EnglishAndDigits: true,
                rangelength: [9, 9]
            },
            Postcode: {
                digits: true,
                rangelength: [6, 6]
            },
            Phone: {
                digits: true,
                rangelength: [8, 11]
            },
            BedNo: {
                digits: true,
                rangelength: [3, 3]
            }
        },
        messages: {
            Name: {
                required: "请输入姓名",
                rangelength: "姓名为2到4字符",
                Chinese: "请输入中文"
            },
            CardNo: {
                EnglishAndDigits: "请输入字母与数字",
                rangelength: "医保卡号为9位"
            },
            Postcode: {
                digits: "邮编为数字",
                rangelength: "邮编为6位"
            },
            Phone: {
                digits: "电话号码为数字",
                rangelength: "电话号码为8到11位"
            },
            BedNo: {
                digits: "床号为数字",
                rangelength: "床号为3位"
            }
        },
        errorElement: "div",
        errorPlacement: function (error, element) {
            element.parent().addClass("has-feedback");
            if (!element.next("span")[0]) {
                $("<span class='glyphicon glyphicon-remove form-control-feedback'></span>").insertAfter(element);
            }
        },
        success: function (label, element) {
            if (!$(element).next("span")[0]) {
                $("<span class='glyphicon glyphicon-ok form-control-feedback'></span>").insertAfter($(element));
            }
            $(element).parent().tooltip("hide");
        },
        showErrors: function (errorMap, errorList) {
            $.each(errorList, function (i, err) {
                if ($(err["element"]).parent().next(".tooltip")[0]) {
                    $(err["element"]).parent().next(".tooltip").children(".tooltip-inner").text(err["message"]);
                } else {
                    $(err["element"]).parent().tooltip({
                        placement: "right",
                        title: err["message"],
                        trigger: "manual"
                    }).tooltip("show");
                }
            });
            this.defaultShowErrors();
        },
        highlight: function (element, errorClass, validClass) {
            $(element).parent().addClass("has-error").removeClass("has-success");
            $(element).next("span").addClass("glyphicon-remove").removeClass("glyphicon-ok");
        },
        unhighlight: function (element, errorClass, validClass) {
            $(element).parent().addClass("has-success").removeClass("has-error");
            $(element).next("span").addClass("glyphicon-ok").removeClass("glyphicon-remove");
            $(element).parent().tooltip("hide");
        }
    });
});