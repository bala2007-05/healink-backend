import mqtt from 'mqtt';

// Connect to MQTT broker
const brokerUrl = 'mqtt://broker.hivemq.com:1883';
const client = mqtt.connect(brokerUrl, {
  clientId: `healink-test-${Math.random().toString(16).substr(2, 8)}`,
  clean: true,
});

client.on('connect', () => {
  console.log('✅ Connected to MQTT broker');
  console.log('📤 Sending test telemetry data...\n');

  // Test device IDs
  const testDevices = ['DEV001', 'DEV002', 'DEV003'];

  // Send telemetry for each device
  testDevices.forEach((deviceId, index) => {
    setTimeout(() => {
      const telemetry = {
        dripRate: Math.floor(Math.random() * 30) + 10, // 10-40 drops/min
        flowStatus: ['flowing', 'stopped', 'blocked'][Math.floor(Math.random() * 3)],
        bottleLevel: Math.floor(Math.random() * 100), // 0-100%
        alert: Math.random() > 0.8 ? 'Low battery warning' : null,
        timestamp: new Date().toISOString(),
      };

      const topic = `healink/device/${deviceId}/telemetry`;
      const payload = JSON.stringify(telemetry);

      client.publish(topic, payload, (error) => {
        if (error) {
          console.error(`❌ Error publishing to ${topic}:`, error);
        } else {
          console.log(`✅ Published to ${topic}:`);
          console.log(`   ${JSON.stringify(telemetry, null, 2)}\n`);
        }
      });
    }, index * 1000); // Stagger messages by 1 second
  });

  // Send a few more messages after initial batch
  setTimeout(() => {
    console.log('\n📤 Sending additional telemetry updates...\n');
    
    const deviceId = 'DEV001';
    for (let i = 0; i < 3; i++) {
      setTimeout(() => {
        const telemetry = {
          dripRate: Math.floor(Math.random() * 30) + 10,
          flowStatus: 'flowing',
          bottleLevel: Math.max(0, 75 - i * 5), // Decreasing bottle level
          alert: i === 2 ? 'Bottle level low' : null,
          timestamp: new Date().toISOString(),
        };

        const topic = `healink/device/${deviceId}/telemetry`;
        client.publish(topic, JSON.stringify(telemetry), () => {
          console.log(`✅ Updated ${deviceId}: ${telemetry.bottleLevel}% remaining`);
        });
      }, i * 2000);
    }

    // Close connection after all messages
    setTimeout(() => {
      console.log('\n✅ Test complete! Closing connection...');
      client.end();
      process.exit(0);
    }, 10000);
  }, 5000);
});

client.on('error', (error) => {
  console.error('❌ MQTT Error:', error);
});

client.on('offline', () => {
  console.log('⚠️  MQTT Client offline');
});

