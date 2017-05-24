﻿import * as controller from "./controller";

export function prepareSentDocument() {
    $.getJSON("/Messages/SentMessageHeaders", parseSentMessages);
     $("#delete_selected_btn").click(function() { deleteMessages(); });
     $("#select_all").click(function() {
        if ($("#select_all").is(":checked"))
            $("input:checkbox").prop("checked", true);
        else
            $("input:checkbox").prop("checked", false);
    });
}

function parseSentMessages(data) {
    data = JSON.parse(data);
    var i : number, j : number, line : string, full : string;
    if (data.length == 0) {
            line = "<tr>" + "<td colspan='5'>" + "Brak wiadomości" + "</td>" + "</tr>"
            $(".sent_table").append(line);
        }

    for (i = 0; i < data.length; i++) {
        var sentDate : string = new Date(data[i].SendDate).toLocaleString();
        if (data[i].ReceivedDate != null) {
           var receivedDate : string = new Date(data[i].ReceivedDate).toLocaleString()
        } else {
            var receivedDate : string= "Nie odczytano";
        }
        var recipients : string = "";
        for (j = 0; j < data[i].Recipient.length; j++) {
            recipients += data[i].Recipient[j] + "<br />";
        }
        line = "<tr id='" + data[i].Id + "'>" +
         "<td>" + "<input type='checkbox' id='cb" + data[i].Id + "'>" + "</td>" +
         "<td>" + recipients + "</td>" +
         "<td>" + data[i].Subject + "</td>" +
         "<td>" + sentDate + "</td>" +
         "<td>" + receivedDate + "</td>" +
         "</tr>";
       full += line;
         var tr = $("#" + data[i].Id);
         tr.click(function() { controller.loadContent(this.id, "sent"); });
         tr.first().children().first().click(function(e) { e.stopPropagation(); });
    }
    $(".sent_table").append(full);
}

function deleteMessages() {
    let selectedMessages = $("input:checkbox:checked");
    let selectedMessageIds : Array<number> = [];
    var i : number;
    for (i = 1; i < selectedMessages.length; i++) {
        selectedMessageIds.push(Number(selectedMessages[i].id.substr(2)));
    }
    $.ajax({
        url: "/Messages/DeleteSent",
        method: "POST",
        data: {"id" : selectedMessageIds},
        success: function() { controller.loadSent(); }
    });
}