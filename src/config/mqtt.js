import mqtt from 'mqtt';

let mqttClient = null;

const connectMQTT = () => {
  const brokerUrl = process.env.MQTT_BROKER || 'mqtt://broker.hivemq.com:1883';
  
  mqttClient = mqtt.connect(brokerUrl, {
    clientId: `healink-backend-${Math.random().toString(16).substr(2, 8)}`,
    clean: true,
    reconnectPeriod: 1000,
  });

  mqttClient.on('connect', () => {
    console.log('MQTT Broker Connected');
    
    // Subscribe to telemetry topics
    mqttClient.subscribe('healink/device/+/telemetry', (err) => {
      if (err) {
        console.error('Error subscribing to telemetry:', err);
      } else {
        console.log('Subscribed to: healink/device/+/telemetry');
      }
    });
  });

  mqttClient.on('error', (error) => {
    console.error('MQTT Error:', error);
  });

  mqttClient.on('offline', () => {
    console.log('MQTT Client offline');
  });

  mqttClient.on('reconnect', () => {
    console.log('MQTT Reconnecting...');
  });

  return mqttClient;
};

const getMQTTClient = () => {
  return mqttClient;
};

export { connectMQTT, getMQTTClient };
