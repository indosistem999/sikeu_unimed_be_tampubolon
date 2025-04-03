import amqplib, { Channel, Connection } from "amqplib";
import {Config as cfg} from '../constanta'
import { Logger } from "./logger";
export interface I_RabbitMQConfig {
  connection: Connection | any;
  channel: Channel | any;
  success: boolean;
}


export const rabbitMQClose = async (rmq: I_RabbitMQConfig): Promise<void> => {
  try {
    if (rmq.channel) {
      await rmq.channel.close();
      rmq.channel = null;
      Logger().info('RabbitMQ channel closed.');
    }
    if (rmq.connection) {
      await rmq.connection.close();
      rmq.connection = null;
      Logger().info('RabbitMQ connection closed.');
    }
  } catch (error) {
    Logger().error('Error during RabbitMQ shutdown:');
  }
}

export const rabbitMQConfig = async():Promise<I_RabbitMQConfig> => {
  try {
    const connection = await await amqplib.connect(cfg.RabbitMqUrl, 'heartbeat=60');
    Logger().info('Connect to RabbitMQ successfully');
    const channel = await connection.createChannel() as Channel;
    Logger().info('Create channel successfully');
    return {
      connection,
      channel,
      success: true
    }
  } catch (error: any) {
    Logger().info(error.message);
    return {
      connection: null,
      channel: null,
      success: false
    }
  }
}

export const publishMessage = async(
  exchangeName: string,
  queueName: string,
  data: Record<string, any>
):Promise<void> => {
  const rabbitmq = await rabbitMQConfig();

  try {
    if (!rabbitmq.channel) {
      Logger().info('RabbitMQ channel is not initialized. Call connect() first.');
      throw new Error('RabbitMQ channel is not initialized. Call connect() first.');
    }

    await (rabbitmq.channel as Channel)?.assertExchange(exchangeName, 'fanout', { durable: true });
    await (rabbitmq.channel as Channel)?.assertQueue(queueName, { durable: true });
    await (rabbitmq.channel as Channel)?.bindQueue(queueName, exchangeName, '');
    await (rabbitmq.channel as Channel)?.publish(exchangeName, '', Buffer.from(JSON.stringify(data)));

    Logger().info(
      `Success published to '${exchangeName}' exchange name and '${queueName}' queue name`
    );
  } catch (err: any) {
    Logger().error(
      `Error connection to '${exchangeName}' exchange name and '${queueName}' queue name`
    );
  } finally {
    console.info('Close RabbitMQ Connection')
    await rabbitMQClose(rabbitmq)
  }
}

export const subscribeMessage = async(
  exchangeName: string,
  queueName: string,
  callback: (exchangeName: string, queuName: string, msg: string) => void
): Promise<void> => {
  const rabbitmq = await rabbitMQConfig();
  try {
    if (!rabbitmq.channel) {
      throw new Error('RabbitMQ channel is not initialized. Call connect() first.');
    }

    // Assert exchange and queue
    await (rabbitmq.channel as Channel)?.assertExchange(exchangeName, 'fanout', { durable: true });
    await (rabbitmq.channel as Channel)?.assertQueue(queueName, { durable: true });
    await (rabbitmq.channel as Channel)?.bindQueue(queueName, exchangeName, '');
    await (rabbitmq.channel as Channel)?.prefetch(10);

    Logger().info(`Subscribed to exchange '${exchangeName}' with queue '${queueName}'`);

    // Start consuming messages
    (rabbitmq.channel as Channel).consume(queueName, (msg) => {
      if (msg) {
        try {
          const messageContent = msg.content.toString();
          Logger().info(`Received message from queue '${queueName}': ${messageContent}`);

          // Process the message
          callback(exchangeName, queueName, messageContent);

          // Acknowledge message after successful processing
          (rabbitmq?.channel as Channel).ack(msg);
        } catch (processingError) {
          Logger().error(
            `Error processing message from queue '${queueName}': ${processingError}`
          );
          // Optional: Dead-lettering or requeue logic can be added here
        }
      }
    });
  } catch (error: any) {
    Logger().error(
      `Error subscribing to queue '${queueName}' on exchange '${exchangeName}': ${error.message}`
    );
  } 
}