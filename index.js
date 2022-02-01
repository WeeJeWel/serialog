#!/usr/bin/env node

'use strict';

const fs = require('fs');
const path = require('path');

const ArgsParser = require('args-parser');
const SerialPort = require('serialport');
const Readline = require('@serialport/parser-readline');

if (process.argv.length <= 2) {
  console.log(`Serialog: small utility to write a serial device's output to a log file with timestamps.

Usage: serialog \\
  --dev-path=/dev/ttyUSB0 \\        # Path to input device
  --dev-baud=115200 \\              # Baudrate
  --log-path="~/my_device.log" \\   # Path to output file
  --log-append                 \    # Append to file, instead of overwriting
  `);
  process.exit(0);
}

let {
  'dev-path': devPath,
  'dev-baud': devBaud = 115200,
  'log-path': logPath = 'serialog.log',
  'log-append': logAppend = false,
} = ArgsParser(process.argv);

if (!devPath || typeof devPath !== 'string') {
  throw new Error('Missing --dev-path');
}

if (!devBaud || typeof devBaud !== 'number') {
  throw new Error('Missing --dev-baud');
}

if (!logPath || typeof logPath !== 'string') {
  throw new Error('Missing --log-path');
}

if (typeof logAppend !== 'boolean') {
  throw new Error('Invalid --log-append');
}

// Replace ~/ with home dir
if (logPath.startsWith('~/')) {
  logPath = path.join(process.env.HOME, logPath.substring(2));
}

const writeStream = fs.createWriteStream(logPath, {
  flags: logAppend
    ? 'a' // append
    : 'w' // overwrite
});

const serialPort = new SerialPort(devPath, {
  baudRate: devBaud,
})
  .once('open', () => {
    console.log(`Logging ${devPath}@${devBaud} → ${logPath}`);
    const readLine = serialPort.pipe(new Readline())
    readLine.on('data', line => {
      const lineFormatted = `${new Date().toISOString()} ${line}\n`;

      // Write to console
      process.stdout.write(lineFormatted);

      // Write to file
      writeStream.write(lineFormatted);
    });
  })
  .once('error', err => {
    console.error(err.message);
    process.exit(1);
  });