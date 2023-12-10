import usersModel from "../models/usersModel.js";

export const getBidWinner = async (data) => {
    // pass bids Users Array 
    var amounts = [];

    for (let i = 0; i < data.length; i++) {
        const element = data[i];
        amounts.push(element.amount);
    }

    amounts.sort((a, b) => a - b);
    // console.log(amounts);

    var winnerAmount = null;

    var amLength = amounts.length - 1;

    for (let i = amLength; i >= 0; i--) {
        if (amLength == i) {
            if (amounts[i] != amounts[i - 1]) {
                winnerAmount = amounts[i];
                break;
            }
        } else if (i == 0) {
            if (amounts[i] != amounts[i + 1]) {
                winnerAmount = amounts[i];
                break;
            }
        } else {
            if (amounts[i] != amounts[i + 1] && amounts[i] != amounts[i - 1]) {
                winnerAmount = amounts[i];
                break;
            }
        }
    }

    var winner = null;

    if (winnerAmount != null) {
        for (let i = 0; i < data.length; i++) {
            const element = data[i];
            if (element.amount == winnerAmount) {
                const winnerData = await usersModel.findOne({ _id: element.user }, { pass: 0, verify: 0, cart: 0 });
                winner = { "amountData": element, "profile": winnerData }
                break;
            }
        }
    }

    return winner;
}
