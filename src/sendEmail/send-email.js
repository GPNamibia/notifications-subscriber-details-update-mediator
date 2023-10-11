const ebs_verification = require('./ebs_verification/ebs_verification');

async function getEbsData() {
    return new Promise(async(resolve, reject) => {
        try {
            await ebs_verification.getVerificationData()
                .then(async(res) => {
                    return resolve();
                })
                .catch((err) => { console.error(err) })
        } catch (error) {
            reject(`Error while retrieving data:${error} :🚫\n`)
        }
    }).catch(err => console.error(err));
}

module.exports = {
    getEbsData
};