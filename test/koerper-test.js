"use strict";

var Document = require("../koerper");
var domenic = require("domenic");
var DOMParser = domenic.DOMParser;

var parser, actualDocument, document, actualRoot, root;
beforeEach(function () {
    parser = new DOMParser();
    actualDocument = parser.parseFromString("<!doctype html><body></body>", "text/html");
    document = new Document(actualDocument.firstChild);
    root = document.documentElement;
    actualRoot = actualDocument.firstChild;
});

it("can append text to document element", function () {
    var text = document.createTextNode("Hello, World!");
    root.appendChild(text);
    expect(root.innerHTML).toBe("Hello, World!");
});

it("add text to body, body to root", function test() {
    var body = document.createBody();
    var text = document.createTextNode("Hello, World!");
    body.appendChild(text);
    expect(body.innerHTML).toBe("Hello, World!");
    root.appendChild(body);
    expect(root.innerHTML).toBe("Hello, World!");
});

it("and body to root, text to body", function () {
    var body = document.createBody();
    var text = document.createTextNode("Hello, World!");
    root.appendChild(body);
    expect(body.innerHTML).toBe("");
    expect(root.innerHTML).toBe("");
    body.appendChild(text);
    expect(root.innerHTML).toBe("Hello, World!");
});

describe("greeting redux", function () {
    var body, subject, hello, world, comma, object, world, bang;
    beforeEach(function () {
        body = document.createBody();
        subject = document.createBody();
        hello = document.createTextNode("Guten Tag");
        comma = document.createTextNode(", ");
        object = document.createBody();
        world = document.createTextNode("Welt");
        bang = document.createTextNode("!");
        subject.appendChild(hello);
        subject.appendChild(comma);
        object.appendChild(world);
        object.appendChild(bang);
        body.appendChild(subject);
        body.appendChild(object);
    });

    it("whole string", function () {
        expect(body.innerHTML).toBe("Guten Tag, Welt!");
    });

    it("remove first direct child", function () {
        body.removeChild(subject);
        expect(body.innerHTML).toBe("Welt!");
    });

    it("remove second direct child", function () {
        body.removeChild(object);
        expect(body.innerHTML).toBe("Guten Tag, ");
    });

    it("remove some grandchildren", function () {
        subject.removeChild(hello);
        object.removeChild(world);
        expect(body.innerHTML).toBe(", !");
    });
});

it("append to inner body", function () {
    var body = document.createBody();
    var content = document.createBody();

    var open = document.createTextNode("(");
    var close = document.createTextNode(")");
    var dash = document.createTextNode("-");

    body.appendChild(open);
    body.appendChild(content);
    body.appendChild(close);

    content.appendChild(dash);

    expect(body.innerHTML).toBe("(-)");
});

it("replace inner HTML", function () {
    var body = document.createBody();
    var content = document.createBody();

    var open = document.createTextNode("(");
    var close = document.createTextNode(")");
    var dash = document.createTextNode("-");

    body.appendChild(open);
    body.appendChild(content);
    body.appendChild(close);

    content.extract();
    content.actualBody.appendChild(document.actualDocument.createTextNode("|"));
    content.inject();

    expect(body.innerHTML).toBe("(|)");
});

it("replace inner HTML", function () {
    var body = document.createBody();
    var content = document.createBody();

    var open = document.createTextNode("(");
    var close = document.createTextNode(")");
    var dash = document.createTextNode("-");

    body.appendChild(open);
    body.appendChild(content);
    body.appendChild(close);

    expect(content.parentNode).toBe(body);

    content.extract();
    content.actualBody.appendChild(document.actualDocument.createTextNode("|"));
    content.firstChild = content.lastChild = new document.OpaqueHtml(document, content.actualBody);
    content.inject();

    expect(body.innerHTML).toBe("(|)");

    content.extract();
    content.actualBody.removeChild(content.actualBody.firstChild);
    content.actualBody.appendChild(document.actualDocument.createTextNode("-"));
    content.firstChild = content.lastChild = new document.OpaqueHtml(document, content.actualBody);
    content.inject();

    expect(body.innerHTML).toBe("(-)");
});

it("complex nested structure", function () {
    var body = document.createBody();
        var table = document.createElement("table");
        body.appendChild(table);
            var thead = document.createElement("thead");
            table.appendChild(thead);
                var tr = document.createElement("tr");
                thead.appendChild(tr);
                    var th = document.createElement("th");
                    tr.appendChild(th);
                        th.appendChild(document.createTextNode("x"));
                    var th = document.createElement("th");
                    tr.appendChild(th);
                        th.appendChild(document.createTextNode("A"));
                    var th = document.createElement("th");
                    tr.appendChild(th);
                        th.appendChild(document.createTextNode("B"));
            var tbody = document.createElement("tbody");
            table.appendChild(tbody);
                var tr = document.createElement("tr");
                tbody.appendChild(tr);
                    var th = document.createElement("th");
                    tr.appendChild(th);
                        th.appendChild(document.createTextNode("1"));
                    var td = document.createElement("td");
                    tr.appendChild(td);
                        td.appendChild(document.createTextNode("A1"));
                    var td = document.createElement("td");
                    tr.appendChild(td);
                        td.appendChild(document.createTextNode("B1"));
                var tr = document.createElement("tr");
                tbody.appendChild(tr);
                    var th = document.createElement("th");
                    tr.appendChild(th);
                        th.appendChild(document.createTextNode("2"));
                    var td = document.createElement("td");
                    tr.appendChild(td);
                        td.appendChild(document.createTextNode("A2"));
                    var td = document.createElement("td");
                    tr.appendChild(td);
                        td.appendChild(document.createTextNode("B2"));
    expect(body.innerHTML).toBe(
        "<table>" +
            "<thead><tr><th>x</th><th>A</th><th>B</th></tr></thead>" +
            "<tbody>" +
                "<tr><th>1</th><td>A1</td><td>B1</td></tr>" +
                "<tr><th>2</th><td>A2</td><td>B2</td></tr>" +
            "</tbody>" +
        "</table>"
    );
});

it("complex nested structure assembled out of order", function () {
    var body = document.createBody();
        var table = document.createElement("table");
        body.appendChild(table);
            var thead = document.createElement("thead");
            table.appendChild(thead);
                var theadTr = document.createElement("tr");
                thead.appendChild(theadTr);
                    var corner = document.createElement("th");
                    theadTr.appendChild(corner);
                        corner.appendChild(document.createTextNode("x"));
                    var thA = document.createElement("th");
                        thA.appendChild(document.createTextNode("A"));
                    var thB = document.createElement("th");
                        thB.appendChild(document.createTextNode("B"));
            var tbody = document.createElement("tbody");
            table.appendChild(tbody);
                var tr = document.createElement("tr");
                tbody.appendChild(tr);
                    var th = document.createElement("th");
                    tr.appendChild(th);
                        th.appendChild(document.createTextNode("1"));
                    var td = document.createElement("td");
                    tr.appendChild(td);
                        td.appendChild(document.createTextNode("A1"));
                    var td = document.createElement("td");
                    tr.appendChild(td);
                        td.appendChild(document.createTextNode("B1"));
                var tr = document.createElement("tr");
                tbody.appendChild(tr);
                    var th = document.createElement("th");
                    tr.appendChild(th);
                        th.appendChild(document.createTextNode("2"));
                    var td = document.createElement("td");
                    tr.appendChild(td);
                        td.appendChild(document.createTextNode("A2"));
                    var td = document.createElement("td");
                    tr.appendChild(td);
                        td.appendChild(document.createTextNode("B2"));

                    theadTr.appendChild(thB);
                    theadTr.insertBefore(thA, thB);

    expect(body.innerHTML).toBe(
        "<table>" +
            "<thead><tr><th>x</th><th>A</th><th>B</th></tr></thead>" +
            "<tbody>" +
                "<tr><th>1</th><td>A1</td><td>B1</td></tr>" +
                "<tr><th>2</th><td>A2</td><td>B2</td></tr>" +
            "</tbody>" +
        "</table>"
    );
});
