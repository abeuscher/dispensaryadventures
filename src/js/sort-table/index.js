function SortTable(tables) {
    for (i = 0; i < tables.length; i++) {
        var buttons = tables[i].querySelectorAll("[data-sort]");
        for (b = 0; b < buttons.length; b++) {
            buttons[b].addEventListener("click", function (e) {
                e.preventDefault();
                var s = this.getAttribute("data-sort").split("|");
                var headers = this.parentNode.parentNode.parentNode.children;
                for (z=0;z<headers.length;z++) {
                    var h = headers[z];
                    if (h!=this.parentNode.parentNode) {
                        h.classList.remove("active");
                    }
                    else {
                        h.classList.add("active"); 
                    }
                    
                }
                doSort((s[1]=='true'),s[0],this.parentNode.parentNode.parentNode.parentNode.parentNode);
            });
        }
    }
}
function doSort(ascending, columnClassName, el) {
    var tbody = el.getElementsByTagName("tbody")[0];
    var rows = tbody.getElementsByTagName("tr");
    var unsorted = true;
    while (unsorted) {
        unsorted = false;
        for (var r = 0; r < rows.length - 1; r++) {
            var row = rows[r];
            var nextRow = rows[r + 1];
            var value = row.getElementsByClassName(columnClassName)[0].innerHTML;
            var nextValue = nextRow.getElementsByClassName(columnClassName)[0].innerHTML;
            value = value.replace(',', '');
            value = value.replace('$','');
            nextValue = nextValue.replace(',', '');
            nextValue = nextValue.replace('$', '');
            if (!isNaN(value)) {
                value = parseFloat(value);
                nextValue = parseFloat(nextValue);
            }
            if (ascending ? value > nextValue : value < nextValue) {
                tbody.insertBefore(nextRow, row);
                unsorted = true;
            }
        }
    }
}

module.exports = SortTable;