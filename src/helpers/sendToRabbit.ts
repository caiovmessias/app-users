import RabbitmqServer from 'src/rabbitmq/server';

export async function sendToRabbit(message: string): Promise<void> {
  const server = new RabbitmqServer('amqp://admin:admin@rabbitmq:5672');
  await server.start();
  await server.publishInQueue('queue-users', message);
}
