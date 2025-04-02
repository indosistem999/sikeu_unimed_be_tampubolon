import amqplib, { Connection, Channel } from 'amqplib';
import { Config as cfg } from '../constanta';
import { Logger } from './logger';

class RabbitMQConfig {
  private connection: Connection | any;
  private channel: Channel | any;
  private readonly url: string;

  constructor(url: string) {
    this.url = url;
  }

  async connect(): Promise<void> {
    try {
      this.connection = await amqplib.connect(this.url, 'heartbeat=60');
      Logger().info('Connect to RabbitMQ successfully');

      this.channel = (await this.connection.createChannel()) as Channel;
      Logger().info('Create channel successfully');
    } catch (error: any) {
      this.connection = null;
      this.channel = null;
      Logger().info(error.message);
    }
  }

  async publishMessage(
    exchangeName: string,
    queueName: string,
    data: Record<string, any>
  ): Promise<void> {
    try {
      if (!this.channel) {
        Logger().info('RabbitMQ channel is not initialized. Call connect() first.');
        throw new Error('RabbitMQ channel is not initialized. Call connect() first.');
      }

      await (this.channel as Channel)?.assertExchange(exchangeName, 'fanout', { durable: true });
      await (this.channel as Channel)?.assertQueue(queueName, { durable: true });
      await (this.channel as Channel)?.bindQueue(queueName, exchangeName, '');
      await (this.channel as Channel)?.publish(exchangeName, '', Buffer.from(JSON.stringify(data)));

      Logger().info(
        `Success published to '${exchangeName}' exchange name and '${queueName}' queue name`
      );
    } catch (err: any) {
      Logger().error(
        `Error connection to '${exchangeName}' exchange name and '${queueName}' queue name`
      );
    }
  }

  async subscribeMessage(
    exchangeName: string,
    queueName: string,
    callback: (exchangeName: string, queuName: string, msg: string) => void
  ): Promise<void> {
    try {
      if (!this.channel) {
        throw new Error('RabbitMQ channel is not initialized. Call connect() first.');
      }

      // Assert exchange and queue
      await (this.channel as Channel)?.assertExchange(exchangeName, 'fanout', { durable: true });
      await (this.channel as Channel)?.assertQueue(queueName, { durable: true });
      await (this.channel as Channel)?.bindQueue(queueName, exchangeName, '');
      await (this.channel as Channel)?.prefetch(10);

      Logger().info(`Subscribed to exchange '${exchangeName}' with queue '${queueName}'`);

      // Start consuming messages
      (this.channel as Channel).consume(queueName, (msg) => {
        if (msg) {
          try {
            const messageContent = msg.content.toString();
            Logger().info(`Received message from queue '${queueName}': ${messageContent}`);

            // Process the message
            callback(exchangeName, queueName, messageContent);

            // Acknowledge message after successful processing
            this.channel.ack(msg);
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

  async close(): Promise<void> {
    try {
      if (this.channel) {
        await this.channel.close();
        this.channel = null;
        Logger().info('RabbitMQ channel closed.');
      }
      if (this.connection) {
        await this.connection.close();
        this.connection = null;
        Logger().info('RabbitMQ connection closed.');
      }
    } catch (error) {
      Logger().error('Error during RabbitMQ shutdown:');
    }
  }
}

export const rabbitMqConfig = new RabbitMQConfig(cfg.RabbitMqUrl);
