var buttons={};buttons[translate("No")]=function(){$("#dialog").dialog("close")},$(document).ready(function(){$("#dialog").dialog({autoOpen:!1,bgiframe:!0,resizable:!1,height:140,modal:!0,overlay:{backgroundColor:"#000",opacity:.5},buttons:buttons}),$("#check-all-active").click(function(e){$(".active-plugin-checkbox").attr("checked",$(this).attr("checked"))}),$(".active-plugin-checkbox").click(function(){$("#check-all-active").attr("checked",!1)}),$("#btnDeactivate").click(function(){$(this).parents("form").get(0).submit()}),$("#check-all-inactive").click(function(e){$(".inactive-plugin-checkbox").attr("checked",$(this).attr("checked"))}),$(".inactive-plugin-checkbox").click(function(){$("#check-all-inactive").attr("checked",!1)}),$("#btnActivate").click(function(){$("#inactive_form_action").attr("value","activate"),$(this).parents("form").get(0).submit()}),$("#btnDelete").click(function(){$("#inactive_form_action").attr("value","delete"),buttons[translate("Yes")]=function(){$("#btnDelete").parents("form").get(0).submit()},$("#dialog").dialog("option","buttons",buttons),$("#dialog").dialog("open")})});