jQuery(function () {
    $('#AddPeriodTmp').click(function () {
        if ($('#Period').find('input.summary').length > 0 && !$('#Period').find('input.summary').last().prop('disabled')) {
            modal($('#notice'), $('#noticeMessage'), "上一疗程未结束", "show");
            return;
        }

        modal($('#info'), $('#infoMessage'), "正在通信。。。", "show");
        var data = {
            "CaseNo": _caseNo.replace(/0/g, ""),
            "Records": []
        };
        $.post("/period/add", JSON.stringify(data), function (res) {
            modal($('#info'), $('#infoMessage'), "", "hide");
            if (res.success) {
                addTmp("疗程" + res.data.ops[0].PeriodNo.split('-').pop())
                modal($('#notice'), $('#noticeMessage'), "疗程添加成功", "show");
            } else {
                modal($('#notice'), $('#noticeMessage'), "与数据库通信失败", "show");
            }
        });
    });

    $('a[data-toggle="tab"][href="#ProjectHis"]').on('shown.bs.tab', function (e) {
        if (_no == "" || _name == "") {
            $('a[data-toggle="tab"][href="#ModPatient"]').tab('show');
            modal($('#notice'), $('#noticeMessage'), "请先选择病患", "show");
            return;
        }
        if (_caseNo == "") {
            $('a[data-toggle="tab"][href="#ModCase"]').tab('show');
            modal($('#notice'), $('#noticeMessage'), "请先选择病例", "show");
            return;
        }
        modal($('#info'), $('#infoMessage'), "正在通信。。。", "show");
        var data = {
            "CaseNo": _caseNo.replace(/0/g, ""),
        };
        $.post("/period/query", JSON.stringify(data), function (res) {
            modal($('#info'), $('#infoMessage'), "", "hide");
            if (res.success) {
                //console.log(res.data);
                $('#Period').html("");
                $.each(res.data, function (i, p) {
                    addTmp("疗程" + (i + 1));
                    $.each(p["Records"], function (j, r) {
                        var row = $('#Period').find('tbody:eq(' + i + ')').find('tr:eq(' + j + ')');
                        row.find('input:eq(0)').val(r["RecordDate"]);
                        row.find('input:eq(1)').val(r["Performance"]);
                        row.find('input:eq(2)').val(r["Notice"]);
                        row.find('select').val(r["Signature"]);
                        row.find('input').attr("disabled", true);
                        row.find('select').attr("disabled", true);
                    });
                    if (p["Date"]) {
                        var form = $('#Period').find('form:eq(' + i + ')');
                        form.find('input[type="radio"][name="Sum"][value="' + p["Sum"] + '"]').prop('checked', true);
                        if (p["Sum"] == 5) {
                            form.find('input[name="SumPlus"]').val(p["SumPlus"]);
                        }
                        form.find('select').val(p["Doctor"]);
                        form.find('input[name="Date"]').val(p["Date"]);
                        $('#Period').find('input').attr("disabled", true);
                        $('#Period').find('select').attr("disabled", true);
                    }
                });
            } else {
                modal($('#notice'), $('#noticeMessage'), "与数据库通信失败", "show");
            }
        });
    });
});

function addTmp(title) {
    var periodTmp = $('#Period').append($('#periodTmp').html()).children('fieldset').last();
    periodTmp.find('legend.periodTitle').text(title);
    periodTmp.find('input.datepicker').datetimepicker({
        format: 'YYYY-MM-DD',
        widgetPositioning: {
            vertical: 'bottom'
        }
    });
    $.each(doctor, function (i, d) {
        periodTmp.find('select.doctor').append("<option value='" + i + "'>" + d + "</option>");
    });
    periodTmp.find('input.sign').click(function () {
        sign(this);
    });
    periodTmp.find('input.summary').click(function () {
        summary(this);
    });
}

function sign(btn) {
    var data = {
        "period": {
            "PeriodNo": _caseNo.replace(/0/g, "") + '-' + $(btn).parents('fieldset').children('legend.periodTitle').text().slice(-1)
        },
        "record": {
            "RecordNo": $(btn).parents('tr').children('td:eq(0)').text(),
            "RecordDate": $(btn).parents('tr').find('input:eq(0)').val(),
            "Performance": $(btn).parents('tr').find('input:eq(1)').val(),
            "Notice": $(btn).parents('tr').find('input:eq(2)').val(),
            "Signature": $(btn).parents('tr').find('select').children('option:selected').val()
        }
    };
    if (data["record"]["RecordDate"] == "" || data["record"]["Performance"] == "") {
        modal($('#notice'), $('#noticeMessage'), "填写日期与治疗反应", "show");
        return;
    }
    modal($('#info'), $('#infoMessage'), "正在通信。。。", "show");
    $.post("/period/record", JSON.stringify(data), function (res) {
        modal($('#info'), $('#infoMessage'), "", "hide");
        if (res.success) {
            if (res.data.ok == 1) {
                modal($('#notice'), $('#noticeMessage'), "记录完成", "show");
                $(btn).parents('tr').find('input').attr("disabled", true);
                $(btn).parents('tr').find('select').attr("disabled", true);
            }
        } else {
            modal($('#notice'), $('#noticeMessage'), "与数据库通信失败", "show");
        }
    });
}

function summary(btn) {
    var formData = $(btn).parents('fieldset').find('form').serializeArray();
    var data = {
        "period": {
            "PeriodNo": _caseNo.replace(/0/g, "") + '-' + $(btn).parents('fieldset').children('legend.periodTitle').text().slice(-1)
        },
        "sum": {}
    };
    $.each(formData, function (index, object) {
        data["sum"][object.name] = object.value;
    });

    if (data["sum"]["Date"] == "") {
        modal($('#notice'), $('#noticeMessage'), "填写日期", "show");
        return;
    }
    modal($('#info'), $('#infoMessage'), "正在通信。。。", "show");
    $.post("/period/fin", JSON.stringify(data), function (res) {
        modal($('#info'), $('#infoMessage'), "", "hide");
        if (res.success) {
            if (res.data.ok == 1) {
                modal($('#notice'), $('#noticeMessage'), "疗程完成", "show");
                $(btn).parents('fieldset').find('input').attr("disabled", true);
                $(btn).parents('fieldset').find('select').attr("disabled", true);
            }
        } else {
            modal($('#notice'), $('#noticeMessage'), "与数据库通信失败", "show");
        }
    });
}