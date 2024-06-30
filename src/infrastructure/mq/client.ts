import { Channel, connect, Connection } from "amqplib";
import rabbitMQConfig from "../config/rabbitMq";
import Producer from "./producer";
import Consumer from "./consumer";

class RabbitMQClient {
    
    private static instance: RabbitMQClient;
    private connection: Connection | undefined;
    private producerChannel: Channel | undefined;
    private consumerChannel: Channel | undefined;
    private producer: Producer | undefined;
    private consumer: Consumer | undefined;
    private isInitialized = false;
    
    private constructor() {}
    
    public static getInstance() {
        if(!this.instance) {
            this.instance = new RabbitMQClient();
        }
        return this.instance;
    }
    
    async initialize() {
        if(!this.isInitialized) {
            return;
        }
        try {
            console.log("client inn");
            this.connection = await connect(rabbitMQConfig.rabbitMQ.url);
            [this.producerChannel, this.consumerChannel] = await Promise.all([
                this.connection.createChannel(),
                this.connection.createChannel()
            ]);

            await this.producerChannel.assertQueue(rabbitMQConfig.rabbitMQ.queues.postQueue, { durable:true });
            await this.consumerChannel.assertQueue(rabbitMQConfig.rabbitMQ.queues.postQueue, { durable:true });

            this.producer = new Producer(this.producerChannel);
            this.consumer = new Consumer(this.consumerChannel);
            await this.consumer.consumeMessage();

            this.isInitialized = true;
        } catch (error) {
            console.error("RabbitMQ error:", error);
        }
    }

    async produce(data: any, correlationId: string, replyToQueue: string) {
        if(!this.isInitialized) {
            await this.initialize();
        }

        return this.producer?.produceMessage(data, correlationId, replyToQueue);
    }
}

export default RabbitMQClient.getInstance();