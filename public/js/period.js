jQuery(function() {
    $.each(doctor, function(i, d) {
        $('select.doctor').append("<option value='" + i + "'>" + d + "</option>");
    });

    $('#AddPeriodTmp').click(function() {
        //"period/add"
        $('#Period').append($('#periodTmp').html());
        $('.datepicker').datetimepicker({
            format: 'YYYY-MM-DD',
            widgetPositioning: {
                vertical: 'bottom'
            }
        });
    });

    $('.sign').change(function() {
        //"period/record"
    });

    $('.summery').click(function() {
    	//"period/fin"
    });

    $('a[data-toggle="tab"][href="#ProjectHis"]').on('shown.bs.tab', function(e) {
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
        //"period/query"
    });
});
