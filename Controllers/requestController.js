const db = require('../.config');

exports.requests = (req, res) => {
    const sql = "SELECT * FROM requests";
    db.query(sql, (err, result) => {
        if(err){
            console.log(err);
            res.status(500).send({msg: "Internal Server Error"});
        }
        res.status(200).send(result);
    });
}

exports.createRequests = (req , res) => {
    const {dorm , phone} = req.body;
    const sql = "insert into requests set ?";
    db.query(sql , {dorm , phone} , (err , result) =>{
        if(err){
            return res.status(500).send({msg:"Internal Server Error"});
        }
        res.status(200).send({msg:"Request created successfully"});
        if(!dorm){
            return res.status(400).send({msg:"Dorm is required"});
        }
    })
}