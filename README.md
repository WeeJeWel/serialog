# serialog

A small utility to write a serial device's output to a log file with timestamps.

## Installation

```bash
npm install --global serialog
```

## Usage

```bash
serialog \
  --dev-path=/dev/ttyUSB0 \        # Path to input device
  --dev-baud=115200 \              # Baudrate
  --log-path="~/my_device.log" \   # Path to output file
  --log-append                     # Append to file, instead of overwriting
  ```

> Use in combination with [PM2](https://pm2.keymetrics.io) to keep monitoring for extended periods of times.