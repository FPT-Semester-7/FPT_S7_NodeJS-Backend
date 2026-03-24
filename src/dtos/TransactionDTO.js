class TransactionDTO {
    constructor(transaction) {
        this.id = transaction._id;
        
        // Frontend expects amount to be a string starting with "+" or "-" and formatted
        const formattedAmount = (transaction.amount || 0).toLocaleString("vi-VN") + " VND";
        this.amount = transaction.type === "Refund" ? `-${formattedAmount}` : `+${formattedAmount}`;
        
        this.type = transaction.type;
        // Map status for frontend Wallet.jsx badges
        if (transaction.status === "Completed") {
            this.status = "Available";
        } else if (transaction.status === "Pending") {
            this.status = "Processing";
        } else {
            this.status = "Failed";
        }
        
        // Frontend expects "from" string to display the source
        this.from = transaction.transactionId || "MCHub Escrow";
        
        // Format the date string nicely for frontend display
        this.date = transaction.createdAt 
            ? new Date(transaction.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
            : "N/A";
    }
}

module.exports = TransactionDTO;
