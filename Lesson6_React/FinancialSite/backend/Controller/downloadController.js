const con = require('../Model/connectMySQL')
const { Parser } = require('json2csv');
const iconv = require('iconv-lite');
const fs = require('fs');

function createCSV(path, data){
    const fields = Object.keys(data[0])
    const opts = { fields };

    const parser = new Parser(opts);
    const csv = parser.parse(data);
    var newCsv = iconv.encode(csv, 'BIG5');

    fs.writeFileSync(path, newCsv);

    return path
}

exports.single_financialData_download = function(req, res){
    const filename = req.query.filename;
    let sql = `SELECT stockNum FROM financialData WHERE filename='${filename}'`

    con.query(sql, function(err, result, field){
        if(err === null){
            res.download("/home/cosbi/桌面/financialData/gmailData/data/" + result[0].stockNum + "/" + filename)
        }
    });
};

exports.single_post_board_memo_download = function(req, res){
    res.download("/home/cosbi/桌面/financialData/post_board_data/" + req.query.filename)
};

exports.single_line_memo_download = function(req, res){
    res.download("/home/cosbi/桌面/financialData/lineMemo_data/" + req.query.filename)
};

exports.financialData2csv_download = function(req, res){
    con.query("select * from financialData", function(err, result, field){
        if(err === null){
            const path = createCSV('/home/cosbi/桌面/financialData/financialData.csv', result)
            res.download(path)
        }
    });
};

exports.post_board_memo2csv_download = function(req, res){
    con.query("select * from post_board_memo", function(err, result, field){
        if(err === null){
            const path = createCSV('/home/cosbi/桌面/financialData/post_board_memo.csv', result)
            res.download(path)
        }
    });
};

exports.lineMemo2csv_download = function(req, res){
    con.query("select * from lineMemo", function(err, result, field){
        if(err === null){
            const path = createCSV('/home/cosbi/桌面/financialData/lineMemo.csv', result)
            res.download(path)
        }
    });
};

exports.single_meetingData_memo_download = function(req, res){
    res.download("/home/cosbi/桌面/financialData/meeting_data/" + req.query.filename)
};

exports.single_industry_analysis_download = function(req, res){
    res.download("/home/cosbi/桌面/financialData/Industry_analysis/" + req.query.filename)
};

exports.single_twse_chPDF_download = function(req, res){
    const filename = req.query.filename;

    res.download("/home/cosbi/桌面/financialData/twseData/data/ch/" + filename.slice(0, 4) + "/" + filename)
};

exports.single_twse_enPDF_download = function(req, res){
    const filename = req.query.filename;

    res.download("/home/cosbi/桌面/financialData/twseData/data/en/" + filename.slice(0, 4) + "/" + filename)
};