class TransactionDTO {
    constructor(transaction) {
        this.id = transaction._id;
        this.amount = transaction.amount;
        this.type = transaction.type;
        this.status = transaction.status;
        this.description = transaction.description;
        this.date = transaction.createdAt;
    }
}

module.exports = TransactionDTO;
