var _caseNo = "";
var _cases = [];
jQuery(function() {
    $('#CaseType').change(function() {
        $(this).children('option:selected').tab('show');
        $('select.part').html("");
        $.each(part[$(this).children('option:selected').text()], function(i, o) {
            $('select.part').append("<option value='" + o + "'>" + o + "</option>");
        });
    });

    $('#AddCaseBtn').click(function() {
        if (_no == "" || _name == "") {
            modal($('#notice'), $('#noticeMessage'), "请先选择病患", "show");
        } else {
            modal($('#confirmCase'), $('#confirmCaseMessage'), "确认保存该病例？", "show");
        }
    });

    $('#confirmCaseBtn').click(function() {
        var formData1 = $('#CaseFrm1').serializeArray();
        var formData2 = $('#CaseFrm2').serializeArray();
        var formData3 = $('#CaseFrm3').serializeArray();
        var data = {};
        data["PatientNo"] = parseInt(_no).toString();
        data["Name"] = _name;

        $.each(formData1, function(index, object) {
            data[object.name] = object.value;
        });
        data["Check"] = {};
        $.each(formData2, function(index, object) {
            if ($('#CaseType').children('option:selected').val() == object.name[1]) {
                data["Check"][object.name] = object.value;
            }
        });
        $.each(formData3, function(index, object) {
            data[object.name] = data[object.name] ? data[object.name] + "%" + object.value : object.value;
        });
        data["Recipe"] = [];
        var headline = $('#Recipe thead tr th');
        $('#Recipe tbody tr').each(function(r) {
            if ($(this).children('td:eq(0)').children('input:eq(0)').prop('checked')) {
                var recipeTmp = {}
                $(this).children('td').each(function(i) {
                    switch ($(this).children().first().prop('tagName')) {
                        case "SELECT":
                            recipeTmp[headline.eq(i).text()] = $(this).children('select:eq(0)').children('option:selected').text();
                            break;
                        case "INPUT":
                            recipeTmp[headline.eq(i).text()] = $(this).children('input:eq(0)').val();
                            break;
                        default:
                            recipeTmp[headline.eq(i).text()] = $(this).text();
                    }
                });
                data["Recipe"].push(recipeTmp);
            }
        });
        //console.log(data);
        modal($('#info'), $('#infoMessage'), "正在通信。。。", "show");

        $.post("/case/add", JSON.stringify(data), function(res) {
            //console.log(res.data);
            modal($('#info'), $('#infoMessage'), "", "hide");
            var no = res.data.ops[0].CaseNo.split('-');
            if (res.success) {
                modal($('#notice'), $('#noticeMessage'), "添加成功，病例号：" + formatNo(no[0], 4) + '-' + formatNo(no[1], 2), "show");
            } else {
                modal($('#notice'), $('#noticeMessage'), "与数据库通信失败", "show");
            }
        });
    });

    $('a[data-toggle="tab"][href="#AddCase"]').on('shown.bs.tab', function(e) {
        if (_no == "" || _name == "") {
            $('a[data-toggle="tab"][href="#ModPatient"]').tab('show');
            modal($('#notice'), $('#noticeMessage'), "请先选择病患", "show");
        }
    });

    $('a[data-toggle="tab"][href="#ModCase"]').on('shown.bs.tab', function(e) {
        if (_no == "" || _name == "") {
            $('a[data-toggle="tab"][href="#ModPatient"]').tab('show');
            modal($('#notice'), $('#noticeMessage'), "请先选择病患", "show");
        } else {
            var data = {};
            data["PatientNo"] = parseInt(_no).toString();
            data["Name"] = _name;
            //console.log(data);
            modal($('#info'), $('#infoMessage'), "正在通信。。。", "show");

            $.post("/case/query", JSON.stringify(data), function(res) {
                modal($('#info'), $('#infoMessage'), "", "hide");
                if (res.success) {
                    if (res.data.length == 0) {
                        modal($('#notice'), $('#noticeMessage'), "暂无病例", "show");
                    } else {
                        //console.log(data);
                        _cases = res.data;
                        $('#CaseData').html("");
                        $.each(res.data, function(i, c) {
                            var no = res.data[i].CaseNo.split('-');
                            var row = "<tr></tr>";
                            $('#CaseData').append(row);
                            var d = "<td>" + formatNo(no[0], 4) + '-' + formatNo(no[1], 2) + "</td>";
                            $('#CaseData tr:eq(' + i + ')').append(d);
                            var d = "<td>" + new Date(c["Date"]).toLocaleDateString() + "</td>";
                            $('#CaseData tr:eq(' + i + ')').append(d);
                            var d = "<td>" + caseType[c["CaseType"]] + "</td>";
                            $('#CaseData tr:eq(' + i + ')').append(d);
                        });
                        $('#CaseData tr').click(function() {
                            _caseNo = $(this).children("td:eq(0)").text();
                            $('.CaseSt').text("病例号：" + _caseNo);
                            $('#caseIns').removeClass('hidden');
                            $.each(_cases, function(i, c) {
                                if (c["CaseNo"] == _caseNo.replace(/0/g, "")) {
                                    $('#i_Description').text(c["Description"]);
                                    $('#i_SickHistory').text(c["SickHistory"]);
                                    $('#i_CaseType').text(caseType[c["CaseType"]]);
                                    $('#i_Summery').text(c["Summery"]);
                                    $('#i_Recipe').html("");
                                    $.each(c["Recipe"], function(i, c) {
                                        var row = "<tr></tr>";
                                        $('#i_Recipe').append(row);
                                        var d = "<td>" + c["编号"] + "</td>";
                                        $('#i_Recipe tr:eq(' + i + ')').append(d);
                                        var d = "<td>" + c["项目"] + "</td>";
                                        $('#i_Recipe tr:eq(' + i + ')').append(d);
                                        var d = "<td>" + c["部位"] + "</td>";
                                        $('#i_Recipe tr:eq(' + i + ')').append(d);
                                        var d = "<td>" + c["方法"] + "</td>";
                                        $('#i_Recipe tr:eq(' + i + ')').append(d);
                                        var d = "<td>" + c["计量"] + "</td>";
                                        $('#i_Recipe tr:eq(' + i + ')').append(d);
                                        var d = "<td>" + c["时间"] + "</td>";
                                        $('#i_Recipe tr:eq(' + i + ')').append(d);
                                        var d = "<td>" + c["次数"] + "</td>";
                                        $('#i_Recipe tr:eq(' + i + ')').append(d);
                                    });
                                    var goalArr = c["Goal"].split('%');
                                    $.each(goalArr, function(i, g) {
                                        $('input[type="checkbox"][name="i_Goal"][value="' + g + '"]').prop('checked', true);
                                        if (g == 99) {
                                            $('#i_GoalPlus').text(c["GoalPlus"]);
                                        }
                                    });
                                    var noticeArr = c["Notice"].split('%');
                                    $.each(noticeArr, function(i, n) {
                                        $('input[type="checkbox"][name="i_Notice"][value="' + n + '"]').prop('checked', true);
                                        if (n == 99) {
                                            $('#i_NoticePlus').text(c["NoticePlus"]);
                                        }
                                    });
                                    $('#i_Check').children('li').children('a[data-toggle="tab"][href="#i_Case' + c["CaseType"] + '"]').tab('show');
                                    $.each(c["Check"], function(i, r) {
                                        if (r == "1") {
                                            r = "+"
                                        };
                                        if (r == "0") {
                                            r = "-"
                                        };
                                        $('#' + i).text(r);
                                    });
                                }
                            });
                        });
                    }
                } else {
                    modal($('#notice'), $('#noticeMessage'), "与数据库通信失败", "show");
                }
            });
        }
    });

});
