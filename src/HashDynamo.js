const { DynamoDBClient, GetItemCommand, PutItemCommand } = require("@aws-sdk/client-dynamodb");
const { marshall, unmarshall } = require("@aws-sdk/util-dynamodb");

class HashDynamo {

    constructor() {
        this.client = new DynamoDBClient({ region: process.env.AWS_REGION });
    }

    // Fetch hash for Lever "target" (URL path)
    async fetchHash(target) {
        const getParams = {
            TableName: process.env.DYNAMODB_TABLE,
            Key: marshall({
                target: target
            })
        }
        try {
            const data = await this.client.send(new GetItemCommand(getParams));
            return data.Item ? unmarshall(data.Item)["hash"] : null;
        } catch (e) {
            console.error(e);
        }
    }

    // Update stored hash
    async updateHash(target, hash) {
        const putParams = {
            TableName: process.env.DYNAMODB_TABLE,
            Item: marshall({
                target: target,
                hash: hash
            })
        }
        try {
            await this.client.send(new PutItemCommand(putParams));
        } catch (e) {
            console.error(e);
        }
    }
}

module.exports = new HashDynamo();