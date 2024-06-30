import { Channel, ConsumeMessage } from "amqplib";
import MessageHandler from './messageHandler';
import rabbitMQConfig from "../config/rabbitMq";

export default class Consumer {
    constructor(private channel: Channel) {}

    async consumeMessage() {
        console.log("Ready to consume message");
        await this.channel.assertQueue(rabbitMQConfig.rabbitMQ.queues.postQueue, { durable: true });
        this.channel.consume(rabbitMQConfig.rabbitMQ.queues.postQueue, async (message: ConsumeMessage | null) => {
            if (message) {
                const { correlationId, replyTo } = message.properties;
                const operation = message.properties.headers?.function;

                if (message.content) {
                    const data = JSON.parse(message.content.toString());
                    await MessageHandler.handle(operation, data, correlationId, replyTo);
                }
            }
        }, { noAck: true });
    }
}
