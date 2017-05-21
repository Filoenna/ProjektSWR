"use strict";
var controller = require("./controller");
var messageContent_1 = require("./messageContent");
function prepareSentDocument() {
    $.getJSON("/Messages/SentMessageHeaders", parseSentMessages);
    $("#delete_selected_btn").click(function () { deleteMessages(); });
}
exports.prepareSentDocument = prepareSentDocument;
function parseSentMessages(data) {
    data = JSON.parse(data);
    console.log(data);
    var i, j, line;
    for (i = 0; i < data.length; i++) {
        var sentDate = new Date(data[i].SendDate).toLocaleString();
        if (data[i].ReceivedDate != null) {
            var receivedDate = new Date(data[i].ReceivedDate).toLocaleString();
        }
        else {
            var receivedDate = "Nie odczytano";
        }
        var recipients = "";
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
        $(".sent_table").append(line);
        var tr = $("#" + data[i].Id);
        tr.click(function () { messageContent_1.messageContent(this.id); });
        tr.first().children().first().click(function (e) { e.stopPropagation(); });
    }
}
function deleteMessages() {
    var selectedMessages = $("input:checkbox:checked");
    var selectedMessageIds = [];
    var i;
    for (i = 0; i < selectedMessages.length; i++) {
        selectedMessageIds.push(Number(selectedMessages[i].id.substr(2)));
    }
    console.log(selectedMessageIds);
    $.ajax({
        url: "/Messages/DeleteSent",
        method: "POST",
        data: { "id": selectedMessageIds },
        success: function () { controller.loadSent(); }
    });
}
