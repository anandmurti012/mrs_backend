const connection = require("../database/db");

module.exports.transactions = (bookingId, type) => {
    try {

        // console.log('bookingId', bookingId)

        connection.query(`SELECT fees FROM  bookings WHERE bookingId=${bookingId}`, async (error1, results1) => {
            if (error1) {
                console.log(error1.sqlMessage);
            } else {
                if (results1.length > 0) {
                    connection.query("SELECT id, total FROM  transactions ORDER BY id DESC LIMIT 1", async (error, results) => {
                        if (error) {
                            console.log(error.sqlMessage);
                        } else {
                            if (results.length === 0) {
                                const newUsers = {
                                    type: type,
                                    amount: results1[0].fees,
                                    total: results1[0].fees,
                                    createdAt: new Date()
                                };

                                connection.query(`INSERT INTO transactions SET?`, newUsers, function (error, results, fields) {
                                    if (error) {
                                        console.log(error.sqlMessage);
                                    } else {
                                        console.log('Successfullly Save')
                                    }
                                });
                            } else {

                                const balance = results[0].total

                                // Update the existing transaction with the new balance
                                const transactionId = results[0].id;
                                connection.query(
                                    "UPDATE transactions SET amount = ?, type = ?, total = ?, createdAt = ? WHERE id = ?",
                                    [
                                        results1[0].fees,
                                        type,
                                        type === 'debit' ? parseInt(balance) - parseInt(results1[0].fees) : parseInt(balance) + parseInt(results1[0].fees),
                                        new Date(),
                                        transactionId
                                    ],
                                    (error3, updateResults) => {
                                        if (error3) {
                                            console.log("Error updating transaction:", error3.sqlMessage);
                                        } else {
                                            console.log("Transaction successfully updated with new balance:", newBalance);
                                        }
                                    }
                                );
                            }
                        }
                    });
                }
            }
        });
    } catch (error) {
        console.log('Backend Server Error', error);
    }
}