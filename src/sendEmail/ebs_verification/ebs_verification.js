const { table_name } = require('./tableColumns');
const { ebs_verification } = require("../../models")
const odkCentral = require('../get-ebs-data');
const sendEmail = require('../get-ebs-data')

async function getVerificationData() {
    return new Promise(async(resolve, reject) => {
        await sendEmail.retrieveRecordsFromMysql(ebs_verification, table_name)
            .then(async(result) => {
                console.log(result);
            })
            .catch(err => {
                console.error(`Error: ${err} \n`);
                return reject(err);
            })
    })
}


module.exports = { getVerificationData };