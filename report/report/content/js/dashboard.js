/*
   Licensed to the Apache Software Foundation (ASF) under one or more
   contributor license agreements.  See the NOTICE file distributed with
   this work for additional information regarding copyright ownership.
   The ASF licenses this file to You under the Apache License, Version 2.0
   (the "License"); you may not use this file except in compliance with
   the License.  You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
var showControllersOnly = false;
var seriesFilter = "";
var filtersOnlySampleSeries = true;

/*
 * Add header in statistics table to group metrics by category
 * format
 *
 */
function summaryTableHeader(header) {
    var newRow = header.insertRow(-1);
    newRow.className = "tablesorter-no-sort";
    var cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Requests";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 3;
    cell.innerHTML = "Executions";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 7;
    cell.innerHTML = "Response Times (ms)";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Throughput";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 2;
    cell.innerHTML = "Network (KB/sec)";
    newRow.appendChild(cell);
}

/*
 * Populates the table identified by id parameter with the specified data and
 * format
 *
 */
function createTable(table, info, formatter, defaultSorts, seriesIndex, headerCreator) {
    var tableRef = table[0];

    // Create header and populate it with data.titles array
    var header = tableRef.createTHead();

    // Call callback is available
    if(headerCreator) {
        headerCreator(header);
    }

    var newRow = header.insertRow(-1);
    for (var index = 0; index < info.titles.length; index++) {
        var cell = document.createElement('th');
        cell.innerHTML = info.titles[index];
        newRow.appendChild(cell);
    }

    var tBody;

    // Create overall body if defined
    if(info.overall){
        tBody = document.createElement('tbody');
        tBody.className = "tablesorter-no-sort";
        tableRef.appendChild(tBody);
        var newRow = tBody.insertRow(-1);
        var data = info.overall.data;
        for(var index=0;index < data.length; index++){
            var cell = newRow.insertCell(-1);
            cell.innerHTML = formatter ? formatter(index, data[index]): data[index];
        }
    }

    // Create regular body
    tBody = document.createElement('tbody');
    tableRef.appendChild(tBody);

    var regexp;
    if(seriesFilter) {
        regexp = new RegExp(seriesFilter, 'i');
    }
    // Populate body with data.items array
    for(var index=0; index < info.items.length; index++){
        var item = info.items[index];
        if((!regexp || filtersOnlySampleSeries && !info.supportsControllersDiscrimination || regexp.test(item.data[seriesIndex]))
                &&
                (!showControllersOnly || !info.supportsControllersDiscrimination || item.isController)){
            if(item.data.length > 0) {
                var newRow = tBody.insertRow(-1);
                for(var col=0; col < item.data.length; col++){
                    var cell = newRow.insertCell(-1);
                    cell.innerHTML = formatter ? formatter(col, item.data[col]) : item.data[col];
                }
            }
        }
    }

    // Add support of columns sort
    table.tablesorter({sortList : defaultSorts});
}

$(document).ready(function() {

    // Customize table sorter default options
    $.extend( $.tablesorter.defaults, {
        theme: 'blue',
        cssInfoBlock: "tablesorter-no-sort",
        widthFixed: true,
        widgets: ['zebra']
    });

    var data = {"OkPercent": 74.89539748953975, "KoPercent": 25.10460251046025};
    var dataset = [
        {
            "label" : "FAIL",
            "data" : data.KoPercent,
            "color" : "#FF6347"
        },
        {
            "label" : "PASS",
            "data" : data.OkPercent,
            "color" : "#9ACD32"
        }];
    $.plot($("#flot-requests-summary"), dataset, {
        series : {
            pie : {
                show : true,
                radius : 1,
                label : {
                    show : true,
                    radius : 3 / 4,
                    formatter : function(label, series) {
                        return '<div style="font-size:8pt;text-align:center;padding:2px;color:white;">'
                            + label
                            + '<br/>'
                            + Math.round10(series.percent, -2)
                            + '%</div>';
                    },
                    background : {
                        opacity : 0.5,
                        color : '#000'
                    }
                }
            }
        },
        legend : {
            show : true
        }
    });

    // Creates APDEX table
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.44142259414225943, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.46875, 500, 1500, "createRepoRequest_tere123"], "isController": false}, {"data": [0.43333333333333335, 500, 1500, "createRepoRequest_tere12345678"], "isController": false}, {"data": [0.5, 500, 1500, "addNewBranch_tere12345"], "isController": false}, {"data": [0.9333333333333333, 500, 1500, "deleteRepo_tere12345"], "isController": false}, {"data": [0.43333333333333335, 500, 1500, "addFileToRepoRequest_tere123"], "isController": false}, {"data": [0.0, 500, 1500, "addFileToRepoRequest_tere1234"], "isController": false}, {"data": [0.43333333333333335, 500, 1500, "createRepoRequest_tere12345"], "isController": false}, {"data": [0.0, 500, 1500, "createRepoRequest_tere1234"], "isController": false}, {"data": [0.0, 500, 1500, "deleteRepo_tere1234"], "isController": false}, {"data": [0.5, 500, 1500, "addFileToRepoRequest_teest12221212"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "deleteRepo_tere12345678"], "isController": false}, {"data": [0.31666666666666665, 500, 1500, "addNewBranch_tere123456"], "isController": false}, {"data": [0.36666666666666664, 500, 1500, "addNewBranch_tere1234567"], "isController": false}, {"data": [0.5, 500, 1500, "addFileToRepoRequest_tere12345"], "isController": false}, {"data": [0.31666666666666665, 500, 1500, "addFileToRepoRequest_tere123456"], "isController": false}, {"data": [0.9, 500, 1500, "deleteRepo_tere123"], "isController": false}, {"data": [0.0, 500, 1500, "addNewBranch_tere1234"], "isController": false}, {"data": [0.6166666666666667, 500, 1500, "deleteRepo_tere123456"], "isController": false}, {"data": [0.43333333333333335, 500, 1500, "createRepoRequest_teest12221212"], "isController": false}, {"data": [0.3333333333333333, 500, 1500, "createRepoRequest_tere1234567"], "isController": false}, {"data": [0.5, 500, 1500, "addNewBranch_teest12221212"], "isController": false}, {"data": [0.4666666666666667, 500, 1500, "addNewBranch_tere123"], "isController": false}, {"data": [0.7666666666666667, 500, 1500, "deleteRepo_tere1234567"], "isController": false}, {"data": [0.36666666666666664, 500, 1500, "addFileToRepoRequest_tere1234567"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "deleteRepo_teest12221212"], "isController": false}, {"data": [0.2833333333333333, 500, 1500, "createRepoRequest_tere123456"], "isController": false}, {"data": [0.43333333333333335, 500, 1500, "addFileToRepoRequest_tere12345678"], "isController": false}, {"data": [0.4666666666666667, 500, 1500, "addNewBranch_tere12345678"], "isController": false}]}, function(index, item){
        switch(index){
            case 0:
                item = item.toFixed(3);
                break;
            case 1:
            case 2:
                item = formatDuration(item);
                break;
        }
        return item;
    }, [[0, 0]], 3);

    // Create statistics table
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 478, 120, 25.10460251046025, 684.2112970711298, 176, 3283, 719.0, 1160.1, 1454.8999999999983, 2265.4699999999957, 2.6567067951667944, 6.007947410891942, 0.765620397311057], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["createRepoRequest_tere123", 16, 1, 6.25, 933.5625000000001, 286, 1394, 874.5, 1353.4, 1394.0, 1394.0, 0.08929966735873908, 0.48591031766961357, 0.023458604022950014], "isController": false}, {"data": ["createRepoRequest_tere12345678", 15, 0, 0.0, 997.7333333333333, 711, 1812, 904.0, 1664.4, 1812.0, 1812.0, 0.0952538196781691, 0.5500722043797707, 0.025487838468572593], "isController": false}, {"data": ["addNewBranch_tere12345", 15, 0, 0.0, 761.2, 582, 880, 784.0, 860.8, 880.0, 880.0, 0.09216363345908549, 0.1828212075432862, 0.027451082231465893], "isController": false}, {"data": ["deleteRepo_tere12345", 15, 0, 0.0, 340.26666666666665, 239, 625, 322.0, 553.6, 625.0, 625.0, 0.09228724713294285, 0.10835940768506669, 0.023882930166240095], "isController": false}, {"data": ["addFileToRepoRequest_tere123", 15, 2, 13.333333333333334, 1019.1999999999999, 213, 3283, 831.0, 2152.000000000001, 3283.0, 3283.0, 0.09105312039043578, 0.1198628967639721, 0.031038680883093864], "isController": false}, {"data": ["addFileToRepoRequest_tere1234", 15, 15, 100.0, 266.1333333333334, 193, 385, 254.0, 359.8, 385.0, 385.0, 0.09284936119639497, 0.11090541861134495, 0.030284850233980393], "isController": false}, {"data": ["createRepoRequest_tere12345", 15, 0, 0.0, 1033.1333333333334, 687, 1966, 903.0, 1711.6000000000001, 1966.0, 1966.0, 0.09245676105474673, 0.5315481248998385, 0.024468537349449575], "isController": false}, {"data": ["createRepoRequest_tere1234", 15, 15, 100.0, 358.66666666666663, 296, 522, 329.0, 510.0, 522.0, 522.0, 0.09276782069835617, 0.12165509194837162, 0.024460265223199378], "isController": false}, {"data": ["deleteRepo_tere1234", 15, 15, 100.0, 219.06666666666666, 178, 281, 209.0, 276.8, 281.0, 281.0, 0.09192133984544958, 0.11149651579821428, 0.023878004295790616], "isController": false}, {"data": ["addFileToRepoRequest_teest12221212", 15, 0, 0.0, 906.4666666666666, 751, 1174, 912.0, 1139.2, 1174.0, 1174.0, 0.09426432974919405, 0.1204263634549762, 0.031206648227516384], "isController": false}, {"data": ["deleteRepo_tere12345678", 14, 0, 0.0, 304.92857142857144, 246, 685, 278.0, 508.5, 685.0, 685.0, 0.09573958831977022, 0.1147325702660193, 0.02477635830540929], "isController": false}, {"data": ["addNewBranch_tere123456", 30, 10, 33.333333333333336, 627.3, 202, 1526, 660.5, 1103.2000000000003, 1389.6, 1526.0, 0.18095180650220158, 0.31417993018276136, 0.05395568188672417], "isController": false}, {"data": ["addNewBranch_tere1234567", 15, 3, 20.0, 860.5333333333334, 200, 2222, 723.0, 1827.8000000000002, 2222.0, 2222.0, 0.09372656835791052, 0.17902628834978757, 0.027928808813421645], "isController": false}, {"data": ["addFileToRepoRequest_tere12345", 15, 0, 0.0, 908.5333333333335, 758, 1352, 846.0, 1235.6000000000001, 1352.0, 1352.0, 0.09216703123847912, 0.1196071245883206, 0.030422320858013618], "isController": false}, {"data": ["addFileToRepoRequest_tere123456", 30, 11, 36.666666666666664, 732.9666666666669, 180, 2974, 767.5, 1198.5000000000005, 2044.4999999999986, 2974.0, 0.18020074362840205, 0.22555595683591523, 0.058835073521903404], "isController": false}, {"data": ["deleteRepo_tere123", 15, 1, 6.666666666666667, 312.8666666666667, 230, 820, 272.0, 538.0000000000002, 820.0, 820.0, 0.09161424296097234, 0.10859508604104319, 0.02371472851646003], "isController": false}, {"data": ["addNewBranch_tere1234", 15, 15, 100.0, 245.4, 189, 331, 252.0, 322.6, 331.0, 331.0, 0.09222823413674372, 0.10939493474852435, 0.027560390279144125], "isController": false}, {"data": ["deleteRepo_tere123456", 30, 10, 33.333333333333336, 319.9333333333334, 183, 825, 270.5, 642.3000000000002, 735.8999999999999, 825.0, 0.18010337933974102, 0.21584264367747086, 0.04666741209454227], "isController": false}, {"data": ["createRepoRequest_teest12221212", 15, 0, 0.0, 1001.2666666666667, 679, 1754, 855.0, 1632.2, 1754.0, 1754.0, 0.09492949902539048, 0.5508692081139407, 0.025493761945295294], "isController": false}, {"data": ["createRepoRequest_tere1234567", 15, 4, 26.666666666666668, 1118.1999999999998, 277, 2429, 919.0, 2268.8, 2429.0, 2429.0, 0.09462289621760743, 0.4867350034537357, 0.02522661197988948], "isController": false}, {"data": ["addNewBranch_teest12221212", 14, 0, 0.0, 768.0, 662, 960, 755.5, 931.5, 960.0, 960.0, 0.09655305590421938, 0.19546336414985035, 0.028758478565221592], "isController": false}, {"data": ["addNewBranch_tere123", 15, 1, 6.666666666666667, 815.6666666666666, 184, 1199, 783.0, 1112.0, 1199.0, 1199.0, 0.0911964980544747, 0.17653290863630838, 0.027168956712062257], "isController": false}, {"data": ["deleteRepo_tere1234567", 15, 2, 13.333333333333334, 360.2, 176, 688, 279.0, 684.4, 688.0, 688.0, 0.0939396406495613, 0.11416479635451568, 0.024322783259329774], "isController": false}, {"data": ["addFileToRepoRequest_tere1234567", 15, 2, 13.333333333333334, 895.9999999999999, 208, 1848, 825.0, 1755.0, 1848.0, 1848.0, 0.09445427468562469, 0.1194637496300541, 0.030728386107035585], "isController": false}, {"data": ["deleteRepo_teest12221212", 14, 0, 0.0, 358.35714285714283, 245, 666, 304.0, 658.5, 666.0, 666.0, 0.09644795943674392, 0.1164493394175921, 0.024959677002672986], "isController": false}, {"data": ["createRepoRequest_tere123456", 30, 11, 36.666666666666664, 859.7333333333333, 288, 2724, 806.5, 1582.8000000000004, 2197.0999999999995, 2724.0, 0.18104681267086292, 0.7708280213695587, 0.04809055961569796], "isController": false}, {"data": ["addFileToRepoRequest_tere12345678", 15, 1, 6.666666666666667, 1107.7333333333333, 726, 2137, 942.0, 1934.8000000000002, 2137.0, 2137.0, 0.09425485255399232, 0.12263562684189691, 0.031295556512067765], "isController": false}, {"data": ["addNewBranch_tere12345678", 15, 1, 6.666666666666667, 863.7333333333333, 596, 2092, 722.0, 1693.6000000000004, 2092.0, 2092.0, 0.09332943423696966, 0.186616335528649, 0.027798317814722407], "isController": false}]}, function(index, item){
        switch(index){
            // Errors pct
            case 3:
                item = item.toFixed(2) + '%';
                break;
            // Mean
            case 4:
            // Mean
            case 7:
            // Median
            case 8:
            // Percentile 1
            case 9:
            // Percentile 2
            case 10:
            // Percentile 3
            case 11:
            // Throughput
            case 12:
            // Kbytes/s
            case 13:
            // Sent Kbytes/s
                item = item.toFixed(2);
                break;
        }
        return item;
    }, [[0, 0]], 0, summaryTableHeader);

    // Create error table
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["The operation lasted too long: It took 2,222 milliseconds, but should not have lasted longer than 2,000 milliseconds.", 1, 0.8333333333333334, 0.20920502092050208], "isController": false}, {"data": ["400/Bad Request", 28, 23.333333333333332, 5.857740585774058], "isController": false}, {"data": ["The operation lasted too long: It took 2,974 milliseconds, but should not have lasted longer than 2,000 milliseconds.", 1, 0.8333333333333334, 0.20920502092050208], "isController": false}, {"data": ["The operation lasted too long: It took 2,429 milliseconds, but should not have lasted longer than 2,000 milliseconds.", 1, 0.8333333333333334, 0.20920502092050208], "isController": false}, {"data": ["The operation lasted too long: It took 3,283 milliseconds, but should not have lasted longer than 2,000 milliseconds.", 1, 0.8333333333333334, 0.20920502092050208], "isController": false}, {"data": ["The operation lasted too long: It took 2,162 milliseconds, but should not have lasted longer than 2,000 milliseconds.", 1, 0.8333333333333334, 0.20920502092050208], "isController": false}, {"data": ["The operation lasted too long: It took 2,137 milliseconds, but should not have lasted longer than 2,000 milliseconds.", 1, 0.8333333333333334, 0.20920502092050208], "isController": false}, {"data": ["404/Not Found", 84, 70.0, 17.573221757322177], "isController": false}, {"data": ["The operation lasted too long: It took 2,092 milliseconds, but should not have lasted longer than 2,000 milliseconds.", 1, 0.8333333333333334, 0.20920502092050208], "isController": false}, {"data": ["The operation lasted too long: It took 2,724 milliseconds, but should not have lasted longer than 2,000 milliseconds.", 1, 0.8333333333333334, 0.20920502092050208], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 478, 120, "404/Not Found", 84, "400/Bad Request", 28, "The operation lasted too long: It took 2,222 milliseconds, but should not have lasted longer than 2,000 milliseconds.", 1, "The operation lasted too long: It took 2,974 milliseconds, but should not have lasted longer than 2,000 milliseconds.", 1, "The operation lasted too long: It took 2,429 milliseconds, but should not have lasted longer than 2,000 milliseconds.", 1], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["createRepoRequest_tere123", 16, 1, "400/Bad Request", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["addFileToRepoRequest_tere123", 15, 2, "The operation lasted too long: It took 3,283 milliseconds, but should not have lasted longer than 2,000 milliseconds.", 1, "404/Not Found", 1, "", "", "", "", "", ""], "isController": false}, {"data": ["addFileToRepoRequest_tere1234", 15, 15, "404/Not Found", 15, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["createRepoRequest_tere1234", 15, 15, "400/Bad Request", 15, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["deleteRepo_tere1234", 15, 15, "404/Not Found", 15, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["addNewBranch_tere123456", 30, 10, "404/Not Found", 10, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["addNewBranch_tere1234567", 15, 3, "404/Not Found", 2, "The operation lasted too long: It took 2,222 milliseconds, but should not have lasted longer than 2,000 milliseconds.", 1, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["addFileToRepoRequest_tere123456", 30, 11, "404/Not Found", 10, "The operation lasted too long: It took 2,974 milliseconds, but should not have lasted longer than 2,000 milliseconds.", 1, "", "", "", "", "", ""], "isController": false}, {"data": ["deleteRepo_tere123", 15, 1, "404/Not Found", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["addNewBranch_tere1234", 15, 15, "404/Not Found", 15, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["deleteRepo_tere123456", 30, 10, "404/Not Found", 10, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["createRepoRequest_tere1234567", 15, 4, "400/Bad Request", 2, "The operation lasted too long: It took 2,429 milliseconds, but should not have lasted longer than 2,000 milliseconds.", 1, "The operation lasted too long: It took 2,162 milliseconds, but should not have lasted longer than 2,000 milliseconds.", 1, "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["addNewBranch_tere123", 15, 1, "404/Not Found", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["deleteRepo_tere1234567", 15, 2, "404/Not Found", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["addFileToRepoRequest_tere1234567", 15, 2, "404/Not Found", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["createRepoRequest_tere123456", 30, 11, "400/Bad Request", 10, "The operation lasted too long: It took 2,724 milliseconds, but should not have lasted longer than 2,000 milliseconds.", 1, "", "", "", "", "", ""], "isController": false}, {"data": ["addFileToRepoRequest_tere12345678", 15, 1, "The operation lasted too long: It took 2,137 milliseconds, but should not have lasted longer than 2,000 milliseconds.", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["addNewBranch_tere12345678", 15, 1, "The operation lasted too long: It took 2,092 milliseconds, but should not have lasted longer than 2,000 milliseconds.", 1, "", "", "", "", "", "", "", ""], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
