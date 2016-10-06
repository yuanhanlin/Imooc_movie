            $("#btnSearch").click(function(){   
                var tableId=$("#mystudio").tabs("getSelected").find("table.ui-jqgrid-btable").attr("id");
                var postData=$("#" + tableId).getGridParam("postData");
                var _key=$("#txt_SearchKey").val();
                postData["filter"]="act_name like '%"+_key+"%'";

                if(_key=="")
                    postData["filter"]    ;
               $("#" + tableId).setGridParam({postData:postData}).trigger("reloadGrid");
                return false;